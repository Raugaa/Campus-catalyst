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
import { 
  User, 
  Key, 
  Bell, 
  Shield, 
  Database,
  Save,
  RotateCcw,
  CheckCircle
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
    
    // Security settings
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: false,
    
    // System configuration
    maintenanceMode: false,
    emailNotifications: true,
    sessionTimeout: 30
  }

  const [settings, setSettings] = useState(initialSettings)
  const [activeTab, setActiveTab] = useState("profile")
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (field: string, value: string | boolean | number) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // Handle save settings logic
    console.log("Settings saved:", settings)
    
    // Show success message
    setShowSuccess(true)
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false)
    }, 3000)
    
    // In a real app, this would call an API to save the settings
    alert("Settings saved successfully!")
  }

  const handleReset = () => {
    // Reset all settings to initial values
    setSettings(initialSettings)
    console.log("Settings reset")
    alert("Settings reset to default values")
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              System
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-yellow-500" />
                    Security Settings
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
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => handleChange("twoFactorAuth", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-purple-500" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>Configure how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleChange("emailNotifications", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">SMS Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                    <Switch disabled />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Push Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                    </div>
                    <Switch disabled />
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">Notification Types</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">System Updates</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Security Alerts</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">New Registrations</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Configuration */}
            <TabsContent value="system">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-green-500" />
                    System Configuration
                  </CardTitle>
                  <CardDescription>Global system settings and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Maintenance Mode</h4>
                      <p className="text-sm text-muted-foreground">Temporarily disable access to the platform</p>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => handleChange("maintenanceMode", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Send system notifications via email</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleChange("emailNotifications", checked)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input 
                      id="sessionTimeout" 
                      type="number" 
                      value={settings.sessionTimeout}
                      onChange={(e) => handleChange("sessionTimeout", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">Data Retention</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="logsRetention">Logs (days)</Label>
                        <Input id="logsRetention" type="number" defaultValue="90" />
                      </div>
                      <div>
                        <Label htmlFor="auditRetention">Audit Trail (days)</Label>
                        <Input id="auditRetention" type="number" defaultValue="365" />
                      </div>
                      <div>
                        <Label htmlFor="backupRetention">Backups (days)</Label>
                        <Input id="backupRetention" type="number" defaultValue="30" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Changes
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}