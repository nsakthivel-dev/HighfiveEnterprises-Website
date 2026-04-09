import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Settings, 
  Briefcase, 
  MessageSquare, 
  LogOut, 
  Menu, 
  X,
  Package,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import AdminDashboard from './AdminDashboard';
import AdminServices from './AdminServices';
import AdminPackages from './AdminPackages';
import AdminFeedback from './AdminFeedback';

const AdminLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'services' | 'packages' | 'feedback'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout, user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'packages', label: 'Packages', icon: Package },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminDashboard onNavigate={setActiveTab} />;
      case 'services': return <AdminServices />;
      case 'packages': return <AdminPackages />;
      case 'feedback': return <AdminFeedback />;
      default: return <AdminDashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className="bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 relative z-20"
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
              <TrendingUp className="text-primary w-6 h-6" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight">Admin <span className="text-primary italic">Panel</span></span>
          </div>

          <nav className="space-y-2 flex-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                {activeTab === item.id && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-slate-800 space-y-4">
            <div className="px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <p className="text-xs text-slate-500 mb-1">Signed in as</p>
              <p className="text-sm font-medium truncate">{user?.email}</p>
            </div>
            <Button 
              variant="ghost" 
              onClick={logout}
              className="w-full flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 justify-start h-12 rounded-xl"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-950 relative">
        {/* Top Header */}
        <header className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-slate-400"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-slate-500">Workspace Status</p>
                <p className="text-sm font-medium text-green-400 flex items-center gap-1.5 justify-end">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Live Sync (Firebase)
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
