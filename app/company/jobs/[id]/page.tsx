"use client"

import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Edit,
  Calendar,
  DollarSign,
  Users,
  Building,
  MapPin,
  Clock,
  Save,
  X,
  User,
  BookOpen,
  Award,
  FileText,
  CheckCircle,
  AlertCircle,
  Eye,
  CalendarClock,
  GraduationCap,
  Briefcase
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Mock data for the job posting with all possible fields
const mockJobData = {
  id: 1,
  title: "Software Engineering Intern",
  jobType: "Internship",
  department: "Engineering",
  location: "San Francisco, CA",
  workType: "Hybrid",
  duration: "3 months",
  stipend: "$2,000/month",
  positions: 2,
  description: "We are seeking a talented and motivated Software Engineering Intern to join our dynamic team. As an intern, you will work alongside experienced engineers and actively contribute to software design, development, testing, and deployment. This is an excellent opportunity to learn from industry professionals and contribute to innovative solutions.",
  responsibilities: "• Develop and maintain web applications using React and Node.js\n• Collaborate with design teams to implement user interfaces\n• Write clean, efficient, and well-documented code\n• Participate in code reviews and team meetings\n• Troubleshoot and debug applications",
  benefits: "• Flexible working hours\n• Mentorship from senior engineers\n• Opportunity to work on real projects\n• Certificate of completion\n• Potential for full-time employment",
  requirements: "• Currently pursuing a degree in Computer Science or related field\n• Proficiency in JavaScript, HTML, and CSS\n• Understanding of RESTful APIs\n• Experience with version control systems (Git)",
  preferred: "• Experience with React or Node.js\n• Familiarity with database design\n• Knowledge of testing frameworks",
  skills: ["Java", "Python", "C++", "Agile Methodologies", "React", "Node.js"],
  experienceLevel: "Entry Level",
  educationLevel: "Bachelor's Degree",
  deadline: "2023-09-15",
  startDate: "2023-10-01",
  applicationRequirements: {
    resume: true,
    coverLetter: true,
    portfolio: false,
    transcript: false
  },
  visibility: {
    public: true,
    featured: false,
    notifications: true
  },
  specialInstructions: "Please include links to any relevant projects in your application.",
  applications: 45,
  views: 234,
  status: "Active"
}

// Mock data for applicants
const mockApplicants = [
  { id: 1, name: "Ethan Harper", dateApplied: "2023-08-25", status: "Applied" },
  { id: 2, name: "Olivia Bennett", dateApplied: "2023-08-17", status: "Interview Scheduled" },
  { id: 3, name: "Noah Carter", dateApplied: "2023-08-18", status: "Rejected" },
  { id: 4, name: "Ava Mitchell", dateApplied: "2023-08-19", status: "Applied" },
  { id: 5, name: "Liam Foster", dateApplied: "2023-08-20", status: "Hired" }
]

// Mock data for analytics
const analyticsData = [
  { title: "Applications Over Time", value: "+15%", subtitle: "vs last 30 days" },
  { title: "Applicants by Department", value: "+10%", subtitle: "vs last 30 days" },
  { title: "Application Funnel", value: "+5%", subtitle: "vs last 30 days" }
]

export default function DetailedJobPosting({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the job data based on the ID
  // const job = fetchJobData(params.id)
  const [job, setJob] = useState(mockJobData)
  const [isEditing, setIsEditing] = useState(false)
  const [editedJob, setEditedJob] = useState({ ...mockJobData })
  const applicants = mockApplicants
  const analytics = analyticsData

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-800"
      case "Interview Scheduled":
        return "bg-yellow-100 text-yellow-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      case "Hired":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditedJob({ ...job })
  }

  const handleSave = () => {
    setJob({ ...editedJob })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedJob({ ...job })
    setIsEditing(false)
  }

  const router = useRouter();
  const handleDelete = (id: number) => {
  if (confirm("Are you sure you want to delete this job posting?")) {
    // TODO: call your API to delete the job
    console.log("Deleted job with id:", id);
    router.push("/company/jobs");
  }
}

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setEditedJob({ ...editedJob, [field]: value })
  }

  const handleNestedInputChange = (parent: string, field: string, value: string | boolean) => {
    setEditedJob({ 
      ...editedJob, 
      [parent]: { 
        ...(editedJob as any)[parent], 
        [field]: value 
      } 
    })
  }

  const handleSkillsChange = (skills: string) => {
    setEditedJob({ ...editedJob, skills: skills.split(',').map(skill => skill.trim()) })
  }

  return (
    <DashboardLayout userRole="company">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Detailed Posting View</h1>

        {/* Banner Image Card */}
        <Card className="relative overflow-hidden">
          <div className="relative h-64 bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-6 left-6">
              {isEditing ? (
                <input
                  type="text"
                  value={editedJob.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="text-3xl font-bold text-white bg-transparent border-b border-white/50 focus:outline-none focus:border-white"
                />
              ) : (
                <h2 className="text-3xl font-bold text-white">{job.title}</h2>
              )}
            </div>
            <div className="absolute bottom-6 right-6 flex gap-3">
              {isEditing ? (
                <>
                  <Button variant="secondary" className="bg-white/90 hover:bg-white" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    className="bg-white/90 hover:bg-white"
                    onClick={handleEdit}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => handleDelete(job.id)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Job Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              Job Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Job Type</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedJob.jobType}
                    onChange={(e) => handleInputChange('jobType', e.target.value)}
                    className="font-medium p-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <p className="font-medium">{job.jobType}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Department</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedJob.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="font-medium p-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <p className="font-medium">{job.department}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedJob.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="font-medium p-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <p className="font-medium">{job.location}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Work Type</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedJob.workType}
                    onChange={(e) => handleInputChange('workType', e.target.value)}
                    className="font-medium p-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <p className="font-medium">{job.workType}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CalendarClock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedJob.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="font-medium p-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <p className="font-medium">{job.duration}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Positions</p>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedJob.positions}
                    onChange={(e) => handleInputChange('positions', e.target.value ? parseInt(e.target.value) : 0)}
                    className="font-medium p-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <p className="font-medium">{job.positions}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Stipend</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedJob.stipend}
                    onChange={(e) => handleInputChange('stipend', e.target.value)}
                    className="font-medium p-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <p className="font-medium">{job.stipend}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedJob.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="font-medium p-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <p className="font-medium">{job.startDate}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posting Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Posting Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Job Description</h3>
              {isEditing ? (
                <textarea
                  value={editedJob.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full h-32 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Key Responsibilities</h3>
              {isEditing ? (
                <textarea
                  value={editedJob.responsibilities}
                  onChange={(e) => handleInputChange('responsibilities', e.target.value)}
                  className="w-full h-24 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-600 whitespace-pre-line">{job.responsibilities}</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Benefits & Perks</h3>
              {isEditing ? (
                <textarea
                  value={editedJob.benefits}
                  onChange={(e) => handleInputChange('benefits', e.target.value)}
                  className="w-full h-24 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-600 whitespace-pre-line">{job.benefits}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Required Skills</h3>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedJob.skills.join(', ')}
                    onChange={(e) => handleSkillsChange(e.target.value)}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter skills separated by commas"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Application Deadline</h3>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedJob.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="font-medium">{job.deadline}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Requirements & Qualifications</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Required Qualifications</h3>
              {isEditing ? (
                <textarea
                  value={editedJob.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  className="w-full h-24 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-600 whitespace-pre-line">{job.requirements}</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Preferred Qualifications</h3>
              {isEditing ? (
                <textarea
                  value={editedJob.preferred}
                  onChange={(e) => handleInputChange('preferred', e.target.value)}
                  className="w-full h-24 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-600 whitespace-pre-line">{job.preferred}</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Experience Level</h3>
              {isEditing ? (
                <input
                  type="text"
                  value={editedJob.experienceLevel}
                  onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-600">{job.experienceLevel}</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Education Level</h3>
              {isEditing ? (
                <input
                  type="text"
                  value={editedJob.educationLevel}
                  onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-600">{job.educationLevel}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Application Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Application Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Application Requirements</h3>
                <div className="space-y-2">
                  {isEditing ? (
                    <>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editedJob.applicationRequirements.resume}
                          onChange={(e) => handleNestedInputChange('applicationRequirements', 'resume', e.target.checked)}
                          className="mr-2"
                        />
                        Resume required
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editedJob.applicationRequirements.coverLetter}
                          onChange={(e) => handleNestedInputChange('applicationRequirements', 'coverLetter', e.target.checked)}
                          className="mr-2"
                        />
                        Cover letter required
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editedJob.applicationRequirements.portfolio}
                          onChange={(e) => handleNestedInputChange('applicationRequirements', 'portfolio', e.target.checked)}
                          className="mr-2"
                        />
                        Portfolio required
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editedJob.applicationRequirements.transcript}
                          onChange={(e) => handleNestedInputChange('applicationRequirements', 'transcript', e.target.checked)}
                          className="mr-2"
                        />
                        Transcript required
                      </label>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center">
                        <CheckCircle className={`w-4 h-4 mr-2 ${job.applicationRequirements.resume ? 'text-green-500' : 'text-gray-300'}`} />
                        <span>Resume {job.applicationRequirements.resume ? 'required' : 'optional'}</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className={`w-4 h-4 mr-2 ${job.applicationRequirements.coverLetter ? 'text-green-500' : 'text-gray-300'}`} />
                        <span>Cover letter {job.applicationRequirements.coverLetter ? 'required' : 'optional'}</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className={`w-4 h-4 mr-2 ${job.applicationRequirements.portfolio ? 'text-green-500' : 'text-gray-300'}`} />
                        <span>Portfolio {job.applicationRequirements.portfolio ? 'required' : 'optional'}</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className={`w-4 h-4 mr-2 ${job.applicationRequirements.transcript ? 'text-green-500' : 'text-gray-300'}`} />
                        <span>Transcript {job.applicationRequirements.transcript ? 'required' : 'optional'}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Visibility Settings</h3>
                <div className="space-y-2">
                  {isEditing ? (
                    <>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editedJob.visibility.public}
                          onChange={(e) => handleNestedInputChange('visibility', 'public', e.target.checked)}
                          className="mr-2"
                        />
                        Make job post public
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editedJob.visibility.featured}
                          onChange={(e) => handleNestedInputChange('visibility', 'featured', e.target.checked)}
                          className="mr-2"
                        />
                        Feature this job post
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editedJob.visibility.notifications}
                          onChange={(e) => handleNestedInputChange('visibility', 'notifications', e.target.checked)}
                          className="mr-2"
                        />
                        Send email notifications
                      </label>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center">
                        <CheckCircle className={`w-4 h-4 mr-2 ${job.visibility.public ? 'text-green-500' : 'text-gray-300'}`} />
                        <span>Publicly visible</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className={`w-4 h-4 mr-2 ${job.visibility.featured ? 'text-green-500' : 'text-gray-300'}`} />
                        <span>Featured job</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className={`w-4 h-4 mr-2 ${job.visibility.notifications ? 'text-green-500' : 'text-gray-300'}`} />
                        <span>Email notifications enabled</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Special Instructions</h3>
              {isEditing ? (
                <textarea
                  value={editedJob.specialInstructions}
                  onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  className="w-full h-24 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-600">{job.specialInstructions}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Applications Received Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Applications Received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress value={60} className="h-3" />
              </div>
              <div className="text-gray-700 font-medium">60% of target</div>
            </div>
          </CardContent>
        </Card>

        {/* Applicants Table/List Card */}
        <Card id="applicants">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">STUDENT NAME</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">DATE APPLIED</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">CURRENT STATUS</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applicants.map((applicant) => (
                    <tr key={applicant.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium text-gray-900">{applicant.name}</td>
                      <td className="py-4 px-4 text-gray-600">{applicant.dateApplied}</td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(applicant.status)}>
                          {applicant.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Link href={`/company/students/${applicant.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Posting Analytics Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Posting Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analytics.map((item, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">{item.value}</div>
                  <p className="text-gray-600">{item.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}