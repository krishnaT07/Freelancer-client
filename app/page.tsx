

'use client';

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { GigCard } from "@/components/gig-card"
import { gigs as allGigs } from "@/lib/data"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Gig } from "@/lib/types";
import { CategoryBrowser } from "@/components/category-browser";
import { WhyUs } from "@/components/why-us";
import { cn } from "@/lib/utils";

const Star = ({ style }: { style: React.CSSProperties }) => <div className="star" style={style}></div>;

const Starfield = ({ count = 20, id }: { count?: number; id: string }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const stars = useMemo(() => {
        if (!isClient) return [];
        return Array.from({ length: count }).map((_, i) => (
            <Star
                key={i}
                style={{
                    '--top-offset': `${Math.random() * 100}vh`,
                    '--fall-duration': `${Math.random() * 5 + 2}s`,
                    '--fall-delay': `${Math.random() * 5}s`,
                    'left': `${Math.random() * 100}vw`,
                } as React.CSSProperties}
            />
        ));
    }, [count, isClient]);
    
    if (!isClient) {
        return null;
    }

    return <div id={id}>{stars}</div>;
};

export default function Home() {
  const [gigs, setGigs] = useState<Gig[]>(allGigs);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterGigs(searchQuery, category);
  };
  
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    filterGigs(searchQuery, value);
  }

  const filterGigs = (query: string, cat: string) => {
    let filtered = allGigs;

    if (cat !== 'all') {
        filtered = filtered.filter(gig => gig.category === cat);
    }
    
    if (query) {
        const lowerCaseQuery = query.toLowerCase();
        filtered = filtered.filter(gig => 
            gig.title.toLowerCase().includes(lowerCaseQuery) ||
            gig.description.toLowerCase().includes(lowerCaseQuery) ||
            gig.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
        );
    }
    
    setGigs(filtered);
  };


  return (
    <div className="w-full">
       <section className={cn(
        "w-full py-12 md:py-24 lg:py-32 relative overflow-hidden",
        "bg-hero-gradient",
      )}>
        <Starfield count={20} id="stars" />
        <Starfield count={15} id="stars2" />
        <Starfield count={10} id="stars3" />
        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none animate-fade-in-up"
              style={{ animationDelay: '100ms' }}
            >
              Find the perfect freelance services for your business
            </h1>
            <p 
              className="mx-auto max-w-[700px] text-muted-foreground md:text-xl animate-fade-in-up"
              style={{ animationDelay: '200ms' }}
            >
              Connect with talented freelancers from around the world.
            </p>
            <form 
              onSubmit={handleSearch} 
              className="w-full max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: '300ms' }}
            >
              <div className="group flex w-full items-center space-x-2 rounded-full bg-card/50 p-2 border-2 border-primary/20 focus-within:border-primary/50 transition-all backdrop-blur-sm shadow-inner-glow focus-within:shadow-inner-glow-focus">
                <Input
                  className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                  placeholder="Search for any service..."
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button className="rounded-full group-hover:scale-110 transition-transform" type="submit" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <CategoryBrowser onCategorySelect={handleCategoryChange} />

      <WhyUs />
      
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">Popular Services</h2>
            <div className="flex items-center gap-4">
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Web Development">Web Development</SelectItem>
                  <SelectItem value="Graphic Design">Graphic Design</SelectItem>
                  <SelectItem value="Writing & Translation">Writing & Translation</SelectItem>
                  <SelectItem value="Video & Animation">Video & Animation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {gigs.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {gigs.map((gig, index) => (
                <GigCard 
                    key={gig.id} 
                    gig={gig} 
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                />
              ))}
            </div>
          ) : (
             <div className="text-center py-12 animate-fade-in-up">
                  <h3 className="text-lg font-semibold">No Gigs Found</h3>
                  <p className="mb-4 mt-2 text-muted-foreground">Try adjusting your search or filters.</p>
              </div>
          )}
        </div>
      </section>
    </div>
  )
}
