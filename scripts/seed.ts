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

    // 2. Create 3 Colleges
    console.log("📚 Creating colleges...");
    const colleges: any[] = [];
    
    const collegeResult1 = await client.mutation(api.mutations.createCollegeForSeeding, {
      name: "KJ Somaiya College of Engineering",
      code: "KJSCE",
      location: "Mumbai, Maharashtra",
      type: "COLLEGE",
      website: "https://kjsce.somaiya.edu.in",
      phone: "022-67728000",
      logo: "https://kjsce.somaiya.edu.in/assets/kjsce/images/Logo/kjsce-logo.png",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    colleges.push({ collegeId: collegeResult1.collegeId, code: "KJSCE", name: "KJ Somaiya College of Engineering" });

    const collegeResult2 = await client.mutation(api.mutations.createCollegeForSeeding, {
      name: "Indian Institute of Technology Bombay",
      code: "IITB",
      location: "Mumbai, Maharashtra",
      type: "INSTITUTE",
      website: "https://www.iitb.ac.in",
      phone: "022-25722545",
      logo: "https://www.iitb.ac.in/sites/default/files/iitb_logo.png",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    colleges.push({ collegeId: collegeResult2.collegeId, code: "IITB", name: "Indian Institute of Technology Bombay" });

    const collegeResult3 = await client.mutation(api.mutations.createCollegeForSeeding, {
      name: "Delhi Technological University",
      code: "DTU",
      location: "Delhi, India",
      type: "UNIVERSITY",
      website: "https://www.dtu.ac.in",
      phone: "011-27871023",
      logo: "https://www.dtu.ac.in/images/dtu-logo.png",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    colleges.push({ collegeId: collegeResult3.collegeId, code: "DTU", name: "Delhi Technological University" });

    console.log("✅ Colleges created:", colleges.length);

    // 3. Create 7 Branches for each college
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

    for (const college of colleges) {
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

    // 4. Create 1 Admin per college
    console.log("👤 Creating admins...");
    const admins: any[] = [];
    
    const adminData = [
      { email: "admin@somaiya.edu", name: "Vikrant Waghmare", department: "Training & Placement Cell" },
      { email: "placement@iitb.ac.in", name: "Dr. Rajesh Gupta", department: "Career Development Center" },
      { email: "tpo@dtu.ac.in", name: "Dr. Sunita Agarwal", department: "Training & Placement Office" },
    ];

    for (let i = 0; i < colleges.length; i++) {
      const admin = await client.mutation(api.mutations.createAdminForSeeding, {
        email: adminData[i].email,
        passwordHash: await bcrypt.hash("admin123", 10),
        name: adminData[i].name,
        phone: `999999998${i}`,
        department: adminData[i].department,
        collegeId: colleges[i].collegeId,
      });
      admins.push({ ...admin, collegeId: colleges[i].collegeId });
    }

    console.log("✅ Admins created:", admins.length);

    // 5. Create Faculty (10 per college)
    console.log("👨‍🏫 Creating faculty...");
    const faculty: any[] = [];
    
    const facultyNames = [
      "Dr. Priya Sharma", "Dr. Rajesh Kumar", "Prof. Amit Singh", "Dr. Kavita Mehta", "Dr. Suresh Patel",
      "Prof. Neha Gupta", "Dr. Vikram Joshi", "Prof. Anita Verma", "Dr. Rahul Agarwal", "Prof. Deepika Nair",
      "Dr. Arjun Reddy", "Prof. Pooja Yadav", "Dr. Siddharth Mishra", "Prof. Riya Tiwari", "Dr. Harsh Pandey"
    ];

    const departments = ["Computer Science", "Information Technology", "Electronics", "Electrical", "Mechanical", "Civil", "Chemical"];
    const designations = ["Professor", "Associate Professor", "Assistant Professor"];

    for (let collegeIndex = 0; collegeIndex < colleges.length; collegeIndex++) {
      const college = colleges[collegeIndex];
      for (let i = 0; i < 10; i++) {
        const facultyResult = await client.mutation(api.mutations.createFacultyForSeeding, {
          email: `faculty${i + 1}@${college.code.toLowerCase()}.edu`,
          passwordHash: await bcrypt.hash("faculty123", 10),
          name: facultyNames[(collegeIndex * 10 + i) % facultyNames.length],
          phone: `988888888${collegeIndex}${i}`,
          department: departments[i % departments.length],
          designation: designations[i % designations.length],
          canMentor: true,
          collegeId: college.collegeId,
        });
        faculty.push({ facultyId: facultyResult.facultyId, collegeId: college.collegeId });
      }
    }

    console.log("✅ Faculty created:", faculty.length);

    // 6. Create 150 Students per college (total 450)
    console.log("👨‍🎓 Creating 150 students per college...");
    const students: any[] = [];
    
    for (let collegeIndex = 0; collegeIndex < colleges.length; collegeIndex++) {
      const college = colleges[collegeIndex];
      const collegeBranches = branches.filter(b => b.collegeId === college.collegeId);
      const collegeFaculty = faculty.filter(f => f.collegeId === college.collegeId);
      
      console.log(`Creating students for ${college.name}...`);
      for (let i = 0; i < 150; i++) {
        const branch = collegeBranches[i % collegeBranches.length];
        const studentData = generateStudentData(i, college.code, branch.code, 2021 + (i % 4));
        const facultyMember = collegeFaculty[i % collegeFaculty.length];
        
        const student = await client.mutation(api.mutations.createUserAndStudent, {
          userData: {
            email: `student${i + 1}@${college.code.toLowerCase()}.edu`,
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
            year: i < 75 ? "Final Year" : "Third Year",
            semester: i < 75 ? 8 : 6,
            tenthPercentage: studentData.tenthPercentage,
            twelfthPercentage: studentData.twelfthPercentage,
            cgpa: studentData.cgpa,
            skills: studentData.skills,
            isPlaced: false,
            collegeId: college.collegeId,
            mentorId: facultyMember.facultyId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        });
        students.push({ ...student, collegeId: college.collegeId });
      }
    }

    console.log("✅ Students created:", students.length);

    // 7. Create Companies (15 companies, 5 per college)
    console.log("🏢 Creating companies...");
    const companies: any[] = [];
    
    const companyData = [
      // KJSCE Companies
      { name: "TechCorp Solutions", location: "Bangalore, Karnataka", industry: "Information Technology" },
      { name: "InnovateLab", location: "Mumbai, Maharashtra", industry: "Technology" },
      { name: "CloudTech Systems", location: "Pune, Maharashtra", industry: "Cloud Computing" },
      { name: "WebDev Pro", location: "Mumbai, Maharashtra", industry: "Web Development" },
      { name: "MobileTech Inc", location: "Bangalore, Karnataka", industry: "Mobile Development" },
      
      // IITB Companies
      { name: "DataDyne Analytics", location: "Pune, Maharashtra", industry: "Data Analytics" },
      { name: "FinTech Innovations", location: "Mumbai, Maharashtra", industry: "Financial Technology" },
      { name: "AI Ventures", location: "Bangalore, Karnataka", industry: "Artificial Intelligence" },
      { name: "RoboTech Solutions", location: "Chennai, Tamil Nadu", industry: "Robotics" },
      { name: "CyberSec Corp", location: "Hyderabad, Telangana", industry: "Cybersecurity" },
      
      // DTU Companies
      { name: "StartupHub Delhi", location: "Delhi, India", industry: "Technology Consulting" },
      { name: "EduTech Solutions", location: "Gurgaon, Haryana", industry: "Educational Technology" },
      { name: "GreenTech Innovations", location: "Noida, Uttar Pradesh", industry: "Clean Technology" },
      { name: "HealthTech Systems", location: "Delhi, India", industry: "Healthcare Technology" },
      { name: "LogiTech Solutions", location: "Gurgaon, Haryana", industry: "Logistics Technology" },
    ];

    for (let i = 0; i < companyData.length; i++) {
      const collegeIndex = Math.floor(i / 5);
      const result = await client.mutation(api.mutations.createCompanyForSeeding, {
        email: `hr${i + 1}@${companyData[i].name.toLowerCase().replace(/\s+/g, '')}.com`,
        passwordHash: await bcrypt.hash("company123", 10),
        name: companyData[i].name,
        website: `https://${companyData[i].name.toLowerCase().replace(/\s+/g, '')}.com`,
        location: companyData[i].location,
        industry: companyData[i].industry,
        size: ["50-100", "100-500", "500-1000", "1000+"][i % 4],
        description: `Leading company in ${companyData[i].industry}`,
        collegeId: colleges[collegeIndex].collegeId,
      });

      companies.push({
        companyId: result.companyId,
        userId: result.userId,
        collegeId: colleges[collegeIndex].collegeId,
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

    // 9. Create Opportunities for 2023-2025 (3 per company per year)
    console.log("💼 Creating opportunities for 2023-2025...");
    const opportunities: any[] = [];
    
    for (let year = 2023; year <= 2025; year++) {
      for (let i = 0; i < companies.length; i++) {
        const company = companies[i];

        // Create 3 opportunities per company per year (1 internship, 2 jobs)
        for (let j = 0; j < 3; j++) {
          const opType = j === 0 ? "INTERNSHIP" : "JOB";
          const jobTitles = ["Software Engineer", "Data Analyst", "Product Manager", "UI/UX Designer", "DevOps Engineer"];
          
          const created = await client.mutation(api.mutations.createOpportunityForSeeding, {
            title: `${jobTitles[j % jobTitles.length]} ${opType === "INTERNSHIP" ? "Internship" : "Position"} at ${company.name} - ${year}`,
            description: `Exciting ${opType.toLowerCase()} opportunity at ${company.name} for the year ${year}. Join our team and work on innovative projects in ${company.name}.`,
            type: opType,
            location: company.location,
            workType: ["REMOTE", "HYBRID", "ONSITE"][j % 3],
            duration: opType === "INTERNSHIP" ? "3 months" : undefined,
            stipend: opType === "INTERNSHIP" ? 25000 + (i * 2000) : undefined,
            salary: opType === "JOB" ? 800000 + (i * 100000) + (j * 50000) : undefined,
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

    // 10. Create Applications (first 100 students per college apply)
    console.log("📝 Creating applications...");
    const applications: any[] = [];
    
    for (let collegeIndex = 0; collegeIndex < colleges.length; collegeIndex++) {
      const collegeStudents = students.filter(s => s.collegeId === colleges[collegeIndex].collegeId);
      const collegeOpportunities = opportunities.filter(op => op.collegeId === colleges[collegeIndex].collegeId);
      
      for (let i = 0; i < Math.min(100, collegeStudents.length); i++) {
        const student = collegeStudents[i];
        
        // Each student applies to 3-5 opportunities
        const numApplications = 3 + (i % 3);
        for (let j = 0; j < numApplications && j < collegeOpportunities.length; j++) {
          const opportunityMeta = collegeOpportunities[j % collegeOpportunities.length];
          const createdApp = await client.mutation(api.mutations.createApplication, {
            studentId: student.studentId,
            opportunityId: opportunityMeta.opportunityId,
          });
          
          applications.push({
            applicationId: createdApp.applicationId,
            studentId: student.studentId,
            opportunityId: opportunityMeta.opportunityId,
            collegeId: student.collegeId,
          });
        }
      }
    }

    console.log("✅ Applications created:", applications.length);

    // 11. Update application statuses
    console.log("📋 Updating application statuses...");
    for (let i = 0; i < Math.min(50, applications.length); i++) {
      const statuses = ["SHORTLISTED", "SELECTED", "REJECTED", "MENTOR_REVIEW", "PENDING"];
      await client.mutation(api.mutations.updateApplicationStatus, {
        applicationId: applications[i].applicationId,
        status: statuses[i % statuses.length],
        mentorApproved: i % 3 !== 2,
        adminApproved: i % 4 !== 3,
      });
    }

    // 12. Create Placements for 2023-2025 (DISTRIBUTED ACROSS COLLEGES)
    console.log("🎯 Creating placements for 2023-2025...");
    const placements: any[] = [];
    
    // Create 20 placements per college (60 total)
    for (let collegeIndex = 0; collegeIndex < colleges.length; collegeIndex++) {
      const collegeApplications = applications.filter(app => app.collegeId === colleges[collegeIndex].collegeId);
      const collegeOpportunities = opportunities.filter(op => op.collegeId === colleges[collegeIndex].collegeId && op.type === "JOB");
      const collegeCompanies = companies.filter(c => c.collegeId === colleges[collegeIndex].collegeId);
      
      // Take first 20 applications from this college for placements
      const selectedApplications = collegeApplications.slice(0, 20);
      
      for (let i = 0; i < selectedApplications.length; i++) {
        const application = selectedApplications[i];
        const company = collegeCompanies[i % collegeCompanies.length];
        const opportunity = collegeOpportunities[i % collegeOpportunities.length];
        const year = 2023 + (i % 3);
        
        const placement = await client.mutation(api.mutations.createPlacement, {
          studentId: application.studentId,
          companyId: company.companyId,
          opportunityId: opportunity?.opportunityId || application.opportunityId,
          applicationId: application.applicationId,
          jobTitle: `Software Engineer - ${year}`,
          salary: 800000 + (collegeIndex * 200000) + (i * 50000), // Different salary ranges per college
          joinDate: dateTS(`${year}-07-01`),
          location: company.location || "Mumbai, Maharashtra",
          workMode: ["REMOTE", "HYBRID", "ONSITE"][i % 3],
          status: ["OFFER_ACCEPTED", "JOINED"][i % 2] as any, // Only accepted/joined placements
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

    // 13. Create Internships for 2023-2025 (DISTRIBUTED ACROSS COLLEGES)
    console.log("🎓 Creating internships for 2023-2025...");
    const internships: any[] = [];
    
    // Create 20 internships per college (60 total)
    for (let collegeIndex = 0; collegeIndex < colleges.length; collegeIndex++) {
      const collegeApplications = applications.filter(app => app.collegeId === colleges[collegeIndex].collegeId);
      const collegeOpportunities = opportunities.filter(op => op.collegeId === colleges[collegeIndex].collegeId && op.type === "INTERNSHIP");
      const collegeCompanies = companies.filter(c => c.collegeId === colleges[collegeIndex].collegeId);
      const collegeFaculty = faculty.filter(f => f.collegeId === colleges[collegeIndex].collegeId);
      
      // Take applications 20-40 from this college for internships (different from placements)
      const selectedApplications = collegeApplications.slice(20, 40);
      
      for (let i = 0; i < selectedApplications.length; i++) {
        const application = selectedApplications[i];
        const company = collegeCompanies[i % collegeCompanies.length];
        const opportunity = collegeOpportunities[i % collegeOpportunities.length];
        const facultyMember = collegeFaculty[i % collegeFaculty.length];
        const year = 2023 + (i % 3);
        
        const internship = await client.mutation(api.mutations.createInternship, {
          studentId: application.studentId,
          opportunityId: opportunity?.opportunityId || application.opportunityId,
          collegeId: colleges[collegeIndex].collegeId,
          companyId: company.companyId,
          applicationId: application.applicationId,
          startDate: dateTS(`${year}-06-01`),
          endDate: dateTS(`${year}-09-01`),
          status: ["COMPLETED", "ACTIVE"][i % 2] as any, // Mix of completed and active
          stipend: 25000 + (collegeIndex * 5000) + (i * 1000), // Different stipend ranges per college
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

    console.log("🎉 Seeding completed successfully!");
    console.log("📊 Summary:");
    console.log(`- Global Admins: 1`);
    console.log(`- Colleges: ${colleges.length}`);
    console.log(`- Admins: ${admins.length} (1 per college)`);
    console.log(`- Branches: ${branches.length} (7 per college)`);
    console.log(`- Faculty: ${faculty.length} (10 per college)`);
    console.log(`- Students: ${students.length} (150 per college)`);
    console.log(`- Companies: ${companies.length} (5 per college)`);
    console.log(`- Opportunities: ${opportunities.length} (3 per company per year, 2023-2025)`);
    console.log(`- Applications: ${applications.length}`);
    console.log(`- Placements: ${placements.length} (20 per college, 2023-2025)`);
    console.log(`- Internships: ${internships.length} (20 per college, 2023-2025)`);

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

run();