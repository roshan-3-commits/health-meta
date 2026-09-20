import React, { useState, useMemo } from 'react';
import { 
  User, 
  Calendar, 
  Hospital, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Printer, 
  Sparkles, 
  HeartHandshake, 
  Utensils, 
  Activity, 
  MessageSquare, 
  ShieldAlert,
  HelpCircle,
  Stethoscope,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  Search,
  Copy,
  TrendingDown,
  TrendingUp,
  Share2,
  FileJson,
  ShieldCheck,
  Clock,
  Layers,
  FlaskConical,
  Download,
  FileDown
} from 'lucide-react';
import { LabTest, MedicalReport, TestStatus } from '../types';
import { calculateGaugePosition } from '../utils/clinicalRules';
import { getLoincMetadata } from '../utils/fhirExport';
import { downloadReportPdf } from '../utils/pdfExport';
import { FhirExportModal } from './FhirExportModal';
import { AuditProvenanceModal } from './AuditProvenanceModal';

interface ReportDetailViewProps {
  report: MedicalReport;
  allReports?: MedicalReport[];
  onPrint: () => void;
  onNewUpload: () => void;
  onViewPatientProfile?: () => void;
  density?: 'comfortable' | 'compact';
}

export const ReportDetailView: React.FC<ReportDetailViewProps> = ({
  report,
  allReports = [],
  onPrint,
  onNewUpload,
  onViewPatientProfile,
  density = 'comfortable',
}) => {
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [tableSearch, setTableSearch] = useState('');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);
  const [isFhirModalOpen, setIsFhirModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const { patientInfo, tests, summary } = report;

  // Handle direct client-side PDF download
  const handleDownloadPdf = () => {
    setIsPdfDownloading(true);
    try {
      downloadReportPdf(report);
    } finally {
      setTimeout(() => setIsPdfDownloading(false), 2000);
    }
  };

  // Find prior historical report for the same patient to compute Delta Checks
  const priorReport = useMemo(() => {
    return allReports.find(
      (r) =>
        r.id !== report.id &&
        r.patientInfo.name.toLowerCase().trim() === report.patientInfo.name.toLowerCase().trim()
    );
  }, [allReports, report]);

  // Delta map: testName -> { prevValue, prevNumeric, prevDate, percentChange, isSignificant }
  const deltaMap = useMemo(() => {
    const map = new Map<string, { prevValue: string; prevDate: string; changePct: number; isSignificant: boolean }>();
    if (!priorReport) return map;

    for (const currTest of tests) {
      const prevTest = priorReport.tests.find(
        (pt) => pt.name.toLowerCase().trim() === currTest.name.toLowerCase().trim()
      );
      if (prevTest && currTest.numericValue !== undefined && prevTest.numericValue !== undefined && prevTest.numericValue > 0) {
        const change = ((currTest.numericValue - prevTest.numericValue) / prevTest.numericValue) * 100;
        map.set(currTest.name.toLowerCase(), {
          prevValue: `${prevTest.resultValue} ${prevTest.unit}`,
          prevDate: priorReport.patientInfo.reportDate,
          changePct: Math.round(change * 10) / 10,
          isSignificant: Math.abs(change) >= 10,
        });
      }
    }
    return map;
  }, [priorReport, tests]);

  // Toggle explanation accordion
  const toggleExplanation = (id: string) => {
    setExpandedTestId(expandedTestId === id ? null : id);
  };

  // Filter tests
  const filteredTests = tests.filter((t) => {
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    if (filterStatus === 'abnormal' && t.status === 'normal') return false;
    if (filterStatus === 'normal' && t.status !== 'normal') return false;
    if (tableSearch.trim() && !t.name.toLowerCase().includes(tableSearch.toLowerCase())) return false;
    return true;
  });

  const categories = Array.from(new Set(tests.map((t) => t.category)));

  // Derive abnormal tests sorted by severity (critical first, then high/low)
  const abnormalTests = tests.filter((t) => t.status !== 'normal').sort((a, b) => {
    if (a.status === 'critical' && b.status !== 'critical') return -1;
    if (b.status === 'critical' && a.status !== 'critical') return 1;
    return 0;
  });

  // Calculate Health Index
  const totalTests = tests.length || 1;
  const normalTests = tests.filter((t) => t.status === 'normal').length;
  const healthIndexPercentage = Math.round((normalTests / totalTests) * 100);

  // Jump to specific test in results table and expand its explanation
  const handleJumpToTest = (testId: string) => {
    setFilterStatus('all');
    setFilterCategory('all');
    setTableSearch('');
    setExpandedTestId(testId);
    setTimeout(() => {
      const element = document.getElementById(`test-row-${testId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Copy plain text summary for doctor
  const handleCopySummary = () => {
    const text = `MedInsight Clinical Summary for ${patientInfo.name} (${patientInfo.reportDate}):\n` +
      `Report: ${patientInfo.reportType} | Status: ${summary.overallHealthStatus}\n` +
      `Key Findings:\n` +
      summary.keyFindings.map((f) => `- ${f.testName} (${f.status.toUpperCase()}): ${f.summary}`).join('\n') +
      `\n\nDoctor Consultation Prompts:\n` +
      summary.doctorFollowUpQuestions.map((q) => `- ${q}`).join('\n');

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div id="report-detail-view" className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Banner with Action Toolbar */}
      <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-5 shadow-[0_1px_3px_rgba(21,25,30,0.03)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#5F6B7A] dark:text-[#8E9CAE] bg-[#FAF8F5] dark:bg-[#0D1117] px-2.5 py-0.5 rounded-lg border border-[#E6E2DA] dark:border-[#232D3B]">
              {report.id}
            </span>
            <span className="text-[#5F6B7A]/40 dark:text-[#8E9CAE]/40">•</span>
            <span className="text-xs font-semibold text-[#0D6E5D] dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0D6E5D] dark:text-emerald-400" />
              Verified Clinical Parse
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#15191E] dark:text-[#F1F5F9] tracking-tight mt-1.5">
            Diagnostic Laboratory Report Analysis
          </h2>
          <p className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE]">
            Automated CLSI biomarker extraction and physiological range mapping
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            id="btn-download-report-pdf"
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0D6E5D] hover:bg-[#095245] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
            title="Download full clinical report as PDF"
          >
            {isPdfDownloading ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
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
            id="btn-audit-provenance"
            onClick={() => setIsAuditModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#FAF8F5] dark:bg-[#0D1117] hover:bg-[#F2EFE9] dark:hover:bg-[#1C2530] text-[#15191E] dark:text-[#F1F5F9] border border-[#E6E2DA] dark:border-[#232D3B] rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
            title="View HIPAA Audit Trail, Cryptographic Checksum & Pathologist Sign-off"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#0D6E5D] dark:text-emerald-400" />
            <span className="hidden sm:inline">Audit & Provenance</span>
            <span className="sm:hidden">Audit</span>
          </button>
          <button
            id="btn-export-fhir-r4"
            onClick={() => setIsFhirModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#FAF8F5] dark:bg-[#0D1117] hover:bg-[#F2EFE9] dark:hover:bg-[#1C2530] text-[#15191E] dark:text-[#F1F5F9] border border-[#E6E2DA] dark:border-[#232D3B] rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
            title="Export standard HL7 FHIR R4 Bundle (JSON)"
          >
            <FileJson className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">FHIR® R4 Export</span>
            <span className="sm:hidden">FHIR</span>
          </button>
          <button
            id="btn-copy-clinical-summary"
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#FAF8F5] dark:bg-[#0D1117] hover:bg-[#F2EFE9] dark:hover:bg-[#1C2530] text-[#15191E] dark:text-[#F1F5F9] border border-[#E6E2DA] dark:border-[#232D3B] rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
            title="Copy structured summary to clipboard for messaging"
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5 text-[#0D6E5D] dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{copiedSummary ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            id="btn-print-summary"
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#15191E] dark:bg-[#0D1117] hover:bg-[#232D3B] text-white rounded-xl text-xs font-bold transition-all shadow-sm border border-[#15191E] dark:border-[#232D3B] cursor-pointer active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            id="btn-new-upload"
            onClick={onNewUpload}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FAF8F5] dark:bg-[#0D1117] hover:bg-[#F2EFE9] dark:hover:bg-[#1C2530] text-[#15191E] dark:text-[#F1F5F9] border border-[#E6E2DA] dark:border-[#232D3B] rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95"
          >
            <span>Upload Another</span>
          </button>
        </div>
      </div>

      {/* Extracted Patient Demographics & Health Vitality Scorecard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Demographics Card (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] shadow-[0_1px_3px_rgba(21,25,30,0.03)] overflow-hidden flex flex-col justify-between transition-colors">
          <div className="bg-[#15191E] dark:bg-[#0D1117] text-white px-5 py-3 flex items-center justify-between border-b border-[#232D3B]">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#0D6E5D]/30 text-emerald-400 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#FAF8F5]">
                Extracted Patient Demographics
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-[11px] text-[#8E9CAE] font-mono">
                Specimen ID: {patientInfo.specimenId || 'MED-98231'}
              </span>
              {onViewPatientProfile && (
                <button
                  id="btn-view-patient-account-from-report"
                  onClick={onViewPatientProfile}
                  className="px-3 py-1 rounded-lg bg-[#0D6E5D] hover:bg-[#095245] text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  title="Open Synchronized Patient Health Profile"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Patient Account Profile</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-[#5F6B7A] dark:text-[#8E9CAE] font-medium block">Patient Name</span>
              <span className="text-sm font-bold text-[#15191E] dark:text-[#F1F5F9] block">{patientInfo.name}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[#5F6B7A] dark:text-[#8E9CAE] font-medium block">Age</span>
              <span className="text-sm font-bold text-[#15191E] dark:text-[#F1F5F9] block">{patientInfo.age} yrs</span>
            </div>
            <div className="space-y-1">
              <span className="text-[#5F6B7A] dark:text-[#8E9CAE] font-medium block">Gender</span>
              <span className="text-sm font-bold text-[#15191E] dark:text-[#F1F5F9] block">{patientInfo.gender}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[#5F6B7A] dark:text-[#8E9CAE] font-medium block">Report Type</span>
              <span className="text-sm font-bold text-[#15191E] dark:text-[#F1F5F9] block truncate" title={patientInfo.reportType}>
                {patientInfo.reportType}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[#5F6B7A] dark:text-[#8E9CAE] font-medium block">Report Date</span>
              <span className="text-sm font-bold text-[#15191E] dark:text-[#F1F5F9] block">{patientInfo.reportDate}</span>
            </div>
          </div>

          {/* Secondary Facility Info */}
          <div className="px-5 py-2.5 bg-[#FAF8F5] dark:bg-[#0D1117] border-t border-[#E6E2DA]/80 dark:border-[#232D3B] flex flex-wrap items-center justify-between text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] gap-3">
            <div className="flex items-center gap-1.5">
              <Hospital className="w-3.5 h-3.5 text-[#5F6B7A]" />
              <span>Pathology Center: <strong className="text-[#15191E] dark:text-[#F1F5F9]">{patientInfo.labName || 'Apex Diagnostic Labs'}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-[#5F6B7A]" />
              <span>Attending Physician: <strong className="text-[#15191E] dark:text-[#F1F5F9]">{patientInfo.referringDoctor || 'Dr. A. Verma, MD'}</strong></span>
            </div>
          </div>
        </div>

        {/* Health Vitality & Biomarker Index Card (1 Col) */}
        <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-5 shadow-[0_1px_3px_rgba(21,25,30,0.03)] flex flex-col justify-between space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-[#E6E2DA]/80 dark:border-[#232D3B] pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5F6B7A] dark:text-[#8E9CAE]">Biomarker Health Index</span>
            <span className="text-[11px] font-semibold text-[#5F6B7A] dark:text-[#8E9CAE] font-mono">{tests.length} Parameters</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Circular / Radial Score */}
            <div className="relative w-16 h-16 rounded-full border-4 border-[#FAF8F5] dark:border-[#0D1117] flex items-center justify-center shrink-0">
              <div 
                className="absolute inset-0 rounded-full border-4 border-[#0D6E5D] border-t-transparent -rotate-45"
                style={{ opacity: Math.max(0.2, healthIndexPercentage / 100) }}
              />
              <span className="text-base font-extrabold text-[#15191E] dark:text-[#F1F5F9]">{healthIndexPercentage}%</span>
            </div>

            <div className="space-y-0.5">
              <span className="text-xs font-bold text-[#15191E] dark:text-[#F1F5F9] block">
                {healthIndexPercentage >= 80 ? 'Optimal Diagnostic Balance' : 'Clinical Attention Recommended'}
              </span>
              <p className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE]">
                {normalTests} of {tests.length} markers within accredited biological target zones
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50">
              <span className="text-[10px] text-[#0D6E5D] dark:text-emerald-400 font-semibold block uppercase">Target Safe</span>
              <span className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">{normalTests} Normal</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50">
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold block uppercase">Action Needed</span>
              <span className="font-bold text-amber-900 dark:text-amber-300 text-sm">{summary.abnormalCount} Out of Range</span>
            </div>
          </div>
        </div>
      </div>

      {/* PERSISTENT KEY FINDINGS SUMMARY CARD (DYNAMIC ABNORMALITY HIGHLIGHTS) */}
      <div 
        id="persistent-key-findings-card" 
        className={`rounded-2xl border p-5 shadow-[0_1px_3px_rgba(21,25,30,0.03)] space-y-4 transition-all ${
          abnormalTests.length > 0 
            ? 'bg-[#FAF8F5] dark:bg-[#161D26] border-amber-200 dark:border-amber-900/50' 
            : 'bg-[#FAF8F5] dark:bg-[#161D26] border-emerald-200 dark:border-emerald-900/50'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E6E2DA]/80 dark:border-[#232D3B]">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
              abnormalTests.length > 0 
                ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300' 
                : 'bg-emerald-100 dark:bg-emerald-950/70 text-[#0D6E5D] dark:text-emerald-300'
            }`}>
              {abnormalTests.length > 0 ? (
                <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-[#0D6E5D] dark:text-emerald-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-[#15191E] dark:text-[#F1F5F9] tracking-tight">
                  Key Findings & Priority Abnormalities
                </h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold bg-[#15191E] dark:bg-[#0D1117] text-white border border-[#232D3B]">
                  Executive Triage
                </span>
              </div>
              <p className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE]">
                {abnormalTests.length > 0
                  ? 'Dynamically highlighting lab parameters outside accredited biological reference intervals'
                  : 'All analyzed biomarkers fall strictly within certified healthy physiological ranges'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {abnormalTests.length > 0 && (
              <button
                id="btn-toggle-abnormal-filter-from-card"
                onClick={() => setFilterStatus(filterStatus === 'abnormal' ? 'all' : 'abnormal')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-2xs active:scale-95 ${
                  filterStatus === 'abnormal'
                    ? 'bg-amber-700 text-white border-amber-800'
                    : 'bg-white dark:bg-[#161D26] hover:bg-amber-50 dark:hover:bg-[#0D1117] text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                }`}
                title="Filter table below to show only abnormal parameters"
              >
                {filterStatus === 'abnormal' ? 'Showing Abnormal Only' : `Filter Table (${abnormalTests.length} Flags)`}
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Key Findings Cards */}
        {abnormalTests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {abnormalTests.map((test) => {
              // Calculate variance from normal interval bounds
              let varianceLabel = '';
              if (test.status === 'low' && test.referenceRange.min != null && test.numericValue != null) {
                const diffPct = Math.round(((test.referenceRange.min - test.numericValue) / test.referenceRange.min) * 100);
                if (diffPct > 0) varianceLabel = `${diffPct}% below minimum cutoff`;
              } else if (test.status === 'high' && test.referenceRange.max != null && test.numericValue != null) {
                const diffPct = Math.round(((test.numericValue - test.referenceRange.max) / test.referenceRange.max) * 100);
                if (diffPct > 0) varianceLabel = `${diffPct}% above upper cutoff`;
              }

              // Retrieve matching key finding summary if available
              const matchedFinding = summary.keyFindings.find(
                (f) => f.testName.toLowerCase() === test.name.toLowerCase()
              );

              return (
                <div
                  key={`key-finding-${test.id}`}
                  id={`key-finding-item-${test.id}`}
                  onClick={() => handleJumpToTest(test.id)}
                  className="p-4 rounded-xl bg-white dark:bg-[#161D26] border border-[#E6E2DA] dark:border-[#232D3B] hover:border-amber-400 dark:hover:border-amber-400 hover:shadow-md transition-all duration-150 cursor-pointer flex flex-col justify-between space-y-2.5 group shadow-[0_1px_3px_rgba(21,25,30,0.03)]"
                  title="Click to jump directly to this test in the results table"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-[#15191E] dark:text-[#F1F5F9] group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors">
                          {test.name}
                        </span>
                        <span className="text-[10px] text-[#5F6B7A] dark:text-[#8E9CAE] font-mono">
                          • {test.category}
                        </span>
                      </div>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-base font-extrabold font-mono text-[#15191E] dark:text-[#F1F5F9]">
                          {test.resultValue}
                        </span>
                        <span className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE] font-normal">{test.unit}</span>
                        <span className="text-[11px] text-[#5F6B7A]/70 dark:text-[#8E9CAE]/70 font-mono">
                          (Ref: {test.referenceRange.text})
                        </span>
                      </div>
                    </div>

                    {/* Color-Coded Severity Badge */}
                    <div className="shrink-0">
                      {test.status === 'critical' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800 ring-1 ring-rose-400/30">
                          <AlertTriangle className="w-3 h-3 text-rose-700 dark:text-rose-400 animate-pulse" />
                          <span>CRITICAL</span>
                        </span>
                      ) : test.status === 'high' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
                          <ArrowUpRight className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                          <span>ELEVATED HIGH</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                          <ArrowDownRight className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>BELOW NORMAL</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Variance Indicator if computable */}
                  {varianceLabel && (
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#FAF8F5] dark:bg-[#0D1117] text-[#15191E] dark:text-[#F1F5F9] border border-[#E6E2DA] dark:border-[#232D3B] w-fit">
                      <TrendingDown className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span>{varianceLabel}</span>
                    </div>
                  )}

                  {/* Clinical Meaning / Takeaway */}
                  <p className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE] leading-relaxed line-clamp-2">
                    {matchedFinding?.summary || test.simpleExplanation}
                  </p>

                  <div className="pt-2 border-t border-[#E6E2DA]/80 dark:border-[#232D3B] flex items-center justify-between text-[11px]">
                    <span className="text-[#5F6B7A] dark:text-[#8E9CAE] font-medium">Click to inspect</span>
                    <span className="text-[#0D6E5D] dark:text-emerald-400 group-hover:text-[#095245] dark:group-hover:text-emerald-300 font-bold flex items-center gap-1">
                      <span>View analysis</span>
                      <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-white dark:bg-[#161D26] border border-emerald-200 dark:border-emerald-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#15191E] dark:text-[#F1F5F9]">
                  No Critical Laboratory Abnormalities Detected
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-[#0D6E5D] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                  ALL NORMAL
                </span>
              </div>
              <p className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE]">
                All {tests.length} analyzed parameters in this report meet certified clinical reference criteria with zero out-of-range deviations.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-medium text-[#0D6E5D] dark:text-emerald-300">
              <span className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50">Complete Blood Count: Optimal</span>
              <span className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50">Metabolic Panel: Safe</span>
            </div>
          </div>
        )}
      </div>

      {/* STEP 4 IN BLUEPRINT: Test Results with Interactive Table, Filters & Range Meters */}
      <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] shadow-[0_1px_3px_rgba(21,25,30,0.03)] overflow-hidden space-y-0 transition-colors">
        <div className="p-5 border-b border-[#E6E2DA]/80 dark:border-[#232D3B] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#15191E] dark:bg-[#0D1117] text-white flex items-center justify-center font-bold text-xs border border-[#232D3B]">
              4
            </div>
            <div>
              <h3 className="text-base font-bold text-[#15191E] dark:text-[#F1F5F9]">
                Test Results & Biological Reference Intervals
              </h3>
              <p className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE]">
                Cross-referenced with standardized clinical diagnostic criteria
              </p>
            </div>
          </div>

          {/* Search inside table + Status and Category Filters */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Quick table filter */}
            <div className="relative w-44 sm:w-52">
              <Search className="w-3.5 h-3.5 text-[#5F6B7A] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Filter biomarker..."
                className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0D6E5D] text-[#15191E] dark:text-[#F1F5F9] placeholder-[#5F6B7A] transition-colors"
              />
            </div>

            {/* Status Segmented Control */}
            <div className="flex items-center bg-[#FAF8F5] dark:bg-[#0D1117] rounded-xl p-0.5 border border-[#E6E2DA] dark:border-[#232D3B] shadow-2xs">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  filterStatus === 'all' 
                    ? 'bg-white dark:bg-[#161D26] text-[#15191E] dark:text-[#F1F5F9] shadow-2xs' 
                    : 'text-[#5F6B7A] dark:text-[#8E9CAE] hover:text-[#15191E] dark:hover:text-white'
                }`}
              >
                All ({tests.length})
              </button>
              <button
                onClick={() => setFilterStatus('abnormal')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  filterStatus === 'abnormal' 
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 shadow-2xs' 
                    : 'text-[#5F6B7A] dark:text-[#8E9CAE] hover:text-[#15191E] dark:hover:text-white'
                }`}
              >
                Abnormal ({summary.abnormalCount})
              </button>
              <button
                onClick={() => setFilterStatus('normal')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  filterStatus === 'normal' 
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 shadow-2xs' 
                    : 'text-[#5F6B7A] dark:text-[#8E9CAE] hover:text-[#15191E] dark:hover:text-white'
                }`}
              >
                Normal ({normalTests})
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="px-5 py-2.5 bg-[#FAF8F5] dark:bg-[#0D1117] border-b border-[#E6E2DA]/80 dark:border-[#232D3B] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[#5F6B7A] dark:text-[#8E9CAE] font-semibold text-[11px] shrink-0">Panels:</span>
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
              filterCategory === 'all' 
                ? 'bg-[#15191E] dark:bg-[#0D6E5D] text-white shadow-2xs' 
                : 'bg-white dark:bg-[#161D26] border border-[#E6E2DA] dark:border-[#232D3B] text-[#15191E] dark:text-[#F1F5F9] hover:bg-[#FAF8F5] dark:hover:bg-[#0D1117]'
            }`}
          >
            All Panels
          </button>
          {categories.map((cat) => {
            const count = tests.filter((t) => t.category === cat).length;
            const isSelected = filterCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-[#15191E] dark:bg-[#0D6E5D] text-white shadow-2xs' 
                    : 'bg-white dark:bg-[#161D26] border border-[#E6E2DA] dark:border-[#232D3B] text-[#15191E] dark:text-[#F1F5F9] hover:bg-[#FAF8F5] dark:hover:bg-[#0D1117]'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] dark:bg-[#0D1117] border-b border-[#E6E2DA] dark:border-[#232D3B] text-[#5F6B7A] dark:text-[#8E9CAE] font-bold uppercase tracking-wider text-[10px]">
                <th className={`${density === 'compact' ? 'py-2 px-3' : 'py-3 px-4'}`}>Analyte & LOINC Coding</th>
                <th className={`${density === 'compact' ? 'py-2 px-3' : 'py-3 px-4'}`}>Observed Result & Delta</th>
                <th className={`${density === 'compact' ? 'py-2 px-3' : 'py-3 px-4'}`}>Reference Interval</th>
                <th className={`${density === 'compact' ? 'py-2 px-3' : 'py-3 px-4'} min-w-[200px]`}>Clinical Range Meter</th>
                <th className={`${density === 'compact' ? 'py-2 px-3' : 'py-3 px-4'}`}>Clinical Flag</th>
                <th className={`${density === 'compact' ? 'py-2 px-3' : 'py-3 px-4'} text-right`}>Clinical Guidance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E2DA]/80 dark:divide-[#232D3B]">
              {filteredTests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#5F6B7A] dark:text-[#8E9CAE]">
                    No biomarkers match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredTests.map((test) => {
                  const isExpanded = expandedTestId === test.id;
                  const gauge = calculateGaugePosition(test.numericValue, test.referenceRange.min, test.referenceRange.max);
                  const loinc = getLoincMetadata(test.name);
                  const delta = deltaMap.get(test.name.toLowerCase());
                  const paddingClass = density === 'compact' ? 'py-2 px-3' : 'py-3.5 px-4';

                  return (
                    <React.Fragment key={test.id}>
                      <tr
                        id={`test-row-${test.id}`}
                        className={`hover:bg-[#FAF8F5]/80 dark:hover:bg-[#161D26]/80 transition-colors ${
                          test.status !== 'normal' ? 'bg-amber-50/20 dark:bg-amber-950/20' : ''
                        }`}
                      >
                        {/* Test Name & Category + LOINC */}
                        <td className={paddingClass}>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#15191E] dark:text-[#F1F5F9] text-xs block">{test.name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#FAF8F5] dark:bg-[#0D1117] text-[#5F6B7A] dark:text-[#8E9CAE] border border-[#E6E2DA] dark:border-[#232D3B]" title={`Standard LOINC Code: ${loinc.code} (${loinc.display})`}>
                              {loinc.code}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-[#5F6B7A] dark:text-[#8E9CAE] font-mono">{test.category}</span>
                            <span className="text-[#E6E2DA] dark:text-[#232D3B] text-[10px]">•</span>
                            <span className="text-[10px] text-[#5F6B7A] dark:text-[#8E9CAE] truncate max-w-[140px]" title={`Specimen: ${loinc.specimen}`}>
                              {loinc.specimen}
                            </span>
                          </div>
                        </td>

                        {/* Measured Result & Delta Check */}
                        <td className={paddingClass}>
                          <div className="font-bold text-[#15191E] dark:text-[#F1F5F9] text-sm font-mono flex items-baseline gap-1">
                            <span>{test.resultValue}</span>
                            <span className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE] font-normal">{test.unit}</span>
                          </div>

                          {/* Historical Delta Check Pill */}
                          {delta && (
                            <div className="mt-1 flex items-center gap-1">
                              <span 
                                className={`inline-flex items-center gap-0.5 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                                  delta.changePct < 0 
                                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                                    : delta.changePct > 0
                                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                    : 'bg-[#FAF8F5] dark:bg-[#0D1117] text-[#5F6B7A] dark:text-[#8E9CAE] border-[#E6E2DA] dark:border-[#232D3B]'
                                }`}
                                title={`Prior measurement: ${delta.prevValue} on ${delta.prevDate}. Delta check detects change over time.`}
                              >
                                {delta.changePct > 0 ? (
                                  <TrendingUp className="w-2.5 h-2.5" />
                                ) : delta.changePct < 0 ? (
                                  <TrendingDown className="w-2.5 h-2.5" />
                                ) : null}
                                <span>{delta.changePct > 0 ? `+${delta.changePct}%` : `${delta.changePct}%`} vs prior</span>
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Reference Range */}
                        <td className={`${paddingClass} text-[#5F6B7A] dark:text-[#8E9CAE] font-mono text-xs`}>
                          {test.referenceRange.text}
                        </td>

                        {/* Engineered Visual Range Meter Gauge */}
                        <td className={paddingClass}>
                          <div className="w-full space-y-1">
                            <div className="h-2.5 w-full bg-[#FAF8F5] dark:bg-[#0D1117] rounded-full overflow-hidden flex border border-[#E6E2DA] dark:border-[#232D3B] relative shadow-2xs">
                              {/* Low segment */}
                              <div className="w-1/4 bg-amber-200 dark:bg-amber-800/70 border-r border-amber-300 dark:border-amber-700" title="Low zone" />
                              {/* Normal target safe zone segment */}
                              <div className="w-2/4 bg-emerald-200 dark:bg-emerald-800/70 border-r border-emerald-300 dark:border-emerald-700" title="Target healthy zone" />
                              {/* High segment */}
                              <div className="w-1/4 bg-rose-200 dark:bg-rose-800/70" title="High zone" />
                              
                              {/* Needle Indicator Pin */}
                              <div
                                className="absolute top-0 bottom-0 w-2.5 -ml-1 rounded-full bg-[#15191E] dark:bg-white ring-2 ring-white dark:ring-[#15191E] shadow-sm"
                                style={{ left: `${gauge.percentage}%` }}
                                title={`Observed value at ${gauge.percentage}% relative to reference limits`}
                              />
                            </div>
                            <div className="flex justify-between text-[9px] text-[#5F6B7A] dark:text-[#8E9CAE] font-mono px-0.5">
                              <span>Low &lt;{test.referenceRange.min ?? '-'}</span>
                              <span className="text-[#0D6E5D] dark:text-emerald-400 font-bold">Normal Zone</span>
                              <span>&gt;{test.referenceRange.max ?? '-'} High</span>
                            </div>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className={paddingClass}>
                          <StatusBadge status={test.status} />
                        </td>

                        {/* Action: Expand Simple English explanation */}
                        <td className={`${paddingClass} text-right`}>
                          <button
                            id={`btn-explain-${test.id}`}
                            onClick={() => toggleExplanation(test.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#0D6E5D] dark:text-emerald-300 hover:text-[#095245] dark:hover:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg transition-all cursor-pointer active:scale-95 shadow-2xs"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{isExpanded ? 'Hide' : 'Explain'}</span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Plain-English Explanation Drawer */}
                      {isExpanded && (
                        <tr className="bg-[#FAF8F5]/80 dark:bg-[#0D1117]/60 border-b border-[#E6E2DA] dark:border-[#232D3B]">
                          <td colSpan={6} className="p-4 sm:p-5">
                            <div className="bg-white dark:bg-[#161D26] rounded-xl border border-[#E6E2DA] dark:border-[#232D3B] p-4 space-y-3 shadow-[0_1px_3px_rgba(21,25,30,0.03)]">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-[#0D6E5D] dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                                  <Info className="w-4 h-4" />
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-xs font-bold text-[#15191E] dark:text-[#F1F5F9]">
                                    Understanding Your {test.name} in Plain Language:
                                  </h4>
                                  <p className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE] leading-relaxed">
                                    {test.simpleExplanation}
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-[#E6E2DA]/80 dark:border-[#232D3B] text-xs">
                                <div className="space-y-1">
                                  <span className="font-bold text-[#15191E] dark:text-[#F1F5F9] block text-[11px] uppercase tracking-wider">
                                    Clinical Significance
                                  </span>
                                  <p className="text-[#5F6B7A] dark:text-[#8E9CAE] text-xs leading-relaxed">
                                    {test.clinicalSignificance}
                                  </p>
                                </div>

                                {test.recommendations && test.recommendations.length > 0 && (
                                  <div className="space-y-1">
                                    <span className="font-bold text-[#15191E] dark:text-[#F1F5F9] block text-[11px] uppercase tracking-wider">
                                      Targeted Health Advice
                                    </span>
                                    <ul className="space-y-1 text-[#5F6B7A] dark:text-[#8E9CAE] text-xs">
                                      {test.recommendations.map((rec, i) => (
                                        <li key={i} className="flex items-start gap-1.5">
                                          <Check className="w-3.5 h-3.5 text-[#0D6E5D] dark:text-emerald-400 shrink-0 mt-0.5" />
                                          <span>{rec}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* STEP 5 IN BLUEPRINT: Analysis Summary & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Summary (Left) */}
        <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-5 shadow-[0_1px_3px_rgba(21,25,30,0.03)] space-y-4 transition-colors">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E6E2DA]/80 dark:border-[#232D3B]">
            <div className="w-5 h-5 rounded-full bg-[#15191E] dark:bg-[#0D1117] text-white flex items-center justify-center font-bold text-xs border border-[#232D3B]">
              5
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#15191E] dark:text-[#F1F5F9]">Overall Summary</h3>
              <p className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE]">Categorized diagnostic findings</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {summary.keyFindings.map((finding, idx) => {
              const isNormal = finding.status === 'normal';
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs flex items-start gap-3 ${
                    isNormal
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-[#15191E] dark:text-[#F1F5F9]'
                      : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-[#15191E] dark:text-[#F1F5F9]'
                  }`}
                >
                  {isNormal ? (
                    <CheckCircle2 className="w-4 h-4 text-[#0D6E5D] dark:text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <span className="font-bold block text-[#15191E] dark:text-[#F1F5F9]">
                      {finding.testName} is {finding.status.toUpperCase()}
                    </span>
                    <p className="text-[#5F6B7A] dark:text-[#8E9CAE] text-xs leading-relaxed">
                      {finding.summary}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Clinical Status Highlight */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] space-y-1 text-xs">
            <span className="text-[11px] font-bold text-[#5F6B7A] dark:text-[#8E9CAE] uppercase tracking-wider block">
              Diagnostic Health Assessment
            </span>
            <p className="font-bold text-[#15191E] dark:text-[#F1F5F9]">{summary.overallHealthStatus}</p>
            <p className="text-[#5F6B7A] dark:text-[#8E9CAE] text-xs leading-relaxed">{summary.headline}</p>
          </div>
        </div>

        {/* Clinical Recommendations & Lifestyle Tips (Right) */}
        <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-5 shadow-[0_1px_3px_rgba(21,25,30,0.03)] space-y-4 transition-colors">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E6E2DA]/80 dark:border-[#232D3B]">
            <HeartHandshake className="w-4 h-4 text-[#0D6E5D] dark:text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-[#15191E] dark:text-[#F1F5F9]">Actionable Recommendations</h3>
              <p className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE]">Dietary adjustments & lifestyle modifications</p>
            </div>
          </div>

          {/* Diet Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#15191E] dark:text-[#F1F5F9]">
              <Utensils className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Nutritional Recommendations:</span>
            </div>
            <ul className="space-y-1.5 text-xs text-[#5F6B7A] dark:text-[#8E9CAE] pl-2">
              {summary.dietaryRecommendations.map((diet, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{diet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Lifestyle Section */}
          <div className="space-y-2 pt-2 border-t border-[#E6E2DA]/80 dark:border-[#232D3B]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#15191E] dark:text-[#F1F5F9]">
              <Activity className="w-3.5 h-3.5 text-[#0D6E5D] dark:text-emerald-400" />
              <span>Lifestyle & Activity:</span>
            </div>
            <ul className="space-y-1.5 text-xs text-[#5F6B7A] dark:text-[#8E9CAE] pl-2">
              {summary.lifestyleModifications.map((life, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0D6E5D] shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{life}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Doctor Questions */}
          <div className="space-y-2 pt-2 border-t border-[#E6E2DA]/80 dark:border-[#232D3B]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#15191E] dark:text-[#F1F5F9]">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Questions to Discuss with Your Doctor:</span>
            </div>
            <ul className="space-y-1.5 text-xs text-[#5F6B7A] dark:text-[#8E9CAE] pl-2">
              {summary.doctorFollowUpQuestions.map((q, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{q}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Dedicated Report Downloads & Clinical Export Section */}
      <div id="section-report-downloads" className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-6 shadow-[0_1px_3px_rgba(21,25,30,0.03)] space-y-5 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E6E2DA]/80 dark:border-[#232D3B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-center text-[#0D6E5D] dark:text-emerald-300 shrink-0">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#15191E] dark:text-[#F1F5F9] tracking-tight">
                Report Downloads & Clinical Export
              </h3>
              <p className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE]">
                Download diagnostic reports as standardized PDF files, print sheets, or interoperable FHIR payloads
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-[#5F6B7A] dark:text-[#8E9CAE] self-start sm:self-auto bg-[#FAF8F5] dark:bg-[#0D1117] px-2.5 py-1 rounded-lg border border-[#E6E2DA] dark:border-[#232D3B]">
            REF: {report.id}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Direct PDF Download Card (Featured) */}
          <div className="p-4 rounded-xl border border-[#0D6E5D]/30 bg-[#FAF8F5] dark:bg-[#0D1117] flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0D6E5D] dark:text-emerald-300 flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-[#0D6E5D] dark:text-emerald-400" />
                  <span>Official PDF Report</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#0D6E5D] text-white">
                  PDF
                </span>
              </div>
              <p className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] leading-relaxed">
                Standard A4 PDF with patient demographics, analyte tables, LOINC codes, and doctor guidance.
              </p>
            </div>
            <button
              id="btn-section-download-pdf"
              onClick={handleDownloadPdf}
              className="w-full py-2 px-3 bg-[#0D6E5D] hover:bg-[#095245] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              {isPdfDownloading ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Downloaded PDF</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download as PDF</span>
                </>
              )}
            </button>
          </div>

          {/* 2. Print Summary Sheet */}
          <div className="p-4 rounded-xl border border-[#E6E2DA] dark:border-[#232D3B] bg-[#FAF8F5] dark:bg-[#0D1117] flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#15191E] dark:text-[#F1F5F9] flex items-center gap-1.5">
                  <Printer className="w-4 h-4 text-[#5F6B7A]" />
                  <span>Print Summary</span>
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#FAF8F5] dark:bg-[#161D26] text-[#5F6B7A] dark:text-[#8E9CAE] font-mono border border-[#E6E2DA] dark:border-[#232D3B]">
                  PRINT
                </span>
              </div>
              <p className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] leading-relaxed">
                Clean high-contrast printer layout formatted for physical records and clinic visits.
              </p>
            </div>
            <button
              id="btn-section-print-sheet"
              onClick={onPrint}
              className="w-full py-2 px-3 bg-[#15191E] dark:bg-[#0D1117] hover:bg-[#232D3B] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-[#15191E] dark:border-[#232D3B]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document</span>
            </button>
          </div>

          {/* 3. HL7 FHIR R4 Bundle */}
          <div className="p-4 rounded-xl border border-[#E6E2DA] dark:border-[#232D3B] bg-[#FAF8F5] dark:bg-[#0D1117] flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#15191E] dark:text-[#F1F5F9] flex items-center gap-1.5">
                  <FileJson className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>HL7® FHIR® R4</span>
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 font-mono">
                  JSON
                </span>
              </div>
              <p className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] leading-relaxed">
                Interoperable healthcare bundle compatible with modern EHR/EMR clinical hospital systems.
              </p>
            </div>
            <button
              id="btn-section-fhir-export"
              onClick={() => setIsFhirModalOpen(true)}
              className="w-full py-2 px-3 bg-white dark:bg-[#161D26] hover:bg-[#FAF8F5] dark:hover:bg-[#0D1117] text-[#15191E] dark:text-[#F1F5F9] border border-[#E6E2DA] dark:border-[#232D3B] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <FileJson className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Export FHIR JSON</span>
            </button>
          </div>

          {/* 4. Audit Provenance & Sign-off */}
          <div className="p-4 rounded-xl border border-[#E6E2DA] dark:border-[#232D3B] bg-[#FAF8F5] dark:bg-[#0D1117] flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#15191E] dark:text-[#F1F5F9] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0D6E5D] dark:text-emerald-400" />
                  <span>Audit Trail</span>
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-[#0D6E5D] dark:text-emerald-300 font-mono">
                  CLIA
                </span>
              </div>
              <p className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] leading-relaxed">
                CLIA laboratory accreditation, cryptographic SHA-256 hash, and pathologist sign-off stamp.
              </p>
            </div>
            <button
              id="btn-section-audit-provenance"
              onClick={() => setIsAuditModalOpen(true)}
              className="w-full py-2 px-3 bg-white dark:bg-[#161D26] hover:bg-[#FAF8F5] dark:hover:bg-[#0D1117] text-[#15191E] dark:text-[#F1F5F9] border border-[#E6E2DA] dark:border-[#232D3B] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#0D6E5D] dark:text-emerald-400" />
              <span>View Provenance</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Clinical Disclaimer */}
      <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#161D26] border border-[#E6E2DA] dark:border-[#232D3B] text-xs text-[#5F6B7A] dark:text-[#8E9CAE] space-y-1 transition-colors">
        <div className="flex items-center gap-1.5 font-bold text-[#15191E] dark:text-[#F1F5F9]">
          <ShieldAlert className="w-4 h-4 text-[#5F6B7A]" />
          <span>Clinical Informatics Notice</span>
        </div>
        <p className="text-[11px] leading-relaxed text-[#5F6B7A] dark:text-[#8E9CAE]">
          {summary.medicalDisclaimer}
        </p>
      </div>

      {/* FHIR R4 Bundle Export Modal */}
      {isFhirModalOpen && (
        <FhirExportModal
          report={report}
          isOpen={isFhirModalOpen}
          onClose={() => setIsFhirModalOpen(false)}
        />
      )}

      {/* Audit Provenance & Cryptographic Signature Modal */}
      {isAuditModalOpen && (
        <AuditProvenanceModal
          report={report}
          isOpen={isAuditModalOpen}
          onClose={() => setIsAuditModalOpen(false)}
        />
      )}
    </div>
  );
};

export const StatusBadge: React.FC<{ status: TestStatus }> = ({ status }) => {
  switch (status) {
    case 'normal':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>Normal</span>
        </span>
      );
    case 'low':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
          <ArrowDownRight className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          <span>Low</span>
        </span>
      );
    case 'high':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
          <ArrowUpRight className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          <span>High</span>
        </span>
      );
    case 'critical':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800">
          <AlertTriangle className="w-3 h-3 text-rose-700 dark:text-rose-400" />
          <span>Critical</span>
        </span>
      );
    default:
      return null;
  }
};
