import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ExternalLink, Users } from "lucide-react";
import { format } from "date-fns";
import type { Event } from "@/types/Event";

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  const eventDate = new Date(event.event_date);
  const isUpcoming = event.status === 'upcoming';
  const isOngoing = event.status === 'ongoing';
  const isCompleted = event.status === 'completed';

  // Calculate participant count for display
  let participantCount = 0;
  if (event.organizers) {
    if (Array.isArray(event.organizers)) {
      participantCount = event.organizers.filter(org => org.startsWith('[PARTICIPANT]')).length;
    } else if (typeof event.organizers === 'string') {
      const orgString = event.organizers as unknown as string;
      participantCount = orgString.split(',').filter((org: string) => org.trim().startsWith('[PARTICIPANT]')).length;
    }
  }

  return (
    <Card className="h-full border-primary/20 hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden rounded-2xl">
      <CardContent className="p-0">
        {/* Event Image */}
        {event.image_url ? (
          <div className="relative aspect-video overflow-hidden">
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute top-4 right-4 flex gap-2">
              <Badge
                variant={isUpcoming ? "default" : isOngoing ? "secondary" : "outline"}
                className="text-xs backdrop-blur-sm px-2.5 py-1"
              >
                {event.status}
              </Badge>
              {event.featured && (
                <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-300 backdrop-blur-sm px-2.5 py-1">
                  <Users className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
          </div>
        ) : (
          <div className="relative aspect-video bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
            <div className="absolute top-4 right-4 flex gap-2">
              <Badge
                variant={isUpcoming ? "default" : isOngoing ? "secondary" : "outline"}
                className="text-xs px-2.5 py-1"
              >
                {event.status}
              </Badge>
              {event.featured && (
                <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-600 px-2.5 py-1">
                  <Users className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            <h3 className="text-xl font-bold text-center px-4 text-primary">{event.title}</h3>
          </div>
        )}

        {/* Event Content */}
        <div className="p-5 space-y-4">
          {/* Event Title */}
          <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>

          {/* Event Date and Location */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{format(eventDate, 'MMMM d, yyyy')}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            )}
            {participantCount > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{participantCount} participants</span>
              </div>
            )}
          </div>

          {/* Event Description */}
          {event.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {event.description}
            </p>
          )}

          {/* Event Category and Tags */}
          <div className="flex flex-wrap gap-2">
            {event.category && (
              <Badge variant="outline" className="text-xs px-2 py-1">
                {event.category}
              </Badge>
            )}
            {event.tags && event.tags.length > 0 && (
              <Badge variant="secondary" className="text-xs px-2 py-1">
                {event.tags[0]}
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              View Details
            </Button>
            
            {event.registration_url && isUpcoming && (
              <Button
                variant="default"
                size="sm"
                className="flex-1 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  if (event.registration_url) {
                    window.open(event.registration_url, '_blank');
                  }
                }}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Register
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}