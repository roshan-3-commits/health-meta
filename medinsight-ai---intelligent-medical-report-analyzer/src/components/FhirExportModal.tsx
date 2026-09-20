import React, { useState } from 'react';
import { X, Download, Copy, Check, FileJson, ShieldCheck } from 'lucide-react';
import { MedicalReport } from '../types';
import { generateFhirR4Bundle } from '../utils/fhirExport';

interface FhirExportModalProps {
  report: MedicalReport | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FhirExportModal: React.FC<FhirExportModalProps> = ({ report, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !report) return null;

  const fhirBundle = generateFhirR4Bundle(report);
  const jsonString = JSON.stringify(fhirBundle, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FHIR_R4_${report.id}_${report.patientInfo.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#15191E]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] shadow-2xl w-full max-w-3xl overflow-hidden transition-colors flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E6E2DA] dark:border-[#232D3B] flex items-center justify-between bg-[#FAF8F5] dark:bg-[#0D1117]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[#0D6E5D] dark:text-emerald-400 flex items-center justify-center">
              <FileJson className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#15191E] dark:text-[#F1F5F9]">
                  HL7® FHIR® R4 Interoperability Payload
                </h3>
                <span className="text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-[#0D6E5D] dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Standard Compliant
                </span>
              </div>
              <p className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE]">
                DiagnosticReport + Observation bundle with standard LOINC codes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5F6B7A] hover:text-[#15191E] dark:hover:text-[#F1F5F9] hover:bg-[#FAF8F5] dark:hover:bg-[#232D3B] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Payload Viewer */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-[#0D1117] text-[#F1F5F9] font-mono text-xs">
          <pre className="overflow-x-auto p-4 rounded-xl bg-[#161D26] border border-[#232D3B] leading-relaxed text-[11px] text-emerald-300 dark:text-emerald-400">
            {jsonString}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-[#FAF8F5] dark:bg-[#0D1117] border-t border-[#E6E2DA] dark:border-[#232D3B] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE]">
            Resource: <span className="font-mono font-bold text-[#15191E] dark:text-[#F1F5F9]">Bundle (type: document)</span> • {report.tests.length} Observations
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-white dark:bg-[#161D26] border border-[#E6E2DA] dark:border-[#232D3B] rounded-xl text-xs font-bold text-[#15191E] dark:text-[#F1F5F9] hover:bg-[#FAF8F5] dark:hover:bg-[#232D3B] transition-all cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#0D6E5D]" /> : <Copy className="w-3.5 h-3.5 text-[#5F6B7A]" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-[#0D6E5D] hover:bg-[#095245] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download FHIR Bundle (.json)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
