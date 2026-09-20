import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  FileText, 
  User, 
  Activity, 
  ArrowRight, 
  X, 
  UploadCloud, 
  Printer, 
  Sparkles,
  Command
} from 'lucide-react';
import { MedicalReport, PatientAccount, NavigationTab } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  reports: MedicalReport[];
  accounts: PatientAccount[];
  onSelectReport: (report: MedicalReport) => void;
  onSelectAccount: (account: PatientAccount) => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  reports,
  accounts,
  onSelectReport,
  onSelectAccount,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global keydown handler for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or state
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Build searchable items
  type SearchItem = {
    id: string;
    type: 'test' | 'patient' | 'report' | 'action';
    title: string;
    subtitle: string;
    badge?: string;
    badgeColor?: string;
    action: () => void;
  };

  const items: SearchItem[] = [];

  // Actions
  items.push({
    id: 'act-upload',
    type: 'action',
    title: 'Upload New Medical Report',
    subtitle: 'Extract pathology data from PDF, image, or raw clinical text',
    badge: 'Action',
    action: () => {
      onNavigate('upload');
      onClose();
    },
  });

  items.push({
    id: 'act-history',
    type: 'action',
    title: 'Browse Full Reports History',
    subtitle: 'Search and filter all archived clinical laboratory tests',
    badge: 'Navigation',
    action: () => {
      onNavigate('history');
      onClose();
    },
  });

  // Patients
  accounts.forEach((acc) => {
    items.push({
      id: `pat-${acc.id}`,
      type: 'patient',
      title: `${acc.name} (${acc.age} yrs, ${acc.gender})`,
      subtitle: `MRN: ${acc.id} • ${acc.bloodGroup} • ${acc.primaryPhysician}`,
      badge: 'Patient Account',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      action: () => {
        onSelectAccount(acc);
        onNavigate('profile');
        onClose();
      },
    });
  });

  // Reports
  reports.forEach((rep) => {
    items.push({
      id: `rep-${rep.id}`,
      type: 'report',
      title: `${rep.patientInfo.name} — ${rep.patientInfo.reportType}`,
      subtitle: `${rep.id} • ${rep.patientInfo.reportDate} • ${rep.tests.length} Biomarkers`,
      badge: rep.summary.abnormalCount > 0 ? `${rep.summary.abnormalCount} Abnormal` : 'All Normal',
      badgeColor: rep.summary.abnormalCount > 0 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200',
      action: () => {
        onSelectReport(rep);
        onNavigate('reports');
        onClose();
      },
    });
  });

  // Unique Biomarkers across reports
  const biomarkerMap = new Map<string, { report: MedicalReport; testName: string; value: string; status: string }>();
  reports.forEach((rep) => {
    rep.tests.forEach((t) => {
      if (!biomarkerMap.has(t.name.toLowerCase())) {
        biomarkerMap.set(t.name.toLowerCase(), {
          report: rep,
          testName: t.name,
          value: `${t.resultValue} ${t.unit}`,
          status: t.status,
        });
      }
    });
  });

  biomarkerMap.forEach((info) => {
    items.push({
      id: `bio-${info.testName}`,
      type: 'test',
      title: info.testName,
      subtitle: `Observed value: ${info.value} in ${info.report.patientInfo.name}'s report`,
      badge: info.status.toUpperCase(),
      badgeColor: info.status === 'normal' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200',
      action: () => {
        onSelectReport(info.report);
        onNavigate('reports');
        onClose();
      },
    });
  });

  // Filter items
  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      filtered[selectedIndex].action();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#15191E]/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
      <div 
        id="command-palette-dialog"
        className="bg-white dark:bg-[#161D26] rounded-2xl shadow-2xl border border-[#E6E2DA] dark:border-[#232D3B] w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E6E2DA] dark:border-[#232D3B] bg-[#FAF8F5] dark:bg-[#0D1117]">
          <Search className="w-4 h-4 text-[#5F6B7A] dark:text-[#8E9CAE] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search biomarkers (Hemoglobin, TSH), patients, or actions..."
            className="w-full text-xs text-[#15191E] dark:text-[#F1F5F9] placeholder:text-[#5F6B7A] dark:placeholder:text-[#8E9CAE] bg-transparent focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#5F6B7A] dark:text-[#8E9CAE] hover:text-[#15191E] dark:hover:text-white p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-[#5F6B7A] dark:text-[#8E9CAE] hover:text-[#15191E] dark:hover:text-white text-xs px-2 py-0.5 cursor-pointer font-medium"
          >
            Close
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[#E6E2DA]/60 dark:divide-[#232D3B]">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#5F6B7A] dark:text-[#8E9CAE]">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-colors text-xs ${
                    isSelected 
                      ? 'bg-[#FAF8F5] dark:bg-[#0D1117] text-[#15191E] dark:text-[#F1F5F9]' 
                      : 'text-[#15191E] dark:text-[#8E9CAE] hover:bg-[#FAF8F5] dark:hover:bg-[#0D1117]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        item.type === 'patient'
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                          : item.type === 'test'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#0D6E5D] dark:text-emerald-300'
                          : item.type === 'action'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                          : 'bg-[#FAF8F5] dark:bg-[#232D3B] text-[#5F6B7A] dark:text-[#8E9CAE]'
                      }`}
                    >
                      {item.type === 'patient' && <User className="w-3.5 h-3.5" />}
                      {item.type === 'test' && <Activity className="w-3.5 h-3.5" />}
                      {item.type === 'action' && <Sparkles className="w-3.5 h-3.5" />}
                      {item.type === 'report' && <FileText className="w-3.5 h-3.5" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#15191E] dark:text-[#F1F5F9] truncate">{item.title}</span>
                        {item.badge && (
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-md border font-semibold ${
                              item.badgeColor || 'bg-[#FAF8F5] dark:bg-[#0D1117] text-[#5F6B7A] dark:text-[#8E9CAE] border-[#E6E2DA] dark:border-[#232D3B]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] truncate">{item.subtitle}</p>
                    </div>
                  </div>

                  <ArrowRight className={`w-3.5 h-3.5 text-[#5F6B7A] dark:text-[#8E9CAE] shrink-0 ${isSelected ? 'text-[#0D6E5D] dark:text-emerald-400' : ''}`} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
