import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export default function ContactForm() {
  const { toast } = useToast();
  const [prefillData, setPrefillData] = useState<{ activity?: string; type?: string; service?: string; package?: string }>({});

  useEffect(() => {
    // Parse URL parameters to prefill form
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
    e.preventDefault(); // Prevent default form submission
    
    // Get form data
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      // Submit to formsubmit.co using fetch
      const response = await fetch('https://formsubmit.co/ajax/teamhfive25@gmail.com', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        // Show success toast notification
        toast({
          title: "Message Sent!",
          description: "We'll get back to you within 24 hours.",
        });
        
        // Reset the form
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      // Show error toast notification
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly at teamhfive25@gmail.com",
        variant: "destructive"
      });
    }
  };

  // Determine the reason and message placeholders/prefills based on URL parameters
  const reasonValue = prefillData.package 
    ? `Interest in ${prefillData.package} package` 
    : prefillData.service 
      ? `Interest in ${prefillData.service} service` 
      : prefillData.activity 
        ? `More information on ${prefillData.activity}` 
        : "";
      
  const messagePlaceholder = prefillData.package 
    ? `I'm interested in your ${prefillData.package} package. Please provide more details.` 
    : prefillData.service 
      ? `I'm interested in your ${prefillData.service} service. Please provide more details.` 
      : prefillData.activity 
        ? `I need more information on: ${prefillData.activity}` 
        : "Your message...";
      
  const messageDefaultValue = prefillData.package 
    ? `I'm interested in your ${prefillData.package} package. Please provide more details.\n\n` 
    : prefillData.service 
      ? `I'm interested in your ${prefillData.service} service. Please provide more details.\n\n` 
      : prefillData.activity 
        ? `I need more information on: ${prefillData.activity}${prefillData.type ? ` (${prefillData.type})` : ''}\n\n` 
        : "";

  return (
    <Card className="overflow-visible">
      <CardHeader>
        <CardTitle>Get in Touch</CardTitle>
      </CardHeader>
      <CardContent>
        <form 
          onSubmit={handleSubmit} 
          className="space-y-6"
        >
          {/* Hidden inputs for formsubmit.co */}
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_subject" value="New Contact Form Submission" />
          <input type="hidden" name="_template" value="table" />
          
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
              defaultValue={reasonValue}
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
              placeholder={messagePlaceholder}
              defaultValue={messageDefaultValue}
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