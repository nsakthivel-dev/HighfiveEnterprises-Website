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
  const [prefillData, setPrefillData] = useState<{ activity?: string; type?: string }>({});

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const activity = searchParams.get('activity');
    const type = searchParams.get('type');
    
    if (activity || type) {
      setPrefillData({ activity: activity || '', type: type || '' });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
  };

  return (
    <form 
      action="https://formsubmit.co/touch@lupusventure.com" 
      method="POST"
      onSubmit={handleSubmit} 
      className="space-y-8"
    >
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_subject" value="New Project Inquiry - Lupus Venture" />
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="name" className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            required
            className="h-14 px-6 rounded-2xl bg-secondary/30 border-border/50 focus:bg-background transition-all"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="email" className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            className="h-14 px-6 rounded-2xl bg-secondary/30 border-border/50 focus:bg-background transition-all"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="reason" className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">
          Subject / Reason
        </Label>
        <Input
          id="reason"
          name="reason"
          defaultValue={prefillData.activity ? `Inquiry about ${prefillData.activity}` : ""}
          placeholder="What are you looking to build?"
          required
          className="h-14 px-6 rounded-2xl bg-secondary/30 border-border/50 focus:bg-background transition-all"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="message" className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">
          Project Details
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us about your project goals, timeline, and any specific requirements..."
          defaultValue={prefillData.activity ? `I need more information on: ${prefillData.activity}${prefillData.type ? ` (${prefillData.type})` : ''}\n\n` : ""}
          rows={6}
          required
          className="px-6 py-4 rounded-[2rem] bg-secondary/30 border-border/50 focus:bg-background transition-all resize-none"
        />
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button type="submit" className="w-full h-16 rounded-2xl text-lg font-bold group shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all">
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
