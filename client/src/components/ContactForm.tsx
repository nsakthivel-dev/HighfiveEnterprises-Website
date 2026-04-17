"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

export default function ContactForm() {
  const { toast } = useToast();
  const [prefillData, setPrefillData] = useState<{ activity?: string; type?: string; service?: string; package?: string }>({});

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const activity = searchParams.get('activity');
    const type = searchParams.get('type');
    const service = searchParams.get('service');
    const packageName = searchParams.get('package');
    
    if (activity || type || service || packageName) {
      setPrefillData({ 
        activity: activity || '', 
        type: type || '', 
        service: service || '',
        package: packageName || ''
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      const response = await fetch('https://formsubmit.co/ajax/touch@lupusventure.com', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        toast({
          title: "Message Sent!",
          description: "We'll get back to you within 24 hours.",
        });
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly at touch@lupusventure.com",
        variant: "destructive"
      });
    }
  };

  const reasonValue = prefillData.package 
    ? `Interest in ${prefillData.package} package` 
    : prefillData.service 
      ? `Interest in ${prefillData.service} service` 
      : prefillData.activity 
        ? `Inquiry about ${prefillData.activity}` 
        : "";
      
  const messageDefaultValue = prefillData.package 
    ? `I'm interested in your ${prefillData.package} package. Please provide more details.\n\n` 
    : prefillData.service 
      ? `I'm interested in your ${prefillData.service} service. Please provide more details.\n\n` 
      : prefillData.activity 
        ? `I need more information on: ${prefillData.activity}${prefillData.type ? ` (${prefillData.type})` : ''}\n\n` 
        : "";

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-6"
    >
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_subject" value="New Project Inquiry - Lupus Venture" />
      
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            required
            className="h-12 px-6 rounded-2xl bg-secondary/30 border-border/50 focus:bg-background transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            className="h-12 px-6 rounded-2xl bg-secondary/30 border-border/50 focus:bg-background transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason" className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">
          Subject / Reason
        </Label>
        <Input
          id="reason"
          name="reason"
          defaultValue={reasonValue}
          placeholder="What are you looking to build?"
          required
          className="h-12 px-6 rounded-2xl bg-secondary/30 border-border/50 focus:bg-background transition-all"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">
          Project Details
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us about your project goals, timeline, and any specific requirements..."
          defaultValue={messageDefaultValue}
          rows={4}
          required
          className="px-6 py-4 rounded-[1.5rem] bg-secondary/30 border-border/50 focus:bg-background transition-all resize-none"
        />
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold group shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all">
          Send Message
          <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Button>
      </motion.div>
      
      <p className="text-center text-xs text-muted-foreground font-medium">
        We typically respond within 24 business hours.
      </p>
    </form>
  );
}
