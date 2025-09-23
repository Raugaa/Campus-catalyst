import { v } from "convex/values";
import { query } from "./_generated/server";

// Auth queries
export const getBranches = query({
  args: { collegeId: v.id("colleges") },
  handler: async (ctx, { collegeId }) => {
    return await ctx.db
      .query("branches")
      .withIndex("by_college", (q) => q.eq("collegeId", collegeId))
      .collect();
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first()
  },
})

export const getStudentById = query({
  args: { studentId: v.id("students") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.studentId);
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

export const getFacultyById = query({
  args: { facultyId: v.id("faculty") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.facultyId);
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
    mentorId: v.optional(v.id("faculty")),
    collegeId: v.optional(v.id("colleges")),
    skip: v.optional(v.number()),
    take: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { q, department, year, status, collegeId, skip = 0, take = 20 } = args;
    
    let allStudents;
    if (collegeId) {
      allStudents = await ctx.db
        .query("students")
        .withIndex("by_college", (q) => q.eq("collegeId", collegeId))
        .collect();
    } else {
      allStudents = await ctx.db.query("students").collect();
    }
    
    // Apply filters manually after getting the data
    let filteredStudents = allStudents;
    
    if (department) {
      filteredStudents = filteredStudents.filter(s => s.department === department);
    }
    if (year) {
      filteredStudents = filteredStudents.filter(s => s.year === year);
    }
    if (status === "placed") {
      filteredStudents = filteredStudents.filter(s => s.isPlaced === true);
    }
    if (status === "unplaced") {
      filteredStudents = filteredStudents.filter(s => s.isPlaced === false);
    }
    
    // Filter by search query if provided
    if (q) {
      const searchLower = q.toLowerCase();
      filteredStudents = filteredStudents.filter(student => 
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
            title: placement.jobTitle, // Fixed: use jobTitle instead of title
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
          collegeId: student.collegeId,
        };
      })
    );

    return studentsWithDetails;
  },
});

export const getCompanies = query({
  args: {
    status: v.optional(v.string()),
    q: v.optional(v.string()),
    collegeId: v.id("colleges"),
    skip: v.optional(v.number()),
    take: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { status, q, skip = 0, take = 20 } = args;

    let companiesQuery = ctx.db.query("companies").withIndex("by_college" , (q) => q.eq("collegeId", args.collegeId));

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
    collegeId: v.optional(v.id("colleges")),
    skip: v.optional(v.number()),
    take: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { q, department, collegeId, skip = 0, take = 50 } = args;
    
    let allFaculty;
    if (collegeId) {
      allFaculty = await ctx.db
        .query("faculty")
        .withIndex("by_college", (q) => q.eq("collegeId", collegeId))
        .collect();
    } else {
      allFaculty = await ctx.db.query("faculty").collect();
    }
    
    // Apply filters manually after getting the data
    let filteredFaculty = allFaculty;
    
    if (department) {
      filteredFaculty = filteredFaculty.filter(f => f.department === department);
    }
    
    if (q) {
      const searchLower = q.toLowerCase();
      filteredFaculty = filteredFaculty.filter(faculty => 
        faculty.name.toLowerCase().includes(searchLower)
      );
    }

    // Get details for each faculty
    const facultyWithDetails = await Promise.all(
      filteredFaculty.slice(skip, skip + take).map(async (faculty) => {
        const user = await ctx.db.get(faculty.userId);
        
        // Count mentees (only from the same college)
        const mentees = await ctx.db
          .query("students")
          .withIndex("by_mentor", (q) => q.eq("mentorId", faculty._id))
          .filter((q) => q.eq(q.field("collegeId"), faculty.collegeId))
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
          isActive: user?.isActive || false,
          menteeCount: mentees.length,
          mentees: mentees.map(student => ({
            id: student._id,
            name: `${student.firstName} ${student.lastName}`,
            rollNumber: student.rollNumber,
            department: student.department,
            year: student.year,
          })),
          userId: faculty.userId,
          userIsActive: user?.isActive,
          collegeId: faculty.collegeId,
        };
      })
    );

    return facultyWithDetails;
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


export const getDepartmentAnalytics = query({
  args: {
    collegeId: v.id("colleges"),
    year: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { collegeId, year } = args;
    
    // Get students filtered by college and year
    let studentsQuery = ctx.db.query("students").withIndex("by_college", (q) => q.eq("collegeId", collegeId));
    
    const allStudents = await studentsQuery.collect();
    const students = year ? allStudents.filter(s => s.year === year) : allStudents;
    
    // Get all placements
    const placements = await ctx.db.query("placements").collect();
    const studentIds = students.map(s => s._id);
    const relevantPlacements = placements.filter(p => studentIds.includes(p.studentId));
    
    // Group by department
    const departmentStats = students.reduce((acc, student) => {
      const dept = student.department;
      if (!acc[dept]) {
        acc[dept] = {
          name: dept,
          students: 0,
          placed: 0,
        };
      }
      acc[dept].students++;
      
      // Check if this student is placed
      const isPlaced = relevantPlacements.some(p => p.studentId === student._id);
      if (isPlaced) {
        acc[dept].placed++;
      }
      
      return acc;
    }, {} as Record<string, { name: string; students: number; placed: number }>);
    
    // Convert to array and add rate
    return Object.values(departmentStats).map(dept => ({
      ...dept,
      rate: dept.students > 0 ? (dept.placed / dept.students) * 100 : 0,
    }));
  },
});

export const getTopRecruitingCompanies = query({
  args: {
    collegeId: v.optional(v.id("colleges")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { collegeId, limit = 5 } = args;
    
    // Get all placements and internships
    const placements = await ctx.db.query("placements").collect();
    const internships = await ctx.db.query("internships").collect();
    
    // If collegeId is provided, filter by college students
    let relevantPlacements = placements;
    let relevantInternships = internships;
    
    if (collegeId) {
      const students = await ctx.db.query("students")
        .withIndex("by_college", (q) => q.eq("collegeId", collegeId))
        .collect();
      const studentIds = students.map(s => s._id);
      
      relevantPlacements = placements.filter(p => studentIds.includes(p.studentId));
      relevantInternships = internships.filter(i => studentIds.includes(i.studentId));
    }
    
    // Count hires by company
    const companyHires = new Map<string, number>();
    
    relevantPlacements.forEach(placement => {
      const count = companyHires.get(placement.companyId) || 0;
      companyHires.set(placement.companyId, count + 1);
    });
    
    relevantInternships.forEach(internship => {
      const count = companyHires.get(internship.companyId) || 0;
      companyHires.set(internship.companyId, count + 1);
    });
    
    // Get company details and sort by hires
    const companies = await Promise.all(
      Array.from(companyHires.entries()).map(async ([companyId, hires]) => {
        const company = await ctx.db.query("companies")
          .withIndex("by_id", (q) => q.eq("_id", companyId as any))
          .first();
        return company ? {
          id: companyId,
          name: company.name,
          hires,
        } : null;
      })
    );
    
    return companies
      .filter(Boolean)
      .sort((a, b) => b!.hires - a!.hires)
      .slice(0, limit);
  },
});

export const getTopOpportunities = query({
  args: {
    collegeId: v.optional(v.id("colleges")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { collegeId, limit = 3 } = args;
    
    // Get active opportunities
    const opportunities = await ctx.db.query("opportunities")
      .withIndex("by_status", (q) => q.eq("status", "ACTIVE"))
      .order("desc")
      .take(limit * 2);
    
    // Get applications for each opportunity
    const opportunitiesWithStats = await Promise.all(
      opportunities.map(async (opportunity) => {
        const company = await ctx.db.get(opportunity.companyId);
        const applications = await ctx.db.query("applications")
          .withIndex("by_opportunity", (q) => q.eq("opportunityId", opportunity._id))
          .collect();
        
        // If collegeId filter is needed, check if students are from that college
        let relevantApplications = applications;
        if (collegeId) {
          const studentIds = applications.map(app => app.studentId);
          const students = await Promise.all(
            studentIds.map(id => ctx.db.get(id))
          );
          relevantApplications = applications.filter((_, index) => 
            students[index]?.collegeId === collegeId
          );
        }
        
        return {
          _id: opportunity._id,
          title: opportunity.title,
          companyName: company?.name || "Unknown Company",
          status: opportunity.status,
          applicationCount: relevantApplications.length,
          deadline: opportunity.deadline,
        };
      })
    );
    
    return opportunitiesWithStats
      .sort((a, b) => b.applicationCount - a.applicationCount)
      .slice(0, limit);
  },
});

export const getQuickStats = query({
  args: {
    collegeId: v.optional(v.id("colleges")),
  },
  handler: async (ctx, args) => {
    const { collegeId } = args;
    
    // Get today's timestamp range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();
    const todayEnd = todayStart + (24 * 60 * 60 * 1000);
    
    // Get applications from today
    const todayApplications = await ctx.db.query("applications")
      .withIndex("by_applied_at", (q) => 
        q.gte("appliedAt", todayStart).lt("appliedAt", todayEnd)
      )
      .collect();
    
    let relevantTodayApplications = todayApplications;
    
    // Filter by college if provided
    if (collegeId) {
      const students = await ctx.db.query("students")
        .withIndex("by_college", (q) => q.eq("collegeId", collegeId))
        .collect();
      const studentIds = students.map(s => s._id);
      relevantTodayApplications = todayApplications.filter(app => 
        studentIds.includes(app.studentId)
      );
    }
    
    return {
      applicationsToday: relevantTodayApplications.length,
      interviewsScheduled: 8,
      offersExtended: 5,
      offersAccepted: 3,
    };
  },
});


export const getUnassignedStudents = query({
  args: {
    collegeId: v.optional(v.id("colleges")),
    department: v.optional(v.string()),
    year: v.optional(v.string()),
    q: v.optional(v.string()),
    skip: v.optional(v.number()),
    take: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { collegeId, department, year, q, skip = 0, take = 20 } = args;
    
    // Get students without a mentor in the specified college
    if (!collegeId){
      throw new Error("collegeId is required");
    }
    let studentsQuery = ctx.db
      .query("students")
      .withIndex("by_college", (q) => q.eq("collegeId", collegeId))
      .filter((q) => q.eq(q.field("mentorId"), undefined));
    
    // Apply department filter
    if (department) {
      studentsQuery = studentsQuery.filter((q) => 
        q.eq(q.field("department"), department)
      );
    }
    
    // Apply year filter
    if (year) {
      studentsQuery = studentsQuery.filter((q) => 
        q.eq(q.field("year"), year)
      );
    }
    
    const unassignedStudents = await studentsQuery
      .order("desc")
      .collect();

    // Apply search filter (case-insensitive search across multiple fields)
    let filteredStudents = unassignedStudents;
    if (q && q.trim()) {
      const searchTerm = q.toLowerCase().trim();
      
      // Get user emails for search
      const userIds = unassignedStudents.map(s => s.userId);
      const users = await Promise.all(userIds.map(id => ctx.db.get(id)));
      
      filteredStudents = unassignedStudents.filter((student, index) => {
        const user = users[index];
        const searchableText = [
          student.firstName?.toLowerCase(),
          student.lastName?.toLowerCase(),
          student.rollNumber?.toLowerCase(),
          student.department?.toLowerCase(),
          student.year?.toLowerCase(),
          user?.email?.toLowerCase(),
          student.phone,
          ...(student.skills || []).map(skill => skill.toLowerCase()),
        ].join(" ");
        
        return searchableText.includes(searchTerm);
      });
    }

    // Apply pagination
    const paginatedStudents = filteredStudents.slice(skip, skip + take);
      
    // Get details for each unassigned student
    const studentsWithDetails = await Promise.all(
      paginatedStudents.map(async (student) => {
        // Get user details
        const user = await ctx.db.get(student.userId);
        
        // Get college details
        const college = await ctx.db.get(student.collegeId);
        
        // Count total applications for this student
        const applications = await ctx.db
          .query("applications")
          .withIndex("by_student", (q) => q.eq("studentId", student._id))
          .collect();
        
        // Count active applications
        const activeApplications = applications.filter(app => 
          ["PENDING", "MENTOR_REVIEW", "ADMIN_REVIEW", "SUBMITTED", "SHORTLISTED"].includes(app.status)
        );
        
        // Count successful applications
        const successfulApplications = applications.filter(app => 
          ["SELECTED", "OFFER_ACCEPTED"].includes(app.status)
        );

        return {
          _id: student._id,
          _creationTime: student._creationTime,
          userId: student.userId,
          firstName: student.firstName,
          lastName: student.lastName,
          fullName: `${student.firstName} ${student.lastName}`,
          rollNumber: student.rollNumber,
          phone: student.phone,
          email: user?.email,
          department: student.department,
          year: student.year,
          semester: student.semester,
          cgpa: student.cgpa,
          skills: student.skills,
          resumeUrl: student.resumeUrl,
          bio: student.bio,
          isPlaced: student.isPlaced,
          collegeId: student.collegeId,
          collegeName: college?.name,
          mentorId: student.mentorId,
          isActive: user?.isActive,
          createdAt: student.createdAt,
          updatedAt: student.updatedAt,
          // Application statistics
          totalApplications: applications.length,
          activeApplications: activeApplications.length,
          successfulApplications: successfulApplications.length,
          // Additional computed fields
          applicationSuccessRate: applications.length > 0 
            ? Math.round((successfulApplications.length / applications.length) * 100) 
            : 0,
        };
      })
    );

    // Get total count for pagination (after filtering)
    const totalCount = filteredStudents.length;
    const hasMore = skip + take < totalCount;
    const totalPages = Math.ceil(totalCount / take);
    const currentPage = Math.floor(skip / take) + 1;

    // Get filter options for UI
    const allUnassigned = unassignedStudents; // Before search filter
    const availableDepartments = [...new Set(allUnassigned.map(s => s.department))].sort();
    const availableYears = [...new Set(allUnassigned.map(s => s.year))].sort();

    return {
      students: studentsWithDetails,
      pagination: {
        total: totalCount,
        skip,
        take,
        hasMore,
        totalPages,
        currentPage,
      },
      filters: {
        availableDepartments,
        availableYears,
        appliedFilters: {
          department,
          year,
          searchQuery: q,
        },
      },
      summary: {
        totalUnassigned: allUnassigned.length,
        filteredCount: totalCount,
        displayedCount: studentsWithDetails.length,
        departmentBreakdown: filteredStudents.reduce((acc, student) => {
          acc[student.department] = (acc[student.department] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        yearBreakdown: filteredStudents.reduce((acc, student) => {
          acc[student.year] = (acc[student.year] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      },
    };
  },
});


export const getRecentOpportunities = query({
  args: {
    collegeId: v.id("colleges"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { collegeId, limit = 5 } = args;
    
    // Get all companies associated with the college
    const companies = await ctx.db
      .query("companies")
      .withIndex("by_college", (q) => q.eq("collegeId", collegeId))
      .collect();
    const companyIds = companies.map(c => c._id);
    
    // Get recent opportunities from these companies
    const opportunities = await Promise.all(
      companyIds.map(async (companyId) => {
        return await ctx.db
          .query("opportunities")
          .withIndex("by_company", (q) => q.eq("companyId", companyId))
          .collect();
      })
    );

    // Flatten the array of arrays and limit the results
    const recentOpportunities = opportunities.flat().slice(0, limit);

    return recentOpportunities;
  },
});

export const getIndustryDistribution = query({
  args: {
    collegeId: v.optional(v.id("colleges")),
  },
  handler: async (ctx, args) => {
    const { collegeId } = args;
    
    // Get students filtered by college
    let students = [];
    if (collegeId) {
      students = await ctx.db.query("students")
        .withIndex("by_college", (q) => q.eq("collegeId", collegeId))
        .collect();
    } else {
      students = await ctx.db.query("students").collect();
    }
    
    const studentIds = students.map(s => s._id);
    
    // Get all placements for these students
    const placements = await ctx.db.query("placements").collect();
    const relevantPlacements = placements.filter(p => studentIds.includes(p.studentId));
    
    // Get companies and their industries
    const companies = await ctx.db.query("companies").collect();
    const companyIndustryMap = new Map();
    companies.forEach(company => {
      companyIndustryMap.set(company._id, company.industry || "Unknown");
    });
    
    // Count placements by industry
    const industryCount = new Map();
    relevantPlacements.forEach(placement => {
      const industry = companyIndustryMap.get(placement.companyId) || "Unknown";
      industryCount.set(industry, (industryCount.get(industry) || 0) + 1);
    });
    
    const totalPlacements = relevantPlacements.length;
    
    // Convert to array with percentages
    return Array.from(industryCount.entries()).map(([name, count]) => ({
      name,
      count,
      percentage: totalPlacements > 0 ? (count / totalPlacements) * 100 : 0,
    })).sort((a, b) => b.count - a.count);
  },
});

export const getApplicationTrends = query({
  args: {
    collegeId: v.optional(v.id("colleges")),
  },
  handler: async (ctx, args) => {
    const { collegeId } = args;
    
    // Get students filtered by college
    let students = [];
    if (collegeId) {
      students = await ctx.db.query("students")
        .withIndex("by_college", (q) => q.eq("collegeId", collegeId))
        .collect();
    } else {
      students = await ctx.db.query("students").collect();
    }
    
    const studentIds = students.map(s => s._id);
    
    // Get applications for these students
    const applications = await ctx.db.query("applications").collect();
    const relevantApplications = applications.filter(app => studentIds.includes(app.studentId));
    
    // Get placements for success rate calculation
    const placements = await ctx.db.query("placements").collect();
    const relevantPlacements = placements.filter(p => studentIds.includes(p.studentId));
    
    // Group by month for the last 6 months
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    const currentDate = new Date();
    const monthlyData = [];
    
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = months[targetDate.getMonth()];
      const year = targetDate.getFullYear();
      
      // Get applications for this month
      const monthApplications = relevantApplications.filter(app => {
        const appDate = new Date(app.appliedAt);
        return appDate.getMonth() === targetDate.getMonth() && 
               appDate.getFullYear() === targetDate.getFullYear();
      });
      
      // Get placements for this month (approximate by placement date if available)
      const monthPlacements = relevantPlacements.filter(placement => {
        if (!placement.joinDate) return false;
        const placementDate = new Date(placement.joinDate);
        return placementDate.getMonth() === targetDate.getMonth() && 
               placementDate.getFullYear() === targetDate.getFullYear();
      });
      
      monthlyData.push({
        month: `${monthName.substring(0, 3)} ${year}`,
        applications: monthApplications.length,
        success: monthPlacements.length,
      });
    }
    
    return monthlyData;
  },
});

export const getSalaryTrends = query({
  args: {
    collegeId: v.optional(v.id("colleges")),
  },
  handler: async (ctx, args) => {
    const { collegeId } = args;
    
    // Get students filtered by college
    let students = [];
    if (collegeId) {
      students = await ctx.db.query("students")
        .withIndex("by_college", (q) => q.eq("collegeId", collegeId))
        .collect();
    } else {
      students = await ctx.db.query("students").collect();
    }
    
    const studentIds = students.map(s => s._id);
    
    // Get placements for these students with salary data
    const placements = await ctx.db.query("placements").collect();
    const relevantPlacements = placements.filter(p => 
      studentIds.includes(p.studentId) && p.salary && p.salary > 0
    );
    
    // Group by year
    const yearlyData = new Map();
    
    relevantPlacements.forEach(placement => {
      const year = placement.joinDate ? 
        new Date(placement.joinDate).getFullYear() : 
        new Date().getFullYear();
      
      if (!yearlyData.has(year)) {
        yearlyData.set(year, []);
      }
      yearlyData.get(year).push(placement.salary);
    });
    
    // Calculate statistics for each year
    return Array.from(yearlyData.entries()).map(([year, salaries]) => {
      const avg = salaries.reduce((sum : any, salary : any) => sum + salary, 0) / salaries.length;
      const highest = Math.max(...salaries);
      const lowest = Math.min(...salaries);
      
      return {
        year: year.toString(),
        avg: `₹${(avg / 100000).toFixed(1)}L`,
        highest: `₹${(highest / 100000).toFixed(1)}L`,
        lowest: `₹${(lowest / 100000).toFixed(1)}L`,
        count: salaries.length,
      };
    }).sort((a, b) => parseInt(b.year) - parseInt(a.year));
  },
});

// Update getAdminAnalytics to include additional fields needed by analytics page
export const getAdminAnalytics = query({
  args: {
    collegeId: v.optional(v.id("colleges")),
    year: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { collegeId, year } = args;
    if (!collegeId) {
      throw new Error("collegeId is required");
    } 
    // Base query for students
    let studentsQuery = ctx.db.query("students").withIndex("by_college", (q) =>  q.eq("collegeId", collegeId) 
    );
    
   
    const allStudents = await studentsQuery.collect();
    
    // Filter by year if provided
    const students = year ? allStudents.filter(s => s.year === year) : allStudents;
    
    // Get placements for these students
    const studentIds = students.map(s => s._id);
    const placements = await ctx.db.query("placements").collect();
    const placedStudents = placements.filter(p => studentIds.includes(p.studentId));
    
    // Get internships for these students
    const internships = await ctx.db.query("internships").collect();
    const studentsInInternship = internships.filter(i => 
      studentIds.includes(i.studentId) && 
      ["UPCOMING", "ACTIVE"].includes(i.status)
    );
    
    // Get active companies
    const companies = await ctx.db.query("companies")
      .withIndex("by_verified", (q) => q.eq("isVerified", true))
      .collect();
    
    // Get pending companies
    const pendingCompanies = await ctx.db.query("companies")
      .withIndex("by_verified", (q) => q.eq("isVerified", false))
      .collect();
    
    // Get all companies
    const allCompanies = await ctx.db.query("companies").collect();
    
    // Get applications
    const applications = await ctx.db.query("applications").collect();
    const studentApplications = applications.filter(app => studentIds.includes(app.studentId));
    
    const faculty = collegeId ? 
      await ctx.db.query("faculty")
        .withIndex("by_college", (q) => q.eq("collegeId", collegeId))
        .collect() :
      await ctx.db.query("faculty").collect();
    
    // Get opportunities
    const opportunities = await ctx.db.query("opportunities")
      .withIndex("by_status", (q) => q.eq("status", "ACTIVE"))
      .collect();
    
    return {
      totalStudents: students.length,
      studentsPlaced: placedStudents.length,
      studentsInInternship: studentsInInternship.length,
      activeCompanies: companies.length,
      pendingCompanies: pendingCompanies.length,
      totalCompanies: allCompanies.length,
      totalApplications: studentApplications.length,
      pendingApplications: studentApplications.filter(app => 
        ["PENDING", "MENTOR_REVIEW", "ADMIN_REVIEW"].includes(app.status)
      ).length,
      totalFaculty: faculty.length,
      activeFaculty: faculty.filter(f => f.canMentor === true).length,
      totalInternships: internships.filter(i => studentIds.includes(i.studentId)).length,
      activeOpportunities: opportunities.length,
      totalStudentsGrowth: "+12%",
      placementGrowth: "+15%", 
      internshipGrowth: "+22%",
      newCompaniesThisMonth: 8,
      pendingInternshipInterviews: 65,
      pendingFulltimeInterviews: 26,
      newCompaniesThisSemester: 23,
      newMajorPartners: 3,
      internshipGrowthPercent: 15,
      fulltimeGrowthPercent: 8,
    };
  },
});


export const getCollegeIdByFacultyId = query({
  args: {
    facultyId: v.id("faculty"),
  },
  handler: async (ctx, args) => {
    const { facultyId } = args;

    const faculty = await ctx.db.query("faculty").withIndex("by_id", (q) => q.eq("_id", facultyId)).first();
    if (!faculty) {
      throw new Error("Faculty not found");
    }
    console.log("Faculty's collegeId:", faculty);

    return faculty;
  }
})