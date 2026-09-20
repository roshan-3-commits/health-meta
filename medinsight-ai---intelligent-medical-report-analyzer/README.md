# MedInsight AI — Intelligent Clinical Laboratory Diagnostic Platform

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC.svg)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-3.8%20Flash-4285F4.svg)](https://aistudio.google.com/)

An enterprise-grade, clinical decision-support application that ingests pathology reports, standardizes biological reference intervals (CLSI/IFCC), maps LOINC codes, and translates complex medical biomarkers into actionable, plain-language patient insights.

---

## Quick Deploy Options (100% Free & Fast)

### Option 1: Deploy to Vercel (Recommended — 1-Click)
1. Push this repository to your **GitHub** account.
2. Go to [vercel.com](https://vercel.com) and log in with your GitHub.
3. Click **"Add New Project"** and select your `medinsight-ai` repository.
4. *(Optional)* Add the Environment Variable:
   - Key: `GEMINI_API_KEY`
   - Value: `your_gemini_api_key_here` (See below for how to get one)
5. Click **"Deploy"**. Your live link (e.g., `https://your-project.vercel.app`) will be ready in under 60 seconds!

---

### Option 2: Deploy to Render / Railway / Google Cloud Run (Full-Stack)
This project includes a bundled Express + Vite server (`server.ts`):
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Port**: `3000`
- **Environment Variables**: `GEMINI_API_KEY`

---

### Option 3: Deploy to GitHub Pages (Static Hosting)
1. In your GitHub repository, go to **Settings** > **Pages**.
2. Under **Build and deployment**, set Source to **GitHub Actions**.
3. The app includes a zero-dependency client-side clinical fallback engine (`clinicalRules.ts`), ensuring 100% functionality even on pure static hosts!

---

## Getting Your Free Google Gemini API Key

This project uses Google's latest Gemini models for multimodal medical OCR and pathology analysis.

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account.
3. Click **"Create API Key"** (It is free with standard tier limits).
4. Copy your key (starts with `AIzaSy...`).

### How to use it:

#### In Local Development:
1. Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=AIzaSyYourGeneratedKeyHere
   ```
2. Run `npm run dev`.

#### In Production (Vercel / Render / Cloud Run):
Add `GEMINI_API_KEY` into your host's **Environment Variables** settings panel.

> **Zero-Crash Resilience**: If no API key is provided or if network limits are reached, MedInsight AI automatically engages its built-in clinical rule engine with 150+ validated biological reference ranges. The website will **never crash** or show broken states to visitors.

---

## Local Development

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or bun

### Setup Steps
```bash
# 1. Clone the repository
git clone https://github.com/your-username/medinsight-ai.git
cd medinsight-ai

# 2. Install dependencies
npm install

# 3. Create .env file with your key (optional)
cp .env.example .env

# 4. Start local development server
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

---

## Production Build & Verification

```bash
# Run TypeScript compilation check
npm run lint

# Compile production bundle
npm run build

# Test production server locally
npm start
```

---

## Key Features

- **Multimodal Medical Report Parser**: Supports image upload (JPEG, PNG), PDF documents, and direct clinical text pasting.
- **CLSI / IFCC Biological Reference Database**: Over 150+ clinical parameters across Hematology, Biochemistry, Lipid Profile, Thyroid, Renal & Hepatic function.
- **HL7 FHIR Interoperability**: Instant conversion of laboratory results into FHIR R4 `DiagnosticReport` and `Observation` JSON bundles.
- **Cryptographic Audit Trail**: Every analyzed specimen produces a SHA-256 tamper-evident integrity hash with verification timestamps.
- **Clinical PDF Generation**: One-click professional vector PDF download of laboratory reports with custom hospital header branding.
- **Dark Mode & Responsive UI**: Calibrated Palette 1 medical styling with WCAG AA compliance.

---

## Project Structure

```
├── server.ts               # Express backend API & Vite SSR middleware proxy
├── src/
│   ├── components/         # Modular clinical UI components
│   │   ├── DashboardView.tsx   # Primary laboratory intelligence overview
│   │   ├── UploadView.tsx      # Multi-source document uploader with fallback
│   │   ├── ReportView.tsx      # Comprehensive biomarker cards & explanations
│   │   ├── HistoryView.tsx     # Historical patient records & comparison
│   │   ├── Header.tsx          # Navigation header with active patient session
│   │   ├── DeveloperInfo.tsx   # Academic profile & project specifications
│   │   └── ...
│   ├── data/               # CLSI reference ranges & sample patient reports
│   ├── utils/              # Clinical rules engine, PDF generator, FHIR exporter
│   ├── types.ts            # Medical biomarker & patient TypeScript definitions
│   └── App.tsx             # Main routing & application state coordinator
├── vercel.json             # 1-Click Vercel deployment configuration
├── vite.config.ts          # Vite build config with Tailwind CSS plugin
└── package.json            # Scripts, dependencies, and project metadata
```

---

## Medical Disclaimer

MedInsight AI is an informational clinical decision support and health-literacy application designed for education, documentation standardization, and preliminary clinical triage. It does not replace diagnostic judgment by a licensed physician or medical pathologist.
