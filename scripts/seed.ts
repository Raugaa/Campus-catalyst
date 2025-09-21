import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const CONVEX_URL = "https://veracious-sturgeon-615.convex.cloud";
const CONVEX_DEPLOY_KEY="dev:veracious-sturgeon-615|eyJ2MiI6IjQ1MmQzMTU0Yzg1MTQ4ZTc5M2I3MjY4ODBmNWNkYWMxIn0="



if (!CONVEX_URL) {
  console.error("❌ Missing CONVEX_URL environment variable");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL , {
  deployKey: CONVEX_DEPLOY_KEY,
} as any);

async function run() {
  console.log("🌱 Starting Convex data seeding...");

  try {
    // 1. Create College
    console.log("📚 Creating college...");
    const collegeResult = await client.mutation(api.mutations.createCollege, {
      name: "Tech Institute of Engineering",
      code: "TIE",
      location: "Pune, Maharashtra",
      type: "COLLEGE",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    const collegeId = collegeResult.collegeId;
    console.log("✅ College created:", collegeId);

    // 2. Create Admin user and profile
    console.log("👤 Creating admin...");
    const adminResult = await client.action(api.actions.createAdmin, {
      email: "admin@tie.edu",
      password: "admin123",
      name: "Dr. Rajesh Kumar",
      phone: "9999999999",
      department: "Training & Placement Cell",
      collegeId: collegeId,
    });

    console.log("✅ Admin created:", adminResult.userId);

    // 3. Create Faculty (Mentors)
    console.log("👨‍🏫 Creating faculty members...");
    const faculty1Result = await client.action(api.actions.createFaculty, {
      email: "mentor1@tie.edu",
      password: "faculty123",
      name: "Prof. Priya Sharma",
      department: "Computer Science",
      designation: "Associate Professor",
      phone: "9888888881",
      canMentor: true,
      collegeId: collegeId,
    });

    const faculty2Result = await client.action(api.actions.createFaculty, {
      email: "mentor2@tie.edu", 
      password: "faculty123",
      name: "Dr. Amit Patel",
      department: "Information Technology",
      designation: "Professor",
      phone: "9888888882",
      canMentor: true,
      collegeId: collegeId,
    });

    console.log("✅ Faculty created:", [faculty1Result.userId, faculty2Result.userId]);

    // 4. Create Students
    console.log("🎓 Creating students...");
    const student1Result = await client.action(api.actions.createStudent, {
      email: "s1@tie.edu",
      password: "student123",
      firstName: "Rahul",
      lastName: "Gupta",
      rollNumber: "CS2021001",
      phone: "9777777771",
      department: "Computer Science",
      year: "TY",
      semester: 6,
      cgpa: 8.5,
      skills: ["JavaScript", "React", "Node.js", "Python"],
      collegeId: collegeId,
      mentorId: faculty1Result.facultyId,
    });

    const student2Result = await client.action(api.actions.createStudent, {
      email: "s2@tie.edu",
      password: "student123", 
      firstName: "Sneha",
      lastName: "Reddy",
      rollNumber: "IT2021002",
      phone: "9777777772",
      department: "Information Technology",
      year: "TY",
      semester: 6,
      cgpa: 9.1,
      skills: ["Java", "Spring Boot", "MySQL", "AWS"],
      collegeId: collegeId,
      mentorId: faculty2Result.facultyId,
    });

    const student3Result = await client.action(api.actions.createStudent, {
      email: "s3@tie.edu",
      password: "student123",
      firstName: "Arjun",
      lastName: "Singh", 
      rollNumber: "CS2021003",
      phone: "9777777773",
      department: "Computer Science",
      year: "LY",
      semester: 8,
      cgpa: 7.8,
      skills: ["Python", "Django", "PostgreSQL", "Docker"],
      collegeId: collegeId,
      mentorId: faculty1Result.facultyId,
    });

    console.log("✅ Students created:", [student1Result.userId, student2Result.userId, student3Result.userId]);

    // 5. Create Companies
    console.log("🏢 Creating companies...");
    const company1Result = await client.action(api.actions.registerCompany, {
      email: "hr@techcorp.com",
      password: "company123",
      name: "TechCorp Solutions",
      website: "https://techcorp.com",
      location: "Mumbai, Maharashtra",
      industry: "Information Technology",
      size: "100-500",
      description: "Leading software development company specializing in web and mobile applications.",
    });

    const company2Result = await client.action(api.actions.registerCompany, {
      email: "careers@innovate.co",
      password: "company123",
      name: "InnovateLab",
      website: "https://innovatelab.co",
      location: "Bangalore, Karnataka", 
      industry: "Technology",
      size: "50-100",
      description: "AI and Machine Learning focused startup building next-generation solutions.",
    });

    console.log("✅ Companies created:", [company1Result.userId, company2Result.userId]);

    // 6. Verify companies (normally done by admin)
    console.log("✅ Verifying companies...");
    await client.mutation(api.mutations.verifyCompany, {
      companyId: company1Result.companyId,
      isVerified: true,
    });

    await client.mutation(api.mutations.verifyCompany, {
      companyId: company2Result.companyId,
      isVerified: true,
    });

    // 7. Create some opportunities
    console.log("💼 Creating job opportunities...");
    const opp1Result = await client.mutation(api.mutations.createOpportunity, {
      title: "Full Stack Developer Intern",
      description: "Work on exciting web applications using modern technologies like React, Node.js, and MongoDB.",
      location: "Mumbai, Maharashtra",
      type: "INTERNSHIP",
      duration: "6 months",
      stipend: "₹25,000/month",
      requirements: "Good knowledge of JavaScript, React, and Node.js. Experience with databases preferred.",
      skills: ["JavaScript", "React", "Node.js", "MongoDB"],
      deadline: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days from now
      companyId: company1Result.companyId,
    });

    const opp2Result = await client.mutation(api.mutations.createOpportunity, {
      title: "AI/ML Engineer",
      description: "Join our AI team to work on cutting-edge machine learning projects and research.",
      location: "Bangalore, Karnataka",
      type: "PLACEMENT",
      salary: "₹8-12 LPA",
      requirements: "Strong background in Python, machine learning algorithms, and data science.",
      skills: ["Python", "Machine Learning", "TensorFlow", "PyTorch", "Data Science"],
      deadline: Date.now() + (45 * 24 * 60 * 60 * 1000), // 45 days from now
      companyId: company2Result.companyId,
    });

    console.log("✅ Opportunities created:", [opp1Result.opportunityId, opp2Result.opportunityId]);

    // 8. Create some applications
    console.log("📝 Creating sample applications...");
    const app1Result = await client.mutation(api.mutations.createApplication, {
      studentId: student1Result.studentId,
      opportunityId: opp1Result.opportunityId,
    });

    const app2Result = await client.mutation(api.mutations.createApplication, {
      studentId: student2Result.studentId,
      opportunityId: opp2Result.opportunityId,
    });

    console.log("✅ Applications created:", [app1Result.applicationId, app2Result.applicationId]);

    console.log("\n🎉 Database seeded successfully!");
    console.log("\n📋 Default login credentials:");
    console.log("👤 Admin: admin@tie.edu / admin123");
    console.log("👨‍🏫 Faculty 1: mentor1@tie.edu / faculty123");
    console.log("👨‍🏫 Faculty 2: mentor2@tie.edu / faculty123"); 
    console.log("🎓 Student 1: s1@tie.edu / student123");
    console.log("🎓 Student 2: s2@tie.edu / student123");
    console.log("🎓 Student 3: s3@tie.edu / student123");
    console.log("🏢 Company 1: hr@techcorp.com / company123");
    console.log("🏢 Company 2: careers@innovate.co / company123");

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

run()
  .then(() => {
    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Seeding failed:", error);
    process.exit(1);
  });