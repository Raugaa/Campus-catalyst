import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Mutation to create or update user from WorkOS authentication
export const createOrUpdateUserFromWorkOS = mutation({
  args: {
    workOSId: v.string(),
    email: v.string(),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists by WorkOS ID
    let user = await ctx.db
      .query("users")
      .withIndex("by_workos_id", (q) => q.eq("workOSId", args.workOSId))
      .first();
    
    if (user) {
      // Update existing user
      await ctx.db.patch(user._id, {
        email: args.email,
        updatedAt: Date.now(),
      });
      return user._id;
    }
    
    // Check if user exists by email (for migration)
    user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (user) {
      // Update existing user with WorkOS ID
      await ctx.db.patch(user._id, {
        workOSId: args.workOSId,
        updatedAt: Date.now(),
      });
      return user._id;
    }
    
    // Create new user
    const userId = await ctx.db.insert("users", {
      workOSId: args.workOSId,
      email: args.email,
      role: args.role || "STUDENT", // Default role
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return userId;
  },
});
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
    studentId: v.id("students"),
    mentorId: v.id("faculty"),
  },
  handler: async (ctx, args) => {
    const { studentId, mentorId } = args;
    
    const student = await ctx.db.get(studentId);
    const mentor = await ctx.db.get(mentorId);
    
    if (!student) {
      throw new Error("Student not found");
    }
    if (!mentor) {
      throw new Error("Faculty member not found");
    }

    await ctx.db.patch(studentId, {
      mentorId,
      updatedAt: Date.now(),
    });

    return { success: true };
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
  },
  handler: async (ctx, args) => {
    const { facultyId, ...updates } = args;
    
    const faculty = await ctx.db.get(facultyId);
    if (!faculty) {
      throw new Error("Faculty member not found");
    }

    const updateData: any = { updatedAt: Date.now() };
    Object.keys(updates).forEach(key => {
      if (updates[key as keyof typeof updates] !== undefined) {
        updateData[key] = updates[key as keyof typeof updates];
      }
    });

    await ctx.db.patch(facultyId, updateData);

    return { success: true };
  },
});

export const createOpportunity = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    location: v.string(),
    type: v.string(),
    duration: v.optional(v.string()),
    stipend: v.optional(v.string()),
    salary: v.optional(v.string()),
    requirements: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    deadline: v.number(),
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
      status: "ACTIVE",
      companyId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { opportunityId };
  },
});

export const updateOpportunityStatus = mutation({
  args: {
    opportunityId: v.id("opportunities"),
    status: v.string(),
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
      createdAt: Date.now(),
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

export const createInterview = mutation({
  args: {
    type: v.string(),
    mode: v.string(),
    scheduledAt: v.number(),
    durationMin: v.optional(v.number()),
    round: v.number(),
    interviewerName: v.optional(v.string()),
    interviewerEmail: v.optional(v.string()),
    meetingLink: v.optional(v.string()),
    location: v.optional(v.string()),
    studentId: v.id("students"),
    companyId: v.id("companies"),
    applicationId: v.id("applications"),
  },
  handler: async (ctx, args) => {
    const { studentId, companyId, applicationId, ...interviewData } = args;
    
    const student = await ctx.db.get(studentId);
    const company = await ctx.db.get(companyId);
    const application = await ctx.db.get(applicationId);
    
    if (!student) throw new Error("Student not found");
    if (!company) throw new Error("Company not found");
    if (!application) throw new Error("Application not found");

    const interviewId = await ctx.db.insert("interviews", {
      ...interviewData,
      status: "SCHEDULED",
      studentId,
      companyId,
      applicationId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { interviewId };
  },
});

export const updateInterviewStatus = mutation({
  args: {
    interviewId: v.id("interviews"),
    status: v.string(),
    feedback: v.optional(v.string()),
    result: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { interviewId, status, feedback, result } = args;
    
    const interview = await ctx.db.get(interviewId);
    if (!interview) {
      throw new Error("Interview not found");
    }

    const updateData: any = {
      status,
      updatedAt: Date.now(),
    };

    if (feedback !== undefined) updateData.feedback = feedback;
    if (result !== undefined) updateData.result = result;

    await ctx.db.patch(interviewId, updateData);

    return { success: true };
  },
});

export const createInternship = mutation({
  args: {
    title: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    stipend: v.optional(v.string()),
    mentorName: v.optional(v.string()),
    mentorEmail: v.optional(v.string()),
    mentorPhone: v.optional(v.string()),
    workLocation: v.optional(v.string()),
    workMode: v.string(),
    description: v.optional(v.string()),
    learningGoals: v.optional(v.string()),
    studentId: v.id("students"),
    companyId: v.id("companies"),
    applicationId: v.id("applications"),
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
    title: v.string(),
    joiningDate: v.optional(v.number()),
    salary: v.string(),
    location: v.string(),
    workMode: v.string(),
    department: v.optional(v.string()),
    reportingManager: v.optional(v.string()),
    hrContact: v.optional(v.string()),
    bond: v.optional(v.string()),
    bondDurationMonths: v.optional(v.number()),
    studentId: v.id("students"),
    companyId: v.id("companies"),
    applicationId: v.id("applications"),
  },
  handler: async (ctx, args) => {
    const { studentId, ...placementData } = args;
    
    const placementId = await ctx.db.insert("placements", {
      ...placementData,
      status: "CONFIRMED",
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
      role: v.string(),
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
      role: v.string(),
      isActive: v.boolean(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    facultyData: v.object({
      name: v.string(),
      department: v.string(),
      designation: v.optional(v.string()),
      phone: v.optional(v.string()),
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

export const createUserAndStudent = mutation({
  args: {
    userData: v.object({
      email: v.string(),
      passwordHash: v.string(),
      role: v.string(),
      isActive: v.boolean(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    studentData: v.object({
      firstName: v.string(),
      lastName: v.string(),
      rollNumber: v.string(),
      phone: v.optional(v.string()),
      department: v.string(),
      year: v.string(),
      semester: v.number(),
      cgpa: v.optional(v.number()),
      skills: v.optional(v.array(v.string())),
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
    role: v.string(),
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
    phone: v.optional(v.string()),
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
      role: v.string(),
      isActive: v.boolean(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    adminData: v.object({
      name: v.string(),
      phone: v.optional(v.string()),
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
