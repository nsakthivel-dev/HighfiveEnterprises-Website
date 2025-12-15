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
    <Card className="glass-morphic overflow-visible w-full backdrop-blur-xl border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Live Activity
          </CardTitle>
          <div className="flex h-2 w-2">
            <span className="animate-ping absolute h-2 w-2 rounded-full bg-primary opacity-75"></span>
            <span className="relative h-2 w-2 rounded-full bg-primary"></span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Real-time updates from our team</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 && (
            <div className="text-center py-8">
              <HelpCircle className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No recent activity yet.</p>
            </div>
          )}
          {activities.map((activity: Activity, index: number) => (
            <div 
              key={activity.id ?? index} 
              className={`
                group relative p-4 rounded-xl border transition-all duration-300
                bg-gradient-to-br from-background/40 via-muted/20 to-muted/30
                hover:from-background/60 hover:via-muted/30 hover:to-muted/40
                hover:shadow-lg hover:scale-[1.02] hover:border-primary/40
                backdrop-blur-sm
              `}
              data-testid={`activity-${index}`}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ring-2 ring-offset-2 ring-offset-background transition-all duration-300
                  ${activity.type === 'project' ? 'bg-blue-500 ring-blue-500/30' : ''}
                  ${activity.type === 'member' ? 'bg-green-500 ring-green-500/30' : ''}
                  ${activity.type === 'announcement' ? 'bg-orange-500 ring-orange-500/30' : ''}
                  ${!['project', 'member', 'announcement'].includes(activity.type) ? 'bg-primary ring-primary/30' : ''}
                  group-hover:scale-125 group-hover:ring-4 group-hover:ring-opacity-50
                `} />
                <div className="flex-1 min-w-0 space-y-2 pr-12">
                  <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors duration-200">
                    {activity.title}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge 
                      variant="outline" 
                      className={`
                        text-xs font-medium transition-all duration-200
                        ${activity.type === 'project' ? 'border-blue-500/50 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100/50 dark:hover:bg-blue-900/50' : ''}
                        ${activity.type === 'member' ? 'border-green-500/50 text-green-600 dark:text-green-400 bg-green-50/50 dark:bg-green-950/30 hover:bg-green-100/50 dark:hover:bg-green-900/50' : ''}
                        ${activity.type === 'announcement' ? 'border-orange-500/50 text-orange-600 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-950/30 hover:bg-orange-100/50 dark:hover:bg-orange-900/50' : ''}
                        hover:scale-105 hover:shadow-sm
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
              {/* Information button for each activity - now always visible */}
              <Link href={`/contact?activity=${encodeURIComponent(activity.title)}&type=${activity.type}`}>
                <button className="absolute top-3 right-3 px-2.5 py-1 text-xs font-medium rounded-md bg-primary/15 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md">
                  Info
                </button>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}