import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function ContactForm() {
  const { toast } = useToast();
  const [location] = useLocation();
  const [prefillData, setPrefillData] = useState<{ activity?: string; type?: string }>({});

  useEffect(() => {
    // Parse URL parameters to prefill form
    const searchParams = new URLSearchParams(window.location.search);
    const activity = searchParams.get('activity');
    const type = searchParams.get('type');
    
    if (activity || type) {
      setPrefillData({ activity: activity || '', type: type || '' });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    // Show toast notification on form submission
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
  };

  return (
    <Card className="overflow-visible">
      <CardHeader>
        <CardTitle>Get in Touch</CardTitle>
      </CardHeader>
      <CardContent>
        <form 
          action="https://formsubmit.co/teamhfive25@gmail.com" 
          method="POST"
          onSubmit={handleSubmit} 
          className="space-y-6"
        >
          {/* Hidden input to prevent spam */}
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_subject" value="New Contact Form Submission" />
          
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              name="name"
              placeholder="Your name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Gmail *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@gmail.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Contact *</Label>
            <input
              id="reason"
              name="reason"
              defaultValue={prefillData.activity ? `More information on ${prefillData.activity}` : ""}
              placeholder="Enter reason for contact"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              name="message"
              placeholder={prefillData.activity ? `I need more information on: ${prefillData.activity}` : "Your message..."}
              defaultValue={prefillData.activity ? `I need more information on: ${prefillData.activity}${prefillData.type ? ` (${prefillData.type})` : ''}\n\n` : ""}
              rows={5}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}