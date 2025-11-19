import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";

async function api<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...init });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  type Service = {
    id: string;
    title: string;
    description: string;
    features: string[];
    icon: string;
    sort_order: number;
    is_active: boolean;
  };

const Services = () => {
    const qc = useQueryClient();
    const [serviceForm, setServiceForm] = useState({ title: "", description: "", featuresText: "", icon: "", sort_order: 0, is_active: true });
    const [serviceEdit, setServiceEdit] = useState<any | "new" | null>(null);
    const { data: services = [] } = useQuery<Service[]>({ queryKey: ["services"], queryFn: () => api<Service[]>("/api/services"), });
    const addService = useMutation({
        mutationFn: (payload: any) => api<any>("/api/services", { method: "POST", body: JSON.stringify({ ...payload, features: payload.featuresText.split("\n").filter((s: string) => s.trim()) }) }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
    });
    const updateService = useMutation({
        mutationFn: (payload: any) => api<any>(`/api/services/${payload.id}`, { method: "PUT", body: JSON.stringify({ ...payload, features: payload.featuresText.split("\n").filter((s: string) => s.trim()) }) }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
    });
    const deleteService = useMutation({
        mutationFn: (id: string) => api<void>(`/api/services/${id}`, { method: "DELETE" }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
    });

    return (
        <AdminLayout title="Services">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Services</h1>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {services.map((service: Service) => (
                    <Card key={service.id}>
                        <div className="flex items-center gap-4">
                            <img src={service.icon ?? "/placeholder.svg"} alt={service.title} className="h-12 w-12" />
                            <h3 className="font-bold text-lg">{service.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{service.description}</p>
                        <div className="flex gap-2 mt-4">
                            <Button size="sm" variant="outline" onClick={() => {setServiceEdit(service.id); setServiceForm({...service, featuresText: service.features.join("\n")})}}>Edit</Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteService.mutate(service.id)}>Delete</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </AdminLayout>
    );
};

export default Services;