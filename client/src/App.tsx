import { Switch, Route, useLocation } from "wouter";
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
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/context/AuthContext";
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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
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
