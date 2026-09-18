const ApiError = require("../utils/ApiError");

/**
 * Extract text from a PDF buffer.
 *
 * Uses unpdf's serverless PDF.js build, which is suitable
 * for Node.js and serverless environments such as Vercel.
 *
 * @param {Buffer} buffer - PDF file buffer
 * @returns {Promise<{text: string, meta: {numPages: number}}>}
 */
async function extractText(buffer) {
  let pdf;

  try {
    if (!Buffer.isBuffer(buffer)) {
      throw ApiError.badRequest("Invalid PDF data.");
    }

    if (!buffer.length) {
      throw ApiError.badRequest("The uploaded PDF is empty.");
    }

    // unpdf is ESM, while this backend uses CommonJS.
    // Dynamic import lets us use unpdf without converting
    // the entire backend to ESM.
    const { getDocumentProxy, extractText: extractPdfText } =
      await import("unpdf");

    // Convert Node.js Buffer to Uint8Array for PDF.js.
    const data = new Uint8Array(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength,
    );

    // Load the PDF document.
    pdf = await getDocumentProxy(data);

    // Extract text from all pages and merge it into one string.
    const result = await extractPdfText(pdf, {
      mergePages: true,
    });

    const text = (result.text || "").trim();

    // Reject empty or almost-empty PDFs.
    if (!text || text.length < 50) {
      throw ApiError.badRequest(
        "Could not extract readable text. Is this a scanned/image-only PDF?",
      );
    }

    return {
      text,
      meta: {
        numPages: result.totalPages ?? null,
      },
    };
  } catch (err) {
    // Preserve your application's operational errors.
    if (err.isOperational) {
      throw err;
    }

    console.error("PDF extraction error:", err);

    throw ApiError.badRequest(
      "Failed to parse PDF: " + (err.message || "Unknown PDF error"),
    );
  } finally {
    // Release PDF.js resources.
    try {
      await pdf?.destroy?.();
    } catch {
      // Ignore cleanup errors.
    }
  }
}

module.exports = {
  extractText,
};