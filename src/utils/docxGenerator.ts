import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  HeadingLevel,
  ShadingType,
  Footer,
  PageNumber,
} from 'docx';
import type { MinutesOfMeeting } from '../types/meeting';

// Clean safe string helper
function safeStr(val: any, fallback = 'N/A'): string {
  if (val === undefined || val === null || val === '') return fallback;
  return String(val);
}

export async function generateDocxBlob(mom: MinutesOfMeeting): Promise<Blob> {
  // Styling color constants
  const NAVY = '1E3A8A'; // Primary Corporate Blue
  const SLATE_DARK = '1E293B';
  const SLATE_LIGHT = 'F1F5F9';
  const BORDER_COLOR = 'CBD5E1';
  const ACCENT_BLUE = '3B82F6';
  const SUCCESS_BG = 'DCFCE7';
  const WARNING_BG = 'FEF3C7';
  const DANGER_BG = 'FEE2E2';

  const defaultBorder = {
    top: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
    left: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
    right: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
  };

  const noBorder = {
    top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  };

  // Section 1: Overview Metadata Table
  const overviewRows = [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          shading: { fill: SLATE_LIGHT, type: ShadingType.CLEAR },
          children: [new Paragraph({ children: [new TextRun({ text: 'Meeting Title', bold: true, color: SLATE_DARK })] })],
          borders: defaultBorder,
        }),
        new TableCell({
          width: { size: 75, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: safeStr(mom.title), bold: true, color: NAVY })] })],
          borders: defaultBorder,
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          shading: { fill: SLATE_LIGHT, type: ShadingType.CLEAR },
          children: [new Paragraph({ children: [new TextRun({ text: 'Date & Time', bold: true, color: SLATE_DARK })] })],
          borders: defaultBorder,
        }),
        new TableCell({
          width: { size: 75, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: safeStr(mom.meetingDate) })] })],
          borders: defaultBorder,
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          shading: { fill: SLATE_LIGHT, type: ShadingType.CLEAR },
          children: [new Paragraph({ children: [new TextRun({ text: 'Meeting Type', bold: true, color: SLATE_DARK })] })],
          borders: defaultBorder,
        }),
        new TableCell({
          width: { size: 75, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: safeStr(mom.meetingType, 'General Discussion') })] })],
          borders: defaultBorder,
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          shading: { fill: SLATE_LIGHT, type: ShadingType.CLEAR },
          children: [new Paragraph({ children: [new TextRun({ text: 'Duration', bold: true, color: SLATE_DARK })] })],
          borders: defaultBorder,
        }),
        new TableCell({
          width: { size: 75, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: safeStr(mom.durationEstimate, 'Approx. 30 mins') })] })],
          borders: defaultBorder,
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          shading: { fill: SLATE_LIGHT, type: ShadingType.CLEAR },
          children: [new Paragraph({ children: [new TextRun({ text: 'Facilitator / Chair', bold: true, color: SLATE_DARK })] })],
          borders: defaultBorder,
        }),
        new TableCell({
          width: { size: 75, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: safeStr(mom.facilitator, 'Team Lead / Organizer') })] })],
          borders: defaultBorder,
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          shading: { fill: SLATE_LIGHT, type: ShadingType.CLEAR },
          children: [new Paragraph({ children: [new TextRun({ text: 'Location / Platform', bold: true, color: SLATE_DARK })] })],
          borders: defaultBorder,
        }),
        new TableCell({
          width: { size: 75, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: safeStr(mom.locationOrPlatform, 'Virtual Audio Conference') })] })],
          borders: defaultBorder,
        }),
      ],
    }),
  ];

  const overviewTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: overviewRows,
  });

  // Section 2: Attendees List Paragraphs
  const attendeeParagraphs: Paragraph[] = [];
  if (mom.attendees && mom.attendees.length > 0) {
    mom.attendees.forEach((att) => {
      attendeeParagraphs.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [
            new TextRun({ text: att.name, bold: true }),
            new TextRun({ text: att.role ? ` (${att.role})` : '' }),
            new TextRun({
              text: att.status === 'organizer' ? ' [Organizer]' : att.status === 'absent' ? ' [Regrets/Absent]' : ' [Present]',
              color: att.status === 'absent' ? '94A3B8' : NAVY,
              italics: true,
            }),
          ],
        })
      );
    });
  } else {
    attendeeParagraphs.push(
      new Paragraph({
        children: [new TextRun({ text: 'All registered participants and stakeholders.', italics: true })],
      })
    );
  }

  // Section 3: Executive Summary Box
  const summaryBox = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            shading: { fill: 'EFF6FF', type: ShadingType.CLEAR },
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
              bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
              left: { style: BorderStyle.SINGLE, size: 24, color: NAVY },
              right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
            },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: safeStr(mom.executiveSummary, 'No executive summary provided.'),
                    italics: true,
                    size: 22,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // Section 4: Key Discussion Points
  const discussionParagraphs: Paragraph[] = [];
  if (mom.keyDiscussionPoints && mom.keyDiscussionPoints.length > 0) {
    mom.keyDiscussionPoints.forEach((point, idx) => {
      discussionParagraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          children: [
            new TextRun({
              text: `${idx + 1}. ${point.topic}`,
              bold: true,
              color: NAVY,
            }),
          ],
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: point.summary,
              color: SLATE_DARK,
            }),
          ],
          spacing: { after: 100 },
        })
      );

      if (point.bulletPoints && point.bulletPoints.length > 0) {
        point.bulletPoints.forEach((bp) => {
          discussionParagraphs.push(
            new Paragraph({
              bullet: { level: 0 },
              children: [new TextRun({ text: bp })],
            })
          );
        });
      }
    });
  } else {
    discussionParagraphs.push(
      new Paragraph({
        children: [new TextRun({ text: 'General meeting discussions conducted as per agenda.', italics: true })],
      })
    );
  }

  // Section 5: Decisions Table
  const decisionRows = [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE },
          shading: { fill: NAVY, type: ShadingType.CLEAR },
          children: [new Paragraph({ children: [new TextRun({ text: '#', bold: true, color: 'FFFFFF' })] })],
          borders: defaultBorder,
        }),
        new TableCell({
          width: { size: 60, type: WidthType.PERCENTAGE },
          shading: { fill: NAVY, type: ShadingType.CLEAR },
          children: [new Paragraph({ children: [new TextRun({ text: 'Formal Decision', bold: true, color: 'FFFFFF' })] })],
          borders: defaultBorder,
        }),
        new TableCell({
          width: { size: 30, type: WidthType.PERCENTAGE },
          shading: { fill: NAVY, type: ShadingType.CLEAR },
          children: [new Paragraph({ children: [new TextRun({ text: 'Approved By / Context', bold: true, color: 'FFFFFF' })] })],
          borders: defaultBorder,
        }),
      ],
    }),
  ];

  if (mom.decisions && mom.decisions.length > 0) {
    mom.decisions.forEach((dec, idx) => {
      decisionRows.push(
        new TableRow({
          children: [
            new TableCell({
              width: { size: 10, type: WidthType.PERCENTAGE },
              shading: { fill: idx % 2 === 0 ? 'FFFFFF' : SLATE_LIGHT, type: ShadingType.CLEAR },
              children: [new Paragraph({ children: [new TextRun({ text: `D-${idx + 1}`, bold: true })] })],
              borders: defaultBorder,
            }),
            new TableCell({
              width: { size: 60, type: WidthType.PERCENTAGE },
              shading: { fill: idx % 2 === 0 ? 'FFFFFF' : SLATE_LIGHT, type: ShadingType.CLEAR },
              children: [
                new Paragraph({ children: [new TextRun({ text: dec.decision, bold: true })] }),
                ...(dec.rationale ? [new Paragraph({ children: [new TextRun({ text: `Rationale: ${dec.rationale}`, italics: true, size: 18 })] })] : []),
              ],
              borders: defaultBorder,
            }),
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              shading: { fill: idx % 2 === 0 ? 'FFFFFF' : SLATE_LIGHT, type: ShadingType.CLEAR },
              children: [new Paragraph({ children: [new TextRun({ text: safeStr(dec.approvedBy, 'Consensus') })] })],
              borders: defaultBorder,
            }),
          ],
        })
      );
    });
  } else {
    decisionRows.push(
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            columnSpan: 3,
            children: [new Paragraph({ children: [new TextRun({ text: 'No formal decisions recorded.', italics: true })] })],
            borders: defaultBorder,
          }),
        ],
      })
    );
  }

  const decisionsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: decisionRows,
  });

  // Section: Key Quotes and Statements
  const quoteParagraphs: Paragraph[] = [];
  if (mom.keyQuotesOrHighlights && mom.keyQuotesOrHighlights.length > 0) {
    mom.keyQuotesOrHighlights.forEach((q) => {
      quoteParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `“${q.quote}”`, italics: true }),
            new TextRun({ text: ` — ${q.speaker || 'Speaker'}${q.timestamp ? ` (${q.timestamp})` : ''}`, bold: true, color: NAVY }),
          ],
          spacing: { after: 120 },
        })
      );
    });
  }

  // Section 7: Next Steps & Next Meeting
  const nextStepsParagraphs: Paragraph[] = [];
  if (mom.nextSteps && mom.nextSteps.length > 0) {
    mom.nextSteps.forEach((step) => {
      nextStepsParagraphs.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [new TextRun({ text: step })],
        })
      );
    });
  }

  if (mom.upcomingMeeting) {
    nextStepsParagraphs.push(
      new Paragraph({
        spacing: { before: 150 },
        children: [
          new TextRun({ text: 'Next Scheduled Meeting: ', bold: true, color: NAVY }),
          new TextRun({ text: safeStr(mom.upcomingMeeting.proposedDate, 'To Be Announced') }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Tentative Agenda: ', bold: true }),
          new TextRun({ text: safeStr(mom.upcomingMeeting.tentativeAgenda, 'Progress review on agreed action items.') }),
        ],
      })
    );
  }

  // Section 8: Sign-off block
  const signoffTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: noBorder,
            children: [
              new Paragraph({ children: [new TextRun({ text: 'Minutes Prepared By:', bold: true })] }),
              new Paragraph({ children: [new TextRun({ text: 'MinuteCraft AI & Executive Secretary', italics: true })] }),
              new Paragraph({ children: [new TextRun({ text: `Date: ${new Date().toLocaleDateString()}` })] }),
              new Paragraph({ children: [new TextRun({ text: 'Signature: __________________________' })] }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: noBorder,
            children: [
              new Paragraph({ children: [new TextRun({ text: 'Approved By (Chairperson):', bold: true })] }),
              new Paragraph({ children: [new TextRun({ text: safeStr(mom.facilitator, 'Meeting Chair'), italics: true })] }),
              new Paragraph({ children: [new TextRun({ text: 'Date: __________________________' })] }),
              new Paragraph({ children: [new TextRun({ text: 'Signature: __________________________' })] }),
            ],
          }),
        ],
      }),
    ],
  });

  // Construct Document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              right: 1000,
              bottom: 1000,
              left: 1000,
            },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: 'MinuteCraft AI Automated MOM  |  Page ' }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                  }),
                  new TextRun({ text: ' of ' }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // Header / Title Banner
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'MINUTES OF MEETING (MOM)',
                bold: true,
                size: 36,
                color: NAVY,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: safeStr(mom.title).toUpperCase(),
                bold: true,
                size: 24,
                color: '475569',
              }),
            ],
            spacing: { after: 200 },
          }),

          // Metadata Table
          overviewTable,

          new Paragraph({ text: '', spacing: { after: 200 } }),

          // Executive Summary Heading
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: '1. Executive Summary', bold: true, color: NAVY })],
            spacing: { before: 200, after: 100 },
          }),
          summaryBox,

          new Paragraph({ text: '', spacing: { after: 200 } }),

          // Attendees Heading
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: '2. Attendees & Participation', bold: true, color: NAVY })],
            spacing: { before: 200, after: 100 },
          }),
          ...attendeeParagraphs,

          new Paragraph({ text: '', spacing: { after: 200 } }),

          // Key Discussions
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: '3. Key Discussion Points & Minutes', bold: true, color: NAVY })],
            spacing: { before: 200, after: 100 },
          }),
          ...discussionParagraphs,

          new Paragraph({ text: '', spacing: { after: 200 } }),

          // Decisions Made
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: '4. Decisions & Agreed Resolutions', bold: true, color: NAVY })],
            spacing: { before: 200, after: 100 },
          }),
          decisionsTable,

          new Paragraph({ text: '', spacing: { after: 200 } }),

          // Key Quotes & Statements (if available)
          ...(quoteParagraphs.length > 0
            ? [
                new Paragraph({
                  heading: HeadingLevel.HEADING_2,
                  children: [new TextRun({ text: '5. Key Quotes & Statements', bold: true, color: NAVY })],
                  spacing: { before: 200, after: 100 },
                }),
                ...quoteParagraphs,
                new Paragraph({ text: '', spacing: { after: 200 } }),
              ]
            : []),

          // Next Steps
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: quoteParagraphs.length > 0 ? '6. Next Steps & Adjournment' : '5. Next Steps & Adjournment',
                bold: true,
                color: NAVY,
              }),
            ],
            spacing: { before: 200, after: 100 },
          }),
          ...nextStepsParagraphs,

          new Paragraph({ text: '', spacing: { after: 300 } }),

          // Formal Sign-off
          signoffTable,
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

export function downloadDocxFile(blob: Blob, filename = 'Minutes_of_Meeting.docx') {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.docx') ? filename : `${filename}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
