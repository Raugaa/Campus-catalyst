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
    avg: number
    highest: number
    lowest: number
    count: number
  }>
}

export function SalaryTrendsChart({ data }: SalaryTrendsChartProps) {
  const chartData = useMemo(() => {
    if (!data) return []
    
    return data.map(item => ({
      year: item.year,
      avg: typeof item.avg === 'number' ? item.avg : parseFloat(String(item.avg)),
      highest: typeof item.highest === 'number' ? item.highest : parseFloat(String(item.highest)),
      lowest: typeof item.lowest === 'number' ? item.lowest : parseFloat(String(item.lowest)),
      count: item.count
    })).sort((a, b) => parseInt(a.year) - parseInt(b.year))
  }, [data])

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Year ${label}`}</p>
          <p className="text-blue-600">{`Average: ${formatCurrency(payload[0]?.value)}`}</p>
          <p className="text-green-600">{`Highest: ${formatCurrency(payload[1]?.value)}`}</p>
          <p className="text-orange-600">{`Lowest: ${formatCurrency(payload[2]?.value)}`}</p>
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
            label={{ value: 'Salary', angle: -90, position: 'insideLeft' }}
            tickFormatter={formatCurrency}
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