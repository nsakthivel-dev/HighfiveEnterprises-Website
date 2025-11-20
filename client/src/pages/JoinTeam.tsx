import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function JoinTeam() {
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
      window.history.replaceState({}, '', '/join-team');
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
                  Application Submitted Successfully!
                </h2>
                <p className="text-green-700 dark:text-green-300">
                  Thank you for your interest in joining HighFive Enterprises. We've received your application and will review it shortly.
                </p>
                <div className="pt-4 flex gap-3 justify-center">
                  <Button asChild>
                    <a href="/team">Back to Team</a>
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
                <CardTitle className="text-2xl">Join HighFive Enterprises</CardTitle>
                <a href="/team" className="text-sm text-primary hover:underline">
                  ← Back to Team
                </a>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                We're excited to learn about you! Fill out the form below to apply.
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
                <input type="hidden" name="_next" value={`${window.location.origin}/join-team?submitted=true`} />
                <input type="hidden" name="_subject" value="New Team Application - HighFive Enterprises" />

                {/* Two-column layout for name and email */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-1">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input 
                      id="name" 
                      name="name"
                      type="text"
                      placeholder="John Doe" 
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-1">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email" 
                      placeholder="you@example.com" 
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Two-column layout for role and portfolio */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">
                      Role <span className="text-muted-foreground text-xs">(optional)</span>
                    </Label>
                    <Input 
                      id="role" 
                      name="role"
                      type="text"
                      placeholder="Frontend Developer" 
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portfolio">
                      Portfolio URL <span className="text-muted-foreground text-xs">(optional)</span>
                    </Label>
                    <Input 
                      id="portfolio" 
                      name="portfolio_url"
                      type="url"
                      placeholder="https://yourportfolio.com" 
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Full-width resume URL */}
                <div className="space-y-2">
                  <Label htmlFor="resume">
                    Resume URL <span className="text-muted-foreground text-xs">(optional)</span>
                  </Label>
                  <Input 
                    id="resume" 
                    name="resume_url"
                    type="url"
                    placeholder="Link to Google Drive, Dropbox, or personal website" 
                    className="w-full"
                  />
                </div>

                {/* Two-column layout for GitHub and LinkedIn */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="github">
                      GitHub Profile <span className="text-muted-foreground text-xs">(optional)</span>
                    </Label>
                    <Input 
                      id="github" 
                      name="github_url"
                      type="url"
                      placeholder="https://github.com/yourusername" 
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">
                      LinkedIn Profile <span className="text-muted-foreground text-xs">(optional)</span>
                    </Label>
                    <Input 
                      id="linkedin" 
                      name="linkedin_url"
                      type="url"
                      placeholder="https://linkedin.com/in/yourprofile" 
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Message textarea */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="flex items-center gap-1">
                    Message <span className="text-destructive">*</span>
                  </Label>
                  <Textarea 
                    id="message" 
                    name="message"
                    rows={5} 
                    placeholder="Tell us about yourself, your experience, and why you'd like to join our team..." 
                    required
                    className="w-full resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Share your skills, experience, and what excites you about joining HighFive Enterprises.
                  </p>
                </div>

                {/* Submit buttons */}
                <div className="flex gap-3 pt-2">
                  <Button type="submit" size="lg" className="flex-1 sm:flex-none">
                    Submit Application
                  </Button>
                  <Button 
                    type="reset" 
                    variant="outline" 
                    size="lg"
                    className="flex-1 sm:flex-none"
                  >
                    Reset Form
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center pt-2">
                  By submitting this form, you agree to our{" "}
                  <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
                  {" "}and{" "}
                  <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
                </p>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
