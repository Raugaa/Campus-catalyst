import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Settings, Bell, Shield, Database, Users, Building2, GraduationCap, Save, Upload, Download } from "lucide-react"

export default function AdminSettings() {
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">System Settings</h1>
            <p className="text-muted-foreground">Configure platform settings and preferences</p>
          </div>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save All Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Platform Configuration
                </CardTitle>
                <CardDescription>Basic platform settings and information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="platform-name">Platform Name</Label>
                    <Input id="platform-name" defaultValue="Campus Internship Portal" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="institution-name">Institution Name</Label>
                    <Input id="institution-name" defaultValue="University of Technology" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input id="admin-email" type="email" defaultValue="admin@university.edu" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support-email">Support Email</Label>
                    <Input id="support-email" type="email" defaultValue="support@university.edu" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform-description">Platform Description</Label>
                  <Textarea
                    id="platform-description"
                    rows={3}
                    defaultValue="Integrated Campus Internship & Placement Portal connecting students, companies, faculty, and placement officers."
                  />
                </div>

                <div className="space-y-4">
                  <Label>Application Settings</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-approve">Auto-approve company registrations</Label>
                        <p className="text-sm text-muted-foreground">Automatically approve new company registrations</p>
                      </div>
                      <Switch id="auto-approve" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="student-verification">Require student email verification</Label>
                        <p className="text-sm text-muted-foreground">
                          Students must verify their email before accessing the platform
                        </p>
                      </div>
                      <Switch id="student-verification" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="faculty-approval">Require faculty approval for applications</Label>
                        <p className="text-sm text-muted-foreground">
                          All student applications must be approved by faculty mentors
                        </p>
                      </div>
                      <Switch id="faculty-approval" defaultChecked />
                    </div>
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
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure system-wide notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Email Notifications</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="new-applications">New application notifications</Label>
                        <p className="text-sm text-muted-foreground">Notify companies when students apply</p>
                      </div>
                      <Switch id="new-applications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="deadline-reminders">Application deadline reminders</Label>
                        <p className="text-sm text-muted-foreground">Send reminders 3 days before deadlines</p>
                      </div>
                      <Switch id="deadline-reminders" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="status-updates">Application status updates</Label>
                        <p className="text-sm text-muted-foreground">Notify students of application status changes</p>
                      </div>
                      <Switch id="status-updates" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Admin Notifications</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="new-registrations">New user registrations</Label>
                        <p className="text-sm text-muted-foreground">Notify admins of new user registrations</p>
                      </div>
                      <Switch id="new-registrations" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="system-alerts">System alerts</Label>
                        <p className="text-sm text-muted-foreground">Critical system notifications</p>
                      </div>
                      <Switch id="system-alerts" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-server">SMTP Server</Label>
                    <Input id="smtp-server" defaultValue="smtp.university.edu" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input id="smtp-port" defaultValue="587" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Management Settings
                </CardTitle>
                <CardDescription>Configure user roles and permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>User Role Permissions</Label>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <GraduationCap className="w-5 h-5 text-blue-500" />
                        <Label className="text-base font-medium">Students</Label>
                        <Badge variant="secondary">1,247 users</Badge>
                      </div>
                      <div className="grid gap-2 md:grid-cols-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Create profiles</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Apply to opportunities</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">View company profiles</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Message companies</span>
                          <Switch />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Building2 className="w-5 h-5 text-green-500" />
                        <Label className="text-base font-medium">Companies</Label>
                        <Badge variant="secondary">89 users</Badge>
                      </div>
                      <div className="grid gap-2 md:grid-cols-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Post opportunities</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">View student profiles</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Schedule interviews</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Access analytics</span>
                          <Switch />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="w-5 h-5 text-purple-500" />
                        <Label className="text-base font-medium">Faculty</Label>
                        <Badge variant="secondary">45 users</Badge>
                      </div>
                      <div className="grid gap-2 md:grid-cols-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Approve applications</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">View student progress</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Generate reports</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Manage mentees</span>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Configure security policies and authentication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Password Policy</Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="min-length">Minimum Password Length</Label>
                      <Input id="min-length" type="number" defaultValue="8" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-attempts">Max Login Attempts</Label>
                      <Input id="max-attempts" type="number" defaultValue="5" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="require-uppercase">Require uppercase letters</Label>
                        <p className="text-sm text-muted-foreground">
                          Passwords must contain at least one uppercase letter
                        </p>
                      </div>
                      <Switch id="require-uppercase" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="require-numbers">Require numbers</Label>
                        <p className="text-sm text-muted-foreground">Passwords must contain at least one number</p>
                      </div>
                      <Switch id="require-numbers" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="require-symbols">Require special characters</Label>
                        <p className="text-sm text-muted-foreground">
                          Passwords must contain at least one special character
                        </p>
                      </div>
                      <Switch id="require-symbols" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Session Management</Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                      <Input id="session-timeout" type="number" defaultValue="60" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="concurrent-sessions">Max Concurrent Sessions</Label>
                      <Input id="concurrent-sessions" type="number" defaultValue="3" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="two-factor">Enable Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                    </div>
                    <Switch id="two-factor" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="audit-logs">Enable Audit Logging</Label>
                      <p className="text-sm text-muted-foreground">Log all user actions for security monitoring</p>
                    </div>
                    <Switch id="audit-logs" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  External Integrations
                </CardTitle>
                <CardDescription>Configure third-party service integrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <Label className="text-base font-medium">Email Service</Label>
                        <p className="text-sm text-muted-foreground">SMTP configuration for email notifications</p>
                      </div>
                      <Badge variant="default">Connected</Badge>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="smtp-host">SMTP Host</Label>
                        <Input id="smtp-host" defaultValue="smtp.university.edu" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtp-username">Username</Label>
                        <Input id="smtp-username" defaultValue="noreply@university.edu" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <Label className="text-base font-medium">Calendar Integration</Label>
                        <p className="text-sm text-muted-foreground">Google Calendar for interview scheduling</p>
                      </div>
                      <Badge variant="outline">Not Connected</Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure Integration
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <Label className="text-base font-medium">Document Storage</Label>
                        <p className="text-sm text-muted-foreground">Cloud storage for resumes and documents</p>
                      </div>
                      <Badge variant="default">Connected</Badge>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storage-quota">Storage Quota (GB)</Label>
                      <Input id="storage-quota" defaultValue="100" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Backup & Recovery
                </CardTitle>
                <CardDescription>Manage system backups and data recovery</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Automated Backups</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="daily-backup">Daily automated backups</Label>
                        <p className="text-sm text-muted-foreground">Create daily backups at 2:00 AM</p>
                      </div>
                      <Switch id="daily-backup" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weekly-backup">Weekly full backups</Label>
                        <p className="text-sm text-muted-foreground">Complete system backup every Sunday</p>
                      </div>
                      <Switch id="weekly-backup" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Backup History</Label>
                  <div className="space-y-2">
                    {[
                      { date: "2024-01-15 02:00", type: "Daily", size: "2.3 GB", status: "Success" },
                      { date: "2024-01-14 02:00", type: "Daily", size: "2.1 GB", status: "Success" },
                      { date: "2024-01-14 02:00", type: "Weekly", size: "15.7 GB", status: "Success" },
                      { date: "2024-01-13 02:00", type: "Daily", size: "2.0 GB", status: "Success" },
                    ].map((backup, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{backup.type} Backup</p>
                          <p className="text-sm text-muted-foreground">{backup.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{backup.size}</p>
                          <Badge variant={backup.status === "Success" ? "default" : "destructive"} className="text-xs">
                            {backup.status}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Create Backup Now
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
