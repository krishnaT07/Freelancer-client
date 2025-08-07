'use client';

import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LayoutDashboard, LogOut, Settings, PlusCircle, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { auth } from "@/lib/firebase"
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from "firebase/auth"
import { useRouter } from 'next/navigation'
import { users } from "@/lib/data";
import { useState, useEffect } from "react";
import type { User } from "@/lib/types";

export function UserNav() {
  const [user, loading] = useAuthState(auth);
  const { toast } = useToast();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      // This simulates fetching user role from your database
      const mockUser = users.find(u => u.name === user.displayName);
      if (mockUser) {
        setCurrentUser(mockUser);
      } else {
        // Fallback for new users
        // Check if a client with the same name exists, otherwise default to freelancer
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
    } else {
      setCurrentUser(null);
    }
  }, [user]);


  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: error.message,
      });
    }
  };

  if (loading) {
    return <div className="h-9 w-24 rounded-md animate-pulse bg-muted" />
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href="/login">Log in</Link>
        </Button>
        <Button asChild>
          <Link href="/register">Sign up</Link>
        </Button>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.photoURL || "https://placehold.co/40x40.png"} alt={user.displayName || "User"} />
            <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          {currentUser?.role === 'freelancer' && (
            <DropdownMenuItem asChild>
              <Link href="/gigs/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                <span>Create Gig</span>
              </Link>
            </DropdownMenuItem>
          )}
           {currentUser?.role === 'client' && (
            <DropdownMenuItem asChild>
              <Link href="/dashboard/orders">
                <ShoppingCart className="mr-2 h-4 w-4" />
                <span>My Orders</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
             <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
