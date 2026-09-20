export type TestStatus = 'normal' | 'low' | 'high' | 'critical';

export interface ReferenceRange {
  min?: number;
  max?: number;
  unit: string;
  text: string;
}

export interface LabTest {
  id: string;
  name: string;
  category: 'Hematology' | 'Biochemistry' | 'Lipid Profile' | 'Thyroid' | 'Vitamins & Minerals' | 'Urinalysis' | 'Metabolic' | 'Other';
  resultValue: string;
  numericValue?: number;
  unit: string;
  referenceRange: ReferenceRange;
  status: TestStatus;
  description: string;
  clinicalSignificance: string;
  simpleExplanation: string;
  recommendations?: string[];
}

export interface PatientInfo {
  name: string;
  age: number | string;
  gender: 'Male' | 'Female' | 'Other';
  reportType: string;
  reportDate: string;
  referringDoctor?: string;
  labName?: string;
  specimenId?: string;
  sampleCollectionDate?: string;
  specimenType?: string;
}

export interface ClinicalSummary {
  overallHealthStatus: 'Optimal' | 'Borderline Attention Needed' | 'Clinical Follow-up Advised' | 'Critical Review Required';
  headline: string;
  normalCount: number;
  abnormalCount: number;
  criticalCount: number;
  keyFindings: Array<{
    testName: string;
    status: TestStatus;
    summary: string;
  }>;
  dietaryRecommendations: string[];
  lifestyleModifications: string[];
  doctorFollowUpQuestions: string[];
  medicalDisclaimer: string;
}

export interface PatientAccount {
  id: string; // Medical Record Number (MRN)
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  dob?: string;
  bloodGroup: string;
  email: string;
  phone: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  primaryPhysician: string;
  insuranceId: string;
  accountCreatedAt: string;
  linkedReportIds: string[];
  allergies: string[];
  knownConditions: string[];
  vitals: {
    bloodPressure?: string;
    restingHeartRate?: number;
    bmi?: number;
    weightKg?: number;
    heightCm?: number;
  };
  latestBiomarkers?: {
    hemoglobin?: { value: string; status: TestStatus; date: string };
    bloodSugar?: { value: string; status: TestStatus; date: string };
    cholesterol?: { value: string; status: TestStatus; date: string };
    vitaminD?: { value: string; status: TestStatus; date: string };
    tsh?: { value: string; status: TestStatus; date: string };
  };
}

export interface MedicalReport {
  id: string;
  patientInfo: PatientInfo;
  tests: LabTest[];
  summary: ClinicalSummary;
  createdAt: string;
  fileName?: string;
  fileType?: string;
  rawText?: string;
  isDemo?: boolean;
  patientAccountId?: string;
}

export type NavigationTab = 'dashboard' | 'upload' | 'reports' | 'history' | 'profile' | 'about' | 'settings' | 'guidelines' | 'ranges';
