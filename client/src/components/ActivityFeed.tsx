import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, HelpCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

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
    <Card className="glass-morphic overflow-visible w-full">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 && (
            <div className="text-sm text-muted-foreground">No recent activity yet.</div>
          )}
          {activities.map((activity, index) => (
            <div 
              key={activity.id ?? index} 
              className={`
                group relative p-4 rounded-lg border transition-all duration-300
                ${index % 2 === 0 
                  ? 'bg-gradient-to-br from-background via-muted/10 to-muted/20 hover:from-muted/20 hover:via-muted/30 hover:to-muted/40' 
                  : 'bg-gradient-to-br from-muted/15 via-background to-muted/10 hover:from-muted/25 hover:via-muted/20 hover:to-muted/35'
                }
                hover:shadow-lg hover:scale-[1.02] hover:border-primary/40
              `}
              data-testid={`activity-${index}`}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  w-3 h-3 rounded-full mt-1 flex-shrink-0 ring-2 ring-offset-2 ring-offset-background transition-all
                  ${activity.type === 'project' ? 'bg-blue-500 ring-blue-500/20' : ''}
                  ${activity.type === 'member' ? 'bg-green-500 ring-green-500/20' : ''}
                  ${activity.type === 'announcement' ? 'bg-orange-500 ring-orange-500/20' : ''}
                  ${!['project', 'member', 'announcement'].includes(activity.type) ? 'bg-primary ring-primary/20' : ''}
                  group-hover:scale-125 group-hover:ring-4
                `} />
                <div className="flex-1 min-w-0 space-y-2 pr-12">
                  <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                    {activity.title}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge 
                      variant="outline" 
                      className={`
                        text-xs font-medium transition-colors
                        ${activity.type === 'project' ? 'border-blue-500/50 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30' : ''}
                        ${activity.type === 'member' ? 'border-green-500/50 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30' : ''}
                        ${activity.type === 'announcement' ? 'border-orange-500/50 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30' : ''}
                      `}
                    >
                      {activity.type}
                    </Badge>
                    {activity.created_at && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {timeAgo(activity.created_at)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* Information button for each activity */}
              <Link href={`/contact?activity=${encodeURIComponent(activity.title)}&type=${activity.type}`}>
                <button className="absolute top-2 right-2 px-3 py-1.5 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-105 shadow-sm">
                  More info
                </button>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
