import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, XCircle, Calendar, MessageSquare, FileText } from "lucide-react"

interface TimelineEvent {
  id: string
  status: string
  title: string
  description: string
  date: string
  time: string
  type: "success" | "pending" | "rejected" | "info"
  actor?: string
}

interface ApplicationTimelineProps {
  events: TimelineEvent[]
}

export function ApplicationTimeline({ events }: ApplicationTimelineProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "info":
        return <FileText className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (type: string) => {
    switch (type) {
      case "success":
        return "default"
      case "pending":
        return "secondary"
      case "rejected":
        return "destructive"
      case "info":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {events.map((event, index) => (
            <div key={event.id} className="flex gap-4">
              {/* Timeline Icon */}
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 bg-background">
                  {getIcon(event.type)}
                </div>
                {index < events.length - 1 && <div className="w-px h-12 bg-border mt-2" />}
              </div>

              {/* Event Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{event.title}</h4>
                  <Badge variant={getStatusColor(event.type)}>{event.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{event.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {event.date} at {event.time}
                  </div>
                  {event.actor && (
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      by {event.actor}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
