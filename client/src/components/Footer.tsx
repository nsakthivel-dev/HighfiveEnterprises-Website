import { Link } from "wouter";
import { Facebook, Github, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="text-2xl font-bold tracking-tight">HighFive Enterprises</div>
            <p className="text-sm text-muted-foreground">
              Building modern, AI-assisted solutions for startups and enterprises.
            </p>
          </div>

          <div>
            <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Quick Pages</div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:underline">Home</Link>
              </li>
              <li>
                <Link href="/services" className="hover:underline">Services</Link>
              </li>
              <li>
                <Link href="/projects" className="hover:underline">Projects</Link>
              </li>
              <li>
                <Link href="/team" className="hover:underline">Team</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Follow Us</div>
            <div className="flex items-center gap-3">
              <a href="https://www.linkedin.com/in/highfive-enterprises/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="rounded-md p-2 hover:bg-muted">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://github.com/highfive-tech" target="_blank" rel="noreferrer" aria-label="GitHub" className="rounded-md p-2 hover:bg-muted">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/highfive.ent" target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-md p-2 hover:bg-muted">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/HighFiveEnterprises" target="_blank" rel="noreferrer" aria-label="Facebook" className="rounded-md p-2 hover:bg-muted">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Contact</div>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:teamhfive25@gmail.com" className="hover:underline">teamhfive25@gmail.com</a>
              </li>
              <li>
                <span>Mon–Fri, 9:00–18:00 IST</span>
              </li>
              <li>
                <span>Chennai, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} HighFive Enterprises. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
