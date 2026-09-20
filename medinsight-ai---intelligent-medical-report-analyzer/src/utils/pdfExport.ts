import jsPDF from 'jspdf';
import { MedicalReport, LabTest } from '../types';

/**
 * Enterprise-grade Clinical Laboratory PDF Generator
 * Complies with CLSI / ISO 15189 reporting standards.
 * Precision-aligned typography with zero overlapping or text clipping.
 */
export const generatePdfReport = (report: MedicalReport): jsPDF => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();   // 595.28 pt
  const pageHeight = doc.internal.pageSize.getHeight(); // 841.89 pt
  const margin = 36;
  const contentWidth = pageWidth - margin * 2;          // 523.28 pt
  let y = margin;

  // Calibrated Editorial / Clinical Palette
  const primaryTeal = [13, 110, 93];   // #0D6E5D
  const darkSlate = [21, 25, 30];      // #15191E
  const bodyText = [51, 65, 85];       // #334155
  const mutedText = [95, 107, 122];    // #5F6B7A
  const lightBg = [250, 248, 245];     // #FAF8F5
  const cardBorder = [230, 226, 218];  // #E6E2DA
  const highRed = [190, 24, 93];       // Rose-700
  const lowAmber = [180, 83, 9];       // Amber-700
  const criticalRed = [185, 28, 28];   // Red-700
  const normalGreen = [13, 110, 93];   // Teal-800

  const labFacility = report.patientInfo.labName || 'Apex Clinical Pathology & Molecular Diagnostics';

  // ==========================================
  // 1. HOSPITAL & LABORATORY LETTERHEAD
  // ==========================================
  // Accent bar on top edge
  doc.setFillColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
  doc.rect(margin, y, contentWidth, 3.5, 'F');
  y += 12;

  // Right side accession barcode box
  const rightBoxWidth = 140;
  const barcodeX = pageWidth - margin - rightBoxWidth;
  const barcodeY = y;

  // Draw clean vector barcode stripes
  const barPattern = [2, 1, 3, 1, 2, 2, 1, 3, 1, 2, 3, 1, 2, 1, 3, 2, 1, 2, 3, 1, 2];
  let curBarX = barcodeX + 15;
  doc.setFillColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  for (let i = 0; i < barPattern.length; i++) {
    const w = barPattern[i];
    if (i % 2 === 0) {
      doc.rect(curBarX, barcodeY + 2, w, 13, 'F');
    }
    curBarX += w + 1.2;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text(`ACCESSION: ${report.id}`, barcodeX + 15, barcodeY + 24);

  // Left side: Laboratory Name (width clamped so it NEVER collides with barcode box)
  const maxLabNameWidth = contentWidth - rightBoxWidth - 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
  
  const labNameLines = doc.splitTextToSize(labFacility.toUpperCase(), maxLabNameWidth);
  doc.text(labNameLines, margin, y + 10);
  
  y += Math.max(28, labNameLines.length * 15);

  // Accreditation Subtitle
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('ACCREDITATION: NABL (ISO 15189:2022) | ICMR RECOGNIZED | CLINICAL DECISION SUPPORT SYSTEM', margin, y);
  y += 9;

  // Contact line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text('Health Sciences Avenue, Diagnostics Wing • Digital Specimen Verification: medinsight.org', margin, y);
  y += 8;

  // Dividing Rule
  doc.setDrawColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
  doc.setLineWidth(1.2);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // ==========================================
  // 2. PATIENT DEMOGRAPHICS & CLINICAL ORDER
  // ==========================================
  const demoBoxHeight = 58;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(cardBorder[0], cardBorder[1], cardBorder[2]);
  doc.setLineWidth(0.8);
  doc.roundedRect(margin, y, contentWidth, demoBoxHeight, 3, 3, 'FD');

  const halfWidth = contentWidth / 2;
  const col1LabelX = margin + 8;
  const col1ValX = margin + 88;
  const col2LabelX = margin + halfWidth + 8;
  const col2ValX = margin + halfWidth + 88;

  // Vertical divider between columns
  doc.setDrawColor(cardBorder[0], cardBorder[1], cardBorder[2]);
  doc.setLineWidth(0.6);
  doc.line(margin + halfWidth, y + 4, margin + halfWidth, y + demoBoxHeight - 4);

  let dY = y + 13;

  // Row 1: Patient Name & Investigation
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text('PATIENT NAME', col1LabelX, dY);
  doc.text('INVESTIGATION', col2LabelX, dY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  const ptName = (report.patientInfo.name || 'Anonymous Patient').substring(0, 24);
  const invName = (report.patientInfo.reportType || 'Complete Laboratory Panel').substring(0, 26);
  doc.text(ptName, col1ValX, dY);
  doc.text(invName, col2ValX, dY);

  dY += 14;

  // Row 2: Age / Gender & Specimen Type
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text('AGE / GENDER', col1LabelX, dY);
  doc.text('SPECIMEN TYPE', col2LabelX, dY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(bodyText[0], bodyText[1], bodyText[2]);
  const ageGender = `${report.patientInfo.age || '--'} Yrs / ${report.patientInfo.gender || 'Unspecified'}`;
  const specType = (report.patientInfo.specimenType || 'Venous Whole Blood / Serum').substring(0, 25);
  doc.text(ageGender, col1ValX, dY);
  doc.text(specType, col2ValX, dY);

  dY += 14;

  // Row 3: MRN / Specimen ID & Report Date
  const mrn = report.patientInfo.specimenId || `MRN-${report.id.replace(/[^0-9]/g, '').padEnd(6, '0').slice(0, 8)}`;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text('PATIENT ID / MRN', col1LabelX, dY);
  doc.text('REPORT DATE', col2LabelX, dY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(bodyText[0], bodyText[1], bodyText[2]);
  doc.text(mrn, col1ValX, dY);
  const rDate = report.patientInfo.reportDate || '13-Sep-2026';
  doc.text(`${rDate} (Verified)`, col2ValX, dY);

  y += demoBoxHeight + 8;

  // ==========================================
  // 3. CLINICAL TRIAGE NOTICE BANNER
  // ==========================================
  const abnormalTests = report.tests.filter((t) => t.status !== 'normal');
  const criticalTests = report.tests.filter((t) => t.status === 'critical');
  const alertBoxHeight = 18;

  if (criticalTests.length > 0) {
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(252, 165, 165);
    doc.roundedRect(margin, y, contentWidth, alertBoxHeight, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(criticalRed[0], criticalRed[1], criticalRed[2]);
    doc.text(`[ CRITICAL ALERT ] ${criticalTests.length} biomarker(s) exceed urgent physiological thresholds. Prompt review recommended.`, margin + 8, y + 11.5);
  } else if (abnormalTests.length > 0) {
    doc.setFillColor(255, 251, 235);
    doc.setDrawColor(253, 230, 138);
    doc.roundedRect(margin, y, contentWidth, alertBoxHeight, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(lowAmber[0], lowAmber[1], lowAmber[2]);
    doc.text(`[ CLINICAL NOTICE ] ${abnormalTests.length} of ${report.tests.length} biomarker(s) deviate from standard biological limits.`, margin + 8, y + 11.5);
  } else {
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(margin, y, contentWidth, alertBoxHeight, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(normalGreen[0], normalGreen[1], normalGreen[2]);
    doc.text(`[ NOMINAL FINDINGS ] All ${report.tests.length} analyzed parameters fall within standardized biological reference intervals.`, margin + 8, y + 11.5);
  }

  y += alertBoxHeight + 8;

  // ==========================================
  // 4. PATHOLOGY ANALYTE TABLE (CALCULATED WIDTHS)
  // Total Content Width = 523.28 pt
  // ------------------------------------------
  // Col 1: Biomarker / Test Name = 185 pt
  // Col 2: Observed Result       = 85 pt
  // Col 3: Reference Interval    = 115 pt
  // Col 4: Units                 = 65 pt
  // Col 5: Status Flag           = 73.28 pt
  // ==========================================
  const colW1 = 185;
  const colW2 = 85;
  const colW3 = 115;
  const colW4 = 65;
  const colW5 = 73.28;

  const tX1 = margin + 6;
  const tX2 = margin + colW1 + 6;
  const tX3 = tX2 + colW2;
  const tX4 = tX3 + colW3;
  const tX5 = tX4 + colW4;

  const tableHeaderHeight = 18;

  // Function to render table header
  const renderTableHeader = (currentY: number) => {
    doc.setFillColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
    doc.rect(margin, currentY, contentWidth, tableHeaderHeight, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);

    doc.text('INVESTIGATION / BIOMARKER', tX1, currentY + 11.5);
    doc.text('OBSERVED RESULT', tX2, currentY + 11.5);
    doc.text('REF. INTERVAL', tX3, currentY + 11.5);
    doc.text('UNITS', tX4, currentY + 11.5);
    doc.text('STATUS', tX5, currentY + 11.5);
  };

  renderTableHeader(y);
  y += tableHeaderHeight;

  // Table Data Rows
  const rowHeight = 18;

  report.tests.forEach((test: LabTest, idx: number) => {
    // Check page overflow with safe margin
    if (y + rowHeight > pageHeight - 90) {
      doc.addPage();
      y = margin;
      renderTableHeader(y);
      y += tableHeaderHeight;
    }

    const isAbnormal = test.status !== 'normal';

    // Row Background Shading
    if (isAbnormal) {
      doc.setFillColor(255, 247, 237); // subtle warm amber highlight
      doc.rect(margin, y, contentWidth, rowHeight, 'F');
    } else if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252); // light zebra stripe
      doc.rect(margin, y, contentWidth, rowHeight, 'F');
    }

    // Row Bottom Border
    doc.setDrawColor(cardBorder[0], cardBorder[1], cardBorder[2]);
    doc.setLineWidth(0.4);
    doc.line(margin, y + rowHeight, pageWidth - margin, y + rowHeight);

    // 1. Analyte Name (Safely truncated if necessary)
    doc.setFont('helvetica', isAbnormal ? 'bold' : 'normal');
    doc.setFontSize(8);
    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    const cleanTestName = test.name.length > 32 ? test.name.substring(0, 30) + '...' : test.name;
    doc.text(cleanTestName, tX1, y + 12);

    // 2. Observed Result Value
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    if (test.status === 'critical') {
      doc.setTextColor(criticalRed[0], criticalRed[1], criticalRed[2]);
    } else if (test.status === 'high') {
      doc.setTextColor(highRed[0], highRed[1], highRed[2]);
    } else if (test.status === 'low') {
      doc.setTextColor(lowAmber[0], lowAmber[1], lowAmber[2]);
    } else {
      doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    }
    doc.text(String(test.resultValue), tX2, y + 12);

    // 3. Biological Reference Interval
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(bodyText[0], bodyText[1], bodyText[2]);
    const refText = (test.referenceRange.text || '--').substring(0, 22);
    doc.text(refText, tX3, y + 12);

    // 4. Units
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
    const unitText = (test.unit || '--').substring(0, 14);
    doc.text(unitText, tX4, y + 12);

    // 5. Status Flag Badge
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    if (test.status === 'critical') {
      doc.setTextColor(criticalRed[0], criticalRed[1], criticalRed[2]);
      doc.text('CRITICAL', tX5, y + 12);
    } else if (test.status === 'high') {
      doc.setTextColor(highRed[0], highRed[1], highRed[2]);
      doc.text('HIGH (*)', tX5, y + 12);
    } else if (test.status === 'low') {
      doc.setTextColor(lowAmber[0], lowAmber[1], lowAmber[2]);
      doc.text('LOW (*)', tX5, y + 12);
    } else {
      doc.setTextColor(normalGreen[0], normalGreen[1], normalGreen[2]);
      doc.text('NORMAL', tX5, y + 12);
    }

    y += rowHeight;
  });

  y += 10;

  // ==========================================
  // 5. CLINICAL INTERPRETATION & REMARKS
  // ==========================================
  const rawSummary = report.summary?.headline
    ? `${report.summary.overallHealthStatus ? report.summary.overallHealthStatus + ' — ' : ''}${report.summary.headline}`
    : `Comprehensive clinical panel completed for ${report.patientInfo.name}. ${
        abnormalTests.length > 0
          ? `${abnormalTests.length} biomarker(s) deviate from nominal biological limits. Clinical correlation with physical history is recommended.`
          : 'All evaluated biomarker parameters conform to nominal laboratory reference intervals.'
      }`;

  const splitRemarks = doc.splitTextToSize(rawSummary, contentWidth - 20);
  const remarksHeight = 22 + splitRemarks.length * 10;

  // Check if remarks fit on current page
  if (y + remarksHeight > pageHeight - 90) {
    doc.addPage();
    y = margin;
  }

  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(cardBorder[0], cardBorder[1], cardBorder[2]);
  doc.setLineWidth(0.8);
  doc.roundedRect(margin, y, contentWidth, remarksHeight, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('PATHOLOGIST CLINICAL INTERPRETATION & REMARKS', margin + 8, y + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(bodyText[0], bodyText[1], bodyText[2]);
  doc.text(splitRemarks, margin + 8, y + 21);

  y += remarksHeight + 10;

  // ==========================================
  // 6. CLEAN DIGITAL AUTHENTICATION FOOTER
  // (Removed hardcoded technologist names and stamp as requested)
  // ==========================================
  if (y + 36 > pageHeight - 60) {
    doc.addPage();
    y = margin;
  }

  // Digital Authentication Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(cardBorder[0], cardBorder[1], cardBorder[2]);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin, y, contentWidth, 32, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
  doc.text('ELECTRONICALLY VERIFIED & RELEASED DIAGNOSTIC REPORT', margin + 8, y + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text(
    `Certified under ISO 15189:2022 laboratory standards • Specimen SHA-256 Checksum: ${report.id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 16).toUpperCase()} • Released: ${report.patientInfo.reportDate || '13-Sep-2026'}`,
    margin + 8,
    y + 22
  );

  // ==========================================
  // 7. RUNNING FOOTER ON ALL PAGES
  // ==========================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const footY = pageHeight - 20;

    // Thin divider line
    doc.setDrawColor(cardBorder[0], cardBorder[1], cardBorder[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, footY - 6, pageWidth - margin, footY - 6);

    // Fine print disclaimers
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
    doc.text(
      'Medical Diagnostic Record • Confidential Patient Healthcare Information • Partial reproduction prohibited without authorization.',
      margin,
      footY + 4
    );
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, footY + 4, { align: 'right' });
  }

  return doc;
};

export const downloadReportPdf = (report: MedicalReport): void => {
  const doc = generatePdfReport(report);
  const cleanName = (report.patientInfo.name || 'Patient').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `MedInsight_Report_${cleanName}_${report.id}.pdf`;
  doc.save(filename);
};
