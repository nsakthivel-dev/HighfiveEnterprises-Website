import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Star, MessageSquare } from "lucide-react";
import type { Feedback } from "@/types/Feedback";
import { format } from "date-fns";

export default function FeedbackDisplay() {
  const [showAllModal, setShowAllModal] = useState(false);

  const { data: feedbackList = [], isLoading } = useQuery<Feedback[]>({
    queryKey: ["feedback"],
    queryFn: async () => {
      const res = await fetch("/api/feedback");
      if (!res.ok) throw new Error("Failed to load feedback");
      return res.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds to show new feedback
  });

  const latestFeedback = feedbackList.slice(0, 5);
  
  // Calculate average rating
  const averageRating = feedbackList.length > 0
    ? feedbackList.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbackList.length
    : 0;

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const FeedbackCard = ({ feedback, compact = false }: { feedback: Feedback; compact?: boolean }) => (
    <Card className="overflow-visible hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-semibold">{feedback.name || "Anonymous"}</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(feedback.created_at || new Date()), "MMM dd, yyyy")}
            </p>
          </div>
          {renderStars(feedback.rating)}
        </div>
        <p className={`text-sm text-muted-foreground ${compact ? "line-clamp-2" : ""}`}>
          {feedback.message}
        </p>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Loading feedback...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (feedbackList.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No feedback yet. Be the first to share your thoughts!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Customer Feedback
          </CardTitle>
          <CardDescription>
            See what our clients are saying about us
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Rating Display */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Overall Rating</p>
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-4xl font-bold">{averageRating.toFixed(1)}</span>
              <div className="flex flex-col items-start">
                {renderStars(Math.round(averageRating))}
                <span className="text-xs text-muted-foreground mt-1">
                  Based on {feedbackList.length} review{feedbackList.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Latest Feedback */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Latest Reviews</h3>
            {latestFeedback.map((feedback) => (
              <FeedbackCard key={feedback.id} feedback={feedback} compact />
            ))}
          </div>

          {feedbackList.length > 5 && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowAllModal(true)}
            >
              View All Feedback ({feedbackList.length} total)
            </Button>
          )}
        </CardContent>
      </Card>

      <Dialog open={showAllModal} onOpenChange={setShowAllModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>All Customer Feedback</DialogTitle>
            <DialogDescription>
              Browse through all the feedback we've received from our valued clients
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto space-y-4 pr-2">
            {feedbackList.map((feedback) => (
              <FeedbackCard key={feedback.id} feedback={feedback} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
