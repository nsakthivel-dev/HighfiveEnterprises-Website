import { Link } from "wouter";
import { Facebook, Github, Instagram, Linkedin, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import logo from "@assets/logos/logo-light.png";
import logoDark from "@assets/logos/logo-dark.png";
import { useTheme } from "./ThemeProvider";

export default function Footer() {
  const { theme } = useTheme();
  const currentLogo = theme === "dark" ? logoDark : logo;
  
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Projects", path: "/projects" },
    { name: "Team", path: "/team" },
  ];

  const resources = [
    { name: "Events", path: "/events" },
    { name: "Network", path: "/network" },
    { name: "Join Team", path: "/join-team" },
    { name: "Become Partner", path: "/become-partner" },
    { name: "Contact", path: "/contact" },
  ];

  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/highfive-enterprises/", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/highfive-tech", label: "GitHub" },
    { icon: Instagram, href: "https://instagram.com/highfive.ent", label: "Instagram" },
    { icon: Facebook, href: "https://www.facebook.com/HighFiveEnterprises", label: "Facebook" },
  ];
  
  return (
    <footer className="relative bg-gradient-to-br from-background via-background to-accent/20 border-t border-border/50">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Brand Section - Takes more space */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-lg blur-lg group-hover:blur-xl transition-all duration-300" />
                    <img 
                      src={currentLogo} 
                      alt="HighFive Enterprises Logo" 
                      className="relative h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-110" 
                    />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    HighFive Enterprises
                  </div>
                </div>
                <p className="text-base text-muted-foreground leading-relaxed max-w-md">
                  Building modern, AI-assisted solutions for startups and enterprises. 
                  Transforming ideas into reality with cutting-edge technology.
                </p>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
                  Connect With Us
                </h3>
                <div className="flex items-center gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="group relative rounded-lg p-2.5 bg-muted/50 hover:bg-primary/10 border border-border/50 hover:border-primary/50 transition-all duration-300"
                    >
                      <social.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                        {social.label}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/80 mb-6">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link 
                      href={link.path} 
                      className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="lg:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/80 mb-6">
                Resources
              </h3>
              <ul className="space-y-3">
                {resources.map((link) => (
                  <li key={link.path}>
                    <Link 
                      href={link.path} 
                      className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/80 mb-6">
                Get In Touch
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 group">
                  <div className="mt-0.5 p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <a 
                      href="mailto:teamhfive25@gmail.com" 
                      className="text-sm text-foreground hover:text-primary transition-colors duration-200 break-all"
                    >
                      teamhfive25@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3 group">
                  <div className="mt-0.5 p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Business Hours</p>
                    <p className="text-sm text-foreground">Mon–Fri, 9:00–18:00 IST</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 group">
                  <div className="mt-0.5 p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Location</p>
                    <p className="text-sm text-foreground">Puducherry</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} HighFive Enterprises. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link 
                href="/privacy" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <span className="text-border">•</span>
              <Link 
                href="/terms" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}