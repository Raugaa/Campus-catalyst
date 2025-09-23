'use client'

import { useMemo } from 'react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts'

interface SalaryTrendsChartProps {
  data: Array<{
    year: string
    avg: string
    highest: string
    lowest: string
    count: number
  }>
}

export function SalaryTrendsChart({ data }: SalaryTrendsChartProps) {
  const chartData = useMemo(() => {
    if (!data) return []
    
    return data.map(item => ({
      year: item.year,
      avg: parseFloat(item.avg.replace('₹', '').replace('L', '')),
      highest: parseFloat(item.highest.replace('₹', '').replace('L', '')),
      lowest: parseFloat(item.lowest.replace('₹', '').replace('L', '')),
      count: item.count
    })).sort((a, b) => parseInt(a.year) - parseInt(b.year))
  }, [data])

  const formatSalary = (value: number) => `₹${value}L`

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Year ${label}`}</p>
          <p className="text-blue-600">{`Average: ${formatSalary(payload[0]?.value)}`}</p>
          <p className="text-green-600">{`Highest: ${formatSalary(payload[1]?.value)}`}</p>
          <p className="text-orange-600">{`Lowest: ${formatSalary(payload[2]?.value)}`}</p>
          <p className="text-gray-600">{`Placements: ${payload[0]?.payload?.count}`}</p>
        </div>
      )
    }
    return null
  }

  if (!chartData.length) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No salary data available for chart
      </div>
    )
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
          <XAxis 
            dataKey="year" 
            className="text-xs"
            stroke="#666"
          />
          <YAxis 
            className="text-xs"
            stroke="#666"
            label={{ value: 'Salary (₹L)', angle: -90, position: 'insideLeft' }}
            tickFormatter={formatSalary} // ✅ format Y axis values
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="avg" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Average"
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="highest" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Highest"
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="lowest" 
            stroke="#f59e0b" 
            strokeWidth={2}
            name="Lowest"
            dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}