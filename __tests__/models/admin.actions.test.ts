import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  getUserServiceAssignments,
  getAllNurses,
  createNurse,
  updateNurse,
  deleteNurse,
  getAllCoordinators,
  createCoordinator,
  updateCoordinator,
  deleteCoordinator,
  assignPatientToNurse,
  unassignPatientFromNurse,
  getNurseAssignments,
  getPendingPatients,
  approvePatient,
  banPatient,
  getAdminNotifications,
  markNotificationAsRead,
  assignPatientToDoctor,
  getPatientDoctorAssignments,
  updatePatientPlacement,
  getUserPlacementDetails,
  updateDoctorPlacement,
  getActiveDoctors,
  getAssignedDoctorForPatient,
  calculatePatientRiskScore,
  getGlobalHospitalRisk,
  predictPatientAlerts,
  getAllPredictiveAlerts,
  generatePatientRecommendations,
  getAllAIRecommendations,
  predictPatientCompliance,
  detectAnomalies,
} from "@/lib/actions/admin.actions";
import prisma from "@/lib/prisma";

// Mock Prisma
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
    },
    service: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    nurseProfile: {
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
    nurseAssignment: {
      count: jest.fn(),
      create: jest.fn(),
      updateMany: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    coordinatorProfile: {
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
    doctorProfile: {
      upsert: jest.fn(),
    },
    patient: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    alert: {
      count: jest.fn(),
    },
    questionnaireResponse: {
      findMany: jest.fn(),
    },
    notification: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
    accessGrant: {
      upsert: jest.fn(),
      updateMany: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(prisma)),
  },
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(() => Promise.resolve("hashed-password")),
}));

jest.mock("@/lib/pusher", () => ({
  pusherServer: {
    trigger: jest.fn().mockResolvedValue(null),
  },
}));

jest.mock("@/lib/actions/notification.actions", () => ({
  sendDoctorCredentialsEmail: jest.fn(),
  sendStaffCredentialsEmail: jest.fn(() => Promise.resolve({ success: true })),
  sendPatientApprovalEmail: jest.fn(),
  sendPatientBannedEmail: jest.fn(),
}));

describe("Admin Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("should fetch all users with profiles", async () => {
      const mockUsers = [
        {
          id: "1",
          email: "user1@test.com",
          firstName: "John",
          lastName: "Doe",
          role: "PATIENT",
          isActive: true,
          doctorProfile: null,
          nurseProfile: null,
        },
      ];

      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

      const result = await getAllUsers();

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        include: {
          doctorProfile: true,
          nurseProfile: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      expect(result).toEqual(mockUsers);
    });

    it("should return empty array on error", async () => {
      (prisma.user.findMany as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      const result = await getAllUsers();

      expect(result).toEqual([]);
    });
  });

  describe("getUserById", () => {
    it("should fetch user with profiles by ID", async () => {
      const mockUser = {
        id: "1",
        email: "doctor@test.com",
        firstName: "Jane",
        lastName: "Smith",
        role: "DOCTOR",
        isActive: true,
        doctorProfile: { specialty: "Cardiology" },
        nurseProfile: null,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await getUserById("1");

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
        include: {
          doctorProfile: true,
          nurseProfile: true,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it("should return null if user not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getUserById("invalid-id");

      expect(result).toBeNull();
    });
  });

  describe("updateUser", () => {
    it("should update user successfully", async () => {
      const mockUpdatedUser = {
        id: "1",
        email: "updated@test.com",
        firstName: "Updated",
        lastName: "User",
        role: "DOCTOR",
        isActive: true,
        phoneNumber: "123456789",
      };

      (prisma.user.update as jest.Mock).mockResolvedValue(mockUpdatedUser);

      const result = await updateUser("1", {
        firstName: "Updated",
        lastName: "User",
        email: "updated@test.com",
        role: "DOCTOR",
        isActive: true,
        phoneNumber: "123456789",
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUpdatedUser);
    });

    it("should return error on update failure", async () => {
      (prisma.user.update as jest.Mock).mockRejectedValue(
        new Error("Update failed")
      );

      const result = await updateUser("1", {
        firstName: "Test",
        lastName: "User",
        email: "test@test.com",
        role: "PATIENT",
        isActive: true,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("getUserServiceAssignments", () => {
    it("should get services where user is assigned", async () => {
      const mockServices = [
        {
          id: "service1",
          serviceName: "Cardiology",
          specializations: ["Cardiology"],
        },
      ];

      (prisma.service.findMany as jest.Mock).mockResolvedValue(mockServices);

      const result = await getUserServiceAssignments("user-id");

      expect(result.success).toBe(true);
      expect(result.services).toEqual(mockServices);
    });

    it("should return error on failure", async () => {
      (prisma.service.findMany as jest.Mock).mockRejectedValue(
        new Error("Query failed")
      );

      const result = await getUserServiceAssignments("user-id");

      expect(result.success).toBe(false);
      expect(result.services).toEqual([]);
    });
  });

  describe("Nurse management", () => {
    it("should fetch all nurses", async () => {
      const mockNurses = [
        {
          id: "n1",
          firstName: "Nurse",
          lastName: "One",
          role: "NURSE",
          nurseProfile: { id: "np1", department: "Cardio" },
        },
      ];

      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockNurses);

      const result = await getAllNurses();

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: { role: "NURSE" },
        include: { nurseProfile: true },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual({ success: true, data: mockNurses });
    });

    it("should create a new nurse when email is available", async () => {
      const mockNurse = {
        id: "n1",
        email: "nurse@test.com",
        firstName: "Nurse",
        lastName: "Tester",
        role: "NURSE",
        isActive: true,
        phoneNumber: "1234567890",
        nurseProfile: { id: "np1", department: "Cardio", shift: "morning" },
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue(mockNurse);

      const result = await createNurse({
        email: "nurse@test.com",
        password: "password",
        firstName: "Nurse",
        lastName: "Tester",
        phoneNumber: "1234567890",
        department: "Cardio",
        shift: "morning",
      });

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: "nurse@test.com",
          passwordHash: "hashed-password",
          role: "NURSE",
          isActive: true,
          nurseProfile: expect.any(Object),
        }),
        include: { nurseProfile: true },
      });
      expect(result).toEqual({ success: true, data: mockNurse });
    });

    it("should update a nurse and its profile", async () => {
      const mockExistingNurse = {
        id: "n1",
        role: "NURSE",
        nurseProfile: { id: "np1" },
      };
      const mockUpdatedNurse = {
        id: "n1",
        firstName: "Updated",
        lastName: "Nurse",
        role: "NURSE",
        nurseProfile: { id: "np1" },
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockExistingNurse);
      (prisma.user.update as jest.Mock).mockResolvedValue(mockUpdatedNurse);
      (prisma.nurseProfile.update as jest.Mock).mockResolvedValue({ id: "np1" });

      const result = await updateNurse("n1", {
        firstName: "Updated",
        department: "ER",
        phoneNumber: "9876543210",
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "n1", role: "NURSE" },
        include: { nurseProfile: true },
      });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "n1" },
        data: expect.objectContaining({
          firstName: "Updated",
          phoneNumber: "9876543210",
        }),
        include: { nurseProfile: true },
      });
      expect(prisma.nurseProfile.update).toHaveBeenCalledWith({
        where: { id: "np1" },
        data: expect.objectContaining({ department: "ER", phone: "9876543210" }),
      });
      expect(result).toEqual({ success: true, data: mockUpdatedNurse });
    });

    it("should not delete a nurse with active assignments", async () => {
      (prisma.nurseAssignment.count as jest.Mock).mockResolvedValue(1);

      const result = await deleteNurse("n1");

      expect(prisma.nurseAssignment.count).toHaveBeenCalledWith({
        where: { nurseId: "n1", isActive: true },
      });
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/assignés/i);
    });
  });

  describe("Coordinator management", () => {
    it("should fetch all coordinators", async () => {
      const mockCoordinators = [
        { id: "c1", role: "COORDINATOR", coordinatorProfile: { id: "cp1" } },
      ];
      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockCoordinators);

      const result = await getAllCoordinators();

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: { role: "COORDINATOR" },
        include: { coordinatorProfile: true },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual({ success: true, data: mockCoordinators });
    });

    it("should create a new coordinator", async () => {
      const mockCoordinator = {
        id: "c1",
        email: "coord@test.com",
        firstName: "Coord",
        lastName: "Tester",
        role: "COORDINATOR",
        isActive: true,
        phoneNumber: "1234567890",
        coordinatorProfile: { id: "cp1", department: "Ops" },
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue(mockCoordinator);

      const result = await createCoordinator({
        email: "coord@test.com",
        password: "pass123",
        firstName: "Coord",
        lastName: "Tester",
        phoneNumber: "1234567890",
        department: "Ops",
      });

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: "coord@test.com",
          role: "COORDINATOR",
          passwordHash: "hashed-password",
          coordinatorProfile: expect.any(Object),
        }),
        include: { coordinatorProfile: true },
      });
      expect(result).toEqual({ success: true, data: mockCoordinator });
    });

    it("should update a coordinator and its profile", async () => {
      const mockExistingCoordinator = {
        id: "c1",
        role: "COORDINATOR",
        coordinatorProfile: { id: "cp1" },
      };
      const mockUpdatedCoordinator = {
        id: "c1",
        firstName: "Updated",
        role: "COORDINATOR",
        coordinatorProfile: { id: "cp1" },
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockExistingCoordinator);
      (prisma.user.update as jest.Mock).mockResolvedValue(mockUpdatedCoordinator);
      (prisma.coordinatorProfile.update as jest.Mock).mockResolvedValue({ id: "cp1" });

      const result = await updateCoordinator("c1", {
        firstName: "Updated",
        department: "Operations",
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "c1", role: "COORDINATOR" },
        include: { coordinatorProfile: true },
      });
      expect(prisma.coordinatorProfile.update).toHaveBeenCalledWith({
        where: { id: "cp1" },
        data: expect.objectContaining({ department: "Operations" }),
      });
      expect(result).toEqual({ success: true, data: mockUpdatedCoordinator });
    });

    it("should delete a coordinator", async () => {
      (prisma.coordinatorProfile.deleteMany as jest.Mock).mockResolvedValue({});
      (prisma.user.delete as jest.Mock).mockResolvedValue({ id: "c1" });

      const result = await deleteCoordinator("c1");

      expect(prisma.coordinatorProfile.deleteMany).toHaveBeenCalledWith({
        where: { userId: "c1" },
      });
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: "c1" } });
      expect(result).toEqual({ success: true });
    });
  });

  describe("Patient assignment", () => {
    it("should assign a patient to a nurse", async () => {
      const mockAssignment = {
        id: "a1",
        patient: { id: "p1", user: { id: "u1" } },
        nurse: { id: "n1" },
      };

      (prisma.nurseAssignment.create as jest.Mock).mockResolvedValue(mockAssignment);

      const result = await assignPatientToNurse("p1", "n1", "admin-1");

      expect(prisma.nurseAssignment.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ patientId: "p1", nurseId: "n1", assignedBy: "admin-1", isActive: true }),
        include: expect.any(Object),
      }));
      expect(result).toEqual({ success: true, data: mockAssignment });
    });

    it("should return error when patient is already assigned", async () => {
      const duplicateError: any = new Error("Unique constraint failed");
      duplicateError.code = "P2002";
      (prisma.nurseAssignment.create as jest.Mock).mockRejectedValue(duplicateError);

      const result = await assignPatientToNurse("p1", "n1", "admin-1");

      expect(result.success).toBe(false);
      expect(result.error).toMatch(/déjà assigné/i);
    });

    it("should unassign a patient from a nurse", async () => {
      (prisma.nurseAssignment.updateMany as jest.Mock).mockResolvedValue({});

      const result = await unassignPatientFromNurse("p1", "n1");

      expect(prisma.nurseAssignment.updateMany).toHaveBeenCalledWith({
        where: { patientId: "p1", nurseId: "n1" },
        data: { isActive: false },
      });
      expect(result).toEqual({ success: true });
    });

    it("should fetch nurse assignments", async () => {
      const mockAssignments = [
        { id: "a1", patient: { id: "p1", user: { id: "u1" } } },
      ];
      (prisma.nurseAssignment.findMany as jest.Mock).mockResolvedValue(mockAssignments);

      const result = await getNurseAssignments("n1");

      expect(prisma.nurseAssignment.findMany).toHaveBeenCalledWith({
        where: { nurseId: "n1", isActive: true },
        include: { patient: { include: { user: true } } },
        orderBy: { assignedAt: "desc" },
      });
      expect(result).toEqual({ success: true, data: mockAssignments });
    });
  });

  describe("Patient approval workflow", () => {
    it("should return pending patients", async () => {
      const mockPendingPatients = [{ id: "p1", isActive: false }];
      (prisma.patient.findMany as jest.Mock).mockResolvedValue(mockPendingPatients);

      const result = await getPendingPatients();

      expect(prisma.patient.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { isActive: false } }));
      expect(result).toEqual(mockPendingPatients);
    });

    it("should approve a patient and send email", async () => {
      const mockPatient = {
        id: "p1",
        userId: "u1",
        user: { id: "u1", email: "patient@test.com", firstName: "Patient" },
      };
      (prisma.patient.update as jest.Mock).mockResolvedValue(mockPatient);
      (prisma.user.update as jest.Mock).mockResolvedValue({ id: "u1", isActive: true });
      const result = await approvePatient("p1");

      expect(prisma.patient.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "p1" }, data: { isActive: true } }));
      expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: "u1" }, data: { isActive: true } });
      expect(result).toEqual({ success: true, patient: mockPatient });
    });

    it("should ban a patient and send email", async () => {
      const mockPatient = {
        id: "p1",
        userId: "u1",
        user: { id: "u1", email: "patient@test.com", firstName: "Patient" },
      };
      (prisma.patient.update as jest.Mock).mockResolvedValue(mockPatient);
      (prisma.user.update as jest.Mock).mockResolvedValue({ id: "u1", isActive: false });

      const result = await banPatient("p1");

      expect(prisma.patient.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "p1" }, data: { isActive: false } }));
      expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: "u1" }, data: { isActive: false } });
      expect(result).toEqual({ success: true, patient: mockPatient });
    });
  });

  describe("Admin notifications", () => {
    it("should fetch admin notifications", async () => {
      const mockNotifications = [{ id: "n1", recipientId: "admin-1" }];
      (prisma.notification.findMany as jest.Mock).mockResolvedValue(mockNotifications);

      const result = await getAdminNotifications("admin-1");

      expect(prisma.notification.findMany).toHaveBeenCalledWith({
        where: { recipientId: "admin-1" },
        orderBy: { createdAt: "desc" },
        take: 100,
      });
      expect(result).toEqual({ success: true, data: mockNotifications });
    });

    it("should mark a notification as read", async () => {
      const mockNotification = { id: "n1", isRead: true };
      (prisma.notification.update as jest.Mock).mockResolvedValue(mockNotification);

      const result = await markNotificationAsRead("n1");

      expect(prisma.notification.update).toHaveBeenCalledWith({
        where: { id: "n1" },
        data: expect.objectContaining({ isRead: true, readAt: expect.any(Date) }),
      });
      expect(result).toEqual({ success: true, data: mockNotification });
    });
  });

  describe("Doctor-patient assignment", () => {
    it("should assign a patient to a doctor", async () => {
      (prisma.accessGrant.upsert as jest.Mock).mockResolvedValue({});
      (prisma.accessGrant.updateMany as jest.Mock).mockResolvedValue({});

      const result = await assignPatientToDoctor("p1", "d1");

      expect(prisma.accessGrant.upsert).toHaveBeenCalledWith({
        where: { patientId_doctorId: { patientId: "p1", doctorId: "d1" } },
        update: { isActive: true },
        create: expect.objectContaining({ patientId: "p1", doctorId: "d1", isActive: true }),
      });
      expect(result).toEqual({ success: true });
    });

    it("should unassign a patient from doctor when doctorId is null", async () => {
      (prisma.accessGrant.upsert as jest.Mock).mockResolvedValue({});

      const result = await assignPatientToDoctor("p1", null);

      expect(prisma.accessGrant.upsert).not.toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });

    it("should fetch patient doctor assignments", async () => {
      const mockGrants = [
        { patientId: "p1", doctorId: "d1", grantedAt: new Date() },
        { patientId: "p2", doctorId: "d2", grantedAt: new Date() }
      ];
      (prisma.accessGrant.findMany as jest.Mock).mockResolvedValue(mockGrants);

      const result = await getPatientDoctorAssignments();

      expect(prisma.accessGrant.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        select: {
          patientId: true,
          doctorId: true,
          grantedAt: true,
        },
        orderBy: { grantedAt: "desc" },
      });
      expect(result).toEqual({
        success: true,
        assignments: [
          { patientId: "p1", doctorId: "d1" },
          { patientId: "p2", doctorId: "d2" }
        ],
      });
    });

    it("should update patient placement", async () => {
      const mockServices = [
        { id: "s1", patientIds: [], teamIds: [] },
        { id: "s2", patientIds: [], teamIds: [] }
      ];
      (prisma.service.findMany as jest.Mock).mockResolvedValue(mockServices);
      (prisma.service.update as jest.Mock).mockResolvedValue({});
      (prisma.accessGrant.upsert as jest.Mock).mockResolvedValue({});
      (prisma.accessGrant.updateMany as jest.Mock).mockResolvedValue({});

      const result = await updatePatientPlacement("p1", "s1", "d1");

      expect(prisma.service.findMany).toHaveBeenCalled();
      expect(prisma.service.update).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });

    it("should get user placement details", async () => {
      const mockUser = { id: "u1", role: "PATIENT", doctorProfile: null };
      const mockServices = [{ id: "s1", patientIds: ["u1"], serviceName: "Cardiology" }];
      const mockGrant = { doctorId: "d1" };
      const mockDoctor = { id: "d1", firstName: "Dr", lastName: "Smith", email: "dr@example.com" };

      (prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockDoctor);
      (prisma.service.findMany as jest.Mock).mockResolvedValue(mockServices);
      (prisma.accessGrant.findFirst as jest.Mock).mockResolvedValue(mockGrant);

      const result = await getUserPlacementDetails("u1");

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "u1" },
        include: { doctorProfile: true },
      });
      expect(result.success).toBe(true);
      expect(result.data?.service?.serviceName).toBe("Cardiology");
    });

    it("should update doctor placement", async () => {
      const mockServices = [
        { id: "s1", teamIds: [], specializations: [] },
        { id: "s2", teamIds: [], specializations: [] }
      ];
      (prisma.service.findMany as jest.Mock).mockResolvedValue(mockServices);
      (prisma.service.update as jest.Mock).mockResolvedValue({});
      (prisma.doctorProfile.upsert as jest.Mock).mockResolvedValue({});

      const result = await updateDoctorPlacement("d1", "s1", "Cardiology");

      expect(prisma.service.findMany).toHaveBeenCalled();
      expect(prisma.service.update).toHaveBeenCalled();
      expect(prisma.doctorProfile.upsert).toHaveBeenCalledWith({
        where: { userId: "d1" },
        update: { specialty: "Cardiology" },
        create: expect.objectContaining({ userId: "d1", specialty: "Cardiology" }),
      });
      expect(result).toEqual({ success: true });
    });

    it("should get active doctors", async () => {
      const mockDoctors = [
        { id: "d1", firstName: "Dr", lastName: "Smith", email: "dr@example.com" }
      ];
      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockDoctors);

      const result = await getActiveDoctors();

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: { role: "DOCTOR", isActive: true },
        select: { id: true, firstName: true, lastName: true, email: true },
      });
      expect(result).toEqual({ success: true, data: mockDoctors });
    });

    it("should get assigned doctor for patient", async () => {
      const mockGrant = { doctorId: "d1" };
      (prisma.accessGrant.findFirst as jest.Mock).mockResolvedValue(mockGrant);

      const result = await getAssignedDoctorForPatient("p1");

      expect(prisma.accessGrant.findFirst).toHaveBeenCalledWith({
        where: { patientId: "p1", isActive: true },
      });
      expect(result).toEqual({ success: true, data: "d1" });
    });
  });

  describe("Risk and predictive analytics", () => {
    it("should calculate patient risk score", async () => {
      const mockPatient = {
        id: "p1",
        user: { firstName: "John", lastName: "Doe" },
        questionnaireAssignments: [{
          responses: [{
            answer: "8",
            createdAt: new Date(),
            question: { questionType: "SCALE", questionText: "Pain level" }
          }]
        }]
      };
      const mockAlerts = [];
      (prisma.patient.findUnique as jest.Mock).mockResolvedValue(mockPatient);
      (prisma.alert.count as jest.Mock).mockResolvedValue(2);

      const result = await calculatePatientRiskScore("p1");

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty("riskScore");
      expect(result.data).toHaveProperty("riskLevel");
      expect(result.data).toHaveProperty("patientName", "John Doe");
    });

    it("should get global hospital risk", async () => {
      const mockPatients = [
        { id: "p1", user: { firstName: "John", lastName: "Doe" }, questionnaireAssignments: [] },
        { id: "p2", user: { firstName: "Jane", lastName: "Smith" }, questionnaireAssignments: [] }
      ];
      (prisma.patient.findMany as jest.Mock).mockResolvedValue(mockPatients);
      (prisma.patient.findUnique as jest.Mock).mockResolvedValue({
        id: "p1",
        user: { firstName: "John", lastName: "Doe" },
        questionnaireAssignments: []
      });
      (prisma.alert.count as jest.Mock).mockResolvedValue(0);

      const result = await getGlobalHospitalRisk();

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty("totalPatients", 2);
      expect(result.data).toHaveProperty("averageRiskScore");
      expect(result.data).toHaveProperty("topRiskPatients");
    });

    it("should predict patient alerts", async () => {
      const mockPatient = {
        id: "p1",
        user: { firstName: "John", lastName: "Doe" },
        questionnaireAssignments: [{
          assignedAt: new Date(),
          responses: [{
            answer: "9",
            createdAt: new Date(),
            question: { questionType: "SCALE", questionText: "Pain level" }
          }]
        }]
      };
      (prisma.patient.findUnique as jest.Mock).mockResolvedValue(mockPatient);

      const result = await predictPatientAlerts("p1");

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty("patientId", "p1");
      expect(result.data).toHaveProperty("patientName", "John Doe");
      expect(result.data).toHaveProperty("predictions");
      expect(Array.isArray(result.data.predictions)).toBe(true);
    });

    it("should get all predictive alerts", async () => {
      const mockPatients = [
        { id: "p1", user: { firstName: "John", lastName: "Doe" } }
      ];
      (prisma.patient.findMany as jest.Mock).mockResolvedValue(mockPatients);
      (prisma.patient.findUnique as jest.Mock).mockResolvedValue({
        id: "p1",
        user: { firstName: "John", lastName: "Doe" },
        questionnaireAssignments: []
      });

      const result = await getAllPredictiveAlerts();

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty("totalPredictions");
      expect(result.data).toHaveProperty("highProbabilityPredictions");
      expect(result.data).toHaveProperty("allPredictions");
      expect(result.data).toHaveProperty("lastUpdated");
    });

    it("should generate patient recommendations", async () => {
      const mockPatient = {
        id: "p1",
        user: { firstName: "John", lastName: "Doe" },
        questionnaireAssignments: []
      };
      (prisma.patient.findUnique as jest.Mock).mockResolvedValue(mockPatient);
      (prisma.alert.count as jest.Mock).mockResolvedValue(5);
      (prisma.nurseAssignment.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await generatePatientRecommendations("p1");

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty("patientId", "p1");
      expect(result.data).toHaveProperty("patientName", "John Doe");
      expect(result.data).toHaveProperty("recommendations");
      expect(Array.isArray(result.data.recommendations)).toBe(true);
    });

    it("should get all AI recommendations", async () => {
      const mockPatients = [
        { id: "p1", user: { firstName: "John", lastName: "Doe" } }
      ];
      (prisma.patient.findMany as jest.Mock).mockResolvedValue(mockPatients);
      (prisma.patient.findUnique as jest.Mock).mockResolvedValue({
        id: "p1",
        user: { firstName: "John", lastName: "Doe" },
        questionnaireAssignments: []
      });
      (prisma.alert.count as jest.Mock).mockResolvedValue(0);
      (prisma.nurseAssignment.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await getAllAIRecommendations();

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty("totalPatientsWithRecommendations");
      expect(result.data).toHaveProperty("urgentRecommendations");
      expect(result.data).toHaveProperty("allRecommendations");
      expect(result.data).toHaveProperty("lastUpdated");
    });

    it("should predict patient compliance", async () => {
      const mockPatient = {
        id: "p1",
        user: { firstName: "John", lastName: "Doe" },
        questionnaireAssignments: [
          { assignedAt: new Date(), completedAt: new Date() },
          { assignedAt: new Date(), completedAt: new Date() }
        ]
      };
      (prisma.patient.findUnique as jest.Mock).mockResolvedValue(mockPatient);

      const result = await predictPatientCompliance("p1");

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty("patientId", "p1");
      expect(result.data).toHaveProperty("patientName", "John Doe");
      expect(result.data).toHaveProperty("complianceScore");
      expect(result.data).toHaveProperty("riskLevel");
      expect(result.data).toHaveProperty("predictions");
    });

    it("should detect anomalies", async () => {
      const mockSubmissions = [];
      const mockSuspiciousResponses = [];
      const mockNurseActivities = [];

      (prisma.questionnaireResponse.findMany as jest.Mock)
        .mockResolvedValueOnce(mockSubmissions)
        .mockResolvedValueOnce(mockSuspiciousResponses);
      (prisma.nurseAssignment.findMany as jest.Mock).mockResolvedValue(mockNurseActivities);

      const result = await detectAnomalies();

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty("totalAnomalies");
      expect(result.data).toHaveProperty("anomalies");
      expect(result.data).toHaveProperty("lastScanned");
      expect(Array.isArray(result.data.anomalies)).toBe(true);
    });
  });

  describe("createUser", () => {
    it("should create a new staff user and send credentials email", async () => {
      const mockUser = {
        id: "1",
        email: "nurse@test.com",
        firstName: "Nurse",
        lastName: "Tester",
        role: "NURSE",
        isActive: true,
        phoneNumber: "1234567890",
      };

      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await createUser({
        email: "nurse@test.com",
        firstName: "Nurse",
        lastName: "Tester",
        role: "NURSE",
        isActive: true,
        phoneNumber: "1234567890",
      });

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: "nurse@test.com",
          firstName: "Nurse",
          lastName: "Tester",
          passwordHash: "hashed-password",
          role: "NURSE",
          isActive: true,
          phoneNumber: "1234567890",
        }),
      });
      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockUser);
      expect(result.emailSent).toBe(true);
    });

    it("should reject ADMIN user creation", async () => {
      const result = await createUser({
        email: "admin@test.com",
        role: "ADMIN",
        firstName: "Admin",
        lastName: "User",
      });

      expect(result.success).toBe(false);
      expect(result.error).toMatch(/not allowed/i);
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it("should return validation error when role or email is missing", async () => {
      const result = await createUser({ firstName: "NoRole" });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Role and email are required");
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe("deleteUser", () => {
    it("should delete user successfully", async () => {
      (prisma.user.delete as jest.Mock).mockResolvedValue({
        id: "1",
        email: "deleted@test.com",
      });

      const result = await deleteUser("1");

      expect(result.success).toBe(true);
    });

    it("should return error on delete failure", async () => {
      (prisma.user.delete as jest.Mock).mockRejectedValue(
        new Error("Delete failed")
      );

      const result = await deleteUser("1");

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});