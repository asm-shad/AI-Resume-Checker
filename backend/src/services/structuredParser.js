const { GoogleGenAI, Type } = require("@google/genai");
const { z } = require("zod");

const env = require("../config/env");

// ============================================================
// Gemini Client
// ============================================================

const ai = env.geminiApiKey
  ? new GoogleGenAI({
      apiKey: env.geminiApiKey,
    })
  : null;

// ============================================================
// Link Schema
// ============================================================

const linkSchema = {
  type: Type.OBJECT,
  required: ["label", "url"],
  properties: {
    label: {
      type: Type.STRING,
    },
    url: {
      type: Type.STRING,
    },
  },
};

// ============================================================
// Gemini Response Schema
// ============================================================

const responseSchema = {
  type: Type.OBJECT,

  required: [
    "basics",
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
    "languages",
    "interests",
  ],

  properties: {
    // --------------------------------------------------------
    // Basics
    // --------------------------------------------------------

    basics: {
      type: Type.OBJECT,

      required: [
        "name",
        "title",
        "location",
        "email",
        "phone",
        "links",
      ],

      properties: {
        name: {
          type: Type.STRING,
        },

        title: {
          type: Type.STRING,
        },

        location: {
          type: Type.STRING,
        },

        email: {
          type: Type.STRING,
        },

        phone: {
          type: Type.STRING,
        },

        links: {
          type: Type.ARRAY,
          items: linkSchema,
        },
      },
    },

    // --------------------------------------------------------
    // Summary
    // --------------------------------------------------------

    summary: {
      type: Type.STRING,
    },

    // --------------------------------------------------------
    // Experience
    // --------------------------------------------------------

    experience: {
      type: Type.ARRAY,

      items: {
        type: Type.OBJECT,

        required: [
          "company",
          "role",
          "period",
          "bullets",
        ],

        properties: {
          company: {
            type: Type.STRING,
          },

          role: {
            type: Type.STRING,
          },

          location: {
            type: Type.STRING,
          },

          period: {
            type: Type.STRING,
          },

          bullets: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },
        },
      },
    },

    // --------------------------------------------------------
    // Education
    // --------------------------------------------------------

    education: {
      type: Type.ARRAY,

      items: {
        type: Type.OBJECT,

        required: [
          "degree",
          "school",
          "period",
        ],

        properties: {
          degree: {
            type: Type.STRING,
          },

          school: {
            type: Type.STRING,
          },

          location: {
            type: Type.STRING,
          },

          period: {
            type: Type.STRING,
          },

          details: {
            type: Type.STRING,
          },
        },
      },
    },

    // --------------------------------------------------------
    // Skills
    // --------------------------------------------------------

    skills: {
      type: Type.ARRAY,

      items: {
        type: Type.STRING,
      },
    },

    // --------------------------------------------------------
    // Projects
    // --------------------------------------------------------

    projects: {
      type: Type.ARRAY,

      items: {
        type: Type.OBJECT,

        required: [
          "name",
          "description",
        ],

        properties: {
          name: {
            type: Type.STRING,
          },

          description: {
            type: Type.STRING,
          },

          tech: {
            type: Type.ARRAY,

            items: {
              type: Type.STRING,
            },
          },

          links: {
            type: Type.ARRAY,
            items: linkSchema,
          },
        },
      },
    },

    // --------------------------------------------------------
    // Certifications
    // --------------------------------------------------------

    certifications: {
      type: Type.ARRAY,

      items: {
        type: Type.OBJECT,

        required: ["name"],

        properties: {
          name: {
            type: Type.STRING,
          },

          issuer: {
            type: Type.STRING,
          },

          year: {
            type: Type.STRING,
          },
        },
      },
    },

    // --------------------------------------------------------
    // Languages
    // --------------------------------------------------------

    languages: {
      type: Type.ARRAY,

      items: {
        type: Type.STRING,
      },
    },

    // --------------------------------------------------------
    // Interests
    // --------------------------------------------------------

    interests: {
      type: Type.ARRAY,

      items: {
        type: Type.STRING,
      },
    },
  },
};

// ============================================================
// Zod Validator
// ============================================================

const validator = z.object({
  basics: z
    .object({
      name: z.string().default(""),
      title: z.string().default(""),
      location: z.string().default(""),
      email: z.string().default(""),
      phone: z.string().default(""),

      links: z
        .array(
          z.object({
            label: z.string(),
            url: z.string(),
          }),
        )
        .default([]),
    })
    .default({
      name: "",
      title: "",
      location: "",
      email: "",
      phone: "",
      links: [],
    }),

  summary: z.string().default(""),

  experience: z
    .array(
      z.object({
        company: z.string().default(""),
        role: z.string().default(""),
        location: z.string().default(""),
        period: z.string().default(""),
        bullets: z.array(z.string()).default([]),
      }),
    )
    .default([]),

  education: z
    .array(
      z.object({
        degree: z.string().default(""),
        school: z.string().default(""),
        location: z.string().default(""),
        period: z.string().default(""),
        details: z.string().default(""),
      }),
    )
    .default([]),

  skills: z.array(z.string()).default([]),

  projects: z
    .array(
      z.object({
        name: z.string().default(""),
        description: z.string().default(""),

        tech: z.array(z.string()).default([]),

        links: z
          .array(
            z.object({
              label: z.string(),
              url: z.string(),
            }),
          )
          .default([]),
      }),
    )
    .default([]),

  certifications: z
    .array(
      z.object({
        name: z.string().default(""),
        issuer: z.string().default(""),
        year: z.string().default(""),
      }),
    )
    .default([]),

  languages: z.array(z.string()).default([]),

  interests: z.array(z.string()).default([]),
});

// ============================================================
// Build Prompt
// ============================================================

function buildPrompt(rawText) {
  return [
    "You are a resume parser.",
    "The input is text extracted from a PDF.",
    "Lines may be jumbled or in an unnatural reading order.",

    "",
    "Extract structured data from the resume.",

    "",
    "basics:",
    "- Extract name.",
    "- Extract professional title.",
    "- Extract location.",
    "- Extract email.",
    "- Extract phone.",
    "- Extract social links such as LinkedIn, GitHub, portfolio, etc.",
    "- Give each link a clear label.",

    "",
    "summary:",
    "- Extract the professional summary.",
    "- Rejoin the summary if it is split across multiple lines.",

    "",
    "experience:",
    "- List jobs from most recent to oldest.",
    "- Extract company, role, period, location if available, and bullet points.",
    "- Preserve the original date format.",

    "",
    "education:",
    "- Extract degree, school, period, location, and optional details.",

    "",
    "skills:",
    "- Return a flat array of technical skills.",

    "",
    "projects:",
    "- Extract project name.",
    "- Create a one-sentence description based only on the resume.",
    "- Extract technology tags when clearly available.",
    "- Extract project links when available.",

    "",
    "certifications:",
    "- Extract certification name, issuer, and year.",

    "",
    "languages:",
    "- Return a flat array of languages.",

    "",
    "interests:",
    "- Return a flat array of interests.",

    "",
    "Rules:",
    "- Be conservative.",
    "- Do not invent information.",
    "- Omit information that is not clearly present.",
    "- Use empty strings or arrays when information is missing.",
    "- Extract information verbatim where possible.",
    "- Do not unnecessarily paraphrase the resume.",
    "- Each experience bullet should be a complete sentence.",
    "- Preserve original date formats, such as 'Jan 2022 - Dec 2023'.",

    "",
    "RESUME TEXT:",
    rawText,
  ].join("\n");
}

// ============================================================
// Empty Resume
// ============================================================

const EMPTY = {
  basics: {
    name: "",
    title: "",
    location: "",
    email: "",
    phone: "",
    links: [],
  },

  summary: "",

  experience: [],

  education: [],

  skills: [],

  projects: [],

  certifications: [],

  languages: [],

  interests: [],
};

// ============================================================
// Parse Resume
// ============================================================

async function parseResume(rawText) {
  // No Gemini client or no resume text
  if (!ai || !rawText?.trim()) {
    return EMPTY;
  }

  const prompt = buildPrompt(rawText);

  // Try up to 2 times
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const result = await ai.models.generateContent({
        model: env.geminiModel,

        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],

        config: {
          responseMimeType: "application/json",
          responseSchema,
          temperature: 0.1,
        },
      });

      const text =
        typeof result.text === "function"
          ? result.text()
          : result.text;

      if (!text) {
        throw new Error("Empty response");
      }

      // Convert Gemini JSON string into JavaScript object
      const parsed = JSON.parse(text);

      // Validate the parsed data using Zod
      return validator.parse(parsed);
    } catch (err) {
      if (attempt === 2) {
        console.error(
          "Structured parse failed:",
          err.message,
        );

        return EMPTY;
      }
    }
  }

  return EMPTY;
}

// ============================================================
// Export
// ============================================================

module.exports = {
  parseResume,
};
