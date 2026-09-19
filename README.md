# AI Resume Roaster

An AI-powered resume analysis and ATS optimization platform that helps users understand how their resume performs against ATS-style criteria, identify weaknesses, improve resume bullets, and manage multiple resume versions.

## 🚀 Live Demo

**Frontend:**
https://ai-resume-checker-frontend-seven.vercel.app/

> The live application is currently deployed on Vercel.

---

## ✨ Features

- 📄 Upload resumes as PDF files
- 🤖 AI-powered resume parsing using Google Gemini
- 📊 ATS score from 0–100
- 📈 ATS score breakdown:
  - Keywords
  - Formatting
  - Impact
  - Clarity

- 🔍 Identify resume issues and weaknesses
- 💡 Identify resume strengths
- ✍️ AI-powered bullet-point rewrites
- 🔑 Identify present and missing keywords
- 📝 Create multiple resume versions
- 🔄 Track changes between resume versions
- 📊 Dashboard with resume analytics
- 📈 Resume score evolution
- 🧠 Insights and performance statistics
- 🕒 Resume activity/history
- 🔐 JWT-based authentication
- 🍪 HTTP cookie-based authentication
- 🗑️ Delete resumes
- 📥 Export-ready resume workflow

---

# 🏗️ Architecture

The project is divided into two applications:

```text
AI Resume Roaster
│
├── backend/
│   ├── Express.js
│   ├── MongoDB / Mongoose
│   ├── Google Gemini
│   ├── JWT Authentication
│   ├── PDF Processing
│   └── REST API
│
└── frontend/
    ├── React
    ├── Vite
    ├── React Router
    ├── TanStack Query
    ├── Tailwind CSS
    └── Recharts
```

---

# 🔄 Application Flow

```text
User
 │
 ▼
Upload Resume PDF
 │
 ▼
PDF Text Extraction
 │
 ▼
Gemini Resume Parsing
 │
 ▼
Structured Resume Data
 │
 ▼
Create Resume Version 1
 │
 ▼
AI ATS Analysis
 │
 ├── ATS Score
 ├── Score Breakdown
 ├── Issues
 ├── Strengths
 ├── Missing Keywords
 └── Bullet Rewrites
 │
 ▼
User Reviews Results
 │
 ▼
Create Improved Versions
 │
 ▼
Compare Versions
```

---

# 🛠️ Tech Stack

## Frontend

- React 19
- Vite
- React Router
- TanStack Query
- Axios
- Tailwind CSS
- Framer Motion
- Recharts
- React Dropzone
- Lucide React
- React PDF Renderer

## Backend

- Node.js 20+
- Express 5
- MongoDB
- Mongoose
- Google Gemini API
- Zod
- JWT
- bcrypt
- Multer
- PDF parsing
- express-rate-limit
- CORS
- Morgan

---

# 📁 Project Structure

```text
AI Resume Roaster/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── env.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   ├── rateLimit.js
│   │   │   ├── upload.js
│   │   │   └── validate.js
│   │   │
│   │   ├── models/
│   │   │   ├── Analysis.js
│   │   │   ├── Resume.js
│   │   │   ├── ResumeVersion.js
│   │   │   └── User.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── dashboard.js
│   │   │   ├── health.js
│   │   │   ├── history.js
│   │   │   ├── insights.js
│   │   │   ├── resumes.js
│   │   │   └── versions.js
│   │   │
│   │   ├── services/
│   │   │   ├── geminiService.js
│   │   │   ├── pdfService.js
│   │   │   └── structuredParser.js
│   │   │
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   └── asyncHandler.js
│   │   │
│   │   └── server.js
│   │
│   ├── scripts/
│   │   └── seed.js
│   │
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── hooks/
    │   ├── layouts/
    │   ├── pages/
    │   ├── services/
    │   ├── context/
    │   ├── router/
    │   └── main.jsx
    │
    ├── package.json
    └── vite.config.js
```

---

# 🔐 Environment Variables

The backend currently loads the `.env` file from the **project root**.

Example:

```text
AI Resume Roaster/
├── .env
├── backend/
└── frontend/
```

Create a `.env` file in the project root:

```env
NODE_ENV=development

PORT=5000

MONGODB_URI=mongodb://127.0.0.1:27017/AIResumeRoaster

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
COOKIE_NAME=arr_token

CLIENT_ORIGIN=http://localhost:5173,http://localhost:5174

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

### Production

For the deployed frontend, the production origin is:

```env
CLIENT_ORIGIN=https://ai-resume-checker-frontend-seven.vercel.app
```

Do **not** commit `.env` or API keys to GitHub.

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone <your-repository-url>
cd <project-folder>
```

---

## 2. Install backend dependencies

```bash
cd backend
npm install
```

---

## 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

---

## 4. Configure environment variables

Create the root `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
GEMINI_API_KEY=your_gemini_api_key
```

Add the remaining configuration values shown above if needed.

---

## 5. Start the backend

From the `backend` directory:

```bash
npm run dev
```

The API runs by default at:

```text
http://localhost:5000
```

---

## 6. Start the frontend

From the `frontend` directory:

```bash
npm run dev
```

The frontend normally runs at:

```text
http://localhost:5173
```

---

# 🌐 Live Application

The production frontend is available at:

**https://ai-resume-checker-frontend-seven.vercel.app/**

The application can be used to:

1. Register an account
2. Log in
3. Upload a resume
4. View the parsed resume
5. Run AI analysis
6. Review the ATS score
7. Review issues and strengths
8. Review missing keywords
9. Generate improved bullet points
10. Create new resume versions
11. Compare resume versions
12. Review dashboard insights and history

---

# 🧭 Frontend Routes

| Route                 | Description      |
| --------------------- | ---------------- |
| `/`                   | Landing page     |
| `/login`              | Login            |
| `/register`           | Registration     |
| `/dashboard`          | Main dashboard   |
| `/resumes`            | Resume list      |
| `/resumes/:id`        | Resume details   |
| `/resumes/:id/export` | Resume export    |
| `/insights`           | Resume analytics |
| `/versions`           | Version history  |
| `/history`            | Activity history |
| `/settings`           | User settings    |

Protected pages require authentication.

---

# 🔌 API Endpoints

## Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
PATCH  /api/auth/profile
PATCH  /api/auth/password
```

## Health

```text
GET    /api/health
```

## Resumes

```text
POST   /api/resumes
GET    /api/resumes
GET    /api/resumes/:id
DELETE /api/resumes/:id
```

## Resume Versions

```text
GET    /api/resumes/:id/versions/:versionId
```

## Analysis

```text
POST   /api/resumes/:id/analyze
GET    /api/resumes/:id/analyses
GET    /api/resumes/:id/versions/:versionId/analysis
```

## Rewriting

```text
POST   /api/resumes/:id/rewrite
```

## Version Diff

```text
GET    /api/resumes/:id/diff
```

Example:

```text
GET /api/resumes/123/diff?from=version1&to=version2&mode=words
```

Supported modes:

```text
words
lines
```

## Dashboard

```text
GET    /api/dashboard
```

## Insights

```text
GET    /api/insights
```

## Versions

```text
GET    /api/versions
```

## History

```text
GET    /api/history
```

---

# 🤖 AI Resume Analysis

The application uses Google Gemini to analyze uploaded resumes.

The analysis produces:

### ATS Score

A score between:

```text
0 → 100
```

### Score Breakdown

```text
Keywords
Formatting
Impact
Clarity
```

Each category contributes up to 25 points.

### Issues

The AI identifies prioritized resume problems and provides:

```text
Title
Severity
Explanation
Suggested Fix
```

### Strengths

The system identifies strong parts of the resume and provides supporting evidence.

### Keyword Analysis

The system identifies:

```text
Keywords Present
Keywords Missing
```

### Bullet Rewrites

Weak resume bullets can be rewritten while preserving the original meaning and available evidence.

The system is instructed not to invent experience, achievements, technologies, or metrics that are not supported by the resume.

---

# 📝 Resume Versioning

Every uploaded resume starts with a version.

Example:

```text
Resume
│
├── V1 — Original Upload
│
├── V2 — Improved Experience Bullets
│
├── V3 — Keyword Optimization
│
└── V4 — Final Version
```

Each version can contain:

- Raw resume text
- Structured resume data
- Version number
- Label
- Source type
- Parent version
- Analysis reference
- Creation date

This allows users to maintain multiple iterations of the same resume.

---

# 🔄 Resume Diff

The application can compare two resume versions.

Example:

```text
V1 → V2
```

The API returns added, removed, and unchanged text sections.

Supported comparison modes:

```text
Word-based
Line-based
```

This makes it easier to see exactly what changed between resume versions.

---

# 📊 Dashboard

The dashboard provides an overview of resume performance.

It includes:

- Current ATS score
- Number of resume versions
- Issues identified
- Keywords matched
- Score evolution
- ATS gauge
- Recent activity
- Version history
- Resume profile information

---

# 📈 Insights

The Insights section provides aggregated information across analyzed resumes.

It can show:

- Average ATS score
- Best recorded score
- Score trends
- Most common issues
- Missing keywords
- Present keywords
- Resume performance
- Improvement between initial and latest analysis

---

# 🕒 History

The History section tracks important resume activity.

Examples:

```text
Resume uploaded
Resume analyzed
Resume rewritten
New version created
```

Events are sorted from newest to oldest.

---

# 🗃️ Data Model

The main MongoDB collections are:

```text
User
 │
 ├── Resume
 │     │
 │     ├── ResumeVersion
 │     │       │
 │     │       └── Analysis
 │     │
 │     └── ResumeVersion
 │
 └── ...
```

### User

Stores authentication and profile information.

### Resume

Represents the user's resume and tracks the current/latest version.

### ResumeVersion

Stores individual versions of a resume.

### Analysis

Stores ATS scores, issues, strengths, keyword information, and AI rewrites.

---

# 🔒 Security

The backend includes several security-related mechanisms:

- Password hashing with bcrypt
- JWT authentication
- HTTP-only authentication cookies
- Protected API routes
- Request validation using Zod
- PDF-only upload validation
- 5 MB upload limit
- Authentication rate limiting
- Analysis rate limiting
- User-owned resource checks
- Environment-based secrets

API keys and database credentials should always remain in environment variables.

---

# 🧪 Development Commands

## Backend

```bash
npm run dev
```

Production:

```bash
npm start
```

Seed:

```bash
npm run seed
```

## Frontend

Development:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Preview:

```bash
npm run preview
```

Lint:

```bash
npm run lint
```

---

# 🚧 Future Improvements

Possible future improvements include:

- Job description matching
- Job-specific ATS analysis
- More advanced keyword recommendations
- Resume templates
- PDF resume generation
- Resume sharing
- More detailed analytics
- LinkedIn profile analysis
- Multiple AI model support
- Better OCR support for scanned PDFs
- Automated resume tailoring for specific job descriptions
- Production monitoring and analytics

---

# 📌 Project Status

The application currently includes the core workflow:

```text
Authentication
      ↓
Resume Upload
      ↓
PDF Parsing
      ↓
AI Resume Structuring
      ↓
ATS Analysis
      ↓
Issues + Strengths
      ↓
Keyword Analysis
      ↓
AI Bullet Rewrites
      ↓
Resume Versioning
      ↓
Version Diff
      ↓
Dashboard
      ↓
Insights + History
```

The frontend is deployed and available here:

**https://ai-resume-checker-frontend-seven.vercel.app/**

---

# 📄 License

This project is currently a personal/portfolio project.

If you decide to open-source it, add the appropriate license here, for example:

```text
MIT License
```

---

## 👨‍💻 Author

**ASM Shad**

Full-stack developer working with:

```text
JavaScript
TypeScript
React
Next.js
Node.js
Express
MongoDB
PostgreSQL
Laravel
AI / LLM Applications
```
