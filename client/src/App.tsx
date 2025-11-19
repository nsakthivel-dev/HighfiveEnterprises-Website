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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/team" component={Team} />
      <Route path="/services" component={Services} />
      <Route path="/projects" component={Projects} />
      <Route path="/project/:id" component={ProjectView} />
      <Route path="/contact" component={Contact} />
      <Route path="/our-network" component={OurNetwork} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/apply" component={Apply} />
      <Route path="/events" component={Events} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin-panel">
        <Redirect to="/admin-panel/dashboard" />
      </Route>
      <Route path="/admin-panel/dashboard" component={AdminDashboard} />
      <Route path="/admin-panel/team" component={AdminTeam} />
      <Route path="/admin-panel/projects" component={AdminProjects} />
      <Route path="/admin-panel/activity" component={AdminActivity} />
      <Route path="/admin-panel/services" component={AdminServices} />
      <Route path="/admin-panel/packages" component={AdminPackages} />
      <Route path="/admin-panel/network" component={AdminNetwork} />
      <Route path="/admin-panel/events" component={AdminEvents} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <div className="min-h-screen">
            <Navigation />
            <ScrollToTop />
            <Router />
            <Footer />
          </div>
          <Toaster />
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
