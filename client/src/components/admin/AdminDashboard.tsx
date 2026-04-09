import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Briefcase, 
  Package, 
  MessageSquare, 
  TrendingUp, 
  Activity, 
  Users,
  Clock,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminDashboardProps {
  onNavigate: (tab: 'dashboard' | 'services' | 'packages' | 'feedback') => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    services: 0,
    packages: 0,
    feedback: 0,
    activity: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [servicesRes, packagesRes, feedbackRes, activityRes] = await Promise.all([
          fetch('/api/services').then(res => res.json()),
          fetch('/api/admin/packages').then(res => res.json()),
          fetch('/api/admin/feedback').then(res => res.json()),
          fetch('/api/activity').then(res => res.json())
        ]);

        setStats({
          services: Array.isArray(servicesRes) ? servicesRes.length : 0,
          packages: Array.isArray(packagesRes) ? packagesRes.length : 0,
          feedback: Array.isArray(feedbackRes) ? feedbackRes.length : 0,
          activity: Array.isArray(activityRes) ? activityRes.length : 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Services', value: stats.services, icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-400/10', tab: 'services' },
    { title: 'Pricing Packages', value: stats.packages, icon: Package, color: 'text-purple-400', bg: 'bg-purple-400/10', tab: 'packages' },
    { title: 'Client Feedback', value: stats.feedback, icon: MessageSquare, color: 'text-green-400', bg: 'bg-green-400/10', tab: 'feedback' },
    { title: 'System Activity', value: stats.activity, icon: Activity, color: 'text-orange-400', bg: 'bg-orange-400/10', tab: 'dashboard' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-400">Welcome back. Here's what's happening across your platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="bg-slate-900/40 border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
              onClick={() => onNavigate(stat.tab as any)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} border border-current opacity-20 group-hover:opacity-100 transition-opacity`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>
                <div className="space-y-1">
                  <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold tracking-tight">
                    {loading ? '...' : stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-slate-900/40 border-slate-800">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recent System Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* This would be populated from your activity log */}
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/30 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">System configured for Firebase</p>
                    <p className="text-xs text-slate-500">2 minutes ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Platform Quick Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-400 space-y-4">
            <p>
              • Use <strong>Services</strong> to update the primary offerings shown on your landing page.
            </p>
            <p>
              • <strong>Packages</strong> allows you to manage tiered pricing and feature comparisons.
            </p>
            <p>
              • Approve client <strong>Feedback</strong> here to make it visible in the public testimonial section.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
