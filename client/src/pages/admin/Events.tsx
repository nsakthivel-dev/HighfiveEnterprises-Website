import { useState } from "react";
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
import { Calendar, Clock, MapPin, Edit, Trash2, Plus, ExternalLink, Upload, X } from "lucide-react";
import { format } from "date-fns";
import type { Event, EventFormData } from "@/types/Event";
import AdminLayout from "@/components/AdminLayout";

export default function AdminEvents() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [uploading, setUploading] = useState(false);
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
    tags: ""
  });

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
      tags: ""
    });
    setSelectedEvent(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
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
    setFormData({
      title: event.title,
      description: event.description || "",
      event_date: event.event_date ? format(new Date(event.event_date), "yyyy-MM-dd") : "",
      location: event.location || "",
      image_url: event.image_url || "",
      category: event.category || "",
      status: event.status || "upcoming",
      featured: event.featured || false,
      organizers: Array.isArray(event.organizers) ? event.organizers.join(", ") : "",
      tags: Array.isArray(event.tags) ? event.tags.join(", ") : ""
    });
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

        {!isLoading && events.map((event) => (
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
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{event.category || "General"}</span>
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
        ))}
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

              <div>
                <Label htmlFor="organizers">Organizers (comma-separated for multiple)</Label>
                <Textarea
                  id="organizers"
                  value={formData.organizers}
                  onChange={(e) => setFormData({ ...formData, organizers: e.target.value })}
                  placeholder="Organization 1, Organization 2, Organization 3"
                  rows={2}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Enter multiple organizations separated by commas
                </p>
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