import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Core User Management
  branches : defineTable({
    name: v.string(),
    code: v.string(),
    collegeId : v.id("colleges"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_code", ["code"])
  .index("by_college", ["collegeId"]),
  
  globalAdmins: defineTable({
    userId: v.id("users"),
    name: v.string(),
    phone: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),
  users: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    role: v.union(v.literal("STUDENT"), v.literal("FACULTY"), v.literal("COMPANY"), v.literal("ADMIN") , v.literal("GLOBAL_ADMIN")),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
    // References to profile tables
    studentId: v.optional(v.id("students")),
    facultyId: v.optional(v.id("faculty")),
    companyId: v.optional(v.id("companies")),
    adminId: v.optional(v.id("admins")),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_active", ["isActive"]),

  // Colleges
  colleges: defineTable({
    name: v.string(),
    code: v.string(),
    location: v.string(), // Changed from separate address fields
    website: v.optional(v.string()),
    logo: v.optional(v.string()),
    phone: v.optional(v.string()),
    type: v.string(), // "COLLEGE", "UNIVERSITY", etc.
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_code", ["code"]),

  // Students
  students: defineTable({
    userId: v.id("users"),
    firstName: v.string(),
    lastName: v.string(),
    rollNumber: v.string(),
    phone: v.string(),
    department: v.string(),
    branchId: v.id("branches"),
    year: v.string(), // "FY", "SY", "TY", "LY"
    semester: v.number(),
    cgpa: v.optional(v.number()),
    // ADD 10th and 12th percentage fields
    tenthPercentage: v.number(),
    twelfthPercentage: v.number(),
    skills: v.array(v.string()),
    resumeUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    isPlaced: v.boolean(),
    collegeId: v.id("colleges"),
    mentorId: v.optional(v.id("faculty")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_college", ["collegeId"])
    .index("by_mentor", ["mentorId"])
    .index("by_department", ["department"])
    .index("by_year", ["year"])
    .index("by_placed", ["isPlaced"])
    .index("by_roll_number", ["rollNumber"])
    .index("by_branch", ["branchId"]),

  // Faculty
  faculty: defineTable({
    userId: v.id("users"),
    name: v.string(),
    department: v.string(),
    designation: v.optional(v.string()),
    phone: v.string(),
    bio: v.optional(v.string()),
    canMentor: v.boolean(),
    collegeId: v.id("colleges"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_college", ["collegeId"])
    .index("by_department", ["department"])
    .index("by_mentor", ["canMentor"]),

  // Companies
  companies: defineTable({
    userId: v.id("users"),
    name: v.string(),
    website: v.optional(v.string()),
    location: v.string(),
    industry: v.optional(v.string()),
    size: v.optional(v.string()),
    description: v.optional(v.string()),
    logo: v.optional(v.string()),
    collegeId: v.id("colleges"), // Remove v.optional() to make it required
    isVerified: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_verified", ["isVerified"])
    .index("by_industry", ["industry"])
    .index("by_college", ["collegeId"]),

  // Admins
  admins: defineTable({
    userId: v.id("users"),
    name: v.string(),
    phone: v.string(),
    department: v.optional(v.string()),
    collegeId: v.id("colleges"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_college", ["collegeId"]),

  // Opportunities
  opportunities: defineTable({
    title: v.string(),
    collegeId: v.id("colleges"), // Which college posted it (for ADMIN users)
    description: v.string(),
    responsibilities: v.optional(v.string()),
    benefits: v.optional(v.string()),
    requirements: v.string(),
    preferredQualifications: v.optional(v.string()),
    
    // Basic info
    type: v.string(), // internship, fulltime, parttime, contract
    department: v.optional(v.string()),
    location: v.string(),
    workType: v.optional(v.string()), // onsite, remote, hybrid
    duration: v.optional(v.string()),
    positions: v.optional(v.number()),
    
    // Compensation
    salary: v.optional(v.number()),
    stipend: v.optional(v.number()),
    
    // Academic requirements - UPDATED to include 10th and 12th
    academicRequirements: v.optional(v.object({
      min10thPercentage: v.optional(v.number()),
      min12thPercentage: v.optional(v.number()),
      minCGPA: v.optional(v.number()),
      educationLevel: v.optional(v.string()), // highschool, bachelor, master, phd
    })),
    
    // Experience and skills
    experienceLevel: v.optional(v.string()), // entry, intermediate, advanced
    skills: v.array(v.string()),
    
    // Application requirements
    applicationRequirements: v.optional(v.object({
      resume: v.boolean(),
      coverLetter: v.boolean(),
      portfolio: v.boolean(),
      transcript: v.boolean(),
    })),
    
    // Dates
    deadline: v.number(),
    startDate: v.optional(v.number()),
    
    // Visibility and settings
    isPublic: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()),
    emailNotifications: v.optional(v.boolean()),
    specialInstructions: v.optional(v.string()),
    
    // Relations
    companyId: v.optional(v.id("companies")), // Optional for external companies
    externalCompanyName: v.optional(v.string()), // For companies not on portal
    
    // Creation context
    createdBy: v.id("users"), // Who created it (admin or company user)
    createdByType: v.string(), // "admin" | "company"
    
    // Status and metadata
    status: v.union(
      v.literal("DRAFT"),
      v.literal("ACTIVE"),
      v.literal("CLOSED"),
      v.literal("CANCELLED")
    ),
    totalApplications: v.optional(v.number()),
    views: v.optional(v.number()),
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_company", ["companyId"])
    .index("by_status", ["status"])
    .index("by_type", ["type"])
    .index("by_deadline", ["deadline"])
    .index("by_created_by", ["createdBy"])
    .index("by_college", ["collegeId"]),

  // Applications
  applications: defineTable({
    studentId: v.id("students"),
    opportunityId: v.id("opportunities"),
    companyId: v.id("companies"),
    collegeId : v.id("colleges"),
    status: v.union(
      v.literal("PENDING"),
      v.literal("MENTOR_REVIEW"),
      v.literal("ADMIN_REVIEW"),
      v.literal("SUBMITTED"),
      v.literal("SHORTLISTED"),
      v.literal("REJECTED"),
      v.literal("SELECTED"),
      v.literal("OFFER_ACCEPTED"),
      v.literal("OFFER_DECLINED")
    ),
    coverLetter: v.optional(v.string()),
    resumeUrl: v.optional(v.string()),
    mentorApproved: v.optional(v.boolean()),
    adminApproved: v.optional(v.boolean()),
    mentorRemarks: v.optional(v.string()),
    adminRemarks: v.optional(v.string()),
    appliedAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_student", ["studentId"])
    .index("by_opportunity", ["opportunityId"])
    .index("by_status", ["status"])
    .index("by_applied_at", ["appliedAt"])
    .index("by_college", ["collegeId"]),

  // Internships
  internships: defineTable({
    studentId: v.id("students"),
    collegeId: v.id("colleges"),
    opportunityId: v.id("opportunities"),
    companyId: v.id("companies"),
    applicationId: v.id("applications"),
    startDate: v.number(),
    endDate: v.number(),
    status: v.union(
      v.literal("UPCOMING"),
      v.literal("ACTIVE"),
      v.literal("COMPLETED"),
    ),
    stipend: v.optional(v.number()),
    mentorId: v.optional(v.id("faculty")),
    companyMentor: v.optional(v.string()),
    weeklyReports: v.optional(v.array(v.string())),
    finalReport: v.optional(v.string()),
    rating: v.optional(v.number()),
    feedback: v.optional(v.string()),
    certificate: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_student", ["studentId"])
    .index("by_company", ["companyId"])
    .index("by_status", ["status"])
    .index("by_mentor", ["mentorId"])
    .index("by_college", ["collegeId"]),

  // Placements
  placements: defineTable({
    studentId: v.id("students"),
    opportunityId: v.id("opportunities"),
    companyId: v.id("companies"),
    applicationId: v.id("applications"),
    jobTitle: v.string(),
    salary: v.number(),
    joinDate: v.number(),
    location: v.string(),
    workMode: v.string(),
    status: v.union(
      v.literal("OFFER_ACCEPTED"),
      v.literal("JOINED"),
      v.literal("NOT_JOINED")
    ),
    offerLetter: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_student", ["studentId"])
    .index("by_company", ["companyId"])
    .index("by_status", ["status"]),

  // Notifications
  notifications: defineTable({
    userId: v.id("users"),
    title: v.string(),
    message: v.string(),
    type: v.union(
      v.literal("APPLICATION"),
      v.literal("OPPORTUNITY"),
      v.literal("SYSTEM"),
      v.literal("REMINDER")
    ),
    isRead: v.boolean(),
    data: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_read", ["isRead"])
    .index("by_type", ["type"]),

  // Files
  files: defineTable({
    name: v.string(),
    type: v.string(),
    url: v.string(),
    uploadedBy: v.id("users"),
    relatedTo: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_uploaded_by", ["uploadedBy"])
    .index("by_type", ["type"]),
});