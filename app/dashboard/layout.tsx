'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Home,
  MessageSquare,
  Package,
  Settings,
  ShoppingCart,
  LifeBuoy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { UserNav } from "@/components/user-nav";
import { Button } from "@/components/ui/button";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { users } from "@/lib/data";
import { useState, useEffect } from "react";
import type { User } from "@/lib/types";

const freelancerMenuItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/dashboard/gigs", icon: Package, label: "My Gigs" },
    { href: "/dashboard/messages", icon: MessageSquare, label: "Messages", badge: "3" },
    { href: "/dashboard/support", icon: LifeBuoy, label: "Support" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

const clientMenuItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/dashboard/orders", icon: ShoppingCart, label: "My Orders" },
    { href: "/dashboard/messages", icon: MessageSquare, label: "Messages", badge: "3" },
    { href: "/dashboard/support", icon: LifeBuoy, label: "Support" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

const pageTitles: { [key: string]: string } = {
    "/dashboard": "Dashboard",
    "/dashboard/gigs": "My Gigs",
    "/dashboard/orders": "My Orders",
    "/dashboard/messages": "Messages",
    "/dashboard/settings": "Settings",
    "/dashboard/support": "Support",
    "/gigs/new": "Create a New Gig",
    "/gigs/[gigId]/edit": "Edit Gig"
};


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, loading] = useAuthState(auth);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      const mockUser = users.find(u => u.name === user.displayName);
      if (mockUser) {
        setCurrentUser(mockUser);
      } else {
        // Fallback for new users. Check if a client has this name, otherwise default to freelancer.
        const isClient = users.some(u => u.role === 'client' && u.name === user.displayName);
        setCurrentUser({
            id: user.uid,
            name: user.displayName || 'New User',
            avatarUrl: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
            role: isClient ? 'client' : 'freelancer',
            memberSince: new Date().toLocaleString('default', { month: 'short', year: 'numeric' }),
            location: 'Unknown',
        });
      }
    }
  }, [user]);

  const menuItems = currentUser?.role === 'freelancer' ? freelancerMenuItems : clientMenuItems;
  
  const getPageTitle = (path: string) => {
    if (/^\/gigs\/new/.test(path)) {
      return pageTitles['/gigs/new'];
    }
     if (/^\/gigs\/.+\/edit/.test(path)) {
      return pageTitles["/gigs/[gigId]/edit"];
    }
    const title = pageTitles[path] || "Dashboard";
    return title;
  };

  const title = getPageTitle(pathname);
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarContent className="flex flex-col">
            <SidebarHeader>
              <Link href="/" className="flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">GigLink</span>
              </Link>
            </SidebarHeader>
            <SidebarMenu className="flex-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <a>
                      <SidebarMenuButton isActive={pathname === item.href}>
                          <item.icon />
                          <span>{item.label}</span>
                          {item.badge && <Badge className="ml-auto">{item.badge}</Badge>}
                      </SidebarMenuButton>
                    </a>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <SidebarFooter>
              <UserNav />
            </SidebarFooter>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">{title}</h1>
            </div>
            {currentUser?.role === 'freelancer' && (
              <Button asChild>
                  <Link href="/gigs/new">Create Gig</Link>
              </Button>
            )}
             {currentUser?.role === 'client' && (
              <Button asChild>
                  <Link href="/">Browse Gigs</Link>
              </Button>
            )}
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

