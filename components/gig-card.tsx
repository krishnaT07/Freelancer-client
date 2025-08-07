

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import type { Gig } from "@/lib/types"
import { cn } from "@/lib/utils"

interface GigCardProps {
  gig: Gig
  className?: string;
  style?: React.CSSProperties;
}

export function GigCard({ gig, className, style }: GigCardProps) {
  return (
    <Card 
      className={cn("w-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:scale-105", className)} 
      style={style}
    >
      <Link href={`/gigs/${gig.id}`} className="block h-full">
        <Image
          alt={gig.title}
          className="aspect-[4/3] w-full object-cover"
          height="300"
          src={gig.imageUrl}
          width="400"
          data-ai-hint="service photo"
        />
        <CardContent className="p-4 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={gig.freelancer.avatarUrl} />
              <AvatarFallback>{gig.freelancer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{gig.freelancer.name}</span>
          </div>
          <h3 className="font-semibold text-base leading-snug tracking-tight hover:text-primary transition-colors flex-grow">
            {gig.title}
          </h3>
          <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="font-bold text-foreground">{gig.rating.toFixed(1)}</span>
            <span>({gig.totalReviews})</span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t pt-3">
             <Badge variant="outline">{gig.category}</Badge>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">STARTING AT</p>
              <p className="text-lg font-bold">${gig.price.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
