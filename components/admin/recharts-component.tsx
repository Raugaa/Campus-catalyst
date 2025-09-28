"use client"

import React, { useMemo } from "react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ComposedChart,
  Line,
  LineChart,
  Cell,
} from "recharts"

// Department mapping for codes


// Interface for 100% Stacked Bar Chart
interface DepartmentStackedBarChartProps {
  data: Array<{
    label: string
    placed: number
    unplaced: number
    name: string
  }>
}

// Interface for Lollipop + Line Chart
interface DepartmentCTCChartProps {
  data: Array<{
    department: string
    avgPackage: number
    highestPackage: number
    placementPercentage: number
    code: string
  }>
}

// 100% Stacked Bar Chart for Department Performance
export function DepartmentStackedBarChart({ data }: DepartmentStackedBarChartProps) {
  if (!data?.length) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        No department data available
      </div>
    )
  }

  // Transform data for 100% stacked chart with department codes
  const chartData = useMemo(() => {
    return data.map((d) => {
      const total = d.placed + d.unplaced
      const placedPercentage = total > 0 ? (d.placed / total) * 100 : 0
      const unplacedPercentage = total > 0 ? (d.unplaced / total) * 100 : 0
      
      // Get department code or use first 3 letters if not found

      
      return {
        department: d.label.toUpperCase(),
        fullName: d.name,
        placed: placedPercentage,
        unplaced: unplacedPercentage,
        totalStudents: total,
        placedCount: d.placed,
        unplacedCount: d.unplaced,
      }
    })
  }, [data])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.fullName}</p>
          <p className="text-sm text-gray-600">Total Students: {data.totalStudents}</p>
          <p className="text-sm text-blue-600">Placed: {data.placedCount} ({data.placed.toFixed(1)}%)</p>
          <p className="text-sm text-blue-300">Unplaced: {data.unplacedCount} ({data.unplaced.toFixed(1)}%)</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-gray-900">Department Performance</h3>
        <p className="text-sm text-gray-600">Placed vs Unplaced (%)</p>
      </div>
      
      <div className="flex gap-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
          <span>Placed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-300 rounded-full mr-2"></div>
          <span>Unplaced</span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis
              dataKey="department"
              tick={{ fontSize: 12, fill: "#4b5563" }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
              label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Bar
              dataKey="placed"
              stackId="placement"
              fill="#3b82f6"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="unplaced"
              stackId="placement"
              fill="#93C5FD"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Lollipop + Line Chart for CTC Statistics
export function DepartmentCTCChart({ data }: DepartmentCTCChartProps) {
  if (!data?.length) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        No CTC data available
      </div>
    )
  }

  // Transform data with department codes
  const chartData = useMemo(() => {
    return data.map((d) => {
      return {
        department: d.code?.toUpperCase() || d.department.substring(0, 3).toUpperCase(),
        fullName: d.department,
        avgPackage: d.avgPackage / 100000, // Convert to LPA
        highestPackage: d.highestPackage / 100000, // Convert to LPA
        placementPercentage: d.placementPercentage,
      }
    })
  }, [data])

  const maxSalary = Math.max(...chartData.map(d => Math.max(d.avgPackage, d.highestPackage)))
  const salaryDomain = [0, Math.ceil(maxSalary * 1.1)]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.fullName}</p>
          <p className="text-sm text-blue-600">Avg Package: ₹{data.avgPackage.toFixed(1)} LPA</p>
          <p className="text-sm text-green-600">Highest Package: ₹{data.highestPackage.toFixed(1)} LPA</p>
          <p className="text-sm text-orange-600">Placement Rate: {data.placementPercentage.toFixed(1)}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-gray-900">Department-wise CTC Statistics</h3>
        <p className="text-sm text-gray-600">Average salary, highest package & placement %</p>
      </div>
      
      <div className="flex gap-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span>Avg Package</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span>Highest Package</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
          <span>Placement %</span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis
              dataKey="department"
              tick={{ fontSize: 12, fill: "#4b5563" }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
            />
            <YAxis
              yAxisId="salary"
              domain={salaryDomain}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
              label={{ value: 'Package (LPA)', angle: -90, position: 'insideLeft' }}
            />
            <YAxis
              yAxisId="percentage"
              orientation="right"
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
              label={{ value: 'Placement %', angle: 90, position: 'insideRight' }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Lollipop chart for salaries */}
            <Bar
              yAxisId="salary"
              dataKey="avgPackage"
              fill="#3b82f6"
              radius={[20, 20, 20, 20]}
              barSize={8}
            />
            <Bar
              yAxisId="salary"
              dataKey="highestPackage"
              fill="#10b981"
              radius={[20, 20, 20, 20]}
              barSize={8}
            />
            
            {/* Line chart for placement percentage */}
            <Line
              yAxisId="percentage"
              type="monotone"
              dataKey="placementPercentage"
              stroke="#f97316"
              strokeWidth={3}
              dot={{ fill: "#f97316", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Legacy component for backward compatibility (fixed interface)
interface DepartmentEnhancedBarGraphProps {
  data: Array<{
    label: string
    placed: number
    unplaced: number
  }>
  headerTitle?: string
  headerSubtitle?: string
  activityLabel?: string
  engagementLabel?: string
}

export function DepartmentEnhancedBarGraph({
  data,
  headerTitle = "Department Performance",
  headerSubtitle = "Placed vs Unplaced",
  activityLabel = "Placed",
  engagementLabel = "Unplaced",
}: DepartmentEnhancedBarGraphProps) {
  // Use the new stacked bar chart
  return <DepartmentStackedBarChart data={data} />
}