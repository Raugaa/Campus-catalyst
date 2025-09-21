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
  },
  handler: async (ctx, args) => {
    const { email, password, name, website, location, industry, size, description } = args;
    
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
        phone,
        canMentor,
        collegeId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
    });

    return result;
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
    year: v.string(),
    semester: v.number(),
    cgpa: v.optional(v.number()),
    skills: v.optional(v.array(v.string())),
    collegeId: v.id("colleges"),
    mentorId: v.optional(v.id("faculty")),
  },
  handler: async (ctx, args) => {
    const { email, password, firstName, lastName, rollNumber, phone, department, year, semester, cgpa, skills, collegeId, mentorId } = args;
    
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
        phone,
        department,
        year,
        semester,
        cgpa,
        skills,
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
        phone,
        department,
        collegeId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
    });

    return result;
  },
});

