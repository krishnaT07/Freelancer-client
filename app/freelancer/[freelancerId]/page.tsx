

'use client'

import { notFound } from "next/navigation";
import Image from "next/image";
import { Star, MapPin, Calendar } from "lucide-react";

import { gigs as allGigs, users } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { Review } from "@/lib/types";
import { GigCard } from "@/components/gig-card";

export default function FreelancerProfilePage({ params }: { params: { freelancerId: string } }) {
  const { freelancerId } = params;
  const freelancer = users.find((u) => u.id === freelancerId);
  
  if (!freelancer || freelancer.role !== 'freelancer') {
    notFound();
  }

  const freelancerGigs = allGigs.filter(gig => gig.freelancer.id === freelancer.id);
  
  const allReviews: Review[] = freelancerGigs.flatMap(gig => gig.reviews || []);
  
  const totalReviews = freelancerGigs.reduce((acc, gig) => acc + gig.totalReviews, 0);
  const averageRating = totalReviews > 0 
    ? freelancerGigs.reduce((acc, gig) => acc + (gig.rating * gig.totalReviews), 0) / totalReviews
    : 0;
  

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="grid md:grid-cols-4 gap-8 lg:gap-12">
        {/* Left Sidebar */}
        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={freelancer.avatarUrl} />
                <AvatarFallback className="text-3xl">{freelancer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h1 className="text-2xl font-bold">{freelancer.name}</h1>
              <p className="text-muted-foreground">Freelance Professional</p>
              
              <div className="flex items-center gap-1 mt-2">
                <Star className="w-5 h-5 fill-primary text-primary" />
                <span className="font-bold text-lg">{averageRating.toFixed(1)}</span>
                <span className="text-muted-foreground">({totalReviews} reviews)</span>
              </div>
              
               <Button className="mt-4 w-full">Contact Me</Button>
            </CardContent>
            <Separator />
            <CardContent className="space-y-3 text-sm pt-6">
                <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                    <span>From <span className="font-medium">{freelancer.location}</span></span>
                </div>
                <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 mt-1 text-muted-foreground" />
                    <span>Member since <span className="font-medium">{freelancer.memberSince}</span></span>
                </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          {/* Gigs Section */}
          <div>
            <h2 className="text-3xl font-bold mb-6">My Gigs ({freelancerGigs.length})</h2>
             {freelancerGigs.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {freelancerGigs.map((gig, index) => (
                        <GigCard 
                            key={gig.id} 
                            gig={gig}
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        />
                    ))}
                </div>
              ) : (
                 <p className="text-muted-foreground">This freelancer doesn't have any active gigs yet.</p>
              )}
          </div>
          
          <Separator className="my-12" />

          {/* Reviews Section */}
          <div>
            <h2 className="text-3xl font-bold mb-6">What People Are Saying ({allReviews.length})</h2>
            {allReviews.length > 0 ? (
              <div className="space-y-8">
                {allReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                        <div className="flex gap-4">
                        <Avatar>
                            <AvatarImage src={review.author.avatarUrl} />
                            <AvatarFallback>{review.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <p className="font-semibold">{review.author.name}</p>

                                <div className="flex items-center gap-1 text-sm">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`}/>
                                    ))}
                                </div>
                            </div>
                            <p className="text-muted-foreground mt-2">{review.comment}</p>
                            <p className="text-xs text-muted-foreground mt-2">{review.createdAt}</p>
                        </div>
                        </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
                <p className="text-muted-foreground">No reviews for this freelancer yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
