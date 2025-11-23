import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Calendar, Clock, MapPin, Edit, Trash2, Plus, ExternalLink, Upload, X, Users, Building } from "lucide-react";
import { format } from "date-fns";
import type { Event, EventFormData } from "@/types/Event";
import AdminLayout from "@/components/AdminLayout";

export default function AdminEvents() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Team members state
  const [teamMembers, setTeamMembers] = useState<{id: string, name: string}[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [organizers, setOrganizers] = useState<string>("");
  const [otherParticipants, setOtherParticipants] = useState<string>("");

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    event_date: "",
    location: "",
    image_url: "",
    category: "",
    status: "upcoming",
    featured: false,
    organizers: "",
    tags: "",
    experience: ""
  });

  // Fetch team members
  const { data: apiMembers = [] } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const res = await fetch("/api/team");
      if (!res.ok) throw new Error("Failed to load team members");
      return res.json();
    },
  });

  useEffect(() => {
    const mapped = apiMembers.map((m: any) => ({
      id: m.id,
      name: m.name
    }));
    setTeamMembers(mapped);
  }, [apiMembers]);

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const res = await fetch("/api/admin/events", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
        }
      });
      if (!res.ok) throw new Error("Failed to load events");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to create event");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      setIsFormOpen(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: EventFormData }) => {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to update event");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      setIsFormOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
        }
      });
      if (!res.ok) throw new Error("Failed to delete event");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      setIsDeleteOpen(false);
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      event_date: "",
      location: "",
      image_url: "",
      category: "",
      status: "upcoming",
      featured: false,
      organizers: "",
      tags: "",
      experience: ""
    });
    setSelectedEvent(null);
    setSelectedParticipants([]);
    setOrganizers("");
    setOtherParticipants("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine organizers, participants, and other participants with labels
    const participantList = [
      ...selectedParticipants.map(id => {
        const member = teamMembers.find(m => m.id === id);
        return member ? member.name : "";
      }).filter(Boolean),
      ...otherParticipants.split(",").map(part => part.trim()).filter(Boolean)
    ];
    
    const allOrganizers = [
      ...organizers.split(",").map(org => org.trim()).filter(Boolean),
      ...participantList.map(part => `[PARTICIPANT] ${part}`)
    ].join(", ");

    const dataToSubmit: EventFormData = {
      title: formData.title,
      description: formData.description,
      event_date: formData.event_date,
      location: formData.location,
      image_url: formData.image_url,
      category: formData.category,
      status: formData.status as 'upcoming' | 'ongoing' | 'completed',
      featured: formData.featured,
      organizers: allOrganizers,
      tags: formData.tags,
      experience: formData.experience
    };

    if (selectedEvent) {
      updateMutation.mutate({ id: selectedEvent.id!, data: dataToSubmit });
    } else {
      createMutation.mutate(dataToSubmit);
    }
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    
    // Ensure experience field is handled properly
    const experience = event.experience || "";
    
    setFormData({
      title: event.title,
      description: event.description || "",
      event_date: event.event_date ? format(new Date(event.event_date), "yyyy-MM-dd") : "",
      location: event.location || "",
      image_url: event.image_url || "",
      category: event.category || "",
      status: event.status || "upcoming",
      featured: event.featured || false,
      organizers: Array.isArray(event.organizers) ? event.organizers.join(", ") : (typeof event.organizers === 'string' ? event.organizers : ""),
      tags: Array.isArray(event.tags) ? event.tags.join(", ") : (typeof event.tags === 'string' ? event.tags : ""),
      experience: experience
    });
    
    // For editing, we'll populate the organizers field with all organizers
    // In a more complex implementation, we might separate participants from external organizers
    setOrganizers(Array.isArray(event.organizers) ? event.organizers.join(", ") : (typeof event.organizers === 'string' ? event.organizers : ""));
    setSelectedParticipants([]);
    setOtherParticipants("");
    setIsFormOpen(true);
  };

  const handleDelete = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedEvent) {
      deleteMutation.mutate(selectedEvent.id!);
    }
  };

  // Clear functions for each section
  const clearOrganizers = () => {
    setOrganizers("");
  };

  const clearParticipants = () => {
    setSelectedParticipants([]);
  };

  const clearOtherParticipants = () => {
    setOtherParticipants("");
  };

  return (
    <AdminLayout title="Events Management" description="Create, edit, and manage events">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>

        <div className="grid gap-6">
        {isLoading && (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-muted-foreground">Loading events...</div>
            </CardContent>
          </Card>
        )}

        {!isLoading && events.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-muted-foreground mb-4">No events found</div>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Event
              </Button>
            </CardContent>
          </Card>
        )}

        {!isLoading && events.map((event) => {
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
            <Card key={event.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {event.description?.slice(0, 100)}...
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={event.status === "upcoming" ? "default" : event.status === "ongoing" ? "secondary" : "outline"}>
                      {event.status}
                    </Badge>
                    {event.featured && (
                      <Badge variant="secondary" className="bg-yellow-500 text-yellow-900">
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {event.event_date ? format(new Date(event.event_date), "MMM dd, yyyy") : "TBD"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{event.location || "Location TBD"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{participantCount} participants</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(event)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(event)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      </div>

      {/* Event Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
            <DialogDescription>
              {selectedEvent ? "Update event details" : "Add a new event to showcase"}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Add Experience Section */}
              <div>
                <Label htmlFor="experience">Experience</Label>
                <Textarea
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="Enter the experience gained from this event"
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event_date">Event Date</Label>
                  <Input
                    id="event_date"
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>

              {/* Separate Organizers and Participants Sections */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Organizers
                  </h3>
                  <Button type="button" variant="ghost" size="sm" onClick={clearOrganizers}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div>
                  <Label htmlFor="organizers" className="text-sm text-muted-foreground">College-associated companies like IEEE, IE</Label>
                  <Textarea
                    id="organizers"
                    value={organizers}
                    onChange={(e) => setOrganizers(e.target.value)}
                    placeholder="IEEE, IE, Company Name"
                    rows={2}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Team Members as Participants
                  </h3>
                  <Button type="button" variant="ghost" size="sm" onClick={clearParticipants}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`member-${member.id}`}
                        checked={selectedParticipants.includes(member.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedParticipants([...selectedParticipants, member.id]);
                          } else {
                            setSelectedParticipants(selectedParticipants.filter(id => id !== member.id));
                          }
                        }}
                        className="mr-2"
                      />
                      <Label htmlFor={`member-${member.id}`} className="font-medium">
                        {member.name}
                      </Label>
                    </div>
                  ))}
                  {teamMembers.length === 0 && (
                    <p className="text-sm text-muted-foreground">No team members available</p>
                  )}
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Other Participants
                  </h3>
                  <Button type="button" variant="ghost" size="sm" onClick={clearOtherParticipants}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div>
                  <Label htmlFor="otherParticipants" className="text-sm text-muted-foreground">Other participants (names not required)</Label>
                  <Textarea
                    id="otherParticipants"
                    value={otherParticipants}
                    onChange={(e) => setOtherParticipants(e.target.value)}
                    placeholder="Other students, faculty, guests"
                    rows={2}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image_url">Event Image</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg or upload below"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={async () => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = async (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            setUploading(true);
                            try {
                              const formData = new FormData();
                              formData.append('file', file);
                              const response = await fetch('/api/upload', {
                                method: 'POST',
                                body: formData,
                              });
                              const data = await response.json();
                              if (data.url) {
                                setFormData(prev => ({ ...prev, image_url: data.url }));
                              }
                            } catch (error) {
                              console.error('Upload failed:', error);
                            } finally {
                              setUploading(false);
                            }
                          }
                        };
                        input.click();
                      }}
                      disabled={uploading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Upload'}
                    </Button>
                  </div>
                  {formData.image_url && (
                    <div className="relative">
                      <img
                        src={formData.image_url}
                        alt="Event image preview"
                        className="rounded-lg border w-full object-cover aspect-[16/9]"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => setFormData({ ...formData, image_url: '' })}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="tech, conference, workshop"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as 'upcoming' | 'ongoing' | 'completed' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="mr-2"
                  />
                  <Label htmlFor="featured">Featured Event</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsFormOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {selectedEvent ? "Update Event" : "Create Event"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedEvent?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              Delete Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}