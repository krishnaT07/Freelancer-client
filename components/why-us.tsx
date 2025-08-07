
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Handshake, LifeBuoy } from "lucide-react";

const features = [
  {
    icon: Handshake,
    title: "Vetted Professionals",
    description: "We verify every freelancer to ensure you get top-quality talent and expertise.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description: "Your payments are held securely until you're satisfied and approve the work.",
  },
  {
    icon: LifeBuoy,
    title: "24/7 Support",
    description: "Our dedicated support team is here to help you around the clock, anytime you need.",
  },
];

export function WhyUs() {
  return (
    <section className="py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Why Choose GigLink?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
            The best place to connect with professionals and get your projects done right.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
              <CardHeader>
                <div className="mx-auto bg-primary/10 text-primary w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="w-8 h-8" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
