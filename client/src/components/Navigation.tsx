import { Link, useLocation } from "wouter";
import { Moon, Sun, Menu, X, ArrowRight } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@assets/logos/logo-light.png";
import logoDark from "@assets/logos/logo-dark.png";

export default function Navigation() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const currentLogo = theme === "dark" ? logoDark : logo;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/who-we-are", label: "Who We Are" },
    { path: "/what-we-do", label: "What We Do" },
    { path: "/insights", label: "Insights" },
    { path: "/reach-us", label: "Reach Us" },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "py-3 bg-background/80 backdrop-blur-xl border-b border-border shadow-lg shadow-black/5" 
          : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group transition-transform duration-300 hover:scale-105">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                <img 
                  src={currentLogo} 
                  alt="Lupus Venture Logo" 
                  className="relative w-10 h-10 object-contain" 
                />
              </div>
              <span className="text-xl font-bold font-heading tracking-tight text-foreground">
                Lupus <span className="text-primary">Venture</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 bg-secondary/30 p-1 rounded-full border border-border/50 backdrop-blur-md">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <button
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 relative group ${
                    location === item.path
                      ? "text-primary-foreground bg-primary shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                  data-testid={`link-nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </button>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full w-10 h-10 hover:bg-secondary/80 transition-colors"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {theme === "light" ? (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>

            <Link href="/reach-us">
              <Button className="hidden md:flex rounded-full px-6 font-semibold group bg-primary hover:bg-primary/90">
                Start Project
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-full w-10 h-10"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-background/95 backdrop-blur-2xl rounded-3xl mt-4 border border-border shadow-2xl"
            >
              <div className="p-6 space-y-3">
                {navItems.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <button
                      className={`w-full text-left px-6 py-4 rounded-2xl text-lg font-semibold transition-all ${
                        location === item.path
                          ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20"
                          : "text-foreground hover:bg-secondary"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </button>
                  </Link>
                ))}
                <div className="pt-4 border-t border-border mt-4">
                  <Link href="/reach-us">
                    <Button className="w-full h-14 rounded-2xl text-lg font-bold">
                      Get Started Now
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
