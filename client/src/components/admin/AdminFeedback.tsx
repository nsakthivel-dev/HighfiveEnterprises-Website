import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Star,
  MessageSquare,
  Search,
  Filter
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

interface Feedback {
  id: string;
  name: string;
  email: string | null;
  message: string;
  rating: number;
  is_approved: boolean;
  created_at: string;
}

const AdminFeedback: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const res = await fetch('/api/admin/feedback');
      const data = await res.json();
      setFeedbackList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/feedback/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_approved: !currentStatus })
      });

      if (res.ok) {
        toast({ title: !currentStatus ? 'Feedback approved' : 'Feedback unapproved' });
        fetchFeedback();
      }
    } catch (error) {
      toast({ title: 'Error updating feedback', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;
    try {
      const res = await fetch(`/api/admin/feedback/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'Feedback deleted' });
        fetchFeedback();
      }
    } catch (error) {
      toast({ title: 'Error deleting feedback', variant: 'destructive' });
    }
  };

  const filteredFeedback = feedbackList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'approved' && item.is_approved) || 
                         (filter === 'pending' && !item.is_approved);
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold tracking-tight">Client Feedback</h2>
          <p className="text-slate-400">Moderate and manage client testimonials.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
              placeholder="Search feedback..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-slate-900/50 border-slate-800 pl-10 w-[240px] rounded-xl"
            />
          </div>
          <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800">
            {(['all', 'approved', 'pending'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                  filter === f ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredFeedback.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl">
            <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">No feedback found matching your criteria.</p>
          </div>
        ) : (
          filteredFeedback.map(item => (
            <Card key={item.id} className={`bg-slate-900/40 border-slate-800 transition-all ${item.is_approved ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-yellow-500'}`}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-700'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-600 font-mono">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed italic">"{item.message}"</p>
                    {item.email && <p className="text-xs text-slate-500 font-mono">{item.email}</p>}
                  </div>
                  
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => toggleApproval(item.id, item.is_approved)}
                      className={`rounded-xl h-10 px-4 ${item.is_approved ? 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5' : 'text-green-500 border-green-500/20 bg-green-500/5'}`}
                    >
                      {item.is_approved ? (
                        <>
                          <XCircle className="w-4 h-4 mr-2" /> Unapprove
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 text-red-400 hover:text-red-300 hover:bg-red-400/10" 
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminFeedback;
