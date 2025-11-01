import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface Activity {
  type: "project" | "member";
  title: string;
  time: string;
}

export default function ActivityFeed() {
  const activities: Activity[] = [
    { type: "project", title: "E-Commerce Platform launched", time: "2 hours ago" },
    { type: "member", title: "Alex Chen joined the team", time: "5 hours ago" },
    { type: "project", title: "Mobile App update deployed", time: "1 day ago" },
    { type: "member", title: "Sarah promoted to Lead Developer", time: "2 days ago" },
  ];

  return (
    <Card className="glass-morphic overflow-visible">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3" data-testid={`activity-${index}`}>
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{activity.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
