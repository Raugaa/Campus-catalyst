import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Users, CheckCircle, AlertCircle, FileText, Calendar, TrendingUp } from "lucide-react"

export default function FacultyNotifications() {
  const notifications = [
    {
      id: 1,
      type: "approval",
      title: "New Application Pending Approval",
      message: "Rahul Sharma's application for Software Development Intern at TechCorp requires your approval",
      time: "1 hour ago",
      read: false,
      icon: <FileText className="w-4 h-4 text-blue-500" />,
      priority: "high",
      student: "Rahul Sharma",
      company: "TechCorp Solutions",
    },
    {
      id: 2,
      type: "approval",
      title: "Urgent: Application Approval Required",
      message:
        "Priya Patel's application deadline is tomorrow. Please review and approve her Data Science Intern application",
      time: "3 hours ago",
      read: false,
      icon: <AlertCircle className="w-4 h-4 text-red-500" />,
      priority: "urgent",
      student: "Priya Patel",
      company: "DataFlow Analytics",
    },
    {
      id: 3,
      type: "mentee",
      title: "Mentee Profile Updated",
      message: "Arjun Kumar has updated his profile and added new skills to his portfolio",
      time: "5 hours ago",
      read: true,
      icon: <Users className="w-4 h-4 text-green-500" />,
      priority: "medium",
      student: "Arjun Kumar",
    },
    {
      id: 4,
      type: "interview",
      title: "Interview Scheduled",
      message: "Interview scheduled for your mentee Sneha Reddy with InnovateLabs on Dec 18, 2024 at 3:00 PM",
      time: "1 day ago",
      read: true,
      icon: <Calendar className="w-4 h-4 text-purple-500" />,
      priority: "medium",
      student: "Sneha Reddy",
      company: "InnovateLabs",
    },
    {
      id: 5,
      type: "success",
      title: "Application Approved Successfully",
      message: "Your approval for Vikram Singh's application to TechStart has been processed",
      time: "2 days ago",
      read: true,
      icon: <CheckCircle className="w-4 h-4 text-green-500" />,
      priority: "low",
      student: "Vikram Singh",
      company: "TechStart",
    },
    {
      id: 6,
      type: "report",
      title: "Monthly Mentoring Report Available",
      message: "Your December mentoring report is ready for review. 18 students, 12 approvals processed",
      time: "3 days ago",
      read: true,
      icon: <TrendingUp className="w-4 h-4 text-blue-500" />,
      priority: "low",
    },
  ]

  const unreadCount = notifications.filter((n) => !n.read).length
  const urgentCount = notifications.filter((n) => n.priority === "urgent").length

  return (
    <DashboardLayout userRole="faculty">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with mentee activities and approval requests</p>
          </div>
          <div className="flex items-center gap-2">
            {urgentCount > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                {urgentCount} urgent
              </Badge>
            )}
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
            <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
            <TabsTrigger value="mentees">Mentee Updates</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  All Notifications
                </CardTitle>
                <CardDescription>Complete notification history for your mentoring activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border transition-colors hover:bg-muted/50 ${
                      !notification.read ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800" : ""
                    } ${
                      notification.priority === "urgent"
                        ? "border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-950/20"
                        : ""
                    }`}
                  >
                    <div className="mt-1">{notification.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-medium">{notification.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              notification.priority === "urgent"
                                ? "destructive"
                                : notification.priority === "high"
                                  ? "destructive"
                                  : notification.priority === "medium"
                                    ? "default"
                                    : "secondary"
                            }
                            className={`text-xs ${notification.priority === "urgent" ? "animate-pulse" : ""}`}
                          >
                            {notification.priority}
                          </Badge>
                          {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                        {notification.type === "approval" && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Reject
                            </Button>
                            <Button size="sm">Approve</Button>
                          </div>
                        )}
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
                      className={`flex items-start gap-4 p-4 rounded-lg border ${
                        notification.priority === "urgent"
                          ? "border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-950/20"
                          : "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                      }`}
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={`/placeholder-40x40.png?height=40&width=40&text=${notification.student?.[0] || "N"}`}
                        />
                        <AvatarFallback>{notification.student?.[0] || "N"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-medium">{notification.title}</h4>
                          <Badge
                            variant={notification.priority === "urgent" ? "destructive" : "default"}
                            className={`text-xs ${notification.priority === "urgent" ? "animate-pulse" : ""}`}
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
                            {notification.type === "approval" && <Button size="sm">Review Application</Button>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Student applications awaiting your approval</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications
                  .filter((n) => n.type === "approval")
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-4 p-4 rounded-lg border ${
                        notification.priority === "urgent"
                          ? "border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-950/20"
                          : !notification.read
                            ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                            : ""
                      }`}
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={`/placeholder-40x40.png?height=48&width=48&text=${notification.student?.[0] || "S"}`}
                        />
                        <AvatarFallback>{notification.student?.[0] || "S"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{notification.student}</h4>
                            <p className="text-sm text-muted-foreground">{notification.company}</p>
                          </div>
                          <Badge
                            variant={notification.priority === "urgent" ? "destructive" : "default"}
                            className={`text-xs ${notification.priority === "urgent" ? "animate-pulse" : ""}`}
                          >
                            {notification.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                            <Button size="sm" variant="outline">
                              Reject
                            </Button>
                            <Button size="sm">Approve</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mentees" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mentee Updates</CardTitle>
                <CardDescription>Updates and activities from your assigned students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications
                  .filter((n) => n.type === "mentee" || n.type === "interview" || n.type === "success")
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
                          src={`/placeholder-40x40.png?height=40&width=40&text=${notification.student?.[0] || "M"}`}
                        />
                        <AvatarFallback>{notification.student?.[0] || "M"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                          {notification.student && (
                            <Button size="sm" variant="outline">
                              View Student Profile
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
