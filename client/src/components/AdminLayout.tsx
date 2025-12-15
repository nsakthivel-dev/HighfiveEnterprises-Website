import { Link, useLocation } from 'wouter';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet';
import { Bell, ChevronLeft, ChevronRight, Handshake, Home, Menu, Package2, Settings, ShoppingCart, Users, Calendar, PackageOpen, FileText } from 'lucide-react';
import logo from '@assets/logos/logo-light.png';
import logoDark from '@assets/logos/logo-dark.png';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Input } from './ui/input';
import { useTheme } from './ThemeProvider';
import { useAuth } from '@/context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const AdminLayout = ({ children, title, description }: AdminLayoutProps) => {
  const [location] = useLocation();
  const { theme } = useTheme();
  const { logout } = useAuth();
  
  const currentLogo = theme === 'dark' ? logoDark : logo;

  const handleLogout = () => {
    logout();
  };

  const navLinks = [
    { href: '/admin-panel/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/admin-panel/activity', icon: ShoppingCart, label: 'Activity' },
    { href: '/admin-panel/services', icon: Package2, label: 'Services' },
    { href: '/admin-panel/packages', icon: PackageOpen, label: 'Packages' },
    { href: '/admin-panel/team', icon: Users, label: 'Team' },
    { href: '/admin-panel/projects', icon: Users, label: 'Projects' },
    { href: '/admin-panel/documents', icon: FileText, label: 'Documents' },
    { href: '/admin-panel/network', icon: Handshake, label: 'Network' },
    { href: '/admin-panel/events', icon: Calendar, label: 'Events' },
  ];

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col">
          <div className="flex h-14 items-center border-b px-3 lg:h-14 lg:px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold text-sm">
              <img src={currentLogo} alt="HighFive Enterprises Logo" className="h-7 w-7 object-contain" />
              <span className="truncate">HighFive</span>
            </Link>
          </div>
          <div className="flex-1 py-2">
            <nav className="grid items-start px-2 text-sm font-medium gap-1">
              {navLinks.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 transition-all hover:bg-muted ${location === href ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col w-[280px]">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex items-center gap-2 mb-4">
                <img src={currentLogo} alt="HighFive Enterprises Logo" className="h-8 w-8 object-contain" />
                <h2 className="text-lg font-semibold">HighFive</h2>
              </div>
              <nav className="grid gap-1 text-sm font-medium">
                {navLinks.map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all ${location === href ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* Add nav items here */}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-3 p-4 lg:p-5">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold md:text-2xl">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="flex flex-1 rounded-lg border shadow-sm bg-background">
            <div className="flex-1 p-4">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;