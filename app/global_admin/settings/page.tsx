"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  User, 
  Key, 
  Bell, 
  Shield, 
  Database,
  Save,
  RotateCcw,
  CheckCircle,
  Settings,
  Users,
  Building,
  GraduationCap,
  Mail,
  Lock,
  Globe,
  Calendar,
  FileText,
  AlertTriangle,
  Clock,
  DollarSign,
  Award
} from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/dashboard-layout"

export default function GlobalAdminSettings() {
  // Initial state for all settings
  const initialSettings = {
    // Profile settings
    fullName: "Global Administrator",
    email: "global@admin.com",
    bio: "System administrator with full access to all platform features and settings.",
    phone: "+91-9876543210",
    department: "IT Administration",
    
    // Security settings
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordExpiry: 90,
    ipWhitelisting: false,
    whitelistedIPs: "",
    
    // System configuration
    maintenanceMode: false,
    registrationOpen: true,
    maxStudentsPerCollege: 1000,
    maxCompanyRegistrations: 500,
    platformName: "PlacementHub",
    platformDescription: "Leading placement coordination platform",
    supportEmail: "support@placementhub.com",
    
    // Email configuration
    emailNotifications: true,
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUsername: "",
    smtpPassword: "",
    emailFromName: "PlacementHub System",
    emailFromAddress: "noreply@placementhub.com",
    
    // Notification settings
    notifyNewRegistrations: true,
    notifyJobPostings: true,
    notifyApplications: true,
    notifySystemErrors: true,
    notifySecurityAlerts: true,
    dailyReports: true,
    weeklyReports: true,
    monthlyReports: false,
    
    // User management
    autoApproveStudents: false,
    autoApproveFaculty: false,
    autoApproveCompanies: false,
    requireEmailVerification: true,
    allowBulkRegistration: true,
    
    // Placement settings
    placementSeason: "2024-2025",
    placementStartDate: "",
    placementEndDate: "",
    minCGPARequired: 6.0,
    maxBacklogsAllowed: 2,
    allowMultipleOffers: true,
    offerAcceptanceTimeout: 48,
    
    // Company settings
    maxJobPostingsPerCompany: 10,
    jobPostingApprovalRequired: true,
    companyVerificationRequired: true,
    minPackageAmount: 300000,
    maxPackageAmount: 5000000,
    
    // Data retention
    logsRetention: 90,
    auditRetention: 365,
    backupRetention: 30,
    applicationDataRetention: 1095,
    
    // API & Integration
    apiEnabled: true,
    apiRateLimit: 1000,
    webhooksEnabled: false,
    thirdPartyIntegrations: false,
    
    // File upload settings
    maxFileSize: 10,
    allowedFileTypes: "pdf,doc,docx,jpg,png",
    virusScanEnabled: true,
    
    // Performance settings
    cacheEnabled: true,
    cacheDuration: 3600,
    maxConcurrentUsers: 10000,
    
    // Backup settings
    autoBackupEnabled: true,
    backupFrequency: "daily",
    backupLocation: "cloud"
  }

  const [settings, setSettings] = useState(initialSettings)
  const [activeTab, setActiveTab] = useState("profile")
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (field: string, value: string | boolean | number) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // Validation
    if (settings.newPassword && settings.newPassword !== settings.confirmPassword) {
      alert("Passwords do not match!")
      return
    }
    
    if (settings.minCGPARequired < 0 || settings.minCGPARequired > 10) {
      alert("CGPA must be between 0 and 10")
      return
    }
    
    console.log("Settings saved:", settings)
    
    // Show success message
    setShowSuccess(true)
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false)
    }, 3000)
    
    // In a real app, this would call an API to save the settings
  }

  const handleReset = () => {
    setSettings(initialSettings)
    console.log("Settings reset")
    alert("Settings reset to default values")
  }

  const testEmailConfiguration = () => {
    alert("Test email sent successfully!")
  }

  return (
    <DashboardLayout userRole="global_admin">
      <div className="space-y-6">
        <div>
          <Link href="/global_admin" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-2">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Global Admin Settings</h1>
          <p className="text-gray-600">Manage system-wide configurations and preferences</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-xl text-center animate-pulse">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-600 mb-2">Settings Saved!</h2>
              <p className="text-gray-600">Your settings have been saved successfully.</p>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="profile" className="flex items-center gap-1 text-xs">
              <User className="h-3 w-3" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1 text-xs">
              <Shield className="h-3 w-3" />
              Security
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-1 text-xs">
              <Database className="h-3 w-3" />
              System
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-1 text-xs">
              <Mail className="h-3 w-3" />
              Email
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1 text-xs">
              <Bell className="h-3 w-3" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="placement" className="flex items-center gap-1 text-xs">
              <Award className="h-3 w-3" />
              Placement
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-1 text-xs">
              <Settings className="h-3 w-3" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            {/* Profile Settings */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-500" />
                    Profile Settings
                  </CardTitle>
                  <CardDescription>Update your global admin profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName" 
                        value={settings.fullName}
                        onChange={(e) => handleChange("fullName", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={settings.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={settings.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input 
                        id="department" 
                        value={settings.department}
                        onChange={(e) => handleChange("department", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      placeholder="Tell us about yourself..." 
                      rows={3}
                      value={settings.bio}
                      onChange={(e) => handleChange("bio", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5 text-yellow-500" />
                      Password Settings
                    </CardTitle>
                    <CardDescription>Manage your account security preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input 
                        id="currentPassword" 
                        type="password" 
                        value={settings.currentPassword}
                        onChange={(e) => handleChange("currentPassword", e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input 
                          id="newPassword" 
                          type="password" 
                          value={settings.newPassword}
                          onChange={(e) => handleChange("newPassword", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input 
                          id="confirmPassword" 
                          type="password" 
                          value={settings.confirmPassword}
                          onChange={(e) => handleChange("confirmPassword", e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                        <Input 
                          id="passwordExpiry" 
                          type="number" 
                          value={settings.passwordExpiry}
                          onChange={(e) => handleChange("passwordExpiry", parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                        <Input 
                          id="maxLoginAttempts" 
                          type="number" 
                          value={settings.maxLoginAttempts}
                          onChange={(e) => handleChange("maxLoginAttempts", parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-red-500" />
                      Advanced Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                      <Switch
                        checked={settings.twoFactorAuth}
                        onCheckedChange={(checked) => handleChange("twoFactorAuth", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">IP Whitelisting</h4>
                        <p className="text-sm text-muted-foreground">Restrict access to specific IP addresses</p>
                      </div>
                      <Switch
                        checked={settings.ipWhitelisting}
                        onCheckedChange={(checked) => handleChange("ipWhitelisting", checked)}
                      />
                    </div>
                    
                    {settings.ipWhitelisting && (
                      <div>
                        <Label htmlFor="whitelistedIPs">Whitelisted IP Addresses</Label>
                        <Textarea 
                          id="whitelistedIPs" 
                          placeholder="Enter IP addresses separated by commas (e.g., 192.168.1.1, 10.0.0.1)"
                          value={settings.whitelistedIPs}
                          onChange={(e) => handleChange("whitelistedIPs", e.target.value)}
                        />
                      </div>
                    )}
                    
                    <div>
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input 
                        id="sessionTimeout" 
                        type="number" 
                        value={settings.sessionTimeout}
                        onChange={(e) => handleChange("sessionTimeout", parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* System Configuration */}
            <TabsContent value="system">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-green-500" />
                      Platform Configuration
                    </CardTitle>
                    <CardDescription>General platform settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="platformName">Platform Name</Label>
                        <Input 
                          id="platformName" 
                          value={settings.platformName}
                          onChange={(e) => handleChange("platformName", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="supportEmail">Support Email</Label>
                        <Input 
                          id="supportEmail" 
                          type="email"
                          value={settings.supportEmail}
                          onChange={(e) => handleChange("supportEmail", e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="platformDescription">Platform Description</Label>
                      <Textarea 
                        id="platformDescription" 
                        value={settings.platformDescription}
                        onChange={(e) => handleChange("platformDescription", e.target.value)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Maintenance Mode</h4>
                        <p className="text-sm text-muted-foreground">Temporarily disable platform access</p>
                      </div>
                      <Switch
                        checked={settings.maintenanceMode}
                        onCheckedChange={(checked) => handleChange("maintenanceMode", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Open Registration</h4>
                        <p className="text-sm text-muted-foreground">Allow new user registrations</p>
                      </div>
                      <Switch
                        checked={settings.registrationOpen}
                        onCheckedChange={(checked) => handleChange("registrationOpen", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      User Limits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="maxStudentsPerCollege">Max Students per College</Label>
                        <Input 
                          id="maxStudentsPerCollege" 
                          type="number"
                          value={settings.maxStudentsPerCollege}
                          onChange={(e) => handleChange("maxStudentsPerCollege", parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxCompanyRegistrations">Max Company Registrations</Label>
                        <Input 
                          id="maxCompanyRegistrations" 
                          type="number"
                          value={settings.maxCompanyRegistrations}
                          onChange={(e) => handleChange("maxCompanyRegistrations", parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Email Configuration */}
            <TabsContent value="email">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-purple-500" />
                    Email Configuration
                  </CardTitle>
                  <CardDescription>Configure SMTP settings for email delivery</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="smtpHost">SMTP Host</Label>
                      <Input 
                        id="smtpHost" 
                        value={settings.smtpHost}
                        onChange={(e) => handleChange("smtpHost", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input 
                        id="smtpPort" 
                        type="number"
                        value={settings.smtpPort}
                        onChange={(e) => handleChange("smtpPort", parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtpUsername">SMTP Username</Label>
                      <Input 
                        id="smtpUsername" 
                        value={settings.smtpUsername}
                        onChange={(e) => handleChange("smtpUsername", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtpPassword">SMTP Password</Label>
                      <Input 
                        id="smtpPassword" 
                        type="password"
                        value={settings.smtpPassword}
                        onChange={(e) => handleChange("smtpPassword", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emailFromName">From Name</Label>
                      <Input 
                        id="emailFromName" 
                        value={settings.emailFromName}
                        onChange={(e) => handleChange("emailFromName", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="emailFromAddress">From Address</Label>
                      <Input 
                        id="emailFromAddress" 
                        type="email"
                        value={settings.emailFromAddress}
                        onChange={(e) => handleChange("emailFromAddress", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={testEmailConfiguration} variant="outline">
                    Test Email Configuration
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-orange-500" />
                      System Notifications
                    </CardTitle>
                    <CardDescription>Configure system-wide notification preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">New Registrations</span>
                        <Switch
                          checked={settings.notifyNewRegistrations}
                          onCheckedChange={(checked) => handleChange("notifyNewRegistrations", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Job Postings</span>
                        <Switch
                          checked={settings.notifyJobPostings}
                          onCheckedChange={(checked) => handleChange("notifyJobPostings", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Applications</span>
                        <Switch
                          checked={settings.notifyApplications}
                          onCheckedChange={(checked) => handleChange("notifyApplications", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">System Errors</span>
                        <Switch
                          checked={settings.notifySystemErrors}
                          onCheckedChange={(checked) => handleChange("notifySystemErrors", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Security Alerts</span>
                        <Switch
                          checked={settings.notifySecurityAlerts}
                          onCheckedChange={(checked) => handleChange("notifySecurityAlerts", checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-indigo-500" />
                      Report Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Daily Reports</span>
                        <Switch
                          checked={settings.dailyReports}
                          onCheckedChange={(checked) => handleChange("dailyReports", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Weekly Reports</span>
                        <Switch
                          checked={settings.weeklyReports}
                          onCheckedChange={(checked) => handleChange("weeklyReports", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Monthly Reports</span>
                        <Switch
                          checked={settings.monthlyReports}
                          onCheckedChange={(checked) => handleChange("monthlyReports", checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Placement Settings */}
            <TabsContent value="placement">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-green-500" />
                      Placement Configuration
                    </CardTitle>
                    <CardDescription>Configure placement season and student requirements</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="placementSeason">Placement Season</Label>
                        <Input 
                          id="placementSeason" 
                          value={settings.placementSeason}
                          onChange={(e) => handleChange("placementSeason", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="placementStartDate">Start Date</Label>
                        <Input 
                          id="placementStartDate" 
                          type="date"
                          value={settings.placementStartDate}
                          onChange={(e) => handleChange("placementStartDate", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="placementEndDate">End Date</Label>
                        <Input 
                          id="placementEndDate" 
                          type="date"
                          value={settings.placementEndDate}
                          onChange={(e) => handleChange("placementEndDate", e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="minCGPARequired">Minimum CGPA Required</Label>
                        <Input 
                          id="minCGPARequired" 
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={settings.minCGPARequired}
                          onChange={(e) => handleChange("minCGPARequired", parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxBacklogsAllowed">Max Backlogs Allowed</Label>
                        <Input 
                          id="maxBacklogsAllowed" 
                          type="number"
                          value={settings.maxBacklogsAllowed}
                          onChange={(e) => handleChange("maxBacklogsAllowed", parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="offerAcceptanceTimeout">Offer Acceptance Timeout (hours)</Label>
                        <Input 
                          id="offerAcceptanceTimeout" 
                          type="number"
                          value={settings.offerAcceptanceTimeout}
                          onChange={(e) => handleChange("offerAcceptanceTimeout", parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Allow Multiple Offers</h4>
                        <p className="text-sm text-muted-foreground">Allow students to receive multiple job offers</p>
                      </div>
                      <Switch
                        checked={settings.allowMultipleOffers}
                        onCheckedChange={(checked) => handleChange("allowMultipleOffers", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-blue-500" />
                      Company Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="maxJobPostingsPerCompany">Max Job Postings per Company</Label>
                        <Input 
                          id="maxJobPostingsPerCompany" 
                          type="number"
                          value={settings.maxJobPostingsPerCompany}
                          onChange={(e) => handleChange("maxJobPostingsPerCompany", parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="minPackageAmount">Minimum Package Amount (₹)</Label>
                        <Input 
                          id="minPackageAmount" 
                          type="number"
                          value={settings.minPackageAmount}
                          onChange={(e) => handleChange("minPackageAmount", parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="maxPackageAmount">Maximum Package Amount (₹)</Label>
                        <Input 
                          id="maxPackageAmount" 
                          type="number"
                          value={settings.maxPackageAmount}
                          onChange={(e) => handleChange("maxPackageAmount", parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Job Posting Approval Required</h4>
                          <p className="text-sm text-muted-foreground">Require admin approval for new job postings</p>
                        </div>
                        <Switch
                          checked={settings.jobPostingApprovalRequired}
                          onCheckedChange={(checked) => handleChange("jobPostingApprovalRequired", checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Company Verification Required</h4>
                          <p className="text-sm text-muted-foreground">Require verification before companies can post jobs</p>
                        </div>
                        <Switch
                          checked={settings.companyVerificationRequired}
                          onCheckedChange={(checked) => handleChange("companyVerificationRequired", checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-500" />
                      User Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Auto-approve Students</h4>
                          <p className="text-sm text-muted-foreground">Automatically approve student registrations</p>
                        </div>
                        <Switch
                          checked={settings.autoApproveStudents}
                          onCheckedChange={(checked) => handleChange("autoApproveStudents", checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Auto-approve Faculty</h4>
                          <p className="text-sm text-muted-foreground">Automatically approve faculty registrations</p>
                        </div>
                        <Switch
                          checked={settings.autoApproveFaculty}
                          onCheckedChange={(checked) => handleChange("autoApproveFaculty", checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Auto-approve Companies</h4>
                          <p className="text-sm text-muted-foreground">Automatically approve company registrations</p>
                        </div>
                        <Switch
                          checked={settings.autoApproveCompanies}
                          onCheckedChange={(checked) => handleChange("autoApproveCompanies", checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Require Email Verification</h4>
                          <p className="text-sm text-muted-foreground">Users must verify email before activation</p>
                        </div>
                        <Switch
                          checked={settings.requireEmailVerification}
                          onCheckedChange={(checked) => handleChange("requireEmailVerification", checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Allow Bulk Registration</h4>
                          <p className="text-sm text-muted-foreground">Allow bulk user registration via CSV</p>
                        </div>
                        <Switch
                          checked={settings.allowBulkRegistration}
                          onCheckedChange={(checked) => handleChange("allowBulkRegistration", checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Advanced Settings */}
            <TabsContent value="advanced">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-red-500" />
                      Data Management
                    </CardTitle>
                    <CardDescription>Configure data retention and backup settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="logsRetention">System Logs Retention (days)</Label>
                        <Input 
                          id="logsRetention" 
                          type="number"
                          value={settings.logsRetention}
                          onChange={(e) => handleChange("logsRetention", parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="auditRetention">Audit Trail Retention (days)</Label>
                        <Input 
                          id="auditRetention" 
                          type="number"
                          value={settings.auditRetention}
                          onChange={(e) => handleChange("auditRetention", parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="backupRetention">Backup Retention (days)</Label>
                        <Input 
                          id="backupRetention" 
                          type="number"
                          value={settings.backupRetention}
                          onChange={(e) => handleChange("backupRetention", parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="applicationDataRetention">Application Data Retention (days)</Label>
                        <Input 
                          id="applicationDataRetention" 
                          type="number"
                          value={settings.applicationDataRetention}
                          onChange={(e) => handleChange("applicationDataRetention", parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Auto Backup Enabled</h4>
                          <p className="text-sm text-muted-foreground">Enable automatic system backups</p>
                        </div>
                        <Switch
                          checked={settings.autoBackupEnabled}
                          onCheckedChange={(checked) => handleChange("autoBackupEnabled", checked)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="backupFrequency">Backup Frequency</Label>
                        <Select 
                          value={settings.backupFrequency} 
                          onValueChange={(value) => handleChange("backupFrequency", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="backupLocation">Backup Location</Label>
                        <Select 
                          value={settings.backupLocation} 
                          onValueChange={(value) => handleChange("backupLocation", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="local">Local Storage</SelectItem>
                            <SelectItem value="cloud">Cloud Storage</SelectItem>
                            <SelectItem value="both">Both</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-blue-500" />
                      API & Integration Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">API Enabled</h4>
                          <p className="text-sm text-muted-foreground">Enable REST API access</p>
                        </div>
                        <Switch
                          checked={settings.apiEnabled}
                          onCheckedChange={(checked) => handleChange("apiEnabled", checked)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="apiRateLimit">API Rate Limit (requests/hour)</Label>
                        <Input 
                          id="apiRateLimit" 
                          type="number"
                          value={settings.apiRateLimit}
                          onChange={(e) => handleChange("apiRateLimit", parseInt(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Webhooks Enabled</h4>
                          <p className="text-sm text-muted-foreground">Enable webhook notifications</p>
                        </div>
                        <Switch
                          checked={settings.webhooksEnabled}
                          onCheckedChange={(checked) => handleChange("webhooksEnabled", checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Third-party Integrations</h4>
                          <p className="text-sm text-muted-foreground">Allow external integrations</p>
                        </div>
                        <Switch
                          checked={settings.thirdPartyIntegrations}
                          onCheckedChange={(checked) => handleChange("thirdPartyIntegrations", checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-green-500" />
                      File Upload Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                        <Input 
                          id="maxFileSize" 
                          type="number"
                          value={settings.maxFileSize}
                          onChange={(e) => handleChange("maxFileSize", parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
                        <Input 
                          id="allowedFileTypes" 
                          value={settings.allowedFileTypes}
                          onChange={(e) => handleChange("allowedFileTypes", e.target.value)}
                          placeholder="pdf,doc,docx,jpg,png"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Virus Scan Enabled</h4>
                        <p className="text-sm text-muted-foreground">Scan uploaded files for viruses</p>
                      </div>
                      <Switch
                        checked={settings.virusScanEnabled}
                        onCheckedChange={(checked) => handleChange("virusScanEnabled", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-orange-500" />
                      Performance Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Cache Enabled</h4>
                          <p className="text-sm text-muted-foreground">Enable application caching</p>
                        </div>
                        <Switch
                          checked={settings.cacheEnabled}
                          onCheckedChange={(checked) => handleChange("cacheEnabled", checked)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="cacheDuration">Cache Duration (seconds)</Label>
                        <Input 
                          id="cacheDuration" 
                          type="number"
                          value={settings.cacheDuration}
                          onChange={(e) => handleChange("cacheDuration", parseInt(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="maxConcurrentUsers">Max Concurrent Users</Label>
                        <Input 
                          id="maxConcurrentUsers" 
                          type="number"
                          value={settings.maxConcurrentUsers}
                          onChange={(e) => handleChange("maxConcurrentUsers", parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 sticky bottom-4 bg-white p-4 rounded-lg shadow-lg border">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Changes
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}