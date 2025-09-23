// seed-expanded.ts
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

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

async function run() {
  console.log("🌱 Starting Convex data seeding...");

  try {
    // ---------------------------------------------------------------------
    // --- ORIGINAL BLOCK (kept exactly as provided) -----------------------
    // ---------------------------------------------------------------------
    // 1. Create College
    console.log("📚 Creating college...");
    const collegeResult = await client.mutation(api.mutations.createCollege, {
      name: "KJ Somaiya College of Engineering",
      code: "KJSCE",
      location: "Mumbai, Maharashtra",
      type: "COLLEGE",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    const collegeId = collegeResult.collegeId;
    console.log("✅ College created:", collegeId);

    // 2. Create Branches
    console.log("🏢 Creating branches...");
    const branch1 = await client.mutation(api.mutations.createBranch, {
      name: "Computer Science Engineering",
      code: "CSE",
      collegeId: collegeId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    const branch2 = await client.mutation(api.mutations.createBranch, {
      name: "Information Technology",
      code: "IT",
      collegeId: collegeId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    const branch3 = await client.mutation(api.mutations.createBranch, {
      name: "Electronics Engineering",
      code: "EC",
      collegeId: collegeId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    console.log("✅ Branches created:", branch1.branchId, branch2.branchId, branch3.branchId);

    // 3. Create Admin user and profile
    console.log("👤 Creating admin...");
    const adminResult = await client.action(api.actions.createAdmin, {
      email: "admin@somaiya.edu",
      password: "admin123",
      name: "Vikrant Waghmare",
      phone: "9999999988",
      department: "Training & Placement Cell",
      collegeId: collegeId,
    });
    console.log("✅ Admin created:", adminResult.userId);

    // 4. Create Faculty users
    console.log("👨‍🏫 Creating faculty...");
    const faculty1 = await client.action(api.actions.createFaculty, {
      email: "faculty1@somaiya.edu",
      password: "faculty123",
      name: "Dr. Priya Sharma",
      phone: "9888888881",
      department: "Computer Science",
      designation: "Professor",
      canMentor: true,
      collegeId: collegeId,
    });

    const faculty2 = await client.action(api.actions.createFaculty, {
      email: "faculty2@somaiya.edu",
      password: "faculty123",
      name: "Dr. Rajesh Kumar",
      phone: "9888888882",
      department: "Information Technology",
      designation: "Associate Professor",
      canMentor: true,
      collegeId: collegeId,
    });

    const faculty3 = await client.action(api.actions.createFaculty, {
      email: "faculty3@somaiya.edu",
      password: "faculty123",
      name: "Prof. Anita Desai",
      phone: "9888888883",
      department: "Electronics",
      designation: "Assistant Professor",
      canMentor: false,
      collegeId: collegeId,
    });

    console.log("✅ Faculty created:", faculty1.userId, faculty2.userId, faculty3.userId);

    // 5. Create Student users
    console.log("👨‍🎓 Creating students...");
    const students: any[] = [];

    const student1 = await client.action(api.actions.createStudent, {
      email: "student1@somaiya.edu",
      password: "student123",
      firstName: "Arjun",
      lastName: "Patel",
      rollNumber: "CS2021001",
      phone: "9777777771",
      department: "Computer Science",
      year: "Final Year",
      semester: 8,
      cgpa: 8.5,
      skills: ["React", "Node.js", "Python", "Machine Learning"],
      collegeId: collegeId,
      mentorId: faculty1.facultyId,
    });
    students.push(student1);

    const student2 = await client.action(api.actions.createStudent, {
      email: "student2@somaiya.edu",
      password: "student123",
      firstName: "Priya",
      lastName: "Singh",
      rollNumber: "IT2021002",
      phone: "9777777772",
      department: "Information Technology",
      year: "Final Year",
      semester: 8,
      cgpa: 9.1,
      skills: ["Java", "Spring Boot", "AWS", "Docker"],
      collegeId: collegeId,
      mentorId: faculty2.facultyId,
    });
    students.push(student2);

    const student3 = await client.action(api.actions.createStudent, {
      email: "student3@somaiya.edu",
      password: "student123",
      firstName: "Rohit",
      lastName: "Sharma",
      rollNumber: "CS2022003",
      phone: "9777777773",
      department: "Computer Science",
      year: "Third Year",
      semester: 6,
      cgpa: 7.8,
      skills: ["JavaScript", "React", "MongoDB"],
      collegeId: collegeId,
      mentorId: faculty1.facultyId,
    });
    students.push(student3);

    const student4 = await client.action(api.actions.createStudent, {
      email: "student4@somaiya.edu",
      password: "student123",
      firstName: "Sneha",
      lastName: "Gupta",
      rollNumber: "EC2021004",
      phone: "9777777774",
      department: "Electronics",
      year: "Final Year",
      semester: 8,
      cgpa: 8.9,
      skills: ["Embedded Systems", "IoT", "C++", "MATLAB"],
      collegeId: collegeId,
    });
    students.push(student4);

    const student5 = await client.action(api.actions.createStudent, {
      email: "student5@somaiya.edu",
      password: "student123",
      firstName: "Vikash",
      lastName: "Yadav",
      rollNumber: "IT2022005",
      phone: "9777777775",
      department: "Information Technology",
      year: "Third Year",
      semester: 6,
      cgpa: 8.2,
      skills: ["Python", "Django", "PostgreSQL", "Git"],
      collegeId: collegeId,
      mentorId: faculty2.facultyId,
    });
    students.push(student5);

    const student6 = await client.action(api.actions.createStudent, {
      email: "student6@somaiya.edu",
      password: "student123",
      firstName: "Anjali",
      lastName: "Verma",
      rollNumber: "CS2020006",
      phone: "9777777776",
      department: "Computer Science",
      year: "Final Year",
      semester: 8,
      cgpa: 9.2,
      skills: ["Full Stack Development", "React", "Node.js", "GraphQL"],
      collegeId: collegeId,
      mentorId: faculty1.facultyId,
    });
    students.push(student6);

    console.log("✅ Students created:", students.length);

    // 6. Create Company users
    console.log("🏢 Creating companies...");
    const company1 = await client.action(api.actions.registerCompany, {
      email: "hr@techcorp.com",
      password: "company123",
      name: "TechCorp Solutions",
      website: "https://techcorp.com",
      location: "Bangalore, Karnataka",
      industry: "Information Technology",
      size: "500-1000",
      description: "Leading software development company specializing in web and mobile applications.",
    });

    const company2 = await client.action(api.actions.registerCompany, {
      email: "careers@innovatelab.com",
      password: "company123",
      name: "InnovateLab",
      website: "https://innovatelab.com",
      location: "Mumbai, Maharashtra",
      industry: "Technology",
      size: "100-500",
      description: "Innovative startup focusing on AI and machine learning solutions.",
    });

    const company3 = await client.action(api.actions.registerCompany, {
      email: "jobs@datadyne.com",
      password: "company123",
      name: "DataDyne Analytics",
      website: "https://datadyne.com",
      location: "Pune, Maharashtra",
      industry: "Data Analytics",
      size: "50-100",
      description: "Data analytics and business intelligence company.",
    });
    const company4 = await client.action(api.actions.registerCompany, {
      email: "recruitment@fintech.com",
      password: "company123",
      name: "FinTech Innovations",
      website: "https://fintech.com",
      location: "Mumbai, Maharashtra",
      industry: "Financial Technology",
      size: "200-500",
      description: "Leading fintech company providing digital payment solutions.",
    });

    console.log("✅ Companies created:", company1.userId, company2.userId, company3.userId, company4.userId);

    // Build companiesMeta so extra records can reuse location and name
    const companiesMeta: Array<{ companyId: string; name: string; location: string }> = [
      { companyId: company1.companyId, name: "TechCorp Solutions", location: "Bangalore, Karnataka" },
      { companyId: company2.companyId, name: "InnovateLab", location: "Mumbai, Maharashtra" },
      { companyId: company3.companyId, name: "DataDyne Analytics", location: "Pune, Maharashtra" },
      { companyId: company4.companyId, name: "FinTech Innovations", location: "Mumbai, Maharashtra" },
    ];

    // 7. Verify companies (admin action)
    console.log("✅ Verifying companies...");
    await client.mutation(api.mutations.verifyCompany, {
      companyId: company1.companyId,
      isVerified: true,
    });
    await client.mutation(api.mutations.verifyCompany, {
      companyId: company2.companyId,
      isVerified: true,
    });
    await client.mutation(api.mutations.verifyCompany, {
      companyId: company3.companyId,
      isVerified: true,
    });
    await client.mutation(api.mutations.verifyCompany, {
      companyId: company4.companyId,
      isVerified: true,
    });

    // 8. Create Opportunities (original five - kept exactly)
    console.log("💼 Creating opportunities...");
    const opportunity1 = await client.mutation(api.mutations.createOpportunity, {
      title: "Software Development Intern",
      description:
        "Join our development team to work on cutting-edge web applications using React and Node.js. You'll be working on real projects and learning from experienced developers.",
      type: "INTERNSHIP",
      location: "Bangalore, Karnataka",
      workMode: "HYBRID",
      duration: "3 months",
      stipend: 25000,
      currency: "INR",
      requirements: [
        "Final year or pre-final year students",
        "Strong programming fundamentals",
        "Knowledge of web technologies",
        "Good communication skills",
      ],
      skills: ["React", "Node.js", "JavaScript", "Git"],
      eligibleDepartments: ["Computer Science", "Information Technology"],
      eligibleYears: ["Third Year", "Final Year"],
      minCGPA: 7.0,
      deadline: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
      status: "ACTIVE",
      companyId: company1.companyId,
    });

    const opportunity2 = await client.mutation(api.mutations.createOpportunity, {
      title: "AI/ML Engineer",
      description:
        "Work on machine learning projects and develop AI solutions for real-world problems. Experience with Python and ML frameworks required.",
      type: "JOB",
      location: "Mumbai, Maharashtra",
      workMode: "ONSITE",
      salary: 800000,
      currency: "INR",
      requirements: [
        "Bachelor's degree in CS/IT/EC",
        "Experience with ML frameworks",
        "Strong mathematical background",
        "Python programming skills",
      ],
      skills: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Data Science"],
      eligibleDepartments: ["Computer Science", "Information Technology", "Electronics"],
      eligibleYears: ["Final Year"],
      minCGPA: 8.0,
      deadline: Date.now() + 45 * 24 * 60 * 60 * 1000, // 45 days from now
      status: "ACTIVE",
      companyId: company2.companyId,
    });

    const opportunity3 = await client.mutation(api.mutations.createOpportunity, {
      title: "Data Analyst Internship",
      description:
        "Analyze business data and create insightful reports and dashboards. Work with SQL, Python, and visualization tools.",
      type: "INTERNSHIP",
      location: "Pune, Maharashtra",
      workMode: "REMOTE",
      duration: "6 months",
      stipend: 20000,
      currency: "INR",
      requirements: ["Knowledge of SQL and Excel", "Understanding of statistics", "Good analytical skills", "Attention to detail"],
      skills: ["SQL", "Python", "Excel", "Tableau", "Statistics"],
      eligibleDepartments: ["Computer Science", "Information Technology"],
      eligibleYears: ["Third Year", "Final Year"],
      minCGPA: 7.5,
      deadline: Date.now() + 20 * 24 * 60 * 60 * 1000, // 20 days from now
      status: "ACTIVE",
      companyId: company3.companyId,
    });

    const opportunity4 = await client.mutation(api.mutations.createOpportunity, {
      title: "Full Stack Developer",
      description:
        "Develop end-to-end web applications for fintech products. Work with modern technologies and agile methodologies.",
      type: "JOB",
      location: "Mumbai, Maharashtra",
      workMode: "HYBRID",
      salary: 1200000,
      currency: "INR",
      requirements: [
        "Bachelor's degree in Computer Science/IT",
        "2+ years of experience in full stack development",
        "Knowledge of React, Node.js, and databases",
        "Understanding of financial systems is a plus",
      ],
      skills: ["React", "Node.js", "JavaScript", "MongoDB", "PostgreSQL"],
      eligibleDepartments: ["Computer Science", "Information Technology"],
      eligibleYears: ["Final Year"],
      minCGPA: 8.5,
      deadline: Date.now() + 25 * 24 * 60 * 60 * 1000, // 25 days from now
      status: "ACTIVE",
      companyId: company4.companyId,
    });

    const opportunity5 = await client.mutation(api.mutations.createOpportunity, {
      title: "Frontend Developer Intern",
      description: "Create beautiful and responsive user interfaces using modern frontend technologies.",
      type: "INTERNSHIP",
      location: "Bangalore, Karnataka",
      workMode: "ONSITE",
      duration: "4 months",
      stipend: 22000,
      currency: "INR",
      requirements: ["Knowledge of HTML, CSS, JavaScript", "Familiarity with React or Vue.js", "Good design sense", "Portfolio of projects"],
      skills: ["HTML", "CSS", "JavaScript", "React", "Figma"],
      eligibleDepartments: ["Computer Science", "Information Technology"],
      eligibleYears: ["Third Year", "Final Year"],
      minCGPA: 7.0,
      deadline: Date.now() + 35 * 24 * 60 * 60 * 1000, // 35 days from now
      status: "ACTIVE",
      companyId: company1.companyId,
    });

    console.log(
      "✅ Opportunities created:",
      opportunity1.opportunityId,
      opportunity2.opportunityId,
      opportunity3.opportunityId,
      opportunity4.opportunityId,
      opportunity5.opportunityId
    );

    // Keep opportunitiesMeta so appended entries have correct location/type
    const opportunitiesMeta: Array<{ opportunityId: string; type: string; location: string }> = [
      { opportunityId: opportunity1.opportunityId, type: "INTERNSHIP", location: "Bangalore, Karnataka" },
      { opportunityId: opportunity2.opportunityId, type: "JOB", location: "Mumbai, Maharashtra" },
      { opportunityId: opportunity3.opportunityId, type: "INTERNSHIP", location: "Pune, Maharashtra" },
      { opportunityId: opportunity4.opportunityId, type: "JOB", location: "Mumbai, Maharashtra" },
      { opportunityId: opportunity5.opportunityId, type: "INTERNSHIP", location: "Bangalore, Karnataka" },
    ];

    // 9. Create Applications (original 8)
    console.log("📝 Creating applications...");

    const app1 = await client.mutation(api.mutations.createApplication, {
      studentId: students[0].studentId,
      opportunityId: opportunity1.opportunityId,
    });
    const app2 = await client.mutation(api.mutations.createApplication, {
      studentId: students[1].studentId,
      opportunityId: opportunity2.opportunityId,
    });
    const app3 = await client.mutation(api.mutations.createApplication, {
      studentId: students[2].studentId,
      opportunityId: opportunity3.opportunityId,
    });
    const app4 = await client.mutation(api.mutations.createApplication, {
      studentId: students[3].studentId,
      opportunityId: opportunity1.opportunityId,
    });
    const app5 = await client.mutation(api.mutations.createApplication, {
      studentId: students[4].studentId,
      opportunityId: opportunity3.opportunityId,
    });
    const app6 = await client.mutation(api.mutations.createApplication, {
      studentId: students[5].studentId,
      opportunityId: opportunity4.opportunityId,
    });
    const app7 = await client.mutation(api.mutations.createApplication, {
      studentId: students[0].studentId,
      opportunityId: opportunity5.opportunityId,
    });
    const app8 = await client.mutation(api.mutations.createApplication, {
      studentId: students[1].studentId,
      opportunityId: opportunity4.opportunityId,
    });

    console.log(
      "✅ Applications created:",
      app1.applicationId,
      app2.applicationId,
      app3.applicationId,
      app4.applicationId,
      app5.applicationId,
      app6.applicationId,
      app7.applicationId,
      app8.applicationId
    );

    // Keep meta for original applications so extra steps can reference student/opportunity
    const originalApplicationsMeta: Array<{ applicationId: string; studentId: string; opportunityId: string }> = [
      { applicationId: app1.applicationId, studentId: students[0].studentId, opportunityId: opportunity1.opportunityId },
      { applicationId: app2.applicationId, studentId: students[1].studentId, opportunityId: opportunity2.opportunityId },
      { applicationId: app3.applicationId, studentId: students[2].studentId, opportunityId: opportunity3.opportunityId },
      { applicationId: app4.applicationId, studentId: students[3].studentId, opportunityId: opportunity1.opportunityId },
      { applicationId: app5.applicationId, studentId: students[4].studentId, opportunityId: opportunity3.opportunityId },
      { applicationId: app6.applicationId, studentId: students[5].studentId, opportunityId: opportunity4.opportunityId },
      { applicationId: app7.applicationId, studentId: students[0].studentId, opportunityId: opportunity5.opportunityId },
      { applicationId: app8.applicationId, studentId: students[1].studentId, opportunityId: opportunity4.opportunityId },
    ];

    // 10. Update some application statuses (original)
    console.log("📊 Updating application statuses...");

    await client.mutation(api.mutations.updateApplicationStatus, {
      applicationId: app1.applicationId,
      status: "SHORTLISTED",
      mentorApproved: true,
      adminApproved: true,
      mentorRemarks: "Strong technical skills and good academic record",
      adminRemarks: "Approved for company interview",
    });

    await client.mutation(api.mutations.updateApplicationStatus, {
      applicationId: app2.applicationId,
      status: "SELECTED",
      mentorApproved: true,
      adminApproved: true,
      mentorRemarks: "Excellent ML knowledge and projects",
      adminRemarks: "Top candidate, recommended for selection",
    });

    await client.mutation(api.mutations.updateApplicationStatus, {
      applicationId: app3.applicationId,
      status: "MENTOR_REVIEW",
      mentorApproved: false,
      mentorRemarks: "Needs improvement in statistical concepts",
    });

    await client.mutation(api.mutations.updateApplicationStatus, {
      applicationId: app4.applicationId,
      status: "ADMIN_REVIEW",
      mentorApproved: true,
      mentorRemarks: "Good technical foundation",
    });

    await client.mutation(api.mutations.updateApplicationStatus, {
      applicationId: app5.applicationId,
      status: "SUBMITTED",
      mentorApproved: true,
      adminApproved: true,
      mentorRemarks: "Solid programming skills",
      adminRemarks: "Forwarded to company",
    });

    await client.mutation(api.mutations.updateApplicationStatus, {
      applicationId: app6.applicationId,
      status: "OFFER_ACCEPTED",
      mentorApproved: true,
      adminApproved: true,
      mentorRemarks: "Outstanding performer with leadership qualities",
      adminRemarks: "Highly recommended candidate",
    });

    await client.mutation(api.mutations.updateApplicationStatus, {
      applicationId: app7.applicationId,
      status: "REJECTED",
      mentorApproved: true,
      adminApproved: true,
      mentorRemarks: "Good skills but lacks frontend experience",
      adminRemarks: "Company feedback: needs more design experience",
    });

    console.log("✅ Application statuses updated");

    // 11. Create initial internship & placements (original)
    console.log("🎯 Creating internships and placements...");

    const internship1 = await client.mutation(api.mutations.createInternship, {
      studentId: students[0].studentId,
      opportunityId: opportunity1.opportunityId,
      companyId: company1.companyId,
      applicationId: app1.applicationId,
      startDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week from now
      endDate: Date.now() + 97 * 24 * 60 * 60 * 1000, // ~3 months from now
      stipend: 25000,
      mentorId: faculty1.facultyId,
      rating: 4.5,
    });

    const placement1 = await client.mutation(api.mutations.createPlacement, {
      jobTitle: "AI/ML Engineer",
      joinDate: Date.now() + 60 * 24 * 60 * 60 * 1000, // 2 months from now
      salary: 800000,
      location: "Mumbai, Maharashtra",
      workMode: "ONSITE",
      studentId: students[1].studentId,
      companyId: company2.companyId,
      opportunityId: opportunity2.opportunityId,
      applicationId: app2.applicationId,
      status: "OFFER_ACCEPTED",
    });

    const placement2 = await client.mutation(api.mutations.createPlacement, {
      jobTitle: "Full Stack Developer",
      joinDate: Date.now() + 45 * 24 * 60 * 60 * 1000, // 45 days from now
      salary: 1200000,
      location: "Mumbai, Maharashtra",
      workMode: "HYBRID",
      studentId: students[5].studentId,
      companyId: company4.companyId,
      opportunityId: opportunity4.opportunityId,
      applicationId: app6.applicationId,
      status: "OFFER_ACCEPTED",
    });

    console.log("✅ Internships and placements created:", internship1.internshipId, placement1.placementId, placement2.placementId);

    console.log("\n📋 Default login credentials:");
    console.log("👤 Admin: admin@somaiya.edu / admin123");
    console.log("👨‍🏫 Faculty: faculty1@somaiya.edu to faculty3@somaiya.edu / faculty123");
    console.log("👨‍🎓 Students: student1@somaiya.edu to student6@somaiya.edu / student123");
    console.log("🏢 Companies: hr@techcorp.com, careers@innovatelab.com, jobs@datadyne.com, recruitment@fintech.com / company123");

    console.log("\n📊 Summary:");
    console.log(`- ${1} College created`);
    console.log(`- ${3} Branches created`);
    console.log(`- ${1} Admin created`);
    console.log(`- ${3} Faculty members created`);
    console.log(`- ${6} Students created`);
    console.log(`- ${4} Companies created (all verified)`);
    console.log(`- ${5} Job/Internship opportunities created`);
    console.log(`- ${8} Applications created with various statuses`);
    console.log(`- ${1} Internship created`);
    console.log(`- ${2} Placements created`);
    console.log(`- Multiple notifications created`);

    // ---------------------------------------------------------------------
    // --- NEW APPENDED DATA (fixes applied) -------------------------------
    // ---------------------------------------------------------------------
    console.log("➕ Appending more data (students, companies, opportunities, applications, internships & placements)...");

    // 12. Add more students (student7..student25) — preserving original 6
    const extraStudentsDefs = [
      { firstName: "Karan", lastName: "Mehta", dept: "Computer Science", roll: "CS2021007", year: "Final Year", sem: 8, cgpa: 8.0, skills: ["C++", "Python"] },
      { firstName: "Meera", lastName: "Iyer", dept: "Information Technology", roll: "IT2021008", year: "Final Year", sem: 8, cgpa: 7.9, skills: ["Java", "Spring"] },
      { firstName: "Sahil", lastName: "Khan", dept: "Computer Science", roll: "CS2021009", year: "Final Year", sem: 8, cgpa: 8.4, skills: ["React", "Node.js"] },
      { firstName: "Aisha", lastName: "Shaikh", dept: "Electronics", roll: "EC2021010", year: "Final Year", sem: 8, cgpa: 8.1, skills: ["Embedded", "C"] },
      { firstName: "Ria", lastName: "Patel", dept: "Information Technology", roll: "IT2021011", year: "Third Year", sem: 6, cgpa: 7.5, skills: ["Python", "SQL"] },
      { firstName: "Dev", lastName: "Rao", dept: "Computer Science", roll: "CS2021012", year: "Third Year", sem: 6, cgpa: 7.7, skills: ["JS", "MongoDB"] },
      { firstName: "Nidhi", lastName: "Shah", dept: "Electronics", roll: "EC2021013", year: "Third Year", sem: 6, cgpa: 8.3, skills: ["MATLAB", "IoT"] },
      { firstName: "Vivek", lastName: "Desai", dept: "Mechanical", roll: "ME2021014", year: "Final Year", sem: 8, cgpa: 7.8, skills: ["CAD", "ANSYS"] },
      { firstName: "Tarun", lastName: "Joshi", dept: "Computer Science", roll: "CS2021015", year: "Third Year", sem: 6, cgpa: 8.6, skills: ["DSA", "Algorithms"] },
      { firstName: "Pooja", lastName: "Nair", dept: "Information Technology", roll: "IT2021016", year: "Final Year", sem: 8, cgpa: 8.7, skills: ["AWS", "Docker"] },
      { firstName: "Gaurav", lastName: "Singh", dept: "Computer Science", roll: "CS2021017", year: "Third Year", sem: 6, cgpa: 7.6, skills: ["JavaScript", "React"] },
      { firstName: "Simran", lastName: "Kaur", dept: "Electronics", roll: "EC2021018", year: "Third Year", sem: 6, cgpa: 8.2, skills: ["VLSI", "Embedded"] },
      { firstName: "Mohit", lastName: "Ahuja", dept: "Mechanical", roll: "ME2021019", year: "Third Year", sem: 6, cgpa: 7.9, skills: ["Thermodynamics"] },
      { firstName: "Naveen", lastName: "Kumar", dept: "Computer Science", roll: "CS2021020", year: "Final Year", sem: 8, cgpa: 9.0, skills: ["ML", "Python"] },
      { firstName: "Sana", lastName: "Khan", dept: "Information Technology", roll: "IT2021021", year: "Third Year", sem: 6, cgpa: 7.4, skills: ["HTML", "CSS"] },
      { firstName: "Rohan", lastName: "Gandhi", dept: "Computer Science", roll: "CS2021022", year: "Final Year", sem: 8, cgpa: 8.8, skills: ["Full Stack", "GraphQL"] },
      { firstName: "Isha", lastName: "Menon", dept: "Electronics", roll: "EC2021023", year: "Final Year", sem: 8, cgpa: 8.05, skills: ["IoT", "Signal Processing"] },
      { firstName: "Akash", lastName: "Bhat", dept: "Mechanical", roll: "ME2021024", year: "Third Year", sem: 6, cgpa: 7.3, skills: ["SolidWorks"] },
      { firstName: "Priyanka", lastName: "Deshpande", dept: "Information Technology", roll: "IT2021025", year: "Final Year", sem: 8, cgpa: 8.25, skills: ["Node.js", "Express"] },
    ];

    let idxStart = students.length + 1;
    for (let i = 0; i < extraStudentsDefs.length; i++) {
      const s = extraStudentsDefs[i];
      const idx = idxStart + i;
      const created = await client.action(api.actions.createStudent, {
        email: `student${idx}@somaiya.edu`,
        password: "student123",
        firstName: s.firstName,
        lastName: s.lastName,
        rollNumber: s.roll,
        phone: `977778${(10 + i).toString().padStart(4, "0")}`,
        department: s.dept,
        year: s.year,
        semester: s.sem,
        cgpa: Number(s.cgpa),
        skills: s.skills,
        collegeId: collegeId,
        mentorId: i % 3 === 0 ? faculty1.facultyId : i % 3 === 1 ? faculty2.facultyId : faculty3.facultyId,
      });
      students.push(created);
    }
    console.log(`✅ Added ${extraStudentsDefs.length} students → total students: ${students.length}`);

    // 13. Add more companies (keep original 4 intact)
    const extraCompanies = [
      { name: "CloudNet Systems", industry: "Cloud", location: "Bangalore, Karnataka" },
      { name: "ShopEase", industry: "E-Commerce", location: "Bangalore, Karnataka" },
      { name: "HealthTech Global", industry: "Healthcare", location: "Hyderabad, Telangana" },
      { name: "GreenEnergy Ltd", industry: "Energy", location: "Delhi, Delhi" },
      { name: "EduSmart", industry: "EdTech", location: "Pune, Maharashtra" },
      { name: "AutoNext Motors", industry: "Automotive", location: "Chennai, Tamil Nadu" },
      { name: "RetailHub", industry: "Retail", location: "Mumbai, Maharashtra" },
      { name: "SecuriSoft", industry: "Cybersecurity", location: "Bangalore, Karnataka" },
    ];

    // Keep results list (action responses) if you need them, but importantly keep meta with location
    const companiesResults: any[] = [company1, company2, company3, company4];

    for (let i = 0; i < extraCompanies.length; i++) {
      const c = extraCompanies[i];
      const created = await client.action(api.actions.registerCompany, {
        email: `company_extra${i + 1}@mail.com`,
        password: "company123",
        name: c.name,
        website: `https://${c.name.replace(/\s/g, "").toLowerCase()}.com`,
        location: c.location,
        industry: c.industry,
        size: "50-500",
        description: `${c.industry} company - ${c.name}`,
      });
      companiesResults.push(created);
      // push meta using the location we passed in
      companiesMeta.push({ companyId: created.companyId, name: c.name, location: c.location });

      await client.mutation(api.mutations.verifyCompany, {
        companyId: created.companyId,
        isVerified: true,
      });
    }
    console.log(`✅ Added ${extraCompanies.length} companies → total companies: ${companiesMeta.length}`);

    // 14. Add more opportunities (keep original 5 intact)
    const extraOppsDefs = [
      { title: "Cloud Engineer Intern", type: "INTERNSHIP", companyIndex: 4, workMode: "REMOTE", stipend: 18000, duration: "4 months" },
      { title: "Backend Developer", type: "JOB", companyIndex: 5, workMode: "ONSITE", salary: 700000 },
      { title: "DevOps Engineer", type: "JOB", companyIndex: 6, workMode: "HYBRID", salary: 900000 },
      { title: "Data Scientist Intern", type: "INTERNSHIP", companyIndex: 1, workMode: "ONSITE", stipend: 30000, duration: "6 months" },
      { title: "Frontend Developer", type: "JOB", companyIndex: 7, workMode: "ONSITE", salary: 650000 },
      { title: "QA Intern", type: "INTERNSHIP", companyIndex: 8, workMode: "REMOTE", stipend: 12000, duration: "3 months" },
      { title: "Product Analyst", type: "JOB", companyIndex: 9, workMode: "HYBRID", salary: 750000 },
      { title: "Security Engineer", type: "JOB", companyIndex: 10, workMode: "ONSITE", salary: 1000000 },
      { title: "Mobile Developer Intern", type: "INTERNSHIP", companyIndex: 2, workMode: "ONSITE", stipend: 20000, duration: "4 months" },
      { title: "Full Stack Intern", type: "INTERNSHIP", companyIndex: 3, workMode: "HYBRID", stipend: 22000, duration: "3 months" },
      { title: "AI Researcher", type: "JOB", companyIndex: 1, workMode: "ONSITE", salary: 1400000 },
    ];

    // We'll keep an array of raw createOpportunity responses too (for earlier logic)
    const opportunitiesResults: any[] = [opportunity1, opportunity2, opportunity3, opportunity4, opportunity5];

    for (let i = 0; i < extraOppsDefs.length; i++) {
      const def = extraOppsDefs[i];
      const compMeta = companiesMeta[def.companyIndex % companiesMeta.length];
      const opp = await client.mutation(api.mutations.createOpportunity, {
        title: def.title,
        description: `${def.title} at ${compMeta.name}`,
        type: def.type as any,
        location: compMeta.location, // <-- use the meta location (fixed)
        workMode: def.workMode as any,
        duration: def.duration,
        stipend: def.stipend,
        salary: def.salary,
        currency: "INR",
        requirements: ["Good coding skills", "Team player"],
        skills: ["JavaScript", "React", "Node.js"],
        eligibleDepartments: ["Computer Science", "Information Technology"],
        eligibleYears: ["Third Year", "Final Year"],
        minCGPA: 7.0,
        deadline: dateTS(`2025-12-${(i % 28) + 1}`),
        status: "ACTIVE",
        companyId: compMeta.companyId as any,
      });
      opportunitiesResults.push(opp);
      // push meta (so later code can find internships/jobs by type & location)
      opportunitiesMeta.push({ opportunityId: opp.opportunityId, type: def.type, location: compMeta.location });
    }
    console.log(`✅ Added ${extraOppsDefs.length} opportunities → total opportunities: ${opportunitiesMeta.length}`);

    // 15. Create many more applications (each new student applies to multiple opportunities)
    const extraApplications: Array<{ applicationId: string; studentId: string; opportunityId: string }> = [];
    for (let si = 0; si < students.length; si++) {
      const s = students[si];
      // each student applies to 3 opportunities (deterministic spread)
      for (let a = 0; a < 3; a++) {
        const oppResult = opportunitiesResults[(si + a * 2) % opportunitiesResults.length];
        try {
          const createdApp = await client.mutation(api.mutations.createApplication, {
            studentId: s.studentId,
            opportunityId: oppResult.opportunityId,
          });
          extraApplications.push({ applicationId: createdApp.applicationId, studentId: s.studentId, opportunityId: oppResult.opportunityId });
        } catch (e) {
          // skip if duplicate or any error
        }
      }
    }
    console.log(`✅ Created ${extraApplications.length} additional applications`);

    // 16. Update a sample of application statuses to create trend variety
    const sampleApps: Array<{ applicationId: string; studentId: string; opportunityId: string }> = [
      ...originalApplicationsMeta,
      ...extraApplications.slice(0, 200),
    ];

    const possibleStatuses = ["PENDING", "MENTOR_REVIEW", "ADMIN_REVIEW", "SHORTLISTED", "REJECTED", "SELECTED", "OFFER_ACCEPTED", "SUBMITTED"];
    for (let i = 0; i < sampleApps.length; i++) {
      const appMeta = sampleApps[i];
      try {
        await client.mutation(api.mutations.updateApplicationStatus, {
          applicationId: appMeta.applicationId as any,
          status: possibleStatuses[i % possibleStatuses.length],
          mentorApproved: (i % 3) === 0 ? true : undefined,
          adminApproved: (i % 4) === 0 ? true : undefined,
          mentorRemarks: i % 5 === 0 ? "Strong candidate" : undefined,
          adminRemarks: i % 6 === 0 ? "Approved" : undefined,
        });
      } catch (e) {
        // ignore per-app errors
      }
    }
    console.log("✅ Updated sample application statuses for trend variety");

    // 17. Create additional internships (spread across 2023-2025)
    const createdInternships: any[] = [];
    // find a canonical internship opportunity id from opportunitiesMeta
    const internshipOppMeta = opportunitiesMeta.find((o) => o.type === "INTERNSHIP");
    for (let i = 0; i < 10; i++) {
      const stu = students[i % students.length];
      const oppMeta = internshipOppMeta ?? opportunitiesMeta[0];
      const compMeta = companiesMeta[i % companiesMeta.length];
      const year = 2023 + (i % 3); // cycles 2023,2024,2025
      const start = `${year}-06-${(i % 25) + 1}`; // June
      const end = `${year}-09-${(i % 25) + 1}`; // Sep

      // try to find an application matching student + opp
      let appForStudent = extraApplications.find((a) => a.studentId === stu.studentId && a.opportunityId === oppMeta.opportunityId);
      if (!appForStudent) {
        try {
          const createdApp = await client.mutation(api.mutations.createApplication, {
            studentId: stu.studentId,
            opportunityId: oppMeta.opportunityId as any,
          });
          appForStudent = { applicationId: createdApp.applicationId, studentId: stu.studentId, opportunityId: oppMeta.opportunityId };
          extraApplications.push(appForStudent);
        } catch (e) {
          // ignore
        }
      }

      // Must have an applicationId for createInternship (mutation expects v.id("applications"))
      if (!appForStudent?.applicationId) continue;

      const internship = await client.mutation(api.mutations.createInternship, {
        studentId: stu.studentId,
        opportunityId: oppMeta.opportunityId as any,
        companyId: compMeta.companyId as any,
        applicationId: appForStudent.applicationId as any,
        startDate: dateTS(start),
        endDate: dateTS(end),
        stipend: 10000 + i * 2000,
        mentorId: i % 3 === 0 ? faculty1.facultyId : i % 3 === 1 ? faculty2.facultyId : faculty3.facultyId,
        rating: parseFloat((3 + (i % 2)).toFixed(1)),
      });
      createdInternships.push(internship);
    }
    console.log(`✅ Created ${createdInternships.length} internships across 2023-2025`);

    // 18. Create additional placements (spread across 2023-2025) with realistic salaries
    const createdPlacements: any[] = [];
    const salaryBuckets = [600000, 720000, 850000, 950000, 1100000, 1300000, 1500000, 1800000, 2100000, 2500000];
    const jobOppMeta = opportunitiesMeta.find((o) => o.type === "JOB") ?? opportunitiesMeta[1];
    for (let i = 0; i < 10; i++) {
      const stu = students[(i + 5) % students.length];
      const oppMeta = jobOppMeta;
      const compMeta = companiesMeta[(i + 2) % companiesMeta.length];
      const year = 2023 + (i % 3);
      const join = `${year}-${((i % 12) + 1).toString().padStart(2, "0")}-15`;

      // find or create application
      let appForStudent = extraApplications.find((a) => a.studentId === stu.studentId && a.opportunityId === oppMeta.opportunityId);
      if (!appForStudent) {
        try {
          const createdApp = await client.mutation(api.mutations.createApplication, {
            studentId: stu.studentId,
            opportunityId: oppMeta.opportunityId as any,
          });
          appForStudent = { applicationId: createdApp.applicationId, studentId: stu.studentId, opportunityId: oppMeta.opportunityId };
          extraApplications.push(appForStudent);
        } catch (e) {
          // ignore
        }
      }

      if (!appForStudent?.applicationId) continue;

      const placement = await client.mutation(api.mutations.createPlacement, {
        jobTitle: `Software Engineer ${i + 1}`,
        joinDate: dateTS(join),
        salary: salaryBuckets[i % salaryBuckets.length],
        location: compMeta.location, // use meta location (fixed)
        workMode: i % 3 === 0 ? "ONSITE" : i % 3 === 1 ? "HYBRID" : "REMOTE",
        studentId: stu.studentId,
        companyId: compMeta.companyId as any,
        opportunityId: oppMeta.opportunityId as any,
        applicationId: appForStudent.applicationId as any,
        status: i % 4 === 0 ? "JOINED" : i % 4 === 1 ? "OFFER_ACCEPTED" : "NOT_JOINED",
      });
      createdPlacements.push(placement);

      // mark student placed (best-effort)
      try {
        if (placement && (createdPlacements[i].status === "JOINED" || createdPlacements[i].status === "OFFER_ACCEPTED")) {
          await client.mutation(api.mutations.updateStudentStatus, {
            studentId: stu.studentId,
            isActive: true,
          });
          
        }
      } catch (e) {
        // ignore
      }
    }
    console.log(`✅ Created ${createdPlacements.length} placements across 2023-2025`);

    // Final summary
    console.log("\n📋 Default login credentials (original):");
    console.log("👤 Admin: admin@somaiya.edu / admin123");
    console.log("👨‍🏫 Faculty: faculty1@somaiya.edu to faculty3@somaiya.edu / faculty123");
    console.log("👨‍🎓 Students: student1@somaiya.edu to student6@somaiya.edu / student123 (plus extras)");
    console.log("🏢 Companies: hr@techcorp.com, careers@innovatelab.com, jobs@datadyne.com, recruitment@fintech.com / company123 (plus extras)");

    console.log("\n📊 Summary (approx):");
    console.log(`- 1 College created`);
    console.log(`- 3 Branches created`);
    console.log(`- 1 Admin created`);
    console.log(`- 3 Faculty members created (original)`);
    console.log(`- ${students.length} Students created (original + extras)`);
    console.log(`- ${companiesMeta.length} Companies created (original + extras)`);
    console.log(`- ${opportunitiesMeta.length} Opportunities created (original + extras)`);
    console.log(`- ${8 + extraApplications.length} Applications created (original + extras)`);
    console.log(`- ${createdInternships.length + 1} Internships created (including original)`);
    console.log(`- ${createdPlacements.length + 2} Placements created (including original)`);
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