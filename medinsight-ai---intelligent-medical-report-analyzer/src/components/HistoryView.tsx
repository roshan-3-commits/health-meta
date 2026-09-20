import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Eye, 
  Trash2, 
  Printer, 
  Filter, 
  FileText, 
  Calendar, 
  ArrowRight,
  Plus,
  Download
} from 'lucide-react';
import { MedicalReport, NavigationTab } from '../types';
import { downloadReportPdf } from '../utils/pdfExport';

interface HistoryViewProps {
  reports: MedicalReport[];
  onSelectReport: (report: MedicalReport) => void;
  onDeleteReport: (id: string) => void;
  onNavigate: (tab: NavigationTab) => void;
  onPrintReport: (report: MedicalReport) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  reports,
  onSelectReport,
  onDeleteReport,
  onNavigate,
  onPrintReport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'abnormal' | 'normal'>('all');

  const filtered = reports.filter((r) => {
    const matchesSearch =
      r.patientInfo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.patientInfo.reportType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const isAbnormal = r.summary.abnormalCount > 0 || r.summary.criticalCount > 0;
    if (filterStatus === 'abnormal' && !isAbnormal) return false;
    if (filterStatus === 'normal' && isAbnormal) return false;

    return true;
  });

  return (
    <div id="history-view-container" className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header Bar */}
      <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-6 shadow-[0_1px_3px_rgba(21,25,30,0.03)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#0D6E5D] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {reports.length}
            </div>
            <h2 className="text-xl font-bold text-[#15191E] dark:text-[#F1F5F9] tracking-tight">
              History of Reports
            </h2>
          </div>
          <p className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE] mt-1">
            Complete audit trail of all extracted pathology and clinical laboratory reports
          </p>
        </div>

        <button
          id="btn-history-upload-new"
          onClick={() => onNavigate('upload')}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0D6E5D] hover:bg-[#095245] text-white rounded-xl text-xs font-semibold shadow-xs active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Report</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-4 shadow-[0_1px_3px_rgba(21,25,30,0.03)] flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#5F6B7A] dark:text-[#8E9CAE] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            id="input-history-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient, test type, or ID..."
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D6E5D]/20 focus:border-[#0D6E5D] text-[#15191E] dark:text-slate-100 placeholder:text-[#5F6B7A]/60 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
          <span className="text-[#5F6B7A] dark:text-[#8E9CAE] font-medium hidden md:inline">Filter:</span>
          <div className="flex items-center bg-[#FAF8F5] dark:bg-[#0D1117] rounded-xl p-1 border border-[#E6E2DA] dark:border-[#232D3B] shadow-2xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-white dark:bg-[#161D26] text-[#15191E] dark:text-white shadow-2xs border border-[#E6E2DA] dark:border-[#232D3B]'
                  : 'text-[#5F6B7A] dark:text-[#8E9CAE] hover:text-[#15191E] dark:hover:text-white'
              }`}
            >
              All ({reports.length})
            </button>
            <button
              onClick={() => setFilterStatus('abnormal')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                filterStatus === 'abnormal'
                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 shadow-2xs'
                  : 'text-[#5F6B7A] dark:text-[#8E9CAE] hover:text-[#15191E] dark:hover:text-white'
              }`}
            >
              Abnormal ({reports.filter((r) => r.summary.abnormalCount > 0).length})
            </button>
            <button
              onClick={() => setFilterStatus('normal')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                filterStatus === 'normal'
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-[#0D6E5D] dark:text-emerald-300 shadow-2xs'
                  : 'text-[#5F6B7A] dark:text-[#8E9CAE] hover:text-[#15191E] dark:hover:text-white'
              }`}
            >
              Normal ({reports.filter((r) => r.summary.abnormalCount === 0).length})
            </button>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] shadow-[0_1px_3px_rgba(21,25,30,0.03)] overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] dark:bg-[#0D1117] border-b border-[#E6E2DA] dark:border-[#232D3B] text-[#5F6B7A] dark:text-[#8E9CAE] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">ID</th>
                <th className="py-3.5 px-4">Patient Name</th>
                <th className="py-3.5 px-4">Report Type</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Parameters</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E2DA]/60 dark:divide-[#232D3B]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#5F6B7A] dark:text-[#8E9CAE]">
                    No medical reports match your search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((report) => {
                  const isAbnormal = report.summary.abnormalCount > 0 || report.summary.criticalCount > 0;
                  return (
                    <tr
                      key={report.id}
                      id={`history-row-${report.id}`}
                      className="hover:bg-[#FAF8F5]/60 dark:hover:bg-[#1C2530]/60 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#15191E] dark:text-slate-300">
                        {report.id.replace('REP-', '')}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#15191E] dark:text-white">
                        {report.patientInfo.name}
                      </td>
                      <td className="py-3.5 px-4 text-[#15191E] dark:text-slate-300">
                        <span className="truncate block max-w-xs">{report.patientInfo.reportType}</span>
                      </td>
                      <td className="py-3.5 px-4 text-[#5F6B7A] dark:text-[#8E9CAE] whitespace-nowrap">
                        {report.patientInfo.reportDate}
                      </td>
                      <td className="py-3.5 px-4 text-[#5F6B7A] dark:text-[#8E9CAE]">
                        {report.tests.length} tests
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            isAbnormal
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                              : 'bg-emerald-50 dark:bg-emerald-950/60 text-[#0D6E5D] dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          }`}
                        >
                          {isAbnormal ? 'Abnormal' : 'Normal'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            id={`btn-view-${report.id}`}
                            onClick={() => onSelectReport(report)}
                            className="px-3 py-1.5 text-xs font-bold text-[#0D6E5D] dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200/80 dark:border-emerald-800/80 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                            title="View Full Report Analysis"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
                          <button
                            id={`btn-download-pdf-${report.id}`}
                            onClick={() => downloadReportPdf(report)}
                            className="p-1.5 text-[#0D6E5D] dark:text-emerald-400 hover:text-[#095245] dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-xl transition-all cursor-pointer"
                            title="Download Official PDF Report"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onPrintReport(report)}
                            className="p-1.5 text-[#5F6B7A] hover:text-[#15191E] dark:hover:text-slate-200 hover:bg-[#FAF8F5] dark:hover:bg-[#232D3B] rounded-xl transition-all cursor-pointer"
                            title="Print Report"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          {!report.isDemo && (
                            <button
                              onClick={() => onDeleteReport(report.id)}
                              className="p-1.5 text-[#5F6B7A] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-all cursor-pointer"
                              title="Delete Report"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
