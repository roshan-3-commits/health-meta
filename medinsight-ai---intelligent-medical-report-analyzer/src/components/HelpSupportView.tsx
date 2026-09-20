import React, { useState } from 'react';
import { 
  HelpCircle, 
  BookOpen, 
  MessageSquare, 
  PhoneCall, 
  Mail, 
  Keyboard, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Activity,
  Workflow,
  User,
  GraduationCap,
  School
} from 'lucide-react';
import { ArchitectureView } from './ArchitectureView';

export const HelpSupportView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showArchitecture, setShowArchitecture] = useState(false);

  const faqs = [
    {
      q: 'How does MedInsight AI parse unstructured pathology PDF and image reports?',
      a: 'MedInsight AI utilizes high-precision medical optical character recognition (OCR) coupled with multimodal clinical knowledge models. It accurately isolates specimen metadata, maps non-standard biomarker aliases to standardized LOINC codes, extracts numerical values and units, and compares them against verified biological reference intervals.',
    },
    {
      q: 'What should a technician do when a panic or critical threshold is flagged?',
      a: 'Per clinical laboratory accreditation guidelines (CAP / ISO 15189), any specimen with a "Critical Panic" value (such as Hemoglobin < 7.0 g/dL or Fasting Glucose > 300 mg/dL) must undergo an immediate duplicate verification run on an alternate analyzer, followed by telephone notification of the ordering physician within 30 minutes.',
    },
    {
      q: 'How does patient account auto-sync work?',
      a: 'Whenever a report is uploaded containing a matching Medical Record Number (MRN) or verified Name + Date of Birth combination, MedInsight AI automatically appends the newly extracted test panel to that patient\'s longitudinal timeline. This enables automatic delta-check comparisons and historical trend graphing.',
    },
    {
      q: 'Can laboratory technicians manually edit extracted biomarkers if OCR makes an error?',
      a: 'Yes. In the detailed report view, clinicians can edit any extracted value, unit, or biological interval before finalizing and printing the clinical summary. All modifications are logged in the system audit trail.',
    },
    {
      q: 'How do I generate an official printable summary for the patient?',
      a: 'Navigate to any report in "Analysis" or "Reports & History" and click the "Print Official Report" button (or press Ctrl + P). This opens a print-formatted, hospital-ready diagnostic summary with clinician signature blocks and plain-language patient explanations.',
    },
  ];

  const shortcuts = [
    { key: 'Ctrl + K', desc: 'Open Global Command Palette to search patients, tests, and MRNs' },
    { key: 'Ctrl + P', desc: 'Print active laboratory report or export PDF' },
    { key: 'Ctrl + U', desc: 'Jump to Uploaded Reports' },
    { key: 'Esc', desc: 'Close any active modal or search palette' },
  ];

  return (
    <div id="help-support-view" className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* 1. About Me (Developer & Student Information) */}
      <div className="bg-gradient-to-r from-teal-900/10 via-emerald-900/5 to-slate-900/5 dark:from-teal-950/60 dark:via-slate-900 dark:to-slate-900 rounded-3xl border border-teal-200/90 dark:border-teal-800/60 p-6 sm:p-7 shadow-xs relative overflow-hidden transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0d7a68] to-[#0a5c4f] text-white flex items-center justify-center font-extrabold text-xl shadow-md shrink-0 border border-teal-400/30">
              NS
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-[#0d7a68] dark:text-teal-300 text-xs font-bold">
                  <User className="w-3.5 h-3.5" />
                  <span>About Me</span>
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                  Project Developer
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Nisha Singh
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1">
                  <span className="text-slate-400">Roll No:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">266629</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-teal-700 dark:text-teal-300">
                  <GraduationCap className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>BSC - IT</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <School className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">KBP Collage Navi Mumbai - Vashi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs relative overflow-hidden transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Clinical Support & Knowledge Base</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Help & Support Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Diagnostic guidelines, technician onboarding documentation, pathology consultation contacts, and laboratory system documentation.
            </p>
          </div>

          <button
            onClick={() => setShowArchitecture(!showArchitecture)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer shrink-0 border border-slate-200 dark:border-slate-700"
          >
            <Workflow className="w-4 h-4 text-[#0d7a68]" />
            <span>{showArchitecture ? 'Hide System Blueprint' : 'View Engineering Architecture'}</span>
          </button>
        </div>
      </div>

      {/* Conditionally view Architecture Blueprint */}
      {showArchitecture && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-200">
          <ArchitectureView />
        </div>
      )}

      {/* Quick Contact & Dispatch Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-[#0d7a68] dark:text-teal-400 flex items-center justify-center">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div className="font-bold text-sm text-slate-900 dark:text-white">Emergency Pathology Hotline</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Direct line to Chief Duty Pathologist for critical panic value sign-offs.</div>
          <div className="font-mono text-xs font-extrabold text-[#0d7a68] dark:text-teal-400 pt-1">+1 (800) 555-PATH (Ext. 402)</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Mail className="w-4 h-4" />
          </div>
          <div className="font-bold text-sm text-slate-900 dark:text-white">LIS Informatics Support</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Technical help with analyzer HL7 / FHIR connectors and auto-sync.</div>
          <div className="font-mono text-xs font-extrabold text-blue-600 dark:text-blue-400 pt-1">support@medinsight.internal</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="font-bold text-sm text-slate-900 dark:text-white">Quality Assurance & Audit</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">CAP & ISO 15189 compliance documentation and proficiency testing logs.</div>
          <div className="font-mono text-xs font-extrabold text-purple-600 dark:text-purple-400 pt-1">qa-audit@medinsight.org</div>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center gap-2 mb-4">
          <Keyboard className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Clinical Workflow Keyboard Shortcuts</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {shortcuts.map((sc, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <span className="text-xs text-slate-600 dark:text-slate-300">{sc.desc}</span>
              <kbd className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono text-xs rounded-lg shadow-2xs font-semibold">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Frequently Asked Clinical Questions</h2>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="py-3.5">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left gap-4 cursor-pointer group"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#0d7a68] dark:group-hover:text-teal-400 transition-colors">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#0d7a68] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pr-6 animate-in fade-in duration-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
