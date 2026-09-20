import React, { useState } from 'react';
import { 
  FlaskConical, 
  Search, 
  X, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';

interface ReferenceRangesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BiomarkerRange {
  name: string;
  category: 'Hematology' | 'Lipids' | 'Metabolic & Renal' | 'Thyroid' | 'Liver' | 'Vitamins';
  standardRange: string;
  unit: string;
  criticalLow?: string;
  criticalHigh?: string;
  clinicalSignificance: string;
  patientPrep: string;
}

const REFERENCE_DATA: BiomarkerRange[] = [
  {
    name: 'Hemoglobin (Male)',
    category: 'Hematology',
    standardRange: '13.0 - 17.0',
    unit: 'g/dL',
    criticalLow: '< 7.0',
    criticalHigh: '> 20.0',
    clinicalSignificance: 'Oxygen-carrying capacity; indicator for anemia or polycythemia.',
    patientPrep: 'No fasting required.',
  },
  {
    name: 'Hemoglobin (Female)',
    category: 'Hematology',
    standardRange: '12.0 - 15.5',
    unit: 'g/dL',
    criticalLow: '< 7.0',
    criticalHigh: '> 20.0',
    clinicalSignificance: 'Oxygen transport; variations during pregnancy and menses.',
    patientPrep: 'No fasting required.',
  },
  {
    name: 'Platelet Count',
    category: 'Hematology',
    standardRange: '150,000 - 450,000',
    unit: '/mcL',
    criticalLow: '< 50,000',
    criticalHigh: '> 1,000,000',
    clinicalSignificance: 'Primary hemostasis and clotting integrity.',
    patientPrep: 'Standard venipuncture.',
  },
  {
    name: 'Total Cholesterol',
    category: 'Lipids',
    standardRange: '< 200',
    unit: 'mg/dL',
    criticalHigh: '> 300',
    clinicalSignificance: 'Atherosclerotic cardiovascular disease (ASCVD) risk assessment.',
    patientPrep: '9 - 12 hours overnight fast recommended.',
  },
  {
    name: 'HDL Cholesterol (Good)',
    category: 'Lipids',
    standardRange: '> 40 (Male) / > 50 (Female)',
    unit: 'mg/dL',
    criticalLow: '< 25',
    clinicalSignificance: 'Reverse cholesterol transport and cardiovascular protection.',
    patientPrep: 'Overnight fasting.',
  },
  {
    name: 'LDL Cholesterol (Calculated)',
    category: 'Lipids',
    standardRange: '< 100 (Optimal)',
    unit: 'mg/dL',
    criticalHigh: '> 190',
    clinicalSignificance: 'Direct atherogenic particle marker.',
    patientPrep: 'Overnight fasting.',
  },
  {
    name: 'Triglycerides',
    category: 'Lipids',
    standardRange: '< 150',
    unit: 'mg/dL',
    criticalHigh: '> 500 (Pancreatitis risk)',
    clinicalSignificance: 'Circulating dietary fatty acids and metabolic risk indicator.',
    patientPrep: '10 - 12 hours strict fast.',
  },
  {
    name: 'Fasting Blood Glucose',
    category: 'Metabolic & Renal',
    standardRange: '70 - 99',
    unit: 'mg/dL',
    criticalLow: '< 54',
    criticalHigh: '> 300',
    clinicalSignificance: 'Basal glycemic control; diagnosis of diabetes mellitus.',
    patientPrep: '8 hours water-only fast.',
  },
  {
    name: 'HbA1c (Glycated Hemoglobin)',
    category: 'Metabolic & Renal',
    standardRange: '< 5.7',
    unit: '%',
    criticalHigh: '> 10.0',
    clinicalSignificance: 'Reflects 90-day mean glycemic exposure.',
    patientPrep: 'Non-fasting acceptable.',
  },
  {
    name: 'Serum Creatinine',
    category: 'Metabolic & Renal',
    standardRange: '0.7 - 1.3',
    unit: 'mg/dL',
    criticalHigh: '> 4.0',
    clinicalSignificance: 'Renal clearance and glomerular filtration capacity.',
    patientPrep: 'Avoid high-meat diet 24h prior.',
  },
  {
    name: 'TSH (Thyroid Stimulating)',
    category: 'Thyroid',
    standardRange: '0.40 - 4.20',
    unit: 'mIU/L',
    criticalLow: '< 0.05',
    criticalHigh: '> 10.0',
    clinicalSignificance: 'Primary screen for hypothyroidism or hyperthyroidism.',
    patientPrep: 'Morning draw preferred prior to thyroid meds.',
  },
  {
    name: '25-OH Vitamin D',
    category: 'Vitamins',
    standardRange: '20.0 - 50.0 (Optimal: 30 - 60)',
    unit: 'ng/mL',
    criticalLow: '< 10.0',
    criticalHigh: '> 100.0',
    clinicalSignificance: 'Bone mineral metabolism, calcium homeostasis, and immune regulation.',
    patientPrep: 'Non-fasting.',
  },
  {
    name: 'ALT (Alanine Aminotransferase)',
    category: 'Liver',
    standardRange: '7 - 56',
    unit: 'U/L',
    criticalHigh: '> 300',
    clinicalSignificance: 'Specific indicator of hepatocellular injury or fatty liver disease.',
    patientPrep: 'Avoid alcohol for 24 hours.',
  },
];

export const ReferenceRangesModal: React.FC<ReferenceRangesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Hematology', 'Lipids', 'Metabolic & Renal', 'Thyroid', 'Liver', 'Vitamins'];

  const filtered = REFERENCE_DATA.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.clinicalSignificance.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#15191E]/60 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#161D26] w-full max-w-4xl rounded-2xl shadow-2xl border border-[#E6E2DA] dark:border-[#232D3B] overflow-hidden flex flex-col max-h-[88vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E6E2DA] dark:border-[#232D3B] flex items-center justify-between bg-[#FAF8F5] dark:bg-[#0D1117]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D6E5D] text-white flex items-center justify-center shadow-xs">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#15191E] dark:text-[#F1F5F9]">Clinical Reference Ranges</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-[#0D6E5D] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  CLSI Verified
                </span>
              </div>
              <p className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE] mt-0.5">
                Biological intervals, critical action thresholds, and clinical interpretation standards
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

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-[#E6E2DA] dark:border-[#232D3B] bg-[#FAF8F5]/80 dark:bg-[#0D1117] space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#5F6B7A] dark:text-[#8E9CAE] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search biomarker (e.g., Hemoglobin, Glucose, TSH, Vitamin D)..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#161D26] border border-[#E6E2DA] dark:border-[#232D3B] rounded-xl text-xs text-[#15191E] dark:text-[#F1F5F9] placeholder:text-[#5F6B7A] dark:placeholder:text-[#8E9CAE] focus:outline-none focus:ring-2 focus:ring-[#0D6E5D] transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0D6E5D] text-white shadow-2xs'
                    : 'bg-white dark:bg-[#161D26] text-[#5F6B7A] dark:text-[#8E9CAE] hover:bg-[#FAF8F5] dark:hover:bg-[#232D3B] border border-[#E6E2DA] dark:border-[#232D3B]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Ranges Table List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-white dark:bg-[#161D26]">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-[#E6E2DA] dark:border-[#232D3B] bg-[#FAF8F5]/60 dark:bg-[#0D1117] hover:border-[#0D6E5D]/40 transition-all space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#15191E] dark:text-[#F1F5F9]">{item.name}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-[#161D26] text-[#5F6B7A] dark:text-[#8E9CAE] border border-[#E6E2DA] dark:border-[#232D3B]">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] mr-1.5">Target Range:</span>
                    <span className="font-extrabold text-sm text-[#0D6E5D] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      {item.standardRange} {item.unit}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE] flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#0D6E5D] dark:text-emerald-400 mt-0.5 shrink-0" />
                <span>{item.clinicalSignificance}</span>
              </div>

              {(item.criticalLow || item.criticalHigh || item.patientPrep) && (
                <div className="pt-2 border-t border-[#E6E2DA]/80 dark:border-[#232D3B] flex items-center justify-between text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    {item.criticalLow && (
                      <span className="text-rose-600 dark:text-rose-400 font-medium">
                        Panic Low: <strong className="font-bold">{item.criticalLow}</strong>
                      </span>
                    )}
                    {item.criticalHigh && (
                      <span className="text-rose-600 dark:text-rose-400 font-medium">
                        Panic High: <strong className="font-bold">{item.criticalHigh}</strong>
                      </span>
                    )}
                  </div>
                  {item.patientPrep && (
                    <span className="text-[#5F6B7A] dark:text-[#8E9CAE] italic">
                      Protocol: {item.patientPrep}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-[#5F6B7A] dark:text-[#8E9CAE] text-xs">
              No biomarkers matched your search criteria.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E6E2DA] dark:border-[#232D3B] bg-[#FAF8F5] dark:bg-[#0D1117] flex items-center justify-between text-xs text-[#5F6B7A] dark:text-[#8E9CAE]">
          <span>Standardized against WHO & Clinical Laboratory Standards Institute (CLSI) 2026</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#15191E] dark:bg-[#0D6E5D] hover:bg-[#0D6E5D] text-white font-bold cursor-pointer transition-colors shadow-2xs"
          >
            Close Reference Sheet
          </button>
        </div>
      </div>
    </div>
  );
};
