"use strict";
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageBreak, PageNumber, TabStopType, TabStopPosition,
  PositionalTab, PositionalTabAlignment, PositionalTabRelativeTo, PositionalTabLeader,
  LevelFormat
} = require('docx');
const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════════
// DESIGN TOKENS (IEEE / Modern Tech Inspired)
// ═══════════════════════════════════════════════════════════════════
const C = {
  primary:   "064E3B", // emeraldDark
  accent:    "10B981", // emerald
  light:     "F8FAFC", // soft gray
  surface:   "F1F5F9", // subtle gray
  slate:     "334155", // body text
  muted:     "64748B", // secondary text
  border:    "E2E8F0", // borders
  white:     "FFFFFF",
  emeraldBg: "ECFDF5", // light emerald bg
  grayDark:  "1E293B", // almost black
};

const IMG = 'C:\\Users\\Raouf\\Desktop\\Esprit-FullStackJs-4twin4-2526-MediFollow\\images';
const W = 9026; // content width A4 (DXA)

// ═══════════════════════════════════════════════════════════════════
// IMAGE LOADER
// ═══════════════════════════════════════════════════════════════════
function img(filename, w, h) {
  const p = path.join(IMG, filename);
  if (!fs.existsSync(p)) return null;
  try {
    const isJpg = /\.(jpg|jpeg)$/i.test(p);
    return new ImageRun({
      data: fs.readFileSync(p),
      transformation: { width: w, height: h },
      type: isJpg ? 'jpg' : 'png',
      altText: { title: filename, description: filename, name: filename }
    });
  } catch { return null; }
}

function imgBlock(filename, w, h, figureText) {
  const run = img(filename, w, h);
  if (!run) return [];
  return [
    new Paragraph({ children: [run], alignment: AlignmentType.CENTER, spacing: { before: 160, after: 100 } }),
    new Paragraph({
      children: [
        new TextRun({ text: "Fig. ", font: "Arial", size: 18, bold: true, color: C.primary }),
        new TextRun({ text: figureText, size: 18, font: "Arial", italics: true, color: C.muted })
      ],
      alignment: AlignmentType.CENTER, spacing: { before: 0, after: 240 }
    })
  ];
}

function asciiDiagram(text, caption) {
  const lines = text.split('\n');
  const runs = [];
  lines.forEach((line, i) => {
    if (i > 0) runs.push(new TextRun({ break: 1 }));
    runs.push(new TextRun({ 
      text: line.replace(/ /g, '\u00A0'),
      font: "Consolas", size: 16, color: C.grayDark 
    }));
  });

  return [
    new Table({
      width: { size: W, type: WidthType.DXA }, columnWidths: [W],
      rows: [new TableRow({ children: [new TableCell({
        borders: { top: bdr(C.border), bottom: bdr(C.border), left: bdr(C.border), right: bdr(C.border) },
        shading: { fill: C.light, type: ShadingType.CLEAR },
        margins: { top: 200, bottom: 200, left: 240, right: 240 },
        children: [new Paragraph({ children: runs, spacing: { line: 240 } })]
      })] })]
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Diag. ", font: "Arial", size: 18, bold: true, color: C.primary }),
        new TextRun({ text: caption, size: 18, font: "Arial", italics: true, color: C.muted })
      ],
      alignment: AlignmentType.CENTER, spacing: { before: 100, after: 320 }
    })
  ];
}

// ═══════════════════════════════════════════════════════════════════
// DIAGRAM CONTENT DATA
// ═══════════════════════════════════════════════════════════════════
const diagArchGlobale = `┌─────────────────────────────────────────────────────────────────┐
│                        HEALTHCARE APP                           │
│                     (Next.js 14 + TypeScript)                   │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │  PATIENT │   │  ADMIN   │   │ APPWRITE │
        │   SIDE   │   │   SIDE   │   │ BACKEND  │
        └──────────┘   └──────────┘   └──────────┘`;

const diagFluxPatient = `START
  │
  ▼
┌─────────────────────────────────┐
│     HOME PAGE (/)               │
│  • PatientForm Submission       │
└─────────────────────────────────┘
  │ [Submit]
  ▼
┌─────────────────────────────────────────────┐
│  REGISTER PAGE (/patients/[userId]/register)│
│  📝 FORM:                                   │
│  1️⃣ PERSONAL INFORMATION                    │
│  2️⃣ MEDICAL INFORMATION                     │
│  3️⃣ IDENTIFICATION                          │
│  4️⃣ EMERGENCY CONTACT                       │
│  5️⃣ INSURANCE                               │
│  6️⃣ CONSENTS (MANDATORY)                    │
└─────────────────────────────────────────────┘
  │ [Submit]
  ▼
┌─────────────────────────────────────────────┐
│  NEW APPOINTMENT PAGE                       │
│  📅 APPOINTMENT FORM                        │
│  • Doctor Selection                         │
│  • Date and Time                            │
│  • Reason for Visit                         │
└─────────────────────────────────────────────┘
  │ [Submit]
  ▼
┌─────────────────────────────────────────────┐
│  SUCCESS PAGE                               │
│  ✅ SUMMARY                                 │
│  ⏳ "Awaiting admin confirmation"           │
└─────────────────────────────────────────────┘
  │
END`;

const diagDB = `┌─────────────────────────────────────────────────────────┐
│                    APPWRITE DATABASE                    │
└─────────────────────────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┬───────────────┐
         ▼               ▼               ▼               ▼
    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
    │ PATIENTS│    │ DOCTORS │    │APPOINTS │    │ STORAGE │
    └─────────┘    └─────────┘    └─────────┘    └─────────┘

┌────────────────────────────────────────────────────────────────┐
│  PATIENTS                                                      │
├────────────────────────────────────────────────────────────────┤
│  • userId: string (link to Appwrite Users)                     │
│  • name, email, phone: string                                  │
│  • birthDate: datetime                                         │
│  • gender: string (Male/Female/Other)                          │
│  • identificationType, identificationNumber: string            │
│  • privacyConsent, treatmentConsent: boolean                   │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│  APPOINTMENTS                                                  │
├────────────────────────────────────────────────────────────────┤
│  • patient: string (ID of patient document)                    │
│  • schedule: datetime                                          │
│  • status: enum (pending | scheduled | cancelled)              │
│  • primaryPhysician: string                                    │
└────────────────────────────────────────────────────────────────┘`;

const diagRelations = `┌──────────────┐
│  Appwrite    │
│    Users     │
│  (Auth)      │
└──────┬───────┘
       │ userId (string)
       ▼
┌──────────────┐         patientId          ┌──────────────┐
│   PATIENTS   │◄─────────────────────────┤ APPOINTMENTS │
│  Collection  │                            │  Collection  │
└──────┬───────┘                            └──────┬───────┘
       │ identificationDocumentId                  │ primaryPhysician
       ▼                                           ▼
┌──────────────┐                            ┌──────────────┐
│   STORAGE    │                            │   DOCTORS    │
│    Bucket    │                            │  Collection  │
└──────────────┘                            └──────────────┘`;

const diagCycleVie = `┌───────────┐
│  PATIENT  │
│  Creates  │
└─────┬─────┘
      │
      ▼
┌─────────────────┐
│   📝 PENDING    │◄──────┐
│  (Awaiting)     │       │
└────────┬────────┘       │ Admin reschedules
         │                │
         │ Admin          │
         │ schedules      │
         ▼                │
┌─────────────────┐       │
│  ✅ SCHEDULED   │───────┘
│  (Confirmed)    │
└────────┬────────┘
         │ Admin cancels
         ▼
┌─────────────────┐
│  ❌ CANCELLED   │
│   (Voided)      │
└─────────────────┘`;

// ═══════════════════════════════════════════════════════════════════
// TYPOGRAPHY HELPERS
// ═══════════════════════════════════════════════════════════════════
const sp = (b,a) => ({ before: b, after: a });

function H1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, font: "Arial", bold: true, size: 32, color: C.primary })],
    spacing: sp(400, 160),
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: C.accent, space: 6 } }
  });
}
function H2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, font: "Arial", bold: true, size: 26, color: C.grayDark })],
    spacing: sp(300, 120)
  });
}
function H3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text, font: "Arial", bold: true, size: 22, color: C.slate })],
    spacing: sp(200, 80)
  });
}
function body(text, opts={}) {
  return new Paragraph({
    children: [new TextRun({ text, font: "Arial", size: 21, color: opts.color||C.slate, bold: opts.bold })],
    spacing: sp(60, 80),
    alignment: AlignmentType.JUSTIFIED
  });
}
function gap(n=1) { return new Paragraph({ children: [new TextRun("")] }, { spacing: sp(n*40, n*40) }); }

function bullet(label, text) {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}  `, font: "Arial", size: 20, color: C.accent, bold: true }),
      new TextRun({ text, font: "Arial", size: 21, color: C.slate })
    ],
    spacing: sp(40, 40), indent: { left: 360 }
  });
}
function dot(text) { return bullet("■", text); }

function callout(text, bg = C.emeraldBg, borderC = C.accent) {
  return new Paragraph({
    children: [new TextRun({ text, font: "Arial", size: 21, color: C.grayDark, italics: true })],
    shading: { fill: bg, type: ShadingType.CLEAR },
    border: { left: { style: BorderStyle.SINGLE, size: 16, color: borderC } },
    spacing: sp(160, 160), indent: { left: 240, right: 240 }
  });
}

// ═══════════════════════════════════════════════════════════════════
// TABLE HELPERS
// ═══════════════════════════════════════════════════════════════════
const bdr = (c=C.border) => ({ style: BorderStyle.SINGLE, size: 4, color: c });
const noBdr = () => ({ style: BorderStyle.NONE, size: 0, color: C.white });

function makeTable(headers, rows, colWidths) {
  const total = colWidths.reduce((a,b)=>a+b,0);
  const topBotBdr = { style: BorderStyle.SINGLE, size: 12, color: C.primary };
  const midBdr = { style: BorderStyle.SINGLE, size: 4, color: C.border };

  const hRow = new TableRow({
    tableHeader: true,
    children: headers.map((h,i) => new TableCell({
      width: { size: colWidths[i], type: WidthType.DXA },
      borders: { top: topBotBdr, bottom: topBotBdr, left: noBdr(), right: noBdr() },
      shading: { fill: C.light, type: ShadingType.CLEAR },
      margins: { top: 120, bottom: 120, left: 160, right: 160 },
      children: [new Paragraph({
        children: [new TextRun({ text: h.toUpperCase(), font: "Arial", bold: true, size: 18, color: C.grayDark })],
        alignment: AlignmentType.LEFT
      })]
    }))
  });
  const dRows = rows.map((row, ri) => new TableRow({
    children: row.map((cell,ci) => new TableCell({
      width: { size: colWidths[ci], type: WidthType.DXA },
      borders: { top: noBdr(), bottom: ri === rows.length-1 ? topBotBdr : midBdr, left: noBdr(), right: noBdr() },
      shading: { fill: C.white, type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 160, right: 160 },
      children: [new Paragraph({
        children: [new TextRun({ text: cell, font: "Arial", size: 20, color: C.slate, bold: ci===0 })],
        spacing: sp(40,40)
      })]
    }))
  }));
  return new Table({ width: { size: total, type: WidthType.DXA }, columnWidths: colWidths, rows: [hRow,...dRows] });
}

function infoCard(icon, title, items) {
  return new Table({
    width: { size: W, type: WidthType.DXA }, columnWidths: [W],
    borders: { top: noBdr(), bottom: noBdr(), left: noBdr(), right: noBdr(), insideVertical: noBdr(), insideHorizontal: noBdr() },
    rows: [
      new TableRow({ children: [new TableCell({
        borders: { top: bdr(C.border), bottom: bdr(C.border), left: { style: BorderStyle.SINGLE, size: 12, color: C.primary }, right: bdr(C.border) },
        width: { size: W, type: WidthType.DXA },
        shading: { fill: C.light, type: ShadingType.CLEAR },
        margins: { top: 160, bottom: 160, left: 240, right: 240 },
        children: [
          new Paragraph({ children: [new TextRun({ text: `${icon}  ${title}`, font: "Arial", bold: true, size: 22, color: C.primary })], spacing: sp(0,100) }),
          ...items.map(it => new Paragraph({ children: [
            new TextRun({ text: "●  ", font: "Arial", size: 16, color: C.accent }),
            new TextRun({ text: it, font: "Arial", size: 20, color: C.slate })
          ], spacing: sp(40,40), indent: { left: 160 } }))
        ]
      })] })
    ]
  });
}

function chapterBanner(chNum, chTitle, subtitle) {
  return new Table({
    width: { size: W, type: WidthType.DXA }, columnWidths: [W],
    rows: [new TableRow({ children: [new TableCell({
      borders: { top: noBdr(), bottom: { style: BorderStyle.SINGLE, size: 16, color: C.accent }, left: noBdr(), right: noBdr() },
      width: { size: W, type: WidthType.DXA },
      shading: { fill: C.grayDark, type: ShadingType.CLEAR },
      margins: { top: 600, bottom: 600, left: 400, right: 400 },
      children: [
        new Paragraph({ children: [new TextRun({ text: chNum.toUpperCase(), font: "Arial", size: 22, color: C.accent, bold: true })], spacing: sp(0,120) }),
        new Paragraph({ children: [new TextRun({ text: chTitle, font: "Arial", size: 52, bold: true, color: C.white })], spacing: sp(0,160) }),
        new Paragraph({ children: [new TextRun({ text: subtitle, font: "Arial", size: 24, color: C.border })], spacing: sp(0,0) })
      ]
    })] })]
  });
}

function roleTag(role) {
  return new Paragraph({
    children: [new TextRun({ text: `  ${role.toUpperCase()}  `, font: "Arial", bold: true, size: 20, color: C.white })],
    shading: { fill: C.primary, type: ShadingType.CLEAR },
    spacing: sp(200, 100), alignment: AlignmentType.LEFT
  });
}

// ═══════════════════════════════════════════════════════════════════
// COVER PAGE
// ═══════════════════════════════════════════════════════════════════
function coverPage() {
  const children = [];

  children.push(gap(4));
  const logo = img('logo esprit.png', 180, 70);
  if (logo) {
    children.push(new Paragraph({ children:[logo], alignment:AlignmentType.CENTER, spacing:sp(0,200) }));
  } else {
    children.push(new Paragraph({ children:[new TextRun({text:"ESPRIT",font:"Arial",bold:true,size:32,color:C.primary})],alignment:AlignmentType.CENTER, spacing:sp(0,200)}));
  }

  children.push(new Paragraph({ children:[new TextRun({text:"GRADUATION PROJECT", font:"Arial", size:24, bold:true, color:C.accent})], alignment:AlignmentType.CENTER, spacing:sp(200,80) }));
  children.push(new Paragraph({ children:[new TextRun({text:"Academic Year 2025–2026", font:"Arial", size:20, color:C.muted})], alignment:AlignmentType.CENTER, spacing:sp(0,400) }));

  children.push(new Paragraph({ border: { bottom: { color: C.border, space: 1, style: BorderStyle.SINGLE, size: 6 } }, spacing: sp(0, 400) }));

  children.push(new Paragraph({ children:[new TextRun({text:"MediFollow", font:"Arial", bold:true, size:90, color:C.primary})], alignment:AlignmentType.CENTER, spacing:sp(200,80) }));
  children.push(new Paragraph({ children:[new TextRun({text:"Intelligent Post-Hospitalization Monitoring Web Platform", font:"Arial", size:32, color:C.grayDark})], alignment:AlignmentType.CENTER, spacing:sp(0,80) }));
  children.push(new Paragraph({ children:[new TextRun({text:"Remote monitoring, generative AI, and blockchain security", font:"Arial", size:24, color:C.muted, italics: true})], alignment:AlignmentType.CENTER, spacing:sp(0,400) }));

  children.push(new Paragraph({ border: { bottom: { color: C.accent, space: 1, style: BorderStyle.SINGLE, size: 12 } }, spacing: sp(0, 600) }));

  children.push(new Table({
    width:{size:W,type:WidthType.DXA}, columnWidths:[W/2,W/2],
    borders: { top: noBdr(), bottom: noBdr(), left: noBdr(), right: noBdr(), insideVertical: noBdr(), insideHorizontal: noBdr() },
    rows:[new TableRow({children:[
      new TableCell({
        borders:{top:noBdr(),bottom:noBdr(),left:noBdr(),right:noBdr()},
        margins:{top:100,bottom:100,left:200,right:200},
        children:[
          new Paragraph({children:[new TextRun({text:"Presented by:", font:"Arial", bold:true, size:20, color:C.accent})],spacing:sp(0,160)}),
          ...["Walaeddine Riahi","Arij Mahjoub","Eya Nefzi","Ons Jaouadi","Nizar Chaieb"].map(n=>
            new Paragraph({children:[new TextRun({text:n,font:"Arial",size:24,color:C.grayDark, bold:true})],spacing:sp(40,40)})
          )
        ]
      }),
      new TableCell({
        borders:{top:noBdr(),bottom:noBdr(),left:noBdr(),right:noBdr()},
        margins:{top:100,bottom:100,left:200,right:200},
        children:[
          new Paragraph({children:[new TextRun({text:"Supervised by:",font:"Arial",bold:true,size:20,color:C.accent})],spacing:sp(0,160)}),
          new Paragraph({children:[new TextRun({text:"Mrs. Asma Ayari",font:"Arial",size:24,color:C.grayDark, bold:true})],spacing:sp(40,240)}),
          new Paragraph({children:[new TextRun({text:"Institution:",font:"Arial",bold:true,size:20,color:C.accent})],spacing:sp(0,160)}),
          new Paragraph({children:[new TextRun({text:"ESPRIT",font:"Arial",size:24,color:C.grayDark, bold:true})],spacing:sp(40,40)}),
          new Paragraph({children:[new TextRun({text:"Private Higher School of Engineering and Technology",font:"Arial",size:20,color:C.muted})],spacing:sp(20,40)}),
        ]
      })
    ]})]
  }));

  children.push(new Paragraph({children:[new PageBreak()]}));
  return children;
}

// ═══════════════════════════════════════════════════════════════════
// TABLE OF CONTENTS
// ═══════════════════════════════════════════════════════════════════
function tocPage() {
  const ch = [];
  ch.push(new Paragraph({
    children:[new TextRun({text:"Table of Contents",font:"Arial",bold:true,size:42,color:C.primary})],
    spacing:sp(200,400),
    border:{bottom:{style:BorderStyle.SINGLE,size:8,color:C.accent,space:6}}
  }));

  const entries = [
    {l:0, t:"General Introduction", p:"4"},
    {l:0, t:"Chapter 1  —  General Context", p:"6"},
    {l:1, t:"1.1  Introduction", p:"6"},
    {l:1, t:"1.2  Problem Statement", p:"7"},
    {l:1, t:"1.3  Study of Existing Solutions", p:"8"},
    {l:1, t:"1.5  Proposed Solution – MediFollow", p:"10"},
    {l:1, t:"1.6  Functional and Non-Functional Requirements", p:"12"},
    {l:1, t:"1.7  System Actors", p:"14"},
    {l:1, t:"1.8  Use Case Diagram", p:"15"},
    {l:1, t:"1.9  Data Model", p:"16"},
    {l:1, t:"1.10  Technical Architecture", p:"18"},
    {l:1, t:"1.11  Software Environment", p:"20"},
    {l:1, t:"1.12  Product Backlog", p:"21"},
    {l:1, t:"1.13  Agile Scrum Methodology", p:"23"},
    {l:0, t:"Chapter 2  —  Realization and Implementation", p:"25"},
    {l:1, t:"2.1  Authentication and Onboarding", p:"26"},
    {l:1, t:"2.2  Super Administrator Interface", p:"27"},
    {l:1, t:"2.3  Auditor Interface (Audit & Security)", p:"29"},
    {l:1, t:"2.4  Coordinator Interface", p:"32"},
    {l:1, t:"2.5  Doctor Interface", p:"34"},
    {l:1, t:"2.6  Nurse Interface", p:"38"},
    {l:1, t:"2.7  Patient Interface", p:"39"},
    {l:1, t:"2.8  Artificial Intelligence Features", p:"42"},
    {l:0, t:"Chapter 3  —  CI/CD Pipeline and Software Quality", p:"45"},
    {l:1, t:"3.1  CI/CD Pipeline Architecture", p:"46"},
    {l:1, t:"3.2  Jenkins Pipeline", p:"47"},
    {l:1, t:"3.3  SonarQube Quality Analysis", p:"48"},
    {l:1, t:"3.4  Monitoring and Observability", p:"50"},
    {l:0, t:"General Conclusion", p:"52"},
  ];

  entries.forEach(e => {
    const isChap = e.l === 0;
    ch.push(new Table({
      width:{size:W,type:WidthType.DXA}, columnWidths:[W-600,600],
      borders: { top: noBdr(), bottom: noBdr(), left: noBdr(), right: noBdr(), insideVertical: noBdr(), insideHorizontal: noBdr() },
      rows:[new TableRow({children:[
        new TableCell({
          borders:{top:noBdr(),bottom:{style:BorderStyle.SINGLE,size:4,color:isChap?C.border:C.light},left:isChap?{style:BorderStyle.SINGLE,size:12,color:C.primary}:noBdr(),right:noBdr()},
          width:{size:W-600,type:WidthType.DXA},
          shading:{fill:isChap?C.surface:C.white,type:ShadingType.CLEAR},
          margins:{top:isChap?120:80,bottom:isChap?120:80,left:isChap?200:400,right:60},
          children:[new Paragraph({children:[new TextRun({text:e.t,font:"Arial",size:isChap?22:20,bold:isChap,color:isChap?C.grayDark:C.slate})]})]
        }),
        new TableCell({
          borders:{top:noBdr(),bottom:{style:BorderStyle.SINGLE,size:4,color:isChap?C.border:C.light},left:noBdr(),right:noBdr()},
          width:{size:600,type:WidthType.DXA},
          shading:{fill:isChap?C.surface:C.white,type:ShadingType.CLEAR},
          margins:{top:isChap?120:80,bottom:isChap?120:80,left:40,right:60},
          children:[new Paragraph({children:[new TextRun({text:e.p,font:"Arial",size:isChap?22:20,bold:isChap,color:isChap?C.primary:C.muted})],alignment:AlignmentType.RIGHT})]
        })
      ]})]
    }));
  });

  ch.push(new Paragraph({children:[new PageBreak()]}));
  return ch;
}

// ═══════════════════════════════════════════════════════════════════
// GENERAL INTRODUCTION
// ═══════════════════════════════════════════════════════════════════
function introSection() {
  return [
    chapterBanner("Introduction", "General Introduction", "Context, challenges, and objectives of the MediFollow project"),
    gap(3),
    body("Post-hospitalization follow-up represents a critical phase of patient recovery. Studies show that up to 20% of patients experience complications or require readmission within 30 days of discharge. Most of these complications could be avoided through early detection of warning signs and prompt medical intervention."),
    gap(),
    body("Traditional follow-up methods rely on scheduled visits and subjective patient reports, creating gaps in the continuity of care. The digital transformation of healthcare offers new opportunities to address these challenges."),
    gap(2),
    H1("Project Objectives"),
    body("This project introduces MediFollow, a comprehensive web platform specifically designed for remote monitoring of post-hospitalized patients. The platform aims to:"),
    gap(),
    infoCard("🎯", "Key Objectives of MediFollow", [
      "Ensure continuous monitoring of vital signs (temperature, blood pressure, heart rate, weight, SpO₂)",
      "Generate automated alerts for abnormal vital sign values",
      "Support multi-role healthcare teams with Role-Based Access Control (RBAC)",
      "Provide interactive dashboards for real-time visualization of patient data",
      "Guarantee complete traceability and security of medical information via Aptos blockchain",
      "Integrate an AI voice assistant (Jarvis-3B) for 24/7 support",
    ]),
    gap(2),
    H1("Report Structure"),
    makeTable(
      ["Chapter","Content"],
      [
        ["Chapter 1 – General Context","Problem statement, study of existing solutions, proposed solution, requirements, actors, data model, technical architecture and methodology"],
        ["Chapter 2 – Realization","Interfaces of all roles: SuperAdmin, Auditor, Coordinator, Doctor, Nurse, Patient and AI features"],
        ["Chapter 3 – CI/CD & Quality","DevOps Pipeline (GitHub Actions, Jenkins), SonarQube analysis, Prometheus/Grafana/Alertmanager monitoring"]
      ],
      [2000,7026]
    ),
    gap(3),
    new Paragraph({children:[new PageBreak()]})
  ];
}

// ═══════════════════════════════════════════════════════════════════
// CHAPTER 1
// ═══════════════════════════════════════════════════════════════════
function chapter1() {
  const ch = [];
  ch.push(chapterBanner("Chapter 1", "General Context", "Problem statement · Existing solutions · Architecture · Methodology"));
  ch.push(gap(3));

  ch.push(H1("1.1  Introduction"));
  ch.push(body("Post-hospitalization monitoring is a critical phase where inadequate surveillance can lead to preventable complications, readmissions, and increased healthcare costs. MediFollow is a comprehensive web platform designed to bridge the gap between hospital discharge and full patient recovery through intelligent remote monitoring."));
  ch.push(gap());
  ch.push(infoCard("🏗️","Six Core Components",[
    "Vital Signs Monitoring – Recording and tracking of vital signs",
    "Automated Alert System – Real-time detection of anomalies",
    "Multi-Role Management – 6 distinct roles with tailored permissions",
    "Interactive Dashboards – Real-time visualization of clinical data",
    "Questionnaire Management – AI-personalized follow-up questionnaires",
    "Complete Audit Trail – Full traceability via Aptos blockchain"
  ]));
  ch.push(gap(2));

  ch.push(H1("1.2  Problem Statement"));
  ch.push(body("Post-hospitalization monitoring presents a major challenge: many complications occur because patients are not sufficiently monitored after discharge. Traditional methods rely on infrequent scheduled visits, creating significant gaps in continuity of care."));
  ch.push(gap());
  ch.push(callout("How can we design a comprehensive, intelligent, and secure web platform allowing healthcare professionals to effectively monitor post-hospitalized patients, detect abnormal health indicators in real-time, and reduce complications through automated alerts and continuous data tracking?"));
  ch.push(gap(2));

  ch.push(H1("1.3  Study and Critique of Existing Solutions"));
  ch.push(makeTable(
    ["Solution","Strengths","Key Limitations"],
    [
      ["Epic EMR","Regulatory compliance, records management, reporting","No AI, no remote alerts, no chatbot, single-entity architecture, high costs"],
      ["Teladoc","Video consultations, KPIs, modular ecosystem","Configuration complexity, high cost, not tailored for post-hospital monitoring, no AI chatbot"]
    ],
    [2000,3200,3826]
  ));
  ch.push(gap(2));

  ch.push(H1("1.5  Proposed Solution – MediFollow"));
  ch.push(body("MediFollow is a modern, intelligent, and secure platform for monitoring post-hospitalized patients. It relies on a multi-role architecture supporting 6 distinct profiles, ensuring data isolation and security via Aptos blockchain, and integrating AI at every operational level."));
  ch.push(gap());
  ch.push(infoCard("💡","Global Vision of the Solution",[
    "Reduce time spent on manual patient monitoring tasks",
    "Decrease medical management costs for healthcare facilities",
    "Provide 24/7 intelligent assistance via Jarvis (Voice AI)",
    "Enable effective coordination within multi-role healthcare teams",
    "Provide control over medical data access via Aptos blockchain"
  ]));
  ch.push(gap(2));

  ch.push(H1("1.6  Functional and Non-Functional Requirements"));
  ch.push(H2("Functional Requirements"));
  ch.push(makeTable(
    ["Requirement","Description"],
    [
      ["Questionnaire Mgmt","Create, assign, and manage health questionnaires with configurable frequency"],
      ["Alert System","Real-time detection of abnormal values with instant notifications to the care team"],
      ["Vital Signs Monitoring","Recording and monitoring vital signs with configurable alert thresholds per patient"],
      ["Dashboards","Real-time data visualization, trends, alert history per role"],
      ["Multi-Role Mgmt","Support for 6 roles (Patient, Doctor, Nurse, Coordinator, Admin, Auditor)"],
      ["Audit Trail","Complete traceability of all platform actions for regulatory compliance"],
      ["Aptos Blockchain","Decentralized and secure medical access control, revocable by the patient"],
      ["Generative AI","AI clinical summary, questionnaire generation, automatic triage, predictive analysis"]
    ],
    [3200,5826]
  ));
  ch.push(gap(2));
  ch.push(H2("Non-Functional Requirements"));
  ch.push(makeTable(
    ["Criterion","Specification"],
    [
      ["Security","AES-256 encryption, Role-Based Access Control (RBAC), data isolation per entity"],
      ["Legal Compliance","Compliance with health data protection regulations, Privacy-by-Design"],
      ["Performance","Response time < 2s, support for 1,000+ concurrent users, Redis cache"],
      ["Availability","99.9% guaranteed uptime, Kubernetes, Prometheus/Grafana monitoring system"],
      ["Scalability","Horizontal scaling, Docker containers, load-based auto-scaling"]
    ],
    [3200,5826]
  ));
  ch.push(gap(2));

  ch.push(H1("1.7  System Actors"));
  ch.push(makeTable(
    ["Role","Responsibilities","Permissions"],
    [
      ["Super Admin","Global platform ownership, management of all accounts","Full access – Audit Log – System settings"],
      ["Platform Admin","Technical and operational platform management","Accounts, security, logs, licenses"],
      ["Doctor","Comprehensive monitoring of assigned patients, clinical decisions","Vital signs, questionnaires, AI analysis, alerts"],
      ["Nurse","Data entry assistance, patient assignment to doctors","Patient data, assignments, reminders"],
      ["Coordinator","Compliance supervision, escalation of critical alerts","Alerts, reports, protocol tracking"],
      ["Patient","Record consultation, vital signs entry, questionnaires","Read record, measure entry, blockchain"],
      ["Auditor","Security monitoring, logs, incidents, audit reports","Read-only + report generation"],
      ["AI Agent","Automated analysis of medical data, anomalies","Analysis module, KPIs, predictions"]
    ],
    [2200,4600,2226]
  ));
  ch.push(gap(2));

  ch.push(H1("1.8  Use Case Diagram"));
  ch.push(body("The use case diagram provides a comprehensive overview of the interactions between system actors and the main functional modules of the platform."));
  ch.push(...imgBlock('image3.png', 580, 440, "Use Case Diagram – Multi-Role Web Platform"));

  ch.push(H1("1.9  Data Model"));
  ch.push(body("The data model defines the core entities of the system, their attributes, and relationships. It ensures data consistency, supports multi-organization, and enables the platform's various modules."));
  ch.push(...imgBlock('image5.png', 580, 440, "UML Class Diagram of the Data Model"));

  ch.push(H1("1.10  Technical Architecture"));
  ch.push(H2("1.10.1  Logical Architecture"));
  ch.push(makeTable(
    ["Layer","Technology","Role"],
    [
      ["Presentation","Web Browser","User interface accessible via HTTPS"],
      ["Frontend","Next.js / React / Tailwind CSS","Responsive and optimized user interfaces"],
      ["Application","NestJS (Node.js)","RESTful APIs, business logic, RBAC"],
      ["AI","OpenAI GPT-4 / Hugging Face / Jarvis-3B","Medical analysis, voice chatbot, anomalies"],
      ["Data","PostgreSQL / MongoDB / Redis","Persistent storage, caching, high availability"],
      ["Blockchain","Aptos (Move)","Decentralized and immutable medical access control"]
    ],
    [2200,2600,4226]
  ));
  ch.push(...imgBlock('image6.png', 580, 360, "Logical Architecture of the MediFollow Web Platform"));
  ch.push(H2("1.10.2  Physical Architecture"));
  ch.push(body("The platform follows a distributed deployment model based on cloud services: frontend on Vercel (global CDN), backend and AI services on a separate cloud environment, managed database (high availability), and Aptos blockchain nodes."));
  ch.push(...imgBlock('image19.png', 580, 300, "Physical Architecture of the MediFollow Web Platform"));

  ch.push(H1("1.11  Software Environment"));
  ch.push(makeTable(
    ["Technology","Role","Category"],
    [
      ["NestJS","Node.js backend framework, modular architecture","Backend"],
      ["Next.js / React","React frontend framework with optimized rendering","Frontend"],
      ["Tailwind CSS","Utility-first CSS framework for design","UI"],
      ["OpenAI GPT-4","AI models for NLP, questionnaire generation","AI"],
      ["Jarvis-3B","Specialized healthcare AI voice assistant","Voice AI"],
      ["Hugging Face / BiomedBERT","Clinical triage, biomedical analysis","Medical AI"],
      ["Pusher","Real-time communication, push notifications","Real-time"],
      ["PostgreSQL / MongoDB","Relational and NoSQL databases","Data"],
      ["Redis","In-memory cache, sessions, message queues","Performance"],
      ["Aptos Blockchain","Decentralized medical access control (Move)","Security"],
      ["GitHub Actions","Automated CI/CD, testing, deployment","DevOps"],
      ["Jenkins","Local CI/CD pipeline, Docker, SonarQube","DevOps"],
      ["Docker / Kubernetes","Containerization, orchestration, scaling","Infrastructure"],
      ["Vercel","Frontend deployment, global CDN","Hosting"],
      ["Prometheus / Grafana","Monitoring, alerting, dashboards","Observability"]
    ],
    [2600,4200,2226]
  ));
  ch.push(gap(2));

  ch.push(H1("1.12  Product Backlog"));
  ch.push(makeTable(
    ["ID","User Story","Priority"],
    [
      ["US-01","As a user, I want to create an account and log in","High"],
      ["US-02","As an admin, I want to manage roles and permissions","High"],
      ["US-03","As an admin, I want to manage user accounts","High"],
      ["US-04","As a doctor, I want to view vital sign trends","High"],
      ["US-05","As a patient, I want to enter my vital signs","High"],
      ["US-06","As a patient, I want to report my symptoms","High"],
      ["US-07","As a patient, I want to consult my medical records","High"],
      ["US-08","As a doctor, I want to receive alerts for abnormal values","High"],
      ["US-09","As a nurse, I want to assign patients to doctors","High"],
      ["US-10","As a coordinator, I want to send reminders to patients","Medium"],
      ["US-11","As an auditor, I want to view logs and generate reports","High"]
    ],
    [900,6600,1526]
  ));
  ch.push(gap(2));

  ch.push(H1("1.13  Agile Scrum Methodology"));
  ch.push(body("For the development of this project, we adopted an agile approach inspired by the Scrum methodology, adapted to the academic context. Scrum supports iterative and incremental development, well suited to evolving requirements."));
  ch.push(...imgBlock('image4.png', 480, 320, "Agile Scrum Development Process"));
  ch.push(makeTable(
    ["Sprint","Objective","Modules Developed"],
    [
      ["Sprint 1","Multi-role architecture","User management, RBAC, JWT authentication"],
      ["Sprint 2","Clinical monitoring","Patient management, vital signs, alert configuration"],
      ["Sprint 3","Questionnaires & Alerts","AI questionnaires, automated alert system"],
      ["Sprint 4","AI & DevOps","AI integration, analytics, dashboards, CI/CD pipeline"]
    ],
    [1200,3000,4826]
  ));
  ch.push(gap(2));
  ch.push(new Paragraph({children:[new PageBreak()]}));
  return ch;
}

// ═══════════════════════════════════════════════════════════════════
// CHAPTER 2
// ═══════════════════════════════════════════════════════════════════
function chapter2() {
  const ch = [];
  ch.push(chapterBanner("Chapter 2","Realization and Implementation","User interfaces · Features · Screenshots"));
  ch.push(gap(3));
  ch.push(body("This chapter presents the graphical interfaces of the MediFollow platform and the main implemented features. The platform was developed with Next.js for the frontend and NestJS for the backend, following a multi-role web architecture integrating Aptos blockchain and generative AI."));
  ch.push(gap(2));

  ch.push(H1("2.1  Authentication and Onboarding"));
  ch.push(body("The platform offers a secure registration and login system based on JWT tokens with Role-Based Access Control. An innovative biometric facial recognition feature is available for secure passwordless login."));
  ch.push(gap());
  ch.push(infoCard("🔐","Authentication Security",[
    "JWT Tokens with automatic refresh and RBAC control",
    "Biometric facial recognition (Jarvis-3B) – passwordless login",
    "Demo accounts per role with quick password copy",
    "AES-256 encryption of all transmitted data"
  ]));
  ch.push(...imgBlock('image20.png', 540, 280, "MediFollow Home Interface – Landing Page with key indicators"));
  ch.push(...imgBlock('image21.png', 540, 280, "Login Interface with Demo Accounts by Role"));
  ch.push(...imgBlock('ai-face-detection.jpeg', 440, 310, "Facial Recognition – Secure Biometric Authentication (Jarvis-3B)"));

  ch.push(H1("2.2  Super Administrator Interface"));
  ch.push(roleTag("Super Admin"));
  ch.push(body("The Super Administrator has a real-time global view of the entire user ecosystem of the MediFollow platform. The dashboard centralizes key metrics and recent audit events with severity level indications."));
  ch.push(gap());
  ch.push(makeTable(
    ["Indicator","Value","Description"],
    [
      ["Admins","4","Platform administrators"],
      ["Doctors","5","Registered doctors"],
      ["Patients","8","Patients under monitoring"],
      ["Nurses","4","Nursing staff"],
      ["Coordinators","2","Care coordinators"],
      ["Auditors","2","Security auditors"],
      ["New (7d)","4","New users this week"],
      ["Failed logins (24h)","0","No suspicious attempts"]
    ],
    [3000,1500,4526]
  ));
  ch.push(...imgBlock('superadmindashboard.PNG', 560, 280, "SuperAdmin Overview – Real-time dashboard of the user ecosystem"));
  ch.push(H2("2.2.1  Immutable Audit Log"));
  ch.push(body("The Super Admin's audit log records every critical action immutably: user creation, super-admin initialization, with precise timestamp, actor, target, action, and severity level (INFO / CRITICAL). 9 total entries recorded."));
  ch.push(...imgBlock('super_admin_management_logs.PNG', 560, 280, "SuperAdmin Audit Log – Immutable journal of system events (9 entries)"));

  ch.push(H1("2.3  Auditor Interface (Audit & Security)"));
  ch.push(roleTag("Security Auditor"));
  ch.push(body("The security auditor has a comprehensive suite of tools to oversee system security, consult logs, manage incidents, and generate audit reports. The Aptos blockchain is integrated to ensure log immutability."));
  ch.push(gap());
  ch.push(H2("2.3.1  Auditor Dashboard"));
  ch.push(makeTable(
    ["Indicator","Value","Variation"],
    [
      ["Total Logs","2,543","+12% this month"],
      ["Incidents","8","-3% this month"],
      ["Active Users","142","+5% this month"],
      ["Modifications","1,247","+8% this month"]
    ],
    [3000,2000,4026]
  ));
  ch.push(...imgBlock('audit dashboard.PNG', 560, 280, "Auditor Dashboard – System security view with active blockchain"));
  ch.push(H2("2.3.2  Audit Logs"));
  ch.push(body("The Audit Logs module allows consultation of all system events and actions. Each entry includes: timestamp, user, action type (LOGIN, LOGIN_FAILED...), affected resource, JSON details, and status. Export available in CSV and JSON."));
  ch.push(...imgBlock('audit des logs.PNG', 560, 280, "Audit Logs – Multi-criteria filtering (CSV / JSON)"));
  ch.push(H2("2.3.3  Audit Reports"));
  ch.push(body("The auditor can generate custom reports or download pre-generated reports: Monthly Report (2.5 MB), Q1 Security Report (3.8 MB), Active Users Report (1.2 MB). Each report is timestamped and available in PDF format."));
  ch.push(...imgBlock('reporting audit complet.PNG', 560, 280, "Audit Reports – Generation and download of detailed system reports"));
  ch.push(H2("2.3.4  Security Incident Management"));
  ch.push(body("The Incidents module detects and manages critical security alerts. A VITAL Alert incident was detected: abnormal temperature + oxygen saturation, requiring immediate medical intervention. Status: Resolved."));
  ch.push(...imgBlock('gestion desincident audit.PNG', 560, 280, "Security Incidents – Critical VITAL Alert (Temp + SpO₂) – Status Resolved"));

  ch.push(H1("2.4  Coordinator Interface"));
  ch.push(roleTag("Care Coordinator"));
  ch.push(body("The coordinator supervises patient compliance over 7 days, manages active alerts, and reports. They can manually escalate critical situations to doctors and rely on the Clinical Triage AI Assistant."));
  ch.push(gap());
  ch.push(H2("2.4.1  Patient Compliance Monitoring"));
  ch.push(body("The assigned list displays for each patient: medical record number (MRN), department, assigned doctor(s), compliance score (%), number of completed/pending questionnaires, and daily status (OK / Missing)."));
  ch.push(...imgBlock('cordinator consulting patient activity.jpeg', 560, 275, "My Patients – 7-day compliance with questionnaires and vital signs"));
  ch.push(H2("2.4.2  Active Alerts Management – AI Triage"));
  ch.push(body("The Active Alerts Monitoring allows tracking untreated alerts, following doctor interventions, and escalating critical situations. The Clinical Triage AI Assistant analyzes clinical summaries to assess urgency."));
  ch.push(...imgBlock('cordinator-manage-alerts-inconforme.jpeg', 560, 275, "Active Alerts Monitoring – Clinical AI Triage + Manual escalation"));
  ch.push(H2("2.4.3  Reviews & Reports – Critical Alerts"));
  ch.push(body("The Reviews & Reports module displays critical alerts with measured vital values and assigned doctor's contact info. CRITICAL Alert detected. Actions: Request re-measurement · Send notification · Acknowledge."));
  ch.push(...imgBlock('revenu-signalements-cordinator.jpeg', 560, 275, "Reviews & Reports – CRITICAL Alert with critical vital values and AI analysis"));

  ch.push(H1("2.5  Doctor Interface"));
  ch.push(roleTag("Doctor"));
  ch.push(body("The doctor has a comprehensive workspace to manage their assigned patients, monitor vital signs in real-time, create analysis requests, and generate questionnaires via AI. The platform integrates an AI clinical summary for each patient."));
  ch.push(gap());
  ch.push(H2("2.5.1  Patient List"));
  ch.push(body("The doctor views the list of their patients with basic medical information. The Aptos blockchain guarantees the security of access to medical records."));
  ch.push(...imgBlock('docteur-patient.jpeg', 560, 275, "Patients – List of assigned patients"));
  ch.push(H2("2.5.2  AI Clinical Summary"));
  ch.push(body("The patient profile automatically generates a Comprehensive AI Clinical Summary: patient information, current vital signs with normality assessment, trends from the last 5 measurements, and predictive analysis."));
  ch.push(...imgBlock('consulter-patient.jpeg', 560, 275, "AI Clinical Summary – Comprehensive analysis of the patient"));
  ch.push(H2("2.5.3  Real-Time Vital Signs Monitoring"));
  ch.push(body("The vital signs dashboard displays averages of all patients and the complete history of measurements. Abnormal values are highlighted. Critical notifications appear in real-time."));
  ch.push(...imgBlock('alert-docteur-patient-signeviteaux.PNG', 560, 275, "Vital Signs – Real-time monitoring + CRITICAL notification"));
  ch.push(H2("2.5.4  Medical Analysis Requests"));
  ch.push(body("The doctor creates analysis requests for their patients: clinical reason, deadline, attached document, and selection of the target patient from the assigned list. This feature facilitates post-hospitalization clinical follow-up."));
  ch.push(...imgBlock('demande-analyse-par-docteur-a patient-assigné.jpeg', 520, 280, "Analysis Requests – Creation form for assigned patient"));
  ch.push(H2("2.5.5  AI Questionnaire Generation"));
  ch.push(body("The doctor automatically generates clinical questionnaires by specifying the medical specialty, title, and custom instructions. The AI instantly produces relevant questions adapted to the clinical context."));
  ch.push(...imgBlock('generation-questionnaire-ai.PNG', 540, 280, "AI Questionnaire Generation – Specialty + instructions → Automatic clinical questions"));

  ch.push(H1("2.6  Nurse Interface"));
  ch.push(roleTag("Nurse"));
  ch.push(body("The nurse has a dedicated interface to assign patients to available doctors, enter medical data, and manage reminders. The 'Assign to Doctor' interface allows quick assignment with instant confirmation."));
  ch.push(...imgBlock('nurse-assigne-patient.jpeg', 560, 265, "Assign to Doctor – Patient-doctor assignment"));

  ch.push(H1("2.7  Patient Interface"));
  ch.push(roleTag("Patient"));
  ch.push(body("The patient has a comprehensive personal space to track their post-hospitalization health: dashboard with real-time vital signs, interactive questionnaires with voice assistance, and total control of their medical data via Aptos blockchain."));
  ch.push(gap());
  ch.push(H2("2.7.1  Patient Dashboard"));
  ch.push(body("The dashboard displays real-time most recent vital signs, active alerts, and an interactive user guide to help the patient navigate the platform."));
  ch.push(...imgBlock('guide d\'utulisation patient dashboard.PNG', 560, 275, "Patient Dashboard – Real-time vital signs + interactive user guide"));
  ch.push(H2("2.7.2  Questionnaire with AI Voice Assistance"));
  ch.push(body("The patient answers their follow-up questionnaires via an intuitive interface with a progress bar. The Jarvis voice mode allows answering clinical questions aloud. Question types: free text, binary Yes/No, 1-10 numerical scale."));
  ch.push(...imgBlock('questionnaire patient avec optient d\'assistance vocal pour repondre au questiant.jpeg', 560, 275, "Patient Questionnaire – AI Voice Mode (Jarvis) for spoken responses to clinical questions"));
  ch.push(H2("2.7.3  Medical Access Control via Aptos Blockchain"));
  ch.push(body("The patient precisely controls which doctors can access their health data via the Aptos blockchain. They can grant or revoke access with configurable duration (30d, 3 months, 6 months, 1 year) and view the blockchain wallet addresses of each doctor."));
  ch.push(...imgBlock('accees blockchain des document.jpeg', 560, 275, "Aptos Blockchain Medical Access Control – Active accesses, revocation possible"));

  ch.push(H1("2.8  Artificial Intelligence Features"));
  ch.push(body("MediFollow integrates artificial intelligence at all operational levels of the platform, distinguishing the solution from existing systems on the market."));
  ch.push(gap());
  ch.push(makeTable(
    ["AI Feature","Technology","Target Users"],
    [
      ["Jarvis Voice Assistant","Jarvis-3B (Healthcare LLM)","All roles"],
      ["AI Clinical Summary","GPT-4 / OpenAI","Doctors"],
      ["Questionnaire Generation","GPT-4 + contextual instructions","Doctors"],
      ["Clinical Triage","BiomedBERT / Mistral 7B","Coordinators"],
      ["Vital Anomaly Detection","Configurable thresholds + ML","Automated system"],
      ["Facial Recognition","Computer Vision (Jarvis-3B)","All roles"],
      ["Predictive Analysis","Trends + forecasting","Doctors, Coordinators"]
    ],
    [3400,2800,2826]
  ));
  ch.push(gap());
  ch.push(H2("2.8.1  Jarvis – AI Voice Assistant"));
  ch.push(body("Jarvis is the AI voice assistant integrated into MediFollow, based on the Jarvis-3B model. Accessible to all roles via an interactive voice orb, it provides immediate contextual assistance 24/7. In Auto mode, it listens and responds continuously; in Push-to-Talk mode, the user triggers voice recognition manually."));
  ch.push(...imgBlock('model-assistant-ai-vocal-inteligent.PNG', 460, 290, "Jarvis – AI Voice Assistant (Jarvis-3B) in standby mode"));

  ch.push(gap(2));
  ch.push(new Paragraph({children:[new PageBreak()]}));
  return ch;
}

// ═══════════════════════════════════════════════════════════════════
// CHAPTER 3
// ═══════════════════════════════════════════════════════════════════
function chapter3() {
  const ch = [];
  ch.push(chapterBanner("Chapter 3","CI/CD Pipeline and Software Quality","DevOps · Testing · SonarQube · Monitoring"));
  ch.push(gap(3));
  ch.push(body("To ensure the reliability, security, and maintainability of the MediFollow platform, we implemented a comprehensive DevOps workflow based on Continuous Integration and Continuous Deployment (CI/CD). This workflow automates code validation, testing, quality analysis, containerization, and deployment."));
  ch.push(gap(2));

  ch.push(H1("3.1  CI/CD Pipeline Architecture"));
  ch.push(body("The CI/CD workflow is organized into four independent pipelines – two for the frontend (medifollow-web) and two for the backend API (medifollow-api) – following the principle of separation between Continuous Integration (CI) and Continuous Delivery (CD)."));
  ch.push(gap());
  ch.push(makeTable(
    ["Pipeline","Trigger","Main Actions"],
    [
      ["Frontend CI","Push / Pull Request","ESLint (static analysis) · Vitest (unit tests)"],
      ["Frontend CD","After successful CI","Next.js Build · Artifact storage (GitHub Actions)"],
      ["Backend CI","Branch push","Mock PostgreSQL/MongoDB · Jest (tests)"],
      ["Backend CD","After successful CI","TypeScript compilation → JS · dist/ Artifact stored"]
    ],
    [1800,2400,4826]
  ));
  ch.push(gap(2));

  ch.push(H1("3.2  Jenkins Pipeline – Full Automation"));
  ch.push(body("For local automation and complete lifecycle management, we implemented a dedicated CI/CD pipeline with Jenkins, ensuring that every code modification is automatically validated, analyzed, containerized, and deployed."));
  ch.push(gap());
  ch.push(infoCard("⚙️","Jenkins Pipeline Steps (Jenkinsfile)",[
    "Preparation: Workspace cleanup and secure build environment configuration",
    "Installation: Dependency installation with npm install",
    "Static Analysis: ESLint execution – code style violation detection",
    "Unit Tests: Execution with Vitest – validation of all features",
    "SonarQube Analysis: Comprehensive report on security, reliability, and maintainability",
    "Docker Build: Construction of the production container image",
    "Deployment: Automatic restart via Docker Compose with the latest image"
  ]));
  ch.push(gap(2));

  ch.push(H1("3.3  Software Quality Analysis – SonarQube"));
  ch.push(body("SonarQube was integrated into the pipeline as a Quality Gate tool. It performs deep static code analysis across four key dimensions: Reliability, Security, Maintainability, and Test Coverage. A build is only validated if it passes all Quality Gate conditions."));
  ch.push(gap());

  ch.push(makeTable(
    ["Metric","Before","After","Improvement"],
    [
      ["Frontend Reliability","D (520 bugs)","A (2 bugs)","-99.9%"],
      ["Frontend Security","C (2 issues)","A (0 issues)","✓ Resolved"],
      ["Frontend Coverage","0.3%","81.4%","+747.9%"],
      ["Duplication","7.3%","0.0%","✓ Eliminated"],
      ["Backend Maintainability","A (stable)","A (stable)","Maintained"],
      ["Quality Gate","FAILED","PASSED ✓","✓ Validated"]
    ],
    [3000,2000,2000,2026]
  ));
  ch.push(gap(2));

  ch.push(H1("3.4  Monitoring and Observability"));
  ch.push(body("A comprehensive monitoring and observability stack was deployed to supervise the platform in production and detect anomalies in real-time, based on Prometheus, Grafana, and Alertmanager."));
  ch.push(gap());
  ch.push(infoCard("📊","MediFollow Monitoring Stack",[
    "Prometheus: Collection and storage of metrics for frontend and backend API",
    "Grafana: Interactive dashboards for real-time visualization of platform performance",
    "Alertmanager: Automated alerts with configurable rules – InstanceDown Critical Alert"
  ]));
  ch.push(gap(2));
  ch.push(new Paragraph({children:[new PageBreak()]}));
  return ch;
}

// ═══════════════════════════════════════════════════════════════════
// CONCLUSION
// ═══════════════════════════════════════════════════════════════════
function conclusion() {
  const ch = [];
  ch.push(chapterBanner("Conclusion","General Conclusion","Summary · Limitations · Future Perspectives"));
  ch.push(gap(3));

  ch.push(H1("Summary of Achievements"));
  ch.push(body("This project presented the design, development, and deployment of MediFollow, a remote monitoring platform for post-hospitalized patients. The three chapters addressed the challenges related to automation, intelligent assistance, multi-role management, and software quality."));
  ch.push(gap());
  ch.push(makeTable(
    ["Domain","Achievement"],
    [
      ["Multi-Role Architecture","6 distinct roles with dedicated interfaces"],
      ["Real-Time Alert System","Automatic detection of vital anomalies with instant notifications"],
      ["AI Integration","Jarvis-3B voice, GPT-4 clinical summary, BiomedBERT triage, questionnaire generation"],
      ["Aptos Blockchain","Decentralized medical access control, immutable audit logs"],
      ["Software Quality","SonarQube Quality Gate PASSED: Reliability A, Security A, Coverage 81.4%"]
    ],
    [3000,6026]
  ));
  ch.push(gap(2));

  ch.push(H1("Future Perspectives"));
  ch.push(makeTable(
    ["Direction","Description"],
    [
      ["Advanced AI","Deep Learning models for vital trend prediction and early detection"],
      ["Mobile Application","Native iOS and Android app to extend platform accessibility"],
      ["External Integrations","Connection to wearable device APIs, HIS systems, and third-party software"],
      ["Advanced Analytics","BI dashboards with industry benchmarking and predictive cohort analysis"]
    ],
    [2600,6426]
  ));
  ch.push(gap(2));

  ch.push(callout("MediFollow demonstrates that a modern, intelligent, and scalable web platform can be designed and implemented to meet the real needs of post-hospitalization monitoring. By combining robust multi-role architecture, AI automation, blockchain security, and a comprehensive DevOps pipeline, this project provides a solid and extensible foundation for a next-generation medical management solution.", C.light, C.primary));
  return ch;
}

// ═══════════════════════════════════════════════════════════════════
// ASSEMBLE DOCUMENT
// ═══════════════════════════════════════════════════════════════════
const allChildren = [
  ...coverPage(),
  ...tocPage(),
  ...introSection(),
  ...chapter1(),
  ...chapter2(),
  ...chapter3(),
  ...conclusion()
];

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Arial", size: 21, color: C.slate } }
    },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: C.primary },
        paragraph: { spacing: { before: 400, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: C.grayDark },
        paragraph: { spacing: { before: 300, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Arial", color: C.slate },
        paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 2 } }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },  // A4
        margin: { top: 1200, right: 1200, bottom: 1200, left: 1200 }
      }
    },
    headers: {
      default: new Header({ children: [
        new Paragraph({
          children: [
            new TextRun({ text: "MEDIFOLLOW – GRADUATION PROJECT", font: "Arial", size: 16, color: C.muted, bold: true }),
            new TextRun({ text: "\t", font: "Arial", size: 16 }),
            new TextRun({ text: "PAGE ", font: "Arial", size: 16, color: C.muted, bold: true }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: C.primary, bold: true }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: C.accent, space: 10 } },
        })
      ]})
    },
    footers: {
      default: new Footer({ children: [
        new Paragraph({
          children: [
            new TextRun({ text: "ESPRIT – Private Higher School of Engineering and Technology", font: "Arial", size: 16, color: C.muted }),
          ],
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.border, space: 10 } },
          alignment: AlignmentType.CENTER
        })
      ]})
    },
    children: allChildren
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('C:\\Users\\Raouf\\Desktop\\Esprit-FullStackJs-4twin4-2526-MediFollow\\MediFollow_Rapport_FINAL_v5.docx', buf);
  console.log('✅ Document generated in English with Modern IEEE Design!');
  console.log('Size:', Math.round(buf.length/1024), 'KB');
}).catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
