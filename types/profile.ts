export interface Education {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  grade: string;
  description: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  location: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string;
  link: string;
  startDate: string;
  endDate: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}