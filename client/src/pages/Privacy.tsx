import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Privacy() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const toc = [
    { id: "collect", label: "1. Information We Collect" },
    { id: "use", label: "2. How We Use Your Information" },
    { id: "security", label: "3. Data Security" },
    { id: "sharing", label: "4. Information Sharing" },
    { id: "retention", label: "5. Data Retention" },
    { id: "rights", label: "6. Your Rights" },
    { id: "cookies", label: "7. Cookies" },
    { id: "updates", label: "8. Updates to this Policy" },
  ];
  return (
    <div className="min-h-screen">
      <header className="px-6 py-16 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-muted-foreground max-w-2xl">How we collect, use, and protect your information.</p>
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
                <h3 id="collect">1. Information We Collect</h3>
                <p>We collect the following types of information:</p>
                <ul>
                  <li><strong>Personal Information:</strong> Name, email address, phone number, and project details.</li>
                  <li><strong>Non-Personal Information:</strong> Browser type, device information, and site usage data.</li>
                  <li><strong>Communications:</strong> Any messages, inquiries, or files shared with us for project purposes.</li>
                </ul>

                <h3 id="use">2. How We Use Your Information</h3>
                <p>Your information is used to:</p>
                <ul>
                  <li>Deliver requested services and manage ongoing projects.</li>
                  <li>Communicate updates, feedback, and invoices.</li>
                  <li>Improve our services and website experience.</li>
                  <li>Maintain records for internal and legal purposes.</li>
                </ul>

                <h3 id="security">3. Data Security</h3>
                <p>
                  We take reasonable technical and administrative measures to protect your data against unauthorized access, modification, or loss. However, no system can be guaranteed fully secure.
                </p>

                <h3 id="sharing">4. Information Sharing</h3>
                <p>
                  We do not sell or rent client data. We may share necessary details only with trusted service providers (e.g., hosting or payment processors) to complete your project, or if required by law.
                </p>

                <h3 id="retention">5. Data Retention</h3>
                <p>
                  Client data is retained only for as long as necessary to complete the project or comply with legal obligations. After that, it may be safely archived or deleted.
                </p>

                <h3 id="rights">6. Your Rights</h3>
                <p>You have the right to:</p>
                <ul>
                  <li>Request a copy of your personal data.</li>
                  <li>Request corrections to inaccurate information.</li>
                  <li>Request deletion of your data after project completion.</li>
                  <li>Object to your data being used for marketing communications.</li>
                </ul>

                <h3 id="cookies">7. Cookies</h3>
                <p>
                  Our website may use cookies to improve functionality and user experience. You can manage or disable cookies in your browser settings.
                </p>

                <h3 id="updates">8. Updates to this Policy</h3>
                <p>
                  We may revise this Privacy Policy from time to time. The latest version will always be posted on our website.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
