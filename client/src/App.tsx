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
import WhoWeAre from "@/pages/WhoWeAre";
import WhatWeDo from "@/pages/WhatWeDo";
import ReachUs from "@/pages/ReachUs";
import Insights from "@/pages/Insights";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import BecomePartner from "@/pages/BecomePartner";
// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminActivity from "@/pages/admin/Activity";
import AdminServices from "@/pages/admin/Services";
import AdminPackages from "@/pages/admin/Packages";
// Auth components
import { AuthProvider } from "@/context/AuthContext";
import AdminLogin from "@/pages/AdminLogin";
import ProtectedRoute from "@/components/ProtectedRoute";
import GlobalChatbot from "@/components/GlobalChatbot";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/components/CustomCursor";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/who-we-are" component={WhoWeAre} />
      <Route path="/what-we-do" component={WhatWeDo} />
      <Route path="/insights" component={Insights} />
      <Route path="/reach-us" component={ReachUs} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/become-partner" component={BecomePartner} />
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
            <Preloader />
            <CustomCursor />
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