// seed-expanded.ts
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import bcrypt from "bcryptjs";

const CONVEX_URL = "https://veracious-sturgeon-615.convex.cloud";
const CONVEX_DEPLOY_KEY = "dev:veracious-sturgeon-615|eyJ2MiI6IjQ1MmQzMTU0Yzg1MTQ4ZTc5M2I3MjY4ODBmNWNkYWMxIn0=";

if (!CONVEX_URL) {
  console.error("❌ Missing CONVEX_URL environment variable");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL, {
  deployKey: CONVEX_DEPLOY_KEY,
} as any);

// Helper: convert YYYY-MM-DD to timestamp (ms)
function dateTS(date: string) {
  return new Date(date).getTime();
}

// Helper: generate random student data
function generateStudentData(index: number, collegeCode: string, branchCode: string, year: number) {
  const firstNames = ["Arjun", "Priya", "Rohit", "Sneha", "Aditya", "Neha", "Rahul", "Pooja", "Vikram", "Ananya", "Karan", "Divya", "Siddharth", "Kavya", "Harsh", "Riya", "Amit", "Sakshi", "Nikhil", "Shreya", "Aarav", "Diya", "Ishaan", "Anaya", "Vihaan", "Sara", "Aryan", "Ira", "Reyansh", "Myra"];
  const lastNames = ["Patel", "Singh", "Sharma", "Gupta", "Verma", "Agarwal", "Deshmukh", "Kulkarni", "Joshi", "Nair", "Kumar", "Reddy", "Yadav", "Mishra", "Tiwari", "Pandey", "Srivastava", "Chauhan", "Rajput", "Thakur", "Shah", "Mehta", "Jain", "Bansal", "Malhotra", "Chopra", "Kapoor", "Arora", "Bhatia", "Sethi"];
  
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[Math.floor(index / firstNames.length) % lastNames.length];
  
  return {
    firstName,
    lastName,
    rollNumber: `${branchCode}${year}${String(index + 1).padStart(3, '0')}`,
    phone: `97777${String(77700 + index).slice(-5)}`,
    cgpa: Math.round((7.0 + Math.random() * 3.0) * 10) / 10,
    tenthPercentage: Math.round((75.0 + Math.random() * 20.0) * 10) / 10,
    twelfthPercentage: Math.round((80.0 + Math.random() * 15.0) * 10) / 10,
    skills: ["JavaScript", "Python", "React", "Node.js", "Java", "C++", "Machine Learning", "Data Science", "Angular", "Vue.js", "Django", "Flask", "Spring Boot", "MongoDB", "PostgreSQL", "AWS", "Docker", "Kubernetes"].slice(0, 3 + (index % 4)),
  };
}

// Helper: generate random month for 2025
function getRandomMonth2025() {
  const months = [
    "2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06",
    "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12"
  ];
  return months[Math.floor(Math.random() * months.length)];
}

async function run() {
  console.log("🌱 Starting Convex data seeding...");

  try {
    // Clear existing data first
    console.log("🧹 Clearing existing data...");
    await client.mutation(api.mutations.clearAllData, {});
    console.log("✅ Existing data cleared");

    // 1. Create Global Admin using seeding mutations
    console.log("👤 Creating global admin...");
    const globalAdmin1 = await client.mutation(api.mutations.createGlobalAdminForSeeding, {
      email: "global@admin.com",
      passwordHash: await bcrypt.hash("globalAdmin123", 10),
      name: "Qusai Sakerwala",
      phone: "9999999999",
    });
    console.log("✅ Global Admin created:", globalAdmin1.userId);

    // 2. Create 1 College (Fake Name)
    console.log("📚 Creating college...");
    const colleges: any[] = [];
    
    const collegeResult1 = await client.mutation(api.mutations.createCollegeForSeeding, {
      name: "Acme University", // Changed to a fake university name
      code: "ACME", // Changed college code
      location: "Mumbai, Maharashtra",
      type: "INSTITUTE",
      website: "https://acmeuni.edu.in",
      phone: "022-67890000",
      logo: "https://acmeuni.edu.in/assets/images/logo.png",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    colleges.push({ collegeId: collegeResult1.collegeId, code: "ACME", name: "Acme University" });

    console.log("✅ College created:", colleges.length);

    // Declare college once here for consistent use
    const mainCollege = colleges[0];

    // 3. Create 7 Branches for the college
    console.log("🏢 Creating branches...");
    const branches: any[] = [];
    
    const branchData = [
      { name: "Computer Science Engineering", code: "CSE" },
      { name: "Information Technology", code: "IT" },
      { name: "Electronics and Communication Engineering", code: "ECE" },
      { name: "Electrical Engineering", code: "EE" },
      { name: "Mechanical Engineering", code: "ME" },
      { name: "Civil Engineering", code: "CE" },
      { name: "Chemical Engineering", code: "CHE" },
    ];

    for (const college of colleges) { // This loop variable 'college' is fine as it's block-scoped
      for (const branchInfo of branchData) {
        const branchId = await client.mutation(api.mutations.createBranch, {
          name: branchInfo.name,
          code: branchInfo.code,
          collegeId: college.collegeId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        branches.push({ 
          branchId, 
          collegeId: college.collegeId, 
          code: branchInfo.code, 
          name: branchInfo.name,
          collegeCode: college.code
        });
      }
    }

    console.log("✅ Branches created:", branches.length);

    // 4. Create 1 Admin for the college
    console.log("👤 Creating admin...");
    const admins: any[] = [];
    
    const admin = await client.mutation(api.mutations.createAdminForSeeding, {
      email: "admin@acmeuni.edu", // Updated email domain
      passwordHash: await bcrypt.hash("admin123", 10),
      name: "Dr. Rajesh Sharma",
      phone: "9999999980",
      department: "Training & Placement Cell",
      collegeId: mainCollege.collegeId, // Use mainCollege
    });
    admins.push({ ...admin, collegeId: mainCollege.collegeId });

    console.log("✅ Admin created:", admins.length);

    // 5. Create Faculty (5 for the college)
    console.log("👨‍🏫 Creating faculty...");
    const faculty: any[] = [];
    
    const facultyNames = [
      "Dr. Priya Sharma", "Dr. Rajesh Kumar", "Prof. Amit Singh", "Dr. Kavita Mehta", "Dr. Suresh Patel"
    ];

    const departments = ["Computer Science", "Information Technology", "Electronics", "Electrical", "Mechanical"];
    const designations = ["Professor", "Associate Professor", "Assistant Professor"];

    // Removed redeclaration of 'college'
    for (let i = 0; i < 5; i++) {
      const facultyResult = await client.mutation(api.mutations.createFacultyForSeeding, {
        email: `faculty${i + 1}@${mainCollege.code.toLowerCase()}.edu`, // Use mainCollege
        passwordHash: await bcrypt.hash("faculty123", 10),
        name: facultyNames[i],
        phone: `9888888880${i}`,
        department: departments[i],
        designation: designations[i % designations.length],
        canMentor: true,
        collegeId: mainCollege.collegeId, // Use mainCollege
      });
      faculty.push({ facultyId: facultyResult.facultyId, collegeId: mainCollege.collegeId });
    }

    console.log("✅ Faculty created:", faculty.length);

    // 6. Create 60 Students for the college
    console.log("👨‍🎓 Creating 60 students...");
    const students: any[] = [];
    
    // Removed redeclaration of 'college'
    const collegeBranches = branches.filter(b => b.collegeId === mainCollege.collegeId); // Use mainCollege
    const collegeFaculty = faculty.filter(f => f.collegeId === mainCollege.collegeId); // Use mainCollege
    
    console.log(`Creating students for ${mainCollege.name}...`); // Use mainCollege
    for (let i = 0; i < 60; i++) {
      const branch = collegeBranches[i % collegeBranches.length];
      const studentData = generateStudentData(i, mainCollege.code, branch.code, 2021 + (i % 4)); // Use mainCollege
      const facultyMember = collegeFaculty[i % collegeFaculty.length];
      
      const student = await client.mutation(api.mutations.createUserAndStudent, {
        userData: {
          email: `student${i + 1}@${mainCollege.code.toLowerCase()}.edu`, // Use mainCollege
          passwordHash: await bcrypt.hash("student123", 10),
          role: "STUDENT",
          isActive: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        studentData: {
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          rollNumber: studentData.rollNumber,
          phone: studentData.phone,
          department: branch.name,
          branchId: branch.branchId,
          year: i < 30 ? "Final Year" : "Third Year",
          semester: i < 30 ? 8 : 6,
          tenthPercentage: studentData.tenthPercentage,
          twelfthPercentage: studentData.twelfthPercentage,
          cgpa: studentData.cgpa,
          skills: studentData.skills,
          isPlaced: false,
          collegeId: mainCollege.collegeId, // Use mainCollege
          mentorId: facultyMember.facultyId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      });
      students.push({ ...student, collegeId: mainCollege.collegeId }); // Use mainCollege
    }

    console.log("✅ Students created:", students.length);

    // 7. Create Companies (8 companies for the college)
    console.log("🏢 Creating companies...");
    const companies: any[] = [];
    
    const companyData = [
      { name: "TechCorp Solutions", location: "Bangalore, Karnataka", industry: "Information Technology" },
      { name: "InnovateLab", location: "Mumbai, Maharashtra", industry: "Technology" },
      { name: "CloudTech Systems", location: "Pune, Maharashtra", industry: "Cloud Computing" },
      { name: "WebDev Pro", location: "Mumbai, Maharashtra", industry: "Web Development" },
      { name: "MobileTech Inc", location: "Bangalore, Karnataka", industry: "Mobile Development" },
      { name: "DataDyne Analytics", location: "Pune, Maharashtra", industry: "Data Analytics" },
      { name: "FinTech Innovations", location: "Mumbai, Maharashtra", industry: "Financial Technology" },
      { name: "AI Ventures", location: "Bangalore, Karnataka", industry: "Artificial Intelligence" },
    ];

    for (let i = 0; i < companyData.length; i++) {
      const result = await client.mutation(api.mutations.createCompanyForSeeding, {
        email: `hr${i + 1}@${companyData[i].name.toLowerCase().replace(/\s+/g, '')}.com`,
        passwordHash: await bcrypt.hash("company123", 10),
        name: companyData[i].name,
        website: `https://${companyData[i].name.toLowerCase().replace(/\s+/g, '')}.com`,
        location: companyData[i].location,
        industry: companyData[i].industry,
        size: ["50-100", "100-500", "500-1000", "1000+"][i % 4],
        description: `Leading company in ${companyData[i].industry}`,
        collegeId: mainCollege.collegeId, // Use mainCollege
      });

      companies.push({
        companyId: result.companyId,
        userId: result.userId,
        collegeId: mainCollege.collegeId, // Use mainCollege
        name: companyData[i].name,
        location: companyData[i].location,
      });
    }

    console.log("✅ Companies created:", companies.length);

    // 8. Verify companies
    console.log("✅ Verifying companies...");
    for (const company of companies) {
      await client.mutation(api.mutations.verifyCompany, {
        companyId: company.companyId,
        isVerified: true,
      });
    }

    // 9. Create Opportunities for 2023-2025 (4 per company per year for better data)
    console.log("💼 Creating opportunities for 2023-2025...");
    const opportunities: any[] = [];
    
    for (let year = 2023; year <= 2025; year++) {
      for (let i = 0; i < companies.length; i++) {
        const company = companies[i];

        // Create 4 opportunities per company per year (2 internships, 2 jobs)
        for (let j = 0; j < 4; j++) {
          const opType = j < 2 ? "INTERNSHIP" : "JOB";
          const jobTitles = ["Software Engineer", "Data Analyst", "Product Manager", "UI/UX Designer", "DevOps Engineer", "Full Stack Developer"];
          
          const created = await client.mutation(api.mutations.createOpportunityForSeeding, {
            title: `${jobTitles[j % jobTitles.length]} ${opType === "INTERNSHIP" ? "Internship" : "Position"} at ${company.name} - ${year}`,
            description: `Exciting ${opType.toLowerCase()} opportunity at ${company.name} for the year ${year}. Join our team and work on innovative projects in ${company.name}.`,
            type: opType,
            location: company.location,
            workType: ["REMOTE", "HYBRID", "ONSITE"][j % 3],
            duration: opType === "INTERNSHIP" ? "3 months" : undefined,
            stipend: opType === "INTERNSHIP" ? 25000 + (i * 2000) + (j * 1000) : undefined,
            salary: opType === "JOB" ? 800000 + (i * 100000) + (j * 50000) + (year - 2023) * 100000 : undefined,
            requirements: "Bachelor's degree in relevant field, Strong technical skills, Good communication, Problem-solving abilities",
            skills: ["JavaScript", "React", "Node.js", "Python", "Java", "SQL", "AWS"].slice(0, 3 + (j % 3)),
            academicRequirements: {
              min10thPercentage: 70.0,
              min12thPercentage: 75.0,
              minCGPA: 7.0,
              educationLevel: "Bachelor's degree",
            },
            deadline: dateTS(`${year}-12-31`),
            status: "ACTIVE",
            companyId: company.companyId,
            collegeId: company.collegeId,
            createdByType: "COMPANY",
            createdBy: company.userId,
            createdAt: dateTS(`${year}-01-01`),
            updatedAt: dateTS(`${year}-01-01`),
          });
          
          opportunities.push({
            opportunityId: created.opportunityId,
            companyId: company.companyId,
            collegeId: company.collegeId,
            type: opType,
            location: company.location,
            year,
          });
        }
      }
    }

    console.log("✅ Opportunities created:", opportunities.length);

    // 10. Create Applications spread across all 12 months of 2025
    console.log("📝 Creating applications across all 12 months of 2025...");
    const applications: any[] = [];
    
    const collegeStudents = students.filter(s => s.collegeId === mainCollege.collegeId); // Use mainCollege
    const collegeOpportunitiesFiltered = opportunities.filter(op => op.collegeId === mainCollege.collegeId); // Renamed variable
    
    // Create applications for each month of 2025
    const months2025 = [
      "2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06",
      "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12"
    ];
    
    let applicationIndex = 0;
    for (let monthIndex = 0; monthIndex < months2025.length; monthIndex++) {
      const month = months2025[monthIndex];
      const applicationsThisMonth = 15 + Math.floor(Math.random() * 20); // 15-35 applications per month
      
      for (let i = 0; i < applicationsThisMonth; i++) {
        const student = collegeStudents[applicationIndex % collegeStudents.length];
        const opportunity = collegeOpportunitiesFiltered[applicationIndex % collegeOpportunitiesFiltered.length]; // Use renamed variable
        
        const dayOfMonth = Math.floor(Math.random() * 28) + 1; // Random day in month
        const applicationDate = dateTS(`${month}-${String(dayOfMonth).padStart(2, '0')}`);
        
        const createdApp = await client.mutation(api.mutations.createApplication, {
          studentId: student.studentId,
          opportunityId: opportunity.opportunityId,
        });
        
        applications.push({
          applicationId: createdApp.applicationId,
          studentId: student.studentId,
          opportunityId: opportunity.opportunityId,
          collegeId: student.collegeId,
          month: month,
          createdAt: applicationDate,
        });
        
        applicationIndex++;
      }
    }

    console.log("✅ Applications created:", applications.length);

    // 11. Update application statuses with success rate
    console.log("📋 Updating application statuses...");
    for (let i = 0; i < applications.length; i++) {
      const statuses = ["SHORTLISTED", "SELECTED", "REJECTED", "MENTOR_REVIEW", "PENDING"];
      const status = statuses[i % statuses.length];
      
      await client.mutation(api.mutations.updateApplicationStatus, {
        applicationId: applications[i].applicationId,
        status: status,
        mentorApproved: i % 3 !== 2,
        adminApproved: i % 4 !== 3,
      });
    }

    // 12. Create Placements for 2023-2025 (30 total for good salary trend data)
    console.log("🎯 Creating placements for 2023-2025...");
    const placements: any[] = [];
    
    const collegeApplications = applications.filter(app => app.collegeId === mainCollege.collegeId); // Use mainCollege
    const collegeJobOpportunities = opportunities.filter(op => op.collegeId === mainCollege.collegeId && op.type === "JOB"); // Renamed variable
    const collegeCompanies = companies.filter(c => c.collegeId === mainCollege.collegeId); // Use mainCollege
    
    // Create 10 placements per year (2023, 2024, 2025)
    for (let year = 2023; year <= 2025; year++) {
      for (let i = 0; i < 10; i++) {
        const applicationIndex = (year - 2023) * 10 + i;
        const application = collegeApplications[applicationIndex % collegeApplications.length];
        const company = collegeCompanies[i % collegeCompanies.length];
        const opportunity = collegeJobOpportunities[applicationIndex % collegeJobOpportunities.length]; // Use renamed variable
        
        // Salary increases over years and varies by company
        const baseSalary = 800000 + (year - 2023) * 200000; // Base increases each year
        const companySalaryBonus = i * 100000; // Different companies pay different amounts
        const randomVariation = Math.floor(Math.random() * 200000); // Random variation
        const finalSalary = baseSalary + companySalaryBonus + randomVariation;
        
        const placement = await client.mutation(api.mutations.createPlacement, {
          studentId: application.studentId,
          companyId: company.companyId,
          opportunityId: opportunity?.opportunityId || application.opportunityId,
          applicationId: application.applicationId,
          jobTitle: `Software Engineer - ${year}`,
          salary: finalSalary,
          joinDate: dateTS(`${year}-07-01`),
          location: company.location || "Mumbai, Maharashtra",
          workMode: ["REMOTE", "HYBRID", "ONSITE"][i % 3],
          status: ["OFFER_ACCEPTED", "JOINED"][i % 2] as any,
        });
        placements.push(placement);
        
        // Update student placement status
        await client.mutation(api.mutations.updateStudentPlacementStatus, {
          studentId: application.studentId,
          isPlaced: true,
        });
      }
    }

    console.log("✅ Placements created:", placements.length);

    // 13. Create Internships for 2023-2025 (30 total)
    console.log("🎓 Creating internships for 2023-2025...");
    const internships: any[] = [];
    
    const collegeInternshipOpportunities = opportunities.filter(op => op.collegeId === mainCollege.collegeId && op.type === "INTERNSHIP"); // Renamed variable
    const collegeFacultyForInternship = faculty.filter(f => f.collegeId === mainCollege.collegeId); // Renamed variable
    
    // Create 10 internships per year (2023, 2024, 2025)
    for (let year = 2023; year <= 2025; year++) {
      for (let i = 0; i < 10; i++) {
        const applicationIndex = (year - 2023) * 10 + i + 30; // Different students from placements
        const application = collegeApplications[applicationIndex % collegeApplications.length];
        const company = collegeCompanies[i % collegeCompanies.length];
        const opportunity = collegeInternshipOpportunities[applicationIndex % collegeInternshipOpportunities.length]; // Use renamed variable
        const facultyMember = collegeFacultyForInternship[i % collegeFacultyForInternship.length]; // Use renamed variable
        
        // Stipend increases over years
        const baseStipend = 25000 + (year - 2023) * 5000;
        const companyStipendBonus = i * 2000;
        const finalStipend = baseStipend + companyStipendBonus;
        
        const internship = await client.mutation(api.mutations.createInternship, {
          studentId: application.studentId,
          opportunityId: opportunity?.opportunityId || application.opportunityId,
          collegeId: mainCollege.collegeId, // Use mainCollege
          companyId: company.companyId,
          applicationId: application.applicationId,
          startDate: dateTS(`${year}-06-01`),
          endDate: dateTS(`${year}-09-01`),
          status: ["COMPLETED", "ACTIVE"][i % 2] as any,
          stipend: finalStipend,
          mentorId: facultyMember.facultyId,
          companyMentor: `Mentor ${i + 1}`,
          rating: 4 + (i % 2),
          feedback: `Great internship experience at ${company.name}`,
          createdAt: dateTS(`${year}-01-01`),
          updatedAt: dateTS(`${year}-01-01`),
        });
        internships.push(internship);
      }
    }

    console.log("✅ Internships created:", internships.length);

    console.log("🎉 Convex data seeding completed successfully!");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

run();