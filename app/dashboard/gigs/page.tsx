

'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { gigs as allGigs, users } from "@/lib/data";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import type { Gig, User } from "@/lib/types";
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';


export default function GigsPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const { toast } = useToast();
  const [userGigs, setUserGigs] = useState<Gig[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      const mockUser = users.find(u => u.name === user.displayName) || users.find(u => u.role === 'freelancer');
      setCurrentUser(mockUser || null);
    }
  }, [user]);

  useEffect(() => {
    setIsDataLoading(true);
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    
    if (currentUser && currentUser.role === 'freelancer') {
      const filteredGigs = allGigs.filter(
  gig => gig.freelancer?.id === currentUser.id
);

      setUserGigs(filteredGigs);
    }
    setIsDataLoading(false);
  }, [currentUser, loading, user, router]);
  
  if (currentUser && currentUser.role !== 'freelancer' && !loading) {
    return notFound();
  }

  const handleDeleteGig = (gigToDelete: Gig) => {
    const gigIndex = allGigs.findIndex(gig => gig.id === gigToDelete.id);
    if (gigIndex > -1) {
      allGigs.splice(gigIndex, 1);
    }
    setUserGigs(prevGigs => prevGigs.filter(gig => gig.id !== gigToDelete.id));
    toast({
      title: "Gig Deleted",
      description: `The gig "${gigToDelete.title}" has been successfully deleted.`,
    });
  };

  if (loading || isDataLoading) {
    return (
       <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return null; // or a message telling them to log in
  }


  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
              <CardTitle>My Gigs</CardTitle>
              <CardDescription>Manage your services and offerings.</CardDescription>
          </div>
          <Button asChild size="sm" className="gap-1">
              <Link href="/gigs/new">
                  <PlusCircle className="h-4 w-4" />
                  Create Gig
              </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {userGigs.length > 0 ? (
              <Table>
              <TableHeader>
                  <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Price</TableHead>
                  <TableHead>
                      <span className="sr-only">Actions</span>
                  </TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {userGigs.map((gig) => (
                  <TableRow key={gig.id}>
                      <TableCell className="font-medium">{gig.title}</TableCell>
                      <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">Active</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">${gig.price.toFixed(2)}</TableCell>
                      <TableCell>
                      <AlertDialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link href={`/gigs/${gig.id}/edit`}>Edit</Link>
                            </DropdownMenuItem>
                             <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600">
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your gig.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteGig(gig)} className="bg-destructive hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      </TableCell>
                  </TableRow>
                  ))}
              </TableBody>
              </Table>
          ) : (
              <div className="text-center py-12">
                  <h3 className="text-lg font-semibold">No Gigs Found</h3>
                  <p className="mb-4 mt-2 text-muted-foreground">You haven&apos;t created any gigs yet.</p>
                  <Button asChild>
                      <Link href="/gigs/new">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Create Your First Gig
                      </Link>
                  </Button>
              </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

