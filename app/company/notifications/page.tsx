"use client"

import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Users, Briefcase, AlertCircle, CheckCircle, TrendingUp, Check, X, Eye, Clock } from "lucide-react"
import { useState } from "react"

interface Notification {
  id: number
  type: "application" | "interview" | "job" | "analytics"
  title: string
  message: string
  time: string
  read: boolean
  icon: React.ReactNode
  priority: "high" | "medium" | "low"
  student?: string
  position?: string
  actionable?: boolean
}

export default function CompanyNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
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
      actionable: true,
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
      actionable: false,
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
      actionable: true,
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
      actionable: true,
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
      actionable: false,
    },
    {
      id: 6,
      type: "application",
      title: "Application Status Updated",
      message: "David Wilson's application status was changed to 'Under Review'",
      time: "3 hours ago",
      read: false,
      icon: <Clock className="w-4 h-4 text-blue-500" />,
      priority: "medium",
      student: "David Wilson",
      position: "Marketing Intern",
      actionable: true,
    },
    {
      id: 7,
      type: "interview",
      title: "Interview Scheduled",
      message: "Interview scheduled with Alex Thompson for Product Manager position",
      time: "5 hours ago",
      read: false,
      icon: <CheckCircle className="w-4 h-4 text-green-500" />,
      priority: "high",
      student: "Alex Thompson",
      position: "Product Manager",
      actionable: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  // Mark single notification as read
  const markAsRead = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  // Delete notification
  const deleteNotification = (notificationId: number) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    )
  }

  // Toggle read status
  const toggleReadStatus = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: !notification.read }
          : notification
      )
    )
  }

  // Get filtered notifications based on tab
  const getFilteredNotifications = (filter: string) => {
    switch (filter) {
      case "unread":
        return notifications.filter(n => !n.read)
      case "applications":
        return notifications.filter(n => n.type === "application" || n.type === "interview")
      case "jobs":
        return notifications.filter(n => n.type === "job" || n.type === "analytics")
      default:
        return notifications
    }
  }

  // Get notification action text
  const getActionText = (notification: Notification) => {
    switch (notification.type) {
      case "application":
        return "View Application"
      case "interview":
        return "View Interview"
      case "job":
        return "Manage Job Post"
      case "analytics":
        return "View Report"
      default:
        return "View Details"
    }
  }

  // Render notification card
  const renderNotificationCard = (notification: Notification) => (
    <div
      key={notification.id}
      className={`group flex items-start gap-4 p-4 rounded-lg border transition-all hover:shadow-md ${
        !notification.read 
          ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 shadow-sm" 
          : "hover:bg-muted/50"
      }`}
    >
      {/* Avatar or Icon */}
      {notification.student ? (
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage
            src={`/placeholder-40x40.png?height=40&width=40&text=${notification.student[0]}`}
          />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            {notification.student[0]}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className="mt-1 flex-shrink-0">{notification.icon}</div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <h4 className={`font-medium ${!notification.read ? "font-semibold" : ""}`}>
            {notification.title}
          </h4>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                notification.priority === "high"
                  ? "destructive"
                  : notification.priority === "medium"
                    ? "default"
                    : "secondary"
              }
              className="text-xs flex-shrink-0"
            >
              {notification.priority}
            </Badge>
            {!notification.read && (
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
          {notification.message}
        </p>

        {notification.position && (
          <Badge variant="outline" className="text-xs mb-2">
            {notification.position}
          </Badge>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{notification.time}</p>
          
          {/* Action buttons - show on hover or if unread */}
          <div className={`flex gap-2 transition-opacity ${
            !notification.read ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}>
            {!notification.read && (
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => markAsRead(notification.id)}
                className="h-7 px-2 text-xs"
              >
                <Check className="w-3 h-3 mr-1" />
                Mark Read
              </Button>
            )}
            
            {notification.read && (
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => toggleReadStatus(notification.id)}
                className="h-7 px-2 text-xs"
              >
                <Eye className="w-3 h-3 mr-1" />
                Mark Unread
              </Button>
            )}

            {notification.actionable && (
              <Button 
                size="sm" 
                variant="outline"
                className="h-7 px-2 text-xs"
                onClick={() => console.log(`Action for notification ${notification.id}`)}
              >
                {getActionText(notification)}
              </Button>
            )}

            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => deleteNotification(notification.id)}
              className="h-7 px-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <DashboardLayout userRole="company">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with applications and recruitment activities</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1">
              {unreadCount} unread
            </Badge>
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={markAllAsRead}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Mark All as Read
              </Button>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Total</p>
                  <p className="text-2xl font-bold">{notifications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Unread</p>
                  <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Applications</p>
                  <p className="text-2xl font-bold text-green-600">
                    {notifications.filter(n => n.type === "application" || n.type === "interview").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">High Priority</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {notifications.filter(n => n.priority === "high").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="flex items-center gap-2">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex items-center gap-2">
              Unread ({unreadCount})
              {unreadCount > 0 && (
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </TabsTrigger>
            <TabsTrigger value="applications">
              Applications ({notifications.filter(n => n.type === "application" || n.type === "interview").length})
            </TabsTrigger>
            <TabsTrigger value="jobs">
              Job Posts ({notifications.filter(n => n.type === "job" || n.type === "analytics").length})
            </TabsTrigger>
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
                {notifications.length > 0 ? (
                  notifications.map(renderNotificationCard)
                ) : (
                  <div className="text-center py-8">
                    <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No notifications yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-500" />
                      Unread Notifications
                    </CardTitle>
                    <CardDescription>Notifications requiring your attention</CardDescription>
                  </div>
                  {unreadCount > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={markAllAsRead}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Mark All Read
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {getFilteredNotifications("unread").length > 0 ? (
                  getFilteredNotifications("unread").map(renderNotificationCard)
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-muted-foreground">All caught up! No unread notifications.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-500" />
                  Application Notifications
                </CardTitle>
                <CardDescription>Updates related to student applications and interviews</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {getFilteredNotifications("applications").length > 0 ? (
                  getFilteredNotifications("applications").map(renderNotificationCard)
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No application notifications</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-500" />
                  Job Post Notifications
                </CardTitle>
                <CardDescription>Updates about your job postings and recruitment analytics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {getFilteredNotifications("jobs").length > 0 ? (
                  getFilteredNotifications("jobs").map(renderNotificationCard)
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No job post notifications</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}