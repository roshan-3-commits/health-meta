import { MedicalReport, PatientAccount, TestStatus } from '../types';

export const INITIAL_PATIENT_ACCOUNTS: PatientAccount[] = [
  {
    id: 'MRN: 10224',
    name: 'Prasad Jadhav',
    age: 22,
    gender: 'Male',
    dob: '12 Aug 2003',
    bloodGroup: 'O+',
    email: 'prasad.jadhav@healthmail.com',
    phone: '+91 97654 32109',
    address: 'Flat 304, Green Heights, Pune, Maharashtra',
    emergencyContact: {
      name: 'Ramesh Jadhav',
      relationship: 'Father',
      phone: '+91 97654 32100',
    },
    primaryPhysician: 'Dr. V. Kulkarni, MD',
    insuranceId: 'ICICI-LOMB-10224',
    accountCreatedAt: '2025-09-17T09:00:00Z',
    linkedReportIds: ['REP-2025-10224'],
    allergies: ['None reported'],
    knownConditions: ['None - Baseline optimal health'],
    vitals: {
      bloodPressure: '120/78 mmHg',
      restingHeartRate: 70,
      bmi: 21.8,
      weightKg: 65,
      heightCm: 173,
    },
    latestBiomarkers: {
      hemoglobin: { value: '15.2 g/dL', status: 'normal', date: '17 Sep 2025' },
      bloodSugar: { value: '88 mg/dL', status: 'normal', date: '17 Sep 2025' },
      cholesterol: { value: '175 mg/dL', status: 'normal', date: '17 Sep 2025' },
    },
  },
  {
    id: 'MRN: 98231',
    name: 'Rahul Sharma',
    age: 28,
    gender: 'Male',
    dob: '14 Nov 1997',
    bloodGroup: 'B+',
    email: 'rahul.sharma@healthmail.com',
    phone: '+91 98201 44521',
    address: '402, Sunrise Enclave, Sector 14, Gurugram, India',
    emergencyContact: {
      name: 'Sunil Sharma',
      relationship: 'Father',
      phone: '+91 98110 33214',
    },
    primaryPhysician: 'Dr. A. Verma, MD (Internal Medicine)',
    insuranceId: 'HDFC-ERGO-8841920',
    accountCreatedAt: '2024-05-20T10:15:00Z',
    linkedReportIds: ['REP-2026-98231', 'REP-2024-98231'],
    allergies: ['Penicillin (Mild urticaria)', 'Dust Mites'],
    knownConditions: ['Mild Microcytic Anemia', 'Borderline Hypercholesterolemia', 'Vitamin D Insufficiency'],
    vitals: {
      bloodPressure: '118/76 mmHg',
      restingHeartRate: 72,
      bmi: 23.4,
      weightKg: 68,
      heightCm: 172,
    },
    latestBiomarkers: {
      hemoglobin: { value: '10.5 g/dL', status: 'low', date: '20 May 2024' },
      bloodSugar: { value: '95 mg/dL', status: 'normal', date: '20 May 2024' },
      cholesterol: { value: '230 mg/dL', status: 'high', date: '20 May 2024' },
      vitaminD: { value: '18 ng/mL', status: 'low', date: '20 May 2024' },
    },
  },
  {
    id: 'MRN: 77621',
    name: 'Priya Patel',
    age: 34,
    gender: 'Female',
    dob: '08 Feb 1992',
    bloodGroup: 'O+',
    email: 'priya.patel@healthmail.com',
    phone: '+91 98722 89312',
    address: '12-B, Green Meadows, Andheri West, Mumbai, India',
    emergencyContact: {
      name: 'Rohan Patel',
      relationship: 'Spouse',
      phone: '+91 98720 11234',
    },
    primaryPhysician: 'Dr. Sunita Rao, MD (Endocrinology)',
    insuranceId: 'MAX-BUPA-7712019',
    accountCreatedAt: '2024-05-10T14:20:00Z',
    linkedReportIds: ['REP-2024-77621'],
    allergies: ['Sulfa drugs'],
    knownConditions: ['Subclinical Hypothyroidism (Elevated TSH)'],
    vitals: {
      bloodPressure: '112/74 mmHg',
      restingHeartRate: 68,
      bmi: 22.1,
      weightKg: 58,
      heightCm: 162,
    },
    latestBiomarkers: {
      tsh: { value: '5.8 mIU/L', status: 'high', date: '10 May 2024' },
      hemoglobin: { value: '13.2 g/dL', status: 'normal', date: '10 May 2024' },
    },
  },
  {
    id: 'MRN: 55412',
    name: 'Vikram Singh',
    age: 52,
    gender: 'Male',
    dob: '22 Jul 1974',
    bloodGroup: 'A+',
    email: 'vikram.singh@healthmail.com',
    phone: '+91 99100 55432',
    address: '88, Palm Avenue, Vasant Kunj, New Delhi, India',
    emergencyContact: {
      name: 'Kavita Singh',
      relationship: 'Spouse',
      phone: '+91 99100 55439',
    },
    primaryPhysician: 'Dr. K. Nair, Cardiologist',
    insuranceId: 'STAR-HEALTH-99201',
    accountCreatedAt: '2024-05-02T09:00:00Z',
    linkedReportIds: ['REP-2024-55412'],
    allergies: ['No known drug allergies'],
    knownConditions: ['Hyperlipidemia', 'Elevated Triglycerides'],
    vitals: {
      bloodPressure: '128/84 mmHg',
      restingHeartRate: 76,
      bmi: 26.2,
      weightKg: 82,
      heightCm: 177,
    },
    latestBiomarkers: {
      cholesterol: { value: '245 mg/dL', status: 'high', date: '02 May 2024' },
    },
  },
  {
    id: 'MRN: 66123',
    name: 'Anita Roy',
    age: 29,
    gender: 'Female',
    dob: '19 Oct 1996',
    bloodGroup: 'AB+',
    email: 'anita.roy@healthmail.com',
    phone: '+91 97410 88219',
    address: '204, Lakeside Residences, Indiranagar, Bengaluru, India',
    emergencyContact: {
      name: 'Debashis Roy',
      relationship: 'Brother',
      phone: '+91 97410 88220',
    },
    primaryPhysician: 'Dr. M. Chawla',
    insuranceId: 'ICICI-LOMBARD-44129',
    accountCreatedAt: '2024-04-25T11:45:00Z',
    linkedReportIds: ['REP-2024-66123'],
    allergies: ['No known allergies'],
    knownConditions: ['Optimal Health Profile'],
    vitals: {
      bloodPressure: '115/72 mmHg',
      restingHeartRate: 70,
      bmi: 21.0,
      weightKg: 54,
      heightCm: 160,
    },
  },
];

/**
 * Automatically creates or synchronizes a patient account whenever a medical report is uploaded or analyzed.
 */
export function getOrCreatePatientAccount(
  report: MedicalReport,
  existingAccounts: PatientAccount[]
): {
  account: PatientAccount;
  isNew: boolean;
  updatedAccounts: PatientAccount[];
} {
  const patientName = (report.patientInfo.name || 'Anonymous Patient').trim();
  const normalizedName = patientName.toLowerCase();

  const existingIndex = existingAccounts.findIndex(
    (acc) => acc.name.toLowerCase() === normalizedName
  );

  // Extract biomarkers from this report
  const reportBiomarkers: PatientAccount['latestBiomarkers'] = {};
  const newConditions: string[] = [];

  report.tests.forEach((t) => {
    const lname = t.name.toLowerCase();
    const dateStr = report.patientInfo.reportDate || new Date().toLocaleDateString('en-GB');

    if (lname.includes('hemoglobin')) {
      reportBiomarkers.hemoglobin = { value: `${t.resultValue} ${t.unit}`, status: t.status, date: dateStr };
      if (t.status === 'low') newConditions.push('Microcytic Anemia Indicator');
    } else if (lname.includes('glucose') || lname.includes('sugar')) {
      reportBiomarkers.bloodSugar = { value: `${t.resultValue} ${t.unit}`, status: t.status, date: dateStr };
      if (t.status === 'high') newConditions.push('Impaired Glycemia / Glucose Intolerance');
    } else if (lname.includes('cholesterol')) {
      reportBiomarkers.cholesterol = { value: `${t.resultValue} ${t.unit}`, status: t.status, date: dateStr };
      if (t.status === 'high') newConditions.push('Hypercholesterolemia');
    } else if (lname.includes('vitamin d')) {
      reportBiomarkers.vitaminD = { value: `${t.resultValue} ${t.unit}`, status: t.status, date: dateStr };
      if (t.status === 'low') newConditions.push('Hypovitaminosis D (Insufficiency)');
    } else if (lname.includes('tsh') || lname.includes('thyroid')) {
      reportBiomarkers.tsh = { value: `${t.resultValue} ${t.unit}`, status: t.status, date: dateStr };
      if (t.status === 'high') newConditions.push('Thyroid Dysregulation (Elevated TSH)');
    }
  });

  if (existingIndex >= 0) {
    // Existing account: update linked reports & fresh biomarkers
    const current = existingAccounts[existingIndex];
    const linked = Array.from(new Set([...current.linkedReportIds, report.id]));
    const mergedConditions = Array.from(new Set([...current.knownConditions, ...newConditions]));

    const updatedAccount: PatientAccount = {
      ...current,
      age: typeof report.patientInfo.age === 'number' ? report.patientInfo.age : current.age,
      gender: report.patientInfo.gender || current.gender,
      primaryPhysician: report.patientInfo.referringDoctor || current.primaryPhysician,
      linkedReportIds: linked,
      knownConditions: mergedConditions.length > 0 ? mergedConditions : current.knownConditions,
      latestBiomarkers: {
        ...current.latestBiomarkers,
        ...reportBiomarkers,
      },
    };

    const updatedList = [...existingAccounts];
    updatedList[existingIndex] = updatedAccount;

    return {
      account: updatedAccount,
      isNew: false,
      updatedAccounts: updatedList,
    };
  }

  // Auto-generate a new Patient Profile
  const ageNum = typeof report.patientInfo.age === 'number' ? report.patientInfo.age : parseInt(report.patientInfo.age as any, 10) || 30;
  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - ageNum;
  const bloodGroups = ['B+', 'O+', 'A+', 'AB+', 'O-'];
  const assignedBloodGroup = bloodGroups[Math.floor(Math.random() * bloodGroups.length)];

  // Clean email and phone
  const cleanNameForEmail = patientName.toLowerCase().replace(/[^a-z0-9]/g, '.');
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const autoPhone = `+91 ${Math.floor(98000 + Math.random() * 1900)} ${Math.floor(10000 + Math.random() * 90000)}`;

  const newAccount: PatientAccount = {
    id: `MRN-${Math.floor(90000 + Math.random() * 9999)}`,
    name: patientName,
    age: ageNum,
    gender: report.patientInfo.gender || 'Male',
    dob: `15 Jun ${birthYear}`,
    bloodGroup: assignedBloodGroup,
    email: `${cleanNameForEmail}@healthmail.com`,
    phone: autoPhone,
    address: 'Clinical Residence on File (Automated Intake)',
    emergencyContact: {
      name: 'Designated Kin',
      relationship: 'Primary Contact',
      phone: autoPhone,
    },
    primaryPhysician: report.patientInfo.referringDoctor || 'Dr. A. Verma, MD',
    insuranceId: `HLTH-INS-${randomDigits}`,
    accountCreatedAt: new Date().toISOString(),
    linkedReportIds: [report.id],
    allergies: ['No allergies recorded in current diagnostic panel'],
    knownConditions: newConditions.length > 0 ? newConditions : ['Evaluated Diagnostic Profile'],
    vitals: {
      bloodPressure: '120/80 mmHg',
      restingHeartRate: 72,
      bmi: 22.8,
      weightKg: 65,
      heightCm: 168,
    },
    latestBiomarkers: reportBiomarkers,
  };

  return {
    account: newAccount,
    isNew: true,
    updatedAccounts: [newAccount, ...existingAccounts],
  };
}
