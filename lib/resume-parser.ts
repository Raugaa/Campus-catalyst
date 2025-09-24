/**
 * Mock resume parser that simulates extracting information from a resume file
 * In a real application, this would use a library like pdf-parse or a third-party API
 */

interface ParsedResumeData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    github: string;
    portfolio: string;
    about: string;
  };
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    startDate: string;
    endDate: string;
    grade: string;
    description: string;
  }>;
  experience: Array<{
    id: string;
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
    location: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  }>;
  projects: Array<{
    id: string;
    title: string;
    description: string;
    technologies: string;
    link: string;
    startDate: string;
    endDate: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    link: string;
  }>;
}

export const parseResume = async (file: File): Promise<ParsedResumeData> => {
  // Simulate async parsing operation
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate mock data based on file name
      const fileName = file.name.replace('.pdf', '').replace('.PDF', '');
      const nameParts = fileName.split(/[_\s-]/).filter(part => part.trim() !== '');
      
      // Extract first and last name
      let firstName = "John";
      let lastName = "Doe";
      
      if (nameParts.length >= 2) {
        firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase();
        lastName = nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1).toLowerCase();
      } else if (nameParts.length === 1) {
        firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase();
      }
      
      // Generate email based on name
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@university.edu`;
      
      // Generate realistic mock data
      const mockData: ParsedResumeData = {
        personalInfo: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: "+91 98765 43210",
          address: "Mumbai, Maharashtra",
          linkedin: `linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
          github: `github.com/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
          portfolio: `${firstName.toLowerCase()}-${lastName.toLowerCase()}.portfolio.dev`,
          about: "Dedicated computer science student with strong foundation in software development and problem-solving. Passionate about creating innovative solutions and learning new technologies. Seeking opportunities to apply academic knowledge in real-world projects and gain practical experience."
        },
        education: [
          {
            id: "1",
            degree: "B.Tech in Computer Science and Engineering",
            institution: "Indian Institute of Technology",
            startDate: "2022-08",
            endDate: "2026-05",
            grade: "8.5 CGPA",
            description: "Relevant coursework: Data Structures, Algorithms, Database Management Systems, Operating Systems, Computer Networks"
          }
        ],
        experience: [
          {
            id: "1",
            title: "Software Development Intern",
            company: "Tech Solutions Pvt. Ltd.",
            startDate: "2024-06",
            endDate: "2024-08",
            description: "Developed web applications using React and Node.js. Collaborated with senior developers to implement new features and fix bugs. Participated in code reviews and agile development processes.",
            location: "Mumbai, India"
          }
        ],
        skills: [
          { id: "1", name: "JavaScript", level: "Advanced" },
          { id: "2", name: "React", level: "Advanced" },
          { id: "3", name: "Node.js", level: "Intermediate" },
          { id: "4", name: "Python", level: "Intermediate" },
          { id: "5", name: "SQL", level: "Intermediate" },
          { id: "6", name: "Git", level: "Advanced" },
          { id: "7", name: "HTML/CSS", level: "Advanced" }
        ],
        projects: [
          {
            id: "1",
            title: "Online Learning Platform",
            description: "A full-stack web application for online course management with user authentication, course creation, and progress tracking features.",
            technologies: "React, Node.js, MongoDB, Express",
            link: `github.com/${firstName.toLowerCase()}-${lastName.toLowerCase()}/online-learning-platform`,
            startDate: "2024-01",
            endDate: "2024-04"
          }
        ],
        certifications: [
          {
            id: "1",
            name: "Google Cloud Associate Engineer",
            issuer: "Google Cloud",
            date: "2024-02",
            link: "credentials.google/cloud123"
          }
        ]
      };
      
      resolve(mockData);
    }, 1500); // Simulate parsing delay
  });
};