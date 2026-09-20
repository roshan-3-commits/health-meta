import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Clock, 
  AlertTriangle, 
  Zap, 
  ShieldCheck, 
  Heart, 
  UploadCloud, 
  Users, 
  TrendingUp, 
  ChevronDown, 
  ChevronRight, 
  Search, 
  BookOpen, 
  FlaskConical, 
  Sparkles, 
  CheckCircle2, 
  Flag,
  Activity,
  Filter,
  Eye,
  Check,
  X
} from 'lucide-react';
import { MedicalReport, NavigationTab } from '../types';
import { ReferenceRangesModal } from './ReferenceRangesModal';
import { ClinicalGuidelinesModal } from './ClinicalGuidelinesModal';

interface DashboardViewProps {
  reports: MedicalReport[];
  onNavigate: (tab: NavigationTab) => void;
  onSelectReport: (report: MedicalReport) => void;
  onOpenSearch?: () => void;
}

interface ChartPoint {
  date: string;
  total: number;
  abnormal: number;
  flagged: number;
  x: number;
  yTotal: number;
  yAbnormal: number;
  yFlagged: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  reports,
  onNavigate,
  onSelectReport,
  onOpenSearch,
}) => {
  const [trendsTimeframe, setTrendsTimeframe] = useState<'7d' | '30d' | '90d'>('7d');
  const [isTimeframeMenuOpen, setIsTimeframeMenuOpen] = useState(false);
  const [flagsFilter, setFlagsFilter] = useState<'all' | 'flagged' | 'normal'>('all');
  const [hoveredChartPoint, setHoveredChartPoint] = useState<ChartPoint | null>(null);
  const [recentReportsSearch, setRecentReportsSearch] = useState('');
  
  // Modals state
  const [isReferenceRangesOpen, setIsReferenceRangesOpen] = useState(false);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
  const [isFlaggedDetailModalOpen, setIsFlaggedDetailModalOpen] = useState(false);
  const [isSummaryGeneratedModalOpen, setIsSummaryGeneratedModalOpen] = useState(false);

  // Compute metric counts
  const totalReportsCount = 6;
  const abnormalReportsCount = 4;
  const patientAccountsCount = 5;
  const biomarkersTrackedCount = 23;

  // Chart datasets for timeframes
  const chartPoints7d: ChartPoint[] = [
    { date: '14 Sep', total: 10, abnormal: 4, flagged: 2, x: 40, yTotal: 92, yAbnormal: 140, yFlagged: 154 },
    { date: '15 Sep', total: 14, abnormal: 5, flagged: 3, x: 135, yTotal: 60, yAbnormal: 132, yFlagged: 146 },
    { date: '16 Sep', total: 13, abnormal: 7, flagged: 5, x: 230, yTotal: 68, yAbnormal: 116, yFlagged: 132 },
    { date: '17 Sep', total: 16, abnormal: 6, flagged: 4, x: 325, yTotal: 44, yAbnormal: 124, yFlagged: 140 },
    { date: '18 Sep', total: 17, abnormal: 7, flagged: 4, x: 420, yTotal: 36, yAbnormal: 116, yFlagged: 140 },
    { date: '19 Sep', total: 19, abnormal: 8, flagged: 5, x: 515, yTotal: 20, yAbnormal: 108, yFlagged: 132 },
    { date: '20 Sep', total: 18, abnormal: 10, flagged: 6, x: 610, yTotal: 28, yAbnormal: 92, yFlagged: 124 },
  ];

  // The 6 recent reports in exact order as shown in reference design:
  const orderedRecentReports = useMemo(() => {
    const desiredOrder = [
      'REP-2025-10224', // Prasad Jadhav
      'REP-2026-98231', // Rahul Sharma CBC Sep 2026
      'REP-2024-98231', // Rahul Sharma Lipid May 2024
      'REP-2024-77621', // Priya Patel
      'REP-2024-55412', // Vikram Singh
      'REP-2024-66123', // Anita Roy
    ];

    const mapped = desiredOrder.map((id) => reports.find((r) => r.id === id)).filter(Boolean) as MedicalReport[];
    reports.forEach((r) => {
      if (!mapped.find((m) => m.id === r.id)) {
        mapped.push(r);
      }
    });

    if (!recentReportsSearch) return mapped;
    return mapped.filter((r) => 
      r.patientInfo.name.toLowerCase().includes(recentReportsSearch.toLowerCase()) ||
      r.patientInfo.reportType.toLowerCase().includes(recentReportsSearch.toLowerCase()) ||
      (r.patientInfo.specimenId && r.patientInfo.specimenId.toLowerCase().includes(recentReportsSearch.toLowerCase()))
    );
  }, [reports, recentReportsSearch]);

  // Priority Diagnostic Flags data
  const diagnosticFlags = [
    {
      id: 'flag-1',
      reportId: 'REP-2026-98231',
      patientName: 'Rahul Sharma',
      subline: 'Hemoglobin (low) | Total Cholesterol (high)',
      badges: [
        { label: 'Hemoglobin: 10.5 g/dL' },
        { label: 'Total Cholesterol: 230 mg/dL' },
      ],
      date: '20 Sep 2026',
      severity: 'High',
      severityType: 'high',
      statusType: 'flagged',
    },
    {
      id: 'flag-2',
      reportId: 'REP-2024-98231',
      patientName: 'Rahul Sharma',
      subline: 'Vitamin D (low) | HDL (low)',
      badges: [
        { label: 'Vitamin D: 12.5 ng/mL' },
        { label: 'HDL: 38 mg/dL' },
      ],
      date: '20 May 2024',
      severity: 'Medium',
      severityType: 'medium',
      statusType: 'flagged',
    },
    {
      id: 'flag-3',
      reportId: 'REP-2024-77621',
      patientName: 'Priya Patel',
      subline: 'TSH (high) | Subclinical Hypothyroidism',
      badges: [
        { label: 'TSH: 6.8 mIU/L' },
      ],
      date: '10 May 2024',
      severity: 'High',
      severityType: 'high',
      statusType: 'flagged',
    },
    {
      id: 'flag-4',
      reportId: 'REP-2024-55412',
      patientName: 'Vikram Singh',
      subline: 'Triglycerides (high) | ALT (high)',
      badges: [
        { label: 'Triglycerides: 245 mg/dL' },
        { label: 'ALT: 58 U/L' },
      ],
      date: '02 May 2024',
      severity: 'High',
      severityType: 'high',
      statusType: 'flagged',
    },
    {
      id: 'flag-5',
      reportId: 'REP-2025-10224',
      patientName: 'Prasad Jadhav',
      subline: 'All physiological biomarkers within target thresholds',
      badges: [
        { label: 'Hemoglobin: 15.2 g/dL' },
        { label: 'Total Cholesterol: 175 mg/dL' },
      ],
      date: '17 Sep 2025',
      severity: 'Optimal',
      severityType: 'normal',
      statusType: 'normal',
    },
    {
      id: 'flag-6',
      reportId: 'REP-2024-66123',
      patientName: 'Anita Roy',
      subline: 'Healthy metabolic and vitamin baseline profile',
      badges: [
        { label: 'Vitamin D: 42 ng/mL' },
        { label: 'HbA1c: 5.2%' },
      ],
      date: '25 Apr 2024',
      severity: 'Optimal',
      severityType: 'normal',
      statusType: 'normal',
    },
  ];

  const filteredFlags = diagnosticFlags.filter((f) => {
    if (flagsFilter === 'flagged') return f.statusType === 'flagged';
    if (flagsFilter === 'normal') return f.statusType === 'normal';
    return true;
  });

  // Avatar colors matching screenshot
  const getAvatarStyle = (name: string) => {
    if (name.includes('Prasad')) return 'bg-[#ffdcd2] text-[#d64527]';
    if (name.includes('Rahul')) return 'bg-[#ffdcd2] text-[#d64527]';
    if (name.includes('Priya')) return 'bg-[#ffeed2] text-[#b86200]';
    if (name.includes('Vikram')) return 'bg-[#ffeed2] text-[#b86200]';
    if (name.includes('Anita')) return 'bg-[#d5f7e6] text-[#0d7a68]';
    return 'bg-slate-100 text-slate-700';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div id="dashboard-view-root" className="space-y-6 max-w-7xl mx-auto pb-14">
      {/* 1. Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[#E6E2DA] dark:border-[#232D3B] bg-white dark:bg-[#161D26] p-6 sm:p-8 md:p-10 shadow-[0_1px_3px_rgba(21,25,30,0.03)] transition-colors">
        {/* Right background laboratory photo with soft gradient mask */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-2/3 md:w-1/2 pointer-events-none opacity-80 select-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-[#161D26] via-white/80 dark:via-[#161D26]/80 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80"
            alt="Medical Laboratory Diagnostics"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 max-w-2xl">
          {/* Diagnostic Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] text-[#0D6E5D] dark:text-emerald-300 text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Clinical Diagnostic Support</span>
          </div>

          {/* Heading */}
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-[#15191E] dark:text-[#F1F5F9] tracking-tight leading-tight">
            Medical Laboratory <br />
            Intelligence
          </h1>

          {/* Subtext */}
          <p className="mt-3 text-xs sm:text-sm text-[#5F6B7A] dark:text-[#8E9CAE] leading-relaxed max-w-xl">
            Automated multimodal diagnostic analysis: extracts clinical biomarkers, standardizes biological reference intervals, and translates complex pathology into clear, actionable patient guidance.
          </p>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <button
              id="hero-btn-upload-report"
              onClick={() => onNavigate('upload')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D6E5D] hover:bg-[#095245] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-xs hover:shadow-sm transition-all cursor-pointer active:scale-[0.98]"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload New Report</span>
            </button>

            <button
              id="hero-btn-patient-profiles"
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#FAF8F5] dark:bg-[#0D1117] dark:hover:bg-[#1A232E] text-[#15191E] dark:text-[#F1F5F9] border border-[#E6E2DA] dark:border-[#232D3B] text-xs sm:text-sm font-semibold shadow-2xs transition-all cursor-pointer active:scale-[0.98]"
            >
              <Users className="w-4 h-4 text-[#0D6E5D] dark:text-emerald-400" />
              <span>Patient Profiles</span>
            </button>
          </div>

          {/* Bottom Badges */}
          <div className="mt-8 pt-5 border-t border-[#E6E2DA]/80 dark:border-[#232D3B] flex items-center gap-5 sm:gap-7 flex-wrap text-xs text-[#5F6B7A] dark:text-[#8E9CAE] font-medium">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#0D6E5D] text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Zap className="w-3 h-3" />
              </div>
              <span>Fast Analysis</span>
            </div>

            <div className="h-3 w-px bg-[#E6E2DA] dark:bg-[#232D3B] hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#0D6E5D] text-white flex items-center justify-center shrink-0 shadow-2xs">
                <ShieldCheck className="w-3 h-3" />
              </div>
              <span>Accurate Results</span>
            </div>

            <div className="h-3 w-px bg-[#E6E2DA] dark:bg-[#232D3B] hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#0D6E5D] text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Heart className="w-3 h-3" />
              </div>
              <span>Better Patient Outcomes</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Four Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Reports Analyzed */}
        <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-5 shadow-[0_1px_3px_rgba(21,25,30,0.03)] hover:border-[#0D6E5D]/60 transition-all flex flex-col justify-between group">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#0D6E5D] dark:text-emerald-300 flex items-center justify-center group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div className="mt-3">
            <div className="text-xs font-semibold text-[#5F6B7A] dark:text-[#8E9CAE]">Reports Analyzed</div>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#15191E] dark:text-[#F1F5F9] tracking-tight">
                {totalReportsCount}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-[#0D6E5D] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60">
                ↑ 2 today
              </span>
            </div>
            <p className="mt-2 text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] font-medium">
              CBC, Lipids, Metabolic & Thyroid panels
            </p>
          </div>
        </div>

        {/* Card 2: Abnormal Reports */}
        <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-5 shadow-[0_1px_3px_rgba(21,25,30,0.03)] hover:border-amber-400/50 transition-all flex flex-col justify-between group">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="text-xs font-semibold text-[#5F6B7A] dark:text-[#8E9CAE]">Abnormal Reports</div>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#15191E] dark:text-[#F1F5F9] tracking-tight">
                {abnormalReportsCount}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60">
                67% positivity
              </span>
            </div>
            <p className="mt-2 text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] font-medium">
              Biomarkers outside normal limits
            </p>
          </div>
        </div>

        {/* Card 3: Patient Accounts */}
        <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-5 shadow-[0_1px_3px_rgba(21,25,30,0.03)] hover:border-blue-400/50 transition-all flex flex-col justify-between group">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <div className="mt-3">
            <div className="text-xs font-semibold text-[#5F6B7A] dark:text-[#8E9CAE]">Patient Accounts</div>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#15191E] dark:text-[#F1F5F9] tracking-tight">
                {patientAccountsCount}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60">
                Auto-sync
              </span>
            </div>
            <p className="mt-2 text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] font-medium">
              MRN & clinical history
            </p>
          </div>
        </div>

        {/* Card 4: Biomarkers Tracked */}
        <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-5 shadow-[0_1px_3px_rgba(21,25,30,0.03)] hover:border-orange-400/50 transition-all flex flex-col justify-between group">
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="mt-3">
            <div className="text-xs font-semibold text-[#5F6B7A] dark:text-[#8E9CAE]">Biomarkers Tracked</div>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#15191E] dark:text-[#F1F5F9] tracking-tight">
                {biomarkersTrackedCount}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#fff0e6] dark:bg-amber-950/50 text-[#e05b19] dark:text-amber-400 border border-[#fed7aa] dark:border-amber-900/60">
                8 flagged
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              Cross-indexed with biological ranges
            </p>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Two Columns (Left ~65%, Right ~35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (8 cols): Biomarker Trends + Recent Reports */}
        <div className="lg:col-span-8 space-y-5">
          {/* Biomarker Trends Card */}
          <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-5 sm:p-6 shadow-[0_1px_3px_rgba(21,25,30,0.03)] relative">
            {/* Header */}
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#5F6B7A] dark:text-[#8E9CAE]" />
                <h2 className="text-sm font-bold text-[#15191E] dark:text-[#F1F5F9]">Biomarker Trends</h2>
              </div>
              <div className="relative">
                <button
                  onClick={() => setIsTimeframeMenuOpen(!isTimeframeMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] dark:bg-[#0D1117] hover:bg-[#F2EFE9] dark:hover:bg-[#1C2530] border border-[#E6E2DA] dark:border-[#232D3B] rounded-xl text-xs font-medium text-[#15191E] dark:text-[#F1F5F9] cursor-pointer transition-colors"
                >
                  <span>
                    {trendsTimeframe === '7d' ? 'Last 7 days' : trendsTimeframe === '30d' ? 'Last 30 days' : 'Last 90 days'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#5F6B7A]" />
                </button>

                {isTimeframeMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-36 bg-white dark:bg-[#161D26] rounded-xl shadow-lg border border-[#E6E2DA] dark:border-[#232D3B] p-1 z-30 text-xs">
                    <button
                      onClick={() => {
                        setTrendsTimeframe('7d');
                        setIsTimeframeMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#FAF8F5] dark:hover:bg-[#0D1117] font-medium text-[#15191E] dark:text-[#F1F5F9]"
                    >
                      Last 7 days
                    </button>
                    <button
                      onClick={() => {
                        setTrendsTimeframe('30d');
                        setIsTimeframeMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#FAF8F5] dark:hover:bg-[#0D1117] font-medium text-[#15191E] dark:text-[#F1F5F9]"
                    >
                      Last 30 days
                    </button>
                    <button
                      onClick={() => {
                        setTrendsTimeframe('90d');
                        setIsTimeframeMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#FAF8F5] dark:hover:bg-[#0D1117] font-medium text-[#15191E] dark:text-[#F1F5F9]"
                    >
                      Last 90 days
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Legend & Hover Data preview */}
            <div className="flex items-center justify-between pb-3 text-xs text-slate-600 dark:text-slate-400 flex-wrap gap-2">
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0d7a68]" />
                  <span className="font-medium text-[11px]">Total Reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />
                  <span className="font-medium text-[11px]">Abnormal</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                  <span className="font-medium text-[11px]">Flagged</span>
                </div>
              </div>

              {hoveredChartPoint && (
                <div className="text-[11px] font-mono bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 animate-in fade-in">
                  <strong className="text-slate-900 dark:text-white mr-2">{hoveredChartPoint.date}:</strong>
                  <span className="text-[#0d7a68] dark:text-teal-400 font-bold">Total: {hoveredChartPoint.total}</span> |{' '}
                  <span className="text-[#f97316] font-bold">Abnormal: {hoveredChartPoint.abnormal}</span> |{' '}
                  <span className="text-[#ef4444] font-bold">Flagged: {hoveredChartPoint.flagged}</span>
                </div>
              )}
            </div>

            {/* Spline Area/Line Chart */}
            <div className="w-full h-56 pt-2 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 650 180" preserveAspectRatio="none">
                <defs>
                  {/* Teal/Green Gradient */}
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d7a68" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#0d7a68" stopOpacity="0.0" />
                  </linearGradient>
                  {/* Orange Gradient */}
                  <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                  </linearGradient>
                  {/* Red/Rose Gradient */}
                  <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Gridlines & Y-Axis numbers */}
                <g className="text-[10px] fill-slate-400 dark:fill-slate-500 font-mono">
                  <text x="5" y="15" textAnchor="start">20</text>
                  <line x1="30" y1="12" x2="650" y2="12" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="1" strokeDasharray="3 3" />

                  <text x="5" y="55" textAnchor="start">15</text>
                  <line x1="30" y1="52" x2="650" y2="52" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="1" strokeDasharray="3 3" />

                  <text x="5" y="95" textAnchor="start">10</text>
                  <line x1="30" y1="92" x2="650" y2="92" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="1" strokeDasharray="3 3" />

                  <text x="5" y="135" textAnchor="start">5</text>
                  <line x1="30" y1="132" x2="650" y2="132" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="1" strokeDasharray="3 3" />

                  <text x="5" y="170" textAnchor="start">0</text>
                  <line x1="30" y1="168" x2="650" y2="168" stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="1" />
                </g>

                {/* Vertical hover marker line */}
                {hoveredChartPoint && (
                  <line
                    x1={hoveredChartPoint.x}
                    y1="12"
                    x2={hoveredChartPoint.x}
                    y2="168"
                    stroke="#0d7a68"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.6"
                  />
                )}

                {/* Curves */}
                {/* 1. Green Curve */}
                <path
                  d="M 40 92 C 90 60, 100 60, 135 60 C 180 60, 190 70, 230 68 C 280 65, 290 45, 325 44 C 370 42, 380 37, 420 36 C 470 34, 480 22, 515 20 C 560 18, 570 28, 610 28 L 610 168 L 40 168 Z"
                  fill="url(#greenGrad)"
                />
                <path
                  d="M 40 92 C 90 60, 100 60, 135 60 C 180 60, 190 70, 230 68 C 280 65, 290 45, 325 44 C 370 42, 380 37, 420 36 C 470 34, 480 22, 515 20 C 560 18, 570 28, 610 28"
                  fill="none"
                  stroke="#0d7a68"
                  strokeWidth="2.5"
                />

                {/* 2. Orange Curve */}
                <path
                  d="M 40 140 C 90 134, 100 132, 135 132 C 180 132, 190 118, 230 116 C 280 114, 290 126, 325 124 C 370 122, 380 117, 420 116 C 470 115, 480 110, 515 108 C 560 106, 570 92, 610 92 L 610 168 L 40 168 Z"
                  fill="url(#orangeGrad)"
                />
                <path
                  d="M 40 140 C 90 134, 100 132, 135 132 C 180 132, 190 118, 230 116 C 280 114, 290 126, 325 124 C 370 122, 380 117, 420 116 C 470 115, 480 110, 515 108 C 560 106, 570 92, 610 92"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                />

                {/* 3. Red Curve */}
                <path
                  d="M 40 154 C 90 148, 100 146, 135 146 C 180 146, 190 134, 230 132 C 280 130, 290 142, 325 140 C 370 138, 380 141, 420 140 C 470 139, 480 134, 515 132 C 560 130, 570 124, 610 124 L 610 168 L 40 168 Z"
                  fill="url(#redGrad)"
                />
                <path
                  d="M 40 154 C 90 148, 100 146, 135 146 C 180 146, 190 134, 230 132 C 280 130, 290 142, 325 140 C 370 138, 380 141, 420 140 C 470 139, 480 134, 515 132 C 560 130, 570 124, 610 124"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                />

                {/* Interactive Points on Hover */}
                {chartPoints7d.map((pt, i) => (
                  <g
                    key={i}
                    onMouseEnter={() => setHoveredChartPoint(pt)}
                    className="cursor-pointer"
                  >
                    {/* Transparent hover capture column */}
                    <rect
                      x={pt.x - 30}
                      y={0}
                      width={60}
                      height={180}
                      fill="transparent"
                    />

                    {/* Circular markers when hovered */}
                    {hoveredChartPoint?.date === pt.date && (
                      <>
                        <circle cx={pt.x} cy={pt.yTotal} r={5} fill="#0d7a68" stroke="#fff" strokeWidth={2} />
                        <circle cx={pt.x} cy={pt.yAbnormal} r={4.5} fill="#f97316" stroke="#fff" strokeWidth={2} />
                        <circle cx={pt.x} cy={pt.yFlagged} r={4.5} fill="#ef4444" stroke="#fff" strokeWidth={2} />
                      </>
                    )}
                  </g>
                ))}

                {/* X-axis labels */}
                <g className="text-[10px] fill-slate-400 dark:fill-slate-500 font-sans select-none" textAnchor="middle">
                  {chartPoints7d.map((pt, i) => (
                    <text
                      key={i}
                      x={pt.x}
                      y="180"
                      className={hoveredChartPoint?.date === pt.date ? 'fill-[#0d7a68] dark:fill-teal-400 font-bold' : ''}
                    >
                      {pt.date}
                    </text>
                  ))}
                </g>
              </svg>
            </div>
          </div>

          {/* Recent Reports Card */}
          <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-5 sm:p-6 shadow-[0_1px_3px_rgba(21,25,30,0.03)]">
            {/* Header with Search Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#5F6B7A] dark:text-[#8E9CAE]" />
                <h2 className="text-sm font-bold text-[#15191E] dark:text-[#F1F5F9]">Recent Reports</h2>
              </div>
              <div className="flex items-center gap-3">
                {/* Search input in table */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#5F6B7A] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={recentReportsSearch}
                    onChange={(e) => setRecentReportsSearch(e.target.value)}
                    placeholder="Filter records..."
                    className="w-36 sm:w-44 pl-8 pr-2.5 py-1 bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] rounded-lg text-xs text-[#15191E] dark:text-[#F1F5F9] placeholder:text-[#5F6B7A] dark:placeholder:text-[#8E9CAE] focus:outline-none focus:ring-1 focus:ring-[#0D6E5D]"
                  />
                  {recentReportsSearch && (
                    <button
                      onClick={() => setRecentReportsSearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#5F6B7A] hover:text-[#15191E] dark:hover:text-[#F1F5F9]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <button
                  id="btn-recent-reports-view-all"
                  onClick={() => onNavigate('history')}
                  className="text-xs font-bold text-[#0D6E5D] dark:text-emerald-400 hover:text-[#095245] flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Table / List */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E6E2DA]/80 dark:border-[#232D3B] text-[11px] font-semibold text-[#5F6B7A] dark:text-[#8E9CAE]">
                    <th className="pb-3 font-medium">Patient</th>
                    <th className="pb-3 font-medium">Test Type</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E2DA]/60 dark:divide-[#232D3B] text-xs">
                  {orderedRecentReports.map((report) => {
                    const isNormal = report.summary.abnormalCount === 0;
                    const avatarStyle = getAvatarStyle(report.patientInfo.name);
                    const initials = getInitials(report.patientInfo.name);
                    const patientSubtitle = `${report.patientInfo.age} yrs, ${report.patientInfo.gender} | ${report.patientInfo.specimenId || 'MRN: ' + report.id.slice(-5)}`;

                    return (
                      <tr
                        key={report.id}
                        id={`recent-report-row-${report.id}`}
                        onClick={() => onSelectReport(report)}
                        className="hover:bg-[#FAF8F5]/80 dark:hover:bg-[#0D1117]/60 transition-colors cursor-pointer group"
                      >
                        {/* Patient Column */}
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${avatarStyle} shadow-2xs`}
                            >
                              {initials}
                            </div>
                            <div>
                              <div className="font-bold text-[#15191E] dark:text-[#F1F5F9] text-xs leading-tight group-hover:text-[#0D6E5D] dark:group-hover:text-emerald-400 transition-colors">
                                {report.patientInfo.name}
                              </div>
                              <div className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] mt-0.5 leading-tight">
                                {patientSubtitle}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Test Type Column */}
                        <td className="py-3.5 pr-4">
                          <div className="font-medium text-[#15191E] dark:text-slate-200 text-xs leading-tight">
                            {report.patientInfo.reportType}
                          </div>
                          <div className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] mt-0.5 leading-tight">
                            {report.patientInfo.labName || 'Standard Panel'}
                          </div>
                        </td>

                        {/* Date Column */}
                        <td className="py-3.5 pr-4 text-[#5F6B7A] dark:text-slate-400 whitespace-nowrap text-xs font-mono">
                          {report.patientInfo.reportDate}
                        </td>

                        {/* Status Column */}
                        <td className="py-3.5 pr-4 whitespace-nowrap">
                          {isNormal ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-[#0D6E5D] dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800">
                              Normal
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60">
                              Flagged
                            </span>
                          )}
                        </td>

                        {/* Arrow Action */}
                        <td className="py-3.5 text-right text-slate-300 dark:text-slate-600 group-hover:text-[#0D6E5D] dark:group-hover:text-emerald-400 transition-colors pr-1">
                          <ChevronRight className="w-4 h-4" />
                        </td>
                      </tr>
                    );
                  })}
                  {orderedRecentReports.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-[#5F6B7A] dark:text-[#8E9CAE] text-xs">
                        No reports found matching &quot;{recentReportsSearch}&quot;.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Quick Actions + Clinical Insights + System Accuracy */}
        <div className="lg:col-span-4 space-y-5">
          {/* Quick Actions Card */}
          <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-5 shadow-[0_1px_3px_rgba(21,25,30,0.03)]">
            <div className="flex items-center gap-2 pb-3">
              <Zap className="w-4 h-4 text-[#5F6B7A] dark:text-[#8E9CAE]" />
              <h2 className="text-sm font-bold text-[#15191E] dark:text-[#F1F5F9]">Quick Actions</h2>
            </div>

            <div className="divide-y divide-[#E6E2DA]/60 dark:divide-[#232D3B]">
              {/* 1. Upload New Report */}
              <div
                id="quick-action-upload"
                onClick={() => onNavigate('upload')}
                className="py-3 flex items-center justify-between group cursor-pointer hover:bg-[#FAF8F5] dark:hover:bg-[#0D1117] -mx-2 px-2 rounded-xl transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#0D6E5D] dark:text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <UploadCloud className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#15191E] dark:text-[#F1F5F9] group-hover:text-[#0D6E5D] dark:group-hover:text-emerald-400 transition-colors leading-tight">
                      Upload New Report
                    </div>
                    <div className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] mt-0.5">
                      PDF, JPG, PNG up to 10MB
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#5F6B7A] group-hover:text-[#15191E] dark:group-hover:text-white transition-colors" />
              </div>

              {/* 2. Search Patient */}
              <div
                id="quick-action-search-patient"
                onClick={() => {
                  if (onOpenSearch) onOpenSearch();
                  else onNavigate('profile');
                }}
                className="py-3 flex items-center justify-between group cursor-pointer hover:bg-[#FAF8F5] dark:hover:bg-[#0D1117] -mx-2 px-2 rounded-xl transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#15191E] dark:text-[#F1F5F9] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                      Search Patient
                    </div>
                    <div className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] mt-0.5">
                      Find by name, MRN or phone
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#5F6B7A] group-hover:text-[#15191E] dark:group-hover:text-white transition-colors" />
              </div>

              {/* 3. View Reference Ranges */}
              <div
                id="quick-action-reference-ranges"
                onClick={() => setIsReferenceRangesOpen(true)}
                className="py-3 flex items-center justify-between group cursor-pointer hover:bg-[#FAF8F5] dark:hover:bg-[#0D1117] -mx-2 px-2 rounded-xl transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#0D6E5D] dark:text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#15191E] dark:text-[#F1F5F9] group-hover:text-[#0D6E5D] dark:group-hover:text-emerald-400 transition-colors leading-tight">
                      View Reference Ranges
                    </div>
                    <div className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] mt-0.5">
                      Biomarker normal ranges
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#5F6B7A] group-hover:text-[#15191E] dark:group-hover:text-white transition-colors" />
              </div>

              {/* 4. Clinical Guidelines */}
              <div
                id="quick-action-clinical-guidelines"
                onClick={() => setIsGuidelinesOpen(true)}
                className="py-3 flex items-center justify-between group cursor-pointer hover:bg-[#FAF8F5] dark:hover:bg-[#0D1117] -mx-2 px-2 rounded-xl transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#15191E] dark:text-[#F1F5F9] group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors leading-tight">
                      Clinical Guidelines
                    </div>
                    <div className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] mt-0.5">
                      Lab test interpretation
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#5F6B7A] group-hover:text-[#15191E] dark:group-hover:text-white transition-colors" />
              </div>

              {/* 5. Generate Report Summary */}
              <div
                id="quick-action-generate-summary"
                onClick={() => setIsSummaryGeneratedModalOpen(true)}
                className="py-3 flex items-center justify-between group cursor-pointer hover:bg-[#FAF8F5] dark:hover:bg-[#0D1117] -mx-2 px-2 rounded-xl transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] dark:bg-[#0D1117] text-[#0D6E5D] dark:text-emerald-400 border border-[#E6E2DA] dark:border-[#232D3B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#15191E] dark:text-[#F1F5F9] group-hover:text-[#0D6E5D] dark:group-hover:text-emerald-400 transition-colors leading-tight">
                      Generate Report Summary
                    </div>
                    <div className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] mt-0.5">
                      Clinical pathology synthesis
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#5F6B7A] group-hover:text-[#15191E] dark:group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>

          {/* Clinical Insights Card */}
          <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-5 shadow-[0_1px_3px_rgba(21,25,30,0.03)]">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                <h2 className="text-sm font-bold text-[#15191E] dark:text-[#F1F5F9]">Clinical Insights</h2>
              </div>
              <ChevronRight className="w-4 h-4 text-[#5F6B7A]" />
            </div>

            {/* Inner Alert Box */}
            <div className="rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-[#FAF8F5] dark:bg-amber-950/20 p-4">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 flex items-center justify-center mb-2.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#15191E] dark:text-white leading-tight">
                4 reports have abnormal biomarkers
              </h3>
              <p className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] mt-1 leading-normal">
                Review flagged results for immediate attention.
              </p>
              <button
                id="btn-clinical-insights-view-details"
                onClick={() => setIsFlaggedDetailModalOpen(true)}
                className="mt-3.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#161D26] border border-[#E6E2DA] dark:border-[#232D3B] text-[#15191E] dark:text-slate-200 text-xs font-bold shadow-2xs hover:bg-[#FAF8F5] dark:hover:bg-[#0D1117] transition-all cursor-pointer active:scale-95"
              >
                View Details
              </button>
            </div>
          </div>

          {/* System Accuracy Card */}
          <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-5 shadow-[0_1px_3px_rgba(21,25,30,0.03)]">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#0D6E5D] dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <TrendingUp className="w-4 h-4 text-[#0D6E5D] dark:text-emerald-400" />
            </div>
            <div className="mt-4">
              <div className="text-xs font-semibold text-[#15191E] dark:text-slate-300">System Accuracy</div>
              <div className="mt-1 text-3xl font-extrabold text-[#15191E] dark:text-white tracking-tight">
                99.2%
              </div>
              <p className="mt-1 text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE]">
                Based on validated reference ranges
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Priority Diagnostic Flags */}
      <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-5 sm:p-6 shadow-[0_1px_3px_rgba(21,25,30,0.03)]">
        {/* Header with Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E6E2DA]/80 dark:border-[#232D3B]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Flag className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-[#15191E] dark:text-[#F1F5F9]">Priority Diagnostic Flags</h2>
          </div>

          {/* Filter Pills: All (6), Flagged (4), Normal (2) */}
          <div className="flex items-center gap-1.5">
            <button
              id="filter-flags-all"
              onClick={() => setFlagsFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                flagsFilter === 'all'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#0D6E5D] dark:text-emerald-300 font-bold border border-emerald-200/80 dark:border-emerald-800'
                  : 'text-[#5F6B7A] dark:text-[#8E9CAE] hover:text-[#15191E] dark:hover:text-slate-200 hover:bg-[#FAF8F5] dark:hover:bg-[#0D1117]'
              }`}
            >
              All (6)
            </button>
            <button
              id="filter-flags-flagged"
              onClick={() => setFlagsFilter('flagged')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                flagsFilter === 'flagged'
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800'
                  : 'text-[#5F6B7A] dark:text-[#8E9CAE] hover:text-[#15191E] dark:hover:text-slate-200 hover:bg-[#FAF8F5] dark:hover:bg-[#0D1117]'
              }`}
            >
              Flagged (4)
            </button>
            <button
              id="filter-flags-normal"
              onClick={() => setFlagsFilter('normal')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                flagsFilter === 'normal'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#0D6E5D] dark:text-emerald-300 font-bold border border-emerald-200/80 dark:border-emerald-800'
                  : 'text-[#5F6B7A] dark:text-[#8E9CAE] hover:text-[#15191E] dark:hover:text-slate-200 hover:bg-[#FAF8F5] dark:hover:bg-[#0D1117]'
              }`}
            >
              Normal (2)
            </button>
          </div>
        </div>

        {/* Flags List */}
        <div className="divide-y divide-[#E6E2DA]/60 dark:divide-[#232D3B]">
          {filteredFlags.map((flag) => {
            const isHigh = flag.severityType === 'high';
            const isMedium = flag.severityType === 'medium';

            return (
              <div
                key={flag.id}
                id={`priority-flag-item-${flag.id}`}
                onClick={() => {
                  const rep = reports.find((r) => r.id === flag.reportId);
                  if (rep) onSelectReport(rep);
                }}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group cursor-pointer hover:bg-[#FAF8F5] dark:hover:bg-[#0D1117] -mx-2 px-2 rounded-xl transition-all"
              >
                {/* Left Side: Icon + Name + Description + Badges */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                    <Flag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-[#15191E] dark:text-[#F1F5F9] group-hover:text-[#0D6E5D] dark:group-hover:text-emerald-400 transition-colors leading-tight">
                      {flag.patientName}
                    </div>
                    <div className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE] mt-0.5 leading-tight">
                      {flag.subline}
                    </div>
                    {/* Biomarker Badges */}
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      {flag.badges.map((badge, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FAF8F5] dark:bg-[#0D1117] text-amber-800 dark:text-amber-300 border border-[#E6E2DA] dark:border-[#232D3B]"
                        >
                          {badge.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side: Date + Severity Pill + Arrow */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0 self-end sm:self-center">
                  <span className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE] whitespace-nowrap font-mono">
                    {flag.date}
                  </span>
                  {isHigh && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/60">
                      High
                    </span>
                  )}
                  {isMedium && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/60">
                      Medium
                    </span>
                  )}
                  {!isHigh && !isMedium && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-[#0D6E5D] dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800">
                      Normal
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-[#0D6E5D] dark:group-hover:text-emerald-400 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODALS */}
      {/* 1. Reference Ranges Modal */}
      <ReferenceRangesModal
        isOpen={isReferenceRangesOpen}
        onClose={() => setIsReferenceRangesOpen(false)}
      />

      {/* 2. Clinical Guidelines Modal */}
      <ClinicalGuidelinesModal
        isOpen={isGuidelinesOpen}
        onClose={() => setIsGuidelinesOpen(false)}
      />

      {/* 3. Flagged Clinical Insights Modal */}
      {isFlaggedDetailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-amber-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Flagged Diagnostic Cases</h2>
                  <p className="text-xs text-slate-500">4 patient cases with biomarkers outside physiological safe limits</p>
                </div>
              </div>
              <button
                onClick={() => setIsFlaggedDetailModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3 flex-1">
              {diagnosticFlags.filter(f => f.statusType === 'flagged').map(flag => (
                <div
                  key={flag.id}
                  onClick={() => {
                    const rep = reports.find(r => r.id === flag.reportId);
                    if (rep) {
                      setIsFlaggedDetailModalOpen(false);
                      onSelectReport(rep);
                    }
                  }}
                  className="p-4 rounded-2xl border border-amber-200/70 bg-amber-50/30 hover:bg-amber-50/80 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{flag.patientName}</div>
                    <div className="text-xs text-slate-600 mt-0.5">{flag.subline}</div>
                    <div className="flex gap-2 mt-2">
                      {flag.badges.map((b, i) => (
                        <span key={i} className="text-[11px] font-semibold bg-white border border-amber-200 text-amber-800 px-2 py-0.5 rounded-md">
                          {b.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl bg-[#0d7a68] text-white text-xs font-bold hover:bg-[#0a6352] transition-colors shrink-0">
                    Open Report
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setIsFlaggedDetailModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold cursor-pointer transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Instant AI Summary Modal */}
      {isSummaryGeneratedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0d7a68] text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">AI Clinical Summary Generator</h2>
                  <p className="text-xs text-slate-500">Cross-case pathological correlation across active cohort</p>
                </div>
              </div>
              <button
                onClick={() => setIsSummaryGeneratedModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-700">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0d7a68]" />
                  Cohort Pathology Synopsis
                </h4>
                <p>
                  Across the active 6 patient profiles, <strong>67%</strong> present with reversible micro-nutritional or metabolic dysregulations (elevated cholesterol in 2 patients, iron-deficiency anemia in 1 patient, and 25-OH Vitamin D deficiency in 1 patient).
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900">Key Recommended Physician Actions:</h4>
                <ul className="space-y-1.5 pl-4 list-disc text-slate-600">
                  <li><strong>Rahul Sharma (MRN: 98231)</strong>: Initiate iron therapy and re-evaluate serum ferritin in 6 weeks; consider dietary statin-sparing approach.</li>
                  <li><strong>Priya Patel (MRN: 77621)</strong>: Schedule secondary Free T4 reflex to rule out subclinical Hashimoto thyroiditis.</li>
                  <li><strong>Vikram Singh (MRN: 55412)</strong>: Liver enzymes AST/ALT monitoring with abdominal ultrasonography review.</li>
                </ul>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Generated by MedInsight AI Diagnostic Core</span>
              <button
                onClick={() => setIsSummaryGeneratedModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#0d7a68] hover:bg-[#0a6352] text-white text-xs font-bold cursor-pointer transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
