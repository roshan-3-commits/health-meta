/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MedicalReport, NavigationTab, PatientAccount } from './types';
import { INITIAL_REPORTS } from './data/mockReports';
import { INITIAL_PATIENT_ACCOUNTS, getOrCreatePatientAccount } from './utils/patientAccountManager';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { UploadView } from './components/UploadView';
import { ReportDetailView } from './components/ReportDetailView';
import { HistoryView } from './components/HistoryView';
import { PatientProfileView } from './components/PatientProfileView';
import { GuidelinesView } from './components/GuidelinesView';
import { ReferenceRangesView } from './components/ReferenceRangesView';
import { HelpSupportView } from './components/HelpSupportView';
import { AboutMeView } from './components/AboutMeView';
import { SettingsView } from './components/SettingsView';
import { PrintReportModal } from './components/PrintReportModal';
import { CommandPalette } from './components/CommandPalette';
import { UserCheck, Sparkles, X } from 'lucide-react';

const REPORTS_STORAGE_KEY = 'medinsight_reports_v1';
const ACCOUNTS_STORAGE_KEY = 'medinsight_accounts_v1';
const THEME_STORAGE_KEY = 'medinsight_theme_mode';
const DENSITY_STORAGE_KEY = 'medinsight_density_mode';

export default function App() {
  // Theme State (Light vs Dark mode)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    // Check system preference as fallback
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Table & Card Display Density (Comfortable vs Compact)
  const [density, setDensity] = useState<'comfortable' | 'compact'>(() => {
    const saved = localStorage.getItem(DENSITY_STORAGE_KEY);
    return saved === 'compact' ? 'compact' : 'comfortable';
  });

  // Sync density to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(DENSITY_STORAGE_KEY, density);
    } catch (e) {
      console.warn('LocalStorage save density failed:', e);
    }
  }, [density]);

  // Sync theme with documentElement class and localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  // Reports State
  const [reports, setReports] = useState<MedicalReport[]>(() => {
    const saved = localStorage.getItem(REPORTS_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((r: MedicalReport) => r.id));
          const missingDemos = INITIAL_REPORTS.filter((r) => !existingIds.has(r.id));
          return [...parsed, ...missingDemos];
        }
      } catch (e) {
        console.error('Failed to parse cached reports', e);
      }
    }
    return INITIAL_REPORTS;
  });

  // Patient Accounts State
  const [accounts, setAccounts] = useState<PatientAccount[]>(() => {
    const saved = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached accounts', e);
      }
    }
    return INITIAL_PATIENT_ACCOUNTS;
  });

  // Current Active Report (Defaults to Rahul Sharma's report matching the blueprint)
  const [currentReport, setCurrentReport] = useState<MedicalReport>(() => {
    return reports[0] || INITIAL_REPORTS[0];
  });

  // Current Active Patient Account
  const [activeAccount, setActiveAccount] = useState<PatientAccount>(() => {
    const matching = accounts.find(
      (a) => a.name.toLowerCase() === (currentReport?.patientInfo?.name || '').toLowerCase()
    );
    return matching || accounts[0] || INITIAL_PATIENT_ACCOUNTS[0];
  });

  // Navigation Tab
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');

  // Command Palette Search Modal
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Print Modal State
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [reportToPrint, setReportToPrint] = useState<MedicalReport | null>(null);

  // Auto-Account Creation Notification Toast
  const [toast, setToast] = useState<{ message: string; mrn: string; name: string } | null>(null);

  // Escape key closes open modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen]);

  // Sync reports to local storage
  useEffect(() => {
    try {
      localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
    } catch (e) {
      console.warn('LocalStorage save reports failed:', e);
    }
  }, [reports]);

  // Sync accounts to local storage
  useEffect(() => {
    try {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.warn('LocalStorage save accounts failed:', e);
    }
  }, [accounts]);

  // Handle report analyzed from Upload: AUTOMATICALLY CREATES OR UPDATES PATIENT ACCOUNT!
  const handleReportAnalyzed = (newReport: MedicalReport) => {
    // 1. Ingest report
    setReports((prev) => [newReport, ...prev]);
    setCurrentReport(newReport);

    // 2. Automatically sync with Patient Accounts
    const { updatedAccounts, account: matchedAccount, isNew: isNewAccount } = getOrCreatePatientAccount(
      newReport,
      accounts
    );

    setAccounts(updatedAccounts);
    setActiveAccount(matchedAccount);

    // 3. Show confirmation feedback toast
    setToast({
      message: isNewAccount
        ? `Created new Patient Account for ${matchedAccount.name}`
        : `Synchronized report with existing account for ${matchedAccount.name}`,
      mrn: matchedAccount.id,
      name: matchedAccount.name,
    });

    // Automatically navigate to Analysis view
    setActiveTab('reports');
  };

  // Reset to sample initial state
  const handleResetDemo = () => {
    localStorage.removeItem(REPORTS_STORAGE_KEY);
    localStorage.removeItem(ACCOUNTS_STORAGE_KEY);
    setReports(INITIAL_REPORTS);
    setAccounts(INITIAL_PATIENT_ACCOUNTS);
    setCurrentReport(INITIAL_REPORTS[0]);
    setActiveAccount(INITIAL_PATIENT_ACCOUNTS[0]);
    setActiveTab('dashboard');
  };

  // Select report
  const handleSelectReport = (report: MedicalReport) => {
    setCurrentReport(report);
    // Also sync active account
    const matched = accounts.find(
      (a) =>
        a.name.toLowerCase() === report.patientInfo.name.toLowerCase() ||
        a.linkedReportIds.includes(report.id)
    );
    if (matched) setActiveAccount(matched);
    setActiveTab('reports');
  };

  // Select account from PatientProfileView
  const handleSelectAccount = (account: PatientAccount) => {
    setActiveAccount(account);
    const latestId = account.linkedReportIds[0];
    const relatedReport = reports.find((r) => r.id === latestId);
    if (relatedReport) {
      setCurrentReport(relatedReport);
    }
  };

  // Update existing account
  const handleUpdateAccount = (updated: PatientAccount) => {
    setAccounts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    if (activeAccount?.id === updated.id) {
      setActiveAccount(updated);
    }
  };

  // Delete report
  const handleDeleteReport = (reportId: string) => {
    const updated = reports.filter((r) => r.id !== reportId);
    setReports(updated);
    if (currentReport?.id === reportId) {
      if (updated.length > 0) {
        setCurrentReport(updated[0]);
      }
    }
  };

  // Trigger Print modal
  const handlePrint = (report?: MedicalReport) => {
    setReportToPrint(report || currentReport);
    setIsPrintModalOpen(true);
  };

  // Handle sample selection from Upload tab
  const handleSelectSample = (sample: MedicalReport) => {
    handleReportAnalyzed(sample);
  };

  // Count abnormal reports
  const abnormalTotal = reports.filter((r) => r.summary.abnormalCount > 0).length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAF8F5] dark:bg-[#0D1117] text-[#15191E] dark:text-[#F1F5F9] font-sans antialiased transition-colors">
      {/* Auto-Sync Toast Notification */}
      {toast && (
        <div
          id="auto-sync-toast"
          className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-slate-900 dark:bg-slate-800 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/80 animate-in fade-in slide-in-from-top-4 duration-200 max-w-md"
        >
          <div className="w-8 h-8 rounded-xl bg-[#0d7a68] text-white flex items-center justify-center shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Patient Account Auto-Synchronized</span>
            </div>
            <p className="text-xs text-slate-200 mt-0.5 truncate">{toast.message}</p>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">MRN: {toast.mrn}</div>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Primary Navigation Sidebar with Theme Switcher */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activePatient={activeAccount ? {
          name: activeAccount.name,
          age: activeAccount.age,
          gender: activeAccount.gender,
          reportType: currentReport.patientInfo.reportType,
          reportDate: currentReport.patientInfo.reportDate,
        } : currentReport.patientInfo}
        reportsCount={reports.length}
        abnormalCount={abnormalTotal}
        hasActiveReport={Boolean(currentReport)}
        onSelectReportView={() => setActiveTab('reports')}
        onResetDemo={handleResetDemo}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <Header
          currentReport={currentReport}
          allReports={reports}
          onSelectReport={(r) => handleSelectReport(r)}
          onPrint={() => handlePrint()}
          onOpenProfile={() => setActiveTab('profile')}
          onOpenAbout={() => setActiveTab('about')}
          onOpenSearch={() => setIsCommandPaletteOpen(true)}
          theme={theme}
          setTheme={setTheme}
          density={density}
          setDensity={setDensity}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <DashboardView
              reports={reports}
              onNavigate={(tab) => setActiveTab(tab)}
              onSelectReport={handleSelectReport}
              onOpenSearch={() => setIsCommandPaletteOpen(true)}
            />
          )}

          {activeTab === 'upload' && (
            <UploadView
              onReportAnalyzed={handleReportAnalyzed}
              onSelectSample={handleSelectSample}
            />
          )}

          {activeTab === 'reports' && (
            <ReportDetailView
              report={currentReport}
              allReports={reports}
              onPrint={() => handlePrint()}
              onNewUpload={() => setActiveTab('upload')}
              onViewPatientProfile={() => setActiveTab('profile')}
              density={density}
            />
          )}

          {activeTab === 'profile' && (
            <PatientProfileView
              account={activeAccount}
              allAccounts={accounts}
              allReports={reports}
              onSelectAccount={handleSelectAccount}
              onOpenReport={(rep) => {
                setCurrentReport(rep);
                setActiveTab('reports');
              }}
              onUpdateAccount={handleUpdateAccount}
            />
          )}

          {activeTab === 'history' && (
            <HistoryView
              reports={reports}
              onSelectReport={handleSelectReport}
              onDeleteReport={handleDeleteReport}
              onNavigate={(tab) => setActiveTab(tab)}
              onPrintReport={(r) => handlePrint(r)}
            />
          )}

          {/* Quick Tools & Settings: Dedicated Distinct Views! */}
          {activeTab === 'guidelines' && (
            <GuidelinesView />
          )}

          {activeTab === 'ranges' && (
            <ReferenceRangesView />
          )}

          {activeTab === 'about' && (
            <AboutMeView />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              theme={theme}
              setTheme={setTheme}
              onResetDemo={handleResetDemo}
            />
          )}
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        reports={reports}
        accounts={accounts}
        onSelectReport={handleSelectReport}
        onSelectAccount={handleSelectAccount}
        onNavigate={(tab) => setActiveTab(tab)}
      />

      {/* Print Document Modal */}
      {isPrintModalOpen && (
        <PrintReportModal
          report={reportToPrint}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}
    </div>
  );
}
