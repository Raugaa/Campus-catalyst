'use client'

import { useState } from "react"
import { parseResume } from "@/lib/resume-parser"

export default function TestResumeParser() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setLoading(true)
      try {
        const parsedData = await parseResume(file)
        setResult(parsedData)
      } catch (error) {
        console.error("Error parsing resume:", error)
        setResult({ error: "Failed to parse resume" })
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Test Resume Parser</h1>
      
      <div className="mb-8">
        <input 
          type="file" 
          accept=".pdf" 
          onChange={handleFileChange} 
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Parsing resume...</p>
        </div>
      )}

      {result && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Parsed Data:</h2>
          <pre className="bg-white p-4 rounded overflow-auto max-h-96 text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}