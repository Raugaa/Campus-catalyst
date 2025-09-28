"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_here";

export const login: any = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const { email, password } = args;
    
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const normalizedEmail = email.trim().toLowerCase();
    
    // Find user by email using a query
    const user = await ctx.runQuery(api.queries.getUserByEmail, { 
      email: normalizedEmail 
    });
    
    if (!user || !user.isActive) {
      throw new Error("Invalid email or password");
    }

    // Verify password (support both bcrypt-hashed and plain dev passwords)
    if (!user.passwordHash) {
      throw new Error("Invalid email or password");
    }

    let isValidPassword = false;
    if (user.passwordHash.startsWith("$2")) {
      // bcrypt hash
      isValidPassword = await bcrypt.compare(password, user.passwordHash);
    } else {
      // fallback for dev data stored in plain text
      isValidPassword = password === user.passwordHash;
    }

    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    // Check if company is verified
    if (user.role === "COMPANY") {
      const company = await ctx.runQuery(api.queries.getCompanyByUserId, {
        userId: user._id
      });
      
      if (!company?.isVerified) {
        throw new Error("Your company account is pending verification by the placement cell.");
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      success: true,
      token,
      user: {
        userId: user._id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      }
    };
  },
});

export const getUserProfile: any = action({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    try {
      // Verify JWT token
      const decoded = jwt.verify(args.token, JWT_SECRET) as any;

      if (!decoded || !decoded.userId) {
        return { valid: false };
      }

      const user = await ctx.runQuery(api.queries.getUserById, { 
        userId: decoded.userId 
      });
      
      if (!user || !user.isActive) {
        return { valid: false };
      }

      // Get user profile based on role
      let profile = null;
      
      switch (user.role) {
        case "STUDENT":
          profile = await ctx.runQuery(api.queries.getStudentByUserId, { 
            userId: user._id 
          });
          break;
        case "FACULTY":
          profile = await ctx.runQuery(api.queries.getFacultyByUserId, { 
            userId: user._id 
          });
          break;
        case "COMPANY":
          profile = await ctx.runQuery(api.queries.getCompanyByUserId, { 
            userId: user._id 
          });
          break;
        case "ADMIN":
          profile = await ctx.runQuery(api.queries.getAdminByUserId, { 
            userId: user._id 
          });
          break;
        case "GLOBAL_ADMIN":
          profile = await ctx.runQuery(api.queries.getGlobalAdminByUserId, { 
            userId: user._id 
          });
          break;
      }

      return {
        valid: true,
        userId: user._id,
        email: user.email,
        role: user.role,
        user,
        profile,
      };
    } catch (error) {
      console.log("Error in getUserProfile:", error);
      return { valid: false };
    }
  },
});

// Remove the old getCurrentUser action and replace with getUserProfile above

export const registerCompany: any = action({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
    website: v.optional(v.string()),
    location: v.string(),
    industry: v.optional(v.string()),
    size: v.optional(v.string()),
    description: v.optional(v.string()),
    collegeId : v.id("colleges"),
  },
  handler: async (ctx, args) => {
    const { email, password, name, website, location, industry, size, description , collegeId} = args;
    
    const normalizedEmail = email.trim().toLowerCase();
    
    // Check if user already exists
    const existingUser = await ctx.runQuery(api.queries.getUserByEmail, {
      email: normalizedEmail
    });
    
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user and company via mutations
    const result = await ctx.runMutation(api.mutations.createUserAndCompany, {
      userData: {
        email: normalizedEmail,
        passwordHash,
        role: "COMPANY",
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      companyData: {
        name,
        website,
        location,
        industry,
        collegeId,
        size,
        description,
        isVerified: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
    });

    return result;
  },
});

export const createFaculty: any = action({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
    department: v.string(),
    designation: v.optional(v.string()),
    phone: v.optional(v.string()),
    canMentor: v.boolean(),
    collegeId: v.id("colleges"),
  },
  handler: async (ctx, args) => {
    const { email, password, name, department, designation, phone, canMentor, collegeId } = args;
    
    const normalizedEmail = email.trim().toLowerCase();
    
    // Check if user already exists
    const existingUser = await ctx.runQuery(api.queries.getUserByEmail, {
      email: normalizedEmail
    });
    
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user and faculty via mutations
    const result = await ctx.runMutation(api.mutations.createUserAndFaculty, {
      userData: {
        email: normalizedEmail,
        passwordHash,
        role: "FACULTY",
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      facultyData: {
        name,
        department,
        designation,
        phone : phone || "",
        canMentor,
        collegeId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
    });

    return result;
  },
});

// ✅ Updated action to handle user.isActive properly
export const updateStudentStatus: any = action({
  args: {
    studentId: v.id("students"),
    isActive: v.boolean(), // ✅ Changed from status to isActive
  },
  handler: async (ctx, args) => {
    const { studentId, isActive } = args;
    
    // Get the student first to get their userId
    const student = await ctx.runQuery(api.queries.getStudentById, {
      studentId: studentId
    });
    
    if (!student) {
      throw new Error("Student not found");
    }
    
    // Update both student status and user isActive
    const result = await ctx.runMutation(api.mutations.updateActive, {
      userId: student.userId,
      isActive: isActive,
    });

    return {
      success: true,
      isActive: isActive,
      message: `Student ${isActive ? "activated" : "deactivated"} successfully`
    };
  },
});

export const createStudent: any = action({
  args: {
    email: v.string(),
    password: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    rollNumber: v.string(),
    phone: v.optional(v.string()),
    department: v.string(),
    branchId: v.id("branches"),
    year: v.string(),
    semester: v.number(),
    cgpa: v.optional(v.number()),
    tenthPercentage: v.number(),
    twelfthPercentage: v.number(),
    skills: v.optional(v.array(v.string())),
    collegeId: v.id("colleges"),
    mentorId: v.optional(v.id("faculty")),
  },
  handler: async (ctx, args) => {
    const {
      email, password, firstName, lastName, rollNumber, phone, department,
      year, semester, cgpa, tenthPercentage, twelfthPercentage, skills,
      collegeId, mentorId, branchId
    } = args;
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await ctx.runQuery(api.queries.getUserByEmail, {
      email: normalizedEmail
    });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user and student via mutations
    const result = await ctx.runMutation(api.mutations.createUserAndStudent, {
      userData: {
        email: normalizedEmail,
        passwordHash,
        role: "STUDENT",
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      studentData: {
        firstName,
        lastName,
        rollNumber,
        phone: phone || "",
        department,
        branchId,
        year,
        semester,
        cgpa: cgpa ?? 0,
        tenthPercentage,
        twelfthPercentage,
        skills: skills || [],
        isPlaced: false,
        collegeId,
        mentorId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
    });
    return result;
  },
});

export const createAdmin: any = action({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    department: v.optional(v.string()),
    collegeId: v.id("colleges"),
  },
  handler: async (ctx, args) => {
    const { email, password, name, phone, department, collegeId } = args;
    
    const normalizedEmail = email.trim().toLowerCase();
    
    // Check if user already exists
    const existingUser = await ctx.runQuery(api.queries.getUserByEmail, {
      email: normalizedEmail
    });
    
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user and admin via mutations
    const result = await ctx.runMutation(api.mutations.createUserAndAdmin, {
      userData: {
        email: normalizedEmail,
        passwordHash,
        role: "ADMIN",
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      adminData: {
        name,
        phone: phone || "",
        department,
        collegeId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
    });

    return result;
  },
});

export const createGlobalAdmin: any = action({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    const { email, password, name, phone } = args;
    
    const normalizedEmail = email.trim().toLowerCase();
    
    // Check if user already exists
    const existingUser = await ctx.runQuery(api.queries.getUserByEmail, {
      email: normalizedEmail
    });
    
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    // Create user and global admin via mutations
    const result = await ctx.runMutation(api.mutations.createGlobalAndUser, {
      userData: {
        email: normalizedEmail,
        passwordHash,
        role: "GLOBAL_ADMIN",
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      globalAdminData: {
        name,
        phone,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
    });
    
    return result;
  }

}
);
// ✅ New action to update faculty status
export const updateFacultyStatus = action({
  args: {
    facultyId: v.id("faculty"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { facultyId, isActive } = args;
    
    // Get the faculty first to get their userId
    const faculty = await ctx.runQuery(api.queries.getFacultyById, {
      facultyId: facultyId
    });
    
    if (!faculty) {
      throw new Error("Faculty not found");
    }
    
    // Update faculty user's isActive status
    const result = await ctx.runMutation(api.mutations.updateFacultyUserStatus, {
      userId: faculty.userId, // Ensure we have userId
      isActive: isActive,
    });

    return {
      success: true,
      facultyId,
      isActive: isActive,
      message: `Faculty ${isActive ? "activated" : "deactivated"} successfully`
    };
  },
});

// Add these new actions to your existing actions.ts file

export const bulkCreateStudents = action({
  args: {
    studentsData: v.array(v.object({
      email: v.string(),
      password: v.string(),
      firstName: v.string(),
      lastName: v.string(),
      rollNumber: v.string(),
      phone: v.optional(v.string()),
      branchName: v.string(),
      year: v.string(),
      semester: v.number(),
      cgpa: v.optional(v.number()),
      tenthPercentage: v.number(),
      twelfthPercentage: v.number(),
      skills: v.optional(v.array(v.string())),
      resumeUrl: v.optional(v.string()),
      collegeId: v.id("colleges"),
      mentorId: v.optional(v.id("faculty")),
    }))
  },
  handler: async (ctx, { studentsData }) => {
    let successCount = 0
    let errorCount = 0
    const createdStudents: Array<{email: string, password: string, name: string}> = []
    const errors: Array<{email: string, error: string}> = []

    for (const studentData of studentsData) {
      try {
        const normalizedEmail = studentData.email.trim().toLowerCase()
        const existingUser = await ctx.runQuery(api.queries.getUserByEmail, {
          email: normalizedEmail
        })
        if (existingUser) {
          errorCount++
          errors.push({
            email: normalizedEmail,
            error: "User with this email already exists"
          })
          continue
        }

        // Find or create branch based on branchName
        const branchNameLower = studentData.branchName.toLowerCase();
        let branch = await ctx.runQuery(api.queries.getBranchByName, {
          name: branchNameLower,
          collegeId: studentData.collegeId,
        });

        if (!branch) {
          const branchId = await ctx.runMutation(api.mutations.createBranch, {
            name: studentData.branchName,
            code: branchNameLower.replace(/\s+/g, '').toLowerCase(),
            collegeId: studentData.collegeId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
          branch = { 
            _id: branchId, 
            _creationTime: Date.now(),
            name: studentData.branchName, 
            code: branchNameLower.replace(/\s+/g, '').toLowerCase(),
            collegeId: studentData.collegeId,
            createdAt: Date.now(),
            updatedAt: Date.now()
          };
        }

        const passwordHash = await bcrypt.hash(studentData.password, 10)

        await ctx.runMutation(api.mutations.createUserAndStudent, {
          userData: {
            email: normalizedEmail,
            passwordHash,
            role: "STUDENT",
            isActive: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          studentData: {
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            rollNumber: studentData.rollNumber,
            phone: studentData.phone || "",
            department: branch.name,
            branchId: branch._id,
            year: studentData.year,
            semester: studentData.semester,
            cgpa: studentData.cgpa ?? 0,
            tenthPercentage: studentData.tenthPercentage,
            twelfthPercentage: studentData.twelfthPercentage,
            skills: studentData.skills || [],
            resumeUrl: studentData.resumeUrl || "",
            isPlaced: false,
            collegeId: studentData.collegeId,
            mentorId: studentData.mentorId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          }
        })

        createdStudents.push({
          email: normalizedEmail,
          password: studentData.password,
          name: `${studentData.firstName} ${studentData.lastName}`
        })

        successCount++
      } catch (error) {
        errorCount++
        errors.push({
          email: studentData.email,
          error: error instanceof Error ? error.message : "Unknown error"
        })
        console.error("Error creating student:", error)
      }
    }

    return {
      successCount,
      errorCount,
      createdStudents,
      errors
    }
  },
})


export const bulkCreateFaculty = action({
  args: {
    facultyDatas: v.array(v.object({
      designation: v.optional(v.string()),
      email: v.string(),
      password: v.string(),
      firstName: v.string(),
      lastName: v.string(),
      phone: v.optional(v.string()),
      department: v.string(),
      canMentor: v.optional(v.boolean()),
      collegeId: v.id("colleges"),
    }))
  },
  handler: async (ctx, { facultyDatas }) => {
    let successCount = 0
    let errorCount = 0
    const createdFaculty: Array<{email: string, password: string, name: string}> = []
    const errors: Array<{email: string, error: string}> = []

    for (const fd of facultyDatas) {
      try {
        const normalizedEmail = fd.email.trim().toLowerCase()
        const existingUser = await ctx.runQuery(api.queries.getUserByEmail, {
          email: normalizedEmail
        })
        if (existingUser) {
          errorCount++
          errors.push({
            email: normalizedEmail,
            error: "User with this email already exists"
          })
          continue
        }

        const passwordHash = await bcrypt.hash(fd.password, 10)

        await ctx.runMutation(api.mutations.createUserAndFaculty, {
          userData: {
            email: normalizedEmail,
            passwordHash,
            role: "FACULTY",
            isActive: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          facultyData: {
            designation: fd.designation || "",
            name: `${fd.firstName} ${fd.lastName}`,
            collegeId: fd.collegeId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            phone: fd.phone || "",
            department: fd.department,
            canMentor: fd.canMentor || false,
          }
        })

        createdFaculty.push({
          email: normalizedEmail,
          password: fd.password,
          name: `${fd.firstName} ${fd.lastName}`
        })

        successCount++
      } catch (error) {
        errorCount++
        errors.push({ 
          email: fd.email,
          error: error instanceof Error ? error.message : "Unknown error"
        })
        console.error("Error creating faculty:", error)
      }
    }

    return {
      successCount,
      errorCount,
      createdFaculty,
      errors
    }
  },
})
