import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  colleges: defineTable({
    name: v.string(),
    code: v.string(),
    location: v.string(),
    type: v.string(), // CollegeType enum values stored as string
    createdAt: v.number(), // epoch ms
    updatedAt: v.number(),
  }).index("by_code", ["code"]),

    users: defineTable({
        workOSId: v.optional(v.string()),
        email: v.string(),
        passwordHash: v.optional(v.string()),
        role: v.string(), // Role enum as string
        isActive: v.boolean(),
        createdAt: v.number(),
        updatedAt: v.number(),
        // optional denormalized refs
        studentId: v.optional(v.id("students")),
        facultyId: v.optional(v.id("faculty")),
        companyId: v.optional(v.id("companies")),
        adminId: v.optional(v.id("admins")),
    }).index("by_role", ["role"])
        .index("by_active", ["isActive"])
        .index("by_workos_id", ["workOSId"])
        .index("by_email", ["email"]),

  admins: defineTable({
    userId: v.id("users"),
    name: v.string(),
    phone: v.optional(v.string()),
    department: v.optional(v.string()),
    collegeId: v.id("colleges"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_college", ["collegeId"])
    .index("by_user", ["userId"]),

  students: defineTable({
    userId: v.id("users"),
    firstName: v.string(),
    lastName: v.string(),
    rollNumber: v.string(),
    phone: v.optional(v.string()),
    department: v.string(),
    year: v.string(), // FY, SY, TY, LY
    semester: v.number(),
    cgpa: v.optional(v.number()),
    skills: v.optional(v.array(v.string())),
    resumeUrl: v.optional(v.string()),
    isPlaced: v.boolean(),
    collegeId: v.id("colleges"),
    mentorId: v.optional(v.id("faculty")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_college", ["collegeId"])
    .index("by_mentor", ["mentorId"])
    .index("by_department", ["department"])
    .index("by_year", ["year"])
    .index("by_roll", ["rollNumber"])
    .index("by_user", ["userId"]),

  faculty: defineTable({
    userId: v.id("users"),
    name: v.string(),
    department: v.string(),
    designation: v.optional(v.string()),
    phone: v.optional(v.string()),
    canMentor: v.boolean(),
    collegeId: v.id("colleges"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_college", ["collegeId"])
    .index("by_department", ["department"])
    .index("by_user", ["userId"]),

  companies: defineTable({
    userId: v.id("users"),
    name: v.string(),
    website: v.optional(v.string()),
    location: v.string(),
    industry: v.optional(v.string()),
    size: v.optional(v.string()), // CompanySize enum stored as string
    description: v.optional(v.string()),
    isVerified: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_verified", ["isVerified"])
    .index("by_user", ["userId"]),

  opportunities: defineTable({
    title: v.string(),
    description: v.string(),
    location: v.string(),
    type: v.string(), // OpportunityType as string
    duration: v.optional(v.string()),
    stipend: v.optional(v.string()),
    salary: v.optional(v.string()),
    requirements: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    deadline: v.number(),
    status: v.string(), // OpportunityStatus as string
    companyId: v.id("companies"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_company", ["companyId"])
    .index("by_status", ["status"])
    .index("by_deadline", ["deadline"])
    .index("by_type", ["type"]),

  applications: defineTable({
    status: v.string(), // ApplicationStatus as string
    appliedAt: v.number(),
    updatedAt: v.number(),
    mentorApproved: v.boolean(),
    adminApproved: v.boolean(),
    adminRemarks: v.optional(v.string()),
    mentorRemarks: v.optional(v.string()),
    studentId: v.id("students"),
    opportunityId: v.id("opportunities"),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_appliedAt", ["appliedAt"])
    .index("by_student", ["studentId"])
    .index("by_opportunity", ["opportunityId"]),

  interviews: defineTable({
    type: v.string(), // InterviewType
    mode: v.string(), // InterviewMode
    scheduledAt: v.number(),
    durationMin: v.optional(v.number()),
    status: v.string(), // InterviewStatus
    feedback: v.optional(v.string()),
    result: v.optional(v.string()), // InterviewResult
    round: v.number(),
    interviewerName: v.optional(v.string()),
    interviewerEmail: v.optional(v.string()),
    meetingLink: v.optional(v.string()),
    location: v.optional(v.string()),
    notes: v.optional(v.string()),
    studentId: v.id("students"),
    companyId: v.id("companies"),
    applicationId: v.id("applications"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_student", ["studentId"])
    .index("by_company", ["companyId"])
    .index("by_scheduledAt", ["scheduledAt"])
    .index("by_status", ["status"]),

  internships: defineTable({
    title: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    stipend: v.optional(v.string()),
    status: v.string(), // InternshipStatus
    mentorName: v.optional(v.string()),
    mentorEmail: v.optional(v.string()),
    mentorPhone: v.optional(v.string()),
    workLocation: v.optional(v.string()),
    workMode: v.string(), // WorkMode
    description: v.optional(v.string()),
    learningGoals: v.optional(v.string()),
    feedback: v.optional(v.string()),
    rating: v.optional(v.number()),
    certificateUrl: v.optional(v.string()),
    offerLetterUrl: v.optional(v.string()),
    completionLetterUrl: v.optional(v.string()),
    studentId: v.id("students"),
    companyId: v.id("companies"),
    applicationId: v.id("applications"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_student", ["studentId"])
    .index("by_company", ["companyId"])
    .index("by_status", ["status"])
    .index("by_startDate", ["startDate"])
    .index("by_endDate", ["endDate"]),

  placements: defineTable({
    title: v.string(),
    joiningDate: v.optional(v.number()),
    salary: v.string(),
    location: v.string(),
    workMode: v.string(), // WorkMode
    status: v.string(), // PlacementStatus
    offerLetterUrl: v.optional(v.string()),
    acceptanceLetterUrl: v.optional(v.string()),
    bond: v.optional(v.string()),
    bondDurationMonths: v.optional(v.number()),
    department: v.optional(v.string()),
    reportingManager: v.optional(v.string()),
    hrContact: v.optional(v.string()),
    studentId: v.id("students"),
    companyId: v.id("companies"),
    applicationId: v.id("applications"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_student", ["studentId"])
    .index("by_company", ["companyId"])
    .index("by_status", ["status"])
    .index("by_joiningDate", ["joiningDate"]),
});