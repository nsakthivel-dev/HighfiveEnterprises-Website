import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

type Activity = {
  id: string;
  type: "project" | "member" | "announcement" | string;
  title: string;
  created_at?: string;
};

function timeAgo(iso?: string) {
  if (!iso) return "";
  const now = new Date();
  const then = new Date(iso);
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000);
  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.345, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];
  let duration = diff;
  let unit: Intl.RelativeTimeFormatUnit = "second";
  for (const [step, u] of units) {
    if (duration < step) { unit = u; break; }
    duration = Math.floor(duration / step);
    unit = u;
  }
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  return rtf.format(-duration, unit);
}

export default function ActivityFeed() {
  const { data: activities = [] } = useQuery<Activity[]>({
    queryKey: ["activity"],
    queryFn: async () => {
      const r = await fetch("/api/activity");
      if (!r.ok) throw new Error("Failed to load activity");
      return r.json();
    },
  });

  return (
    <Card className="glass-morphic overflow-visible">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 && (
            <div className="text-sm text-muted-foreground">No recent activity yet.</div>
          )}
          {activities.map((activity, index) => (
            <div key={activity.id ?? index} className="flex items-start gap-3" data-testid={`activity-${index}`}>
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{activity.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {timeAgo(activity.created_at)}
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
