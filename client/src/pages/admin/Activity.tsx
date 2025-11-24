import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";

async function api<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...init });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

type ActivityType = {
    id: string;
    title: string;
    type: string;
};

const Activity = () => {
    const qc = useQueryClient();
    const [activityForm, setActivityForm] = useState({ type: "project", title: "" });
    const [addingActivity, setAddingActivity] = useState(false);
    const { data: activity = [] } = useQuery<ActivityType[]>({queryKey: ["activity"],queryFn: () => api<ActivityType[]>("/api/activity"), });
    const addActivity = useMutation({
        mutationFn: (payload: { type: string, title: string }) => api<any>("/api/activity", { method: "POST", body: JSON.stringify(payload) }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["activity"] }),
    });
    const deleteActivity = useMutation({
        mutationFn: (id: string) => api<void>(`/api/activity/${id}`, { method: "DELETE" }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["activity"] }),
    });

    return (
        <AdminLayout title="Activity" description="Manage activity updates">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">All Activities</h2>
            <Button size="sm" onClick={() => setAddingActivity(true)}>Add Activity</Button>
          </div>
          <div className="space-y-3">
            {activity.length === 0 ? (
              <div className="border rounded-lg bg-background p-8 text-center text-muted-foreground">
                <p className="text-sm">No activities yet. Add your first activity!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activity.map((activity, index) => (
                  <div 
                    key={activity.id} 
                    className={`
                      group relative p-4 rounded-lg border transition-all duration-300
                      ${index % 2 === 0 
                        ? 'bg-gradient-to-r from-background to-muted/30 hover:from-muted/40 hover:to-muted/50' 
                        : 'bg-gradient-to-r from-muted/20 to-background hover:from-muted/30 hover:to-muted/40'
                      }
                      hover:shadow-md hover:scale-[1.01] hover:border-primary/30
                    `}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className={`
                            w-2 h-2 rounded-full
                            ${activity.type === 'project' ? 'bg-blue-500' : ''}
                            ${activity.type === 'member' ? 'bg-green-500' : ''}
                            ${activity.type === 'announcement' ? 'bg-orange-500' : ''}
                          `} />
                          <span className="font-semibold text-sm block truncate group-hover:text-primary transition-colors">
                            {activity.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`
                            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                            ${activity.type === 'project' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : ''}
                            ${activity.type === 'member' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : ''}
                            ${activity.type === 'announcement' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' : ''}
                          `}>
                            {activity.type}
                          </span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteActivity.mutate(activity.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {addingActivity && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setAddingActivity(false)}>
            <div className="bg-card p-5 rounded-lg shadow-lg w-full max-w-md space-y-3" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold">Add New Activity</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="activity-type" className="text-sm">Type</Label>
                  <select id="activity-type" className="w-full h-9 rounded-md border bg-background px-3 text-sm" value={activityForm.type} onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value })}>
                    <option value="project">Project</option>
                    <option value="member">Member</option>
                    <option value="announcement">Announcement</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="activity-title" className="text-sm">Title</Label>
                  <Input id="activity-title" className="h-9 text-sm" placeholder="What happened?" value={activityForm.title} onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" disabled={!activityForm.title.trim() || addActivity.isPending} onClick={() => { addActivity.mutate({ type: activityForm.type, title: activityForm.title.trim() }, { onSuccess: () => setAddingActivity(false) }); }}>Add</Button>
                <Button size="sm" variant="outline" onClick={() => setAddingActivity(false)}>Cancel</Button>
              </div>
            </div>
          </div>
          )}
        </AdminLayout>
      )
}

export default Activity;