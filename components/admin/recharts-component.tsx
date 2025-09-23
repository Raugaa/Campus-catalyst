"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface RechartsComponentProps {
  data: Array<{
    name: string
    students: number
    placed: number
    rate: number
  }>
}

export default function RechartsComponent({ data }: RechartsComponentProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="students" fill="#8884d8" name="Total Students" />
        <Bar dataKey="placed" fill="#82ca9d" name="Placed Students" />
      </BarChart>
    </ResponsiveContainer>
  )
}