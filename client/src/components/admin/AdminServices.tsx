import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  Loader2, 
  GripVertical,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon?: string;
  sort_order: number;
  is_active: boolean;
}

const AdminServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    description: '',
    features: [],
    sort_order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id?: string) => {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/services/${id}` : '/api/services';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast({ title: id ? 'Service updated' : 'Service created' });
        setEditingId(null);
        setShowAddForm(false);
        setFormData({ title: '', description: '', features: [], sort_order: 0, is_active: true });
        fetchServices();
      }
    } catch (error) {
      toast({ title: 'Error saving service', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'Service deleted' });
        fetchServices();
      }
    } catch (error) {
      toast({ title: 'Error deleting service', variant: 'destructive' });
    }
  };

  const startEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData(service);
    setShowAddForm(false);
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-heading font-bold tracking-tight">Services Management</h2>
          <p className="text-slate-400">Manage the core services offered by Lupus Venture.</p>
        </div>
        {!showAddForm && !editingId && (
          <Button onClick={() => setShowAddForm(true)} className="rounded-xl">
            <Plus className="w-4 h-4 mr-2" /> Add Service
          </Button>
        )}
      </div>

      {(showAddForm || editingId) && (
        <Card className="bg-slate-900/40 border-primary/30 glass-morphic">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Service' : 'Add New Service'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="bg-slate-800"
                />
              </div>
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Input 
                  type="number"
                  value={formData.sort_order} 
                  onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value)})}
                  className="bg-slate-800"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="bg-slate-800 min-h-[100px]"
              />
            </div>
            <div className="flex items-center gap-4">
               <Button onClick={() => handleSave(editingId as string)}>
                 <Save className="w-4 h-4 mr-2" /> {editingId ? 'Update' : 'Create'}
               </Button>
               <Button variant="ghost" onClick={() => { setEditingId(null); setShowAddForm(false); }}>
                 <X className="w-4 h-4 mr-2" /> Cancel
               </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {services.map(service => (
          <Card key={service.id} className="bg-slate-900/40 border-slate-800 group hover:border-slate-700 transition-all">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-slate-800 text-slate-400">
                  <GripVertical className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    {service.title}
                    {service.is_active ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-1 max-w-xl">{service.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" onClick={() => startEdit(service)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={() => handleDelete(service.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminServices;
