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
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...init });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

type PackageFeature = {
  name: string;
  included: boolean;
};

type Package = {
  id: string;
  name: string;
  price: string;
  description: string | null;
  features: PackageFeature[];
  is_recommended: boolean;
  sort_order: number;
  is_active: boolean;
};

type PackageFormData = {
  name: string;
  price: string;
  description: string;
  features: PackageFeature[];
  is_recommended: boolean;
  sort_order: number;
  is_active: boolean;
};

const Packages = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PackageFormData>({
    name: "",
    price: "",
    description: "",
    features: [],
    is_recommended: false,
    sort_order: 0,
    is_active: true,
  });

  // Feature form state
  const [featureName, setFeatureName] = useState("");
  const [featureIncluded, setFeatureIncluded] = useState(true);

  const { data: packages = [] } = useQuery<Package[]>({
    queryKey: ["admin-packages"],
    queryFn: () => api<Package[]>("/api/admin/packages"),
  });

  const createPackage = useMutation({
    mutationFn: (payload: PackageFormData) =>
      api<Package>("/api/admin/packages", { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-packages"] });
      qc.invalidateQueries({ queryKey: ["packages"] });
      toast({ title: "Success", description: "Package created successfully" });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updatePackage = useMutation({
    mutationFn: (payload: PackageFormData & { id: string }) =>
      api<Package>(`/api/admin/packages/${payload.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-packages"] });
      qc.invalidateQueries({ queryKey: ["packages"] });
      toast({ title: "Success", description: "Package updated successfully" });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deletePackage = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/packages/${id}`, { 
        method: "DELETE" 
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete package: ${response.statusText}`);
      }
      
      return response;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-packages"] });
      qc.invalidateQueries({ queryKey: ["packages"] });
      toast({ 
        title: "Success", 
        description: "Package deleted successfully" 
      });
    },
    onError: (error: Error) => {
      console.error("Delete package error:", error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to delete package", 
        variant: "destructive" 
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updatePackage.mutate({ ...formData, id: editingId });
    } else {
      createPackage.mutate(formData);
    }
  };

  const handleEdit = (pkg: Package) => {
    setEditingId(pkg.id);
    setFormData({
      name: pkg.name,
      price: pkg.price,
      description: pkg.description ?? "",
      features: pkg.features,
      is_recommended: pkg.is_recommended,
      sort_order: pkg.sort_order,
      is_active: pkg.is_active,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      price: "",
      description: "",
      features: [],
      is_recommended: false,
      sort_order: 0,
      is_active: true,
    });
    setFeatureName("");
    setFeatureIncluded(true);
  };

  const addFeature = () => {
    if (featureName.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, { name: featureName.trim(), included: featureIncluded }],
      });
      setFeatureName("");
      setFeatureIncluded(true);
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  return (
    <AdminLayout title="Packages">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Service Packages</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Package" : "Create New Package"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update the package details below." : "Fill in the details to create a new service package."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Package Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Professional"
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g., $5,000"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the package"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order || 0}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Features</Label>
                <div className="flex gap-2">
                  <Input
                    value={featureName}
                    onChange={(e) => setFeatureName(e.target.value)}
                    placeholder="Feature name"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                  />
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={featureIncluded}
                      onCheckedChange={setFeatureIncluded}
                    />
                    <span className="text-sm">{featureIncluded ? "Included" : "Not Included"}</span>
                  </div>
                  <Button type="button" onClick={addFeature} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="space-y-2 mt-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div className="flex items-center gap-2">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-primary" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className={feature.included ? "" : "text-muted-foreground"}>
                          {feature.name}
                        </span>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFeature(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="is_recommended"
                  checked={formData.is_recommended}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_recommended: checked })}
                />
                <Label htmlFor="is_recommended">Mark as Recommended</Label>
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
                <Button type="submit">
                  {editingId ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Separator className="mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id} className={pkg.is_recommended ? "border-primary" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  <div className="text-2xl font-bold text-primary mt-2">{pkg.price}</div>
                  {pkg.description && (
                    <p className="text-sm text-muted-foreground mt-2">{pkg.description}</p>
                  )}
                </div>
                {pkg.is_recommended && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    Recommended
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <p className="text-sm font-semibold">Features:</p>
                <ul className="space-y-1">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? "" : "text-muted-foreground"}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center gap-2 mb-4 text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span className={pkg.is_active ? "text-green-600" : "text-red-600"}>
                  {pkg.is_active ? "Active" : "Inactive"}
                </span>
                <span className="text-muted-foreground ml-2">Order:</span>
                <span>{pkg.sort_order}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(pkg)}>
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete "${pkg.name}"? This action cannot be undone.`)) {
                      deletePackage.mutate(pkg.id);
                    }
                  }}
                  disabled={deletePackage.isPending}
                >
                  {deletePackage.isPending ? (
                    <>
                      <div className="w-4 h-4 mr-1 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {packages.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No packages found. Click "Add Package" to create one.
        </div>
      )}
    </AdminLayout>
  );
};

export default Packages;
