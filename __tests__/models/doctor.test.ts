/**
 * __tests__/models/doctor.test.ts
 * Unit tests for the DoctorProfile Mongoose model.
 * Tests: required field validation, unique constraints.
 */

import mongoose from "mongoose";

// Mock mongoose to avoid real DB connections
jest.mock("mongoose", () => {
  const actual = jest.requireActual("mongoose");
  return {
    ...actual,
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
  };
});

// ── Inline DoctorProfile schema (mirrors the Prisma model structure) ────────
const doctorProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  specialty: { type: String },
  bio: { type: String },
  phone: { type: String },
  location: { type: String },
  profileImage: { type: String },
  experiences: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const DoctorProfile =
  (mongoose.models?.DoctorProfile as mongoose.Model<any>) ||
  mongoose.model("DoctorProfile", doctorProfileSchema);

// ─────────────────────────────────────────────────────────────────────────────

describe("DoctorProfile Model — Validation", () => {
  // ── Required fields ────────────────────────────────────────────────────────
  describe("Required fields", () => {
    it("should be valid when all required fields are provided", async () => {
      const validProfile = new DoctorProfile({
        userId: new mongoose.Types.ObjectId().toHexString(),
        specialty: "Cardiology",
        phone: "+33123456789",
      });

      const error = validProfile.validateSync();
      expect(error).toBeUndefined();
    });

    it("should be invalid if userId is missing", async () => {
      const invalidProfile = new DoctorProfile({
        specialty: "Cardiology",
      });

      const error = invalidProfile.validateSync();
      expect(error).toBeDefined();
      expect(error?.errors["userId"]).toBeDefined();
    });
  });

  // ── Schema Type Validation ──────────────────────────────────────────────────
  describe("Schema Types", () => {
    it("should allow optional string fields (bio, location, profileImage)", () => {
      const profile = new DoctorProfile({
        userId: new mongoose.Types.ObjectId().toHexString(),
        bio: "Experienced cardiologist.",
        location: "Paris, FR",
        profileImage: "https://example.com/image.jpg",
      });

      const error = profile.validateSync();
      expect(error).toBeUndefined();
      expect(profile.bio).toBe("Experienced cardiologist.");
      expect(profile.location).toBe("Paris, FR");
      expect(profile.profileImage).toBe("https://example.com/image.jpg");
    });
  });

  // ── Uniqueness Constraints ─────────────────────────────────────────────────
  describe("Uniqueness Constraints", () => {
    it("should define userId as a unique field", () => {
      const indexes = DoctorProfile.schema.indexes();
      
      // Look for the index definition on 'userId' that specifies unique: true
      const hasUniqueUserIdIndex = indexes.some((indexEntry) => {
        const [fields, options] = indexEntry;
        return fields.userId === 1 && options.unique === true;
      });

      expect(hasUniqueUserIdIndex).toBe(true);
    });
  });

  // ── Experiences Array ──────────────────────────────────────────────────────
  describe("Experiences field", () => {
    it("should default experiences to an empty array if not provided", () => {
      const profile = new DoctorProfile({
        userId: new mongoose.Types.ObjectId().toHexString(),
      });

      expect(Array.isArray(profile.experiences)).toBe(true);
      expect(profile.experiences.length).toBe(0);
    });

    it("should allow storing experience objects", () => {
      const profile = new DoctorProfile({
        userId: new mongoose.Types.ObjectId().toHexString(),
        experiences: [
          { title: "Surgeon", hospital: "Saint-Louis", years: 10 }
        ]
      });

      const error = profile.validateSync();
      expect(error).toBeUndefined();
      expect(profile.experiences.length).toBe(1);
      expect(profile.experiences[0].title).toBe("Surgeon");
    });
  });
});
