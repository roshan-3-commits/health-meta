import React from 'react';
import { 
  Layers, 
  Workflow, 
  Database, 
  Cpu, 
  FileSearch, 
  ShieldCheck, 
  Code2, 
  CheckCircle2, 
  ArrowRight,
  GitBranch,
  Server,
  Sparkles
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div id="architecture-view-container" className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Title */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <Workflow className="w-3.5 h-3.5 text-emerald-600" />
          <span>System Blueprint & Architecture Specification</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          MedInsight AI — Engineering Architecture & Workflow
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          Designed according to modern healthcare informatics and laboratory information system (LIS) standards: converting raw, unstructured diagnostic reports into validated numerical biomarkers, clinically grounded status classifications, and patient-first medical translations.
        </p>
      </div>

      {/* Problem Statement & Objectives (From Image 2 Mindmap) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Problem Statement */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-slate-900 pb-2 border-b border-slate-100">
            <div className="w-6 h-6 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h3 className="text-sm font-bold">Problem Statement</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
              <span><strong>Complex Jargon:</strong> Medical diagnostic reports are dense with Latin/biochemical terms difficult for non-physicians to interpret.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
              <span><strong>Anxiety & Misinterpretation:</strong> Patients often misjudge mild physiological fluctuations as catastrophic conditions, or overlook critical abnormal flags.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
              <span><strong>Manual Fatigue:</strong> Clinicians spend valuable hours reading through disparate PDF lab layouts with divergent reference interval notations.</span>
            </li>
          </ul>
        </div>

        {/* Objectives */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-slate-900 pb-2 border-b border-slate-100">
            <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h3 className="text-sm font-bold">Core Objectives</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
              <span><strong>Accurate OCR & Extraction:</strong> Parse structured and unstructured multi-format laboratory sheets (PDF, JPG, PNG, text).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
              <span><strong>Normalized Range Benchmarking:</strong> Map test results dynamically against accredited clinical laboratory ranges (CLSI/CAP standards).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
              <span><strong>Plain-Language Clinical Guidance:</strong> Provide clear dietary, lifestyle, and physician follow-up priorities directly tied to flagged lab values.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Complete System Architecture Flow (From Image 1 Blueprint) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">End-to-End Processing Architecture</h3>
            <p className="text-xs text-slate-500">Pipeline flow from patient ingestion to structured clinical presentation</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
            6-Stage Pipeline
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stage 1 */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Stage 1</span>
              <FileSearch className="w-4 h-4 text-slate-600" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Ingestion & Document OCR</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Accepts PDF and high-resolution scanned pathology reports. Normalizes contrast, extracts raw tokens, and prepares OCR text buffers.
            </p>
          </div>

          {/* Stage 2 */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Stage 2</span>
              <Cpu className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">NLP Biomarker Identification</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Analyzes biomarker names, units (g/dL, mg/dL, ng/mL), test categories (Hematology, Lipids, Metabolic), and Patient demographic entities.
            </p>
          </div>

          {/* Stage 3 */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Stage 3</span>
              <Workflow className="w-4 h-4 text-blue-600" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Reference Interval Matching</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cross-references parsed numerical values against clinical minimums and maximums to classify flags: Low, Normal, High, or Critical.
            </p>
          </div>

          {/* Stage 4 */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Stage 4</span>
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Plain-Language Translation</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Synthesizes lay-accessible explanations explaining the biological mechanism and practical implications of each abnormal biomarker.
            </p>
          </div>

          {/* Stage 5 */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Stage 5</span>
              <Database className="w-4 h-4 text-slate-700" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Persistence & Audit Store</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Maintains verified historical records, trend tracking across repeat tests, and encrypted storage for patient privacy.
            </p>
          </div>

          {/* Stage 6 */}
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Stage 6</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="text-sm font-bold text-emerald-950">Actionable Patient Briefing</h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Provides dietary recommendations, physical activity advice, printable consultation sheets, and targeted questions for physician appointments.
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack & Directory Structure (From Blueprint) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technology Stack */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Code2 className="w-4 h-4 text-slate-800" />
            <h3 className="text-sm font-bold text-slate-900">Production Technology Stack</h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-800">Frontend Interface</span>
              <span className="text-slate-600 font-mono">React 19, TypeScript, Tailwind CSS v4</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-800">Backend API Services</span>
              <span className="text-slate-600 font-mono">Node.js, Express, ESBuild CJS Bundler</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-800">AI & Multimodal OCR</span>
              <span className="text-slate-600 font-mono">Gemini 3.8 Flash + Clinical Rule Normalizer</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-800">Visuals & Animation</span>
              <span className="text-slate-600 font-mono">Lucide Icons, Precision Gauge Meters</span>
            </div>
          </div>
        </div>

        {/* Clinical Integrity & Governance */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Clinical Integrity Standards</h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            MedInsight AI is designed with strict healthcare software safeguards:
          </p>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Zero Hallucination Tolerance:</strong> Numerical biomarker values are strictly grounded in the document or verified against published clinical reference intervals.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Non-Diagnostic Advisory:</strong> Summaries explicitly encourage patient-physician dialogue rather than autonomous self-prescription.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Local Offline Fallback:</strong> Runs built-in clinical rule sets directly in the browser even when network access drops.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
