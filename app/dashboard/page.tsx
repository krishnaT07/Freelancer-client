'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, Package, CheckCircle, Star, ShoppingCart, MessageSquare, Loader2 } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Area, AreaChart } from "recharts";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { users, orders as allOrders, conversations as allConversations, gigs as allGigs } from "@/lib/data";
import { useState, useEffect, useMemo } from "react";
import type { User, Order, Gig } from "@/lib/types";
import { recommendGigsAction } from "@/app/actions";
import { GigCard } from "@/components/gig-card";

const freelancerChartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const clientChartData = [
  { month: "January", spent: 500, orders: 1 },
  { month: "February", spent: 350, orders: 2 },
  { month: "March", spent: 800, orders: 3 },
  { month: "April", spent: 150, orders: 1 },
  { month: "May", spent: 600, orders: 2 },
  { month: "June", spent: 250, orders: 1 },
];

const freelancerChartConfig = {
  desktop: {
    label: "Earnings",
    color: "hsl(var(--primary))",
  },
};

const clientChartConfig = {
  spent: {
    label: "Spent",
    color: "hsl(var(--primary))",
  },
   orders: {
    label: "Orders",
    color: "hsl(var(--secondary))",
  },
};

const FreelancerDashboard = ({ user }: { user: User }) => {
    const userGigs = useMemo(() => allGigs.filter(gig => gig.freelancer.id === user.id), [user.id]);
    
    const stats = useMemo(() => {
        const freelancerOrders = allOrders.filter(order => userGigs.some(gig => gig.id === order.gig.id));

        const totalEarnings = freelancerOrders
            .filter(order => order.status === 'Completed')
            .reduce((sum, order) => sum + order.gig.price, 0);

        const activeOrders = freelancerOrders.filter(order => ['In Progress', 'Pending'].includes(order.status)).length;
        
        const completedGigs = freelancerOrders.filter(order => order.status === 'Completed').length;

        const totalReviews = userGigs.reduce((acc, gig) => acc + gig.totalReviews, 0);
        const averageRating = totalReviews > 0
            ? userGigs.reduce((acc, gig) => acc + (gig.rating * gig.totalReviews), 0) / totalReviews
            : 0;

        return { totalEarnings, activeOrders, completedGigs, averageRating: averageRating.toFixed(1), totalReviews };
    }, [userGigs]);

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.totalEarnings.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{stats.activeOrders}</div>
                        <p className="text-xs text-muted-foreground">+1 since last hour</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Gigs</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.completedGigs}</div>
                        <p className="text-xs text-muted-foreground">+12 since last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overall Rating</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.averageRating}</div>
                        <p className="text-xs text-muted-foreground">Based on {stats.totalReviews} reviews</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Earnings</CardTitle>
                        <CardDescription>Your earnings over the last 6 months.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={freelancerChartConfig} className="min-h-[200px] w-full">
                            <BarChart accessibilityLayer data={freelancerChartData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                                <YAxis />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Orders</CardTitle>
                        <CardDescription>Your order volume over the last 6 months.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={freelancerChartConfig} className="min-h-[200px] w-full">
                            <AreaChart accessibilityLayer data={freelancerChartData} margin={{ left: 12, right: 12 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                <Area dataKey="desktop" type="natural" fill="var(--color-desktop)" fillOpacity={0.4} stroke="var(--color-desktop)" stackId="a" />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};


const RecommendedGigs = ({ recentOrders }: { recentOrders: Order[] }) => {
    const [recommendations, setRecommendations] = useState<Gig[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            setLoading(true);
            const recentOrderTitles = recentOrders.map(order => order.gig.title);
            const recommendedTitles = await recommendGigsAction({ recentOrderTitles });
            
            // Find the full gig objects from the recommended titles
            const recommendedGigs = allGigs.filter(gig => recommendedTitles.includes(gig.title));
            setRecommendations(recommendedGigs);
            setLoading(false);
        };

        fetchRecommendations();
    }, [recentOrders]);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Recommended For You</CardTitle>
                    <CardDescription>AI-powered suggestions based on your activity.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recommended For You</CardTitle>
                <CardDescription>AI-powered suggestions based on your activity.</CardDescription>
            </CardHeader>
            <CardContent>
                {recommendations.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendations.map(gig => (
                            <GigCard key={gig.id} gig={gig} />
                        ))}
                    </div>
                ) : (
                     <p className="text-muted-foreground text-center">No recommendations for you yet. Browse and purchase some gigs!</p>
                )}
            </CardContent>
        </Card>
    );
};


const ClientDashboard = ({ user }: { user: User }) => {
    const userOrders = useMemo(() => allOrders.filter(order => order.client.id === user.id), [user.id]);

    const stats = useMemo(() => {
        const totalSpent = userOrders
            .filter(order => order.status === 'Completed')
            .reduce((sum, order) => sum + order.gig.price, 0);
        
        const activeOrders = userOrders.filter(order => ['In Progress', 'Pending'].includes(order.status)).length;
        
        const completedOrders = userOrders.filter(order => order.status === 'Completed').length;
        
        const unreadMessages = allConversations
            .filter(c => c.participants.some(p => p.id === user.id))
            .reduce((sum, c) => sum + c.unreadCount, 0);

        return { totalSpent, activeOrders, completedOrders, unreadMessages };
    }, [userOrders, user.id]);

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.totalSpent.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            Across {stats.completedOrders} completed orders
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeOrders}</div>
                        <p className="text-xs text-muted-foreground">
                           Currently in progress
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.completedOrders}</div>
                        <p className="text-xs text-muted-foreground">
                           Successfully delivered
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.unreadMessages}</div>
                        <p className="text-xs text-muted-foreground">
                           Across all conversations
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-1">
                 <RecommendedGigs recentOrders={userOrders} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Spending History</CardTitle>
                        <CardDescription>
                            Your spending over the last 6 months.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={clientChartConfig} className="min-h-[200px] w-full">
                            <BarChart accessibilityLayer data={clientChartData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                                <YAxis />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                <Bar dataKey="spent" fill="var(--color-spent)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Order History</CardTitle>
                        <CardDescription>
                            Your order volume over the last 6 months.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={clientChartConfig} className="min-h-[200px] w-full">
                            <AreaChart
                                accessibilityLayer
                                data={clientChartData}
                                margin={{ left: 12, right: 12 }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                <Area
                                    dataKey="orders"
                                    type="natural"
                                    fill="var(--color-orders)"
                                    fillOpacity={0.4}
                                    stroke="var(--color-orders)"
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};


export default function DashboardPage() {
  const [user] = useAuthState(auth);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      // In a real app, you'd fetch the user's role from a database.
      // Here, we'll check our mock data.
      const mockUser = users.find(u => u.name === user.displayName);
      if (mockUser) {
        setCurrentUser(mockUser);
      } else {
        // This is a fallback for newly registered users not in our static data
        // We'll check if any client has the same name. If not, default to freelancer.
        const isClient = users.some(u => u.role === 'client' && u.name === user.displayName);
        setCurrentUser({
            id: user.uid,
            name: user.displayName || 'New User',
            avatarUrl: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
            role: isClient ? 'client' : 'freelancer', // Default new users to freelancer unless they match a client name
            memberSince: new Date().toLocaleString('default', { month: 'short', year: 'numeric' }),
            location: 'Unknown',
        });
      }
    }
  }, [user]);

  if (!currentUser) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="grid gap-6">
       {currentUser.role === 'freelancer' ? <FreelancerDashboard user={currentUser} /> : <ClientDashboard user={currentUser} />}
    </div>
  );
}
