import React, { useState, useMemo } from 'react';
import { 
  FlaskConical, 
  Search, 
  Filter, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpDown,
  Download,
  Printer,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';

interface BiomarkerRangeItem {
  id: string;
  name: string;
  category: 'Hematology' | 'Lipids' | 'Metabolic & Renal' | 'Thyroid' | 'Liver' | 'Vitamins' | 'Electrolytes';
  specimen: string;
  standardRange: string;
  unit: string;
  criticalLow?: string;
  criticalHigh?: string;
  optimalRange?: string;
  clinicalSignificance: string;
  fastingPrep: string;
}

const RANGES_DATA: BiomarkerRangeItem[] = [
  {
    id: 'hb-m',
    name: 'Hemoglobin (Male)',
    category: 'Hematology',
    specimen: 'Whole Blood (EDTA)',
    standardRange: '13.0 - 17.0',
    unit: 'g/dL',
    optimalRange: '14.0 - 16.5 g/dL',
    criticalLow: '< 7.0 g/dL',
    criticalHigh: '> 20.0 g/dL',
    clinicalSignificance: 'Primary oxygen transporter in erythrocytes; evaluated for microcytic/normocytic anemia or secondary polycythemia.',
    fastingPrep: 'Non-fasting. Avoid heavy physical exertion 2h prior.',
  },
  {
    id: 'hb-f',
    name: 'Hemoglobin (Female)',
    category: 'Hematology',
    specimen: 'Whole Blood (EDTA)',
    standardRange: '12.0 - 15.5',
    unit: 'g/dL',
    optimalRange: '12.5 - 15.0 g/dL',
    criticalLow: '< 7.0 g/dL',
    criticalHigh: '> 20.0 g/dL',
    clinicalSignificance: 'Oxygen transport protein; physiologic decreases occur during pregnancy and heavy menstrual blood loss.',
    fastingPrep: 'Non-fasting.',
  },
  {
    id: 'plt',
    name: 'Platelet Count',
    category: 'Hematology',
    specimen: 'Whole Blood (EDTA)',
    standardRange: '150,000 - 450,000',
    unit: '/mcL',
    optimalRange: '200,000 - 350,000 /mcL',
    criticalLow: '< 50,000 /mcL',
    criticalHigh: '> 1,000,000 /mcL',
    clinicalSignificance: 'Key cellular mediator of primary hemostasis. Extreme thrombocytopenia carries spontaneous intracranial hemorrhage risk.',
    fastingPrep: 'Routine venipuncture. Gentle inversion to prevent micro-clotting.',
  },
  {
    id: 'wbc',
    name: 'Total Leukocyte Count (WBC)',
    category: 'Hematology',
    specimen: 'Whole Blood (EDTA)',
    standardRange: '4,500 - 11,000',
    unit: '/mcL',
    optimalRange: '5,000 - 9,500 /mcL',
    criticalLow: '< 2,000 /mcL',
    criticalHigh: '> 30,000 /mcL',
    clinicalSignificance: 'Immunological marker; elevated in bacterial/viral sepsis, inflammatory cascades, or leukemoid reactions.',
    fastingPrep: 'Non-fasting.',
  },
  {
    id: 'chol-tot',
    name: 'Total Cholesterol',
    category: 'Lipids',
    specimen: 'Serum / SST Tube',
    standardRange: '< 200',
    unit: 'mg/dL',
    optimalRange: '140 - 180 mg/dL',
    criticalHigh: '> 300 mg/dL',
    clinicalSignificance: 'Atherosclerotic cardiovascular disease (ASCVD) risk determinant; used in pooled cohort equations.',
    fastingPrep: '9 - 12 hours overnight water-only fast recommended.',
  },
  {
    id: 'hdl',
    name: 'HDL Cholesterol (High Density)',
    category: 'Lipids',
    specimen: 'Serum / SST Tube',
    standardRange: '> 40 (Male) / > 50 (Female)',
    unit: 'mg/dL',
    optimalRange: '50 - 75 mg/dL',
    criticalLow: '< 25 mg/dL',
    clinicalSignificance: 'Facilitates reverse cholesterol transport from vascular walls back to hepatic tissue for excretion.',
    fastingPrep: 'Overnight fasting.',
  },
  {
    id: 'ldl',
    name: 'LDL Cholesterol (Calculated)',
    category: 'Lipids',
    specimen: 'Serum / SST Tube',
    standardRange: '< 100 (Optimal)',
    unit: 'mg/dL',
    optimalRange: '< 70 mg/dL (High Risk)',
    criticalHigh: '> 190 mg/dL (Familial Hypercholesterolemia)',
    clinicalSignificance: 'Major atherogenic lipoprotein directly implicated in vascular plaque formation and stenosis.',
    fastingPrep: 'Overnight fasting. Triglycerides must be < 400 mg/dL for accurate calculation.',
  },
  {
    id: 'trig',
    name: 'Triglycerides',
    category: 'Lipids',
    specimen: 'Serum / SST Tube',
    standardRange: '< 150',
    unit: 'mg/dL',
    optimalRange: '< 100 mg/dL',
    criticalHigh: '> 500 mg/dL (Acute Pancreatitis Risk)',
    clinicalSignificance: 'Reflects circulating dietary and hepatic fatty acids; hallmark of metabolic syndrome and insulin resistance.',
    fastingPrep: 'Strict 10 - 12 hours fast. Avoid alcohol 24h prior.',
  },
  {
    id: 'fbg',
    name: 'Fasting Blood Glucose',
    category: 'Metabolic & Renal',
    specimen: 'Sodium Fluoride Plasma / Serum',
    standardRange: '70 - 99',
    unit: 'mg/dL',
    optimalRange: '75 - 90 mg/dL',
    criticalLow: '< 54 mg/dL',
    criticalHigh: '> 300 mg/dL',
    clinicalSignificance: 'Diagnostic threshold for impaired fasting glucose (100–125 mg/dL) and overt diabetes mellitus (≥126 mg/dL).',
    fastingPrep: 'Minimum 8 hours strict fast with only water permitted.',
  },
  {
    id: 'hba1c',
    name: 'HbA1c (Glycated Hemoglobin)',
    category: 'Metabolic & Renal',
    specimen: 'Whole Blood (EDTA)',
    standardRange: '< 5.7',
    unit: '%',
    optimalRange: '< 5.4%',
    criticalHigh: '> 10.0%',
    clinicalSignificance: 'Represents 3-month rolling weighted average of erythrocyte glycemic exposure.',
    fastingPrep: 'Non-fasting. Patient can eat and drink normally before testing.',
  },
  {
    id: 'creat',
    name: 'Serum Creatinine',
    category: 'Metabolic & Renal',
    specimen: 'Serum / SST Tube',
    standardRange: '0.7 - 1.3',
    unit: 'mg/dL',
    optimalRange: '0.8 - 1.1 mg/dL',
    criticalHigh: '> 4.0 mg/dL',
    clinicalSignificance: 'Metabolic byproduct of skeletal muscle creatine breakdown; key input for CKD-EPI estimated GFR (eGFR).',
    fastingPrep: 'Avoid excessive cooked red meat intake 24h prior.',
  },
  {
    id: 'tsh',
    name: 'TSH (Thyroid Stimulating Hormone)',
    category: 'Thyroid',
    specimen: 'Serum / SST Tube',
    standardRange: '0.40 - 4.20',
    unit: 'mIU/L',
    optimalRange: '1.0 - 2.5 mIU/L',
    criticalLow: '< 0.05 mIU/L',
    criticalHigh: '> 10.0 mIU/L',
    clinicalSignificance: 'Pituitary feedback hormone; first-line screening for primary hypothyroidism (>4.2) or hyperthyroidism (<0.4).',
    fastingPrep: 'Morning draw recommended before taking morning dose of thyroid hormone replacement.',
  },
  {
    id: 'vit-d',
    name: '25-Hydroxy Vitamin D',
    category: 'Vitamins',
    specimen: 'Serum / SST Tube',
    standardRange: '20.0 - 50.0 (Optimal: 30 - 60)',
    unit: 'ng/mL',
    optimalRange: '35 - 55 ng/mL',
    criticalLow: '< 10.0 ng/mL',
    criticalHigh: '> 100.0 ng/mL',
    clinicalSignificance: 'Essential steroid hormone precursor regulating calcium/phosphate homeostasis, osteoid mineralization, and immune modulation.',
    fastingPrep: 'Non-fasting.',
  },
  {
    id: 'alt',
    name: 'ALT (Alanine Aminotransferase)',
    category: 'Liver',
    specimen: 'Serum / SST Tube',
    standardRange: '7 - 56',
    unit: 'U/L',
    optimalRange: '10 - 30 U/L',
    criticalHigh: '> 300 U/L',
    clinicalSignificance: 'Intracellular hepatocellular enzyme; sensitive indicator of acute viral hepatitis, drug toxicity, or NAFLD.',
    fastingPrep: 'Avoid alcohol consumption 24 hours prior.',
  },
  {
    id: 'potass',
    name: 'Serum Potassium (K+)',
    category: 'Electrolytes',
    specimen: 'Serum (Lithium Heparin or Plain)',
    standardRange: '3.5 - 5.1',
    unit: 'mEq/L',
    optimalRange: '3.8 - 4.8 mEq/L',
    criticalLow: '< 2.8 mEq/L',
    criticalHigh: '> 6.0 mEq/L',
    clinicalSignificance: 'Chief intracellular cation regulating myocardial membrane resting potential; deviations cause fatal cardiac arrhythmias.',
    fastingPrep: 'Non-fasting. Avoid fist clenching to prevent in-vitro pseudohyperkalemia.',
  },
];

export const ReferenceRangesView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterPanicOnly, setFilterPanicOnly] = useState(false);

  const categories = ['All', 'Hematology', 'Lipids', 'Metabolic & Renal', 'Thyroid', 'Liver', 'Vitamins', 'Electrolytes'];

  const filteredData = useMemo(() => {
    return RANGES_DATA.filter((item) => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchSearch = 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.clinicalSignificance.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
      const matchPanic = !filterPanicOnly || !!item.criticalHigh || !!item.criticalLow;
      return matchCat && matchSearch && matchPanic;
    });
  }, [search, selectedCategory, filterPanicOnly]);

  return (
    <div id="reference-ranges-view" className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Banner */}
      <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-6 sm:p-8 shadow-[0_1px_3px_rgba(21,25,30,0.03)] relative overflow-hidden transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] text-[#0D6E5D] dark:text-emerald-400 text-xs font-semibold">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Standard Biological Reference Intervals</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#15191E] dark:text-[#F1F5F9] tracking-tight">
              Clinical Reference Ranges Directory
            </h1>
            <p className="text-xs sm:text-sm text-[#5F6B7A] dark:text-[#8E9CAE] leading-relaxed">
              Biological intervals, critical action panic thresholds, specimen tube types, and clinical interpretation standards harmonized with CLSI (Clinical and Laboratory Standards Institute) and WHO guidelines.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-3 bg-[#FAF8F5] dark:bg-[#0D1117] rounded-xl border border-[#E6E2DA] dark:border-[#232D3B] text-center">
              <div className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE] font-medium">Standard Standardized</div>
              <div className="text-sm font-extrabold text-[#15191E] dark:text-white mt-0.5">CLSI EP28-A3c</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-4 shadow-[0_1px_3px_rgba(21,25,30,0.03)] space-y-3 transition-colors">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#5F6B7A] dark:text-[#8E9CAE] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by biomarker name (e.g. Hemoglobin, Glucose, TSH, Vitamin D)..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] rounded-xl text-xs sm:text-sm text-[#15191E] dark:text-slate-200 placeholder:text-[#5F6B7A]/60 focus:outline-none focus:ring-2 focus:ring-[#0D6E5D]/20 focus:border-[#0D6E5D]"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-[#15191E] dark:text-slate-300 self-start sm:self-center cursor-pointer select-none bg-[#FAF8F5] dark:bg-[#0D1117] px-3.5 py-2.5 rounded-xl border border-[#E6E2DA] dark:border-[#232D3B] shrink-0">
            <input
              type="checkbox"
              checked={filterPanicOnly}
              onChange={(e) => setFilterPanicOnly(e.target.checked)}
              className="rounded text-[#0D6E5D] focus:ring-[#0D6E5D]"
            />
            <span>Panic Values Only</span>
          </label>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0D6E5D] text-white shadow-2xs'
                  : 'bg-[#FAF8F5] dark:bg-[#0D1117] text-[#5F6B7A] dark:text-[#8E9CAE] hover:text-[#15191E] dark:hover:text-white border border-[#E6E2DA] dark:border-[#232D3B]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-5 shadow-[0_1px_3px_rgba(21,25,30,0.03)] hover:border-[#0D6E5D]/40 transition-all space-y-3"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm sm:text-base text-[#15191E] dark:text-[#F1F5F9]">
                    {item.name}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#FAF8F5] dark:bg-[#0D1117] text-[#5F6B7A] dark:text-[#8E9CAE] border border-[#E6E2DA] dark:border-[#232D3B]">
                    {item.category}
                  </span>
                </div>
                <div className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] mt-0.5">
                  Specimen: <strong className="text-[#15191E] dark:text-slate-300 font-semibold">{item.specimen}</strong>
                </div>
              </div>

              {/* Standard Range Box */}
              <div className="text-right shrink-0">
                <div className="text-[10px] uppercase font-bold text-[#5F6B7A] dark:text-[#8E9CAE]">Target Range</div>
                <div className="text-xs sm:text-sm font-extrabold text-[#0D6E5D] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-900/60 mt-0.5">
                  {item.standardRange} {item.unit}
                </div>
              </div>
            </div>

            {/* Optimal Range if present */}
            {item.optimalRange && (
              <div className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0D6E5D] dark:text-emerald-400 shrink-0" />
                <span>Optimal Clinical Target: <strong className="text-[#15191E] dark:text-slate-200">{item.optimalRange}</strong></span>
              </div>
            )}

            {/* Clinical Significance */}
            <div className="text-xs text-[#5F6B7A] dark:text-slate-300 flex items-start gap-1.5 leading-relaxed bg-[#FAF8F5] dark:bg-[#0D1117] p-2.5 rounded-xl border border-[#E6E2DA] dark:border-[#232D3B]">
              <Info className="w-3.5 h-3.5 text-[#5F6B7A] dark:text-[#8E9CAE] mt-0.5 shrink-0" />
              <span>{item.clinicalSignificance}</span>
            </div>

            {/* Bottom Panic thresholds and prep */}
            <div className="pt-2 border-t border-[#E6E2DA]/80 dark:border-[#232D3B] flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-3 flex-wrap">
                {item.criticalLow && (
                  <span className="text-rose-600 dark:text-rose-400 font-semibold text-[11px] bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200/60 dark:border-rose-900/40">
                    Panic Low: <strong>{item.criticalLow}</strong>
                  </span>
                )}
                {item.criticalHigh && (
                  <span className="text-rose-600 dark:text-rose-400 font-semibold text-[11px] bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200/60 dark:border-rose-900/40">
                    Panic High: <strong>{item.criticalHigh}</strong>
                  </span>
                )}
              </div>

              <span className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] italic">
                {item.fastingPrep}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] text-[#5F6B7A] dark:text-[#8E9CAE] text-xs">
          No biomarkers matched your search criteria.
        </div>
      )}
    </div>
  );
};
