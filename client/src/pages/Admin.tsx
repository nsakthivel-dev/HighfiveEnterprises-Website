import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, Briefcase, TrendingUp, Eye } from "lucide-react";

export default function Admin() {
  const stats = [
    { label: "Total Projects", value: "150", icon: <Briefcase className="w-5 h-5" />, trend: "+12%" },
    { label: "Team Members", value: "8", icon: <Users className="w-5 h-5" />, trend: "+2" },
    { label: "Active Clients", value: "45", icon: <TrendingUp className="w-5 h-5" />, trend: "+8%" },
    { label: "Monthly Views", value: "12.5K", icon: <Eye className="w-5 h-5" />, trend: "+23%" },
  ];

  const recentProjects = [
    { name: "E-Commerce Platform", views: 1234, status: "completed" },
    { name: "Mobile Banking App", views: 987, status: "active" },
    { name: "Corporate Website", views: 856, status: "completed" },
    { name: "SaaS Platform", views: 645, status: "active" },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your projects and team members</p>
            </div>
            <Badge variant="secondary">Demo Mode</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="overflow-visible">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {stat.icon}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {stat.trend}
                  </Badge>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="overflow-visible">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Most Viewed Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-muted-foreground">{project.views} views</p>
                      </div>
                    </div>
                    <Badge variant={project.status === "completed" ? "default" : "secondary"}>
                      {project.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-visible">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" data-testid="button-add-project">
                <Briefcase className="w-4 h-4 mr-2" />
                Add New Project
              </Button>
              <Button variant="outline" className="w-full justify-start" data-testid="button-add-member">
                <Users className="w-4 h-4 mr-2" />
                Add Team Member
              </Button>
              <Button variant="outline" className="w-full justify-start" data-testid="button-view-analytics">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Full Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start" data-testid="button-export">
                <TrendingUp className="w-4 h-4 mr-2" />
                Export Portfolio PDF
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-visible">
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Full content management features including drag-and-drop reordering, bulk uploads, and version history will be available in the full implementation.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" data-testid="button-manage-projects">
                Manage Projects
              </Button>
              <Button variant="secondary" data-testid="button-manage-team">
                Manage Team
              </Button>
              <Button variant="secondary" data-testid="button-settings">
                Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
