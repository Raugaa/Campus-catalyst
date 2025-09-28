'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Clock,
  FileText,
  BarChart3,
  PieChart,
} from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { useState } from "react"

// Mock data for different years
const yearData: Record<string, any> = {
  "2023": {
    kpi: [
      { title: "Pending Approvals", value: "5", icon: Clock },
      { title: "Total Mentees", value: "12", icon: Users },
      { title: "Feedback Due", value: "3", icon: FileText },
    ],
    weeklyActivity: [
      { week: "Week 1", activity: 55, engagement: 35 },
      { week: "Week 2", activity: 60, engagement: 45 },
      { week: "Week 3", activity: 70, engagement: 55 },
      { week: "Week 4", activity: 65, engagement: 60 },
    ],
    department: [
      { department: "Computer Science", percentage: 30, color: "#007BFF", value: 4 },
      { department: "Mechanical Engineering", percentage: 15, color: "#0056b3", value: 2 },
      { department: "Electrical Engineering", percentage: 20, color: "#00aaff", value: 2 },
      { department: "Civil Engineering", percentage: 10, color: "#0080ff", value: 1 },
      { department: "Others", percentage: 25, color: "#66b3ff", value: 3 },
    ]
  },
  "2024": {
    kpi: [
      { title: "Pending Approvals", value: "4", icon: Clock },
      { title: "Total Mentees", value: "14", icon: Users },
      { title: "Feedback Due", value: "2", icon: FileText },
    ],
    weeklyActivity: [
      { week: "Week 1", activity: 60, engagement: 40 },
      { week: "Week 2", activity: 65, engagement: 50 },
      { week: "Week 3", activity: 75, engagement: 60 },
      { week: "Week 4", activity: 70, engagement: 65 },
    ],
    department: [
      { department: "Computer Science", percentage: 28, color: "#007BFF", value: 4 },
      { department: "Mechanical Engineering", percentage: 18, color: "#0056b3", value: 2 },
      { department: "Electrical Engineering", percentage: 17, color: "#00aaff", value: 2 },
      { department: "Civil Engineering", percentage: 13, color: "#0080ff", value: 2 },
      { department: "Others", percentage: 24, color: "#66b3ff", value: 4 },
    ]
  },
  "2025": {
    kpi: [
      { title: "Pending Approvals", value: "3", icon: Clock },
      { title: "Total Mentees", value: "15", icon: Users },
      { title: "Feedback Due", value: "2", icon: FileText },
    ],
    weeklyActivity: [
      { week: "Week 1", activity: 65, engagement: 45 },
      { week: "Week 2", activity: 70, engagement: 55 },
      { week: "Week 3", activity: 80, engagement: 65 },
      { week: "Week 4", activity: 75, engagement: 70 },
    ],
    department: [
      { department: "Computer Science", percentage: 25, color: "#007BFF", value: 4 },
      { department: "Mechanical Engineering", percentage: 20, color: "#0056b3", value: 3 },
      { department: "Electrical Engineering", percentage: 15, color: "#00aaff", value: 2 },
      { department: "Civil Engineering", percentage: 12, color: "#0080ff", value: 2 },
      { department: "Others", percentage: 28, color: "#66b3ff", value: 4 },
    ]
  }
}

// PieChartComponent for rendering the enhanced pie chart
const PieChartComponent = ({ 
  departmentData, 
  hoveredSegment, 
  setHoveredSegment,
  selectedYear
}: {
  departmentData: any[];
  hoveredSegment: number | null;
  setHoveredSegment: (index: number | null) => void;
  selectedYear: string;
}) => {
  const total = departmentData.reduce((sum: number, dept: any) => sum + dept.value, 0);
  
  // Calculate positions for segments
  let cumulativePercentage = 0;
  
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
      <div className="relative w-64 h-64">
        {/* Center circle with total and year */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-28 h-28 bg-white rounded-full shadow-lg flex flex-col items-center justify-center border-4 border-gray-100">
            <div className="text-2xl font-bold text-gray-900">{total}</div>
            <div className="text-xs text-gray-500 text-center">Total<br />Students</div>
          </div>
        </div>
        
        {/* Pie chart segments */}
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {departmentData.map((dept: any, index: number) => {
            const percentage = (dept.value / total) * 100;
            const strokeDasharray = `${percentage * 2.51} ${251.2 - percentage * 2.51}`;
            const strokeDashoffset = -cumulativePercentage * 2.51;
            cumulativePercentage += percentage;
            
            return (
              <circle
                key={index}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={dept.color}
                strokeWidth="12"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 50 50)"
                className={`transition-all duration-300 ease-out cursor-pointer ${
                  hoveredSegment === index ? 'stroke-[14]' : ''
                }`}
                onMouseEnter={() => setHoveredSegment(index)}
                onMouseLeave={() => setHoveredSegment(null)}
              />
            );
          })}
        </svg>
        
        {/* Year indicator */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {selectedYear}
        </div>
      </div>
      
      {/* Enhanced Legend with better spacing and interactivity */}
      <div className="grid grid-cols-1 gap-3 w-full max-w-md">
        {departmentData.map((dept: any, index: number) => (
          <div 
            key={index} 
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer ${
              hoveredSegment === index 
                ? 'bg-blue-50 border border-blue-200 shadow-sm' 
                : 'bg-gray-50 hover:bg-gray-100 border border-gray-100'
            }`}
            onMouseEnter={() => setHoveredSegment(index)}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-3 flex-shrink-0" 
                style={{ backgroundColor: dept.color }}
              ></div>
              <div className="min-w-0">
                <span className="text-sm font-medium text-gray-900 truncate block max-w-[120px]">{dept.department}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{dept.value} students</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 bg-gray-200 rounded-full h-2 flex-shrink-0">
                <div 
                  className="h-2 rounded-full transition-all duration-500" 
                  style={{ 
                    width: `${dept.percentage}%`, 
                    backgroundColor: dept.color 
                  }}
                ></div>
              </div>
              <span className="text-sm font-bold text-gray-900 w-10 text-right">{dept.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// BarGraphComponent for rendering the enhanced bar graph
const BarGraphComponent = ({ 
  weeklyActivityData, 
  hoveredBar, 
  setHoveredBar
}: {
  weeklyActivityData: any[];
  hoveredBar: number | null;
  setHoveredBar: (index: number | null) => void;
}) => {
  // Find the maximum value for scaling
  const maxValue = Math.max(
    ...weeklyActivityData.map((data: any) => Math.max(data.activity, data.engagement))
  );
  
  return (
    <div className="space-y-6">
      {/* Graph Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-gray-900">Weekly Activity</h3>
          <p className="text-sm text-gray-600">Mentee engagement over the past month</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-xs text-gray-700">Activity</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-teal-500 rounded-full mr-2"></div>
            <span className="text-xs text-gray-700">Engagement</span>
          </div>
        </div>
      </div>
      
      {/* Enhanced Bar Graph */}
      <div className="h-64 flex items-end space-x-4 relative pt-6">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-6 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2 w-8">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>
        
        {/* Graph area */}
        <div className="flex-1 ml-8 relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="border-t border-gray-100"></div>
            ))}
          </div>
          
          {/* Data visualization */}
          <div className="h-full flex items-end space-x-6 pt-4">
            {weeklyActivityData.map((data: any, index: number) => (
              <div key={index} className="flex flex-col items-center flex-1">
                {/* Bars */}
                <div className="flex items-end justify-center h-48 w-full relative gap-1">
                  {/* Activity bar (blue) */}
                  <div 
                    className={`w-3/5 rounded-t-lg relative transition-all duration-300 cursor-pointer ${
                      hoveredBar === index ? 'opacity-100' : 'opacity-90'
                    }`}
                    style={{ 
                      height: `${(data.activity / maxValue) * 90}%`,
                      background: 'linear-gradient(to top, #007BFF, #3395ff)'
                    }}
                    onMouseEnter={() => setHoveredBar(index)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {hoveredBar === index && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded whitespace-nowrap z-10">
                        {data.activity}%
                      </div>
                    )}
                  </div>
                  {/* Engagement bar (teal) */}
                  <div 
                    className={`w-3/5 rounded-t-lg relative transition-all duration-300 cursor-pointer ${
                      hoveredBar === index ? 'opacity-100' : 'opacity-90'
                    }`}
                    style={{ 
                      height: `${(data.engagement / maxValue) * 90}%`,
                      background: 'linear-gradient(to top, #00aaff, #33bbff)'
                    }}
                    onMouseEnter={() => setHoveredBar(index)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {hoveredBar === index && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded whitespace-nowrap z-10">
                        {data.engagement}%
                      </div>
                    )}
                  </div>
                </div>
                {/* Week label */}
                <span className="text-xs text-gray-600 mt-2 font-medium">{data.week}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Additional Info */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
          <span>Average Activity: 72.5%</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
          <span>Average Engagement: 58.75%</span>
        </div>
      </div>
    </div>
  );
};

export default function FacultyDashboard() {
  const [selectedYear, setSelectedYear] = useState<string>("2025")
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null)
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)

  // Get data based on selected year
  const currentData = yearData[selectedYear] || yearData["2025"]

  return (
    <DashboardLayout userRole="faculty">
      <div className="space-y-6">
        {/* Welcome Header with Year Filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mentor Dashboard</h1>
            <p className="text-gray-600">Welcome, Dr. Anya Sharma</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Academic Year:</span>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023-24</SelectItem>
                <SelectItem value="2024">2024-25</SelectItem>
                <SelectItem value="2025">2025-26</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {currentData.kpi.map((kpi: any) => (
            <Card key={kpi.title} className="bg-white shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{kpi.title}</CardTitle>
                <kpi.icon className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{kpi.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* My Mentees Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">My Mentees</h2>
          
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Weekly Activity Graph */}
            <Card className="bg-white shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Weekly Activity
                </CardTitle>
                <CardDescription>Mentee engagement over the past month</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Enhanced Bar Graph */}
                <BarGraphComponent 
                  weeklyActivityData={currentData.weeklyActivity}
                  hoveredBar={hoveredBar}
                  setHoveredBar={setHoveredBar}
                />
              </CardContent>
            </Card>

            {/* Placements by Department */}
            <Card className="bg-white shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <PieChart className="h-5 w-5 text-blue-600" />
                  Placements by Department
                </CardTitle>
                <CardDescription>Distribution of mentee placements</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Enhanced Donut Chart */}
                <PieChartComponent 
                  departmentData={currentData.department}
                  hoveredSegment={hoveredSegment}
                  setHoveredSegment={setHoveredSegment}
                  selectedYear={selectedYear}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pending Applications Card */}
          <Card className="bg-white shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Clock className="h-5 w-5 text-blue-600" />
                Pending Approvals
              </CardTitle>
              <CardDescription>Applications awaiting your review</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                {/* Simulated progress bar */}
                <div className="w-full mr-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>75% Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <Link href="/faculty/mentees">
                <Button className="w-full">
                  View Mentees
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Feedback to Submit Card */}
          <Card className="bg-white shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <FileText className="h-5 w-5 text-blue-600" />
                Feedback to Submit
              </CardTitle>
              <CardDescription>Student feedback requiring your attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">2</span> feedback items due
                </div>
              </div>
              
              <Link href="/faculty/reports">
                <Button className="w-full">
                  Submit Feedback
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  )
}