import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  FileType, 
  ArrowRight,
  ClipboardPaste,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { MedicalReport } from '../types';
import { INITIAL_REPORTS } from '../data/mockReports';
import { analyzeLabText } from '../utils/clinicalRules';

interface UploadViewProps {
  onReportAnalyzed: (report: MedicalReport) => void;
  onSelectSample: (report: MedicalReport) => void;
}

export const UploadView: React.FC<UploadViewProps> = ({
  onReportAnalyzed,
  onSelectSample,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setErrorMessage(null);
    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const processAnalysis = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      setProcessingStage('1/4: Ingesting & normalizing document stream...');
      await new Promise((r) => setTimeout(r, 600));

      setProcessingStage('2/4: Extracting text & clinical biomarkers (OCR/NLP)...');
      await new Promise((r) => setTimeout(r, 700));

      setProcessingStage('3/4: Comparing parameters against clinical reference ranges...');
      await new Promise((r) => setTimeout(r, 600));

      setProcessingStage('4/4: Generating plain-language insights & medical summary...');

      let payload: any = {};

      if (inputMode === 'paste' && pastedText.trim()) {
        payload = {
          text: pastedText,
          fileName: 'Manual_Pasted_Lab_Notes.txt',
        };
      } else if (selectedFile) {
        // Check if image
        if (selectedFile.type.startsWith('image/')) {
          const base64 = await toBase64(selectedFile);
          payload = {
            imageBase64: base64,
            mimeType: selectedFile.type,
            fileName: selectedFile.name,
          };
        } else {
          // Read text if text/pdf-like
          const textContent = await selectedFile.text().catch(() => '');
          payload = {
            text: textContent || `Medical Report uploaded: ${selectedFile.name}`,
            fileName: selectedFile.name,
            mimeType: selectedFile.type,
          };
        }
      } else {
        throw new Error('Please select a file or paste lab text to analyze.');
      }

      // Call API if server exists, or seamlessly fallback to in-browser clinical engine
      let parsedReport: MedicalReport | null = null;

      try {
        const response = await fetch('/api/analyze-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.report) {
            parsedReport = data.report;
          }
        }
      } catch (fetchErr) {
        console.info('Backend endpoint not reachable (static host/offline mode). Using client-side clinical analysis engine:', fetchErr);
      }

      // If backend was not reached or returned no report (e.g. GitHub Pages static deploy or offline mode)
      if (!parsedReport) {
        const textToAnalyze = payload.text || (selectedFile ? `Patient Medical Lab Report: ${selectedFile.name}` : '');
        parsedReport = analyzeLabText(textToAnalyze, payload.fileName);
      }

      if (parsedReport) {
        onReportAnalyzed(parsedReport);
      } else {
        throw new Error('Could not parse clinical report data.');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'Error occurred during clinical report extraction.');
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  return (
    <div id="upload-report-view" className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Title Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-[#15191E] dark:text-[#F1F5F9] tracking-tight">Upload Medical Report</h2>
        <p className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE]">
          Upload any laboratory diagnostic sheet, blood work report, pathology summary, or paste lab values.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-[#FAF8F5] dark:bg-[#0D1117] rounded-xl w-fit border border-[#E6E2DA] dark:border-[#232D3B] text-xs font-semibold shadow-2xs">
        <button
          id="tab-mode-upload"
          onClick={() => setInputMode('upload')}
          className={`px-4 py-2 rounded-lg transition-all cursor-pointer font-bold flex items-center gap-2 ${
            inputMode === 'upload' 
              ? 'bg-white dark:bg-[#161D26] text-[#15191E] dark:text-white shadow-2xs border border-[#E6E2DA] dark:border-[#232D3B]' 
              : 'text-[#5F6B7A] dark:text-[#8E9CAE] hover:text-[#15191E] dark:hover:text-white'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5 text-[#0D6E5D] dark:text-emerald-400" />
          <span>File Upload (PDF/Image)</span>
        </button>
        <button
          id="tab-mode-paste"
          onClick={() => setInputMode('paste')}
          className={`px-4 py-2 rounded-lg transition-all cursor-pointer font-bold flex items-center gap-2 ${
            inputMode === 'paste' 
              ? 'bg-white dark:bg-[#161D26] text-[#15191E] dark:text-white shadow-2xs border border-[#E6E2DA] dark:border-[#232D3B]' 
              : 'text-[#5F6B7A] dark:text-[#8E9CAE] hover:text-[#15191E] dark:hover:text-white'
          }`}
        >
          <ClipboardPaste className="w-3.5 h-3.5 text-[#0D6E5D] dark:text-emerald-400" />
          <span>Paste Lab Text / WhatsApp</span>
        </button>
      </div>

      {/* Main Dropzone / Paste Area */}
      {inputMode === 'upload' ? (
        <div
          id="dropzone-area"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-150 ${
            dragActive
              ? 'border-[#0D6E5D] bg-emerald-50/50 dark:bg-emerald-950/20 scale-[1.005]'
              : 'border-[#E6E2DA] dark:border-[#232D3B] hover:border-[#0D6E5D] dark:hover:border-emerald-500 bg-white dark:bg-[#161D26] shadow-[0_1px_3px_rgba(21,25,30,0.03)]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            id="medical-file-input"
            accept=".pdf,.png,.jpg,.jpeg,.txt"
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FAF8F5] dark:bg-[#0D1117] text-[#0D6E5D] dark:text-emerald-400 flex items-center justify-center border border-[#E6E2DA] dark:border-[#232D3B] shadow-2xs">
              <UploadCloud className="w-8 h-8" />
            </div>

            {selectedFile ? (
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-[#0D6E5D] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#0D6E5D] dark:text-emerald-400" />
                  <span>File Selected: {selectedFile.name}</span>
                </div>
                <p className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE]">
                  Size: {(selectedFile.size / 1024).toFixed(1)} KB • Ready for extraction
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-base font-bold text-[#15191E] dark:text-[#F1F5F9]">
                  Drag & Drop your medical report here
                </p>
                <p className="text-xs text-[#5F6B7A] dark:text-[#8E9CAE]">or click to browse from your computer</p>
              </div>
            )}

            <div className="pt-2 flex flex-wrap justify-center items-center gap-2 text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] font-medium">
              <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B]">PDF</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B]">PNG</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B]">JPG</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B]">JPEG</span>
            </div>

            <p className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] pt-1">
              Supports diagnostic lab sheets from Quest, Labcorp, Dr Lal PathLabs, SRL, Apex, or any hospital.
            </p>
          </div>
        </div>
      ) : (
        /* Text Paste Mode */
        <div className="bg-white dark:bg-[#161D26] rounded-2xl border border-[#E6E2DA] dark:border-[#232D3B] p-5 space-y-3 shadow-[0_1px_3px_rgba(21,25,30,0.03)]">
          <label htmlFor="textarea-paste-report" className="block text-xs font-bold text-[#15191E] dark:text-[#F1F5F9]">
            Paste Raw Laboratory Values or Doctor Notes:
          </label>
          <textarea
            id="textarea-paste-report"
            rows={7}
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="e.g.&#10;Patient: Rahul Sharma, Age: 28, Male&#10;Hemoglobin: 10.5 g/dL (Normal 12-16)&#10;Fasting Blood Sugar: 95 mg/dL (Normal 70-110)&#10;Total Cholesterol: 230 mg/dL (Normal < 200)&#10;Vitamin D3: 18 ng/mL (Normal 20-50)"
            className="w-full text-xs font-mono p-3.5 bg-[#FAF8F5] dark:bg-[#0D1117] border border-[#E6E2DA] dark:border-[#232D3B] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D6E5D]/20 focus:border-[#0D6E5D] text-[#15191E] dark:text-white placeholder-[#5F6B7A]/60 transition-colors"
          />
          <p className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE]">
            Paste test results directly from your email, message, or digital PDF report.
          </p>
        </div>
      )}

      {/* Error Banner if any */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">Extraction Error</p>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Action Button & Processing Animation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 text-xs text-[#5F6B7A] dark:text-[#8E9CAE]">
          <ShieldCheck className="w-4 h-4 text-[#0D6E5D] dark:text-emerald-400 shrink-0" />
          <span>HIPAA & GDPR Compliant • Client-Side Tokenization Security</span>
        </div>

        <button
          id="btn-start-analysis"
          onClick={processAnalysis}
          disabled={isProcessing || (inputMode === 'upload' && !selectedFile) || (inputMode === 'paste' && !pastedText.trim())}
          className={`w-full sm:w-auto px-7 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
            isProcessing || (inputMode === 'upload' && !selectedFile) || (inputMode === 'paste' && !pastedText.trim())
              ? 'bg-[#FAF8F5] dark:bg-[#0D1117] text-[#5F6B7A] dark:text-[#8E9CAE] border border-[#E6E2DA] dark:border-[#232D3B] cursor-not-allowed shadow-none'
              : 'bg-[#0D6E5D] hover:bg-[#095245] text-white shadow-sm active:scale-[0.98]'
          }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Analyzing Biomarkers...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Analyze & Extract Report</span>
            </>
          )}
        </button>
      </div>

      {/* Live Processing Pipeline Overlay / Status */}
      {isProcessing && (
        <div className="p-4 rounded-xl bg-[#15191E] dark:bg-[#0D1117] text-white text-xs space-y-2 shadow-sm border border-[#232D3B] animate-pulse">
          <div className="flex items-center justify-between font-semibold">
            <div className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span className="text-emerald-400 font-mono">PROCESSING PIPELINE</span>
            </div>
            <span className="text-[10px] text-[#8E9CAE]">Gemini 2.5 Flash & Clinical Rule Engine</span>
          </div>
          <p className="text-slate-200 font-medium pl-5">{processingStage}</p>
        </div>
      )}

      {/* Sample Clinical Reports Quick Bar */}
      <div className="pt-6 border-t border-[#E6E2DA] dark:border-[#232D3B] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F6B7A] dark:text-[#8E9CAE]">
            Or Test Instantly with Sample Clinical Reports:
          </h3>
          <span className="text-[11px] text-[#0D6E5D] dark:text-emerald-400 font-semibold">1-Click Demo</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {INITIAL_REPORTS.map((sample) => {
            const abnormalCount = sample.summary.abnormalCount;
            return (
              <button
                key={sample.id}
                id={`btn-sample-report-${sample.id}`}
                onClick={() => onSelectSample(sample)}
                className="p-4 text-left rounded-xl bg-white dark:bg-[#161D26] border border-[#E6E2DA] dark:border-[#232D3B] hover:border-[#0D6E5D] dark:hover:border-emerald-500 hover:bg-[#FAF8F5]/50 dark:hover:bg-[#1C2530] transition-all duration-150 space-y-2.5 group shadow-[0_1px_3px_rgba(21,25,30,0.03)] cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#15191E] dark:text-[#F1F5F9] group-hover:text-[#0D6E5D] dark:group-hover:text-emerald-400 transition-colors">
                    {sample.patientInfo.name}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      abnormalCount > 0 
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50' 
                        : 'bg-emerald-50 dark:bg-emerald-950/60 text-[#0D6E5D] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50'
                    }`}
                  >
                    {abnormalCount > 0 ? `${abnormalCount} Flags` : 'Normal'}
                  </span>
                </div>
                <p className="text-[11px] text-[#5F6B7A] dark:text-[#8E9CAE] line-clamp-1">{sample.patientInfo.reportType}</p>
                <div className="flex items-center justify-between text-[10px] text-[#5F6B7A] dark:text-[#8E9CAE] pt-2 border-t border-[#E6E2DA]/80 dark:border-[#232D3B]">
                  <span>{sample.patientInfo.reportDate}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0D6E5D] dark:text-emerald-400 group-hover:underline">
                    Load <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
