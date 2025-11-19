import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const toc = [
    { id: "acceptance", label: "1. Acceptance of Terms" },
    { id: "services", label: "2. Services We Provide" },
    { id: "responsibilities", label: "3. Client Responsibilities" },
    { id: "payments", label: "4. Quotes, Payments, and Refunds" },
    { id: "ownership", label: "5. Ownership & IP" },
    { id: "liability", label: "6. Limitation of Liability" },
    { id: "termination", label: "7. Termination" },
    { id: "modifications", label: "8. Modifications to Terms" },
  ];
  return (
    <div className="min-h-screen">
      <header className="px-6 py-16 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Terms of Service</h1>
          <p className="text-muted-foreground max-w-2xl">Please read these terms carefully before using our services.</p>
        </div>
      </header>

      <section className="px-6 py-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[240px_1fr] gap-8">
          <aside className="hidden lg:block sticky top-24 h-max">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">On this page</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {toc.map((t) => (
                  <a key={t.id} href={`#${t.id}`} className="block text-sm text-muted-foreground hover:text-primary">
                    {t.label}
                  </a>
                ))}
              </CardContent>
            </Card>
          </aside>

          <div>
            <Card>
              <CardContent className="prose prose-neutral dark:prose-invert max-w-none p-6">
                <h3 id="acceptance">1. Acceptance of Terms</h3>
                <p>
                  By accessing or using the services provided by HighFive Enterprises ("we," "our," or "us"), you agree to these Terms of Service ("Terms"). If you do not agree, you must not use our services. These Terms apply to all users, clients, and visitors of our website and related platforms.
                </p>

                <h3 id="services">2. Services We Provide</h3>
                <p>We provide the following professional services to help individuals and businesses establish and grow their digital presence:</p>
                <ol>
                  <li>Web Development – Custom, responsive, and mobile-friendly websites with secure database integration.</li>
                  <li>Logo Design – Unique, professional logo creation with multiple revisions and all required file formats.</li>
                  <li>Poster Design – Personalized event and promotional poster designs for print and digital use.</li>
                  <li>Project Sales & Collaboration – Ready-made projects, custom development, and collaborative project management.</li>
                </ol>

                <h3 id="responsibilities">3. Client Responsibilities</h3>
                <p>
                  Clients must provide accurate requirements, timely feedback, and necessary content for smooth workflow. Delays in approvals or content submission may result in extended timelines or additional costs. Clients are responsible for ensuring provided materials do not violate any copyright or third-party rights.
                </p>

                <h3 id="payments">4. Quotes, Payments, and Refunds</h3>
                <p>All quotes are valid for 30 days from the date of issue. Payment terms will be defined in each project agreement.</p>
                <p><strong>Milestone-based Refund Policy:</strong></p>
                <ul>
                  <li>Clients may receive a refund only for milestones not yet started or completed.</li>
                  <li>Once a milestone task begins, that portion of the payment becomes non-refundable.</li>
                  <li>Late payments may pause work until dues are cleared.</li>
                </ul>

                <h3 id="ownership">5. Ownership & Intellectual Property</h3>
                <p>
                  All source files, code, and designs remain the property of HighFive Enterprises until full payment is received. Upon complete payment, ownership of final deliverables is transferred to the client, excluding any proprietary tools or reusable code frameworks developed by the company. The company retains the right to showcase completed projects for portfolio or marketing purposes unless the client requests confidentiality in writing.
                </p>

                <h3 id="liability">6. Limitation of Liability</h3>
                <p>
                  We are not liable for any indirect, incidental, or consequential damages arising from project delays, third-party failures, or client misuse. Our total liability is limited to the amount paid for the specific project or service in question.
                </p>

                <h3 id="termination">7. Termination</h3>
                <p>
                  Either party may terminate the project with written notice. If the client terminates before project completion, payment for all completed work will be retained. If we terminate due to client violation of terms or non-payment, all work will pause immediately, and payments made are non-refundable.
                </p>

                <h3 id="modifications">8. Modifications to Terms</h3>
                <p>
                  We may update these Terms periodically. The latest version will always be available on our website. Continued use of our services after updates indicates acceptance of the new Terms.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
