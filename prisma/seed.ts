import { PrismaClient } from '../lib/generated/prisma'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Passwords for demo
  const passwordAdmin   = await bcrypt.hash('Admin@123', 12)
  const passwordFaculty = await bcrypt.hash('Faculty@123', 12)
  const passwordStud1   = await bcrypt.hash('Student1@123', 12)
  const passwordStud2   = await bcrypt.hash('Student2@123', 12)
  const passwordCompany = await bcrypt.hash('Company@123', 12)

  // College
  const college = await prisma.college.upsert({
    where: { code: 'TIE' },
    update: {},
    create: {
      name: 'Tech Institute of Engineering',
      code: 'TIE',
      location: 'Pune, IN',
      type: 'COLLEGE',
    },
  })

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tie.edu' },
    update: {},
    create: {
      email: 'admin@tie.edu',
      password: passwordAdmin,
      role: 'ADMIN',
      admin: {
        create: {
          name: 'Placement Officer',
          phone: '9999999999',
          department: 'Training & Placement',
          collegeId: college.id,
        },
      },
    },
    include: { admin: true },
  })

  // Faculty
  const faculty = await prisma.user.upsert({
    where: { email: 'mentor@tie.edu' },
    update: {},
    create: {
      email: 'mentor@tie.edu',
      password: passwordFaculty,
      role: 'FACULTY',
      faculty: {
        create: {
          name: 'Dr. Ananya Rao',
          department: 'CSE',
          designation: 'Associate Professor',
          phone: '8888888888',
          collegeId: college.id,
        },
      },
    },
    include: { faculty: true },
  })

  // Students
  const student1 = await prisma.user.upsert({
    where: { email: 's1@tie.edu' },
    update: {},
    create: {
      email: 's1@tie.edu',
      password: passwordStud1,
      role: 'STUDENT',
      student: {
        create: {
          firstName: 'Rahul',
          lastName: 'Sharma',
          rollNumber: 'TIE-CSE-001',
          phone: '7777777771',
          department: 'CSE',
          year: 'LY',
          semester: 8,
          cgpa: 8.4,
          skills: JSON.stringify(['React', 'Node.js', 'SQL']),
          resume: null,
          isPlaced: false,
          collegeId: college.id,
          mentorId: faculty.faculty!.id,
        },
      },
    },
    include: { student: true },
  })

  const student2 = await prisma.user.upsert({
    where: { email: 's2@tie.edu' },
    update: {},
    create: {
      email: 's2@tie.edu',
      password: passwordStud2,
      role: 'STUDENT',
      student: {
        create: {
          firstName: 'Aisha',
          lastName: 'Khan',
          rollNumber: 'TIE-CSE-002',
          phone: '7777777772',
          department: 'CSE',
          year: 'TY',
          semester: 6,
          cgpa: 8.9,
          skills: JSON.stringify(['Python', 'ML', 'Data Analysis']),
          resume: null,
          isPlaced: false,
          collegeId: college.id,
          mentorId: faculty.faculty!.id,
        },
      },
    },
    include: { student: true },
  })

  // Company (self-registered style)
  const company = await prisma.user.upsert({
    where: { email: 'hr@acme.com' },
    update: {},
    create: {
      email: 'hr@acme.com',
      password: passwordCompany,
      role: 'COMPANY',
      company: {
        create: {
          name: 'Acme Corp',
          website: 'https://acme.example.com',
          location: 'Remote',
          industry: 'Software',
          size: 'MEDIUM',
          description: 'Innovative SaaS company',
          isVerified: true,
        },
      },
    },
    include: { company: true },
  })


  console.log('Seed completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })