import React, { useState } from 'react';
import { Printer, X, ShieldCheck, CheckCircle2, AlertTriangle, Hospital, Stethoscope, Download, Check } from 'lucide-react';
import { MedicalReport } from '../types';
import { downloadReportPdf } from '../utils/pdfExport';

interface PrintReportModalProps {
  report: MedicalReport | null;
  onClose: () => void;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({ report, onClose }) => {
  const [downloaded, setDownloaded] = useState(false);
  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    downloadReportPdf(report);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#15191E]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto no-print">
      <div className="bg-white dark:bg-[#161D26] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-[#E6E2DA] dark:border-[#232D3B]">
        {/* Modal Toolbar */}
        <div className="p-4 border-b border-[#E6E2DA] dark:border-[#232D3B] flex items-center justify-between bg-[#FAF8F5] dark:bg-[#0D1117] rounded-t-2xl shrink-0">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-[#5F6B7A] dark:text-[#8E9CAE]" />
            <h3 className="text-sm font-bold text-[#15191E] dark:text-[#F1F5F9]">Clinical Laboratory Summary & PDF Export</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-modal-download-pdf"
              onClick={handleDownloadPdf}
              className="px-3.5 py-1.5 bg-[#0D6E5D] hover:bg-[#095245] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              title="Download official PDF to your device"
            >
              {downloaded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Downloaded PDF</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
            <button
              id="btn-modal-print-doc"
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-[#15191E] dark:bg-[#232D3B] hover:bg-[#0D6E5D] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#5F6B7A] hover:text-[#15191E] dark:hover:text-[#F1F5F9] rounded-lg hover:bg-[#FAF8F5] dark:hover:bg-[#232D3B] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Content Area */}
        <div className="p-8 overflow-y-auto flex-1 space-y-6 text-slate-900" id="printable-report-sheet">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">MedInsight AI — Diagnostic Pathology Summary</h1>
              <p className="text-xs text-slate-600 mt-0.5">Accredited Clinical Decision Support & Biomarker Normalization</p>
              <p className="text-[11px] text-slate-500 font-mono mt-1">Laboratory Ref: {report.patientInfo.labName || 'Apex Diagnostic Labs'}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-1 rounded border border-slate-200">{report.id}</span>
              <p className="text-[11px] text-slate-500 mt-1">Date: {report.patientInfo.reportDate}</p>
            </div>
          </div>

          {/* Demographics Box */}
          <div className="grid grid-cols-4 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">Patient Name:</span>
              <span className="font-bold text-slate-900">{report.patientInfo.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Age / Gender:</span>
              <span className="font-bold text-slate-900">{report.patientInfo.age} yrs / {report.patientInfo.gender}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Report Category:</span>
              <span className="font-bold text-slate-900 truncate block">{report.patientInfo.reportType}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Attending Doctor:</span>
              <span className="font-bold text-slate-900">{report.patientInfo.referringDoctor || 'Dr. A. Verma, MD'}</span>
            </div>
          </div>

          {/* Biomarkers Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Analyzed Biomarkers & Reference Thresholds
            </h3>
            <table className="w-full text-xs text-left border border-slate-200">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Biomarker</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Observed Value</th>
                  <th className="p-2.5">Reference Range</th>
                  <th className="p-2.5 text-right">Clinical Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {report.tests.map((t) => (
                  <tr key={t.id} className={t.status !== 'normal' ? 'bg-amber-50/40 font-semibold' : ''}>
                    <td className="p-2.5 text-slate-900">{t.name}</td>
                    <td className="p-2.5 text-slate-500">{t.category}</td>
                    <td className="p-2.5 text-slate-900 font-bold">{t.resultValue} {t.unit}</td>
                    <td className="p-2.5 text-slate-600 font-mono">{t.referenceRange.text}</td>
                    <td className="p-2.5 text-right uppercase text-[11px]">
                      <span className={t.status === 'normal' ? 'text-emerald-700' : 'text-amber-700 font-bold'}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Clinical Findings & Recommendations */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-lg border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900">Key Clinical Findings:</h4>
              <ul className="space-y-1 text-slate-700">
                {report.summary.keyFindings.map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span>•</span>
                    <span>{f.summary}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900">Physician Follow-up Advice:</h4>
              <ul className="space-y-1 text-slate-700">
                {report.summary.dietaryRecommendations.slice(0, 2).map((d, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span>•</span>
                    <span>Diet: {d}</span>
                  </li>
                ))}
                {report.summary.lifestyleModifications.slice(0, 2).map((l, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span>•</span>
                    <span>Lifestyle: {l}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer & Disclaimer */}
          <div className="border-t border-slate-200 pt-4 text-[10px] text-slate-500 flex justify-between items-end">
            <div className="max-w-xl">
              <p className="font-semibold text-slate-700">Disclaimer:</p>
              <p>{report.summary.medicalDisclaimer}</p>
            </div>
            <div className="text-right border-t border-slate-300 pt-3 px-6">
              <span className="block font-serif text-slate-700 italic">Dr. A. Verma, MD</span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400">Authorized Pathologist Review</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
