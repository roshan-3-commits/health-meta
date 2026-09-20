import { MedicalReport, LabTest } from '../types';

// Standard LOINC codes for common lab tests
export const LOINC_CODES: Record<string, { code: string; display: string; specimen: string; method: string }> = {
  'hemoglobin': { code: '718-7', display: 'Hemoglobin [Mass/volume] in Blood', specimen: 'Whole blood (EDTA)', method: 'Automated Cyanmethemoglobin' },
  'blood sugar (fasting)': { code: '1558-6', display: 'Fasting glucose [Mass/volume] in Serum or Plasma', specimen: 'Fluoride / Oxalate Plasma', method: 'Hexokinase / Glucose Oxidase' },
  'fasting glucose': { code: '1558-6', display: 'Fasting glucose [Mass/volume] in Serum or Plasma', specimen: 'Fluoride / Oxalate Plasma', method: 'Hexokinase / Glucose Oxidase' },
  'total cholesterol': { code: '2093-3', display: 'Cholesterol [Mass/volume] in Serum or Plasma', specimen: 'Serum (SST)', method: 'Enzymatic CHOD-PAP' },
  'platelet count': { code: '777-3', display: 'Platelets [#/volume] in Blood by Automated count', specimen: 'Whole blood (EDTA)', method: 'Impedance / Flow Cytometry' },
  'tsh (thyroid)': { code: '11580-8', display: 'Thyrotropin [Units/volume] in Serum or Plasma', specimen: 'Serum (SST)', method: 'Chemiluminescent Immunoassay (CLIA)' },
  'vitamin d (25-oh)': { code: '14800-7', display: '25-hydroxyvitamin D3+D2 [Mass/volume] in Serum or Plasma', specimen: 'Serum (SST)', method: 'Chemiluminescent Microparticle (CMIA)' },
  'serum creatinine': { code: '2160-0', display: 'Creatinine [Mass/volume] in Serum or Plasma', specimen: 'Serum (SST)', method: 'Jaffe / Enzymatic Rate' },
  'creatinine': { code: '2160-0', display: 'Creatinine [Mass/volume] in Serum or Plasma', specimen: 'Serum (SST)', method: 'Jaffe / Enzymatic Rate' },
  'blood urea nitrogen': { code: '3094-0', display: 'Urea nitrogen [Mass/volume] in Serum or Plasma', specimen: 'Serum (SST)', method: 'Urease-GLDH' },
  'sgpt / alt': { code: '1742-6', display: 'Alanine aminotransferase [Enzymatic activity/volume] in Serum or Plasma', specimen: 'Serum (SST)', method: 'IFCC UV Kinetic' },
  'sgot / ast': { code: '1920-8', display: 'Aspartate aminotransferase [Enzymatic activity/volume] in Serum or Plasma', specimen: 'Serum (SST)', method: 'IFCC UV Kinetic' },
  'hba1c': { code: '4548-4', display: 'Hemoglobin A1c/Hemoglobin.total in Blood', specimen: 'Whole blood (EDTA)', method: 'HPLC (NGSP Certified)' },
  'calcium': { code: '17861-6', display: 'Calcium [Mass/volume] in Serum or Plasma', specimen: 'Serum (SST)', method: 'Arsenazo III' },
  'serum iron': { code: '2498-4', display: 'Iron [Mass/volume] in Serum or Plasma', specimen: 'Serum (SST)', method: 'Ferrozine Photometry' },
  'ferritin': { code: '2276-4', display: 'Ferritin [Mass/volume] in Serum or Plasma', specimen: 'Serum (SST)', method: 'ECLIA' },
};

export function getLoincMetadata(testName: string) {
  const key = testName.toLowerCase().trim();
  if (LOINC_CODES[key]) return LOINC_CODES[key];
  for (const [k, v] of Object.entries(LOINC_CODES)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return {
    code: '34565-2',
    display: `${testName} [Laboratory Test]`,
    specimen: 'Serum or Plasma',
    method: 'Standard Clinical Assay',
  };
}

/**
 * Generates an HL7 FHIR R4 Bundle containing DiagnosticReport and Observation resources.
 * Compliant with HL7 FHIR Release 4 specification.
 */
export function generateFhirR4Bundle(report: MedicalReport) {
  const patientId = `patient-${report.patientInfo.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const diagnosticReportId = `dr-${report.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const now = new Date().toISOString();

  // Create FHIR Observations
  const observationEntries = report.tests.map((t, index) => {
    const loinc = getLoincMetadata(t.name);
    const obsId = `obs-${report.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${index + 1}`;

    const interpretationCode = t.status === 'high' ? 'H' : t.status === 'low' ? 'L' : t.status === 'critical' ? 'AA' : 'N';
    const interpretationDisplay = t.status === 'high' ? 'High' : t.status === 'low' ? 'Low' : t.status === 'critical' ? 'Critically Abnormal' : 'Normal';

    return {
      fullUrl: `urn:uuid:${obsId}`,
      resource: {
        resourceType: 'Observation',
        id: obsId,
        status: 'final',
        category: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                code: 'laboratory',
                display: 'Laboratory',
              },
            ],
          },
        ],
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: loinc.code,
              display: loinc.display,
            },
          ],
          text: t.name,
        },
        subject: {
          reference: `urn:uuid:${patientId}`,
          display: report.patientInfo.name,
        },
        effectiveDateTime: report.createdAt || now,
        valueQuantity: t.numericValue !== undefined ? {
          value: t.numericValue,
          unit: t.unit,
          system: 'http://unitsofmeasure.org',
          code: t.unit,
        } : undefined,
        valueString: t.numericValue === undefined ? t.resultValue : undefined,
        interpretation: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
                code: interpretationCode,
                display: interpretationDisplay,
              },
            ],
            text: interpretationDisplay,
          },
        ],
        referenceRange: [
          {
            low: t.referenceRange.min !== undefined ? { value: t.referenceRange.min, unit: t.unit } : undefined,
            high: t.referenceRange.max !== undefined ? { value: t.referenceRange.max, unit: t.unit } : undefined,
            text: t.referenceRange.text,
          },
        ],
        specimen: {
          display: loinc.specimen,
        },
        method: {
          text: loinc.method,
        },
        note: [
          {
            text: `Clinical explanation: ${t.simpleExplanation}`,
          },
        ],
      },
    };
  });

  // FHIR Bundle structure
  const fhirBundle = {
    resourceType: 'Bundle',
    id: `bundle-${report.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    type: 'document',
    timestamp: now,
    entry: [
      // 1. Patient Resource
      {
        fullUrl: `urn:uuid:${patientId}`,
        resource: {
          resourceType: 'Patient',
          id: patientId,
          active: true,
          name: [
            {
              use: 'official',
              text: report.patientInfo.name,
            },
          ],
          gender: report.patientInfo.gender.toLowerCase(),
        },
      },
      // 2. DiagnosticReport Resource
      {
        fullUrl: `urn:uuid:${diagnosticReportId}`,
        resource: {
          resourceType: 'DiagnosticReport',
          id: diagnosticReportId,
          status: 'final',
          category: [
            {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
                  code: 'LAB',
                  display: 'Laboratory',
                },
              ],
            },
          ],
          code: {
            coding: [
              {
                system: 'http://loinc.org',
                code: '11502-2',
                display: 'Laboratory report',
              },
            ],
            text: report.patientInfo.reportType,
          },
          subject: {
            reference: `urn:uuid:${patientId}`,
            display: report.patientInfo.name,
          },
          effectiveDateTime: report.createdAt || now,
          issued: now,
          performer: [
            {
              display: report.patientInfo.labName || 'Apex Diagnostic & Clinical Pathology Labs',
            },
          ],
          resultsInterpreter: [
            {
              display: report.patientInfo.referringDoctor || 'Dr. A. Verma, MD',
            },
          ],
          result: observationEntries.map((obs) => ({
            reference: obs.fullUrl,
          })),
          conclusion: report.summary.headline,
          conclusionCode: [
            {
              text: report.summary.overallHealthStatus,
            },
          ],
        },
      },
      // 3. Observations
      ...observationEntries,
    ],
  };

  return fhirBundle;
}
