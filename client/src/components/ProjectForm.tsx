import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectForm({ isOpen, onClose }: ProjectFormProps) {
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      // Only reset overflow if no other modals are open
      const openModals = document.querySelectorAll('[data-modal-open]');
      if (openModals.length <= 1) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Show success toast notification
    toast({
      title: "Project Inquiry Submitted!",
      description: "We've received your project details and will get back to you within 24 hours.",
    });
    // Close the modal
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" data-modal-open>
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0"
        onClick={handleBackdropClick}
      />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-lg border bg-background shadow-lg animate-in zoom-in-95 slide-in-from-bottom-2">
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="overflow-y-auto max-h-[90vh]">
          <Card className="border-0 shadow-none">
            <CardHeader className="text-center">
              <CardTitle>Start Your Project</CardTitle>
              <CardDescription>
                Tell us about your project and we'll get back to you with a tailored solution.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form 
                action="https://formsubmit.co/teamhfive25@gmail.com" 
                method="POST"
                className="space-y-6"
                encType="multipart/form-data"
                onSubmit={handleSubmit}
              >
                {/* Hidden input to prevent spam */}
                <input type="hidden" name="_captcha" value="false" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="projectTitle">Project Title *</Label>
                  <Input
                    id="projectTitle"
                    name="projectTitle"
                    placeholder="Enter project title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="projectCategory">Project Category *</Label>
                  <Input
                    id="projectCategory"
                    name="projectCategory"
                    placeholder="e.g., Web Application, Mobile App, SaaS Platform"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="projectDescription">Project Description *</Label>
                  <Textarea
                    id="projectDescription"
                    name="projectDescription"
                    placeholder="Describe your project in detail..."
                    rows={5}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="keyFeatures">Key Features (Optional)</Label>
                  <Textarea
                    id="keyFeatures"
                    name="keyFeatures"
                    placeholder="List the key features you want in your project"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expectedOutcome">Expected Outcome (Optional)</Label>
                  <Textarea
                    id="expectedOutcome"
                    name="expectedOutcome"
                    placeholder="What do you hope to achieve with this project?"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="file">File Upload (Optional)</Label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                  />
                </div>
                
                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Submit Project
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}