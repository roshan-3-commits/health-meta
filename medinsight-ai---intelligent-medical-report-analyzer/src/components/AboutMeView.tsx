import React from 'react';
import { 
  User, 
  GraduationCap, 
  School, 
  Code2, 
  Cpu, 
  Award, 
  FileCheck2, 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  MapPin,
  Calendar,
  BookOpen
} from 'lucide-react';

export const AboutMeView: React.FC = () => {
  const projectModules = [
    {
      title: 'Automated Pathology Report Parser',
      desc: 'Multimodal extraction of test biomarkers (CBC, Lipid Panel, Metabolic, Renal & Liver) with automated numerical and unit parsing.',
      icon: FileCheck2,
      tag: 'OCR & Parser'
    },
    {
      title: 'NABL ISO 15189:2022 Reference Engine',
      desc: 'Standardized biological reference intervals with high/low anomaly detection and critical panic threshold flagging.',
      icon: ShieldCheck,
      tag: 'Clinical Safety'
    },
    {
      title: 'Longitudinal Patient Diagnostics',
      desc: 'Automatic multi-patient profile linking, delta-check comparisons, and historical biometric trend visualization.',
      icon: Activity,
      tag: 'Patient Records'
    },
    {
      title: 'Accredited PDF Laboratory Print Engine',
      desc: 'Official hospital pathology letterhead generation with accession barcodes, pathologist signature blocks, and verification seals.',
      icon: Award,
      tag: 'Export & Print'
    },
  ];

  const technologies = [
    { name: 'React 18', role: 'Component UI Framework', level: 'Frontend' },
    { name: 'TypeScript', role: 'Type-Safe Clinical Schemas', level: 'Core Logic' },
    { name: 'Tailwind CSS', role: 'Responsive Clinical Design', level: 'Styling' },
    { name: 'SVG / Canvas', role: 'Real-Time Trend Visualizers', level: 'Data Viz' },
    { name: 'ISO 15189 Specs', role: 'Pathology Reference Standards', level: 'Medical Compliance' },
    { name: 'Local Persistence', role: 'Encrypted Browser Store', level: 'Data Engine' },
  ];

  return (
    <div id="about-me-view-root" className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Eyebrow Breadcrumb */}
      <div className="flex items-center justify-between text-[11px] font-mono tracking-wider text-[#5F6B7A] dark:text-[#8E9CAE] uppercase">
        <span>[ 01 // DEVELOPER DOSSIER ]</span>
        <span className="text-[#0D6E5D] dark:text-emerald-400 font-semibold">ACADEMIC YEAR 2024-2025</span>
      </div>

      {/* 1. Hero Profile Card - Editorial Bento Layout */}
      <div className="relative overflow-hidden rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] bg-white dark:bg-[#161D26] p-6 sm:p-8 shadow-[0_1px_3px_rgba(21,25,30,0.03)] transition-all">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            {/* Avatar with Crisp Hairline Framing */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#0D6E5D] via-[#095245] to-[#063b31] text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-xs shrink-0 border border-emerald-400/40">
              NS
            </div>

            {/* Core Details */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50/90 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[#0D6E5D] dark:text-emerald-300 text-[11px] font-bold tracking-tight">
                  <User className="w-3.5 h-3.5" />
                  <span>Lead Developer & Informatics Architect</span>
                </span>
                <span className="text-xs font-mono text-[#15191E] dark:text-emerald-300 bg-[#FAF8F5] dark:bg-[#0D1117] px-2.5 py-0.5 rounded-md border border-[#E6E2DA] dark:border-[#232D3B] font-bold">
                  Roll No: 266629
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#15191E] dark:text-[#F1F5F9] tracking-tight">
                Nisha Singh
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-[#5F6B7A] dark:text-[#8E9CAE]">
                <div className="inline-flex items-center gap-1.5 font-semibold text-[#0D6E5D] dark:text-emerald-300">
                  <GraduationCap className="w-4 h-4 text-[#0D6E5D] dark:text-emerald-400" />
                  <span>BSC - IT (Bachelor of Science in Information Technology)</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#5F6B7A] dark:text-[#8E9CAE] pt-0.5 font-medium">
                <School className="w-4 h-4 text-[#5F6B7A] dark:text-[#8E9CAE] shrink-0" />
                <span>KBP College Navi Mumbai - Vashi (Karmaveer Bhaurao Patil College)</span>
              </div>
            </div>
          </div>

          {/* Quick Academic Dossier Box */}
          <div className="bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] rounded-xl p-4 sm:min-w-64 shrink-0 space-y-2">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#5F6B7A] dark:text-[#8E9CAE]">
              [ PROFILE SPECIFICATIONS ]
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-[#E6E2DA]/80 dark:border-[#232D3B]">
                <span className="text-[#5F6B7A] dark:text-[#8E9CAE]">Department</span>
                <span className="font-semibold text-[#15191E] dark:text-[#F1F5F9]">Information Technology</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E6E2DA]/80 dark:border-[#232D3B]">
                <span className="text-[#5F6B7A] dark:text-[#8E9CAE]">Campus</span>
                <span className="font-semibold text-[#15191E] dark:text-[#F1F5F9]">Vashi, Navi Mumbai</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-[#5F6B7A] dark:text-[#8E9CAE]">Discipline</span>
                <span className="font-bold text-[#0D6E5D] dark:text-emerald-400">Clinical Informatics</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Project Presentation & Objective - Asymmetrical Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-6 sm:p-7 shadow-[0_1px_3px_rgba(21,25,30,0.03)] space-y-4 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#5F6B7A] dark:text-[#8E9CAE] uppercase tracking-wider">
              <span>[ 02 // CAPSTONE SYSTEM OVERVIEW ]</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF8F5] dark:bg-[#0D1117] text-[#5F6B7A] dark:text-[#8E9CAE] border border-[#E6E2DA] dark:border-[#232D3B]">
              BUILD v2.8
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-[#15191E] dark:text-[#F1F5F9] tracking-tight">
            MedInsight AI — Clinical Diagnostic & Pathology Intelligence Portal
          </h2>

          <p className="text-xs sm:text-sm text-[#5F6B7A] dark:text-[#8E9CAE] leading-relaxed">
            Engineered as an advanced healthcare informatics workstation by <strong>Nisha Singh (Roll No: 266629, BSC - IT)</strong> at <strong>KBP College, Navi Mumbai - Vashi</strong>. 
            The system resolves clinical ambiguity by converting unstructured pathology results into standardized ISO 15189 biological interval benchmarks, detecting acute abnormalities, and charting patient historical health trends.
          </p>

          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] hover:border-[#0D6E5D]/50 transition-colors">
              <div className="text-xs font-bold text-[#15191E] dark:text-[#F1F5F9] tracking-tight flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0D6E5D]"></span>
                <span>Clinical Problem Addressed</span>
              </div>
              <p className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] mt-1.5 leading-relaxed">
                Patients encounter diagnostic confusion due to dense laboratory jargon, delayed anomaly detection, and fragmented historical test tracking.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] hover:border-emerald-400/50 transition-colors">
              <div className="text-xs font-bold text-[#15191E] dark:text-[#F1F5F9] tracking-tight flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span>Technical Implementation</span>
              </div>
              <p className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] mt-1.5 leading-relaxed">
                Biomarker parsing, NABL reference interval normalization, multi-patient delta tracking, and accredited diagnostic PDF generation.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Competencies */}
        <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-6 sm:p-7 shadow-[0_1px_3px_rgba(21,25,30,0.03)] space-y-4 transition-all">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#5F6B7A] dark:text-[#8E9CAE] uppercase tracking-wider">
            <span>[ STACK MATRIX ]</span>
          </div>

          <div className="space-y-2">
            {technologies.map((tech) => (
              <div 
                key={tech.name} 
                className="p-2.5 rounded-lg bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] flex items-center justify-between text-xs hover:border-[#0D6E5D]/50 transition-colors"
              >
                <div>
                  <div className="font-bold text-[#15191E] dark:text-[#F1F5F9]">{tech.name}</div>
                  <div className="text-[10.5px] text-[#5F6B7A] dark:text-[#8E9CAE]">{tech.role}</div>
                </div>
                <span className="text-[10px] font-mono font-semibold text-[#0D6E5D] dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200/80 dark:border-emerald-800">
                  {tech.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Core Modules Developed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="text-xs font-mono font-bold text-[#5F6B7A] dark:text-[#8E9CAE] uppercase tracking-wider">
            <span>[ 03 // ARCHITECTURAL SUBSYSTEMS ]</span>
          </div>
          <span className="text-[11px] font-mono text-[#5F6B7A] dark:text-[#8E9CAE]">4 MODULES ACTIVE</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projectModules.map((module) => {
            const Icon = module.icon;
            return (
              <div 
                key={module.title}
                className="bg-white dark:bg-[#161D26] rounded-xl border border-[#E6E2DA] dark:border-[#232D3B] p-5 shadow-[0_1px_3px_rgba(21,25,30,0.03)] space-y-2.5 hover:border-[#0D6E5D]/60 dark:hover:border-emerald-500/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#0D6E5D] dark:text-emerald-300 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/60">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10.5px] font-mono font-bold text-[#5F6B7A] dark:text-[#8E9CAE] bg-[#FAF8F5] dark:bg-[#0D1117] px-2.5 py-0.5 rounded-md border border-[#E6E2DA] dark:border-[#232D3B]">
                    {module.tag}
                  </span>
                </div>
                <div className="font-bold text-sm text-[#15191E] dark:text-[#F1F5F9] tracking-tight">
                  {module.title}
                </div>
                <p className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE] leading-relaxed">
                  {module.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. College Verification & Acknowledgement Card */}
      <div className="bg-[#FAF8F5] dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5F6B7A] dark:text-[#8E9CAE]">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] flex items-center justify-center shrink-0">
            <School className="w-5 h-5 text-[#0D6E5D] dark:text-emerald-400" />
          </div>
          <div>
            <div className="font-bold text-[#15191E] dark:text-[#F1F5F9]">
              Karmaveer Bhaurao Patil College (KBP College), Vashi, Navi Mumbai
            </div>
            <div className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] font-mono">
              DEPARTMENT OF INFORMATION TECHNOLOGY • FINAL YEAR CAPSTONE PROJECT
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] font-mono text-[11px] font-bold text-[#15191E] dark:text-[#F1F5F9]">
          <span>Student: Nisha Singh</span>
          <span>•</span>
          <span className="text-[#0D6E5D] dark:text-emerald-400">266629</span>
        </div>
      </div>
    </div>
  );
};
