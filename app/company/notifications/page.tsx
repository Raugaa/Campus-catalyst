import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Users, Briefcase, AlertCircle, CheckCircle, TrendingUp } from "lucide-react"

export default function CompanyNotifications() {
  const notifications = [
    {
      id: 1,
      type: "application",
      title: "New Application Received",
      message: "Sarah Johnson applied for Software Engineering Intern position",
      time: "30 minutes ago",
      read: false,
      icon: <Users className="w-4 h-4 text-blue-500" />,
      priority: "high",
      student: "Sarah Johnson",
      position: "Software Engineering Intern",
    },
    {
      id: 2,
      type: "application",
      title: "Application Withdrawn",
      message: "Michael Chen withdrew his application for Data Science Intern position",
      time: "2 hours ago",
      read: false,
      icon: <AlertCircle className="w-4 h-4 text-orange-500" />,
      priority: "medium",
      student: "Michael Chen",
      position: "Data Science Intern",
    },
    {
      id: 3,
      type: "interview",
      title: "Interview Completed",
      message: "Interview with Emily Rodriguez for Frontend Developer Intern has been completed",
      time: "4 hours ago",
      read: true,
      icon: <CheckCircle className="w-4 h-4 text-green-500" />,
      priority: "medium",
      student: "Emily Rodriguez",
      position: "Frontend Developer Intern",
    },
    {
      id: 4,
      type: "job",
      title: "Job Post Expiring Soon",
      message: "Your Backend Developer Intern posting expires in 3 days",
      time: "1 day ago",
      read: true,
      icon: <Briefcase className="w-4 h-4 text-red-500" />,
      priority: "high",
      position: "Backend Developer Intern",
    },
    {
      id: 5,
      type: "analytics",
      title: "Weekly Application Report",
      message: "You received 23 new applications this week, up 15% from last week",
      time: "2 days ago",
      read: true,
      icon: <TrendingUp className="w-4 h-4 text-purple-500" />,
      priority: "low",
    },
  ]

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <DashboardLayout userRole="company">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with applications and recruitment activities</p>
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
            <TabsTrigger value="jobs">Job Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  All Notifications
                </CardTitle>
                <CardDescription>Complete notification history for your company</CardDescription>
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
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
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
                <CardDescription>Notifications requiring your attention</CardDescription>
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
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Mark as Read
                            </Button>
                          </div>
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
                <CardTitle>Application Notifications</CardTitle>
                <CardDescription>Updates related to student applications</CardDescription>
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
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={`/placeholder-40x40.png?height=40&width=40&text=${notification.student?.[0] || "U"}`}
                        />
                        <AvatarFallback>{notification.student?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground mb-1">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Job Post Notifications</CardTitle>
                <CardDescription>Updates about your job postings and recruitment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications
                  .filter((n) => n.type === "job" || n.type === "analytics")
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
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                          {notification.type === "job" && (
                            <Button size="sm" variant="outline">
                              Manage Job Post
                            </Button>
                          )}
                        </div>
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