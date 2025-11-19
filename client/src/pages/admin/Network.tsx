import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import FileUpload from "@/components/FileUpload";
import { Edit, Plus, Save, Trash2, X } from "lucide-react";

type Collaboration = {
  id: string;
  name: string;
  description?: string | null;
  highlight?: string | null;
  logo_url?: string | null;
  link_url?: string | null;
};

type Partner = {
  id: string;
  name: string;
  role?: string | null;
  description?: string | null;
  logo_url?: string | null;
  link_url?: string | null;
};

type CollaborationInput = Omit<Collaboration, "id">;
type PartnerInput = Omit<Partner, "id">;

const emptyCollaboration: CollaborationInput = {
  name: "",
  description: "",
  highlight: "",
  logo_url: "",
  link_url: "",
};

const emptyPartner: PartnerInput = {
  name: "",
  role: "",
  description: "",
  logo_url: "",
  link_url: "",
};

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {};
  if (!(init?.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, { ...init, headers: { ...headers, ...(init?.headers as any) } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json();
}

const AdminNetwork = () => {
  const qc = useQueryClient();

  const { data: collaborations = [], isLoading: collaborationsLoading } = useQuery<Collaboration[]>({
    queryKey: ["network", "collaborations"],
    queryFn: () => api<Collaboration[]>("/api/network/collaborations"),
  });

  const { data: partners = [], isLoading: partnersLoading } = useQuery<Partner[]>({
    queryKey: ["network", "partners"],
    queryFn: () => api<Partner[]>("/api/network/partners"),
  });

  const [collaborationForm, setCollaborationForm] = useState<CollaborationInput>(emptyCollaboration);
  const [editingCollaborationId, setEditingCollaborationId] = useState<string | null>(null);

  const [partnerForm, setPartnerForm] = useState<PartnerInput>(emptyPartner);
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);

  const upsertCollaboration = useMutation({
    mutationFn: async (payload: { id?: string } & CollaborationInput) => {
      const { id, ...data } = payload;
      const body = JSON.stringify(data);
      if (id) {
        return api<Collaboration>(`/api/network/collaborations/${id}`, { method: "PUT", body });
      }
      return api<Collaboration>("/api/network/collaborations", { method: "POST", body });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["network", "collaborations"] });
      setCollaborationForm(emptyCollaboration);
      setEditingCollaborationId(null);
    },
    onError: (error: any) => {
      console.error("Failed to save collaboration", error);
      alert(`Failed to save collaboration: ${error?.message ?? error}`);
    },
  });

  const removeCollaboration = useMutation({
    mutationFn: async (id: string) => api<void>(`/api/network/collaborations/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["network", "collaborations"] }),
    onError: (error: any) => {
      console.error("Failed to delete collaboration", error);
      alert(`Failed to delete collaboration: ${error?.message ?? error}`);
    },
  });

  const upsertPartner = useMutation({
    mutationFn: async (payload: { id?: string } & PartnerInput) => {
      const { id, ...data } = payload;
      const body = JSON.stringify(data);
      if (id) {
        return api<Partner>(`/api/network/partners/${id}`, { method: "PUT", body });
      }
      return api<Partner>("/api/network/partners", { method: "POST", body });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["network", "partners"] });
      setPartnerForm(emptyPartner);
      setEditingPartnerId(null);
    },
    onError: (error: any) => {
      console.error("Failed to save partner", error);
      alert(`Failed to save partner: ${error?.message ?? error}`);
    },
  });

  const removePartner = useMutation({
    mutationFn: async (id: string) => api<void>(`/api/network/partners/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["network", "partners"] }),
    onError: (error: any) => {
      console.error("Failed to delete partner", error);
      alert(`Failed to delete partner: ${error?.message ?? error}`);
    },
  });

  const handleSubmitCollaboration = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!collaborationForm.name.trim()) {
      alert("Collaboration name is required");
      return;
    }
    upsertCollaboration.mutate({
      id: editingCollaborationId ?? undefined,
      ...collaborationForm,
    });
  };

  const handleSubmitPartner = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!partnerForm.name.trim()) {
      alert("Partner name is required");
      return;
    }
    upsertPartner.mutate({
      id: editingPartnerId ?? undefined,
      ...partnerForm,
    });
  };

  const startEditCollaboration = (item: Collaboration) => {
    setCollaborationForm({
      name: item.name ?? "",
      description: item.description ?? "",
      highlight: item.highlight ?? "",
      logo_url: item.logo_url ?? "",
      link_url: item.link_url ?? "",
    });
    setEditingCollaborationId(item.id);
  };

  const startEditPartner = (item: Partner) => {
    setPartnerForm({
      name: item.name ?? "",
      role: item.role ?? "",
      description: item.description ?? "",
      logo_url: item.logo_url ?? "",
      link_url: item.link_url ?? "",
    });
    setEditingPartnerId(item.id);
  };

  const resetCollaborationForm = () => {
    setCollaborationForm(emptyCollaboration);
    setEditingCollaborationId(null);
  };

  const resetPartnerForm = () => {
    setPartnerForm(emptyPartner);
    setEditingPartnerId(null);
  };

  return (
    <AdminLayout
      title="Our Network"
      description="Manage collaborations and official partners shown on the public Our Network page."
    >
      <div className="flex flex-col gap-8 w-full">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Badge variant="secondary">Collaborations</Badge>
              <span>Collaborated Companies</span>
            </CardTitle>
            <CardDescription>
              Create, edit, or remove companies highlighted under the "Collaborated Companies" section.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid md:grid-cols-2 gap-4" onSubmit={handleSubmitCollaboration}>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="collaboration-name">Company Name *</Label>
                <Input
                  id="collaboration-name"
                  value={collaborationForm.name}
                  onChange={(event) =>
                    setCollaborationForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  placeholder="Acme Corp"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="collaboration-highlight">Highlight</Label>
                <Input
                  id="collaboration-highlight"
                  value={collaborationForm.highlight ?? ""}
                  onChange={(event) =>
                    setCollaborationForm((prev) => ({ ...prev, highlight: event.target.value }))
                  }
                  placeholder="Innovation, AI Enablement, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="collaboration-link">External Link</Label>
                <Input
                  id="collaboration-link"
                  value={collaborationForm.link_url ?? ""}
                  onChange={(event) =>
                    setCollaborationForm((prev) => ({ ...prev, link_url: event.target.value }))
                  }
                  placeholder="https://partner.com/case-study"
                />
              </div>
              <div className="space-y-2">
                <FileUpload
                  label="Logo"
                  accept="image/*"
                  currentValue={collaborationForm.logo_url ?? ""}
                  onFileSelect={() => {}}
                  onFileUpload={(url) => setCollaborationForm((prev) => ({ ...prev, logo_url: url }))}
                />
                {collaborationForm.logo_url && (
                  <div className="mt-2">
                    <img 
                      src={collaborationForm.logo_url} 
                      alt="Logo preview" 
                      className="w-32 h-32 object-contain border rounded-lg p-2 bg-white"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="collaboration-description">Description</Label>
                <Textarea
                  id="collaboration-description"
                  value={collaborationForm.description ?? ""}
                  onChange={(event) =>
                    setCollaborationForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                  placeholder="Briefly describe the engagement and outcomes."
                  rows={4}
                />
              </div>
              <div className="flex items-center gap-3 md:col-span-2">
                <Button
                  type="submit"
                  disabled={upsertCollaboration.isPending}
                  className="inline-flex items-center gap-2"
                >
                  {editingCollaborationId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {editingCollaborationId ? "Save Changes" : "Add Collaboration"}
                </Button>
                {editingCollaborationId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetCollaborationForm}
                    className="inline-flex items-center gap-2"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </Button>
                )}
              </div>
            </form>

            <Separator className="my-6" />

            <div className="space-y-4">
              {collaborationsLoading && <p className="text-sm text-muted-foreground">Loading collaborators…</p>}
              {!collaborationsLoading && collaborations.length === 0 && (
                <p className="text-sm text-muted-foreground">No collaborations have been added yet.</p>
              )}
              {collaborations.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border rounded-lg p-4"
                >
                  <div className="flex items-start gap-4">
                    {item.logo_url && (
                      <img 
                        src={item.logo_url} 
                        alt={`${item.name} logo`}
                        className="w-16 h-16 object-contain border rounded p-1 bg-white flex-shrink-0"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.highlight ? `${item.highlight} • ` : ""}
                        {item.description || "No description provided."}
                      </p>
                      {item.link_url && (
                        <a
                          href={item.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary underline"
                        >
                          {item.link_url}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => startEditCollaboration(item)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        if (confirm(`Delete collaboration with ${item.name}?`)) {
                          removeCollaboration.mutate(item.id);
                        }
                      }}
                      disabled={removeCollaboration.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Badge variant="secondary">Partners</Badge>
              <span>Official Partners</span>
            </CardTitle>
            <CardDescription>
              Maintain the list of official partners, their role, and partnership description.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid md:grid-cols-2 gap-4" onSubmit={handleSubmitPartner}>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="partner-name">Partner Name *</Label>
                <Input
                  id="partner-name"
                  value={partnerForm.name}
                  onChange={(event) => setPartnerForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Partner Inc"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partner-role">Role or Title</Label>
                <Input
                  id="partner-role"
                  value={partnerForm.role ?? ""}
                  onChange={(event) => setPartnerForm((prev) => ({ ...prev, role: event.target.value }))}
                  placeholder="Technology Partner"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partner-link">External Link</Label>
                <Input
                  id="partner-link"
                  value={partnerForm.link_url ?? ""}
                  onChange={(event) => setPartnerForm((prev) => ({ ...prev, link_url: event.target.value }))}
                  placeholder="https://partner.com"
                />
              </div>
              <div className="space-y-2">
                <FileUpload
                  label="Logo"
                  accept="image/*"
                  currentValue={partnerForm.logo_url ?? ""}
                  onFileSelect={() => {}}
                  onFileUpload={(url) => setPartnerForm((prev) => ({ ...prev, logo_url: url }))}
                />
                {partnerForm.logo_url && (
                  <div className="mt-2">
                    <img 
                      src={partnerForm.logo_url} 
                      alt="Logo preview" 
                      className="w-32 h-32 object-contain border rounded-lg p-2 bg-white"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="partner-description">Description</Label>
                <Textarea
                  id="partner-description"
                  value={partnerForm.description ?? ""}
                  onChange={(event) =>
                    setPartnerForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                  placeholder="Outline the value and outcomes this partnership brings."
                  rows={4}
                />
              </div>
              <div className="flex items-center gap-3 md:col-span-2">
                <Button
                  type="submit"
                  disabled={upsertPartner.isPending}
                  className="inline-flex items-center gap-2"
                >
                  {editingPartnerId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {editingPartnerId ? "Save Changes" : "Add Partner"}
                </Button>
                {editingPartnerId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetPartnerForm}
                    className="inline-flex items-center gap-2"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </Button>
                )}
              </div>
            </form>

            <Separator className="my-6" />

            <div className="space-y-4">
              {partnersLoading && <p className="text-sm text-muted-foreground">Loading partners…</p>}
              {!partnersLoading && partners.length === 0 && (
                <p className="text-sm text-muted-foreground">No partners have been added yet.</p>
              )}
              {partners.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border rounded-lg p-4"
                >
                  <div className="flex items-start gap-4">
                    {item.logo_url && (
                      <img 
                        src={item.logo_url} 
                        alt={`${item.name} logo`}
                        className="w-16 h-16 object-contain border rounded p-1 bg-white flex-shrink-0"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.role ? `${item.role} • ` : ""}
                        {item.description || "No description provided."}
                      </p>
                      {item.link_url && (
                        <a
                          href={item.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary underline"
                        >
                          {item.link_url}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => startEditPartner(item)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        if (confirm(`Delete partner ${item.name}?`)) {
                          removePartner.mutate(item.id);
                        }
                      }}
                      disabled={removePartner.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminNetwork;

