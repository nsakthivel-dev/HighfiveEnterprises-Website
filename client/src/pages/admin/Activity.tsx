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
        <AdminLayout title="Activity">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Activity</h1>
            <Button onClick={() => setAddingActivity(true)}>Add Activity</Button>
          </div>
          <Separator />
          <div className="border rounded-lg">
            <ul className="divide-y">
              {activity.map((activity) => (
                <li key={activity.id} className="p-4 flex justify-between items-center">
                  <div>
                    <span className="font-bold">{activity.title}</span>
                    <span className="text-sm text-muted-foreground ml-2">({activity.type})</span>
                  </div>
                  <Button size="sm" variant="destructive" onClick={() => deleteActivity.mutate(activity.id)}>Delete</Button>
                </li>
              ))}
            </ul>
          </div>

          {addingActivity && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setAddingActivity(false)}>
            <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold">Add Activity</h3>
              <div className="grid grid-cols-1 gap-4">
              <div>
                  <Label htmlFor="activity-type">Type</Label>
                  <select id="activity-type" className="w-full h-10 rounded-md border bg-background px-3" value={activityForm.type} onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value })}>
                    <option value="project">project</option>
                    <option value="member">member</option>
                    <option value="announcement">announcement</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="activity-title">Title</Label>
                  <Input id="activity-title" placeholder="What happened?" value={activityForm.title} onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button disabled={!activityForm.title.trim() || addActivity.isPending} onClick={() => { addActivity.mutate({ type: activityForm.type, title: activityForm.title.trim() }, { onSuccess: () => setAddingActivity(false) }); }}>Add</Button>
                <Button variant="outline" onClick={() => setAddingActivity(false)}>Cancel</Button>
              </div>
            </div>
          </div>
          )}
        </AdminLayout>
      )
}

export default Activity;