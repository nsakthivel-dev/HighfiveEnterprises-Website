import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Star } from "lucide-react";
import type { FeedbackFormData } from "@/types/Feedback";
import { useToast } from "@/hooks/use-toast";

interface FeedbackFormProps {
  projectId?: string | null;
}

export default function FeedbackForm({ projectId }: FeedbackFormProps = {}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FeedbackFormData>({
    name: "",
    email: "",
    rating: 0,
    message: "",
    project_id: projectId || null,
  });
  const [hoveredRating, setHoveredRating] = useState(0);

  const submitMutation = useMutation({
    mutationFn: async (data: FeedbackFormData) => {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          project_id: projectId || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit feedback");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
      toast({
        title: "Thank you for your feedback!",
        description: "Your feedback has been submitted successfully.",
      });
      setFormData({
        name: "",
        email: "",
        rating: 0,
        message: "",
        project_id: projectId || null,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (formData.message.trim().length < 10) {
      toast({
        title: "Message Too Short",
        description: "Please provide at least 10 characters in your feedback message.",
        variant: "destructive",
      });
      return;
    }

    submitMutation.mutate(formData);
  };

  return (
    <Card className="overflow-visible">
      <CardHeader>
        <CardTitle>Share Your Feedback</CardTitle>
        <CardDescription>
          We value your opinion! Let us know how we're doing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name (Optional)</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your name (or leave blank for Anonymous)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label>Rating *</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredRating || formData.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {formData.rating > 0 && (
              <p className="text-sm text-muted-foreground">
                You rated: {formData.rating} star{formData.rating !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Your Feedback *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Share your thoughts, suggestions, or experience with us..."
              rows={4}
              required
            />
            <p className="text-xs text-muted-foreground">
              {formData.message.length} characters (minimum 10 required)
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
