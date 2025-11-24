import { Switch, Route, useLocation, Redirect } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Team from "@/pages/Team";
import Services from "@/pages/Services";
import Projects from "@/pages/Projects";
import ProjectView from "@/pages/ProjectView";
import Contact from "@/pages/Contact";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Apply from "@/pages/Apply";
import JoinTeam from "@/pages/JoinTeam";
import BecomePartner from "@/pages/BecomePartner";
import OurNetwork from "@/pages/OurNetwork";
import Events from "@/pages/Events";
// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminTeam from "@/pages/admin/Team";
import AdminProjects from "@/pages/admin/Projects";
import AdminActivity from "@/pages/admin/Activity";
import AdminServices from "@/pages/admin/Services";
import AdminPackages from "@/pages/admin/Packages";
import AdminNetwork from "@/pages/admin/Network";
import AdminEvents from "@/pages/admin/Events";
// Auth components
import { AuthProvider } from "@/context/AuthContext";
import AdminLogin from "@/pages/AdminLogin";
import ProtectedRoute from "@/components/ProtectedRoute";
import GlobalChatbot from "@/components/GlobalChatbot";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/team" component={Team} />
      <Route path="/services" component={Services} />
      <Route path="/projects" component={Projects} />
      <Route path="/project/:id" component={ProjectView} />
      <Route path="/contact" component={Contact} />
      <Route path="/our-network" component={OurNetwork} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/apply" component={Apply} />
      <Route path="/join-team" component={JoinTeam} />
      <Route path="/become-partner" component={BecomePartner} />
      <Route path="/events" component={Events} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin-panel">
        <ProtectedRoute>
          <Redirect to="/admin-panel/dashboard" />
        </ProtectedRoute>
      </Route>
      <Route path="/admin-panel/dashboard">
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/admin-panel/team">
        <ProtectedRoute>
          <AdminTeam />
        </ProtectedRoute>
      </Route>
      <Route path="/admin-panel/projects">
        <ProtectedRoute>
          <AdminProjects />
        </ProtectedRoute>
      </Route>
      <Route path="/admin-panel/activity">
        <ProtectedRoute>
          <AdminActivity />
        </ProtectedRoute>
      </Route>
      <Route path="/admin-panel/services">
        <ProtectedRoute>
          <AdminServices />
        </ProtectedRoute>
      </Route>
      <Route path="/admin-panel/packages">
        <ProtectedRoute>
          <AdminPackages />
        </ProtectedRoute>
      </Route>
      <Route path="/admin-panel/network">
        <ProtectedRoute>
          <AdminNetwork />
        </ProtectedRoute>
      </Route>
      <Route path="/admin-panel/events">
        <ProtectedRoute>
          <AdminEvents />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  
  // Check if current route is an admin or auth route
  const isAdminOrAuthRoute = location.startsWith('/admin') || location.startsWith('/admin-panel');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen">
              <Navigation />
              <ScrollToTop />
              <Router />
              <Footer />
              {!isAdminOrAuthRoute && <GlobalChatbot />}
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);
  return null;
}

export default App;