import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Heart, 
  Activity, 
  AlertCircle, 
  FileText, 
  Stethoscope, 
  QrCode, 
  CreditCard, 
  Plus, 
  CheckCircle2, 
  ChevronRight,
  ExternalLink,
  Edit3,
  Droplet,
  ArrowRight,
  Users
} from 'lucide-react';
import { MedicalReport, PatientAccount, TestStatus } from '../types';
import { StatusBadge } from './ReportDetailView';

interface PatientProfileViewProps {
  account: PatientAccount;
  allAccounts: PatientAccount[];
  allReports: MedicalReport[];
  onSelectAccount: (acc: PatientAccount) => void;
  onOpenReport: (report: MedicalReport) => void;
  onUpdateAccount: (updated: PatientAccount) => void;
}

export const PatientProfileView: React.FC<PatientProfileViewProps> = ({
  account,
  allAccounts,
  allReports,
  onSelectAccount,
  onOpenReport,
  onUpdateAccount,
}) => {
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [editPhone, setEditPhone] = useState(account.phone);
  const [editEmail, setEditEmail] = useState(account.email);
  const [editAddress, setEditAddress] = useState(account.address);
  const [newAllergy, setNewAllergy] = useState('');

  // Reports associated with this patient
  const linkedReports = allReports.filter(
    (r) =>
      account.linkedReportIds.includes(r.id) ||
      r.patientInfo.name.toLowerCase() === account.name.toLowerCase()
  );

  const handleSaveContact = () => {
    onUpdateAccount({
      ...account,
      phone: editPhone,
      email: editEmail,
      address: editAddress,
    });
    setIsEditingContact(false);
  };

  const handleAddAllergy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllergy.trim()) return;
    onUpdateAccount({
      ...account,
      allergies: [...account.allergies, newAllergy.trim()],
    });
    setNewAllergy('');
  };

  const handleRemoveAllergy = (idx: number) => {
    onUpdateAccount({
      ...account,
      allergies: account.allergies.filter((_, i) => i !== idx),
    });
  };

  return (
    <div id="patient-profile-view" className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Header & Patient Account Switcher */}
      <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-6 shadow-[0_1px_3px_rgba(21,25,30,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#0D6E5D] dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Active Medical Account
            </span>
            <span className="text-[#E6E2DA] dark:text-[#232D3B]">•</span>
            <span className="text-xs font-mono text-[#5F6B7A] dark:text-[#8E9CAE]">{account.id}</span>
          </div>
          <h2 className="text-xl font-bold text-[#15191E] dark:text-[#F1F5F9] tracking-tight mt-1.5">
            Patient Health Profile & Records
          </h2>
          <p className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE]">
            Automatically created and synchronized from laboratory pathology reports
          </p>
        </div>

        {/* Patient Switcher */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-semibold text-[#5F6B7A] dark:text-[#8E9CAE] hidden sm:inline">Switch Account:</span>
          <select
            id="select-patient-account"
            value={account.id}
            onChange={(e) => {
              const selected = allAccounts.find((a) => a.id === e.target.value);
              if (selected) onSelectAccount(selected);
            }}
            className="w-full md:w-auto bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] text-[#15191E] dark:text-slate-100 text-xs font-semibold rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0D6E5D]/20 focus:border-[#0D6E5D] cursor-pointer transition-all"
          >
            {allAccounts.map((acc) => (
              <option key={acc.id} value={acc.id} className="dark:bg-[#161D26] dark:text-slate-100">
                {acc.name} ({acc.age} yrs, {acc.gender}) - {acc.id}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Digital Medical ID Card + Quick Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Digital Medical ID Card (Left 1 Col) */}
        <div className="bg-[#15191E] dark:bg-[#0D1117] rounded-2xl border border-[#232D3B] p-6 text-white shadow-md space-y-6 flex flex-col justify-between relative overflow-hidden">
          {/* Top of card */}
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#0D6E5D] flex items-center justify-center text-white font-bold shadow-xs">
                <Activity className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block font-semibold">MedInsight Card</span>
                <span className="text-xs font-bold text-white tracking-wide">DIGITAL HEALTH ID</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/10">
              <QrCode className="w-5 h-5" />
            </div>
          </div>

          {/* Center: Patient identity */}
          <div className="space-y-1 relative z-10 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-white tracking-tight">{account.name}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Droplet className="w-3 h-3 text-rose-400" />
                {account.bloodGroup}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              {account.age} Years • {account.gender} • Born {account.dob}
            </p>
          </div>

          {/* Bottom credentials */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-700/80 text-[11px] relative z-10">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Medical Record No</span>
              <span className="font-mono font-bold text-white text-xs">{account.id}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Insurance ID</span>
              <span className="font-mono text-slate-200 text-xs truncate block">{account.insuranceId}</span>
            </div>
            <div className="col-span-2 pt-1">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Emergency Contact</span>
              <span className="text-slate-200 text-xs">
                {account.emergencyContact.name} ({account.emergencyContact.relationship}): {account.emergencyContact.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Demographics & Clinical Information (Right 2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-6 shadow-[0_1px_3px_rgba(21,25,30,0.03)] space-y-5 transition-colors">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#E6E2DA]/80 dark:border-[#232D3B]">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#0D6E5D] dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-[#15191E] dark:text-[#F1F5F9]">Personal & Clinical Information</h3>
            </div>
            <button
              onClick={() => setIsEditingContact(!isEditingContact)}
              className="text-xs font-bold text-[#0D6E5D] dark:text-emerald-400 hover:text-[#095245] dark:hover:text-emerald-300 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingContact ? 'Cancel' : 'Edit Contact'}</span>
            </button>
          </div>

          {isEditingContact ? (
            /* Edit Form */
            <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[#5F6B7A] dark:text-[#8E9CAE] font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full p-2.5 bg-white dark:bg-[#161D26] border border-[#E6E2DA] dark:border-[#232D3B] rounded-xl text-[#15191E] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0D6E5D]/20"
                  />
                </div>
                <div>
                  <label className="block text-[#5F6B7A] dark:text-[#8E9CAE] font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full p-2.5 bg-white dark:bg-[#161D26] border border-[#E6E2DA] dark:border-[#232D3B] rounded-xl text-[#15191E] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0D6E5D]/20"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#5F6B7A] dark:text-[#8E9CAE] font-semibold mb-1">Home Address</label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full p-2.5 bg-white dark:bg-[#161D26] border border-[#E6E2DA] dark:border-[#232D3B] rounded-xl text-[#15191E] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0D6E5D]/20"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleSaveContact}
                  className="px-4 py-2 bg-[#0D6E5D] hover:bg-[#095245] text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            /* Demographic Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] text-[#5F6B7A] dark:text-[#8E9CAE] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[#5F6B7A] dark:text-[#8E9CAE] block text-[11px]">Registered Email</span>
                  <span className="font-semibold text-[#15191E] dark:text-white">{account.email}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] text-[#5F6B7A] dark:text-[#8E9CAE] shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[#5F6B7A] dark:text-[#8E9CAE] block text-[11px]">Primary Mobile</span>
                  <span className="font-semibold text-[#15191E] dark:text-white">{account.phone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] text-[#5F6B7A] dark:text-[#8E9CAE] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[#5F6B7A] dark:text-[#8E9CAE] block text-[11px]">Residential Address</span>
                  <span className="font-semibold text-[#15191E] dark:text-white">{account.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] text-[#5F6B7A] dark:text-[#8E9CAE] shrink-0">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[#5F6B7A] dark:text-[#8E9CAE] block text-[11px]">Primary Care Doctor</span>
                  <span className="font-semibold text-[#15191E] dark:text-white">{account.primaryPhysician}</span>
                </div>
              </div>
            </div>
          )}

          {/* Vitals Bar */}
          <div className="pt-3 border-t border-[#E6E2DA]/80 dark:border-[#232D3B]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5F6B7A] dark:text-[#8E9CAE] block mb-3">
              Latest Recorded Vitals
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B]">
                <span className="text-[10px] text-[#5F6B7A] dark:text-[#8E9CAE] block">Blood Pressure</span>
                <span className="text-xs font-bold text-[#15191E] dark:text-white">{account.vitals.bloodPressure || '120/80 mmHg'}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B]">
                <span className="text-[10px] text-[#5F6B7A] dark:text-[#8E9CAE] block">Resting Heart Rate</span>
                <span className="text-xs font-bold text-[#15191E] dark:text-white">{account.vitals.restingHeartRate || 72} bpm</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B]">
                <span className="text-[10px] text-[#5F6B7A] dark:text-[#8E9CAE] block">Body Mass Index</span>
                <span className="text-xs font-bold text-[#15191E] dark:text-white">{account.vitals.bmi || 22.5} (Normal)</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B]">
                <span className="text-[10px] text-[#5F6B7A] dark:text-[#8E9CAE] block">Weight / Height</span>
                <span className="text-xs font-bold text-[#15191E] dark:text-white">
                  {account.vitals.weightKg} kg / {account.vitals.heightCm} cm
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Biomarker Snapshot & Trends */}
      <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-6 shadow-[0_1px_3px_rgba(21,25,30,0.03)] space-y-4 transition-colors">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E6E2DA]/80 dark:border-[#232D3B]">
          <div>
            <h3 className="text-sm font-bold text-[#15191E] dark:text-[#F1F5F9]">Consolidated Clinical Biomarker Trends</h3>
            <p className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE]">Latest observed parameters extracted across all linked diagnostic reports</p>
          </div>
          <span className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE] font-semibold">
            {linkedReports.length} {linkedReports.length === 1 ? 'Report' : 'Reports'} on file
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Hemoglobin */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-[#15191E] dark:text-[#F1F5F9]">Hemoglobin</span>
              {account.latestBiomarkers?.hemoglobin && (
                <StatusBadge status={account.latestBiomarkers.hemoglobin.status} />
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-[#15191E] dark:text-white">
                {account.latestBiomarkers?.hemoglobin?.value || '10.5 g/dL'}
              </span>
            </div>
            <p className="text-[10px] text-[#5F6B7A] dark:text-[#8E9CAE]">Ref: 12.0 - 16.0 g/dL</p>
          </div>

          {/* Blood Sugar */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-[#15191E] dark:text-[#F1F5F9]">Fasting Glucose</span>
              {account.latestBiomarkers?.bloodSugar && (
                <StatusBadge status={account.latestBiomarkers.bloodSugar.status} />
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-[#15191E] dark:text-white">
                {account.latestBiomarkers?.bloodSugar?.value || '95 mg/dL'}
              </span>
            </div>
            <p className="text-[10px] text-[#5F6B7A] dark:text-[#8E9CAE]">Ref: 70 - 110 mg/dL</p>
          </div>

          {/* Total Cholesterol */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-[#15191E] dark:text-[#F1F5F9]">Total Cholesterol</span>
              {account.latestBiomarkers?.cholesterol && (
                <StatusBadge status={account.latestBiomarkers.cholesterol.status} />
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-[#15191E] dark:text-white">
                {account.latestBiomarkers?.cholesterol?.value || '230 mg/dL'}
              </span>
            </div>
            <p className="text-[10px] text-[#5F6B7A] dark:text-[#8E9CAE]">Ref: &lt; 200 mg/dL</p>
          </div>

          {/* Vitamin D */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-[#15191E] dark:text-[#F1F5F9]">Vitamin D (25-OH)</span>
              {account.latestBiomarkers?.vitaminD && (
                <StatusBadge status={account.latestBiomarkers.vitaminD.status} />
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-[#15191E] dark:text-white">
                {account.latestBiomarkers?.vitaminD?.value || '18 ng/mL'}
              </span>
            </div>
            <p className="text-[10px] text-[#5F6B7A] dark:text-[#8E9CAE]">Ref: 20 - 50 ng/mL</p>
          </div>
        </div>
      </div>

      {/* Conditions, Allergies & Linked Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conditions & Allergies */}
        <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-6 shadow-[0_1px_3px_rgba(21,25,30,0.03)] space-y-5 transition-colors">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#15191E] dark:text-[#F1F5F9]">
                Diagnostic Health Flags & Inferred Conditions
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {account.knownConditions.map((cond, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold"
                >
                  {cond}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#E6E2DA]/80 dark:border-[#232D3B]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#15191E] dark:text-[#F1F5F9]">
                Known Drug & Environmental Allergies
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3.5">
              {account.allergies.map((allg, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>{allg}</span>
                  <button
                    onClick={() => handleRemoveAllergy(idx)}
                    className="text-rose-400 hover:text-rose-700 dark:hover:text-rose-200 text-xs font-bold cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Quick add allergy */}
            <form onSubmit={handleAddAllergy} className="flex gap-2">
              <input
                type="text"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Add new allergy (e.g. Shellfish, Penicillin)..."
                className="flex-1 px-3.5 py-2 text-xs bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] rounded-xl text-[#15191E] dark:text-slate-100 placeholder:text-[#5F6B7A]/60 focus:outline-none focus:ring-2 focus:ring-[#0D6E5D]/20"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#15191E] dark:bg-[#0D1117] hover:bg-[#232D3B] text-white border border-[#15191E] dark:border-[#232D3B] rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
              >
                Add
              </button>
            </form>
          </div>
        </div>

        {/* Linked Reports for this account */}
        <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-6 shadow-[0_1px_3px_rgba(21,25,30,0.03)] space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6E2DA]/80 dark:border-[#232D3B]">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0D6E5D] dark:text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#15191E] dark:text-[#F1F5F9]">
                Diagnostic Reports for {account.name}
              </h3>
            </div>
            <span className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE]">{linkedReports.length} Available</span>
          </div>

          <div className="space-y-2.5">
            {linkedReports.length === 0 ? (
              <p className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE] py-6 text-center">
                No diagnostic reports currently linked to this profile.
              </p>
            ) : (
              linkedReports.map((r) => {
                const hasAbnormal = r.summary.abnormalCount > 0;
                return (
                  <div
                    key={r.id}
                    onClick={() => onOpenReport(r)}
                    className="p-3.5 rounded-xl border border-[#E6E2DA] dark:border-[#232D3B] hover:border-[#0D6E5D] dark:hover:border-emerald-500 bg-[#FAF8F5] dark:bg-[#0D1117] hover:bg-white dark:hover:bg-[#161D26] transition-all cursor-pointer flex items-center justify-between gap-3 text-xs shadow-2xs group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#15191E] dark:text-white truncate group-hover:text-[#0D6E5D] dark:group-hover:text-emerald-400 transition-colors">
                          {r.patientInfo.reportType}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                            hasAbnormal 
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' 
                              : 'bg-emerald-50 dark:bg-emerald-950/60 text-[#0D6E5D] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          }`}
                        >
                          {hasAbnormal ? `${r.summary.abnormalCount} Flags` : 'Normal'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] mt-1">
                        {r.id} • {r.patientInfo.reportDate} • {r.tests.length} tests
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#5F6B7A] dark:text-[#8E9CAE] group-hover:text-[#0D6E5D] dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
