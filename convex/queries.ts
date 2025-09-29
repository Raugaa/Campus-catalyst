import { v } from "convex/values";
import { query } from "./_generated/server";
import { api } from "./_generated/api";

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
    const faculty = await ctx.db.get(args.facultyId);
    if (!faculty) return null;

    // Get the user data for the faculty
    const user = await ctx.db.get(faculty.userId);

    // Get mentees (students assigned to this faculty)
    const mentees = await ctx.db
      .query("students")
      .withIndex("by_mentor", (q) => q.eq("mentorId", args.facultyId))
      .collect();

    // Count mentees
    const menteeCount = mentees.length;

    return {
      ...faculty,
      email: user?.email || "",
      isActive: user?.isActive || false,
      mentees: mentees,
      menteeCount: menteeCount
    };
  },
});

export const getStudentById = query({
  args: { studentId: v.id("students") },
  handler: async (ctx, args) => {
    const student = await ctx.db.get(args.studentId);
    if (!student) return null;

    // Get the user data for the student
    const user = await ctx.db.get(student.userId);

    // Get applications for this student
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .collect();

    // Get opportunities for the applications
    const applicationsWithOpportunities = await Promise.all(
      applications.map(async (app) => {
        const opportunity = app.opportunityId ? await ctx.db.get(app.opportunityId) : null;
        return {
          ...app,
          opportunity: opportunity
        };
      })
    );
    const faculty = student.mentorId ? await ctx.db.get(student.mentorId) : null;
    const college = student.collegeId ? await ctx.db.get(student.collegeId) : null;
    // Get placements for this student
    const placement = await ctx.db
      .query("placements")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .collect();
    // Get internships for this student
    const internships = await ctx.db
      .query("internships")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .collect();
    const branch = student.branchId ? await ctx.db.get(student.branchId) : null;

    const company = placement.length > 0 ? placement[0].companyId ? await ctx.db.get(placement[0].companyId) : null : null;

    return {
      ...student,
      name: student.firstName ? `${student.firstName} ${student.lastName || ''}`.trim() : undefined,
      email: user?.email || "",
      isActive: user?.isActive || false,
      applications: applicationsWithOpportunities,
      placements: placement,
      internships: internships,
      mentor: faculty?.name,
      collegeName : college?.name,
      branchName : branch?.name,
      branchCode : branch?.code?.toUpperCase(),
      companyName : company?.name,
    };
  },
});

export const getGlobalAdminByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.query("globalAdmins")
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
      const departmentLower = department.toLowerCase();
      filteredStudents = filteredStudents.filter(s => 
        s.department.toLowerCase() === departmentLower
      );
    }
    
    if (year) {
      filteredStudents = filteredStudents.filter(s => s.year === year);
    }
    
    if (status === "placed") {
      filteredStudents = filteredStudents.filter(s => s.isPlaced === true);
    }
    
    if (q) {
      const searchLower = q.toLowerCase();
      filteredStudents = filteredStudents.filter(student => 
        student.firstName.toLowerCase().includes(searchLower) ||
        student.lastName.toLowerCase().includes(searchLower) ||
        student.rollNumber.toLowerCase().includes(searchLower) ||
        student.department.toLowerCase().includes(searchLower)
      );
    }

    // Get details for each student including user info
    const studentsWithDetails = await Promise.all(
      filteredStudents.slice(skip, skip + take).map(async (student) => {
        const user = await ctx.db.get(student.userId);
        const branch = student.branchId ? await ctx.db.get(student.branchId) : null;
        
        return {
          ...student,
          user: user ? {
            _id: user._id,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
          } : null,
          branch: branch ? {
            _id: branch._id,
            name: branch.name,
            code: branch.code,
          } : null,
        };
      })
    );

    return {
      students: studentsWithDetails,
      total: filteredStudents.length,
      hasMore: skip + take < filteredStudents.length,
    };
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

export const getOpportunityById = query({
  args: { opportunityId: v.id("opportunities") },
  handler: async (ctx, args) => {
    const opportunity = await ctx.db.get(args.opportunityId);
    
    if (!opportunity) {
      return null;
    }
    
    // Only fetch company if companyId exists
    let company = null;
    if (opportunity.companyId) {
      company = await ctx.db.get(opportunity.companyId);
    }
    
    return {
      ...opportunity,
      company: company ? {
        _id: company._id,
        name: company.name,
        logo: company.logo,
        industry: company.industry
      } : null
    };
  },
});

export const getOpportunities = query({
  args: {
    status: v.optional(v.string()),
    type: v.optional(v.string()),
    collegeId: v.optional(v.id("colleges")),
    limit: v.optional(v.number()),
    companyId: v.optional(v.id("companies")),
    // ADD THESE MISSING PARAMETERS
    skip: v.optional(v.number()),
    take: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { skip = 0, take = 20, limit, ...filters } = args;
    
    let query = ctx.db.query("opportunities");
    
    // Apply filters
    if (filters.status) {
      query = query.filter((q) => q.eq(q.field("status"), filters.status));
    }
    
    if (filters.type) {
      query = query.filter((q) => q.eq(q.field("type"), filters.type));
    }
    
    if (filters.companyId) {
      query = query.filter((q) => q.eq(q.field("companyId"), filters.companyId));
    }

    // ✅ Filter by college ID if provided
    if (filters.collegeId) {
      query = query.filter((q) => q.eq(q.field("collegeId"), filters.collegeId));
    }
    
    // Use take parameter for pagination, fallback to limit if not provided
    const effectiveLimit = take || limit || 20;
    
    let opportunities = await query
      .order("desc")
      .collect();
    
    // Apply pagination manually since Convex doesn't have native skip/take
    const paginatedOpportunities = opportunities.slice(skip, skip + effectiveLimit);
    
    // Fetch company details for each opportunity
    const opportunitiesWithCompanies = await Promise.all(
      paginatedOpportunities.map(async (opportunity) => {
        let company = null;
        
        // Only fetch company if companyId exists
        if (opportunity.companyId) {
          company = await ctx.db.get(opportunity.companyId);
        }
        
        return {
          ...opportunity,
          company: company ? {
            _id: company._id,
            name: company.name,
            logo: company.logo,
            industry: company.industry
          } : null,
          // Use external company name if no company record
          companyName: company?.name || opportunity.externalCompanyName || "Unknown Company"
        };
      })
    );
    
    return { 
      opportunities: opportunitiesWithCompanies,
      total: opportunities.length,
      hasMore: skip + effectiveLimit < opportunities.length,
      skip,
      take: effectiveLimit
    };
  },
});

// Fix any other queries that have similar issues
export const getCompanyOpportunities = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    const opportunities = await ctx.db
      .query("opportunities")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .order("desc")
      .collect();
    
    const company = await ctx.db.get(args.companyId);
    
    return {
      opportunities,
      company: company ? {
        _id: company._id,
        name: company.name,
        logo: company.logo
      } : null
    };
  },
});

// Add these missing analytics queries:

export const getAdminAnalytics = query({
  args: { 
    collegeId: v.id("colleges"),
    year: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    if (!args.collegeId) {
      throw new Error("collegeId is required");
    }

    // Get basic counts
    let students = await ctx.db
      .query("students")
      .withIndex("by_college", (q) => q.eq("collegeId", args.collegeId))
      .collect();

    // Filter by year if specified
    if (args.year && args.year !== "All") {
      students = students.filter(s => s.year === args.year);
    }

    const totalStudents = students.length;
    const studentsPlaced = students.filter(s => s.isPlaced).length;

    // Get applications for these students
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_college", (q) => q.eq("collegeId", args.collegeId))
      .collect();

    const totalApplications = applications.length;
    const acceptedApplications = applications.filter(app => 
      ["SELECTED", "OFFER_ACCEPTED"].includes(app.status)
    ).length;

    // Get active opportunities
    const opportunities = await ctx.db
      .query("opportunities")
      .withIndex("by_college", (q) => q.eq("collegeId", args.collegeId))
      .filter((q) => q.eq(q.field("status"), "ACTIVE"))
      .collect();

    const activeOpportunities = opportunities.length;

    // Get companies
    const companies = await ctx.db
      .query("companies")
      .withIndex("by_college", (q) => q.eq("collegeId", args.collegeId))
      .filter((q) => q.eq(q.field("isVerified"), true))
      .collect();

    const verifiedCompanies = companies.length;

    // Get internships
    const internships = await ctx.db
      .query("internships")
      .withIndex("by_college", (q) => q.eq("collegeId", args.collegeId))
      .collect();

    const studentsInInternship = internships.filter(i => 
      i.status === "ACTIVE" || i.status === "UPCOMING"
    ).length;

    return {
      totalStudents,
      studentsPlaced,
      studentsInInternship,
      totalApplications,
      acceptedApplications,
      activeOpportunities,
      verifiedCompanies,
      placementRate: totalStudents > 0 ? (studentsPlaced / totalStudents) * 100 : 0,
      applicationSuccessRate: totalApplications > 0 ? (acceptedApplications / totalApplications) * 100 : 0,
    };
  },
});

export const getDepartmentAnalytics = query({
  args: { collegeId: v.id("colleges") ,
    year: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    if (!args.collegeId) {
      throw new Error("collegeId is required");
    }

    // Get all students with their branch information
    const students = await ctx.db
      .query("students")
      .withIndex("by_college", (q) => q.eq("collegeId", args.collegeId))
      .collect();

    // Get all branches for this college
    const branches = await ctx.db
      .query("branches")
      .withIndex("by_college", (q) => q.eq("collegeId", args.collegeId))
      .collect();

    // Create a map of branchId to branch info
    const branchMap = new Map();
    branches.forEach(branch => {
      branchMap.set(branch._id, { name: branch.name, code: branch.code });
    });

    // Group by department using branch information
    const departmentMap = new Map<string, { total: number; placed: number; code: string }>();

    students.forEach(student => {
      // Get department from branch if available, otherwise use student.department
      const branchInfo = branchMap.get(student.branchId);
      const dept = branchInfo ? branchInfo.name : student.department;
      const deptCode = branchInfo ? branchInfo.code : student.department.substring(0, 3).toUpperCase();
      
      if (!departmentMap.has(dept)) {
        departmentMap.set(dept, { total: 0, placed: 0, code: deptCode });
      }
      
      // Filter by year if specified
      if (args.year && args.year !== "All" && student.year !== args.year) {
        return;
      }
      
      const deptData = departmentMap.get(dept)!;
      deptData.total++;
      if (student.isPlaced) {
        deptData.placed++;
      }
    });

    // Convert to array format with codes
    const departmentData = Array.from(departmentMap.entries()).map(([name, data]) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      code: data.code,
      total: data.total,
      placed: data.placed,
      percentage: data.total > 0 ? Math.round((data.placed / data.total) * 100) : 0,
    }));

    return departmentData;
  },
});

export const getTopRecruitingCompanies = query({
  args: { 
    collegeId: v.id("colleges"), 
    limit: v.optional(v.number()) 
  },
  handler: async (ctx, args) => {
    if (!args.collegeId) {
      throw new Error("collegeId is required");
    }

    const limit = args.limit || 10;

    // Get all accepted applications for this college
    const acceptedApplications = await ctx.db
      .query("applications")
      .withIndex("by_college", (q) => q.eq("collegeId", args.collegeId))
      .filter((q) => 
        q.or(
          q.eq(q.field("status"), "SELECTED"),
          q.eq(q.field("status"), "OFFER_ACCEPTED")
        )
      )
      .collect();

    // Count hires by company
    const companyHires = new Map<string, { name: string; hires: number }>();

    for (const application of acceptedApplications) {
      const company = await ctx.db.get(application.companyId);
      if (company) {
        const companyKey = company._id;
        if (companyHires.has(companyKey)) {
          companyHires.get(companyKey)!.hires++;
        } else {
          companyHires.set(companyKey, { name: company.name, hires: 1 });
        }
      }
    }

    // Sort by hires and return top companies
    const topCompanies = Array.from(companyHires.values())
      .sort((a, b) => b.hires - a.hires)
      .slice(0, limit)
      .map((company, index) => ({
        id: `company-${index}`,
        name: company.name,
        hires: company.hires,
      }));

    return topCompanies;
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

// Add these missing queries:

export const getTopOpportunities = query({
  args: { 
    collegeId: v.id("colleges"), 
    limit: v.optional(v.number()) 
  },
  handler: async (ctx, args) => {
    if (!args.collegeId) {
      throw new Error("collegeId is required");
    }

    const limit = args.limit || 10;
    
    // Get opportunities with their application counts
    const opportunities = await ctx.db
      .query("opportunities")
      .withIndex("by_college", (q) => q.eq("collegeId", args.collegeId))
      .filter((q) => q.eq(q.field("status"), "ACTIVE"))
      .order("desc")
      .take(limit);

    // Get application counts for each opportunity
    const opportunitiesWithStats = await Promise.all(
      opportunities.map(async (opp) => {
        const base = ctx.db
          .query("applications")
          .withIndex("by_opportunity", (q) => q.eq("opportunityId", opp._id));
        const applications = opp.companyId
          ? await base.filter((q) => q.eq(q.field("companyId"), opp.companyId)).collect()
          : await base.collect();


        const company = opp.companyId ? await ctx.db.get(opp.companyId) : null;

        return {
          id: opp._id,
          title: opp.title,
          company: company?.name || opp.externalCompanyName || "Unknown Company",
          type: opp.type,
          applications: applications.length,
          deadline: opp.deadline,
          status: opp.status,
        };
      })
    );

    // Sort by application count
    return opportunitiesWithStats.sort((a, b) => b.applications - a.applications);
  },
});

export const getQuickStats = query({
  args: { collegeId: v.id("colleges") },
  handler: async (ctx, args) => {
    if (!args.collegeId) {
      throw new Error("collegeId is required");
    }

    // Get counts for quick stats
    const [students, companies, opportunities, applications] = await Promise.all([
      ctx.db
        .query("students")
        .withIndex("by_college", (q) => q.eq("collegeId", args.collegeId))
        .collect(),
      
      ctx.db
        .query("companies")
        .withIndex("by_college", (q) => q.eq("collegeId", args.collegeId))
        .filter((q) => q.eq(q.field("isVerified"), true))
        .collect(),
      
      ctx.db
        .query("opportunities")
        .withIndex("by_college", (q) => q.eq("collegeId", args.collegeId))
        .filter((q) => q.eq(q.field("status"), "ACTIVE"))
        .collect(),
      
      ctx.db
        .query("applications")
        .withIndex("by_college", (q) => q.eq("collegeId", args.collegeId))
        .collect()
    ]);

    const placedStudents = students.filter(s => s.isPlaced).length;
    const pendingApplications = applications.filter(app => app.status === "PENDING").length;

    return {
      totalStudents: students.length,
      placedStudents,
      verifiedCompanies: companies.length,
      activeOpportunities: opportunities.length,
      totalApplications: applications.length,
      pendingApplications,
    };
  },
});

export const getCTCAnalytics = query({
  args: { 
    collegeId: v.id("colleges"),
    year: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    if (!args.collegeId) {
      throw new Error("collegeId is required");
    }

    // Get placements for this college
    let placements = await ctx.db
      .query("placements")
      .collect();

    // Filter by college through student relationship
    const collegeStudents = await ctx.db
      .query("students")
      .withIndex("by_college", (q) => q.eq("collegeId", args.collegeId))
      .collect();

    const studentIds = new Set(collegeStudents.map(s => s._id));
    placements = placements.filter(p => studentIds.has(p.studentId));

    // Filter by year if specified
    if (args.year && args.year !== "All") {
      const yearStudents = collegeStudents.filter(s => s.year === args.year);
      const yearStudentIds = new Set(yearStudents.map(s => s._id));
      placements = placements.filter(p => yearStudentIds.has(p.studentId));
    }

    if (placements.length === 0) {
      return {
        averagePackage: 0,
        highestPackage: 0,
        lowestPackage: 0,
        totalOffers: 0,
      };
    }

    const salaries = placements.map(p => p.salary).filter(s => s > 0);
    
    return {
      averagePackage: salaries.length > 0 ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length) : 0,
      highestPackage: salaries.length > 0 ? Math.max(...salaries) : 0,
      lowestPackage: salaries.length > 0 ? Math.min(...salaries) : 0,
      totalOffers: placements.length,
      below5LPA: placements.filter(p => p.salary < 500000).length,
      between5to10LPA: placements.filter(p => p.salary >= 500000 && p.salary < 1000000).length,
      between0LPA15LPA: placements.filter(p => p.salary >= 1000000 && p.salary < 1500000).length,
      between15LPAand20LPA: placements.filter(p => p.salary >= 1500000 && p.salary < 2000000).length,
      above20LPA: placements.filter(p => p.salary >= 2000000).length,
    };
  },
});

export const getDepartmentWiseCTCAnalytics = query({
  args: { 
    collegeId: v.id("colleges"),
    year: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    if (!args.collegeId) {
      throw new Error("collegeId is required");
    }

    // Get students and filter by year if specified
    let students = await ctx.db
      .query("students")
      .withIndex("by_college", (q) => q.eq("collegeId", args.collegeId))
      .collect();

    if (args.year && args.year !== "All") {
      students = students.filter(s => s.year === args.year);
    }

    // Get all branches for this college
    const branches = await ctx.db
      .query("branches")
      .withIndex("by_college", (q) => q.eq("collegeId", args.collegeId))
      .collect();

    // Create a map of branchId to branch info
    const branchMap = new Map();
    branches.forEach(branch => {
      branchMap.set(branch._id, { name: branch.name, code: branch.code });
    });

    // Build quick lookup maps
    const studentsById = new Map(students.map(s => [s._id, s]));
    const studentIds = new Set(students.map(s => s._id));

    // Get placements for these students
    const placements = await ctx.db
      .query("placements")
      .collect();

    const relevantPlacements = placements.filter(p => studentIds.has(p.studentId));

    // Get applications for these students (same college; filtered by studentIds)
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_college", (q) => q.eq("collegeId", args.collegeId))
      .collect();

    // Group counts: applications per department with branch codes
    const applicationsByDept = new Map<string, { count: number; code: string }>();
    for (const app of applications) {
      if (studentIds.has(app.studentId)) {
        const student = studentsById.get(app.studentId);
        
        if (student) {
          // Get department from branch if available, otherwise use student.department
          const branchInfo = branchMap.get(student.branchId);
          const dept = branchInfo ? branchInfo.name : student.department;
          const deptCode = branchInfo ? branchInfo.code : student.department.substring(0, 3).toUpperCase();
          
          if (!applicationsByDept.has(dept)) {
            applicationsByDept.set(dept, { count: 0, code: deptCode });
          }
          applicationsByDept.get(dept)!.count++;
        }
      }
    }

    // Group salaries by department (for placements/CTC) with branch codes
    const departmentCTC = new Map<string, { salaries: number[]; code: string }>();
    for (const placement of relevantPlacements) {
      const student = studentsById.get(placement.studentId);
      if (student && placement.salary > 0) {
        // Get department from branch if available, otherwise use student.department
        const branchInfo = branchMap.get(student.branchId);
        const dept = branchInfo ? branchInfo.name : student.department;
        const deptCode = branchInfo ? branchInfo.code : student.department.substring(0, 3).toUpperCase();
        
        if (!departmentCTC.has(dept)) {
          departmentCTC.set(dept, { salaries: [], code: deptCode });
        }
        departmentCTC.get(dept)!.salaries.push(placement.salary);
      }
    }

    // Calculate per-department aggregates
    const allDepts = new Set<string>([
      ...Array.from(departmentCTC.keys()),
      ...Array.from(applicationsByDept.keys()),
    ]);

    const departmentData = Array.from(allDepts).map((dept) => {
      const ctcData = departmentCTC.get(dept);
      const appData = applicationsByDept.get(dept);
      
      const salaries = ctcData?.salaries || [];
      const totalOffers = salaries.length;
      const noOfApplications = appData?.count || 0;
      
      // Get the department code (prioritize from CTC data, fallback to app data)
      const deptCode = ctcData?.code || appData?.code || dept.substring(0, 3).toUpperCase();

      return {
        department: dept,
        code: deptCode,
        averagePackage: salaries.length
          ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length)
          : 0,
        highestPackage: salaries.length ? Math.max(...salaries) : 0,
        totalOffers,
        noOfApplications,
        // Optional helper: placement success per application (%)
        placementPerApplication: noOfApplications > 0
          ? Math.round((totalOffers / noOfApplications) * 100)
          : 0,
      };
    });

    return departmentData.sort((a, b) => b.averagePackage - a.averagePackage);
  },
});

export const getApplicationTrends = query({
  args: { collegeId: v.id("colleges") },
  handler: async (ctx, args) => {
    if (!args.collegeId) {
      throw new Error("collegeId is required");
    }

    // Get all applications for the college
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_college", (q) => q.eq("collegeId", args.collegeId))
      .collect();

    // Group by month (last 12 months window)
    const monthlyApplications = new Map<string, number>();
    const monthlySuccess = new Map<string, number>();
    const currentDate = new Date();

    // Initialize last 5 months
    for (let i = 4; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const key = date.toISOString().slice(0, 7); // YYYY-MM
      monthlyApplications.set(key, 0);
      monthlySuccess.set(key, 0);
    }

    const isSuccessStatus = (status: string) =>
      status === "SELECTED" || status === "OFFER_ACCEPTED";

    // Count applications and successful ones by month
    applications.forEach((app) => {
      const appliedAt = app.appliedAt ?? app.createdAt;
      if (!appliedAt) return;
      const date = new Date(appliedAt);
      if (isNaN(date.getTime())) return;
      const key = date.toISOString().slice(0, 7);
      if (monthlyApplications.has(key)) {
        monthlyApplications.set(key, (monthlyApplications.get(key) || 0) + 1);
        if (app.status && isSuccessStatus(app.status)) {
          monthlySuccess.set(key, (monthlySuccess.get(key) || 0) + 1);
        }
      }
    });

    return Array.from(monthlyApplications.entries()).map(([month, applications]) => ({
      month,
      applications,
      success: monthlySuccess.get(month) || 0,
    }));
  },
});

export const getSalaryTrends = query({
  args: { collegeId: v.id("colleges") },
  handler: async (ctx, args) => {
    if (!args.collegeId) {
      throw new Error("collegeId is required");
    }

    // Get placements for the last 5 years scoped to the college
    const students = await ctx.db
      .query("students")
      .withIndex("by_college", (q) => q.eq("collegeId", args.collegeId))
      .collect();

    const studentIds = new Set(students.map((s) => s._id));

    // Fetch placements and filter by student
    const placements = await ctx.db.query("placements").collect();
    const relevantPlacements = placements.filter(
      (p) => studentIds.has(p.studentId) && p.joinDate
    );

    // Group by year (last 5 years)
    const currentYear = new Date().getFullYear();
    const yearlyData: Array<{
      year: string;
      avg: number;
      highest: number;
      lowest: number;
      count: number;
    }> = [];

    for (let i = 4; i >= 0; i--) {
      const year = currentYear - i;

      const yearPlacements = relevantPlacements.filter((p) => {
        const d = new Date(p.joinDate);
        return !isNaN(d.getTime()) && d.getFullYear() === year;
      });

      const salaries = yearPlacements
        .map((p) => p.salary)
        .filter((s) => typeof s === "number" && s > 0);

      const avg =
        salaries.length > 0
          ? Math.round(salaries.reduce((sum, s) => sum + s, 0) / salaries.length)
          : 0;
      const highest = salaries.length > 0 ? Math.max(...salaries) : 0;
      const lowest = salaries.length > 0 ? Math.min(...salaries) : 0;

      yearlyData.push({
        year: year.toString(),
        avg,
        highest,
        lowest,
        count: yearPlacements.length,
      });
    }

    return yearlyData;
  },
});

export const getAdminAnalyticsEnhanced : any = query({
  args: { collegeId: v.id("colleges") },
  handler: async (ctx, args) => {
    if (!args.collegeId) {
      throw new Error("collegeId is required");
    }

    // Get basic analytics
    const basicAnalytics = await ctx.runQuery(api.queries.getAdminAnalytics, {
      collegeId: args.collegeId
    });

    // Get additional data
    const students = await ctx.db
      .query("students")
      .withIndex("by_college", (q) => q.eq("collegeId", args.collegeId))
      .collect();

    const internships = await ctx.db
      .query("internships")
      .withIndex("by_college", (q) => q.eq("collegeId", args.collegeId))
      .collect();

    const companies = await ctx.db
      .query("companies")
      .withIndex("by_college", (q) => q.eq("collegeId", args.collegeId))
      .collect();

    const opportunities = await ctx.db
      .query("opportunities")
      .withIndex("by_college", (q) => q.eq("collegeId", args.collegeId))
      .collect();

    return {
      ...basicAnalytics,
      totalInternships: internships.length,
      activeInternships: internships.filter(i => i.status === "ACTIVE").length,
      totalCompanies: companies.length,
      pendingCompanies: companies.filter(c => !c.isVerified).length,
      totalOpportunities: opportunities.length,
      draftOpportunities: opportunities.filter(o => o.status === "DRAFT").length,
    };
  },
});

export const getIndustryDistribution = query({
  args: { collegeId: v.id("colleges") },
  handler: async (ctx, args) => {
    if (!args.collegeId) {
      throw new Error("collegeId is required");
    }

    // Get all accepted applications
    const acceptedApplications = await ctx.db
      .query("applications")
      .withIndex("by_college", (q) => q.eq("collegeId", args.collegeId))
      .filter((q) => 
        q.or(
          q.eq(q.field("status"), "SELECTED"),
          q.eq(q.field("status"), "OFFER_ACCEPTED")
        )
      )
      .collect();

    // Count by industry
    const industryMap = new Map<string, number>();

    for (const application of acceptedApplications) {
      const company = await ctx.db.get(application.companyId);
      if (company && company.industry) {
        const industry = company.industry;
        industryMap.set(industry, (industryMap.get(industry) || 0) + 1);
      }
    }

    // Convert to array format
    const industryData = Array.from(industryMap.entries()).map(([name, value]) => ({
      name,
      value,
      percentage: acceptedApplications.length > 0 
        ? Math.round((value / acceptedApplications.length) * 100) 
        : 0,
    }));

    return industryData.sort((a, b) => b.value - a.value);
  },
});

export const getBranchByName = query({
  args: {
    collegeId: v.id("colleges"),
    name: v.string(),
  },
  handler: async (ctx, { collegeId, name }) => {
    const needle = name.trim().toLowerCase();
    const normalized = needle.replace(/\s+/g, "");
    const branches = await ctx.db
      .query("branches")
      .withIndex("by_college", (q) => q.eq("collegeId", collegeId))
      .collect();

    return (
      branches.find((b) => {
        const n = b.name.toLowerCase();
        const c = b.code.toLowerCase();
        return n === needle || c === needle || c === normalized;
      }) || null
    );
  },
});

export const getUnassignedStudents = query({
  args: {
    collegeId: v.id("colleges"),
    skip: v.optional(v.number()),
    take: v.optional(v.number()),
  },
  handler: async (ctx, { collegeId, skip = 0, take = 100 }) => {
    // Get all students without mentors from the specified college
    const students = await ctx.db
      .query("students")
      .withIndex("by_college", (q) => q.eq("collegeId", collegeId))
      .filter((q) => q.eq(q.field("mentorId"), undefined))
      .collect();

    // Apply pagination
    const paginatedStudents = students.slice(skip, skip + take);

    // Get user details for each student
    const studentsWithDetails = await Promise.all(
      paginatedStudents.map(async (student) => {
        const user = await ctx.db.get(student.userId);
        const branch = await ctx.db.get(student.branchId);
        
        return {
          ...student,
          user: user ? {
            _id: user._id,
            email: user.email,
            role: user.role,
          } : null,
          branch: branch ? {
            _id: branch._id,
            name: branch.name,
            code: branch.code,
          } : null,
        };
      })
    );

    return {
      students: studentsWithDetails,
      total: students.length,
      hasMore: skip + take < students.length,
    };
  },
});

export const getCSVReportData = query({
  args: {
    collegeId: v.id("colleges"),
    // Data Type Selection
    dataType: v.optional(v.string()),
    
    // Student Status Filters
    studentStatus: v.optional(v.string()),
    
    // Include Options
    includeStudents: v.optional(v.boolean()),
    includeCompanies: v.optional(v.boolean()),
    includeOpportunities: v.optional(v.boolean()),
    includePlacements: v.optional(v.boolean()),
    includeApplications: v.optional(v.boolean()),
    includeDepartmentStats: v.optional(v.boolean()),
    includeCTCAnalytics: v.optional(v.boolean()),
    
    // Filters
    filterByYear: v.optional(v.string()),
    filterByDepartment: v.optional(v.string()),
    
    // Privacy Options
    includeContactInfo: v.optional(v.boolean()),
    includePersonalInfo: v.optional(v.boolean()),
    
    // Placement Details (for placed students)
    includePlacementDetails: v.optional(v.boolean()),
    includeCompanyDetails: v.optional(v.boolean()),
    includePackageDetails: v.optional(v.boolean()),
    includeRoleDetails: v.optional(v.boolean()),
    includeLocationDetails: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const {
      collegeId,
      studentStatus = "both",
      includeStudents = true,
      includeCompanies = true,
      includeOpportunities = true,
      includeApplications = true,
      includeDepartmentStats = true,
      includeCTCAnalytics = true,
      filterByYear,
      filterByDepartment,
      includeContactInfo = false,
    } = args;

    const result: any = {
      students: [],
      companies: [],
      opportunities: [],
      placements: [],
      applications: [],
      departmentStats: [],
      ctcAnalytics: null,
    };

    // Students Data with comprehensive details
    if (includeStudents) {
      let allStudents = await ctx.db
        .query("students")
        .withIndex("by_college", (q) => q.eq("collegeId", collegeId))
        .collect();

      // Apply filters
      if (filterByDepartment && filterByDepartment !== "All") {
        allStudents = allStudents.filter(s => 
          s.department.toLowerCase() === filterByDepartment.toLowerCase()
        );
      }

      if (filterByYear && filterByYear !== "All") {
        allStudents = allStudents.filter(s => s.year === filterByYear);
      }

      // Apply student status filter
      if (studentStatus !== "both") {
        allStudents = allStudents.filter(s => {
          switch (studentStatus) {
            case "placed":
              return s.isPlaced;
            case "not-placed":
              return !s.isPlaced;
            default:
              return true;
          }
        });
      }

      // Get comprehensive student data with joins
      const studentsWithDetails = await Promise.all(
        allStudents.map(async (student) => {
          const user = await ctx.db.get(student.userId);
          const branch = student.branchId ? await ctx.db.get(student.branchId) : null;
          
          // Get applications for this student
          const applications = await ctx.db
            .query("applications")
            .withIndex("by_student", (q) => q.eq("studentId", student._id))
            .collect();

          // Get placements for this student
          const placements = await ctx.db
            .query("placements")
            .withIndex("by_student", (q) => q.eq("studentId", student._id))
            .collect();

          // Get internships for this student
          const internships = await ctx.db
            .query("internships")
            .withIndex("by_student", (q) => q.eq("studentId", student._id))
            .collect();

          // Get placement details with company info
          const placementDetails = await Promise.all(
            placements.map(async (placement) => {
              const company = placement.companyId ? await ctx.db.get(placement.companyId) : null;
              return {
                ...placement,
                companyName: company?.name || 'Unknown',
                package: placement.salary || 0,
                role: placement.jobTitle || 'Not specified',
                location: placement.location || 'Not specified',
              };
            })
          );

          return {
            id: student._id,
            firstName: student.firstName,
            lastName: student.lastName,
            fullName: `${student.firstName || ''} ${student.lastName || ''}`.trim(),
            rollNumber: student.rollNumber,
            department: student.department,
            year: student.year,
            semester: student.semester,
            cgpa: student.cgpa,
            tenthPercentage: student.tenthPercentage,
            twelfthPercentage: student.twelfthPercentage,
            isPlaced: student.isPlaced,
            status: student.isPlaced ? 'Placed' : (!student.isPlaced ? 'Active' : 'Inactive'),
            skills: student.skills || [],
            email: includeContactInfo ? (user?.email || '') : '',
            phone: includeContactInfo ? (student.phone || '') : '',
            applications: applications.length,
            totalOffers: placements.length + internships.length,
            placementDetails: placementDetails,
            branch: branch ? {
              name: branch.name,
              code: branch.code,
            } : null,
          };
        })
      );

      result.students = studentsWithDetails;
    }

    // Companies Data
    if (includeCompanies) {
      const companies = await ctx.db
        .query("companies")
        .withIndex("by_college", (q) => q.eq("collegeId", collegeId))
        .collect();

      const companiesWithDetails = await Promise.all(
        companies.map(async (company) => {
          const user = await ctx.db.get(company.userId);
          
          // Get placements from this company
          const placements = await ctx.db
            .query("placements")
            .withIndex("by_company", (q) => q.eq("companyId", company._id))
            .collect();

          // Calculate package details
          const salaries = placements.map(p => p.salary).filter(s => s > 0);
          const averagePackage = salaries.length > 0 ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length) : 0;
          const highestPackage = salaries.length > 0 ? Math.max(...salaries) : 0;
          const lowestPackage = salaries.length > 0 ? Math.min(...salaries) : 0;

          // Get opportunities from this company
          const opportunities = await ctx.db
            .query("opportunities")
            .withIndex("by_company", (q) => q.eq("companyId", company._id))
            .collect();

          return {
            id: company._id,
            name: company.name,
            industry: company.industry,
            location: company.location,
            isVerified: company.isVerified,
            totalHires: placements.length,
            averagePackage,
            highestPackage,
            lowestPackage,
            activeOpportunities: opportunities.filter(o => o.status === 'ACTIVE').length,
            email: includeContactInfo ? (user?.email || '') : ''
          };
        })
      );

      result.companies = companiesWithDetails;
    }

    // Opportunities Data
    if (includeOpportunities) {
      let opportunities = await ctx.db
        .query("opportunities")
        .withIndex("by_college", (q) => q.eq("collegeId", collegeId))
        .collect();

      const opportunitiesWithDetails = await Promise.all(
        opportunities.map(async (opportunity) => {
          const company = opportunity.companyId ? await ctx.db.get(opportunity.companyId) : null;
          
          // Get applications for this opportunity
          const applications = await ctx.db
            .query("applications")
            .withIndex("by_opportunity", (q) => q.eq("opportunityId", opportunity._id))
            .collect();

          return {
            id: opportunity._id,
            title: opportunity.title,
            type: opportunity.type,
            status: opportunity.status,
            companyName: company?.name || opportunity.externalCompanyName || 'External Company',
            location: opportunity.location,
            package: opportunity.salary,
            deadline: opportunity.deadline,
            totalApplications: applications.length,
            acceptedApplications: applications.filter(a => a.status === 'OFFER_ACCEPTED').length,
            description: opportunity.description,
            applicationCount: applications.length,
          };
        })
      );

      result.opportunities = opportunitiesWithDetails;
    }

    // Applications Data
    if (includeApplications) {
      const applications = await ctx.db
        .query("applications")
        .collect();

      // Filter applications by college through student
      const collegeApplications = await Promise.all(
        applications.map(async (application) => {
          const student = await ctx.db.get(application.studentId);
          if (student?.collegeId !== collegeId) return null;

          const opportunity = application.opportunityId ? await ctx.db.get(application.opportunityId) : null;
          const company = opportunity?.companyId ? await ctx.db.get(opportunity.companyId) : null;

          return {
            id: application._id,
            studentName: `${student.firstName || ''} ${student.lastName || ''}`.trim(),
            studentRollNumber: student.rollNumber,
            opportunityTitle: opportunity?.title || 'Unknown',
            companyName: company?.name || opportunity?.externalCompanyName || 'External Company',
            status: application.status,
            appliedAt: application._creationTime,
            appliedDate: new Date(application._creationTime).toLocaleDateString(),
            type: opportunity?.type || 'Unknown',
          };
        })
      );

      result.applications = collegeApplications.filter(Boolean);
    }

    // Department Statistics
    if (includeDepartmentStats) {
      const students = await ctx.db
        .query("students")
        .withIndex("by_college", (q) => q.eq("collegeId", collegeId))
        .collect();

      const departmentStats = students.reduce((acc: any, student) => {
        const dept = student.department;
        if (!acc[dept]) {
          acc[dept] = {
            department: dept,
            totalStudents: 0,
            placedStudents: 0,
            activeStudents: 0,
            averagePackage: 0,
            highestPackage: 0,
            packages: [],
          };
        }
        acc[dept].totalStudents++;
        if (student.isPlaced) {
          acc[dept].placedStudents++;
        } else {
          acc[dept].activeStudents++;
        }
        return acc;
      }, {});

      // Calculate placement rates and package stats
      result.departmentStats = Object.values(departmentStats).map((dept: any) => ({
        ...dept,
        placementRate: dept.totalStudents > 0 
          ? ((dept.placedStudents / dept.totalStudents) * 100).toFixed(2)
          : '0.00',
      }));
    }

    // CTC Analytics
    if (includeCTCAnalytics) {
      const placements = await ctx.db
        .query("placements")
        .collect();

      // Filter placements by college through student
      const collegePlacements = await Promise.all(
        placements.map(async (placement) => {
          const student = await ctx.db.get(placement.studentId);
          if (student?.collegeId !== collegeId) return null;
          return placement;
        })
      );

      const validPlacements = collegePlacements.filter(Boolean);
      const packages = validPlacements.map(p => p?.salary || 0).filter(p => p > 0);

      if (packages.length > 0) {
        const sortedPackages = packages.sort((a, b) => a - b);
        result.ctcAnalytics = {
          totalOffers: validPlacements.length,
          averagePackage: packages.reduce((a, b) => a + b, 0) / packages.length,
          highestPackage: Math.max(...packages),
          lowestPackage: Math.min(...packages),
          medianPackage: sortedPackages[Math.floor(sortedPackages.length / 2)],
          below5LPA: packages.filter(p => p < 5).length,
          between5to10LPA: packages.filter(p => p >= 5 && p < 10).length,
          between0LPA15LPA: packages.filter(p => p >= 10 && p < 15).length,
          between15LPAand20LPA: packages.filter(p => p >= 15 && p < 20).length,
          above20LPA: packages.filter(p => p >= 20).length,
        };
      }
    }

    return result;
  },
});

export const getCompanyWiseHiringData = query({
  args: { 
    collegeId: v.id("colleges"),
    year: v.optional(v.string())
  },
  handler: async (ctx, { collegeId, year }) => {
    // First get all students from the college
    const students = await ctx.db
      .query("students")
      .withIndex("by_college", (q) => q.eq("collegeId", collegeId))
      .collect();

    // Filter by year if provided and only include placed students
    let filteredStudents = students.filter(s => s.isPlaced);
    if (year && year !== "All") {
      filteredStudents = filteredStudents.filter(s => s.year === year);
    }

    const studentIds = filteredStudents.map(s => s._id);

    // Get all placements for these placed students only
    const allPlacements = await ctx.db.query("placements").collect();
    const placements = allPlacements.filter(p => 
      studentIds.includes(p.studentId) && 
      (p.status === "OFFER_ACCEPTED" || p.status === "JOINED")
    );

    // Get all companies from this college using the by_college index
    const companies = await ctx.db
      .query("companies")
      .withIndex("by_college", (q) => q.eq("collegeId", collegeId))
      .collect();

    // Create a map of company IDs for quick lookup
    const companyMap = new Map();
    companies.forEach(company => {
      companyMap.set(company._id, {
        company,
        placements: [],
        salaries: []
      });
    });

    // Group placements by company (only for companies in this college)
    for (const placement of placements) {
      if (companyMap.has(placement.companyId)) {
        companyMap.get(placement.companyId).placements.push(placement);
        if (placement.salary) {
          companyMap.get(placement.companyId).salaries.push(placement.salary);
        }
      }
    }

    // Calculate metrics for each company that has placements
    const companiesData = Array.from(companyMap.entries())
      .filter(([_, data]) => data.placements.length > 0) // Only include companies with placements
      .map(([companyId, data]) => {
        const { company, placements, salaries } = data;
        
        const totalHires = placements.length;
        const averagePackage = salaries.length > 0 
          ? salaries.reduce((sum: number, salary: number) => sum + salary, 0) / salaries.length 
          : 0;
        const highestPackage = salaries.length > 0 ? Math.max(...salaries) : 0;
        const lowestPackage = salaries.length > 0 ? Math.min(...salaries) : 0;

        return {
          companyId: company._id,
          companyName: company.name,
          companyLogo: company.logo,
          totalHires,
          averagePackage: Math.round(averagePackage),
          highestPackage,
          lowestPackage,
          // Convert to LPA for display
          averagePackageLPA: Math.round(averagePackage / 100000 * 100) / 100,
          highestPackageLPA: Math.round(highestPackage / 100000 * 100) / 100,
          lowestPackageLPA: Math.round(lowestPackage / 100000 * 100) / 100,
        };
      });

    // Sort by total hires (descending)
    companiesData.sort((a, b) => b.totalHires - a.totalHires);

    return companiesData;
  },
});