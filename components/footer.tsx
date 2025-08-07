import Link from "next/link"
import { Briefcase, Twitter, Github, Linkedin } from "lucide-react"

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t bg-card text-card-foreground">
      <div className="container py-12">
        <div className="grid gap-8 grid-cols-1 md:grid-cols-4">
          <div className="flex flex-col gap-4">
             <div className="flex items-center space-x-2">
                <Briefcase className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">GigLink</span>
              </div>
            <p className="text-sm text-muted-foreground">
                Connecting talent with opportunity. Find the perfect freelance services for your business.
            </p>
             <div className="flex items-center space-x-4 mt-2">
                <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
                </Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">For Clients</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">How to Hire</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Find a Freelancer</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Browse Gigs</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Project Protection</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">For Freelancers</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">How to Sell</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Create a Gig</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Seller Success</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Community</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Careers</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Press</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {year} GigLink, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
