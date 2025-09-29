import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Bell, Shield, Users, Save } from "lucide-react"
import Link from "next/link"

export default function FacultySettings() {
  return (
    <DashboardLayout userRole="faculty">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and mentoring settings</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-2">
              <Link href="/faculty">
                <Button variant="outline" className="flex items-center gap-2">
                  <span>Back to Dashboard</span>
                </Button>
              </Link>
            </div>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="mentoring">Mentoring</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Account Settings
                </CardTitle>
                <CardDescription>Manage your account information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="display-name">Display Name</Label>
                    <Input id="display-name" defaultValue="Dr. Priya Kumar" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="faculty1@acme.edu" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="pst">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                        <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                        <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                        <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Language & Region</Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date-format">Date Format</Label>
                      <Select defaultValue="mm-dd-yyyy">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch id="two-factor" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="session-timeout">Auto-logout</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically log out after 30 minutes of inactivity
                      </p>
                    </div>
                    <Switch id="session-timeout" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how you want to be notified about important events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Email Notifications</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="new-applications">New student applications</Label>
                        <p className="text-sm text-muted-foreground">
                          When students apply for opportunities requiring approval
                        </p>
                      </div>
                      <Switch id="new-applications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="urgent-approvals">Urgent approval requests</Label>
                        <p className="text-sm text-muted-foreground">Applications with approaching deadlines</p>
                      </div>
                      <Switch id="urgent-approvals" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="mentee-updates">Mentee profile updates</Label>
                        <p className="text-sm text-muted-foreground">When your mentees update their profiles</p>
                      </div>
                      <Switch id="mentee-updates" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="interview-scheduled">Interview notifications</Label>
                        <p className="text-sm text-muted-foreground">When interviews are scheduled for your mentees</p>
                      </div>
                      <Switch id="interview-scheduled" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>In-App Notifications</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="browser-notifications">Browser notifications</Label>
                        <p className="text-sm text-muted-foreground">Show desktop notifications when the app is open</p>
                      </div>
                      <Switch id="browser-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sound-notifications">Sound notifications</Label>
                        <p className="text-sm text-muted-foreground">Play sound for important notifications</p>
                      </div>
                      <Switch id="sound-notifications" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Notification Frequency</Label>
                  <div className="space-y-2">
                    <Label htmlFor="digest-frequency">Email Digest Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Digest</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mentoring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Mentoring Preferences
                </CardTitle>
                <CardDescription>Configure your mentoring settings and availability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="max-mentees">Maximum Number of Mentees</Label>
                    <Input id="max-mentees" type="number" defaultValue="25" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="approval-mode">Application Approval Mode</Label>
                    <Select defaultValue="manual">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual Review</SelectItem>
                        <SelectItem value="auto">Auto-approve (with criteria)</SelectItem>
                        <SelectItem value="hybrid">Hybrid (auto + manual)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Auto-approval Criteria</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="gpa-requirement">Minimum GPA requirement</Label>
                        <p className="text-sm text-muted-foreground">Auto-approve students with GPA above threshold</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch id="gpa-requirement" />
                        <Input className="w-20" defaultValue="3.5" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="department-only">Department students only</Label>
                        <p className="text-sm text-muted-foreground">Only approve students from your department</p>
                      </div>
                      <Switch id="department-only" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="profile-complete">Complete profile required</Label>
                        <p className="text-sm text-muted-foreground">Require 100% profile completion</p>
                      </div>
                      <Switch id="profile-complete" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Mentoring Availability</Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="office-hours-start">Office Hours Start</Label>
                      <Input id="office-hours-start" type="time" defaultValue="10:00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="office-hours-end">Office Hours End</Label>
                      <Input id="office-hours-end" type="time" defaultValue="16:00" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Available Days</Label>
                    <div className="flex flex-wrap gap-2">
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                        <div key={day} className="flex items-center space-x-2">
                          <Switch id={day.toLowerCase()} defaultChecked={day !== "Saturday" && day !== "Sunday"} />
                          <Label htmlFor={day.toLowerCase()} className="text-sm">
                            {day}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>Control your privacy and data sharing preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Profile Visibility</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="public-profile">Public profile</Label>
                        <p className="text-sm text-muted-foreground">Make your profile visible to all students</p>
                      </div>
                      <Switch id="public-profile" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="contact-info">Show contact information</Label>
                        <p className="text-sm text-muted-foreground">Display email and phone to students</p>
                      </div>
                      <Switch id="contact-info" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="office-location">Show office location</Label>
                        <p className="text-sm text-muted-foreground">Display your office location to students</p>
                      </div>
                      <Switch id="office-location" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Data Sharing</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="analytics-sharing">Share analytics data</Label>
                        <p className="text-sm text-muted-foreground">
                          Help improve the platform with anonymous usage data
                        </p>
                      </div>
                      <Switch id="analytics-sharing" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="research-participation">Research participation</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow your data to be used for educational research
                        </p>
                      </div>
                      <Switch id="research-participation" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Communication Preferences</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="direct-messages">Allow direct messages</Label>
                        <p className="text-sm text-muted-foreground">Let students send you direct messages</p>
                      </div>
                      <Switch id="direct-messages" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="company-contact">Company contact requests</Label>
                        <p className="text-sm text-muted-foreground">Allow companies to contact you about students</p>
                      </div>
                      <Switch id="company-contact" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex gap-4">
                    <Button variant="outline">Export My Data</Button>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
