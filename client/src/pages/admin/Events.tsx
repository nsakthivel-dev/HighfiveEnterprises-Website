import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MapPin, Edit, Trash2, Plus, ExternalLink, Upload, X, Users, Building, Info, FileText, Image as ImageIcon, Award } from "lucide-react";
import { format } from "date-fns";
import type { Event, EventFormData } from "@/types/Event";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";

export default function AdminEvents() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  
  // Team members state
  const [teamMembers, setTeamMembers] = useState<{id: string, name: string}[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

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
      toast({ title: "Success", description: "Event created successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
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
      toast({ title: "Success", description: "Event updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
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
      toast({ title: "Success", description: "Event deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
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
    setActiveTab("basic");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine organizers and participants
    const participantList = selectedParticipants.map(id => {
      const member = teamMembers.find(m => m.id === id);
      return member ? `[PARTICIPANT] ${member.name}` : "";
    }).filter(Boolean);
    
    const allOrganizers = [
      ...formData.organizers.split(",").map(org => org.trim()).filter(Boolean),
      ...participantList
    ].join(", ");

    const dataToSubmit: EventFormData = {
      ...formData,
      organizers: allOrganizers,
      status: formData.status as 'upcoming' | 'ongoing' | 'completed',
    };

    if (selectedEvent) {
      updateMutation.mutate({ id: selectedEvent.id!, data: dataToSubmit });
    } else {
      createMutation.mutate(dataToSubmit);
    }
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    
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
      organizers: Array.isArray(event.organizers) ? event.organizers.filter(o => !o.startsWith('[PARTICIPANT]')).join(", ") : (typeof event.organizers === 'string' ? event.organizers.split(',').filter(o => !o.trim().startsWith('[PARTICIPANT]')).join(', ') : ""),
      tags: Array.isArray(event.tags) ? event.tags.join(", ") : (typeof event.tags === 'string' ? event.tags : ""),
      experience: experience
    });
    
    // Extract participants
    const participants: string[] = [];
    if (Array.isArray(event.organizers)) {
      participants.push(...event.organizers.filter(o => o.startsWith('[PARTICIPANT]')).map(o => o.replace('[PARTICIPANT] ', '')));
    } else if (typeof event.organizers === 'string') {
      participants.push(...event.organizers.split(',').filter(o => o.trim().startsWith('[PARTICIPANT]')).map(o => o.replace('[PARTICIPANT] ', '').trim()));
    }
    
    const participantIds = participants.map(name => {
      const member = teamMembers.find(m => m.name === name);
      return member?.id;
    }).filter(Boolean) as string[];
    
    setSelectedParticipants(participantIds);
    setActiveTab("basic");
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

  const handleImageUpload = async (file: File) => {
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
        toast({ title: "Success", description: "Image uploaded successfully" });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast({ title: "Error", description: "Image upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout title="Events Management" description="Create, edit, and manage events">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Events & Activities</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage your organization's events and conferences</p>
          </div>
          <Button onClick={() => { setIsFormOpen(true); resetForm(); }} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>

        <Separator />

        <div className="grid gap-6">
        {isLoading && (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-muted-foreground">Loading events...</div>
            </CardContent>
          </Card>
        )}

        {!isLoading && events.length === 0 && (
          <Card className="p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No events yet</h3>
            <p className="text-sm text-muted-foreground mb-6">Start by creating your first event</p>
            <Button onClick={() => { setIsFormOpen(true); resetForm(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Event
            </Button>
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
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row">
                {event.image_url && (
                  <div className="md:w-48 h-48 md:h-auto bg-muted flex-shrink-0">
                    <img 
                      src={event.image_url} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{event.title}</h3>
                        <Badge variant={event.status === "upcoming" ? "default" : event.status === "ongoing" ? "secondary" : "outline"}>
                          {event.status}
                        </Badge>
                        {event.featured && (
                          <Badge variant="secondary" className="bg-yellow-500 text-yellow-900">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{event.event_date ? format(new Date(event.event_date), "MMM dd, yyyy") : "TBD"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="truncate">{event.location || "Location TBD"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{participantCount} participants</span>
                    </div>
                  </div>
                  
                  {event.category && (
                    <Badge variant="outline" className="mb-3">{event.category}</Badge>
                  )}
                  
                  <div className="flex gap-2">
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
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      </div>

      {/* Event Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => { if (!open) { setIsFormOpen(false); resetForm(); } }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-2xl">
              {selectedEvent ? "Edit Event" : "Create New Event"}
            </DialogTitle>
            <DialogDescription>
              {selectedEvent ? "Update event details" : "Add a new event to showcase"}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
              <div className="px-6 border-b">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic" className="gap-2">
                    <Info className="w-4 h-4" />
                    <span className="hidden sm:inline">Basic</span>
                  </TabsTrigger>
                  <TabsTrigger value="details" className="gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">Details</span>
                  </TabsTrigger>
                  <TabsTrigger value="participants" className="gap-2">
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline">Team</span>
                  </TabsTrigger>
                  <TabsTrigger value="media" className="gap-2">
                    <ImageIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Media</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="overflow-y-auto max-h-[calc(90vh-240px)] px-6 py-6">
                {/* Tab 1: Basic Information */}
                <TabsContent value="basic" className="space-y-4 mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="title">
                        Event Title <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter event title"
                        required
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="event_date">Event Date</Label>
                      <Input
                        id="event_date"
                        type="date"
                        value={formData.event_date}
                        onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Event venue or online platform"
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g., Conference, Workshop, Meetup"
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="status">Event Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value as 'upcoming' | 'ongoing' | 'completed' })}
                      >
                        <SelectTrigger id="status" className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="ongoing">Ongoing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="tech, conference, workshop, networking"
                        className="mt-1.5"
                      />
                    </div>

                    <div className="col-span-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="featured" className="cursor-pointer">
                        Mark as Featured Event
                      </Label>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Tab 2: Details */}
                <TabsContent value="details" className="space-y-4 mt-0">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="description">Event Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Provide a detailed description of the event..."
                        rows={4}
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="experience">Experience & Learnings</Label>
                      <Textarea
                        id="experience"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        placeholder="Share the key takeaways, learnings, and experiences from this event..."
                        rows={4}
                        className="mt-1.5"
                      />
                      <p className="text-xs text-muted-foreground mt-1.5">
                        What did participants learn? What was the impact?
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="organizers">
                        <Building className="w-4 h-4 inline mr-1" />
                        Organizing Bodies
                      </Label>
                      <Textarea
                        id="organizers"
                        value={formData.organizers}
                        onChange={(e) => setFormData({ ...formData, organizers: e.target.value })}
                        placeholder="IEEE, IE, ACM, Company Name (comma-separated)"
                        rows={2}
                        className="mt-1.5"
                      />
                      <p className="text-xs text-muted-foreground mt-1.5">
                        List colleges, companies, or organizations that organized this event
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Tab 3: Participants */}
                <TabsContent value="participants" className="space-y-4 mt-0">
                  <div className="space-y-4">
                    <div>
                      <Label>Team Members as Participants</Label>
                      <p className="text-xs text-muted-foreground mb-3">
                        Select team members who participated in this event
                      </p>
                      <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto border rounded-lg p-3">
                        {teamMembers.length === 0 ? (
                          <p className="col-span-2 text-sm text-muted-foreground text-center py-4">
                            No team members available
                          </p>
                        ) : (
                          teamMembers.map((member) => (
                            <label 
                              key={member.id}
                              className="flex items-center gap-3 p-2.5 rounded-md border cursor-pointer hover:bg-accent transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={selectedParticipants.includes(member.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedParticipants([...selectedParticipants, member.id]);
                                  } else {
                                    setSelectedParticipants(selectedParticipants.filter(id => id !== member.id));
                                  }
                                }}
                                className="rounded"
                              />
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium flex-shrink-0">
                                  {member.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium truncate">{member.name}</span>
                              </div>
                            </label>
                          ))
                        )}
                      </div>
                      {selectedParticipants.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {selectedParticipants.length} participant(s) selected
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                {/* Tab 4: Media */}
                <TabsContent value="media" className="space-y-4 mt-0">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="image_url">Event Image</Label>
                      <div className="space-y-2 mt-1.5">
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
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) handleImageUpload(file);
                              };
                              input.click();
                            }}
                            disabled={uploading}
                          >
                            {uploading ? "Uploading..." : <Upload className="w-4 h-4" />}
                          </Button>
                        </div>
                        {formData.image_url && (
                          <div className="relative">
                            <img
                              src={formData.image_url}
                              alt="Event image preview"
                              className="rounded-lg border w-full object-cover aspect-video"
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
                      <p className="text-xs text-muted-foreground mt-1.5">
                        Upload a banner or photo from the event
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <div className="px-6 py-4 border-t bg-muted/30 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {!formData.title.trim() && (
                  <span className="text-destructive">* Event title is required</span>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsFormOpen(false);
                    resetForm();
                  }}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={!formData.title.trim() || createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      {selectedEvent ? "Update Event" : "Create Event"}
                    </>
                  )}
                </Button>
              </div>
            </div>
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
              {deleteMutation.isPending ? "Deleting..." : "Delete Event"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}