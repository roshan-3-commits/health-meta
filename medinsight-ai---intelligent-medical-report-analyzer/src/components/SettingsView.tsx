import React, { useState } from 'react';
import { 
  Settings, 
  Sun, 
  Moon, 
  Monitor, 
  ShieldCheck, 
  Bell, 
  Volume2, 
  VolumeX, 
  User, 
  RefreshCw, 
  Check, 
  Database,
  Sliders,
  Sparkles,
  Building2,
  FileCheck2
} from 'lucide-react';

interface SettingsViewProps {
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  onResetDemo: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  theme,
  setTheme,
  onResetDemo,
}) => {
  const [standard, setStandard] = useState<'CLSI' | 'WHO' | 'CAP' | 'NHS'>('CLSI');
  const [units, setUnits] = useState<'conventional' | 'si'>('conventional');
  const [panicAudio, setPanicAudio] = useState(true);
  const [autoFlagging, setAutoFlagging] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    onResetDemo();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2500);
  };

  return (
    <div id="settings-view" className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Banner */}
      <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-6 sm:p-8 shadow-[0_1px_3px_rgba(21,25,30,0.03)] relative overflow-hidden transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] text-[#0D6E5D] dark:text-emerald-400 text-xs font-semibold">
              <Settings className="w-3.5 h-3.5 text-[#0D6E5D] dark:text-emerald-400" />
              <span>Laboratory Informatics Preferences</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#15191E] dark:text-[#F1F5F9] tracking-tight">
              System Settings & Configuration
            </h1>
            <p className="text-xs sm:text-sm text-[#5F6B7A] dark:text-[#8E9CAE]">
              Personalize interface theme, clinical reference intervals, panic alert chimes, and technician profile.
            </p>
          </div>
        </div>
      </div>

      {/* 1. Theme & Appearance (Light / Dark mode) */}
      <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-6 shadow-[0_1px_3px_rgba(21,25,30,0.03)] space-y-4 transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E2DA]/80 dark:border-[#232D3B]">
          <div>
            <h2 className="text-sm font-bold text-[#15191E] dark:text-[#F1F5F9] flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Interface Theme & Eye Strain Reduction</span>
            </h2>
            <p className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE] mt-0.5">
              Switch to dark theme to reduce eye fatigue during night shifts and intensive microscopy reviews.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Light Mode Card */}
          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-emerald-50/50 dark:bg-[#0D1117] border-[#0D6E5D] ring-2 ring-[#0D6E5D]/20'
                : 'bg-[#FAF8F5]/80 dark:bg-[#0D1117] border-[#E6E2DA] dark:border-[#232D3B] hover:border-[#0D6E5D]/40'
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              theme === 'light' ? 'bg-[#0D6E5D] text-white' : 'bg-[#E6E2DA] dark:bg-[#232D3B] text-[#5F6B7A] dark:text-[#8E9CAE]'
            }`}>
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-[#15191E] dark:text-white flex items-center gap-2">
                <span>Clinical Light Theme</span>
                {theme === 'light' && <Check className="w-4 h-4 text-[#0D6E5D]" />}
              </div>
              <p className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] mt-0.5">
                High-contrast daylight view optimized for standard office illumination.
              </p>
            </div>
          </button>

          {/* Dark Mode Card */}
          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-[#1C2530] border-[#0D6E5D] ring-2 ring-[#0D6E5D]/20'
                : 'bg-[#FAF8F5]/80 dark:bg-[#0D1117] border-[#E6E2DA] dark:border-[#232D3B] hover:border-[#0D6E5D]/40'
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              theme === 'dark' ? 'bg-[#0D6E5D] text-white' : 'bg-[#E6E2DA] dark:bg-[#232D3B] text-[#5F6B7A] dark:text-[#8E9CAE]'
            }`}>
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-[#15191E] dark:text-white flex items-center gap-2">
                <span>Night-Shift Dark Theme</span>
                {theme === 'dark' && <Check className="w-4 h-4 text-[#0D6E5D]" />}
              </div>
              <p className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] mt-0.5">
                Deep slate palette with low luminance to prevent eye strain during night hours.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Clinical Reference Standards */}
      <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-6 shadow-[0_1px_3px_rgba(21,25,30,0.03)] space-y-4 transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E2DA]/80 dark:border-[#232D3B]">
          <div>
            <h2 className="text-sm font-bold text-[#15191E] dark:text-[#F1F5F9] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0D6E5D]" />
              <span>Diagnostic Reference Standardization</span>
            </h2>
            <p className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE] mt-0.5">
              Select which clinical governing body standard defines normal biological intervals.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['CLSI', 'WHO', 'CAP', 'NHS'] as const).map((std) => (
            <button
              key={std}
              onClick={() => setStandard(std)}
              className={`p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                standard === std
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-[#0D6E5D] text-[#0D6E5D] dark:text-emerald-300 shadow-2xs'
                  : 'bg-[#FAF8F5] dark:bg-[#0D1117] border-[#E6E2DA] dark:border-[#232D3B] text-[#5F6B7A] dark:text-[#8E9CAE] hover:border-[#0D6E5D]/40'
              }`}
            >
              <div className="text-sm">{std} Guidelines</div>
              <div className="text-[10px] font-normal text-[#5F6B7A] dark:text-[#8E9CAE] mt-0.5">
                {std === 'CLSI' ? 'US Clinical Standards' : std === 'WHO' ? 'Global Health' : std === 'CAP' ? 'Pathology College' : 'UK NHS Intervals'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Measurement Units & Panic Alert Sounds */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Measurement Units */}
        <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-5 shadow-[0_1px_3px_rgba(21,25,30,0.03)] space-y-3">
          <div className="font-bold text-xs sm:text-sm text-[#15191E] dark:text-[#F1F5F9] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#5F6B7A] dark:text-[#8E9CAE]" />
            <span>Pathology Measurement Units</span>
          </div>
          <div className="space-y-2 pt-1 text-xs">
            <label
              onClick={() => setUnits('conventional')}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                units === 'conventional'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-[#0D6E5D] text-[#0D6E5D] dark:text-emerald-300'
                  : 'bg-[#FAF8F5] dark:bg-[#0D1117] border-[#E6E2DA] dark:border-[#232D3B] text-[#15191E] dark:text-slate-300'
              }`}
            >
              <div>
                <div className="font-bold">Conventional US Units</div>
                <div className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE]">mg/dL, g/dL, ng/mL, mIU/L</div>
              </div>
              {units === 'conventional' && <Check className="w-4 h-4 text-[#0D6E5D]" />}
            </label>

            <label
              onClick={() => setUnits('si')}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                units === 'si'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-[#0D6E5D] text-[#0D6E5D] dark:text-emerald-300'
                  : 'bg-[#FAF8F5] dark:bg-[#0D1117] border-[#E6E2DA] dark:border-[#232D3B] text-[#15191E] dark:text-slate-300'
              }`}
            >
              <div>
                <div className="font-bold">Standard International (SI)</div>
                <div className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE]">mmol/L, g/L, nmol/L, pmol/L</div>
              </div>
              {units === 'si' && <Check className="w-4 h-4 text-[#0D6E5D]" />}
            </label>
          </div>
        </div>

        {/* Panic Alerts & Audio */}
        <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-5 shadow-[0_1px_3px_rgba(21,25,30,0.03)] space-y-3">
          <div className="font-bold text-xs sm:text-sm text-[#15191E] dark:text-[#F1F5F9] flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#5F6B7A] dark:text-[#8E9CAE]" />
            <span>Alerts & Notifications</span>
          </div>
          <div className="space-y-3 pt-1 text-xs">
            <div className="flex items-center justify-between p-3 bg-[#FAF8F5] dark:bg-[#0D1117] rounded-xl border border-[#E6E2DA] dark:border-[#232D3B]">
              <div className="space-y-0.5">
                <div className="font-bold text-[#15191E] dark:text-slate-200 flex items-center gap-2">
                  {panicAudio ? <Volume2 className="w-3.5 h-3.5 text-[#0D6E5D]" /> : <VolumeX className="w-3.5 h-3.5 text-[#5F6B7A]" />}
                  <span>Panic Value Audio Chime</span>
                </div>
                <div className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE]">Play clinical alert chime when a panic value is detected</div>
              </div>
              <input
                type="checkbox"
                checked={panicAudio}
                onChange={(e) => setPanicAudio(e.target.checked)}
                className="w-4 h-4 rounded text-[#0D6E5D] focus:ring-[#0D6E5D] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-[#FAF8F5] dark:bg-[#0D1117] rounded-xl border border-[#E6E2DA] dark:border-[#232D3B]">
              <div className="space-y-0.5">
                <div className="font-bold text-[#15191E] dark:text-slate-200">Auto-Flag Critical Deviations</div>
                <div className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE]">Highlight abnormal items with amber and rose priority tags</div>
              </div>
              <input
                type="checkbox"
                checked={autoFlagging}
                onChange={(e) => setAutoFlagging(e.target.checked)}
                className="w-4 h-4 rounded text-[#0D6E5D] focus:ring-[#0D6E5D] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Database & Demo Data Reset */}
      <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-6 shadow-[0_1px_3px_rgba(21,25,30,0.03)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E2DA]/80 dark:border-[#232D3B]">
          <div className="flex items-center gap-2 text-[#15191E] dark:text-white font-bold text-sm">
            <Database className="w-4 h-4 text-[#5F6B7A]" />
            <span>Demonstration & Cohort Data Management</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-[#15191E] dark:text-slate-200">Reset Initial Clinical Cohort</div>
            <p className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE] mt-0.5">
              Reloads the 6 baseline multi-panel diagnostic test reports and 5 patient MRN files.
            </p>
          </div>

          <button
            onClick={handleReset}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              resetSuccess
                ? 'bg-[#0D6E5D] text-white shadow-xs'
                : 'bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60'
            }`}
          >
            {resetSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Demo Data Restored!</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Reset Demo Cohort</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
