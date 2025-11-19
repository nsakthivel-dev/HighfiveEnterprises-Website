import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
 

export default function Apply() {
  const [, navigate] = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    portfolio_url: "",
    resume_url: "",
    message: "",
  });

  const canSubmit = useMemo(() => form.name.trim() && form.email.trim(), [form]);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const submit = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      setErrorMsg("");
      setSuccessMsg("Application submitted successfully. Redirecting to Team...");
      setForm({ name: "", email: "", role: "", portfolio_url: "", resume_url: "", message: "" });
      setTimeout(() => navigate("/team"), 2000);
    },
    onError: (e: any) => { setSuccessMsg(""); setErrorMsg(`Submission failed: ${String(e)}`); },
  });

  return (
    <section className="py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle>Join HighFive Enterprises</CardTitle>
              <a href="/team" className="text-sm text-primary hover:underline">← Back to Team</a>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {successMsg && <div className="text-sm text-green-600 bg-green-100 border border-green-200 rounded px-3 py-2">{successMsg}</div>}
            {errorMsg && <div className="text-sm text-red-600 bg-red-100 border border-red-200 rounded px-3 py-2">{errorMsg}</div>}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role">Role (optional)</Label>
                <Input id="role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Frontend Developer" />
              </div>
              <div>
                <Label htmlFor="portfolio">Portfolio URL (optional)</Label>
                <Input id="portfolio" value={form.portfolio_url} onChange={(e) => setForm({ ...form, portfolio_url: e.target.value })} placeholder="https://..." />
              </div>
            </div>
            <div>
              <Label htmlFor="resume">Resume URL (optional)</Label>
              <Input id="resume" value={form.resume_url} onChange={(e) => setForm({ ...form, resume_url: e.target.value })} placeholder="Link to drive/dropbox" />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about yourself" />
            </div>
            <div className="flex gap-3">
              <Button disabled={!canSubmit || submit.isPending} onClick={() => submit.mutate()}>Submit Application</Button>
              <Button type="button" variant="outline" onClick={() => setForm({ name: "", email: "", role: "", portfolio_url: "", resume_url: "", message: "" })}>Reset</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
