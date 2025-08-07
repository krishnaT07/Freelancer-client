
'use client';

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
import { orders as allOrders, users } from "@/lib/data";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";
import type { Order, User } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";


export default function OrdersPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      const mockUser = users.find(u => u.name === user.displayName) || users.find(u => u.role === 'client');
      setCurrentUser(mockUser || null);
    }
  }, [user]);

  useEffect(() => {
    if (currentUser && currentUser.role === 'client') {
      const filteredOrders = allOrders.filter(order => order.client.id === currentUser.id);
      setUserOrders(filteredOrders);
    } else if (!loading && !user) {
       router.push('/login');
    }
  }, [currentUser, loading, router, user]);
  
  if (currentUser && currentUser.role !== 'client' && !loading) {
    return notFound();
  }


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Orders</CardTitle>
        <CardDescription>Keep track of all your purchases.</CardDescription>
      </CardHeader>
      <CardContent>
        {userOrders.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gig</TableHead>
                <TableHead className="hidden md:table-cell">Freelancer</TableHead>
                <TableHead className="hidden sm:table-cell">Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Order Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                     <Link href={`/gigs/${order.gig.id}`} className="font-medium hover:underline flex items-center gap-3">
                        <Image src={order.gig.imageUrl} alt={order.gig.title} width={40} height={30} className="rounded-sm hidden sm:block object-cover" />
                        <span>{order.gig.title}</span>
                     </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{order.gig.freelancer.name}</TableCell>
                  <TableCell className="hidden sm:table-cell">${order.gig.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge 
                        variant={order.status === 'Completed' ? 'default' : order.status === 'Cancelled' ? 'destructive' : 'secondary'}
                        className={cn(
                            order.status === 'Completed' && 'bg-green-600 hover:bg-green-700',
                            order.status === 'In Progress' && 'bg-blue-500 hover:bg-blue-600',
                            order.status === 'Pending' && 'bg-yellow-500 hover:bg-yellow-600'
                         )}
                    >
                        {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{order.orderDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold">No Orders Found</h3>
            <p className="mb-4 mt-2 text-muted-foreground">You haven't purchased any gigs yet.</p>
             <Button asChild>
                <Link href="/">Browse Gigs</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
