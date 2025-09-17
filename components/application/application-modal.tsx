"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { FileText, CheckCircle, AlertTriangle } from "lucide-react"

interface ApplicationModalProps {
  opportunity: {
    title: string
    company: string
    location: string
    type: string
    deadline: string
  }
  children: React.ReactNode
}

export function ApplicationModal({ opportunity, children }: ApplicationModalProps) {
  const [step, setStep] = useState(1)
  const [coverLetter, setCoverLetter] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleSubmit = () => {
    // Handle application submission
    console.log("Application submitted")
    setStep(4) // Success step
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for {opportunity.title}</DialogTitle>
          <DialogDescription>Complete your application for {opportunity.company}</DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            {/* Opportunity Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Position Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={`/placeholder-icon.png?height=40&width=40&text=${opportunity.company[0]}`} />
                    <AvatarFallback>{opportunity.company[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{opportunity.title}</h4>
                    <p className="text-sm text-muted-foreground">{opportunity.company}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">{opportunity.location}</Badge>
                  <Badge variant="secondary">{opportunity.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Application deadline: {opportunity.deadline}</p>
              </CardContent>
            </Card>

            {/* Profile Review */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Profile</CardTitle>
                <CardDescription>Review your profile information that will be submitted</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="/placeholder.svg?height=48&width=48" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">John Doe</h4>
                    <p className="text-sm text-muted-foreground">Computer Science Student</p>
                    <p className="text-sm text-muted-foreground">john.doe@college.edu</p>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h5 className="font-medium mb-2">Resume</h5>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-green-500" />
                      <span>John_Doe_Resume.pdf</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Profile Completion</h5>
                    <div className="flex items-center gap-2 text-sm">
                      <span>85% Complete</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Skills</h5>
                  <div className="flex flex-wrap gap-1">
                    {["React", "Node.js", "JavaScript", "Python", "TypeScript"].map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={() => setStep(2)}>Continue Application</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Cover Letter</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Write a personalized cover letter for this position (optional but recommended)
              </p>
              <Textarea
                placeholder="Dear Hiring Manager,

I am writing to express my interest in the Software Engineering Intern position at TechCorp Inc. With my background in computer science and hands-on experience with React and Node.js, I am excited about the opportunity to contribute to your team..."
                rows={8}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="additional-info">Additional Information (Optional)</Label>
              <Textarea
                id="additional-info"
                placeholder="Any additional information you'd like to share..."
                rows={4}
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
              />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)}>Review Application</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Review Your Application</h3>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Application Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h5 className="font-medium mb-1">Position</h5>
                    <p className="text-sm text-muted-foreground">
                      {opportunity.title} at {opportunity.company}
                    </p>
                  </div>

                  <div>
                    <h5 className="font-medium mb-1">Documents</h5>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4" />
                      <span>Resume: John_Doe_Resume.pdf</span>
                    </div>
                  </div>

                  {coverLetter && (
                    <div>
                      <h5 className="font-medium mb-1">Cover Letter</h5>
                      <div className="bg-muted p-3 rounded text-sm max-h-32 overflow-y-auto">{coverLetter}</div>
                    </div>
                  )}

                  {additionalInfo && (
                    <div>
                      <h5 className="font-medium mb-1">Additional Information</h5>
                      <div className="bg-muted p-3 rounded text-sm">{additionalInfo}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the terms and conditions and confirm that all information provided is accurate
              </Label>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={!agreedToTerms}>
                Submit Application
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center space-y-6 py-8">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Application Submitted!</h3>
              <p className="text-muted-foreground">
                Your application for {opportunity.title} at {opportunity.company} has been successfully submitted.
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-sm">What's Next?</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• You'll receive a confirmation email shortly</li>
                <li>• The company will review your application</li>
                <li>• You can track progress in your Applications page</li>
                <li>• We'll notify you of any updates</li>
              </ul>
            </div>
            <Button className="w-full">View My Applications</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
