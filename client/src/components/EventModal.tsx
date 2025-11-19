import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ExternalLink, Users, Tag, X } from "lucide-react";
import { format } from "date-fns";
import type { Event } from "@/types/Event";

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EventModal({ event, isOpen, onClose }: EventModalProps) {
  if (!event) return null;

  const eventDate = new Date(event.event_date);
  const isUpcoming = event.status === 'upcoming';
  const isOngoing = event.status === 'ongoing';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={isUpcoming ? "default" : isOngoing ? "secondary" : "outline"}
                  className="text-sm"
                >
                  {event.status}
                </Badge>
                {event.featured && (
                  <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                    <Users className="w-3 h-3 mr-1" />
                    Featured Event
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-2xl font-bold leading-tight">
                {event.title}
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Image */}
          {event.image_url && (
            <div className="aspect-video rounded-lg overflow-hidden">
              <img
                src={event.image_url || ''}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Event Details */}
          <div className="grid gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{format(eventDate, 'EEEE, MMMM d, yyyy')}</p>
              </div>
            </div>

            {event.location && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{event.location}</p>
                </div>
              </div>
            )}

            {event.organizer && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Organizer</p>
                  <p className="font-medium">{event.organizer}</p>
                </div>
              </div>
            )}

            {event.category && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Tag className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{event.category}</p>
                </div>
              </div>
            )}
          </div>

          {/* Event Description */}
          {event.description && (
            <div className="space-y-2">
              <h3 className="font-semibold">About This Event</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Registration Button */}
          {event.registration_url && isUpcoming && (
            <div className="pt-4">
              <Button
                size="lg"
                className="w-full"
                onClick={() => window.open(event.registration_url, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Register for This Event
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}