import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const COLLABORATION_TYPES = [
  { value: "associate", label: "Associate" },
  { value: "partner", label: "Partner" },
];

const BUSINESS_TYPES = [
  { value: "technology", label: "Technology" },
  { value: "finance", label: "Finance" },
  { value: "healthcare", label: "Healthcare" },
  { value: "retail", label: "Retail" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "education", label: "Education" },
  { value: "consulting", label: "Consulting" },
  { value: "marketing", label: "Marketing" },
  { value: "media", label: "Media" },
  { value: "other", label: "Other" },
];

export default function BecomePartner() {
  useEffect(() => { 
    window.scrollTo({ top: 0, behavior: "smooth" }); 
  }, []);

  const [showSuccess, setShowSuccess] = useState(false);

  // Check if redirected from FormSubmit success
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('submitted') === 'true') {
      setShowSuccess(true);
      // Clean URL
      window.history.replaceState({}, '', '/become-partner');
    }
  }, []);

  return (
    <section className="py-16 px-6 min-h-screen bg-background">
      <div className="max-w-3xl mx-auto">
        {showSuccess ? (
          <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-green-800 dark:text-green-200">
                  Partnership Request Submitted Successfully!
                </h2>
                <p className="text-green-700 dark:text-green-300">
                  Thank you for your interest in partnering with HighFive Enterprises. We've received your partnership proposal and will review it shortly.
                </p>
                <div className="pt-4 flex gap-3 justify-center">
                  <Button asChild>
                    <a href="/our-network">Back to Network</a>
                  </Button>
                  <Button variant="outline" onClick={() => setShowSuccess(false)}>
                    Submit Another
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <CardTitle className="text-2xl">Become a Partner</CardTitle>
                <a href="/our-network" className="text-sm text-primary hover:underline">
                  ← Back to Network
                </a>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                We're interested in exploring partnership opportunities with your organization. Fill out the form below to get started.
              </p>
            </CardHeader>
            <CardContent>
              <form 
                action="https://formsubmit.co/teamhfive25@gmail.com" 
                method="POST"
                className="space-y-5"
              >
                {/* FormSubmit hidden fields */}
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_next" value={`${window.location.origin}/become-partner?submitted=true`} />
                <input type="hidden" name="_subject" value="New Partnership Request - HighFive Enterprises" />

                {/* Full Name (required) */}
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="flex items-center gap-1">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    id="full_name" 
                    name="full_name"
                    type="text"
                    placeholder="John Doe" 
                    required
                    className="w-full"
                  />
                </div>

                {/* Collaboration Type Dropdown (required) */}
                <div className="space-y-2">
                  <Label htmlFor="collaboration_type" className="flex items-center gap-1">
                    Collaboration Type <span className="text-destructive">*</span>
                  </Label>
                  <select 
                    id="collaboration_type" 
                    name="collaboration_type"
                    required
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    <option value="" disabled selected>Select collaboration type</option>
                    {COLLABORATION_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Company Name (required) */}
                <div className="space-y-2">
                  <Label htmlFor="company_name" className="flex items-center gap-1">
                    Company Name <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    id="company_name" 
                    name="company_name"
                    type="text"
                    placeholder="Your Company Name" 
                    required
                    className="w-full"
                  />
                </div>

                {/* Two-column layout for email and phone */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-1">
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email" 
                      placeholder="you@company.com" 
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-1">
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <Input 
                      id="phone" 
                      name="phone"
                      type="tel"
                      placeholder="+91 123 456 7890" 
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Website URL (optional) */}
                <div className="space-y-2">
                  <Label htmlFor="website_url" className="flex items-center gap-1">
                    Website URL <span className="text-muted-foreground text-xs">(optional)</span>
                  </Label>
                  <Input 
                    id="website_url" 
                    name="website_url"
                    type="url"
                    placeholder="https://yourcompany.com" 
                    className="w-full"
                  />
                </div>

                {/* Two-column layout for business type and country */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="business_type" className="flex items-center gap-1">
                      Business Type / Industry <span className="text-destructive">*</span>
                    </Label>
                    <select 
                      id="business_type" 
                      name="business_type"
                      required
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      <option value="" disabled selected>Select industry</option>
                      {BUSINESS_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center gap-1">
                      Location <span className="text-destructive">*</span>
                    </Label>
                    <Input 
                      id="location" 
                      name="location"
                      type="text"
                      placeholder="e.g., Chennai, Puducherry" 
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Message / Why you want to partner (required) */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="flex items-center gap-1">
                    Message / Why you want to partner <span className="text-destructive">*</span>
                  </Label>
                  <Textarea 
                    id="message" 
                    name="message"
                    rows={5} 
                    placeholder="Tell us about your organization, why you're interested in partnering with HighFive Enterprises, and what collaboration opportunities you envision..." 
                    required
                    className="w-full resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Share your vision for partnership, areas of collaboration, and specific goals you'd like to discuss.
                  </p>
                </div>

                {/* Submit buttons */}
                <div className="flex gap-3 pt-2">
                  <Button type="submit" size="lg" className="flex-1 sm:flex-none">
                    Submit Partnership Request
                  </Button>
                  <Button type="button" size="lg" variant="outline" asChild>
                    <a href="/our-network">Cancel</a>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
