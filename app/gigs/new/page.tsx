'use client';
import CreateGigForm from "@/components/create-gig-form";


export default function NewGigPage() {
  return (
    <div className="min-h-screen px-4 py-8 bg-background text-foreground">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Gig</h1>
        <CreateGigForm />
      </div>
    </div>
  );
}
