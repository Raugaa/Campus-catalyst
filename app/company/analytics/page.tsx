import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart3, TrendingUp, Users, Eye, Target, Award, Download, Filter, RefreshCw } from "lucide-react"

export default function CompanyAnalytics() {
  const metrics = [
    { title: "Total Job Posts", value: "23", change: "+3 this month", trend: "up" },
    { title: "Total Applications", value: "456", change: "+67 this week", trend: "up" },
    { title: "Interview Conversion", value: "28%", change: "+5% from last month", trend: "up" },
    { title: "Hire Rate", value: "12%", change: "-2% from last month", trend: "down" },
  ]

  const topPerformingJobs = [
    {
      title: "Software Engineering Intern",
      applications: 89,
      views: 456,
      conversionRate: 19.5,
      status: "Active",
    },
    {
      title: "Data Science Intern",
      applications: 67,
      views: 334,
      conversionRate: 20.1,
      status: "Active",
    },
    {
      title: "Frontend Developer Intern",
      applications: 54,
      views: 289,
      conversionRate: 18.7,
      status: "Closed",
    },
    {
      title: "Product Manager Intern",
      applications: 43,
      views: 198,
      conversionRate: 21.7,
      status: "Active",
    },
  ]

  const candidateInsights = [
    { university: "UC Berkeley", applications: 89, hires: 12, successRate: 13.5 },
    { university: "Stanford University", applications: 76, hires: 11, successRate: 14.5 },
    { university: "MIT", applications: 65, hires: 9, successRate: 13.8 },
    { university: "Carnegie Mellon", applications: 54, hires: 8, successRate: 14.8 },
    { university: "Georgia Tech", applications: 43, hires: 6, successRate: 14.0 },
  ]

  const hiringFunnel = [
    { stage: "Applications", count: 456, percentage: 100 },
    { stage: "Screening", count: 234, percentage: 51.3 },
    { stage: "Phone Interview", count: 128, percentage: 28.1 },
    { stage: "Technical Interview", count: 89, percentage: 19.5 },
    { stage: "Final Interview", count: 45, percentage: 9.9 },
    { stage: "Offers Extended", count: 23, percentage: 5.0 },
    { stage: "Offers Accepted", count: 18, percentage: 3.9 },
  ]

  return (
    <DashboardLayout userRole="company">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Insights into your recruitment performance and candidate pipeline</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <TrendingUp className={`h-4 w-4 ${metric.trend === "up" ? "text-green-500" : "text-red-500"}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className={`text-xs ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {metric.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">Job Performance</TabsTrigger>
            <TabsTrigger value="candidates">Candidate Insights</TabsTrigger>
            <TabsTrigger value="funnel">Hiring Funnel</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Application Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Application Trends
                  </CardTitle>
                  <CardDescription>Monthly application volume over the past 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { month: "July", applications: 45, change: "+12%" },
                      { month: "August", applications: 67, change: "+49%" },
                      { month: "September", applications: 89, change: "+33%" },
                      { month: "October", applications: 76, change: "-15%" },
                      { month: "November", applications: 92, change: "+21%" },
                      { month: "December", applications: 108, change: "+17%" },
                    ].map((data, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{data.month}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-24">
                            <Progress value={(data.applications / 120) * 100} className="h-2" />
                          </div>
                          <span className="text-sm font-medium w-12">{data.applications}</span>
                          <span className="text-xs text-green-600 w-12">{data.change}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Skills in Demand */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Top Skills in Demand
                  </CardTitle>
                  <CardDescription>Most requested skills across your job postings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { skill: "JavaScript", demand: 89, jobs: 12 },
                      { skill: "Python", demand: 76, jobs: 9 },
                      { skill: "React", demand: 67, jobs: 8 },
                      { skill: "Node.js", demand: 54, jobs: 7 },
                      { skill: "SQL", demand: 43, jobs: 6 },
                      { skill: "AWS", demand: 38, jobs: 5 },
                    ].map((data, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium">{data.skill}</span>
                          <p className="text-xs text-muted-foreground">{data.jobs} job postings</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-20">
                            <Progress value={(data.demand / 100) * 100} className="h-2" />
                          </div>
                          <span className="text-sm font-medium w-8">{data.demand}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Recruitment Activity</CardTitle>
                <CardDescription>Latest updates in your recruitment pipeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: "New application received",
                      candidate: "Sarah Johnson",
                      position: "Software Engineering Intern",
                      time: "2 hours ago",
                      type: "application",
                    },
                    {
                      action: "Interview completed",
                      candidate: "Michael Chen",
                      position: "Data Science Intern",
                      time: "4 hours ago",
                      type: "interview",
                    },
                    {
                      action: "Offer accepted",
                      candidate: "Emily Rodriguez",
                      position: "Frontend Developer Intern",
                      time: "1 day ago",
                      type: "offer",
                    },
                    {
                      action: "Job posting published",
                      candidate: "",
                      position: "DevOps Engineering Intern",
                      time: "2 days ago",
                      type: "job",
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.type === "application"
                            ? "bg-blue-500"
                            : activity.type === "interview"
                              ? "bg-purple-500"
                              : activity.type === "offer"
                                ? "bg-green-500"
                                : "bg-orange-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.candidate && `${activity.candidate} • `}
                          {activity.position}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Performance Analysis</CardTitle>
                <CardDescription>Detailed performance metrics for your job postings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformingJobs.map((job, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{job.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {job.applications} applications
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {job.views} views
                            </span>
                          </div>
                        </div>
                        <Badge variant={job.status === "Active" ? "default" : "secondary"}>{job.status}</Badge>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Conversion Rate</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={job.conversionRate} className="flex-1 h-2" />
                            <span className="text-sm font-medium">{job.conversionRate}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Application Quality</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={75} className="flex-1 h-2" />
                            <span className="text-sm font-medium">High</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Time to Fill</p>
                          <p className="text-sm font-medium mt-1">24 days avg</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="candidates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Candidate Source Analysis</CardTitle>
                <CardDescription>Performance metrics by university and candidate background</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidateInsights.map((insight, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={`/placeholder-icon.png?height=48&width=48&text=${insight.university[0]}`} />
                          <AvatarFallback>{insight.university[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{insight.university}</h4>
                          <p className="text-sm text-muted-foreground">
                            {insight.applications} applications • {insight.hires} hires
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Progress value={(insight.successRate / 20) * 100} className="w-20 h-2" />
                          <span className="text-sm font-medium">{insight.successRate}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Success Rate</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Skills Among Candidates</CardTitle>
                  <CardDescription>Most common skills in your applicant pool</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { skill: "JavaScript", candidates: 234, percentage: 78 },
                      { skill: "Python", candidates: 198, percentage: 66 },
                      { skill: "Java", candidates: 167, percentage: 56 },
                      { skill: "React", candidates: 145, percentage: 48 },
                      { skill: "SQL", candidates: 123, percentage: 41 },
                    ].map((skill, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{skill.skill}</span>
                        <div className="flex items-center gap-3">
                          <Progress value={skill.percentage} className="w-20 h-2" />
                          <span className="text-sm text-muted-foreground w-16">{skill.candidates} candidates</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Experience Distribution</CardTitle>
                  <CardDescription>Candidate experience levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { level: "No Experience", count: 156, percentage: 52 },
                      { level: "1-2 Years", count: 89, percentage: 30 },
                      { level: "2-3 Years", count: 34, percentage: 11 },
                      { level: "3+ Years", count: 21, percentage: 7 },
                    ].map((exp, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{exp.level}</span>
                        <div className="flex items-center gap-3">
                          <Progress value={exp.percentage} className="w-20 h-2" />
                          <span className="text-sm text-muted-foreground w-12">{exp.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="funnel" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Hiring Funnel Analysis
                </CardTitle>
                <CardDescription>Track candidates through your recruitment process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hiringFunnel.map((stage, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                              index === 0
                                ? "bg-blue-500"
                                : index === hiringFunnel.length - 1
                                  ? "bg-green-500"
                                  : "bg-gray-500"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium">{stage.stage}</h4>
                            <p className="text-sm text-muted-foreground">{stage.percentage}% of total applications</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{stage.count}</div>
                          <p className="text-sm text-muted-foreground">candidates</p>
                        </div>
                      </div>
                      {index < hiringFunnel.length - 1 && (
                        <div className="flex justify-center py-2">
                          <div className="w-px h-4 bg-border" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Rates</CardTitle>
                  <CardDescription>Stage-to-stage conversion performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { from: "Application", to: "Screening", rate: 51.3 },
                      { from: "Screening", to: "Phone Interview", rate: 54.7 },
                      { from: "Phone", to: "Technical", rate: 69.5 },
                      { from: "Technical", to: "Final", rate: 50.6 },
                      { from: "Final", to: "Offer", rate: 51.1 },
                      { from: "Offer", to: "Accept", rate: 78.3 },
                    ].map((conversion, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">
                          {conversion.from} → {conversion.to}
                        </span>
                        <div className="flex items-center gap-3">
                          <Progress value={conversion.rate} className="w-20 h-2" />
                          <span className="text-sm font-medium w-12">{conversion.rate}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Time Metrics</CardTitle>
                  <CardDescription>Average time spent in each stage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { stage: "Screening", time: "3 days" },
                      { stage: "Phone Interview", time: "5 days" },
                      { stage: "Technical Interview", time: "7 days" },
                      { stage: "Final Interview", time: "4 days" },
                      { stage: "Offer Decision", time: "2 days" },
                      { stage: "Offer Response", time: "5 days" },
                    ].map((metric, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{metric.stage}</span>
                        <span className="text-sm text-muted-foreground">{metric.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
