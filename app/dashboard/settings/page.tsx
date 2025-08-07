
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { users } from '@/lib/data';
import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, LifeBuoy, User as UserIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.').optional(),
  location: z.string().min(2, 'Location is required.'),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileSettings = ({ currentUser }: { currentUser: User }) => {
  const { toast } = useToast();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: currentUser.name,
      email: currentUser.name.toLowerCase().replace(' ', '.') + '@example.com', // mock email
      location: currentUser.location,
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    // In a real app, you'd call an action to update the user profile in your database.
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex].name = data.name;
        users[userIndex].location = data.location;
    }
    
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been saved.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>This is how others will see you on the site.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email" {...field} disabled />
                  </FormControl>
                   <FormDescription>Your email address cannot be changed.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. New York, USA" {...field} />
                  </FormControl>
                   <FormDescription>Your location helps us recommend relevant content.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

const PaymentSettings = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your saved payment methods for purchases and payouts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Card className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                        <CreditCard className="h-8 w-8 text-muted-foreground" />
                        <div>
                            <p className="font-medium">Visa ending in 1234</p>
                            <p className="text-sm text-muted-foreground">Expires 08/2026</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm">Remove</Button>
                </Card>
                 <Card className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                        <CreditCard className="h-8 w-8 text-muted-foreground" />
                        <div>
                            <p className="font-medium">Mastercard ending in 5678</p>
                            <p className="text-sm text-muted-foreground">Expires 11/2025</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm">Remove</Button>
                </Card>
                <Button>Add New Method</Button>
            </CardContent>
        </Card>
    )
}

const SupportSettings = () => {
    return (
         <Card>
            <CardHeader>
                <CardTitle>Support Center</CardTitle>
                <CardDescription>Need help? Visit our support center or chat with our AI assistant.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <p>If you have any questions, encounter issues, or need assistance with the platform, our support team is ready to help.</p>
                    <Button asChild>
                        <Link href="/dashboard/support">
                            <LifeBuoy className="mr-2 h-4 w-4" />
                            Go to AI Support Chat
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}


export default function SettingsPage() {
  const [user, loading] = useAuthState(auth);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      const mockUser = users.find((u) => u.name === user.displayName) || users[0];
      setCurrentUser(mockUser);
    } else if (!loading && !user) {
        notFound();
    }
  }, [user, loading]);

  if (loading || !currentUser) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="payment">
             <CreditCard className="mr-2 h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="support">
            <LifeBuoy className="mr-2 h-4 w-4" />
            Support
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6">
          <ProfileSettings currentUser={currentUser} />
        </TabsContent>
        <TabsContent value="payment" className="mt-6">
          <PaymentSettings />
        </TabsContent>
        <TabsContent value="support" className="mt-6">
            <SupportSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
