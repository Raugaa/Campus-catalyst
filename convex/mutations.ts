import { mutation } from "./_generated/server";
import { v } from "convex/values";


export const updateStudent = mutation({
  args: {
    studentId: v.id("students"),
    firstName: v.string(),
    lastName: v.string(),
    phone: v.optional(v.string()),
    rollNumber: v.string(),
    department: v.string(),
    year: v.string(),
    semester: v.optional(v.number()),
    cgpa: v.optional(v.number()),
    tenthPercentage: v.optional(v.number()),
    twelfthPercentage: v.optional(v.number()),
    skills: v.array(v.string()),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Get the student record first
    const student = await ctx.db.get(args.studentId);
    if (!student) {
      throw new Error("Student not found");
    }

    // Prepare update data, only including fields that are provided
    const updateData: any = {
      firstName: args.firstName,
      lastName: args.lastName,
      phone: args.phone || student.phone,
      rollNumber: args.rollNumber,
      department: args.department,
      year: args.year,
      skills: args.skills,
      updatedAt: args.updatedAt,
    };

    // Only include optional fields if they are provided (not undefined)
    if (args.semester !== undefined) {
      updateData.semester = args.semester;
    }

    if (args.cgpa !== undefined) {
      updateData.cgpa = args.cgpa;
    }

    if (args.tenthPercentage !== undefined) {
      updateData.tenthPercentage = args.tenthPercentage;
    }

    if (args.twelfthPercentage !== undefined) {
      updateData.twelfthPercentage = args.twelfthPercentage;
    }

    // Update the student record
    await ctx.db.patch(args.studentId, updateData);

    return { success: true };
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

export const updateOpportunity = mutation({
  args: {
    opportunityId: v.id("opportunities"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    responsibilities: v.optional(v.string()),
    benefits: v.optional(v.string()),
    requirements: v.optional(v.string()),
    preferredQualifications: v.optional(v.string()),
    
    type: v.optional(v.string()),
    department: v.optional(v.string()),
    location: v.optional(v.string()),
    workType: v.optional(v.string()),
    duration: v.optional(v.string()),
    positions: v.optional(v.number()),
    
    salary: v.optional(v.number()),
    stipend: v.optional(v.number()),
    
    academicRequirements: v.optional(v.object({
      min10thPercentage: v.optional(v.number()),
      min12thPercentage: v.optional(v.number()),
      minCGPA: v.optional(v.number()),
      educationLevel: v.optional(v.string()),
    })),
    
    experienceLevel: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    
    applicationRequirements: v.optional(v.object({
      resume: v.boolean(),
      coverLetter: v.boolean(),
      portfolio: v.boolean(),
      transcript: v.boolean(),
    })),
    
    deadline: v.optional(v.number()),
    startDate: v.optional(v.number()),
    
    isPublic: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()),
    emailNotifications: v.optional(v.boolean()),
    specialInstructions: v.optional(v.string()),
    
    // Company context - can be either companyId or externalCompanyName
    companyId: v.optional(v.id("companies")),
    externalCompanyName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if opportunity exists
    const existingOpportunity = await ctx.db.get(args.opportunityId);
    if (!existingOpportunity) {
      throw new Error("Opportunity not found");
    }

    // Validate company context - must have either companyId or externalCompanyName
    if (!args.companyId && !args.externalCompanyName) {
      throw new Error("Either company ID or external company name must be provided");
    }

    // If companyId is provided, verify it exists
    if (args.companyId) {
      const company = await ctx.db.get(args.companyId);
      if (!company) {
        throw new Error("Company not found");
      }
    }

    // Prepare update data, removing undefined values
    const updateData: any = {
      updatedAt: Date.now(),
    };

    // Only add fields that are provided
    if (args.title !== undefined) updateData.title = args.title;
    if (args.description !== undefined) updateData.description = args.description;
    if (args.responsibilities !== undefined) updateData.responsibilities = args.responsibilities;
    if (args.benefits !== undefined) updateData.benefits = args.benefits;
    if (args.requirements !== undefined) updateData.requirements = args.requirements;
    if (args.preferredQualifications !== undefined) updateData.preferredQualifications = args.preferredQualifications;
    
    if (args.type !== undefined) updateData.type = args.type;
    if (args.department !== undefined) updateData.department = args.department;
    if (args.location !== undefined) updateData.location = args.location;
    if (args.workType !== undefined) updateData.workType = args.workType;
    if (args.duration !== undefined) updateData.duration = args.duration;
    if (args.positions !== undefined) updateData.positions = args.positions;
    
    if (args.salary !== undefined) updateData.salary = args.salary;
    if (args.stipend !== undefined) updateData.stipend = args.stipend;
    
    if (args.academicRequirements !== undefined) updateData.academicRequirements = args.academicRequirements;
    if (args.experienceLevel !== undefined) updateData.experienceLevel = args.experienceLevel;
    if (args.skills !== undefined) updateData.skills = args.skills;
    if (args.applicationRequirements !== undefined) updateData.applicationRequirements = args.applicationRequirements;
    
    if (args.deadline !== undefined) updateData.deadline = args.deadline;
    if (args.startDate !== undefined) updateData.startDate = args.startDate;
    
    if (args.isPublic !== undefined) updateData.isPublic = args.isPublic;
    if (args.isFeatured !== undefined) updateData.isFeatured = args.isFeatured;
    if (args.emailNotifications !== undefined) updateData.emailNotifications = args.emailNotifications;
    if (args.specialInstructions !== undefined) updateData.specialInstructions = args.specialInstructions;
    
    // Handle company assignment
    if (args.companyId !== undefined) {
      updateData.companyId = args.companyId;
      updateData.externalCompanyName = undefined; // Clear external name if setting companyId
    } else if (args.externalCompanyName !== undefined) {
      updateData.externalCompanyName = args.externalCompanyName;
      updateData.companyId = undefined; // Clear companyId if setting external name
    }

    await ctx.db.patch(args.opportunityId, updateData);
    
    return args.opportunityId;
  },
});

export const createOpportunity = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    responsibilities: v.optional(v.string()),
    benefits: v.optional(v.string()),
    requirements: v.string(),
    preferredQualifications: v.optional(v.string()),
    collegeId: v.id("colleges"),
    
    type: v.string(),
    department: v.optional(v.string()),
    location: v.string(),
    workType: v.optional(v.string()),
    duration: v.optional(v.string()),
    positions: v.optional(v.number()),
    createdBy: v.optional(v.id("users")),
    
    salary: v.optional(v.number()),
    stipend: v.optional(v.number()),
    
    academicRequirements: v.optional(v.object({
      min10thPercentage: v.optional(v.number()),
      min12thPercentage: v.optional(v.number()),
      minCGPA: v.optional(v.number()),
      educationLevel: v.optional(v.string()),
    })),
    
    experienceLevel: v.optional(v.string()),
    skills: v.array(v.string()),
    
    applicationRequirements: v.optional(v.object({
      resume: v.boolean(),
      coverLetter: v.boolean(),
      portfolio: v.boolean(),
      transcript: v.boolean(),
    })),
    
    deadline: v.number(),
    startDate: v.optional(v.number()),
    
    isPublic: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()),
    emailNotifications: v.optional(v.boolean()),
    specialInstructions: v.optional(v.string()),
    
    // Company context
    companyId: v.optional(v.id("companies")),
    externalCompanyName: v.optional(v.string()),
    createdByType: v.string(), // "admin" | "company"
    
    status: v.union(v.literal("DRAFT"), v.literal("ACTIVE"))
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get user to set as creator
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Validate company context
    if (!args.companyId && !args.externalCompanyName) {
      throw new Error("Either company ID or external company name is required");
    }

    // If companyId is provided, verify it exists
    if (args.companyId) {
      const company = await ctx.db.get(args.companyId);
      if (!company) {
        throw new Error("Company not found");
      }
    }

    const currentTime = Date.now();
    const opportunity = await ctx.db.insert("opportunities", {
      ...args,
      createdBy: user._id,
      totalApplications: 0,
      views: 0,
      createdAt: currentTime,
      updatedAt: currentTime,
    });

    return opportunity;
  },
})

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
      updatedAt: Date.now(), // This is now valid since we added updatedAt to schema
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

    const currentTime = Date.now();
    const applicationId = await ctx.db.insert("applications", {
      status: "PENDING",
      appliedAt: currentTime,
      createdAt: currentTime, // ADD THIS
      updatedAt: currentTime,
      mentorApproved: false,
      adminApproved: false,
      studentId,
      opportunityId,
      companyId: opportunity.companyId as any,
      collegeId: student.collegeId as any,
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
    const branchId = await ctx.db.insert("branches", {
      name: args.name,
      code: args.code.toLowerCase(),
      collegeId: args.collegeId,
      createdAt: args.createdAt,
      updatedAt: args.updatedAt,
    });
    
    return branchId;
  },
});

export const createInternship = mutation({
  args: {
    studentId: v.id("students"),
    opportunityId: v.id("opportunities"),
    collegeId: v.id("colleges"),
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
    rating: v.optional(v.number()),
    feedback: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const internshipId = await ctx.db.insert("internships", args);
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
    offerLetter: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { studentId, ...placementData } = args;
    
    const placementId = await ctx.db.insert("placements", {
      ...placementData,
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
      collegeId: v.id("colleges"),
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
      role: v.literal("STUDENT"),
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
      branchId: v.id("branches"),
      year: v.string(),
      semester: v.number(),
      tenthPercentage: v.number(), // Fixed: changed from TenthPercentage to tenthPercentage
      twelfthPercentage: v.number(), // Fixed: changed from TwelfthPercentage to twelfthPercentage
      cgpa: v.number(),
      skills: v.array(v.string()),
      resumeUrl: v.optional(v.string()),
      isPlaced: v.boolean(),
      collegeId: v.id("colleges"),
      mentorId: v.optional(v.id("faculty")),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    // Create user first
    const userId = await ctx.db.insert("users", args.userData);
    
    // Create student with userId
    const studentId = await ctx.db.insert("students", {
      ...args.studentData,
      userId,
    });
    
    // Update user with studentId reference
    await ctx.db.patch(userId, { studentId });
    
    return { studentId, userId };
  },
});

// Seeding-specific mutations (use only for development/seeding)
export const createCollegeForSeeding = mutation({
  args: {
    name: v.string(),
    code: v.string(),
    location: v.string(),
    type: v.string(),
    website: v.optional(v.string()),
    phone: v.optional(v.string()),
    logo: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const collegeId = await ctx.db.insert("colleges", args);
    return { collegeId };
  },
});

export const createGlobalAdminForSeeding = mutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
    name: v.string(),
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    // Create user first
    const userId = await ctx.db.insert("users", {
      email: args.email,
      passwordHash: args.passwordHash,
      role: "GLOBAL_ADMIN",
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create global admin
    const globalAdminId = await ctx.db.insert("globalAdmins", {
      userId,
      name: args.name,
      phone: args.phone,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { userId, globalAdminId };
  },
});

export const createAdminForSeeding = mutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
    name: v.string(),
    phone: v.string(),
    department: v.optional(v.string()),
    collegeId: v.id("colleges"),
  },
  handler: async (ctx, args) => {
    // Create user first
    const userId = await ctx.db.insert("users", {
      email: args.email,
      passwordHash: args.passwordHash,
      role: "ADMIN",
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create admin
    const adminId = await ctx.db.insert("admins", {
      userId,
      name: args.name,
      phone: args.phone,
      department: args.department,
      collegeId: args.collegeId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Update user with adminId
    await ctx.db.patch(userId, { adminId });

    return { userId, adminId };
  },
});

export const createFacultyForSeeding = mutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
    name: v.string(),
    department: v.string(),
    designation: v.optional(v.string()),
    phone: v.string(),
    canMentor: v.boolean(),
    collegeId: v.id("colleges"),
  },
  handler: async (ctx, args) => {
    // Create user first
    const userId = await ctx.db.insert("users", {
      email: args.email,
      passwordHash: args.passwordHash,
      role: "FACULTY",
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create faculty
    const facultyId = await ctx.db.insert("faculty", {
      userId,
      name: args.name,
      department: args.department,
      designation: args.designation,
      phone: args.phone,
      canMentor: args.canMentor,
      collegeId: args.collegeId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Update user with facultyId
    await ctx.db.patch(userId, { facultyId });

    return { userId, facultyId };
  },
});

export const createCompanyForSeeding = mutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
    name: v.string(),
    website: v.optional(v.string()),
    location: v.string(),
    industry: v.optional(v.string()),
    size: v.optional(v.string()),
    description: v.optional(v.string()),
    logo: v.optional(v.string()),
    collegeId: v.id("colleges"),
  },
  handler: async (ctx, args) => {
    // Create user first
    const userId = await ctx.db.insert("users", {
      email: args.email,
      passwordHash: args.passwordHash,
      role: "COMPANY",
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create company
    const companyId = await ctx.db.insert("companies", {
      userId,
      name: args.name,
      website: args.website,
      location: args.location,
      industry: args.industry,
      size: args.size,
      description: args.description,
      logo: args.logo,
      collegeId: args.collegeId,
      isVerified: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Update user with companyId
    await ctx.db.patch(userId, { companyId });

    return { userId, companyId };
  },
});

export const createOpportunityForSeeding = mutation({
  args: {
    title: v.string(),
    collegeId: v.id("colleges"),
    description: v.string(),
    responsibilities: v.optional(v.string()),
    benefits: v.optional(v.string()),
    requirements: v.string(),
    preferredQualifications: v.optional(v.string()),
    type: v.string(),
    department: v.optional(v.string()),
    location: v.string(),
    workType: v.optional(v.string()),
    duration: v.optional(v.string()),
    positions: v.optional(v.number()),
    stipend: v.optional(v.number()),
    salary: v.optional(v.number()),
    academicRequirements: v.optional(v.object({
      min10thPercentage: v.optional(v.number()),
      min12thPercentage: v.optional(v.number()),
      minCGPA: v.optional(v.number()),
      educationLevel: v.optional(v.string()),
    })),
    experienceLevel: v.optional(v.string()),
    skills: v.array(v.string()),
    applicationRequirements: v.optional(v.object({
      resume: v.boolean(),
      coverLetter: v.boolean(),
      portfolio: v.boolean(),
      transcript: v.boolean(),
    })),
    deadline: v.number(),
    startDate: v.optional(v.number()),
    isPublic: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()),
    emailNotifications: v.optional(v.boolean()),
    specialInstructions: v.optional(v.string()),
    companyId: v.optional(v.id("companies")),
    createdBy: v.id("users"),
    createdByType: v.string(),
    status: v.union(v.literal("DRAFT"), v.literal("ACTIVE"), v.literal("CLOSED"), v.literal("CANCELLED")),
    totalApplications: v.optional(v.number()),
    views: v.optional(v.number()),
    // Add the missing fields
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const opportunityId = await ctx.db.insert("opportunities", {
      ...args,
    });
    return { opportunityId };
  },
});

export const updateActive = mutation({
  args: {
    userId: v.id("users"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { 
      isActive: args.isActive,
      updatedAt: Date.now()
    });
    
    return { success: true };
  },
});

export const createUserAndAdmin = mutation({
  args: {
    userData: v.object({
      email: v.string(),
      passwordHash: v.string(),
      role: v.literal("ADMIN"),
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
    // Create user first
    const userId = await ctx.db.insert("users", args.userData);
    
    // Create admin with userId
    const adminId = await ctx.db.insert("admins", {
      ...args.adminData,
      userId,
    });
    
    // Update user with adminId reference
    await ctx.db.patch(userId, { adminId });
    
    return { adminId, userId };
  },
});

export const updateFacultyUserStatus = mutation({
  args: {
    userId: v.id("users"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Update the user's active status
    await ctx.db.patch(args.userId, { 
      isActive: args.isActive,
      updatedAt: Date.now()
    });
    
    return { success: true };
  },
});

export const updateUserStatus = mutation({
  args: {
    userId: v.id("users"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { 
      isActive: args.isActive,
      updatedAt: Date.now()
    });
    
    return { success: true };
  },
});

// New mutation to update student placement status
export const updateStudentPlacementStatus = mutation({
  args: {
    studentId: v.id("students"),
    isPlaced: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.studentId, {
      isPlaced: args.isPlaced,
      updatedAt: Date.now(),
    });
    
    return { success: true };
  },
});

// Database clearing mutation for seeding
export const clearAllData = mutation({
  args: {},
  handler: async (ctx) => {
    // Delete all records from all tables
    const tables = [
      "notifications",
      "files", 
      "placements",
      "internships",
      "applications",
      "opportunities",
      "companies",
      "faculty",
      "students",
      "admins",
      "globalAdmins",
      "branches",
      "colleges",
      "users"
    ];
    
    for (const tableName of tables) {
      const records = await ctx.db.query(tableName as any).collect();
      for (const record of records) {
        await ctx.db.delete(record._id);
      }
    }
    
    return { success: true, message: "All data cleared" };
  },
});

export const createNotification = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const notificationId = await ctx.db.insert("notifications", args);
    return { notificationId };
  },
});