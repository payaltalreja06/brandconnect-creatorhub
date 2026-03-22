import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Search, MessageCircle, User, Megaphone,
  IndianRupee, LogOut, Zap, BarChart3,
} from "lucide-react";
import NotificationBell from "@/components/NotificationBell";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useChatCount } from "@/contexts/ChatContext";

function BrandSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { totalUnreadCount } = useChatCount();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const mainNav = [
    { title: "Dashboard", url: "/brand/dashboard", icon: LayoutDashboard },
    { title: "Discover", url: "/brand/discover", icon: Search },
    { title: "Campaigns", url: "/brand/campaigns", icon: Megaphone },
    { title: "Messages", url: "/brand/messages", icon: MessageCircle, badge: totalUnreadCount },
  ];

  const secondaryNav = [
    { title: "Analytics", url: "/brand/analytics", icon: BarChart3 },
    { title: "Payments", url: "/brand/payments", icon: IndianRupee },
    { title: "Profile", url: "/brand/profile", icon: User },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <Link to="/" className="p-4 flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Collabrix
            </span>
          )}
        </Link>

        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end className="hover:bg-muted/50" activeClassName="bg-muted text-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span className="flex-1">{item.title}</span>}
                      {item.badge > 0 && (
                        <Badge variant="destructive" className={`${collapsed ? "absolute -top-1 -right-1 h-4 w-4 text-[10px]" : "ml-auto h-5 w-5 text-xs"} flex items-center justify-center p-0 rounded-full`}>
                          {item.badge}
                        </Badge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end className="hover:bg-muted/50" activeClassName="bg-muted text-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  const { logout, userName } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <BrandSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="text-sm text-muted-foreground hidden sm:inline">Welcome back, <span className="font-medium text-foreground">{userName}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell />
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={handleLogout}>
                <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-background">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
