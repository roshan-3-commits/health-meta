import React, { useState, useRef, useEffect } from 'react';
import { 
  Printer, 
  Sparkles, 
  Search, 
  Bell, 
  FileText, 
  ChevronDown, 
  ChevronRight,
  UserCheck, 
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Command,
  X,
  Sun,
  Moon,
  Layers,
  Activity,
  User,
  Users
} from 'lucide-react';
import { MedicalReport } from '../types';

interface HeaderProps {
  currentReport: MedicalReport | null;
  allReports: MedicalReport[];
  onSelectReport: (report: MedicalReport) => void;
  onPrint: () => void;
  onOpenProfile?: () => void;
  onOpenAbout?: () => void;
  onOpenSearch?: () => void;
  theme?: 'light' | 'dark';
  setTheme?: (theme: 'light' | 'dark') => void;
  density?: 'comfortable' | 'compact';
  setDensity?: (density: 'comfortable' | 'compact') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentReport,
  allReports,
  onSelectReport,
  onPrint,
  onOpenProfile,
  onOpenAbout,
  onOpenSearch,
  theme,
  setTheme,
  density = 'comfortable',
  setDensity,
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Derive notifications from reports
  const abnormalReports = allReports.filter((r) => r.summary.abnormalCount > 0);

  // Dynamically derive active profile from current active or default report
  const activePatient = currentReport || (allReports.length > 0 ? allReports[0] : null);
  const activeName = activePatient ? activePatient.patientInfo.name : 'Patient Records';
  const activeInitials = activeName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'PT';

  const activeSubtitle = activePatient
    ? `${activePatient.patientInfo.gender || 'Patient'}${activePatient.patientInfo.age ? ', ' + activePatient.patientInfo.age + 'y' : ''} • ${activePatient.patientInfo.reportType?.split('(')[0]?.trim() || 'Diagnostics'}`
    : 'Clinical Records';

  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  return (
    <header 
      id="app-top-header" 
      className="h-16 bg-white dark:bg-[#161D26] border-b border-[#E6E2DA] dark:border-[#232D3B] px-6 flex items-center justify-between z-20 shrink-0 relative transition-colors"
    >
      {/* Left side: Search bar & System Telemetry */}
      <div className="flex items-center gap-3.5 flex-1 max-w-xl">
        <div
          id="btn-global-search-trigger"
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 bg-[#FAF8F5] dark:bg-[#0D1117] hover:bg-white dark:hover:bg-[#1C2530] border border-[#E6E2DA] dark:border-[#232D3B] rounded-xl text-xs text-[#5F6B7A] dark:text-[#8E9CAE] transition-colors shadow-2xs group cursor-pointer"
          title="Search patients, MRN, lab reports, or doctors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Search className="w-4 h-4 text-[#5F6B7A] dark:text-[#8E9CAE] group-hover:text-[#0D6E5D] dark:group-hover:text-emerald-400 transition-colors shrink-0" />
            <span className="truncate text-[#5F6B7A] dark:text-[#8E9CAE] text-xs font-medium">Quick search patients, MRN, lab tests, or doctors...</span>
          </div>
          <span className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] font-medium px-2 py-0.5 rounded-md bg-white dark:bg-[#161D26] border border-[#E6E2DA] dark:border-[#232D3B] shrink-0">
            Search
          </span>
        </div>

        {/* Enterprise Compliance & Environment Tag */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-bold shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>PROD v2.8</span>
          <span className="text-emerald-300 dark:text-emerald-700">•</span>
          <span>HIPAA VERIFIED</span>
        </div>
      </div>

      {/* Right side: Density, Theme Switcher, Notifications & User Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Table Density Switcher (Comfortable vs Compact) */}
        {setDensity && (
          <button
            id="btn-toggle-density"
            onClick={() => setDensity(density === 'comfortable' ? 'compact' : 'comfortable')}
            className={`h-9 px-2.5 flex items-center gap-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
              density === 'compact'
                ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-700 text-[#0D6E5D] dark:text-emerald-300'
                : 'border-[#E6E2DA] dark:border-[#232D3B] text-[#5F6B7A] dark:text-[#8E9CAE] hover:bg-[#FAF8F5] dark:hover:bg-[#161D26]'
            }`}
            title={`View Density: ${density === 'compact' ? 'Compact View' : 'Comfortable View'}`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">
              {density === 'compact' ? 'Compact' : 'Comfortable'}
            </span>
          </button>
        )}

        {/* Quick Theme Toggle Button in Header */}
        {setTheme && (
          <button
            id="btn-header-theme-toggle"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-9 px-2.5 flex items-center gap-1.5 rounded-xl border border-[#E6E2DA] dark:border-[#232D3B] text-[#5F6B7A] dark:text-[#8E9CAE] hover:text-[#15191E] dark:hover:text-white hover:bg-[#FAF8F5] dark:hover:bg-[#161D26] transition-all cursor-pointer shadow-2xs text-xs font-semibold"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline text-[11px]">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700" />
                <span className="hidden md:inline text-[11px]">Dark</span>
              </>
            )}
          </button>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            id="btn-header-notifications"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E6E2DA] dark:border-[#232D3B] text-[#5F6B7A] dark:text-[#8E9CAE] hover:text-[#15191E] dark:hover:text-white hover:bg-[#FAF8F5] dark:hover:bg-[#161D26] transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-[#161D26]">
              {abnormalReports.length || 1}
            </span>
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#161D26] rounded-xl shadow-xl border border-[#E6E2DA] dark:border-[#232D3B] p-3 z-50 text-xs space-y-2 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 border-b border-[#E6E2DA]/60 dark:border-[#232D3B] font-bold text-[#15191E] dark:text-white">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0D6E5D] dark:text-emerald-400" />
                  Clinical Notifications
                </span>
                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {abnormalReports.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      onSelectReport(r);
                      setIsNotificationsOpen(false);
                    }}
                    className="p-2 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-slate-800 dark:text-slate-200 hover:bg-amber-100/70 dark:hover:bg-amber-900/40 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                      <span>{r.patientInfo.name}</span>
                      <span className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-1.5 py-0.2 rounded font-semibold">
                        {r.summary.abnormalCount} Flagged
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                      {r.patientInfo.reportType} • {r.summary.headline}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Profile Area - Updates automatically when report is uploaded/selected */}
        <div ref={profileMenuRef} className="relative">
          <div 
            id="header-profile-trigger"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2.5 pl-2 py-1 pr-1.5 rounded-xl cursor-pointer hover:bg-[#FAF8F5] dark:hover:bg-[#161D26] border border-transparent hover:border-[#E6E2DA] dark:hover:border-[#232D3B] transition-colors select-none group"
            title={`Active: ${activeName} (${activeSubtitle}) - Click for options`}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0D6E5D] to-[#095245] text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0 border border-teal-400/30">
              {activeInitials}
            </div>
            <div className="hidden sm:block text-left max-w-40 truncate">
              <div className="text-xs font-bold text-[#15191E] dark:text-white leading-tight truncate group-hover:text-[#0D6E5D] dark:group-hover:text-emerald-400 transition-colors">
                {activeName}
              </div>
              <div className="text-[11px] text-[#0D6E5D] dark:text-emerald-400 font-semibold leading-tight truncate">
                {activeSubtitle}
              </div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-[#5F6B7A] dark:text-[#8E9CAE] hidden sm:block transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Profile Dropdown */}
          {isProfileMenuOpen && (
            <div 
              id="header-profile-dropdown"
              className="absolute right-0 mt-1.5 w-72 sm:w-76 rounded-xl bg-white dark:bg-[#161D26] border border-[#E6E2DA] dark:border-[#232D3B] shadow-xl p-3 z-50 text-xs space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-150"
            >
              {/* Header bar */}
              <div className="flex items-center justify-between pb-2 border-b border-[#E6E2DA]/80 dark:border-[#232D3B]">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#0D6E5D]"></span>
                  </span>
                  <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-[#5F6B7A] dark:text-[#8E9CAE]">
                    [ ACTIVE PATIENT ]
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-[#0D6E5D] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Live
                  </span>
                  <button
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="p-0.5 rounded text-[#5F6B7A] hover:text-[#15191E] dark:hover:text-white hover:bg-[#FAF8F5] dark:hover:bg-[#0D1117] transition-colors cursor-pointer"
                    title="Close"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Active Patient Card */}
              {activePatient ? (
                <div className="p-2.5 rounded-lg bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#0D6E5D] text-white font-bold flex items-center justify-center text-xs shadow-2xs shrink-0">
                      {activeInitials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-[#15191E] dark:text-[#F1F5F9] text-xs leading-tight truncate">
                        {activePatient.patientInfo.name}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-[#5F6B7A] dark:text-[#8E9CAE] truncate">
                        <span>{activePatient.patientInfo.gender || 'Patient'}{activePatient.patientInfo.age ? `, ${activePatient.patientInfo.age}y` : ''}</span>
                        <span>•</span>
                        <span className="font-mono text-[#0D6E5D] dark:text-emerald-400">MRN: {activePatient.patientInfo.specimenId || activePatient.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Compact Status Pill Strip */}
                  <div className="flex items-center justify-between px-2 py-1 rounded-md bg-white dark:bg-[#161D26] border border-[#E6E2DA]/80 dark:border-[#232D3B] text-[10.5px]">
                    <div className="flex items-center gap-1 font-medium text-[#5F6B7A] dark:text-[#8E9CAE]">
                      <FileText className="w-3 h-3 text-[#0D6E5D]" />
                      <span className="truncate max-w-28">{activePatient.patientInfo.reportType || 'Lab Panel'}</span>
                    </div>
                    <div className={`font-bold flex items-center gap-1 text-[10px] ${
                      activePatient.summary.abnormalCount > 0 
                        ? 'text-amber-600 dark:text-amber-400' 
                        : 'text-[#0D6E5D] dark:text-emerald-400'
                    }`}>
                      {activePatient.summary.abnormalCount > 0 ? (
                        <>
                          <AlertTriangle className="w-3 h-3" />
                          <span>{activePatient.summary.abnormalCount} Flagged</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Normal</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* View Patient Timeline CTA */}
                  {onOpenProfile && (
                    <button
                      onClick={() => {
                        onOpenProfile();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full py-1.5 px-2.5 bg-[#0D6E5D] hover:bg-[#095245] text-white font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 text-[11px] cursor-pointer"
                    >
                      <Activity className="w-3 h-3" />
                      <span>Patient Health Timeline</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] text-center space-y-1">
                  <User className="w-5 h-5 text-[#5F6B7A] mx-auto opacity-50" />
                  <p className="text-[11px] font-semibold text-[#15191E] dark:text-[#F1F5F9]">No Active Patient</p>
                </div>
              )}

              {/* Compact Switch Patient List */}
              {allReports.length > 1 && (
                <div className="pt-1.5 border-t border-[#E6E2DA]/80 dark:border-[#232D3B] space-y-1">
                  <div className="flex items-center justify-between px-0.5">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#5F6B7A] dark:text-[#8E9CAE]">
                      Switch Patient
                    </span>
                    {onOpenProfile && (
                      <button
                        onClick={() => {
                          onOpenProfile();
                          setIsProfileMenuOpen(false);
                        }}
                        className="text-[10px] font-semibold text-[#0D6E5D] dark:text-emerald-400 hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        <span>All</span>
                        <ChevronRight className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-1 max-h-24 overflow-y-auto pr-0.5">
                    {/* Deduplicate reports by patient name so the list is clean */}
                    {Array.from(
                      new Map(
                        allReports
                          .filter((r) => r.patientInfo.name !== activePatient?.patientInfo.name)
                          .map((r) => [r.patientInfo.name, r])
                      ).values()
                    )
                      .slice(0, 3)
                      .map((r) => (
                        <div
                          key={r.id}
                          onClick={() => {
                            onSelectReport(r);
                            setIsProfileMenuOpen(false);
                          }}
                          className="p-1.5 rounded-md bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] dark:bg-[#0D1117]/60 dark:hover:bg-[#0D1117] border border-[#E6E2DA]/60 dark:border-[#232D3B]/60 hover:border-[#0D6E5D]/40 transition-colors flex items-center justify-between cursor-pointer group"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div className="w-5 h-5 rounded bg-white dark:bg-[#161D26] border border-[#E6E2DA] dark:border-[#232D3B] text-[#0D6E5D] dark:text-emerald-400 font-bold text-[9px] flex items-center justify-center shrink-0">
                              {r.patientInfo.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div className="truncate text-[11px] font-semibold text-[#15191E] dark:text-[#F1F5F9] group-hover:text-[#0D6E5D] dark:group-hover:text-emerald-400">
                              {r.patientInfo.name}
                            </div>
                          </div>
                          {r.summary.abnormalCount > 0 ? (
                            <span className="text-[9px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1 py-0.2 rounded border border-amber-200/60 dark:border-amber-800/60 shrink-0">
                              {r.summary.abnormalCount} Flagged
                            </span>
                          ) : (
                            <span className="text-[9px] font-semibold text-[#0D6E5D] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1 py-0.2 rounded border border-emerald-200/60 dark:border-emerald-800/60 shrink-0">
                              Normal
                            </span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
