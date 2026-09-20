import React from 'react';
import { 
  Home, 
  FolderPlus, 
  Activity, 
  Users, 
  FileText, 
  Settings, 
  BookOpen, 
  FlaskConical, 
  HelpCircle,
  LogOut,
  ChevronRight,
  User,
  GraduationCap,
  School
} from 'lucide-react';
import { NavigationTab, PatientInfo } from '../types';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  activePatient: PatientInfo;
  reportsCount: number;
  abnormalCount: number;
  hasActiveReport: boolean;
  onSelectReportView: () => void;
  onResetDemo: () => void;
  theme?: 'light' | 'dark';
  setTheme?: (t: 'light' | 'dark') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  activePatient,
  reportsCount,
  abnormalCount,
  hasActiveReport,
  onSelectReportView,
  onResetDemo,
  theme,
  setTheme,
}) => {
  const mainNavItems = [
    { id: 'dashboard' as NavigationTab, label: 'Dashboard', icon: Home, badge: null },
    { id: 'upload' as NavigationTab, label: 'Uploaded Reports', icon: FolderPlus, badge: 'New', badgeType: 'emerald' },
    { id: 'reports' as NavigationTab, label: 'Analysis', icon: Activity, badge: null, disabled: !hasActiveReport },
    { id: 'profile' as NavigationTab, label: 'Patient Accounts', icon: Users, badge: 'Auto-sync', badgeType: 'blue' },
    { id: 'history' as NavigationTab, label: 'Reports & History', icon: FileText, badge: null },
    { id: 'settings' as NavigationTab, label: 'Settings', icon: Settings, badge: null },
  ];

  const quickTools = [
    { id: 'guidelines' as NavigationTab, label: 'Medical Guidelines', icon: BookOpen },
    { id: 'ranges' as NavigationTab, label: 'Reference Ranges', icon: FlaskConical },
    { id: 'about' as NavigationTab, label: 'About Me', icon: User, badge: 'Dev' },
  ];

  return (
    <aside 
      id="sidebar-navigation" 
      className="w-64 bg-[#0D141C] dark:bg-[#070A0F] text-slate-300 flex flex-col shrink-0 border-r border-[#1B2533] dark:border-[#131A24] select-none z-20 transition-colors shadow-xs"
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-[#1B2533] dark:border-[#131A24] flex items-center justify-between bg-[#0A0F15]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0D6E5D] flex items-center justify-center text-white shadow-xs shrink-0 border border-emerald-500/30">
            <Activity className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-base tracking-tight text-white">MedInsight</span>
              <span className="font-extrabold text-base tracking-tight text-emerald-400">AI</span>
            </div>
            <p className="text-[11px] text-[#8E9CAE] font-medium leading-none mt-1">
              Clinical Diagnostic Portal
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links - cleanly styled with zero scrollbar pipe */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isDisabled = item.disabled;

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              disabled={isDisabled}
              onClick={() => {
                if (item.id === 'reports') {
                  onSelectReportView();
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer group ${
                isActive
                  ? 'bg-[#0D6E5D] text-white shadow-xs border-l-[3px] border-emerald-300 font-bold'
                  : isDisabled
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-300 hover:text-white hover:bg-[#15202D]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'}`} />
                <span className={isActive ? 'font-bold text-white' : 'font-medium'}>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.badgeType === 'emerald'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick Tools Header */}
        <div className="pt-6 px-3.5 pb-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8E9CAE]">
          [ QUICK TOOLS ]
        </div>

        {quickTools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTab === tool.id;

          return (
            <button
              key={tool.id}
              id={`quick-tool-${tool.id}`}
              onClick={() => setActiveTab(tool.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer group ${
                isActive
                  ? 'bg-[#13222E] text-emerald-300 font-semibold border-l-[3px] border-emerald-400'
                  : 'text-slate-300 hover:text-white hover:bg-[#15202D]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-400'}`} />
                <span>{tool.label}</span>
              </div>
              {tool.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {tool.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Status Footer */}
      <div className="p-3 border-t border-[#1B2533] dark:border-[#131A24] bg-[#0A0F15] space-y-2.5 transition-colors">
        {/* System Status Box */}
        <div className="rounded-xl border border-[#1E2C3D] bg-[#0F1722] p-2.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-slate-200">System Status</span>
          </div>
          <p className="text-[11px] text-emerald-400/90 mt-0.5 pl-4 font-medium">All systems operational</p>
        </div>

        {/* Bottom Logo & Version */}
        <div className="flex items-center justify-between px-2 pt-0.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <div className="w-4 h-4 rounded-full bg-[#0D6E5D] text-white flex items-center justify-center">
              <Activity className="w-2.5 h-2.5" />
            </div>
            <span className="font-bold text-slate-200 text-[11px]">MedInsight <span className="text-emerald-400">AI</span></span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">v2.8</span>
        </div>

        {/* Demo reset button */}
        <button
          id="btn-reset-demo"
          onClick={onResetDemo}
          title="Reset back to default sample reports"
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[10px] text-slate-400 hover:text-slate-200 hover:bg-[#15202D] transition-colors cursor-pointer"
        >
          <LogOut className="w-3 h-3" />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </aside>
  );
};
