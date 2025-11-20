import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Globe2, Handshake, Building2, Users } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

const testimonials = [
  {
    quote:
      "Working with HighFive Enterprises has been an incredible experience. Their team amplifies our ideas and delivers with precision.",
    name: "Alex Morgan",
    title: "CEO, Partner Company",
  },
];

export default function OurNetwork() {
  type Collaboration = { id: string; name: string; description?: string | null; highlight?: string | null; logo_url?: string | null; link_url?: string | null };
  type Partner = { id: string; name: string; role?: string | null; description?: string | null; logo_url?: string | null; link_url?: string | null };

  const { data: collaborations = [], isLoading: collaborationsLoading } = useQuery<Collaboration[]>({
    queryKey: ["network", "collaborations"],
    queryFn: async () => {
      const res = await fetch("/api/network/collaborations");
      if (!res.ok) return [] as Collaboration[];
      return res.json();
    },
  });

  const { data: partners = [], isLoading: partnersLoading } = useQuery<Partner[]>({
    queryKey: ["network", "partners"],
    queryFn: async () => {
      const res = await fetch("/api/network/partners");
      if (!res.ok) return [] as Partner[];
      return res.json();
    },
  });

  const showEmptyState = !collaborationsLoading && !partnersLoading && collaborations.length === 0 && partners.length === 0;
  const hasCollaborations = collaborations.length > 0;
  const hasPartners = partners.length > 0;
  const isLoading = collaborationsLoading || partnersLoading;

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden py-20 px-6 bg-gradient-to-b from-primary/10 via-transparent to-transparent">
        <div className="absolute inset-0 pointer-events-none opacity-40 flex items-center justify-center">
          <div className="w-[36rem] h-[36rem] bg-primary/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto text-center relative">
          <Badge variant="secondary" className="mb-6 inline-flex items-center gap-2">
            <Globe2 className="w-4 h-4" /> Our Partners & Collaborations
          </Badge>
          <h1 className="text-5xl font-bold mb-4">Our Network</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            At HighFive Enterprises, we believe in the power of collaboration. Over the years, we've had the privilege of working with a diverse group of partners, sponsors, and associates who share our vision and values. Together, we create meaningful impact and deliver exceptional results.
          </p>
        </div>
      </section>

      {collaborationsLoading ? (
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <Badge variant="secondary" className="mb-6 inline-flex items-center gap-2"><Handshake className="w-4 h-4" /> Collaborated Companies</Badge>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="border-primary/10 bg-card/40">
                  <Skeleton className="w-full h-28" />
                  <CardContent className="p-6 space-y-2">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ) : hasCollaborations ? (
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <Badge variant="secondary" className="mb-6 inline-flex items-center gap-2"><Handshake className="w-4 h-4" /> Collaborated Companies</Badge>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {collaborations.map((item) => (
                <Card key={item.id} className="border-primary/20 bg-card/50 backdrop-blur transition-shadow hover:shadow-lg">
                  {item.logo_url && (
                    <div className="w-full h-28 flex items-center justify-center p-4">
                      <img src={item.logo_url} alt={item.name} className="max-h-24 object-contain" />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {item.highlight ? `${item.highlight} • ` : ""}{item.description || "No description provided."}
                    </p>
                    {item.link_url && (
                      <a href={item.link_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline">
                        Visit
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ) : !isLoading && hasPartners ? (
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <Badge variant="secondary" className="mb-6 inline-flex items-center gap-2"><Handshake className="w-4 h-4" /> Collaborated Companies</Badge>
            <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
              <CardContent className="p-12 text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Handshake className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">We are looking for associate companies</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We're actively seeking collaboration opportunities with innovative companies to create meaningful partnerships.
                </p>
                <Link href="/contact">
                  <Button variant="outline" className="mt-4">
                    Contact Us to Collaborate
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      ) : null}

      {partnersLoading ? (
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <Badge variant="secondary" className="mb-6 inline-flex items-center gap-2"><Building2 className="w-4 h-4" /> Official Partners</Badge>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="border-primary/10 bg-card/40">
                  <Skeleton className="w-full h-28" />
                  <CardContent className="p-6 space-y-2">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ) : hasPartners ? (
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <Badge variant="secondary" className="mb-6 inline-flex items-center gap-2"><Building2 className="w-4 h-4" /> Official Partners</Badge>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {partners.map((item) => (
                <Card key={item.id} className="border-primary/20 bg-card/50 backdrop-blur transition-shadow hover:shadow-lg">
                  {item.logo_url && (
                    <div className="w-full h-28 flex items-center justify-center p-4">
                      <img src={item.logo_url} alt={item.name} className="max-h-24 object-contain" />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {item.role ? `${item.role} • ` : ""}{item.description || "No description provided."}
                    </p>
                    {item.link_url && (
                      <a href={item.link_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline">
                        Visit
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ) : !isLoading && hasCollaborations ? (
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <Badge variant="secondary" className="mb-6 inline-flex items-center gap-2"><Building2 className="w-4 h-4" /> Official Partners</Badge>
            <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
              <CardContent className="p-12 text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">We are looking for partners</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We're seeking strategic partnerships with organizations that share our vision and values.
                </p>
                <Link href="/become-partner">
                  <Button variant="outline" className="mt-4">
                    Become a Partner
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      ) : null}

      {showEmptyState && (
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
              <CardContent className="p-16 text-center space-y-6">
                <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-10 h-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">We are looking for partners and associate companies</h3>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    We're actively building our network of partners and collaborators. Join us in creating meaningful impact through strategic partnerships.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/contact">
                    <Button size="lg" className="inline-flex items-center gap-2">
                      <Handshake className="w-4 h-4" />
                      Collaborate with Us
                    </Button>
                  </Link>
                  <Link href="/become-partner">
                    <Button size="lg" variant="outline" className="inline-flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Become a Partner
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {!showEmptyState && (
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">
              Testimonials
            </Badge>
            <h2 className="text-3xl font-bold mb-6">What Our Partners Say</h2>
            <div className="grid gap-6">
              {testimonials.map((item) => (
                <Card key={item.name} className="border-primary/20 bg-card/50 backdrop-blur">
                  <CardContent className="p-8 space-y-4">
                    <p className="text-lg leading-relaxed text-muted-foreground italic">“{item.quote}”</p>
                    <Separator className="bg-primary/20" />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.title}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 px-6 bg-gradient-to-t from-primary/10 to-transparent">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge variant="secondary">Let’s Collaborate</Badge>
          <h2 className="text-3xl font-bold">Interested in partnering with us?</h2>
          <p className="text-muted-foreground text-lg">
            We’re always excited to explore new collaborations. Tell us about your goals and we’ll craft the path forward together.
          </p>
          <Link href="/become-partner">
            <Button size="lg" className="inline-flex items-center gap-2">
              Become a Partner <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

