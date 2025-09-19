'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface BarChartData {
  name: string
  placed: number
  unplaced: number
}

interface RechartsComponentProps {
  data: BarChartData[]
}

export default function RechartsComponent({ data }: RechartsComponentProps) {
  // Custom tooltip component for better styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-md">
          <p className="font-bold text-gray-900">{label}</p>
          <p className="text-blue-600">
            Placed: <span className="font-bold">{payload[0].value}</span>
          </p>
          <p className="text-red-600">
            Unplaced: <span className="font-bold">{payload[1].value}</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          barSize={30}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={80} 
            tick={{ fill: '#374151', fontSize: 12 }}
            interval={0}
          />
          <YAxis 
            tick={{ fill: '#374151' }}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '10px' }}
            align="center"
            verticalAlign="top"
          />
          <Bar 
            dataKey="placed" 
            name="Placed Students" 
            fill="#00a6f2" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="unplaced" 
            name="Unplaced Students" 
            fill="#ef4444" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}