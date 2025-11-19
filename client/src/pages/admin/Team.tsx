import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import FileUpload from "@/components/FileUpload";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import avatar1 from "@assets/generated_images/Team_member_portrait_1_7d29333a.png";
import avatar2 from "@assets/generated_images/Team_member_portrait_2_8107c9e7.png";
import avatar3 from "@assets/generated_images/Team_member_portrait_3_ca1ed7e2.png";
import avatar4 from "@assets/generated_images/Team_member_portrait_4_adb08dec.png";

async function api<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...init });
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`API Error [${url}]:`, errorText);
      let errorMessage = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorText;
      } catch (e) {
        // If not JSON, use the text as is
      }
      throw new Error(errorMessage);
    }
    return res.json();
  }

  type TeamMember = {
    id: string;
    name: string;
    role: string;
    avatar_url?: string | null;
    bio?: string | null;
    email?: string | null;
    linkedin?: string | null;
    status?: "Active" | "Alumni" | "Mentor" | null;
    created_at?: string;
  };

const Team = () => {
    const qc = useQueryClient();
    const { data: team = [] } = useQuery<TeamMember[], Error>({
        queryKey: ["team"],
        queryFn: () => api<TeamMember[]>("/api/team"),
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
      });
    const addMember = useMutation({
        mutationFn: (payload: Partial<TeamMember>) => {
          console.log("Adding member with payload:", payload);
          return api<TeamMember>("/api/team", {
            method: "POST",
            body: JSON.stringify({
              name: (payload.name || "").trim(),
              role: (payload.role || "").trim(),
              avatar_url: payload.avatar_url || null,
              bio: payload.bio || null,
              email: payload.email || null,
              linkedin: payload.linkedin || null,
              status: payload.status || "Active",
            }),
          });
        },
        onSuccess: () => {
          console.log("Member added successfully");
          qc.invalidateQueries({ queryKey: ["team"] });
        },
        onError: (error: Error) => {
          console.error("Error adding member:", error.message);
          alert(`Failed to add member: ${error.message}`);
        },
      });
      const updateMember = useMutation({
        mutationFn: (payload: { id: string } & Partial<TeamMember>) => api<TeamMember>(`/api/team/${payload.id}`, {
          method: "PUT",
          body: JSON.stringify({
            name: (payload.name || "").trim(),
            role: (payload.role || "").trim(),
            avatar_url: payload.avatar_url || null,
            bio: payload.bio || null,
            email: payload.email || null,
            linkedin: payload.linkedin || null,
            status: payload.status || "Active",
          }),
        }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["team"] }),
      });
      const deleteMember = useMutation({
        mutationFn: (id: string) => api<void>(`/api/team/${id}`, { method: "DELETE" }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["team"] }),
      });

      const [memberForm, setMemberForm] = useState<Partial<TeamMember>>({
        name: "",
        role: "",
        avatar_url: "",
        bio: "",
        email: "",
        linkedin: "",
        status: "Active",
      });

      const [editingMember, setEditingMember] = useState<string | "new" | null>(null);
      const canSubmitMember = useMemo(() => !!memberForm.name?.trim() && !!memberForm.role?.trim(), [memberForm]);

    return (
        <AdminLayout title="Team">
        <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Manage Team</h2>
          <Button onClick={() => setEditingMember("new")}>Add Member</Button>
        </div>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.map((member) => (
            <Card key={member.id}>
              <img src={member.avatar_url ?? "/placeholder.svg"} alt={member.name} className="rounded-full h-24 w-24 mx-auto" />
              <h3 className="font-bold text-lg text-center mt-4">{member.name}</h3>
              <p className="text-sm text-muted-foreground text-center">{member.role}</p>
              <div className="flex gap-2 mt-4 justify-center">
                <Button size="sm" variant="outline" onClick={() => {setEditingMember(member.id); setMemberForm(member)}}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => deleteMember.mutate(member.id)}>Delete</Button>
              </div>
            </Card>
          ))}
        </div>

        {editingMember && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditingMember(null)}>
          <div className="bg-card rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">{editingMember === "new" ? "Add New Team Member" : "Edit Team Member"}</h2>
              <Button variant="ghost" size="icon" onClick={() => setEditingMember(null)} aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="p-6 space-y-6">
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-muted-foreground">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="member-name" className="flex items-center gap-1">
                        Name <span className="text-destructive">*</span>
                      </Label>
                      <Input 
                        id="member-name" 
                        placeholder="Enter full name"
                        value={memberForm.name || ""} 
                        onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="member-role" className="flex items-center gap-1">
                        Role <span className="text-destructive">*</span>
                      </Label>
                      <Input 
                        id="member-role" 
                        placeholder="e.g., Senior Developer, Designer"
                        value={memberForm.role || ""} 
                        onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })} 
                      />
                    </div>
                  </div>
                </div>

                {/* Profile Photo Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-muted-foreground">Profile Photo</h3>
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <img 
                          src={memberForm.avatar_url || "/placeholder.svg"} 
                          alt="Preview" 
                          className="w-24 h-24 rounded-full object-cover border-2 border-border"
                        />
                      </div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <FileUpload
                        label="Upload new photo"
                        currentValue={memberForm.avatar_url || ""}
                        onFileSelect={() => {}}
                        onFileUpload={(url) => setMemberForm({ ...memberForm, avatar_url: url })}
                      />
                      <div className="space-y-2">
                        <Label>Or choose a preset avatar:</Label>
                        <div className="grid grid-cols-4 gap-2">
                          {[avatar1, avatar2, avatar3, avatar4].map((avatar, index) => (
                            <button
                              key={index}
                              type="button"
                              aria-label={`Select avatar ${index + 1}`}
                              onClick={() => setMemberForm({ ...memberForm, avatar_url: avatar })}
                              className={`relative rounded-full overflow-hidden border-2 transition-all ${
                                memberForm.avatar_url === avatar 
                                  ? 'border-primary ring-2 ring-primary ring-offset-2' 
                                  : 'border-border hover:border-primary'
                              }`}
                            >
                              <img src={avatar} alt={`Avatar ${index + 1}`} className="w-16 h-16 object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>



                {/* Bio Section */}
                <div className="space-y-2">
                  <Label htmlFor="member-bio">Bio</Label>
                  <textarea
                    id="member-bio"
                    maxLength={200}
                    placeholder="Write a brief bio about the team member (150-200 characters)"
                    value={memberForm.bio || ""}
                    onChange={(e) => setMemberForm({ ...memberForm, bio: e.target.value })}
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    {memberForm.bio?.length || 0}/200 characters
                  </p>
                </div>



                {/* Contact Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-muted-foreground">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="member-email">Email Address</Label>
                      <Input 
                        id="member-email" 
                        type="email" 
                        placeholder="name@example.com"
                        value={memberForm.email || ""} 
                        onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="member-linkedin">LinkedIn Profile</Label>
                      <Input 
                        id="member-linkedin" 
                        type="url" 
                        placeholder="https://linkedin.com/in/username"
                        value={memberForm.linkedin || ""} 
                        onChange={(e) => setMemberForm({ ...memberForm, linkedin: e.target.value })} 
                      />
                    </div>
                  </div>
                </div>

                {/* Status Section */}
                <div className="space-y-2">
                  <Label>Member Status</Label>
                  <Select
                    value={memberForm.status || "Active"}
                    onValueChange={(v) => setMemberForm({ ...memberForm, status: v as TeamMember["status"] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Alumni">Alumni</SelectItem>
                      <SelectItem value="Mentor">Mentor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t bg-muted/50">
              <p className="text-sm text-muted-foreground">
                <span className="text-destructive">*</span> Required fields
              </p>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setEditingMember(null)}
                >
                  Cancel
                </Button>
                <Button 
                  disabled={!canSubmitMember || (editingMember === "new" ? addMember.isPending : updateMember.isPending)} 
                  onClick={() => {
                    if (editingMember === "new") {
                      addMember.mutate(memberForm, { onSuccess: () => setEditingMember(null) });
                    } else {
                      updateMember.mutate({ id: editingMember!, ...memberForm }, { onSuccess: () => setEditingMember(null) });
                    }
                  }}
                >
                  {editingMember === "new" ? "Add Member" : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
      </AdminLayout>
    )
}

export default Team;