
'use client'

import { CreateGigForm } from "@/components/create-gig-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { gigs } from "@/lib/data";
import { notFound } from "next/navigation";

export default function EditGigPage({ params }: { params: { gigId: string } }) {
  const { gigId } = params;
  const gig = gigs.find(g => g.id === gigId);

  if (!gig) {
    notFound();
  }

  return (
      <CreateGigForm gig={gig} />
  );
}
