import { PrismaClient } from '../lib/generated/prisma'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data (in dependency order)
  await prisma.placement.deleteMany()
  await prisma.internship.deleteMany()
  await prisma.interview.deleteMany()
  await prisma.application.deleteMany()
  await prisma.opportunity.deleteMany()
  await prisma.student.deleteMany()
  await prisma.faculty.deleteMany()
  await prisma.admin.deleteMany()
  await prisma.company.deleteMany()
  await prisma.user.deleteMany()
  await prisma.college.deleteMany()

  // Hash passwords
  const adminPass = await bcrypt.hash('Admin@123', 12)
  const facultyPass = await bcrypt.hash('Faculty@123', 12)
  const studentPass = await bcrypt.hash('Student@123', 12)
  const companyPass = await bcrypt.hash('Company@123', 12)

  // 1. Create College
  const college = await prisma.college.create({
    data: {
      name: 'Tech Institute of Engineering',
      code: 'TIE',
      location: 'Pune, Maharashtra',
      type: 'COLLEGE',
    },
  })
  console.log('✅ College created')

  // 2. Create Admin User & Profile
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@tie.edu',
      password: adminPass,
      role: 'ADMIN',
      admin: {
        create: {
          name: 'Dr. Rajesh Kumar',
          phone: '9999999999',
          department: 'Training & Placement Cell',
          collegeId: college.id,
        },
      },
    },
    include: { admin: true },
  })

  // 3. Create Faculty Users & Profiles
  const faculty1 = await prisma.user.create({
    data: {
      email: 'mentor1@tie.edu',
      password: facultyPass,
      role: 'FACULTY',
      faculty: {
        create: {
          name: 'Dr. Ananya Rao',
          department: 'Computer Science',
          designation: 'Associate Professor',
          phone: '8888888881',
          collegeId: college.id,
        },
      },
    },
    include: { faculty: true },
  })

  const faculty2 = await prisma.user.create({
    data: {
      email: 'mentor2@tie.edu',
      password: facultyPass,
      role: 'FACULTY',
      faculty: {
        create: {
          name: 'Prof. Vikram Sharma',
          department: 'Information Technology',
          designation: 'Assistant Professor',
          phone: '8888888882',
          collegeId: college.id,
        },
      },
    },
    include: { faculty: true },
  })

  // 4. Create Student Users & Profiles
  const students = []
  const studentData = [
    { name: 'Rahul Sharma', email: 's1@tie.edu', roll: 'TIE-CS-001', dept: 'Computer Science', year: 'LY', sem: 8, cgpa: 8.4, mentor: faculty1.faculty!.id },
    { name: 'Aisha Khan', email: 's2@tie.edu', roll: 'TIE-CS-002', dept: 'Computer Science', year: 'LY', sem: 8, cgpa: 8.9, mentor: faculty1.faculty!.id },
    { name: 'Arjun Patel', email: 's3@tie.edu', roll: 'TIE-IT-001', dept: 'Information Technology', year: 'TY', sem: 6, cgpa: 7.8, mentor: faculty2.faculty!.id },
    { name: 'Priya Singh', email: 's4@tie.edu', roll: 'TIE-IT-002', dept: 'Information Technology', year: 'TY', sem: 6, cgpa: 8.2, mentor: faculty2.faculty!.id },
    { name: 'Kiran Reddy', email: 's5@tie.edu', roll: 'TIE-CS-003', dept: 'Computer Science', year: 'LY', sem: 8, cgpa: 7.9, mentor: faculty1.faculty!.id },
  ]

  for (const s of studentData) {
    const [firstName, ...lastNameParts] = s.name.split(' ')
    const lastName = lastNameParts.join(' ')
    
    const student = await prisma.user.create({
      data: {
        email: s.email,
        password: studentPass,
        role: 'STUDENT',
        student: {
          create: {
            firstName,
            lastName,
            rollNumber: s.roll,
            phone: `777777${students.length + 1}`,
            department: s.dept,
            year: s.year,
            semester: s.sem,
            cgpa: s.cgpa,
            skills: JSON.stringify(['React', 'Node.js', 'Python', 'SQL']),
            collegeId: college.id,
            mentorId: s.mentor,
          },
        },
      },
      include: { student: true },
    })
    students.push(student)
  }
  console.log('✅ Students created')

  // 5. Create Company Users & Profiles
  const companies = []
  const companyData = [
    { name: 'TechCorp Solutions', email: 'hr@techcorp.com', location: 'Bengaluru', industry: 'Software Development', size: 'LARGE', verified: true },
    { name: 'InnovateLabs', email: 'careers@innovatelabs.com', location: 'Pune', industry: 'AI/ML', size: 'MEDIUM', verified: true },
    { name: 'DataSys Inc', email: 'hiring@datasys.com', location: 'Mumbai', industry: 'Data Analytics', size: 'MEDIUM', verified: true },
    { name: 'StartupXYZ', email: 'team@startupxyz.com', location: 'Remote', industry: 'Fintech', size: 'STARTUP', verified: false },
  ]

  for (const c of companyData) {
    const company = await prisma.user.create({
      data: {
        email: c.email,
        password: companyPass,
        role: 'COMPANY',
        isActive: c.verified,
        company: {
          create: {
            name: c.name,
            location: c.location,
            industry: c.industry,
            size: c.size as any,
            description: `Leading ${c.industry} company providing innovative solutions.`,
            website: `https://${c.name.toLowerCase().replace(/\s+/g, '')}.com`,
            isVerified: c.verified,
          },
        },
      },
      include: { company: true },
    })
    companies.push(company)
  }
  console.log('✅ Companies created')

  // 6. Create Opportunities
  const opportunities = []
  const oppData = [
    { title: 'Software Engineer Intern', company: 0, type: 'INTERNSHIP', location: 'Bengaluru', stipend: '25,000/month', duration: '6 months' },
    { title: 'Full Stack Developer', company: 0, type: 'FULL_TIME', location: 'Bengaluru', salary: '8,00,000 LPA', duration: null },
    { title: 'ML Engineer Intern', company: 1, type: 'INTERNSHIP', location: 'Pune', stipend: '30,000/month', duration: '4 months' },
    { title: 'Data Scientist', company: 2, type: 'FULL_TIME', location: 'Mumbai', salary: '12,00,000 LPA', duration: null },
    { title: 'Frontend Developer Intern', company: 1, type: 'INTERNSHIP', location: 'Remote', stipend: '20,000/month', duration: '3 months' },
  ]

  for (const opp of oppData) {
    const opportunity = await prisma.opportunity.create({
      data: {
        title: opp.title,
        description: `Exciting opportunity to work as ${opp.title} with cutting-edge technologies.`,
        location: opp.location,
        type: opp.type as any,
        duration: opp.duration,
        stipend: opp.stipend || null,
        salary: (opp as any).salary || null,
        requirements: 'Bachelor\'s degree in relevant field, strong programming skills',
        skills: JSON.stringify(['JavaScript', 'React', 'Node.js', 'Python', 'SQL']),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'ACTIVE',
        companyId: companies[opp.company].company!.id,
      },
    })
    opportunities.push(opportunity)
  }
  console.log('✅ Opportunities created')

  // 7. Create Applications with different statuses
  const applications = []
  const appData = [
    { student: 0, opp: 0, status: 'SELECTED', mentorApproved: true, adminApproved: true },
    { student: 1, opp: 1, status: 'INTERVIEW_SCHEDULED', mentorApproved: true, adminApproved: true },
    { student: 2, opp: 2, status: 'SHORTLISTED', mentorApproved: true, adminApproved: true },
    { student: 3, opp: 3, status: 'OFFER_ACCEPTED', mentorApproved: true, adminApproved: true },
    { student: 4, opp: 4, status: 'PENDING', mentorApproved: false, adminApproved: false },
    { student: 0, opp: 2, status: 'INTERVIEWED', mentorApproved: true, adminApproved: true },
    { student: 1, opp: 4, status: 'APPROVED', mentorApproved: true, adminApproved: true },
  ]

  for (const app of appData) {
    const application = await prisma.application.create({
      data: {
        status: app.status as any,
        mentorApproved: app.mentorApproved,
        adminApproved: app.adminApproved,
        adminRemarks: app.adminApproved ? 'Good profile, approved for company review' : null,
        mentorRemarks: app.mentorApproved ? 'Student shows good potential' : null,
        studentId: students[app.student].student!.id,
        opportunityId: opportunities[app.opp].id,
        appliedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
      },
    })
    applications.push(application)
  }
  console.log('✅ Applications created')

  // 8. Create Interviews
  const interviews = []
  const interviewData = [
    { app: 1, type: 'TECHNICAL', mode: 'ONLINE', status: 'SCHEDULED', scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), round: 1 },
    { app: 2, type: 'HR', mode: 'OFFLINE', status: 'COMPLETED', scheduledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), round: 1, result: 'NEXT_ROUND' },
    { app: 5, type: 'TECHNICAL', mode: 'ONLINE', status: 'COMPLETED', scheduledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), round: 1, result: 'SELECTED' },
  ]

  for (const int of interviewData) {
    const app = applications[int.app]
    const studentId = app.studentId
    const opportunity = opportunities.find(o => o.id === app.opportunityId)!
    const companyId = opportunity.companyId

    const interview = await prisma.interview.create({
      data: {
        type: int.type as any,
        mode: int.mode as any,
        status: int.status as any,
        scheduledAt: int.scheduledAt,
        duration: 60,
        round: int.round,
        result: int.result as any || null,
        interviewerName: 'John Smith',
        interviewerEmail: 'john.smith@company.com',
        meetingLink: int.mode === 'ONLINE' ? 'https://meet.google.com/abc-def-ghi' : null,
        location: int.mode === 'OFFLINE' ? 'Company Office, Conference Room A' : null,
        feedback: int.status === 'COMPLETED' ? 'Good technical knowledge, needs improvement in communication' : null,
        studentId,
        companyId,
        applicationId: app.id,
      },
    })
    interviews.push(interview)
  }
  console.log('✅ Interviews created')

  // 9. Create Internships
  const internship = await prisma.internship.create({
    data: {
      title: 'Software Engineer Intern',
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // Started 60 days ago
      endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // Ends in 120 days
      stipend: '25,000/month',
      status: 'ACTIVE',
      mentorName: 'Sarah Johnson',
      mentorEmail: 'sarah.johnson@techcorp.com',
      mentorPhone: '+91-9876543210',
      workLocation: 'TechCorp Solutions, Bengaluru',
      workMode: 'HYBRID',
      description: 'Working on full-stack web development projects using React and Node.js',
      learningGoals: 'Gain experience in modern web technologies and agile development practices',
      studentId: students[0].student!.id,
      companyId: companies[0].company!.id,
      applicationId: applications[0].id,
    },
  })
  console.log('✅ Internship created')

  // 10. Create Placements
  const placement = await prisma.placement.create({
    data: {
      title: 'Data Scientist',
      joiningDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // Joining in 90 days
      salary: '12,00,000 LPA',
      location: 'Mumbai',
      workMode: 'HYBRID',
      status: 'CONFIRMED',
      department: 'Data Science & Analytics',
      reportingManager: 'Dr. Amit Gupta',
      hrContact: 'hr@datasys.com',
      bond: '2 years service bond',
      bondDuration: 24,
      studentId: students[3].student!.id,
      companyId: companies[2].company!.id,
      applicationId: applications[3].id,
    },
  })
  console.log('✅ Placement created')

  // Update student placement status
  await prisma.student.update({
    where: { id: students[3].student!.id },
    data: { isPlaced: true },
  })

  console.log('\n🎉 Seed completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`- College: 1`)
  console.log(`- Users: ${1 + 2 + 5 + 4} (1 admin, 2 faculty, 5 students, 4 companies)`)
  console.log(`- Opportunities: ${opportunities.length}`)
  console.log(`- Applications: ${applications.length}`)
  console.log(`- Interviews: ${interviews.length}`)
  console.log(`- Internships: 1`)
  console.log(`- Placements: 1`)

  console.log('\n🔐 Login Credentials:')
  console.log('Admin: admin@tie.edu / Admin@123')
  console.log('Faculty: mentor1@tie.edu, mentor2@tie.edu / Faculty@123')
  console.log('Students: s1@tie.edu, s2@tie.edu, s3@tie.edu, s4@tie.edu, s5@tie.edu / Student@123')
  console.log('Companies: hr@techcorp.com, careers@innovatelabs.com, hiring@datasys.com / Company@123')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })