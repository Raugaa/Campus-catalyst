import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, AlertCircle, Info, Calendar, Briefcase, Users } from "lucide-react"

export default function StudentNotifications() {
  const notifications = [
    {
      id: 1,
      type: "application",
      title: "Application Status Update",
      message: "Your application for Software Engineering Intern at TechCorp has been reviewed",
      time: "2 hours ago",
      read: false,
      icon: <Briefcase className="w-4 h-4 text-blue-500" />,
      priority: "high",
    },
    {
      id: 2,
      type: "interview",
      title: "Interview Scheduled",
      message: "Interview scheduled for Data Science Intern position at DataSoft Solutions on Dec 15, 2024 at 2:00 PM",
      time: "5 hours ago",
      read: false,
      icon: <Calendar className="w-4 h-4 text-green-500" />,
      priority: "high",
    },
    {
      id: 3,
      type: "opportunity",
      title: "New Opportunity Match",
      message: "New Frontend Developer Intern position at WebFlow Agency matches your profile (95% match)",
      time: "1 day ago",
      read: true,
      icon: <Info className="w-4 h-4 text-purple-500" />,
      priority: "medium",
    },
    {
      id: 4,
      type: "profile",
      title: "Profile Completion Reminder",
      message: "Complete your profile to increase visibility to recruiters. You're 85% complete.",
      time: "2 days ago",
      read: true,
      icon: <Users className="w-4 h-4 text-orange-500" />,
      priority: "low",
    },
    {
      id: 5,
      type: "deadline",
      title: "Application Deadline Approaching",
      message: "Application deadline for Machine Learning Intern at AI Dynamics is in 3 days",
      time: "3 days ago",
      read: true,
      icon: <AlertCircle className="w-4 h-4 text-red-500" />,
      priority: "high",
    },
  ]

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <DashboardLayout userRole="student">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with your applications and opportunities</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{unreadCount} unread</Badge>
            <Button variant="outline" size="sm">
              Mark All as Read
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  All Notifications
                </CardTitle>
                <CardDescription>Your complete notification history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border transition-colors hover:bg-muted/50 ${
                      !notification.read ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800" : ""
                    }`}
                  >
                    <div className="mt-1">{notification.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-medium">{notification.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              notification.priority === "high"
                                ? "destructive"
                                : notification.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {notification.priority}
                          </Badge>
                          {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Unread Notifications</CardTitle>
                <CardDescription>Notifications that require your attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications
                  .filter((n) => !n.read)
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-4 p-4 rounded-lg border bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                    >
                      <div className="mt-1">{notification.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-medium">{notification.title}</h4>
                          <Badge
                            variant={
                              notification.priority === "high"
                                ? "destructive"
                                : notification.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {notification.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                          <Button size="sm" variant="outline">
                            Mark as Read
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Application Updates</CardTitle>
                <CardDescription>Notifications related to your job applications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications
                  .filter((n) => n.type === "application" || n.type === "interview")
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-4 p-4 rounded-lg border transition-colors hover:bg-muted/50 ${
                        !notification.read
                          ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                          : ""
                      }`}
                    >
                      <div className="mt-1">{notification.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Opportunity Alerts</CardTitle>
                <CardDescription>New opportunities and matches for your profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications
                  .filter((n) => n.type === "opportunity" || n.type === "deadline")
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-4 p-4 rounded-lg border transition-colors hover:bg-muted/50 ${
                        !notification.read
                          ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                          : ""
                      }`}
                    >
                      <div className="mt-1">{notification.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
