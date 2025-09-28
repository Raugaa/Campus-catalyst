'use client'

import { useMemo } from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts'

interface ApplicationTrendsChartProps {
  data: Array<{
    month: string
    applications: number
    success: number
  }>
}

export function ApplicationTrendsChart({ data }: ApplicationTrendsChartProps) {
  const chartData = useMemo(() => {
    if (!data) return []
    
    return data.map(item => ({
      month: item.month,
      applications: item.applications,
      success: typeof item.success === 'number' ? item.success : 0,
      successRate: item.applications > 0 ? ((item.success / item.applications) * 100) : 0
    }))
  }, [data])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">{`Applications: ${data?.applications}`}</p>
          <p className="text-green-600">{`Successful: ${data?.success}`}</p>
          <p className="text-purple-600">{`Success Rate: ${data?.successRate?.toFixed(1)}%`}</p>
        </div>
      )
    }
    return null
  }

  if (!chartData.length) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No application data available for chart
      </div>
    )
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
          <XAxis 
            dataKey="month" 
            className="text-xs"
            stroke="#666"
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            className="text-xs"
            stroke="#666"
            label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="applications" 
            fill="#3b82f6" 
            name="Applications"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="success" 
            fill="#10b981" 
            name="Successful"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}