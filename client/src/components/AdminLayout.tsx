import { Link, useLocation } from 'wouter';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Bell, ChevronLeft, ChevronRight, Handshake, Home, Menu, Package2, Settings, ShoppingCart, Users, Calendar, PackageOpen } from 'lucide-react';
import logo from '@assets/logos/logo-light.png';
import logoDark from '@assets/logos/logo-dark.png';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Input } from './ui/input';
import { useTheme } from './ThemeProvider';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const AdminLayout = ({ children, title, description }: AdminLayoutProps) => {
  const [location] = useLocation();
  const { theme } = useTheme();
  const currentLogo = theme === 'dark' ? logoDark : logo;

  const navLinks = [
    { href: '/admin-panel/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/admin-panel/activity', icon: ShoppingCart, label: 'Activity' },
    { href: '/admin-panel/services', icon: Package2, label: 'Services' },
    { href: '/admin-panel/packages', icon: PackageOpen, label: 'Packages' },
    { href: '/admin-panel/team', icon: Users, label: 'Team' },
    { href: '/admin-panel/projects', icon: Users, label: 'Projects' },
    { href: '/admin-panel/network', icon: Handshake, label: 'Network' },
    { href: '/admin-panel/events', icon: Calendar, label: 'Events' },
  ];

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <img src={currentLogo} alt="HighFive Enterprises Logo" className="h-8 w-8 object-contain" />
              <span className="">HighFive Enterprises</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navLinks.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${location === href ? 'bg-muted text-primary' : ''}`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Card>
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
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
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <img src={currentLogo} alt="HighFive Enterprises Logo" className="h-8 w-8 object-contain" />
                  <span className="sr-only">HighFive Enterprises</span>
                </Link>
                {navLinks.map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground ${location === href ? 'bg-muted' : ''}`}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription>
                      Unlock all features and get unlimited access to our
                      support team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card>
              </div>
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
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
          </div>
          {description && (
            <div className="flex items-center">
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          )}
          <div className="flex flex-1 rounded-lg border border-dashed shadow-sm">
            <div className="flex-1 p-4">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;