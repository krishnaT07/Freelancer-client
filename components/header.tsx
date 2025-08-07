'use client';

import Link from "next/link"
import { Briefcase, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { users } from "@/lib/data";
import { useState, useEffect } from "react";
import type { User } from "@/lib/types";


export function Header() {
  const [user] = useAuthState(auth);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(storedTheme);
    document.documentElement.className = storedTheme;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.className = newTheme;
  };

  useEffect(() => {
    if (user) {
      const mockUser = users.find(u => u.name === user.displayName) || users.find(u => u.role === 'client');
      setCurrentUser(mockUser || null);
    } else {
      setCurrentUser(null);
    }
  }, [user]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="font-bold">GigLink</span>
          </Link>
          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Browse Gigs
            </Link>
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              My Dashboard
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
           <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
             <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
             <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
           </Button>
          {currentUser?.role === 'freelancer' && (
            <Button variant="ghost" asChild className="hidden md:inline-flex">
              <Link href="/gigs/new">Create a Gig</Link>
            </Button>
          )}
          {(!user || currentUser?.role === 'client') && (
             <Button variant="ghost" asChild className="hidden md:inline-flex">
                <Link href="/register">Become a Seller</Link>
             </Button>
          )}
          <UserNav />
        </div>
      </div>
    </header>
  )
}
