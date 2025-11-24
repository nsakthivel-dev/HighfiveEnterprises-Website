import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import AdminLayout from "@/components/AdminLayout";

// Define the activity type
interface Activity {
  id: string;
  type: string;
  title: string;
  created_at: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();

  // Fetch recent activities
  const { data: activities = [], isLoading, refetch } = useQuery<Activity[]>({
    queryKey: ["activities"],
    queryFn: async () => {
      const response = await fetch("/api/activity");
      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }
      const data = await response.json();
      // Return only the last 7 activities
      return data.slice(0, 7);
    },
    staleTime: 0, // Ensure fresh data is always fetched
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Extract admin name from email
  const getAdminName = () => {
    if (!user?.email) return "Admin";
    
    // Map of admin emails to names and roles
    const adminMap: Record<string, { name: string; role: string }> = {
      "nsakthiveldev@gmail.com": { name: "Sakthivel", role: "Founder" },
      "aaminathamiz@gmail.com": { name: "Aamina", role: "Client Manager" },
      "hiteshreem2007@gmail.com": { name: "Hiteshree", role: "HR" },
      "hariharan.b17706@gmail.com": { name: "Hariharan", role: "CTO" },
      "fazeelaofficial1609@gmail.com": { name: "Fazeela", role: "CFO" },
      "arjungova111@gmail.com": { name: "Arjun", role: "Brand Ambassador" }
    };
    
    // Check if the email exists in our map
    if (adminMap[user.email]) {
      return `${adminMap[user.email].name} (${adminMap[user.email].role})`;
    }
    
    // Fallback to extracting name from email (before @ symbol)
    const emailName = user.email.split("@")[0];
    
    // Convert to proper case (capitalize first letter of each word)
    return emailName
      .split(".")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <AdminLayout 
      title="Dashboard" 
      description="Manage your website content"
    >
      {/* Welcome section - more compact */}
      <div className="mb-4 p-4 bg-muted/50 rounded-lg border">
        <h2 className="text-lg font-semibold mb-1">Welcome, {getAdminName()}!</h2>
        <p className="text-sm text-muted-foreground">
          Quick access to all management sections
        </p>
      </div>

      {/* Compact grid layout */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 mb-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Team</CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-xs text-muted-foreground mb-3">
              Manage members and roles
            </p>
            <a href="/admin-panel/team" className="text-sm text-primary hover:underline font-medium">
              Manage →
            </a>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Projects</CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-xs text-muted-foreground mb-3">
              Portfolio and work showcase
            </p>
            <a href="/admin-panel/projects" className="text-sm text-primary hover:underline font-medium">
              Manage →
            </a>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Activity</CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-xs text-muted-foreground mb-3">
              News and updates
            </p>
            <a href="/admin-panel/activity" className="text-sm text-primary hover:underline font-medium">
              Manage →
            </a>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Services</CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-xs text-muted-foreground mb-3">
              Company offerings
            </p>
            <a href="/admin-panel/services" className="text-sm text-primary hover:underline font-medium">
              Manage →
            </a>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Events</CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-xs text-muted-foreground mb-3">
              Conferences and meetups
            </p>
            <a href="/admin-panel/events" className="text-sm text-primary hover:underline font-medium">
              Manage →
            </a>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Packages</CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-xs text-muted-foreground mb-3">
              Service packages
            </p>
            <a href="/admin-panel/packages" className="text-sm text-primary hover:underline font-medium">
              Manage →
            </a>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Network</CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-xs text-muted-foreground mb-3">
              Partners and connections
            </p>
            <a href="/admin-panel/network" className="text-sm text-primary hover:underline font-medium">
              Manage →
            </a>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent activities - more compact */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Changes</CardTitle>
              <CardDescription className="text-xs">Last 7 activities</CardDescription>
            </div>
            <button 
              onClick={() => refetch()}
              className="text-xs text-primary hover:underline font-medium"
            >
              Refresh
            </button>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : activities.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activities</p>
          ) : (
            <div className="space-y-2">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-2 p-2 rounded-md border bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.type} • {new Date(activity.created_at).toLocaleDateString()} {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminDashboard;