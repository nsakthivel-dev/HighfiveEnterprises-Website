import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ExternalLink, Users, Tag, X, Clock, Award, Building } from "lucide-react";
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
  const isCompleted = event.status === 'completed';

  // Format date for display
  const formattedDate = format(eventDate, 'EEEE, MMMM d, yyyy');
  const formattedTime = format(eventDate, 'h:mm a');

  // Parse organizers and participants
  let organizersList: string[] = [];
  let participantsList: string[] = [];
  let tagsArray: string[] = [];

  if (event.organizers) {
    let organizersArray: string[] = [];
    
    // Handle both array and string types that might come from API
    if (Array.isArray(event.organizers)) {
      organizersArray = event.organizers;
    } else if (typeof event.organizers === 'string') {
      const orgString = event.organizers as unknown as string;
      if (orgString && typeof orgString === 'string') {
        organizersArray = orgString.split(',').map((item: string) => item.trim());
      }
    }

    organizersList = organizersArray.filter((org: string) => !org.startsWith('[PARTICIPANT]') && org.trim() !== '');
    participantsList = organizersArray
      .filter((org: string) => org.startsWith('[PARTICIPANT]'))
      .map((org: string) => org.replace('[PARTICIPANT]', '').trim())
      .filter((org: string) => org.trim() !== '');
  }

  if (event.tags) {
    if (Array.isArray(event.tags)) {
      tagsArray = event.tags.filter(Boolean);
    } else if (typeof event.tags === 'string') {
      tagsArray = event.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Event Details</DialogTitle>
          <DialogDescription>
            Details about the selected event including date, location, description, and participants.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          {/* Header with close button and image */}
          <div className="relative">
            {event.image_url ? (
              <div className="w-full max-h-96">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-auto max-h-96 object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
            ) : (
              <div className="bg-gradient-to-r from-primary to-secondary min-h-48 flex items-center justify-center">
                <h2 className="text-3xl font-bold text-white">{event.title}</h2>
              </div>
            )}
            
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="bg-white/90 hover:bg-white backdrop-blur-sm rounded-full shadow-lg"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge
                  variant={isUpcoming ? "default" : isOngoing ? "secondary" : "outline"}
                  className="text-sm px-3 py-1"
                >
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </Badge>
                {event.featured && (
                  <Badge variant="outline" className="text-sm px-3 py-1 border-yellow-500 text-yellow-300">
                    <Award className="w-4 h-4 mr-1" />
                    Featured Event
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">{event.title}</h1>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 md:p-5">
            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-full bg-primary/10">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date</p>
                  <p className="font-medium text-sm">{formattedDate}</p>
                </div>
              </div>

              {event.location && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-full bg-primary/10">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Location</p>
                    <p className="font-medium text-sm">{event.location}</p>
                  </div>
                </div>
              )}

              {event.category && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Tag className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Category</p>
                    <p className="font-medium text-sm">{event.category}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-full bg-primary/10">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Participants</p>
                  <p className="font-medium text-sm">{participantsList.length}</p>
                </div>
              </div>
            </div>

            {/* Separate Organizers and Participants */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 text-primary">Event Participants & Organizers</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Organizers Section */}
                <div className="border rounded-md p-3 bg-gradient-to-br from-blue-50/50 to-blue-100/30">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-full bg-blue-100">
                      <Building className="w-4 h-4 text-blue-600" />
                    </div>
                    <h4 className="text-base font-semibold text-blue-700">Organizers</h4>
                  </div>
                  <div className="ml-2">
                    {organizersList.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {organizersList.map((org, index) => (
                          <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm bg-blue-100 text-blue-800 hover:bg-blue-200">
                            {org}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No organizers specified</p>
                    )}
                  </div>
                </div>
                
                {/* Participants Section */}
                <div className="border rounded-md p-3 bg-gradient-to-br from-green-50/50 to-green-100/30">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-full bg-green-100">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <h4 className="text-base font-semibold text-green-700">Participants</h4>
                  </div>
                  <div className="ml-2">
                    {participantsList.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {participantsList.map((participant, index) => (
                          <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm bg-green-100 text-green-800 hover:bg-green-200">
                            {participant}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No participants specified</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Event Description */}
            {event.description && (
              <div className="mb-5">
                <h3 className="text-lg font-bold mb-2 text-primary">About This Event</h3>
                <div className="prose prose-lg max-w-none bg-muted/30 p-4 rounded-lg">
                  <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              </div>
            )}

            {/* Experience */}
            {event.experience && (
              <div className="mb-5">
                <h3 className="text-lg font-bold mb-2 text-primary">Experience</h3>
                <div className="prose prose-lg max-w-none bg-muted/30 p-4 rounded-lg">
                  <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                    {event.experience}
                  </p>
                </div>
              </div>
            )}

            {/* Tags */}
            {tagsArray.length > 0 && (
              <div className="mb-5">
                <h3 className="text-lg font-bold mb-2 text-primary">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {tagsArray.map((tag, index) => (
                    <Badge key={index} variant="outline" className="px-2 py-1 text-xs">
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
                  className="w-full md:w-auto px-8 py-6 text-lg"
                  onClick={() => {
                    if (event.registration_url) {
                      window.open(event.registration_url, '_blank');
                    }
                  }}
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Register for This Event
                </Button>
              </div>
            )}

            {/* Event Status Message */}
            {isCompleted && (
              <div className="text-center py-6 text-muted-foreground bg-muted/30 rounded-xl mt-6">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>This event has been completed.</span>
                </div>
              </div>
            )}

            {isOngoing && (
              <div className="text-center py-6 text-green-600 font-medium bg-green-50 rounded-xl mt-6">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>This event is currently ongoing!</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
