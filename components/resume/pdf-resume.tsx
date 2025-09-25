import React from 'react';
// @ts-ignore
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Education, Experience, Skill, Project, Certification } from '@/types/profile';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica'
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#111827',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5
  },
  contactInfo: {
    fontSize: 10,
    marginBottom: 3,
    color: '#374151'
  },
  section: {
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderBottomStyle: 'solid',
    paddingBottom: 2
  },
  entry: {
    marginBottom: 10
  },
  entryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2
  },
  entrySubtitle: {
    fontSize: 10,
    fontWeight: 'normal',
    marginBottom: 2,
    color: '#374151'
  },
  entryDate: {
    fontSize: 9,
    color: '#6B7280',
    marginBottom: 4
  },
  entryDescription: {
    fontSize: 10,
    marginBottom: 4
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  skill: {
    fontSize: 10,
    backgroundColor: '#F3F4F6',
    padding: 4,
    marginRight: 6,
    marginBottom: 6,
    borderRadius: 4
  },
  link: {
    fontSize: 10,
    color: '#3B82F6',
    textDecoration: 'none'
  }
});

interface PDFResumeProps {
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
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
}

const PDFResume = ({ personalInfo, education, experience, skills, projects, certifications }: PDFResumeProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{personalInfo.firstName} {personalInfo.lastName}</Text>
            <Text style={styles.contactInfo}>{personalInfo.email} | {personalInfo.phone}</Text>
            <Text style={styles.contactInfo}>{personalInfo.address}</Text>
            <Text style={styles.contactInfo}>
              {personalInfo.linkedin && `LinkedIn: ${personalInfo.linkedin} | `}
              {personalInfo.github && `GitHub: ${personalInfo.github} | `}
              {personalInfo.portfolio && `Portfolio: ${personalInfo.portfolio}`}
            </Text>
          </View>
        </View>

        {/* About */}
        {personalInfo.about && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.entryDescription}>{personalInfo.about}</Text>
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu) => (
              <View key={edu.id} style={styles.entry}>
                <Text style={styles.entryTitle}>{edu.degree}</Text>
                <Text style={styles.entrySubtitle}>{edu.institution}</Text>
                <Text style={styles.entryDate}>
                  {edu.startDate} - {edu.endDate} {edu.grade && `| ${edu.grade}`}
                </Text>
                {edu.description && <Text style={styles.entryDescription}>{edu.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experience.map((exp) => (
              <View key={exp.id} style={styles.entry}>
                <Text style={styles.entryTitle}>{exp.title}</Text>
                <Text style={styles.entrySubtitle}>{exp.company}, {exp.location}</Text>
                <Text style={styles.entryDate}>
                  {exp.startDate} - {exp.endDate}
                </Text>
                {exp.description && <Text style={styles.entryDescription}>{exp.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsContainer}>
              {skills.map((skill) => (
                <Text key={skill.id} style={styles.skill}>
                  {skill.name} ({skill.level})
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((proj) => (
              <View key={proj.id} style={styles.entry}>
                <Text style={styles.entryTitle}>{proj.title}</Text>
                <Text style={styles.entrySubtitle}>{proj.technologies}</Text>
                <Text style={styles.entryDate}>
                  {proj.startDate} - {proj.endDate}
                </Text>
                {proj.description && <Text style={styles.entryDescription}>{proj.description}</Text>}
                {proj.link && <Text style={styles.link}>{proj.link}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications.map((cert) => (
              <View key={cert.id} style={styles.entry}>
                <Text style={styles.entryTitle}>{cert.name}</Text>
                <Text style={styles.entrySubtitle}>{cert.issuer}</Text>
                <Text style={styles.entryDate}>{cert.date}</Text>
                {cert.link && <Text style={styles.link}>{cert.link}</Text>}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default PDFResume;