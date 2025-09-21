import { query } from "./_generated/server";
import { v } from "convex/values";

// Auth queries
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const { email } = args;
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), email))
      .first();
  },
});
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const getStudentByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("students")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const getFacultyByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("faculty")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const getCompanyByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("companies")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const getAdminByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("admins")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const getUserProfile = query({
  args: { 
    userId: v.string(),
    role: v.string()
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId as any);
    if (!user) return null;

    let userProfile = null;
    const userRole = args.role.toLowerCase();
    
    if (userRole === "student" && (user as any).studentId) {
      userProfile = await ctx.db.get((user as any).studentId);
    } else if (userRole === "faculty" && (user as any).facultyId) {
      userProfile = await ctx.db.get((user as any).facultyId);
    } else if (userRole === "admin" && (user as any).adminId) {
      userProfile = await ctx.db.get((user as any).adminId);
    } else if (userRole === "company" && (user as any).companyId) {
      userProfile = await ctx.db.get((user as any).companyId);
    }

    return userProfile;
  },
});


// Admin queries
export const getStudents = query({
  args: {
    q: v.optional(v.string()),
    department: v.optional(v.string()),
    year: v.optional(v.string()),
    status: v.optional(v.string()),
    skip: v.optional(v.number()),
    take: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { q, department, year, status, skip = 0, take = 20 } = args;
    
    let studentsQuery = ctx.db.query("students");
    
    // Apply filters
    if (department) {
      studentsQuery = studentsQuery.filter((q) => q.eq(q.field("department"), department));
    }
    if (year) {
      studentsQuery = studentsQuery.filter((q) => q.eq(q.field("year"), year));
    }
    if (status === "placed") {
      studentsQuery = studentsQuery.filter((q) => q.eq(q.field("isPlaced"), true));
    }
    if (status === "unplaced") {
      studentsQuery = studentsQuery.filter((q) => q.eq(q.field("isPlaced"), false));
    }

    const allStudents = await studentsQuery.collect();
    
    // Filter by search query if provided
    let filteredStudents = allStudents;
    if (q) {
      const searchLower = q.toLowerCase();
      filteredStudents = allStudents.filter(student => 
        student.firstName.toLowerCase().includes(searchLower) ||
        student.lastName.toLowerCase().includes(searchLower) ||
        student.rollNumber.toLowerCase().includes(searchLower)
      );
    }

    // Get user data and mentor info for each student
    const studentsWithDetails = await Promise.all(
      filteredStudents.slice(skip, skip + take).map(async (student) => {
        const user = await ctx.db.get(student.userId);
        const mentor = student.mentorId ? await ctx.db.get(student.mentorId) : null;
        
        // Get recent applications
        const applications = await ctx.db
          .query("applications")
          .withIndex("by_student", (q) => q.eq("studentId", student._id))
          .order("desc")
          .take(3);

        const applicationsWithDetails = await Promise.all(
          applications.map(async (app) => {
            const opportunity = await ctx.db.get(app.opportunityId);
            const company = opportunity ? await ctx.db.get(opportunity.companyId) : null;
            return {
              status: app.status,
              position: opportunity?.title || "",
              company: company?.name || "",
            };
          })
        );

        // Get placement info
        const placement = await ctx.db
          .query("placements")
          .withIndex("by_student", (q) => q.eq("studentId", student._id))
          .first();
        
        let placementDetails = null;
        if (placement) {
          const company = await ctx.db.get(placement.companyId);
          placementDetails = {
            title: placement.title,
            company: company?.name || "",
            status: placement.status,
          };
        }

        return {
          id: student._id,
          name: `${student.firstName} ${student.lastName}`,
          rollNumber: student.rollNumber,
          email: user?.email || "",
          department: student.department,
          year: student.year,
          semester: student.semester,
          cgpa: student.cgpa,
          phone: student.phone,
          skills: student.skills || [],
          isPlaced: student.isPlaced,
          mentor: mentor?.name || "Not Assigned",
          status: user?.isActive ? "Active" : "Inactive",
          recentApplications: applicationsWithDetails,
          placement: placementDetails,
        };
      })
    );

    return {
      students: studentsWithDetails,
      total: filteredStudents.length,
    };
  },
});

export const getCompanies = query({
  args: {
    status: v.optional(v.string()),
    q: v.optional(v.string()),
    skip: v.optional(v.number()),
    take: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { status, q, skip = 0, take = 20 } = args;
    
    let companiesQuery = ctx.db.query("companies");
    
    // Apply status filter
    if (status === "Active") {
      companiesQuery = companiesQuery.filter((query) => query.eq(query.field("isVerified"), true));
    } else if (status === "Pending") {
      companiesQuery = companiesQuery.filter((query) => query.eq(query.field("isVerified"), false));
    }

    const allCompanies = await companiesQuery.collect();
    
    // Filter by search query if provided
    let filteredCompanies = allCompanies;
    if (q) {
      const searchLower = q.toLowerCase();
      filteredCompanies = allCompanies.filter(company => 
        company.name.toLowerCase().includes(searchLower)
      );
    }

    // Get details for each company
    const companiesWithDetails = await Promise.all(
      filteredCompanies.slice(skip, skip + take).map(async (company) => {
        const user = await ctx.db.get(company.userId);
        
        // Count opportunities, internships, placements
        const opportunities = await ctx.db
          .query("opportunities")
          .withIndex("by_company", (q) => q.eq("companyId", company._id))
          .collect();
        
        const internships = await ctx.db
          .query("internships")
          .withIndex("by_company", (q) => q.eq("companyId", company._id))
          .collect();
        
        const placements = await ctx.db
          .query("placements")
          .withIndex("by_company", (q) => q.eq("companyId", company._id))
          .collect();

        // Get recent active opportunities
        const recentOpportunities = await ctx.db
          .query("opportunities")
          .withIndex("by_company", (q) => q.eq("companyId", company._id))
          .filter((q) => q.eq(q.field("status"), "ACTIVE"))
          .take(3);

        const recentOppsWithApps = await Promise.all(
          recentOpportunities.map(async (opp) => {
            const applications = await ctx.db
              .query("applications")
              .withIndex("by_opportunity", (q) => q.eq("opportunityId", opp._id))
              .collect();
            
            return {
              id: opp._id,
              title: opp.title,
              type: opp.type,
              status: opp.status,
              applications: applications.length,
            };
          })
        );

        // Calculate application stats
        const allApplications = await Promise.all(
          opportunities.map(async (opp) => {
            return await ctx.db
              .query("applications")
              .withIndex("by_opportunity", (q) => q.eq("opportunityId", opp._id))
              .collect();
          })
        );
        
        const totalApplications = allApplications.flat().length;
        const selectedStudents = allApplications.flat().filter(
          app => ["SELECTED", "OFFER_ACCEPTED"].includes(app.status)
        ).length;

        return {
          id: company._id,
          name: company.name,
          email: user?.email || "",
          website: company.website,
          location: company.location,
          industry: company.industry,
          size: company.size,
          description: company.description,
          status: user?.isActive ? (company.isVerified ? "Active" : "Pending") : "Inactive",
          isVerified: company.isVerified,
          joinedDate: user?.createdAt,
          activeJobs: opportunities.filter(opp => opp.status === "ACTIVE").length,
          totalInternships: internships.length,
          totalPlacements: placements.length,
          totalApplications,
          selectedStudents,
          recentOpportunities: recentOppsWithApps,
        };
      })
    );

    return {
      companies: companiesWithDetails,
      total: filteredCompanies.length,
    };
  },
});

export const getFaculty = query({
  args: {
    q: v.optional(v.string()),
    department: v.optional(v.string()),
    skip: v.optional(v.number()),
    take: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { q, department, skip = 0, take = 20 } = args;
    
    let facultyQuery = ctx.db.query("faculty");
    
    if (department) {
      facultyQuery = facultyQuery.filter((query) => query.eq(query.field("department"), department));
    }

    const allFaculty = await facultyQuery.collect();
    
    // Filter by search query if provided
    let filteredFaculty = allFaculty;
    if (q) {
      const searchLower = q.toLowerCase();
      filteredFaculty = allFaculty.filter(faculty => 
        faculty.name.toLowerCase().includes(searchLower)
      );
    }

    // Get details for each faculty
    const facultyWithDetails = await Promise.all(
      filteredFaculty.slice(skip, skip + take).map(async (faculty) => {
        const user = await ctx.db.get(faculty.userId);
        
        // Count mentees
        const mentees = await ctx.db
          .query("students")
          .withIndex("by_mentor", (q) => q.eq("mentorId", faculty._id))
          .collect();

        return {
          id: faculty._id,
          name: faculty.name,
          email: user?.email || "",
          department: faculty.department,
          designation: faculty.designation,
          phone: faculty.phone,
          canMentor: faculty.canMentor,
          status: user?.isActive ? "Active" : "Inactive",
          menteeCount: mentees.length,
          mentees: mentees.map(student => ({
            id: student._id,
            name: `${student.firstName} ${student.lastName}`,
            rollNumber: student.rollNumber,
            department: student.department,
            year: student.year,
          })),
        };
      })
    );

    return {
      faculty: facultyWithDetails,
      total: filteredFaculty.length,
    };
  },
});

export const getOpportunities = query({
  args: {
    status: v.optional(v.string()),
    type: v.optional(v.string()),
    q: v.optional(v.string()),
    skip: v.optional(v.number()),
    take: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { status, type, q, skip = 0, take = 20 } = args;
    
    let opportunitiesQuery = ctx.db.query("opportunities");
    
    if (status) {
      opportunitiesQuery = opportunitiesQuery.filter((query) => query.eq(query.field("status"), status));
    }
    if (type) {
      opportunitiesQuery = opportunitiesQuery.filter((query) => query.eq(query.field("type"), type));
    }

    const allOpportunities = await opportunitiesQuery.collect();
    
    // Filter by search query if provided
    let filteredOpportunities = allOpportunities;
    if (q) {
      const searchLower = q.toLowerCase();
      filteredOpportunities = allOpportunities.filter(opp => 
        opp.title.toLowerCase().includes(searchLower)
      );
    }

    // Get details for each opportunity
    const opportunitiesWithDetails = await Promise.all(
      filteredOpportunities.slice(skip, skip + take).map(async (opportunity) => {
        const company = await ctx.db.get(opportunity.companyId);
        
        const applications = await ctx.db
          .query("applications")
          .withIndex("by_opportunity", (q) => q.eq("opportunityId", opportunity._id))
          .collect();

        return {
          id: opportunity._id,
          title: opportunity.title,
          description: opportunity.description,
          location: opportunity.location,
          type: opportunity.type,
          duration: opportunity.duration,
          stipend: opportunity.stipend,
          salary: opportunity.salary,
          requirements: opportunity.requirements,
          skills: opportunity.skills || [],
          deadline: opportunity.deadline,
          status: opportunity.status,
          company: company?.name || "",
          companyId: company?._id,
          totalApplications: applications.length,
          pendingApplications: applications.filter(app => app.status === "PENDING").length,
          selectedApplications: applications.filter(app => ["SELECTED", "OFFER_ACCEPTED"].includes(app.status)).length,
          createdAt: opportunity.createdAt,
        };
      })
    );

    return {
      opportunities: opportunitiesWithDetails,
      total: filteredOpportunities.length,
    };
  },
});

export const getApplications = query({
  args: {
    status: v.optional(v.string()),
    studentId: v.optional(v.id("students")),
    opportunityId: v.optional(v.id("opportunities")),
    skip: v.optional(v.number()),
    take: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { status, studentId, opportunityId, skip = 0, take = 20 } = args;
    
    let applicationsQuery = ctx.db.query("applications");
    
    if (status) {
      applicationsQuery = applicationsQuery.filter((q) => q.eq(q.field("status"), status));
    }
    if (studentId) {
      applicationsQuery = applicationsQuery.filter((q) => q.eq(q.field("studentId"), studentId));
    }
    if (opportunityId) {
      applicationsQuery = applicationsQuery.filter((q) => q.eq(q.field("opportunityId"), opportunityId));
    }

    const allApplications = await applicationsQuery.collect();
    
    // Get details for each application
    const applicationsWithDetails = await Promise.all(
      allApplications.slice(skip, skip + take).map(async (application) => {
        const student = await ctx.db.get(application.studentId);
        const opportunity = await ctx.db.get(application.opportunityId);
        const company = opportunity ? await ctx.db.get(opportunity.companyId) : null;

        return {
          id: application._id,
          status: application.status,
          appliedAt: application.appliedAt,
          updatedAt: application.updatedAt,
          mentorApproved: application.mentorApproved,
          adminApproved: application.adminApproved,
          adminRemarks: application.adminRemarks,
          mentorRemarks: application.mentorRemarks,
          student: student ? {
            id: student._id,
            name: `${student.firstName} ${student.lastName}`,
            rollNumber: student.rollNumber,
            department: student.department,
            year: student.year,
            cgpa: student.cgpa,
          } : null,
          opportunity: opportunity ? {
            id: opportunity._id,
            title: opportunity.title,
            type: opportunity.type,
            location: opportunity.location,
          } : null,
          company: company ? {
            id: company._id,
            name: company.name,
          } : null,
        };
      })
    );

    return {
      applications: applicationsWithDetails,
      total: allApplications.length,
    };
  },
});

// Dashboard analytics
export const getAdminAnalytics = query({
  args: {},
  handler: async (ctx) => {
    // Use more efficient queries with early filtering where possible
    const [students, companies, opportunities, applications, internships, placements] = await Promise.all([
      ctx.db.query("students").collect(),
      ctx.db.query("companies").collect(), 
      ctx.db.query("opportunities").withIndex("by_status", q => q.eq("status", "ACTIVE")).collect(),
      ctx.db.query("applications").withIndex("by_status", q => q.eq("status", "PENDING")).collect(),
      ctx.db.query("internships").collect(),
      ctx.db.query("placements").collect(),
    ]);

    const placedStudents = students.filter(s => s.isPlaced).length;
    const activeCompanies = companies.filter(c => c.isVerified).length;
    
    // Get all opportunities for total count
    const allOpportunities = await ctx.db.query("opportunities").collect();
    const allApplications = await ctx.db.query("applications").collect();

    return {
      totalStudents: students.length,
      activeCompanies,
      studentsPlaced: placedStudents, // Match the field name used in dashboard
      studentsInInternship: internships.length,
      totalCompanies: companies.length,
      pendingCompanies: companies.filter(c => !c.isVerified).length,
      totalOpportunities: allOpportunities.length,
      activeOpportunities: opportunities.length,
      totalApplications: allApplications.length,
      pendingApplications: applications.length,
      totalInternships: internships.length,
      totalPlacements: placements.length,
    };
  },
});
