import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Admin mutations
export const updateStudentStatus = mutation({
  args: {
    studentId: v.id("students"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { studentId, isActive } = args;
    
    const student = await ctx.db.get(studentId);
    if (!student) {
      throw new Error("Student not found");
    }

    // Update user status
    await ctx.db.patch(student.userId, {
      isActive,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

export const assignMentor = mutation({
  args: {
    studentIds: v.array(v.id("students")),
    mentorId: v.optional(v.id("faculty")), // Optional for unassigning
  },
  handler: async (ctx, args) => {
    const { studentIds, mentorId } = args;
    
    // Update all students with the new mentor (or remove mentor if mentorId is null)
    for (const studentId of studentIds) {
      await ctx.db.patch(studentId, {
        mentorId: mentorId,
        updatedAt: Date.now(),
      });
    }
    
    return { 
      success: true, 
      assignedCount: studentIds.length,
      mentorId: mentorId 
    };
  },
});

export const verifyCompany = mutation({
  args: {
    companyId: v.id("companies"),
    isVerified: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { companyId, isVerified } = args;
    
    const company = await ctx.db.get(companyId);
    if (!company) {
      throw new Error("Company not found");
    }

    await ctx.db.patch(companyId, {
      isVerified,
      updatedAt: Date.now(),
    });

    // If verifying, activate the user account
    if (isVerified) {
      await ctx.db.patch(company.userId, {
        isActive: true,
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

export const updateCompanyStatus = mutation({
  args: {
    companyId: v.id("companies"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { companyId, isActive } = args;
    
    const company = await ctx.db.get(companyId);
    if (!company) {
      throw new Error("Company not found");
    }

    await ctx.db.patch(company.userId, {
      isActive,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

export const updateFaculty = mutation({
  args: {
    facultyId: v.id("faculty"),
    name: v.optional(v.string()),
    department: v.optional(v.string()),
    designation: v.optional(v.string()),
    phone: v.optional(v.string()),
    canMentor: v.optional(v.boolean()),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const { facultyId, updatedAt, ...updateData } = args;
    
    // Remove undefined values
    const cleanedData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );
    
    await ctx.db.patch(facultyId, {
      ...cleanedData,
      updatedAt,
    });

    return { success: true };
  },
});

// ✅ Separate mutation for updating user email
export const updateFacultyUserEmail = mutation({
  args: {
    userId: v.id("users"),
    email: v.string(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const { userId, email, updatedAt } = args;
    
    await ctx.db.patch(userId, {
      email,
      updatedAt,
    });

    return { success: true };
  },
});

export const createOpportunity = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    type: v.union(v.literal("INTERNSHIP"), v.literal("JOB"), v.literal("BOTH")),
    location: v.string(),
    workMode: v.union(v.literal("ONSITE"), v.literal("REMOTE"), v.literal("HYBRID")),
    duration: v.optional(v.string()),
    stipend: v.optional(v.number()),
    salary: v.optional(v.number()),
    currency: v.optional(v.string()),
    requirements: v.array(v.string()),
    skills: v.array(v.string()),
    eligibleDepartments: v.array(v.string()),
    eligibleYears: v.array(v.string()),
    minCGPA: v.optional(v.number()),
    deadline: v.number(),
    status: v.union(
      v.literal("DRAFT"),
      v.literal("ACTIVE"),
      v.literal("CLOSED"),
      v.literal("CANCELLED")
    ),
    companyId: v.id("companies"),
  },
  handler: async (ctx, args) => {
    const { companyId, ...opportunityData } = args;
    
    const company = await ctx.db.get(companyId);
    if (!company) {
      throw new Error("Company not found");
    }

    const opportunityId = await ctx.db.insert("opportunities", {
      ...opportunityData,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      companyId,
    });

    return { opportunityId };
  },
});

export const updateOpportunityStatus = mutation({
  args: {
    opportunityId: v.id("opportunities"),
    status: v.union(
      v.literal("DRAFT"),
      v.literal("ACTIVE"),
      v.literal("CLOSED"),
      v.literal("CANCELLED")
    ),
  },
  handler: async (ctx, args) => {
    const { opportunityId, status } = args;
    
    const opportunity = await ctx.db.get(opportunityId);
    if (!opportunity) {
      throw new Error("Opportunity not found");
    }

    await ctx.db.patch(opportunityId, {
      status,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

export const createApplication = mutation({
  args: {
    studentId: v.id("students"),
    opportunityId: v.id("opportunities"),
  },
  handler: async (ctx, args) => {
    const { studentId, opportunityId } = args;
    
    const student = await ctx.db.get(studentId);
    const opportunity = await ctx.db.get(opportunityId);
    
    if (!student) {
      throw new Error("Student not found");
    }
    if (!opportunity) {
      throw new Error("Opportunity not found");
    }

    // Check if application already exists
    const existingApplication = await ctx.db
      .query("applications")
      .withIndex("by_student", (q) => q.eq("studentId", studentId))
      .filter((q) => q.eq(q.field("opportunityId"), opportunityId))
      .first();
    
    if (existingApplication) {
      throw new Error("Application already exists for this opportunity");
    }

    const applicationId = await ctx.db.insert("applications", {
      status: "PENDING",
      appliedAt: Date.now(),
      updatedAt: Date.now(),
      mentorApproved: false,
      adminApproved: false,
      studentId,
      opportunityId,
    });

    return { applicationId };
  },
});

export const updateApplicationStatus = mutation({
  args: {
    applicationId: v.id("applications"),
    status: v.string(),
    mentorApproved: v.optional(v.boolean()),
    adminApproved: v.optional(v.boolean()),
    adminRemarks: v.optional(v.string()),
    mentorRemarks: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { applicationId, status, mentorApproved, adminApproved, adminRemarks, mentorRemarks } = args;
    
    const application = await ctx.db.get(applicationId);
    if (!application) {
      throw new Error("Application not found");
    }

    const updateData: any = {
      status,
      updatedAt: Date.now(),
    };

    if (mentorApproved !== undefined) updateData.mentorApproved = mentorApproved;
    if (adminApproved !== undefined) updateData.adminApproved = adminApproved;
    if (adminRemarks !== undefined) updateData.adminRemarks = adminRemarks;
    if (mentorRemarks !== undefined) updateData.mentorRemarks = mentorRemarks;

    await ctx.db.patch(applicationId, updateData);

    return { success: true };
  },
});

export const createBranch = mutation({
  args: {
    name: v.string(),
    code: v.string(),
    collegeId: v.id("colleges"),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const branchId = await ctx.db.insert("branches", args);
    return { branchId };
  },
});

export const createInternship = mutation({
  args: {
    studentId: v.id("students"),
    opportunityId: v.id("opportunities"),
    companyId: v.id("companies"),
    applicationId: v.id("applications"),
    startDate: v.number(),
    endDate: v.number(),
    stipend: v.optional(v.number()),
    mentorId: v.optional(v.id("faculty")),
    rating: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const internshipId = await ctx.db.insert("internships", {
      ...args,
      status: "ACTIVE",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { internshipId };
  },
});

export const createPlacement = mutation({
  args: {
    jobTitle: v.string(),
    joinDate: v.number(),
    salary: v.number(),
    location: v.string(),
    workMode: v.string(),
    studentId: v.id("students"),
    companyId: v.id("companies"),
    status:v.union(
      v.literal("OFFER_ACCEPTED"),
      v.literal("JOINED"),
      v.literal("NOT_JOINED")
    ),
    opportunityId: v.id("opportunities"),
    applicationId: v.id("applications"),
  },
  handler: async (ctx, args) => {
    const { studentId, ...placementData } = args;
    
    const placementId = await ctx.db.insert("placements", {
      ...placementData,
      status: "OFFER_ACCEPTED",
      studentId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Mark student as placed
    await ctx.db.patch(studentId, {
      isPlaced: true,
      updatedAt: Date.now(),
    });

    return { placementId };
  },
});

// Mutations for creating user profiles (used by actions)
export const createUserAndCompany = mutation({
  args: {
    userData: v.object({
      email: v.string(),
      passwordHash: v.string(),
      role: v.union(v.literal("STUDENT"), v.literal("FACULTY"), v.literal("COMPANY"), v.literal("ADMIN")),
      isActive: v.boolean(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    companyData: v.object({
      name: v.string(),
      website: v.optional(v.string()),
      location: v.string(),
      industry: v.optional(v.string()),
      size: v.optional(v.string()),
      description: v.optional(v.string()),
      isVerified: v.boolean(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const { userData, companyData } = args;
    
    const userId = await ctx.db.insert("users", userData);
    const companyId = await ctx.db.insert("companies", {
      ...companyData,
      userId,
    });

    // Update user with companyId reference
    await ctx.db.patch(userId, {
      companyId,
      updatedAt: Date.now(),
    });

    return { userId, companyId };
  },
});

export const createUserAndFaculty = mutation({
  args: {
    userData: v.object({
      email: v.string(),
      passwordHash: v.string(),
      role: v.union(v.literal("STUDENT"), v.literal("FACULTY"), v.literal("COMPANY"), v.literal("ADMIN")),
      isActive: v.boolean(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    facultyData: v.object({
      name: v.string(),
      department: v.string(),
      designation: v.optional(v.string()),
      phone: v.string(),
      canMentor: v.boolean(),
      collegeId: v.id("colleges"),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const { userData, facultyData } = args;
    
    const userId = await ctx.db.insert("users", userData);
    const facultyId = await ctx.db.insert("faculty", {
      ...facultyData,
      userId,
    });

    // Update user with facultyId reference
    await ctx.db.patch(userId, {
      facultyId,
      updatedAt: Date.now(),
    });

    return { userId, facultyId };
  },
});

export const createGlobalAndUser = mutation({
  args: {
    userData: v.object({
      email: v.string(),
      passwordHash: v.string(),
      role: v.union(v.literal("STUDENT"), v.literal("FACULTY"), v.literal("COMPANY"), v.literal("ADMIN"), v.literal("GLOBAL_ADMIN")),
      isActive: v.boolean(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    globalAdminData: v.object({
      name: v.string(),
      phone: v.string(),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
  },
  handler: async (ctx, args) => {
    const { userData, globalAdminData } = args;

    const userId = await ctx.db.insert("users", userData);
    const globalAdminId = await ctx.db.insert("globalAdmins", {
      userId,
      ...globalAdminData,
    });

    return { userId, globalAdminId };
  },
});

export const createUserAndStudent = mutation({
  args: {
    userData: v.object({
      email: v.string(),
      passwordHash: v.string(),
      role: v.union(v.literal("STUDENT"), v.literal("FACULTY"), v.literal("COMPANY"), v.literal("ADMIN")),
      isActive: v.boolean(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    studentData: v.object({
      firstName: v.string(),
      lastName: v.string(),
      rollNumber: v.string(),
      phone: v.string(),
      department: v.string(),
      year: v.string(),
      semester: v.number(),
      cgpa: v.optional(v.number()),
      resumeUrl: v.optional(v.string()),
      skills: v.array(v.string()),
      isPlaced: v.boolean(),
      collegeId: v.id("colleges"),
      mentorId: v.optional(v.id("faculty")),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const { userData, studentData } = args;
    
    const userId = await ctx.db.insert("users", userData);
    const studentId = await ctx.db.insert("students", {
      ...studentData,
      userId,
    });

    // Update user with studentId reference
    await ctx.db.patch(userId, {
      studentId,
      updatedAt: Date.now(),
    });

    return { userId, studentId };
  },
});

export const createCollege = mutation({
  args: {
    name: v.string(),
    code: v.string(),
    location: v.string(),
    type: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const collegeId = await ctx.db.insert("colleges", args);
    return { collegeId };
  },
});

export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("STUDENT"), v.literal("FACULTY"), v.literal("COMPANY"), v.literal("ADMIN")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      role: args.role,
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});

export const createAdminProfile = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    phone: v.string(),
    department: v.optional(v.string()),
    collegeId: v.id("colleges"),
  },
  handler: async (ctx, args) => {
    const adminId = await ctx.db.insert("admins", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return { adminId };
  },
});

export const createUserAndAdmin = mutation({
  args: {
    userData: v.object({
      email: v.string(),
      passwordHash: v.string(),
      role: v.union(v.literal("STUDENT"), v.literal("FACULTY"), v.literal("COMPANY"), v.literal("ADMIN")),
      isActive: v.boolean(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    adminData: v.object({
      name: v.string(),
      phone: v.string(),
      department: v.optional(v.string()),
      collegeId: v.id("colleges"),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const { userData, adminData } = args;
    
    const userId = await ctx.db.insert("users", userData);
    const adminId = await ctx.db.insert("admins", {
      ...adminData,
      userId,
    });

    // Update user with adminId reference
    await ctx.db.patch(userId, {
      adminId,
      updatedAt: Date.now(),
    });

    return { userId, adminId };
  },
});

export const updateActive = mutation({
    args: {
        userId: v.id("users"),
        isActive: v.boolean(),
    },
    handler: async (ctx, args) => {
        const { userId, isActive } = args;

        // Update user status
        await ctx.db.patch(userId, {
            isActive,
            updatedAt: Date.now(),
        });

        return { success: true };
    },
});

// ✅ New mutation to update faculty user status
export const updateFacultyUserStatus = mutation({
  args: {
    facultyId: v.id("faculty"),
    userId: v.optional(v.id("users")),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { facultyId, userId, isActive } = args;
    
    // Update user isActive status
    if (userId) {
      await ctx.db.patch(userId, {
        isActive: isActive,
        updatedAt: Date.now(),
      });
    }
    const faculty = await ctx.db.get(facultyId);
    if (!faculty) {
      throw new Error("Faculty not found");
    }
    // If deactivating faculty, optionally update faculty record
    await ctx.db.patch(facultyId, {
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});