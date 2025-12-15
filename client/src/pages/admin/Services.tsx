import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Code2, Palette } from "lucide-react";

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...init });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return res.json();
  }
  return undefined as T;
}

type Service = {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string | null;
  sort_order: number | null;
  is_active: boolean;
};

type ServiceFormData = {
  title: string;
  description: string;
  featuresText: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
};

const Services = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    title: "",
    description: "",
    featuresText: "",
    icon: "Code2",
    sort_order: 0,
    is_active: true,
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: () => api<Service[]>("/api/services"),
  });

  const createService = useMutation({
    mutationFn: (payload: ServiceFormData) =>
      api<Service>("/api/services", {
        method: "POST",
        body: JSON.stringify({
          title: payload.title,
          description: payload.description,
          icon: payload.icon,
          sort_order: payload.sort_order,
          is_active: payload.is_active,
          features: payload.featuresText
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
      toast({ title: "Success", description: "Service created successfully" });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateService = useMutation({
    mutationFn: (payload: ServiceFormData & { id: string }) =>
      api<Service>(`/api/services/${payload.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: payload.title,
          description: payload.description,
          icon: payload.icon,
          sort_order: payload.sort_order,
          is_active: payload.is_active,
          features: payload.featuresText
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
      toast({ title: "Success", description: "Service updated successfully" });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteService = useMutation({
    mutationFn: (id: string) => api<void>(`/api/services/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
      toast({ title: "Deleted", description: "Service removed" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateService.mutate({ ...formData, id: editingId });
    } else {
      createService.mutate(formData);
    }
  };

  const handleEdit = (svc: Service) => {
    setEditingId(svc.id);
    setFormData({
      title: svc.title,
      description: svc.description ?? "",
      featuresText: (svc.features || []).join("\n"),
      icon: svc.icon || "Code2",
      sort_order: svc.sort_order ?? 0,
      is_active: !!svc.is_active,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      featuresText: "",
      icon: "Code2",
      sort_order: 0,
      is_active: true,
    });
  };

  const iconMap: Record<string, JSX.Element> = {
    Code2: <Code2 className="w-6 h-6" />,
    Palette: <Palette className="w-6 h-6" />,
  };

  return (
    <AdminLayout title="Services">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Services</h1>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Service" : "Create New Service"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update the service details below." : "Fill in the details to create a new service."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Web Development"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the service"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="features">Features (one per line)</Label>
                <Textarea
                  id="features"
                  value={formData.featuresText}
                  onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                  placeholder={"Responsive design\nPerformance optimization\nSEO-ready"}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="icon">Icon</Label>
                  <select
                    id="icon"
                    className="w-full h-10 rounded border border-input bg-background px-3 text-sm"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  >
                    <option value="Code2">Code2</option>
                    <option value="Palette">Palette</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingId ? "Update" : "Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Separator className="mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service: Service) => (
          <Card key={service.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {service.icon && iconMap[service.icon] ? iconMap[service.icon] : <Code2 className="w-6 h-6" />}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <div className="text-xs text-muted-foreground">Order: {service.sort_order ?? 0}</div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${service.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {service.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {service.description && (
                <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
              )}
              {service.features && service.features.length > 0 && (
                <ul className="text-sm space-y-1 mb-4">
                  {service.features.slice(0, 6).map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 mt-2 rounded-full bg-primary" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(service)}>
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete "${service.title}"?`)) {
                      deleteService.mutate(service.id);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">No services found. Click "Add Service" to create one.</div>
      )}
    </AdminLayout>
  );
};

export default Services;
