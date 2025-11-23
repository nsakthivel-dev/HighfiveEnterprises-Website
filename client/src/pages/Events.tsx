import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Filter, Search, Users } from "lucide-react";
import EventCard from "@/components/EventCard";
import EventModal from "@/components/EventModal";
import type { Event } from "@/types/Event";

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: events = [],
    isLoading,
    isError,
  } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await fetch("/api/events");
      if (!res.ok) throw new Error("Failed to load events");
      return res.json();
    },
  });

  // Filter events
  const filteredEvents = events.filter((event) => {
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || event.status === selectedStatus;
    const matchesSearch = searchTerm === "" || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesStatus && matchesSearch;
  });

  // Get unique categories
  const categories = Array.from(new Set(events.map(event => event.category).filter(Boolean)));

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6 bg-gradient-to-b from-primary/10 via-transparent to-transparent">
        <div className="absolute inset-0 pointer-events-none opacity-40 flex items-center justify-center">
          <div className="w-[36rem] h-[36rem] bg-primary/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto text-center relative">
          <Badge variant="secondary" className="mb-6 inline-flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Our Events
          </Badge>
          <h1 className="text-5xl font-bold mb-4">Events We Participate In</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the events, conferences, and meetups where HighFive Enterprises participates. 
            Join us in building connections and sharing knowledge with the tech community.
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 px-6 bg-muted/30 border-b">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter Events:</span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg bg-background text-sm w-full md:w-64"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-background text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category || ''}>{category}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-background text-sm"
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {isLoading && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">Loading events...</div>
            </div>
          )}

          {isError && (
            <div className="text-center py-12">
              <div className="text-destructive">Failed to load events. Please try again later.</div>
            </div>
          )}

          {!isLoading && !isError && filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">No events found matching your criteria.</div>
            </div>
          )}

          {!isLoading && !isError && filteredEvents.length > 0 && (
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => handleEventClick(event)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Events Section */}
      {!isLoading && !isError && (
        <section className="py-16 px-6 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-3xl font-bold">Featured Events</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              {filteredEvents
                .filter(event => event.featured)
                .slice(0, 2)
                .map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={() => handleEventClick(event)}
                  />
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Event Modal */}
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}