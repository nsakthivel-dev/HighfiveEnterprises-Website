import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/AdminLayout";

const AdminDashboard = () => {
  return (
    <AdminLayout 
      title="Admin Dashboard" 
      description="Manage your website content from this central dashboard."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Team Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Manage team members, their roles, and profiles.
            </p>
            <div className="mt-4">
              <a href="/admin-panel/team" className="text-sm text-blue-600 hover:underline">
                Go to Team →
              </a>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Projects Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Add, edit, or remove projects from your portfolio.
            </p>
            <div className="mt-4">
              <a href="/admin-panel/projects" className="text-sm text-blue-600 hover:underline">
                Go to Projects →
              </a>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Activity Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Manage activity and news updates for your website.
            </p>
            <div className="mt-4">
              <a href="/admin-panel/activity" className="text-sm text-blue-600 hover:underline">
                Go to Activity →
              </a>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Services Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Update the services your company offers.
            </p>
            <div className="mt-4">
              <a href="/admin-panel/services" className="text-sm text-blue-600 hover:underline">
                Go to Services →
              </a>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Events Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Manage events, conferences, and meetups your company participates in.
            </p>
            <div className="mt-4">
              <a href="/admin-panel/events" className="text-sm text-blue-600 hover:underline">
                Go to Events →
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Admin Panel Guide</CardTitle>
          <CardDescription>How to use the admin panel effectively</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Team Management</h3>
              <p className="text-sm text-muted-foreground">
                Add team members with their name, role, bio, and profile picture. You can edit or remove team members as needed.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">Projects Management</h3>
              <p className="text-sm text-muted-foreground">
                Showcase your work by adding projects with details like title, description, technologies used, and images.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">Activity Updates</h3>
              <p className="text-sm text-muted-foreground">
                Keep your audience informed about company news, achievements, and updates.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">Services Management</h3>
              <p className="text-sm text-muted-foreground">
                Define the services your company offers with detailed descriptions and features.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminDashboard;