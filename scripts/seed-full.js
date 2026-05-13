/**
 * MediFollow - Complete Database Seed for E2E Demo
 * Covers ALL roles: Admin, Doctor, Nurse, Coordinator, Auditor, Patients
 */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Cleaning ALL data...");
  // Delete in dependency order (children first)
  try { await prisma.superAuditLog.deleteMany(); } catch(e) {}
  try { await prisma.userEditHistory.deleteMany(); } catch(e) {}
  try { await prisma.userSuspensionHistory.deleteMany(); } catch(e) {}
  try { await prisma.complianceRecord.deleteMany(); } catch(e) {}
  try { await prisma.voiceTranscript.deleteMany(); } catch(e) {}
  try { await prisma.aIAnalysisCache.deleteMany(); } catch(e) {}
  try { await prisma.analysisRequest.deleteMany(); } catch(e) {}
  try { await prisma.patientCommunication.deleteMany(); } catch(e) {}
  try { await prisma.nurseAssignment.deleteMany(); } catch(e) {}
  try { await prisma.accessGrant.deleteMany(); } catch(e) {}
  try { await prisma.patientCheckup.deleteMany(); } catch(e) {}
  try { await prisma.questionnaireResponse.deleteMany(); } catch(e) {}
  try { await prisma.questionnaireAssignment.deleteMany(); } catch(e) {}
  try { await prisma.questionnaireQuestion.deleteMany(); } catch(e) {}
  try { await prisma.questionnaire.deleteMany(); } catch(e) {}
  try { await prisma.questionnaireTemplate.deleteMany(); } catch(e) {}
  try { await prisma.medicalDocument.deleteMany(); } catch(e) {}
  try { await prisma.medicalAnalysis.deleteMany(); } catch(e) {}
  try { await prisma.blockchainProof.deleteMany(); } catch(e) {}
  try { await prisma.auditLog.deleteMany(); } catch(e) {}
  try { await prisma.notification.deleteMany(); } catch(e) {}
  try { await prisma.alert.deleteMany(); } catch(e) {}
  try { await prisma.vitalRecord.deleteMany(); } catch(e) {}
  try { await prisma.symptom.deleteMany(); } catch(e) {}
  try { await prisma.session.deleteMany(); } catch(e) {}
  try { await prisma.medicalForm.deleteMany(); } catch(e) {}
  try { await prisma.service.deleteMany(); } catch(e) {}
  try { await prisma.doctorProfile.deleteMany(); } catch(e) {}
  try { await prisma.nurseProfile.deleteMany(); } catch(e) {}
  try { await prisma.coordinatorProfile.deleteMany(); } catch(e) {}
  try { await prisma.patient.deleteMany(); } catch(e) {}
  try { await prisma.user.deleteMany(); } catch(e) {}
  console.log("✅ Database cleaned");

  const pw = await bcrypt.hash("Test@123456", 10);

  // ══════════════ USERS ══════════════
  console.log("👤 Creating users...");

  const admin = await prisma.user.create({ data: {
    email: "admin@medifollow.health", passwordHash: pw,
    firstName: "Admin", lastName: "MediFollow", role: "ADMIN",
    phoneNumber: "+21612000001", isActive: true,
  }});

  const doctor = await prisma.user.create({ data: {
    email: "doctor@medifollow.health", passwordHash: pw,
    firstName: "Raouf", lastName: "Riahi", role: "DOCTOR",
    phoneNumber: "+21612000002", isActive: true,
    blockchainAddress: "0x43f2e7420983c87eb131d936c18237d68f19952aeac6fd49778c7507062347f1",
  }});

  const doctor2 = await prisma.user.create({ data: {
    email: "doctor2@medifollow.health", passwordHash: pw,
    firstName: "Sara", lastName: "Ben Ali", role: "DOCTOR",
    phoneNumber: "+21612000003", isActive: true,
  }});

  const nurse = await prisma.user.create({ data: {
    email: "nurse@medifollow.health", passwordHash: pw,
    firstName: "Amira", lastName: "Trabelsi", role: "NURSE",
    phoneNumber: "+21612000004", isActive: true,
  }});

  const coordinator = await prisma.user.create({ data: {
    email: "coordinator@medifollow.health", passwordHash: pw,
    firstName: "Yassine", lastName: "Bouazizi", role: "COORDINATOR",
    phoneNumber: "+21612000005", isActive: true,
  }});

  const auditor = await prisma.user.create({ data: {
    email: "auditor@medifollow.health", passwordHash: pw,
    firstName: "Nadia", lastName: "Khelifi", role: "AUDITOR",
    phoneNumber: "+21612000006", isActive: true,
  }});

  // Patient users
  const patientUsers = [];
  const patientData = [
    { email: "patient1@medifollow.health", first: "Ahmed", last: "Mansouri" },
    { email: "patient2@medifollow.health", first: "Fatma", last: "Jaziri" },
    { email: "patient3@medifollow.health", first: "Mohamed", last: "Saidi" },
    { email: "patient4@medifollow.health", first: "Ines", last: "Chaabane" },
    { email: "patient5@medifollow.health", first: "Karim", last: "Belhaj" },
  ];
  for (const pd of patientData) {
    const u = await prisma.user.create({ data: {
      email: pd.email, passwordHash: pw,
      firstName: pd.first, lastName: pd.last, role: "PATIENT",
      phoneNumber: "+2161200" + String(Math.floor(Math.random()*9000)+1000),
      isActive: true,
    }});
    patientUsers.push(u);
  }

  // ══════════════ PROFILES ══════════════
  console.log("🏥 Creating profiles...");

  await prisma.doctorProfile.create({ data: {
    userId: doctor.id, specialty: "CARDIOLOGY",
    bio: "Cardiologue spécialisé en insuffisance cardiaque et hypertension.",
    phone: "+21612000002", location: "Tunis, Tunisie",
    experiences: [{ title: "Chef de service Cardiologie", institution: "Hôpital Charles Nicolle", startDate: new Date("2018-01-01").toISOString(), endDate: new Date("2026-01-01").toISOString(), description: "Prise en charge des patients cardiaques" }],
  }});

  await prisma.doctorProfile.create({ data: {
    userId: doctor2.id, specialty: "PNEUMOLOGY",
    bio: "Pneumologue expérimentée en maladies respiratoires chroniques.",
    phone: "+21612000003", location: "Sfax, Tunisie",
  }});

  await prisma.nurseProfile.create({ data: {
    userId: nurse.id, department: "Cardiologie", shift: "morning", phone: "+21612000004",
  }});

  await prisma.coordinatorProfile.create({ data: {
    userId: coordinator.id, department: "Coordination des soins", phone: "+21612000005",
  }});

  // ══════════════ PATIENTS ══════════════
  console.log("🩺 Creating patient records...");

  const bloodTypes = ["A_POSITIVE","O_POSITIVE","B_POSITIVE","AB_POSITIVE","O_NEGATIVE"];
  const genders = ["MALE","FEMALE","MALE","FEMALE","MALE"];
  const specialties = ["CARDIOLOGY","CARDIOLOGY","CARDIOLOGY","PNEUMOLOGY","CARDIOLOGY"];
  const diagnoses = [
    "Hypertension artérielle sévère",
    "Insuffisance cardiaque chronique",
    "Arythmie ventriculaire",
    "Asthme chronique sévère",
    "Angine de poitrine stable",
  ];

  const patients = [];
  for (let i = 0; i < patientUsers.length; i++) {
    const p = await prisma.patient.create({ data: {
      userId: patientUsers[i].id,
      medicalRecordNumber: `MRN-2026-${String(i+1).padStart(3,"0")}`,
      dateOfBirth: new Date(1975 + i*5, i*2, 10 + i*3),
      gender: genders[i],
      bloodType: bloodTypes[i],
      address: { set: { street: `${10+i*5} Rue de la Santé`, city: i < 3 ? "Tunis" : "Sfax", state: "Tunisie", postalCode: String(1000 + i*100), country: "Tunisie" } },
      emergencyContact: { set: { name: `Contact Urgence ${patientData[i].last}`, relationship: "Famille", phoneNumber: "+21698000" + i } },
      diagnosis: diagnoses[i],
      medicalProfile: { set: {
        hospital: "Hôpital Charles Nicolle",
        department: specialties[i] === "CARDIOLOGY" ? "Cardiologie" : "Pneumologie",
        specialty: specialties[i],
        height: 160 + i * 5,
        weight: 65 + i * 8,
        medicalBackground: {
          diabetes: i === 0 || i === 4,
          hypertension: i < 3,
          cardiacDisease: i !== 3,
          asthmaOuBpco: i === 3,
          cancer: false, otherConditions: null,
        },
      }},
      medications: { set: [{ name: ["Lisinopril","Bisoprolol","Amiodarone","Ventoline","Amlodipine"][i], dosage: ["10mg","5mg","200mg","100mcg","5mg"][i], frequency: "1x/jour", startDate: new Date("2026-01-15") }] },
      vitalThresholds: { set: {
        systolicBP: { min: 90, max: 140 },
        diastolicBP: { min: 60, max: 90 },
        heartRate: { min: 55, max: 100 },
        temperature: { min: 36.0, max: 37.5 },
        oxygenSaturation: { min: 94, max: 100 },
        weight: { min: 60, max: 100 },
      }},
      isActive: true,
      questionnaireCompleted: true,
    }});
    patients.push(p);
  }

  // ══════════════ SERVICE ══════════════
  console.log("🏢 Creating services...");
  await prisma.service.create({ data: {
    serviceName: "cardio", description: "Service de Cardiologie",
    consultationFee: 80, averageDuration: 30, isActive: true,
    specializations: ["CARDIOLOGY"],
    patientIds: [patientUsers[0].id, patientUsers[1].id, patientUsers[2].id, patientUsers[4].id],
    teamIds: [doctor.id],
  }});
  await prisma.service.create({ data: {
    serviceName: "pneumo", description: "Service de Pneumologie",
    consultationFee: 75, averageDuration: 25, isActive: true,
    specializations: ["PNEUMOLOGY"],
    patientIds: [patientUsers[3].id],
    teamIds: [doctor2.id],
  }});

  // ══════════════ ACCESS GRANTS ══════════════
  console.log("🔐 Creating access grants...");
  for (let i = 0; i < patients.length; i++) {
    const docId = specialties[i] === "CARDIOLOGY" ? doctor.id : doctor2.id;
    await prisma.accessGrant.create({ data: {
      patientId: patientUsers[i].id, doctorId: docId,
      durationDays: 365, isActive: true,
      expiresAt: new Date("2027-05-13"),
    }});
  }

  // ══════════════ NURSE ASSIGNMENTS ══════════════
  console.log("👩‍⚕️ Creating nurse assignments...");
  for (const p of patients) {
    await prisma.nurseAssignment.create({ data: {
      nurseId: nurse.id, patientId: p.userId, isActive: true, assignedBy: admin.id,
    }});
  }

  // ══════════════ VITAL RECORDS ══════════════
  console.log("📊 Creating vital records (14 days of data)...");
  const now = new Date();
  let totalVitals = 0;

  for (let pi = 0; pi < patients.length; pi++) {
    const baseSys = [135, 125, 130, 115, 128][pi];
    const baseDia = [82, 78, 85, 72, 80][pi];
    const baseHR  = [78, 72, 88, 75, 74][pi];

    for (let d = 13; d >= 0; d--) {
      const dt = new Date(now); dt.setDate(dt.getDate() - d); dt.setHours(8 + pi, 0, 0, 0);
      await prisma.vitalRecord.create({ data: {
        patientId: patients[pi].id,
        systolicBP: baseSys + Math.floor(Math.random()*20) - 10,
        diastolicBP: baseDia + Math.floor(Math.random()*14) - 7,
        heartRate: baseHR + Math.floor(Math.random()*16) - 8,
        temperature: 36.4 + Math.random() * 0.8,
        oxygenSaturation: 95 + Math.floor(Math.random()*5),
        weight: (65 + pi*8) + Math.random()*2 - 1,
        recordedAt: dt,
      }});
      totalVitals++;
    }
    // Extra afternoon reading
    const afternoon = new Date(now); afternoon.setHours(16, 0, 0, 0);
    await prisma.vitalRecord.create({ data: {
      patientId: patients[pi].id,
      systolicBP: baseSys + Math.floor(Math.random()*10),
      diastolicBP: baseDia + Math.floor(Math.random()*8),
      heartRate: baseHR + Math.floor(Math.random()*10),
      temperature: 36.5 + Math.random()*0.6,
      oxygenSaturation: 96 + Math.floor(Math.random()*4),
      weight: (65 + pi*8) + Math.random(),
      recordedAt: afternoon,
      notes: "Mesure de l'après-midi",
    }});
    totalVitals++;
  }

  // Critical vital for patient 1 (today)
  await prisma.vitalRecord.create({ data: {
    patientId: patients[0].id,
    systolicBP: 178, diastolicBP: 105, heartRate: 112,
    temperature: 37.2, oxygenSaturation: 94, weight: 66,
    notes: "Patient se plaint de maux de tête et vertiges",
    recordedAt: new Date(),
  }});
  totalVitals++;

  // ══════════════ ALERTS ══════════════
  console.log("🚨 Creating alerts...");

  // CRITICAL - Patient 1 today
  await prisma.alert.create({ data: {
    patientId: patients[0].id, alertType: "VITAL", severity: "CRITICAL", status: "OPEN",
    message: "⚠️ Pression systolique critique: 178 mmHg (seuil max: 140)",
    data: { vitalType: "systolicBP", value: 178, threshold: { min: 90, max: 140 } },
  }});
  await prisma.alert.create({ data: {
    patientId: patients[0].id, alertType: "VITAL", severity: "CRITICAL", status: "OPEN",
    message: "⚠️ Fréquence cardiaque critique: 112 bpm (seuil max: 100)",
    data: { vitalType: "heartRate", value: 112, threshold: { min: 55, max: 100 } },
  }});

  // HIGH - Patient 2
  await prisma.alert.create({ data: {
    patientId: patients[1].id, alertType: "VITAL", severity: "HIGH", status: "OPEN",
    message: "Pression diastolique élevée: 95 mmHg (seuil max: 90)",
    data: { vitalType: "diastolicBP", value: 95, threshold: { min: 60, max: 90 } },
  }});

  // MEDIUM - acknowledged
  await prisma.alert.create({ data: {
    patientId: patients[2].id, alertType: "VITAL", severity: "MEDIUM", status: "ACKNOWLEDGED",
    message: "Rythme cardiaque irrégulier détecté: 105 bpm",
    data: { vitalType: "heartRate", value: 105, threshold: { min: 55, max: 100 } },
    acknowledgedById: doctor.id,
    acknowledgedAt: new Date(Date.now() - 3 * 3600000),
  }});

  // RESOLVED alerts
  const twoDaysAgo = new Date(Date.now() - 48*3600000);
  const oneDayAgo  = new Date(Date.now() - 24*3600000);
  await prisma.alert.create({ data: {
    patientId: patients[4].id, alertType: "VITAL", severity: "HIGH", status: "RESOLVED",
    message: "Tension artérielle élevée: 155/95 mmHg",
    data: { vitalType: "systolicBP", value: 155 },
    acknowledgedById: doctor.id, acknowledgedAt: twoDaysAgo,
    resolvedById: doctor.id, resolvedAt: oneDayAgo,
    resolution: "Traitement ajusté. Augmentation Amlodipine à 10mg. Contrôle dans 48h.",
  }});
  await prisma.alert.create({ data: {
    patientId: patients[0].id, alertType: "VITAL", severity: "CRITICAL", status: "RESOLVED",
    message: "Pic hypertensif: 170/100 mmHg il y a 5 jours",
    data: { vitalType: "systolicBP", value: 170 },
    acknowledgedById: doctor.id, acknowledgedAt: new Date(Date.now() - 5*86400000),
    resolvedById: doctor.id, resolvedAt: new Date(Date.now() - 4*86400000),
    resolution: "Patient hospitalisé, perfusion de Nicardipine. Stabilisation obtenue en 6h.",
  }});

  // ══════════════ SYMPTOMS ══════════════
  console.log("💊 Creating symptoms...");
  const symptoms = [
    { pid: 0, type: "Céphalées", sev: "SEVERE", desc: "Maux de tête violents, pulsatiles, depuis ce matin" },
    { pid: 0, type: "Vertiges", sev: "MODERATE", desc: "Vertiges en position debout, sensation de malaise" },
    { pid: 1, type: "Dyspnée", sev: "MODERATE", desc: "Essoufflement au moindre effort, montée d'escaliers difficile" },
    { pid: 2, type: "Palpitations", sev: "MILD", desc: "Palpitations intermittentes, surtout le soir" },
    { pid: 3, type: "Toux", sev: "MODERATE", desc: "Toux persistante sèche, aggravée la nuit" },
    { pid: 4, type: "Douleur thoracique", sev: "MODERATE", desc: "Douleur thoracique légère à l'effort, disparaît au repos" },
  ];
  for (const s of symptoms) {
    await prisma.symptom.create({ data: {
      patientId: patients[s.pid].id,
      symptomType: s.type, severity: s.sev, description: s.desc,
      occurredAt: new Date(Date.now() - Math.random()*86400000*3),
    }});
  }

  // ══════════════ AUDIT LOGS ══════════════
  console.log("📝 Creating audit logs...");
  const auditActions = [
    { userId: doctor.id, action: "LOGIN", entityType: "User", ts: new Date(Date.now() - 7200000) },
    { userId: doctor.id, action: "VIEW_PATIENT", entityType: "Patient", ts: new Date(Date.now() - 6000000) },
    { userId: doctor.id, action: "ACKNOWLEDGE_ALERT", entityType: "Alert", ts: new Date(Date.now() - 5000000) },
    { userId: doctor.id, action: "RESOLVE_ALERT", entityType: "Alert", ts: new Date(Date.now() - 4000000) },
    { userId: nurse.id, action: "CREATE_VITAL_RECORD", entityType: "VitalRecord", ts: new Date(Date.now() - 3600000) },
    { userId: admin.id, action: "ACTIVATE_PATIENT", entityType: "Patient", ts: new Date(Date.now() - 86400000) },
    { userId: auditor.id, action: "AUDIT_CHECK", entityType: "BlockchainProof", ts: new Date(Date.now() - 1800000) },
    { userId: coordinator.id, action: "SEND_COMMUNICATION", entityType: "PatientCommunication", ts: new Date(Date.now() - 900000) },
  ];
  for (const a of auditActions) {
    await prisma.auditLog.create({ data: {
      userId: a.userId, action: a.action, entityType: a.entityType,
      ipAddress: "192.168.1." + Math.floor(Math.random()*254 + 1),
      userAgent: "Mozilla/5.0 MediFollow/2.0",
      timestamp: a.ts,
    }});
  }

  // ══════════════ BLOCKCHAIN PROOFS ══════════════
  console.log("⛓️ Creating blockchain proofs...");
  const someVitals = await prisma.vitalRecord.findMany({ take: 3, select: { id: true } });
  const someAudits = await prisma.auditLog.findMany({ take: 3, select: { id: true } });
  if (someVitals.length >= 3 && someAudits.length >= 3) {
    await prisma.blockchainProof.create({ data: {
      dataHash: "0xabc123" + Math.random().toString(16).slice(2, 18),
      txHash: "0x" + [...Array(64)].map(() => Math.floor(Math.random()*16).toString(16)).join(""),
      blockchainNetwork: "aptos-testnet", blockNumber: 58234190,
      status: "CONFIRMED", timestamp: new Date(Date.now() - 86400000),
      vitalRecordId: someVitals[0].id, auditLogId: someAudits[0].id,
    }});
    await prisma.blockchainProof.create({ data: {
      dataHash: "0xdef456" + Math.random().toString(16).slice(2, 18),
      txHash: "0x" + [...Array(64)].map(() => Math.floor(Math.random()*16).toString(16)).join(""),
      blockchainNetwork: "aptos-testnet", blockNumber: 58234250,
      status: "CONFIRMED", timestamp: new Date(Date.now() - 43200000),
      vitalRecordId: someVitals[1].id, auditLogId: someAudits[1].id,
    }});
    await prisma.blockchainProof.create({ data: {
      dataHash: "0x789abc" + Math.random().toString(16).slice(2, 18),
      txHash: "0x" + [...Array(64)].map(() => Math.floor(Math.random()*16).toString(16)).join(""),
      blockchainNetwork: "aptos-testnet",
      status: "PENDING", timestamp: new Date(),
      vitalRecordId: someVitals[2].id, auditLogId: someAudits[2].id,
    }});
  }

  // ══════════════ COMMUNICATIONS ══════════════
  console.log("💬 Creating patient communications...");
  await prisma.patientCommunication.create({ data: {
    patientId: patientUsers[0].id, coordinatorId: coordinator.id,
    type: "REMINDER", subject: "Rappel de rendez-vous",
    message: "Bonjour M. Mansouri, rappel de votre consultation cardiologie demain à 9h.",
    isRead: true, readAt: new Date(Date.now() - 3600000),
  }});
  await prisma.patientCommunication.create({ data: {
    patientId: patientUsers[1].id, coordinatorId: coordinator.id,
    type: "FOLLOW_UP", subject: "Suivi post-consultation",
    message: "Mme Jaziri, veuillez nous confirmer que vous avez bien reçu votre nouveau traitement.",
    isRead: false,
  }});
  await prisma.patientCommunication.create({ data: {
    patientId: patientUsers[2].id, coordinatorId: coordinator.id,
    type: "GUIDANCE", subject: "Instructions de suivi",
    message: "M. Saidi, merci de mesurer votre tension 2x/jour et de noter les valeurs.",
    isRead: true, readAt: new Date(Date.now() - 7200000),
  }});

  // ══════════════ SUMMARY ══════════════
  console.log("\n" + "═".repeat(60));
  console.log("✅ BASE DE DONNÉES REMPLIE AVEC SUCCÈS !");
  console.log("═".repeat(60));
  console.log("\n📋 COMPTES DE TEST (mot de passe: Test@123456)");
  console.log("┌──────────────┬──────────────────────────────────────┐");
  console.log("│ Rôle         │ Email                                │");
  console.log("├──────────────┼──────────────────────────────────────┤");
  console.log("│ 🔴 ADMIN     │ admin@medifollow.health               │");
  console.log("│ 👨‍⚕️ DOCTOR    │ doctor@medifollow.health              │");
  console.log("│ 👨‍⚕️ DOCTOR 2  │ doctor2@medifollow.health             │");
  console.log("│ 👩‍⚕️ NURSE     │ nurse@medifollow.health               │");
  console.log("│ 📋 COORD     │ coordinator@medifollow.health         │");
  console.log("│ 🕵️ AUDITOR   │ auditor@medifollow.health             │");
  console.log("│ 🏥 PATIENT 1 │ patient1@medifollow.health            │");
  console.log("│ 🏥 PATIENT 2 │ patient2@medifollow.health            │");
  console.log("│ 🏥 PATIENT 3 │ patient3@medifollow.health            │");
  console.log("│ 🏥 PATIENT 4 │ patient4@medifollow.health            │");
  console.log("│ 🏥 PATIENT 5 │ patient5@medifollow.health            │");
  console.log("└──────────────┴──────────────────────────────────────┘");
  console.log(`\n📊 Données créées:`);
  console.log(`  • 11 utilisateurs (6 rôles)`);
  console.log(`  • 5 patients avec dossiers médicaux complets`);
  console.log(`  • ${totalVitals} enregistrements de signes vitaux (14 jours)`);
  console.log(`  • 6 alertes (2 CRITICAL, 1 HIGH, 1 MEDIUM, 2 RESOLVED)`);
  console.log(`  • 6 symptômes`);
  console.log(`  • 8 logs d'audit`);
  console.log(`  • 3 preuves blockchain`);
  console.log(`  • 3 communications patient-coordinateur`);
  console.log(`  • 2 services (Cardio + Pneumo)`);
  console.log(`  • 5 access grants + 5 nurse assignments`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => { console.error("❌ ERREUR:", e); prisma.$disconnect(); process.exit(1); });
