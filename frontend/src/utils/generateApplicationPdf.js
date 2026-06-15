import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function safeText(value, fallback = 'N/A') {
  const text =
    value === undefined || value === null || String(value).trim() === ''
      ? fallback
      : String(value);

  return text.replace(/[&<>"']/g, (char) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return map[char];
  });
}

function formatDate(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return safeText(value);

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function fieldBlock(label, value, extraClass = '') {
  return `
    <div class="field-card ${extraClass}">
      <div class="field-label">${safeText(label)}</div>
      <div class="field-value">${safeText(value)}</div>
    </div>
  `;
}

function sectionTitle(number, title) {
  return `
    <div class="section-title">
      <span class="section-number">${number}</span>
      <span>${safeText(title)}</span>
    </div>
  `;
}

/**
 * Builds the full professional HTML content for the student application receipt.
 */
function buildPageHtml(student) {
  const createdAt = formatDate(student.createdDate);
  const hasPassport = Boolean(student?.personal?.passportNo);

  const commonStyles = `
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      html, body {
        width: 794px;
        height: 1123px;
        background: #ffffff;
      }

      body, .page-wrap {
        font-family: Arial, Helvetica, sans-serif;
        color: #0f172a;
        line-height: 1.35;
      }

      .page-wrap {
        width: 794px;
        height: 1123px;
        padding: 40px 48px;
        position: relative;
        overflow: hidden;
        background: #ffffff;
      }

      .crest-badge {
        width: 68px;
        height: 64px;
        border: 2px solid #0f2e63;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 17px;
        font-weight: 900;
        color: #0f2e63;
        background: #f8fafc;
        box-shadow: inset 0 0 0 2px #b89047;
      }

      .section-header {
        font-size: 9px;
        font-weight: 800;
        color: #0f2e63;
        border-bottom: 1.5px solid #0f2e63;
        padding-bottom: 3px;
        margin-top: 14px;
        margin-bottom: 6px;
        letter-spacing: 0.5px;
        text-transform: uppercase;
      }
      .section-header.first {
        margin-top: 0;
      }

      .form-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 4px;
      }
      .form-table td {
        border: 1px solid #cbd5e1;
        padding: 6px 10px;
        font-size: 9.5px;
        color: #0f172a;
        vertical-align: middle;
      }
      .form-table td.label {
        background-color: #f8fafc;
        font-weight: 700;
        color: #475569;
        font-size: 8px;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        width: 20%;
      }
      .form-table td.value {
        font-weight: 700;
        color: #0f172a;
        width: 30%;
      }

         .office-declaration-row {
           display: grid;
           grid-template-columns: 1.45fr 1fr;
           gap: 16px;
           margin-top: 22px;
         }

         .declaration-box,
         .office-box {
           border: 1px solid #cbd5e1;
           background: #fbfdff;
           padding: 13px 15px;
           min-height: 100px;
         }

         .declaration-box {
           border-left: 4px solid #b8860b;
         }

         .declaration-title,
         .office-title {
           font-size: 9px;
           font-weight: 900;
           color: #0f2e63;
           text-transform: uppercase;
           letter-spacing: 0.8px;
           margin-bottom: 8px;
         }

         .declaration-box p {
           font-size: 8.7px;
           color: #334155;
           font-weight: 600;
           line-height: 1.55;
           text-align: justify;
         }

         .office-line {
           height: 22px;
           border-bottom: 1px dotted #94a3b8;
           font-size: 8px;
           color: #64748b;
           font-weight: 800;
           display: flex;
           align-items: center;
         }

         .office-line span {
           min-width: 70px;
           text-transform: uppercase;
           letter-spacing: 0.5px;
         }

         .signature-grid {
           display: grid;
           grid-template-columns: repeat(3, 1fr);
           gap: 18px;
           margin-top: 30px;
         }

         .signature-box {
           min-height: 72px;
           text-align: center;
           padding-top: 28px;
         }

         .signature-line {
           width: 150px;
           height: 1px;
           background: #94a3b8;
           margin: 0 auto 11px;
         }

         .signature-text {
           font-size: 7.8px;
           color: #0f2e63;
           text-transform: uppercase;
           font-weight: 900;
           letter-spacing: 0.7px;
         }

         .footer {
           position: absolute;
           left: 48px;
           right: 48px;
           bottom: 30px;
           border-top: 1px solid #cbd5e1;
           padding-top: 8px;
           text-align: center;
           color: #64748b;
           font-size: 7.5px;
           font-weight: 600;
           line-height: 1.4;
         }

      .watermark {
        position: absolute;
        top: 48%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-15deg);
        font-size: 72px;
        font-weight: 900;
        letter-spacing: 5px;
        color: rgba(15, 46, 99, 0.02);
        border: 6px double rgba(15, 46, 99, 0.02);
        padding: 15px 30px;
        border-radius: 8px;
        z-index: 0;
        pointer-events: none;
        text-align: center;
        width: 320px;
      }

      .content {
        position: relative;
        z-index: 1;
      }
    </style>
  `;

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        ${commonStyles}
      </head>

      <body>
        <div class="page-wrap">
          <div class="watermark">SVET</div>

          <div class="content">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
              <tr>
                <td style="width: 80px; border: none; padding: 0; vertical-align: middle;">
                  <div class="crest-badge">SVET</div>
                </td>
                <td style="border: none; padding: 0 20px; text-align: center; vertical-align: middle;">
                  <h1 style="font-size: 18px; font-weight: 800; color: #0f2e63; letter-spacing: 0.5px; margin-bottom: 2px;">SRI VENKATESHWARA EDUCATIONAL TRUST</h1>
                  <p style="font-size: 8.5px; font-weight: 700; color: #b89047; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 3px;">MBBS &amp; BDS OVERSEAS ADMISSIONS OFFICE</p>
                  <p style="font-size: 7.5px; color: #64748b; font-weight: 500;">Admin Registry &amp; Student Admission Gateway</p>
                </td>
                <td style="width: 140px; border: none; padding: 0; text-align: right; vertical-align: middle;">
                  <div style="font-size: 7.5px; font-weight: 800; color: #64748b; text-transform: uppercase;">Receipt Number</div>
                  <div style="font-size: 11px; font-weight: 800; color: #0f2e63; font-family: monospace; margin-top: 2px;">${safeText(student.id)}</div>
                  <div style="font-size: 7.5px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-top: 6px;">Date Generated</div>
                  <div style="font-size: 9px; font-weight: 700; color: #0f172a; margin-top: 1px;">${safeText(createdAt)}</div>
                </td>
              </tr>
            </table>

            <div style="display: flex; height: 3px; margin-bottom: 18px;">
              <div style="flex: 4; background-color: #0f2e63;"></div>
              <div style="flex: 1; background-color: #b89047;"></div>
            </div>

            <div style="text-align: center; margin-bottom: 18px;">
              <h2 style="font-size: 14px; font-weight: 800; color: #0f2e63; text-transform: uppercase; letter-spacing: 0.5px;">Student Application Receipt</h2>
              <p style="font-size: 8.5px; color: #64748b; font-weight: 600; margin-top: 2px;">Official record of verification documents and choice preferences</p>
              <div style="display: inline-block; margin-top: 6px; padding: 3px 10px; border: 1px solid #b89047; background-color: #fcf9f2; color: #0f2e63; font-size: 8px; font-weight: 800; text-transform: uppercase; border-radius: 3px; letter-spacing: 0.5px;">
                Application Received
              </div>
            </div>

            <div class="section-header first">1. Personal Information</div>
            <table class="form-table">
              <tr>
                <td class="label">Candidate Name</td>
                <td class="value">${safeText(student.personal.name)}</td>
                <td class="label">Gender</td>
                <td class="value">${safeText(student.personal.gender)}</td>
              </tr>
              <tr>
                <td class="label">Date of Birth</td>
                <td class="value">${safeText(student.personal.dob)}</td>
                <td class="label">Aadhaar Number</td>
                <td class="value">${safeText(student.personal.aadhaar)}</td>
              </tr>
              <tr>
                <td class="label">Community Category</td>
                <td class="value">${safeText(student.personal.community)}</td>
                <td class="label">Passport Number</td>
                <td class="value">${safeText(student.personal.passportNo)}</td>
              </tr>
            </table>

            <div class="section-header">2. Parent &amp; Communication Info</div>
            <table class="form-table">
              <tr>
                <td class="label">Father / Guardian</td>
                <td class="value">${safeText(student.parent.parentName)}</td>
                <td class="label">Mobile Number 1</td>
                <td class="value">${safeText(student.parent.mobile1)}</td>
              </tr>
              <tr>
                <td class="label">Mobile Number 2</td>
                <td class="value">${safeText(student.parent.mobile2)}</td>
                <td class="label">District</td>
                <td class="value">${safeText(student.parent.district)}</td>
              </tr>
              <tr>
                <td class="label">Pincode</td>
                <td class="value">${safeText(student.parent.pincode)}</td>
                <td class="label">Record Type</td>
                <td class="value">Student Lead</td>
              </tr>
              <tr>
                <td class="label">Communication Address</td>
                <td class="value" colspan="3">${safeText(student.parent.address)}</td>
              </tr>
            </table>

            <div class="section-header">3. +2 Academic Information</div>
            <table class="form-table">
              <tr>
                <td class="label">HSC Group</td>
                <td class="value">${safeText(student.academic.hscGroup)}</td>
                <td class="label">Register Number</td>
                <td class="value">${safeText(student.academic.hscRegisterNo)}</td>
              </tr>
              <tr>
                <td class="label">HSC Total Score</td>
                <td class="value">${safeText(student.academic.totalMarks)}</td>
                <td class="label">Physics Marks</td>
                <td class="value">${safeText(student.academic.physicsMarks)} / 100</td>
              </tr>
              <tr>
                <td class="label">Chemistry Marks</td>
                <td class="value">${safeText(student.academic.chemistryMarks)} / 100</td>
                <td class="label">Biology Marks</td>
                <td class="value">${safeText(student.academic.biologyMarks)} / 100</td>
              </tr>
            </table>

            <div class="section-header">4. NEET &amp; Choice Preferences</div>
            <table class="form-table">
              <tr>
                <td class="label">NEET Score</td>
                <td class="value">${safeText(student.neet.score)} / 720</td>
                <td class="label">NEET App Number</td>
                <td class="value">${safeText(student.neet.applicationNumber)}</td>
              </tr>
              <tr>
                <td class="label">Preferred Country</td>
                <td class="value" colspan="3">${safeText(student.neet.interestedCountry)}</td>
              </tr>
            </table>

            <div class="office-declaration-row">
              <div class="declaration-box">
                <div class="declaration-title">Declaration</div>
                <p>
                  We hereby acknowledge the receipt of this student application for MBBS &amp; BDS overseas admission counselling.
                  Final admission is subject to academic eligibility, university approval, counselling confirmation, and original document verification.
                </p>
              </div>

              <div class="office-box">
                <div class="office-title">For Office Use Only</div>
                <div class="office-line"><span>Received By</span></div>
                <div class="office-line"><span>Verified On</span></div>
                <div class="office-line"><span>Remarks</span></div>
              </div>
            </div>

            <div class="signature-grid">
              <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-text">Candidate Signature</div>
              </div>

              <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-text">Parent / Guardian Signature</div>
              </div>

              <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-text">Authorized Officer</div>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>Generated from Sri Venkateshwara Educational Trust CRM | This is a system-generated official application receipt.</p>
            <p>Sri Venkateshwara Educational Trust © 2026. All Rights Reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Renders an HTML string into a hidden iframe, captures it with html2canvas,
 * and returns a canvas element.
 */
async function renderHtmlToCanvas(htmlString) {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    iframe.style.width = '794px';
    iframe.style.height = '1123px';
    iframe.style.border = 'none';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    iframe.onload = async () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const target = iframeDoc.querySelector('.page-wrap');
        const canvas = await html2canvas(target || iframeDoc.body, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: 794,
          height: 1123,
          windowWidth: 794,
          windowHeight: 1123,
          logging: false,
        });
        document.body.removeChild(iframe);
        resolve(canvas);
      } catch (err) {
        document.body.removeChild(iframe);
        reject(err);
      }
    };

    iframe.srcdoc = htmlString;
  });
}


/**
 * Main export: generates and downloads a 1-page A4 PDF silently.
 * No print dialog, no new tab.
 *
 * @param {Object} student - Student data object
 * @param {string} [filename] - Optional filename override
 */
export async function generateApplicationPdf(student, filename) {
  const pageHtml = buildPageHtml(student);

  // Render the unified single page to canvas
  const canvas = await renderHtmlToCanvas(pageHtml);

  // A4 dimensions in mm
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();   // 210mm
  const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

  // Add page 1
  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

  // Silent download — no dialog, no new tab
  const outputFilename = filename || `SVET-Application-${student.id}.pdf`;
  pdf.save(outputFilename);
}
