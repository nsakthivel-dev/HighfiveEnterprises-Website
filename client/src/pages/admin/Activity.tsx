import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Briefcase, Users, Megaphone, Trash2, Plus, Sparkles, Clock } from "lucide-react";

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

    const getActivityIcon = (type: string) => {
      switch (type) {
        case 'project':
          return <Briefcase className="w-4 h-4" />;
        case 'member':
          return <Users className="w-4 h-4" />;
        case 'announcement':
          return <Megaphone className="w-4 h-4" />;
        default:
          return <Sparkles className="w-4 h-4" />;
      }
    };

    const getActivityColor = (type: string) => {
      switch (type) {
        case 'project':
          return 'blue';
        case 'member':
          return 'green';
        case 'announcement':
          return 'orange';
        default:
          return 'gray';
      }
    };

    return (
        <AdminLayout title="Activity" description="Manage activity updates">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Activity Feed</h2>
                <p className="text-sm text-muted-foreground">Total: {activity.length} activities</p>
              </div>
            </div>
            <Button size="default" onClick={() => setAddingActivity(true)} className="shadow-lg hover:shadow-xl transition-shadow">
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          </div>

          {/* Activity List */}
          <div className="space-y-4">
            {activity.length === 0 ? (
              <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-border bg-gradient-to-br from-background via-muted/5 to-muted/10 p-12 text-center">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] dark:bg-grid-slate-700/25" />
                <div className="relative">
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-muted-foreground/40" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Activities Yet</h3>
                  <p className="text-sm text-muted-foreground mb-6">Start by adding your first activity to keep your team informed!</p>
                  <Button onClick={() => setAddingActivity(true)} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Activity
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {activity.map((activity, index) => {
                  const color = getActivityColor(activity.type);
                  return (
                    <div 
                      key={activity.id} 
                      className="group relative rounded-xl border bg-card hover:shadow-lg transition-all duration-300 overflow-hidden"
                    >
                      {/* Gradient Accent Bar */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${
                        color === 'blue' ? 'from-blue-400 via-blue-500 to-blue-600' :
                        color === 'green' ? 'from-green-400 via-green-500 to-green-600' :
                        color === 'orange' ? 'from-orange-400 via-orange-500 to-orange-600' :
                        'from-gray-400 via-gray-500 to-gray-600'
                      }`} />
                      
                      <div className="flex items-start gap-4 p-5 pl-6">
                        {/* Icon Circle */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                          color === 'blue' ? 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' :
                          color === 'green' ? 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400' :
                          color === 'orange' ? 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400' :
                          'bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400'
                        }`}>
                          {getActivityIcon(activity.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors line-clamp-2">
                              {activity.title}
                            </h3>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="opacity-0 group-hover:opacity-100 transition-all text-destructive hover:text-destructive hover:bg-destructive/10 -mt-1 -mr-2"
                              onClick={() => deleteActivity.mutate(activity.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="secondary" 
                              className={`capitalize font-medium ${
                                color === 'blue' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20' :
                                color === 'green' ? 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20' :
                                color === 'orange' ? 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20' :
                                'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20'
                              }`}
                            >
                              {activity.type}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Hover Background Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add Activity Modal */}
          {addingActivity && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setAddingActivity(false)}>
            <div className="bg-card p-6 rounded-xl shadow-2xl w-full max-w-md space-y-5 border animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Add New Activity</h3>
                  <p className="text-sm text-muted-foreground">Create a new activity update</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="activity-type" className="text-sm font-medium">Activity Type</Label>
                  <select 
                    id="activity-type" 
                    className="w-full h-10 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                    value={activityForm.type} 
                    onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value })}
                  >
                    <option value="project">📊 Project Update</option>
                    <option value="member">👥 Team Member</option>
                    <option value="announcement">📢 Announcement</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activity-title" className="text-sm font-medium">Activity Title</Label>
                  <Input 
                    id="activity-title" 
                    className="h-10 text-sm" 
                    placeholder="What's happening?" 
                    value={activityForm.title} 
                    onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">This will be visible to all visitors</p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button 
                  className="flex-1"
                  disabled={!activityForm.title.trim() || addActivity.isPending} 
                  onClick={() => { 
                    addActivity.mutate({ type: activityForm.type, title: activityForm.title.trim() }, { 
                      onSuccess: () => {
                        setAddingActivity(false);
                        setActivityForm({ type: "project", title: "" });
                      }
                    }); 
                  }}
                >
                  {addActivity.isPending ? 'Adding...' : 'Add Activity'}
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setAddingActivity(false)}>Cancel</Button>
              </div>
            </div>
          </div>
          )}
        </AdminLayout>
      )
}

export default Activity;