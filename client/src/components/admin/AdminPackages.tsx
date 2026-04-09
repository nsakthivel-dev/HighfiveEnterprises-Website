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
  DollarSign,
  Star,
  CheckCircle2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Package {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  is_recommended: boolean;
  sort_order: number;
  is_active: boolean;
}

const AdminPackages: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Package>>({
    name: '',
    price: '',
    description: '',
    features: [],
    is_recommended: false,
    sort_order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/admin/packages');
      const data = await res.json();
      setPackages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id?: string) => {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/admin/packages/${id}` : '/api/admin/packages';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast({ title: id ? 'Package updated' : 'Package created' });
        setEditingId(null);
        setShowAddForm(false);
        setFormData({ name: '', price: '', description: '', features: [], is_recommended: false, sort_order: 0, is_active: true });
        fetchPackages();
      }
    } catch (error) {
      toast({ title: 'Error saving package', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    try {
      const res = await fetch(`/api/admin/packages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'Package deleted' });
        fetchPackages();
      }
    } catch (error) {
      toast({ title: 'Error deleting package', variant: 'destructive' });
    }
  };

  const startEdit = (pkg: Package) => {
    setEditingId(pkg.id);
    setFormData(pkg);
    setShowAddForm(false);
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-heading font-bold tracking-tight">Packages Management</h2>
          <p className="text-slate-400">Manage tiered pricing and feature comparisons.</p>
        </div>
        {!showAddForm && !editingId && (
          <Button onClick={() => setShowAddForm(true)} className="rounded-xl">
            <Plus className="w-4 h-4 mr-2" /> Add Package
          </Button>
        )}
      </div>

      {(showAddForm || editingId) && (
        <Card className="bg-slate-900/40 border-primary/30 glass-morphic">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Package' : 'Add New Package'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Package Name</Label>
                <Input 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label>Price (e.g., $99/mo)</Label>
                <Input 
                  value={formData.price} 
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setFormData({...formData, is_recommended: !formData.is_recommended})}>
                <div className={`w-5 h-5 rounded border ${formData.is_recommended ? 'bg-primary border-primary' : 'border-slate-700'} flex items-center justify-center`}>
                  {formData.is_recommended && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <Label className="cursor-pointer">Recommended / Highlighted</Label>
              </div>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setFormData({...formData, is_active: !formData.is_active})}>
                <div className={`w-5 h-5 rounded border ${formData.is_active ? 'bg-green-500 border-green-500' : 'border-slate-700'} flex items-center justify-center`}>
                  {formData.is_active && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <Label className="cursor-pointer">Active</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="bg-slate-800 border-slate-700 min-h-[80px]"
              />
            </div>

            <div className="flex items-center gap-4 pt-4">
               <Button onClick={() => handleSave(editingId as string)} className="rounded-xl">
                 <Save className="w-4 h-4 mr-2" /> {editingId ? 'Update Package' : 'Create Package'}
               </Button>
               <Button variant="ghost" onClick={() => { setEditingId(null); setShowAddForm(false); }}>
                 <X className="w-4 h-4 mr-2" /> Cancel
               </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <Card key={pkg.id} className={`bg-slate-900/40 border-slate-800 group relative ${pkg.is_recommended ? 'ring-2 ring-primary/50' : ''}`}>
            {pkg.is_recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-primary/30">
                Recommended
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold">{pkg.name}</CardTitle>
                  <p className="text-2xl font-black text-primary mt-1">{pkg.price}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(pkg)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400" onClick={() => handleDelete(pkg.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-4 line-clamp-2">{pkg.description}</p>
              <div className="space-y-2">
                {(pkg.features || []).slice(0, 3).map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
                {pkg.features?.length > 3 && (
                  <p className="text-[10px] text-slate-500">+{pkg.features.length - 3} more features</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminPackages;
