'use client'

import { useState } from "react";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { Star, Clock, CheckCircle } from "lucide-react";

import { gigs, users, conversations as allConversations, orders } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import type { Conversation, Review, User, Order } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Script from 'next/script';

const ReviewForm = ({ gigId, onReviewSubmit }: { gigId: string, onReviewSubmit: (review: Review) => void }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [user] = useAuthState(auth);
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast({ variant: "destructive", title: "You must be logged in to leave a review." });
            return;
        }
        if (rating === 0 || !comment.trim()) {
            toast({ variant: "destructive", title: "Please provide a rating and a comment." });
            return;
        }
        
        const currentUser = users.find(u => u.name === user.displayName) || users.find(u => u.role === 'client')!;
        
        const newReview: Review = {
            id: `review-${Date.now()}`,
            author: { 
                id: currentUser.id, 
                name: currentUser.name, 
                avatarUrl: currentUser.avatarUrl, 
                role: currentUser.role
            },
            rating,
            comment,
            createdAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        };
        
        onReviewSubmit(newReview);
        setRating(0);
        setComment('');
        toast({ title: "Review submitted!", description: "Thank you for your feedback." });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Leave a Review</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center gap-2">
                        <p className="font-medium">Your Rating:</p>
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-6 h-6 cursor-pointer ${rating >= star ? 'text-primary fill-primary' : 'text-muted-foreground'}`}
                                    onClick={() => setRating(star)}
                                />
                            ))}
                        </div>
                    </div>
                    <Textarea
                        placeholder="Share your experience with this gig..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[100px]"
                    />
                    <Button type="submit" disabled={!user}>Submit Review</Button>
                    {!user && <p className="text-sm text-muted-foreground">Please <Link href="/login" className="underline">log in</Link> to leave a review.</p>}
                </form>
            </CardContent>
        </Card>
    )
}

export default function GigDetailsPage({ params }: { params: { gigId: string } }) {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const { toast } = useToast();
  const { gigId } = params;

  const gig = gigs.find((g) => g.id === gigId);

  // Guard clause for gig and required nested properties
  if (!gig || !gig.freelancer || typeof gig.rating !== 'number' || !gig.images) {
    notFound();
  }

  // Use the freelancer object directly
  const freelancer = gig.freelancer;

  const [reviews, setReviews] = useState<Review[]>(gig.reviews ?? []);
  const [isPaying, setIsPaying] = useState(false);

  const handleContact = () => {
    if (!user || !freelancer) {
      router.push('/login');
      return;
    }
    
    let conversation = allConversations.find(c => 
        c.participants.some(p => p.id === user.uid) && 
        c.participants.some(p => p.id === freelancer.id)
    );
    
    if (!conversation) {
        const currentUserInfo = users.find(u => u.name === user.displayName) || users.find(u => u.role === 'client')!;

        const newConversation: Conversation = {
            id: `conv-${Date.now()}`,
            participants: [currentUserInfo, freelancer],
            messages: [],
            lastMessage: { text: "Conversation started.", timestamp: "Just now" },
            unreadCount: 0,
        };
        allConversations.unshift(newConversation);
        conversation = newConversation;
    }
    
    router.push(`/dashboard/messages?id=${conversation.id}`);
  }

  const handlePurchase = () => {
    if (!user) {
      router.push('/login?redirect=/gigs/' + gigId);
      return;
    }
    const client = users.find(u => u.name === user.displayName) || users.find(u => u.role === 'client')!;
    
    const newOrder: Order = {
        id: `order-${Date.now()}`,
        gig,
        client,
        status: 'In Progress',
        orderDate: new Date().toISOString().split('T')[0],
    };

    orders.unshift(newOrder);

    toast({
        title: "Order Placed!",
        description: `You have successfully purchased "${gig.title}".`
    });

    router.push('/dashboard/orders');
  };
  
  const handleReviewSubmit = (newReview: Review) => {
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    
    const gigIndex = gigs.findIndex(g => g.id === gig.id);
    if(gigIndex > -1) {
        gigs[gigIndex].reviews = updatedReviews;
        const totalRating = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
        gigs[gigIndex].rating = totalRating / updatedReviews.length;
        gigs[gigIndex].totalReviews = updatedReviews.length;
    }
  };

  const handleRazorpayPayment = async () => {
    if (!user) {
      router.push('/login?redirect=/gigs/' + gigId);
      return;
    }
    setIsPaying(true);

    try {
      // 1. Create order on backend
      const res = await fetch('http://localhost:4000/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: gig.price, currency: 'INR' }),
      });
      const order = await res.json();

      if (!order.id) {
        toast({ variant: 'destructive', title: 'Payment Error', description: 'Could not create order.' });
        setIsPaying(false);
        return;
      }

      // 2. Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'YOUR_KEY_ID',
        amount: order.amount,
        currency: order.currency,
        name: gig.title,
        description: gig.description,
        order_id: order.id,
        handler: async function (response: any) {
          // 3. Verify payment
          const verifyRes = await fetch('http://localhost:4000/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.status === 'success') {
            // 4. Create order in app
            handlePurchase();
          } else {
            toast({ variant: 'destructive', title: 'Payment Failed', description: 'Payment verification failed.' });
          }
          setIsPaying(false);
        },
        prefill: {
          name: user.displayName,
          email: user.email,
        },
        theme: { color: '#3399cc' },
      };
      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      toast({ variant: 'destructive', title: 'Payment Error', description: 'Something went wrong during payment.' });
      setIsPaying(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="md:col-span-2">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{gig.title}</h1>
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <Link href={`/freelancer/${freelancer.id}`} className="flex items-center gap-2 hover:underline">
              <Avatar className="h-10 w-10">
                <AvatarImage src={freelancer.avatarUrl} />
                <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-semibold text-lg">{freelancer.name}</span>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-primary text-primary" />
              <span className="font-bold text-lg">{gig.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({gig.totalReviews} reviews)</span>
            </div>
          </div>
          
          <Carousel className="w-full mb-8">
            <CarouselContent>
              {gig.images.map((src, index) => (
                <CarouselItem key={index}>
                  <Image
                    alt={`${gig.title} gallery image ${index + 1}`}
                    className="aspect-video w-full rounded-lg object-cover"
                    height={450}
                    src={src}
                    width={800}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <h2 className="text-2xl font-bold mb-4 border-b pb-2">About This Gig</h2>
          <div className="prose prose-invert max-w-none text-muted-foreground">
             <p>{gig.description}</p>
          </div>
          
          <Separator className="my-8" />

          <h2 className="text-2xl font-bold mb-4">Reviews ({reviews.length})</h2>
           {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="flex gap-4">
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
              ))}
            </div>
          ) : (
             <p className="text-muted-foreground">No reviews for this gig yet.</p>
          )}

          <Separator className="my-8" />
          <ReviewForm gigId={gig.id} onReviewSubmit={handleReviewSubmit} />
        </div>
        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Purchase</CardTitle>
               <Badge variant="secondary" className="text-base">{gig.category}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-baseline">
                <p className="text-2xl font-bold">₹{gig.price.toFixed(2)}</p>
                <p className="text-muted-foreground">Starting Price</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{gig.deliveryTime}-day delivery</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>3 revisions</span>
                </li>
                 <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>Source file</span>
                </li>
              </ul>
              <Button onClick={handleRazorpayPayment} disabled={isPaying} className="w-full mt-4">
                {isPaying ? 'Processing...' : `Buy for ₹${gig.price}`}
              </Button>
              <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
              <Button variant="outline" className="w-full" onClick={handleContact}>Contact Freelancer</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

