import React, { useState } from 'react';
import { 
  BookOpen, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  FileText, 
  Stethoscope, 
  Search, 
  Download, 
  Check, 
  ChevronRight,
  Flame,
  ArrowRight,
  FlaskConical,
  Scale
} from 'lucide-react';

export const GuidelinesView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const guidelines = [
    {
      id: 'g-1',
      title: 'Flagged Critical Biomarker Escalation Protocol',
      category: 'Diagnostic Safety',
      badge: 'Critical SOP',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900/60',
      description: 'Any specimen displaying panic values (e.g. Hemoglobin < 7.0 g/dL, Fasting Glucose > 300 mg/dL, or Potassium > 6.0 mEq/L) mandates an immediate duplicate verification run on an alternate analyzer, direct notification of the attending physician within 30 minutes, and mandatory automated medical record flag.',
      panicThresholds: [
        { test: 'Hemoglobin', value: '< 7.0 g/dL or > 20.0 g/dL' },
        { test: 'Fasting Glucose', value: '< 54 mg/dL or > 300 mg/dL' },
        { test: 'Platelets', value: '< 50,000 /mcL or > 1,000,000 /mcL' },
        { test: 'Serum Potassium', value: '< 2.8 mEq/L or > 6.0 mEq/L' },
      ],
      checklist: [
        '1. Inspect specimen tube for visual hemolysis, lipemia, or micro-fibrin clots.',
        '2. Perform duplicate run on backup automated analyzer to eliminate sensor error.',
        '3. Contact ordering clinician via verified telephone hotline within 30 minutes.',
        '4. Log communication timestamp, clinician name, and technician badge ID into LIS.',
      ],
    },
    {
      id: 'g-2',
      title: 'Lipid Panel Pre-Analytical Fasting Verification',
      category: 'Specimen Integrity',
      badge: 'Standard Practice',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900/60',
      description: 'Standard lipid profiles requiring direct LDL and Triglycerides require 9 to 12 hours of water-only fasting. For non-fasting samples, the automated calculation converts to Non-HDL Cholesterol and Apolipoprotein B evaluation with an automated caveat flag.',
      checklist: [
        '1. Confirm patient last meal time on laboratory intake requisition.',
        '2. If patient consumed caloric beverages within 6 hours, tag specimen as Non-Fasting.',
        '3. Inspect post-centrifugation plasma clarity; report lipemic interference index if turbidity > 2+.',
        '4. Automatically append Friedewald equation limitations on the final diagnostic release.',
      ],
    },
    {
      id: 'g-3',
      title: 'Thyroid Endocrine Cascade Reflex Algorithm',
      category: 'Endocrinology',
      badge: 'Reflex Testing',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-900/60',
      description: 'Primary thyroid testing begins with automated high-sensitivity TSH. If TSH deviates beyond 0.40 - 4.20 mIU/L, the system automatically triggers a reflex Free T4 and optional Anti-TPO panel without requiring a second phlebotomy draw.',
      checklist: [
        '1. Run initial 3rd-generation chemiluminescent TSH immunoassay.',
        '2. Automated LIS reflex rule triggers Free T4 if TSH < 0.40 or > 4.20 mIU/L.',
        '3. Ensure serum aliquot was kept at 2–8°C for secondary run stability within 48 hours.',
        '4. Correlate with historical thyroid panels in patient record.',
      ],
    },
    {
      id: 'g-4',
      title: 'Multimodal AI Interpretation Transparency & Ethics',
      category: 'AI & Pathologist Governance',
      badge: 'MedInsight SOP',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900/60',
      description: 'MedInsight AI extracts numerical metrics, highlights standardized standard deviations, and produces patient-accessible language summaries. All algorithmic findings act as Clinical Decision Support (CDS) and require final digital sign-off from a certified pathologist.',
      checklist: [
        '1. Human-in-the-loop pathologist reviews and signs off on every abnormal finding.',
        '2. Verify OCR boundary coordinates against original physical/PDF test sheet.',
        '3. Ensure patient-friendly summaries maintain neutral, empathetic, and strictly evidence-based phrasing.',
        '4. Disclaimers explicitly specify: "Not an autonomous diagnosis; consult treating medical practitioner."',
      ],
    },
    {
      id: 'g-5',
      title: 'Complete Blood Count (CBC) Differential Smear Review Criteria',
      category: 'Hematology',
      badge: 'Manual Review',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900/60',
      description: 'Guidelines derived from the International Council for Standardization in Haematology (ICSH). Automates criteria that mandate manual peripheral blood smear slide review under oil immersion microscopy.',
      checklist: [
        '1. White blood cell count > 30,000 /mcL or < 2,000 /mcL.',
        '2. Analyzer flag detects immature granulocytes, blast cells, or nucleated red blood cells.',
        '3. Unexplained thrombocytopenia (platelets < 50,000 /mcL) to rule out EDTA-induced pseudothrombocytopenia.',
        '4. Prepare Wright-Giemsa stained blood film and record differential count in 100 leukocyte fields.',
      ],
    },
  ];

  const categories = ['All', 'Diagnostic Safety', 'Specimen Integrity', 'Endocrinology', 'AI & Pathologist Governance', 'Hematology'];

  const filtered = guidelines.filter((g) => {
    const matchesCategory = activeCategory === 'All' || g.category === activeCategory;
    const matchesSearch = 
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="guidelines-view" className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-6 sm:p-8 shadow-[0_1px_3px_rgba(21,25,30,0.03)] relative overflow-hidden transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] text-[#0D6E5D] dark:text-emerald-400 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Clinical Diagnostic Protocols & Standards</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#15191E] dark:text-[#F1F5F9] tracking-tight">
              Medical Laboratory Guidelines
            </h1>
            <p className="text-xs sm:text-sm text-[#5F6B7A] dark:text-[#8E9CAE] leading-relaxed">
              Standard Operating Procedures (SOPs), panic value alert escalations, pre-analytical sample requirements, and multi-tier diagnostic verification workflows compliant with CLSI and ISO 15189.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <div className="px-4 py-3 bg-[#FAF8F5] dark:bg-[#0D1117] rounded-xl border border-[#E6E2DA] dark:border-[#232D3B] text-center">
              <div className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE] font-medium">Compliance</div>
              <div className="text-sm font-extrabold text-[#15191E] dark:text-white mt-0.5">CAP / CLSI 2026</div>
            </div>
            <div className="px-4 py-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-center">
              <div className="text-xs text-[#0D6E5D] dark:text-emerald-300 font-medium">Standard Version</div>
              <div className="text-sm font-extrabold text-[#0D6E5D] dark:text-emerald-300 mt-0.5">v4.2.1 Operational</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-4 shadow-[0_1px_3px_rgba(21,25,30,0.03)] space-y-3 transition-colors">
        <div className="relative">
          <Search className="w-4 h-4 text-[#5F6B7A] dark:text-[#8E9CAE] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guidelines by protocol name, category, or biomarker..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] rounded-xl text-xs sm:text-sm text-[#15191E] dark:text-slate-200 placeholder:text-[#5F6B7A]/60 focus:outline-none focus:ring-2 focus:ring-[#0D6E5D]/20 focus:border-[#0D6E5D]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#0D6E5D] text-white shadow-2xs'
                  : 'bg-[#FAF8F5] dark:bg-[#0D1117] text-[#5F6B7A] dark:text-[#8E9CAE] hover:text-[#15191E] dark:hover:text-white border border-[#E6E2DA] dark:border-[#232D3B]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Guidelines Accordion / Cards */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-6 shadow-[0_1px_3px_rgba(21,25,30,0.03)] hover:border-[#0D6E5D]/40 transition-all space-y-4"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E6E2DA]/80 dark:border-[#232D3B]">
              <div>
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#5F6B7A] dark:text-[#8E9CAE]">
                  [ {item.category} ]
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#15191E] dark:text-[#F1F5F9] mt-1">
                  {item.title}
                </h2>
              </div>
              <span className={`self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold border ${item.badgeColor}`}>
                {item.badge}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#5F6B7A] dark:text-slate-300 leading-relaxed">
              {item.description}
            </p>

            {/* Panic Thresholds if any */}
            {item.panicThresholds && (
              <div className="bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 rounded-xl p-4">
                <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400 text-xs font-bold mb-2">
                  <Flame className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Immediate Action Panic Thresholds</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                  {item.panicThresholds.map((pt, pIdx) => (
                    <div key={pIdx} className="bg-white dark:bg-[#161D26] p-2.5 rounded-lg border border-rose-200/60 dark:border-rose-900/50">
                      <div className="text-[#5F6B7A] dark:text-[#8E9CAE] text-[11px]">{pt.test}</div>
                      <div className="font-extrabold text-rose-700 dark:text-rose-400 text-xs mt-0.5">{pt.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Standard Checklist */}
            <div className="bg-[#FAF8F5] dark:bg-[#0D1117] rounded-xl p-4 border border-[#E6E2DA] dark:border-[#232D3B] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#15191E] dark:text-slate-200 mb-2">
                <span>Standard Action Checklist</span>
                <span className="text-[11px] font-normal text-[#5F6B7A] dark:text-[#8E9CAE]">Click to verify step</span>
              </div>
              <div className="space-y-2">
                {item.checklist.map((step, sIdx) => {
                  const stepId = `${item.id}-step-${sIdx}`;
                  const isChecked = !!completedSteps[stepId];

                  return (
                    <div
                      key={sIdx}
                      onClick={() => toggleStep(stepId)}
                      className={`flex items-start gap-3 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-[#0D6E5D] dark:text-emerald-300'
                          : 'bg-white dark:bg-[#161D26] border-[#E6E2DA] dark:border-[#232D3B] text-[#15191E] dark:text-slate-300 hover:border-[#0D6E5D]/50'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                        isChecked
                          ? 'bg-[#0D6E5D] border-[#0D6E5D] text-white'
                          : 'border-[#E6E2DA] dark:border-[#232D3B] bg-[#FAF8F5] dark:bg-[#0D1117]'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={isChecked ? 'line-through opacity-80' : ''}>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] text-[#5F6B7A] dark:text-[#8E9CAE] text-xs">
            No guidelines matched your search query.
          </div>
        )}
      </div>
    </div>
  );
};
