import React from 'react';
import { 
  BookOpen, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  FileText,
  Clock,
  Stethoscope
} from 'lucide-react';

interface ClinicalGuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClinicalGuidelinesModal: React.FC<ClinicalGuidelinesModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const guidelines = [
    {
      title: 'Flagged Biomarker Escalation Protocol',
      category: 'Diagnostic Safety',
      badge: 'Critical SOP',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      description: 'Any specimen displaying panic values (e.g. Hemoglobin < 7.0 g/dL or Fasting Glucose > 300 mg/dL) mandates a duplicate run on an alternate analyzer, direct notification of the ordering physician within 30 minutes, and automated electronic medical record flag.',
      steps: [
        '1. Inspect specimen for hemolysis, lipemia, or micro-clots',
        '2. Perform immediate instrument recalibration run',
        '3. Log technician timestamp and communicate to attending physician',
      ],
    },
    {
      title: 'Lipid Panel Pre-Analytical Fasting Verification',
      category: 'Specimen Integrity',
      badge: 'Standard Practice',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      description: 'For direct LDL and Triglyceride quantification, confirm minimum 9 to 12 hours water-only fasting. When non-fasting, automated calculation converts to Non-HDL Cholesterol and Apolipoprotein B evaluation.',
      steps: [
        '1. Verify patient last meal declaration on intake sheet',
        '2. Report Triglyceride interference index if sample is milky',
        '3. Include automated fasting caveat on outbound report',
      ],
    },
    {
      title: 'Thyroid Endocrine Cascade Reflex Algorithm',
      category: 'Endocrinology',
      badge: 'Reflex Testing',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      description: 'Elevated TSH (> 4.2 mIU/L) automatically triggers Free T4 reflex testing to differentiate overt hypothyroidism from subclinical endocrine disease.',
      steps: [
        '1. Primary automated TSH screen run',
        '2. Secondary reflex to Free T4 if TSH is discordant',
        '3. Correlate with clinical symptoms (fatigue, cold sensitivity)',
      ],
    },
    {
      title: 'Multimodal AI Interpretation Transparency',
      category: 'AI Ethics & Governance',
      badge: 'MedInsight SOP',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'MedInsight AI extracts numerical values, flags biological deviations, and generates patient-centric explanations. All interpretations are diagnostic decision support and require licensed pathologist sign-off.',
      steps: [
        '1. Human-in-the-loop pathologist verification',
        '2. Traceable biomarker coordinate auditing from raw report PDFs',
        '3. Plain-language patient guidance accompanied by clinical disclaimer',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#15191E]/60 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#161D26] w-full max-w-4xl rounded-2xl shadow-2xl border border-[#E6E2DA] dark:border-[#232D3B] overflow-hidden flex flex-col max-h-[88vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E6E2DA] dark:border-[#232D3B] flex items-center justify-between bg-[#FAF8F5] dark:bg-[#0D1117]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D6E5D] text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#15191E] dark:text-[#F1F5F9]">Medical Laboratory Guidelines</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50">
                  Version 4.2
                </span>
              </div>
              <p className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE] mt-0.5">
                Standard operating procedures, panic value thresholds, and reflex test protocols
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#FAF8F5] dark:hover:bg-[#232D3B] flex items-center justify-center text-[#5F6B7A] dark:text-[#8E9CAE] hover:text-[#15191E] dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guidelines List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-white dark:bg-[#161D26]">
          {guidelines.map((guide, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-[#E6E2DA] dark:border-[#232D3B] bg-[#FAF8F5]/60 dark:bg-[#0D1117] hover:border-[#0D6E5D]/40 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#5F6B7A] dark:text-[#8E9CAE]">
                    {guide.category}
                  </span>
                  <h3 className="text-sm font-bold text-[#15191E] dark:text-[#F1F5F9] mt-0.5">{guide.title}</h3>
                </div>
                <span className={`self-start sm:self-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${guide.badgeColor}`}>
                  {guide.badge}
                </span>
              </div>

              <p className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE] leading-relaxed">
                {guide.description}
              </p>

              <div className="p-3 bg-white dark:bg-[#161D26] rounded-xl border border-[#E6E2DA] dark:border-[#232D3B] space-y-1 text-xs text-[#15191E] dark:text-[#F1F5F9]">
                <span className="text-[11px] font-bold text-[#5F6B7A] dark:text-[#8E9CAE] block mb-1">Standard Checklist:</span>
                {guide.steps.map((step, sIdx) => (
                  <div key={sIdx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0D6E5D] dark:text-emerald-400 shrink-0" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E6E2DA] dark:border-[#232D3B] bg-[#FAF8F5] dark:bg-[#0D1117] flex items-center justify-between text-xs text-[#5F6B7A] dark:text-[#8E9CAE]">
          <span>Certified under CAP & ISO 15189 Medical Laboratories Quality Management</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0D6E5D] hover:bg-[#095245] text-white font-bold cursor-pointer transition-colors shadow-2xs"
          >
            Acknowledge Guidelines
          </button>
        </div>
      </div>
    </div>
  );
};
