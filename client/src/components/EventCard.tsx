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

  return (
    <Card className="h-full border-primary/20 hover-elevate transition-all cursor-pointer group">
      <CardContent className="p-6 space-y-4" onClick={onClick}>
        {/* Event Image */}
        {event.image_url && (
          <div className="aspect-video rounded-lg overflow-hidden">
            <img
                src={event.image_url || ''}
                alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Event Status Badge */}
        <div className="flex items-center gap-2">
          <Badge
            variant={isUpcoming ? "default" : isOngoing ? "secondary" : "outline"}
            className="text-xs"
          >
            {event.status}
          </Badge>
          {event.featured && (
            <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-600">
              <Users className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>

        {/* Event Title */}
        <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
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
              <span>{event.location}</span>
            </div>
          )}
        </div>

        {/* Event Description */}
        {event.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {event.description}
          </p>
        )}

        {/* Event Category */}
        {event.category && (
          <Badge variant="outline" className="text-xs">
            {event.category}
          </Badge>
        )}

        {/* Registration Button */}
        {event.registration_url && isUpcoming && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              window.open(event.registration_url, '_blank');
            }}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Register Now
          </Button>
        )}
      </CardContent>
    </Card>
  );
}