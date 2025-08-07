
'use client'

import { Code2, Palette, FileText, Clapperboard } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const categories = [
  { name: 'Web Development', icon: Code2 },
  { name: 'Graphic Design', icon: Palette },
  { name: 'Writing & Translation', icon: FileText },
  { name: 'Video & Animation', icon: Clapperboard },
];

interface CategoryBrowserProps {
    onCategorySelect: (category: string) => void;
}

export function CategoryBrowser({ onCategorySelect }: CategoryBrowserProps) {
    return (
        <section className="py-12 md:py-16 bg-muted/40">
            <div className="container px-4 md:px-6">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-center mb-8">Browse by Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {categories.map((category, index) => (
                        <Card 
                            key={category.name} 
                            className="text-center p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:scale-105 animate-fade-in-up"
                            style={{ animationDelay: `${index * 150}ms` }}
                            onClick={() => onCategorySelect(category.name)}
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter') onCategorySelect(category.name) }}
                        >
                            <CardContent className="flex flex-col items-center justify-center gap-4 p-0">
                                <category.icon className="w-12 h-12 text-primary" />
                                <h3 className="font-semibold text-base">{category.name}</h3>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
