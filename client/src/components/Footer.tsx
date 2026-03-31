import { Link } from "wouter";
import { Facebook, Github, Instagram, Linkedin, Mail, MapPin, Clock, ArrowRight, Sparkles } from "lucide-react";
import logo from "@assets/logos/logo-light.png";
import logoDark from "@assets/logos/logo-dark.png";
import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";

export default function Footer() {
  const { theme } = useTheme();
  const currentLogo = theme === "dark" ? logoDark : logo;
  
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Who We Are", path: "/who-we-are" },
    { name: "What We Do", path: "/what-we-do" },
    { name: "Insights", path: "/insights" },
    { name: "Reach Us", path: "/reach-us" },
  ];

  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/company/lupus-venture/", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/lupus-venture", label: "GitHub" },
    { icon: Instagram, href: "https://instagram.com/lupus.venture", label: "Instagram" },
    { icon: Facebook, href: "https://www.facebook.com/LupusVenture", label: "Facebook" },
  ];
  
  return (
    <footer className="relative bg-background pt-24 pb-12 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          {/* Brand Column */}
          <div className="lg:col-span-5">
            <Link href="/">
              <div className="flex items-center gap-3 mb-8 cursor-pointer group w-fit">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                  <img src={currentLogo} alt="Logo" className="relative h-12 w-12 object-contain" />
                </div>
                <span className="text-2xl font-bold font-heading tracking-tight">
                  Lupus <span className="text-primary">Venture</span>
                </span>
              </div>
            </Link>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md mb-10 font-light">
              We empower businesses through innovative technology and creative digital solutions. Building the future, one project at a time.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center border border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 group shadow-sm"
                >
                  <social.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/50 mb-8">Navigation</h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className="text-muted-foreground hover:text-primary transition-colors flex items-center group">
                    <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
                      <ArrowRight className="w-3 h-3 mr-1" />
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-5">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/50 mb-8">Contact</h4>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Email Us</p>
                  <a href="mailto:touch@lupusventure.com" className="text-foreground hover:text-primary transition-colors font-medium">
                    touch@lupusventure.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Visit Us</p>
                  <p className="text-foreground font-medium">Chennai, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-muted-foreground text-sm font-light">
            © {new Date().getFullYear()} Lupus Venture. All rights reserved.
          </p>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/30 border border-border/50 text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3 text-primary animate-pulse" />
            Designed for the future
          </div>
        </div>
      </div>
    </footer>
  );
}
