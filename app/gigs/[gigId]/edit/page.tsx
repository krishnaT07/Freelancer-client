import { Gig } from "@/types"; 
import CreateGigForm from "@/components/create-gig-form";

export default function EditGigPage({ params }: { params: { gigId: string } }) {
  // Example: this will later be replaced with actual API/data fetching
  const gigs: Gig[] = []; // ✅ consistent Gig type

  const gig = gigs.find((g) => g.id === params.gigId);

  return (
    <div>
      {gig ? (
        <CreateGigForm gig={gig} />
      ) : (
        <p>Gig not found</p>
      )}
    </div>
  );
}
