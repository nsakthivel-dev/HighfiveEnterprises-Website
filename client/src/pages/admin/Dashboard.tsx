import AdminLayout from "@/components/AdminLayout";

const AdminDashboard = () => {
  return (
    <AdminLayout 
      title="Admin Dashboard" 
      description="Manage your website content from this central dashboard."
    >
      <div className="grid gap-6">
        <div className="p-6 bg-background rounded-lg border shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Welcome to the Admin Panel</h2>
          <p className="text-muted-foreground mb-4">
            Use the navigation above to manage different sections of your website:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Manage team members in the <strong>Team</strong> section</li>
            <li>Update your service offerings in the <strong>Services</strong> section</li>
            <li>Add or edit projects in the <strong>Projects</strong> section</li>
            <li>Track recent activities in the <strong>Activity</strong> section</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;