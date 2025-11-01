import ContactForm from "@/components/ContactForm";
import ChatbotWidget from "@/components/ChatbotWidget";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";
import { SiGithub, SiLinkedin, SiX } from "react-icons/si";

export default function Contact() {
  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      value: "hello@solutionsquad.com",
      href: "mailto:hello@solutionsquad.com",
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: "Phone",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Location",
      value: "San Francisco, CA",
      href: null,
    },
  ];

  const socialLinks = [
    { icon: <SiGithub className="w-5 h-5" />, label: "GitHub", href: "#" },
    { icon: <SiLinkedin className="w-5 h-5" />, label: "LinkedIn", href: "#" },
    { icon: <SiX className="w-5 h-5" />, label: "X", href: "#" },
  ];

  return (
    <div className="min-h-screen">
      <section className="py-20 px-6 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? We'd love to hear from you. Send us a message and we'll respond within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <ContactForm />
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card className="overflow-visible">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                  <div className="space-y-4">
                    {contactInfo.map((info) => (
                      <div key={info.label} className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                          {info.icon}
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{info.label}</p>
                          {info.href ? (
                            <a
                              href={info.href}
                              className="font-medium hover:text-primary transition-colors"
                              data-testid={`link-${info.label.toLowerCase()}`}
                            >
                              {info.value}
                            </a>
                          ) : (
                            <p className="font-medium">{info.value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-visible">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6">Follow Us</h3>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        className="w-12 h-12 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors hover-elevate"
                        aria-label={social.label}
                        data-testid={`link-social-${social.label.toLowerCase()}`}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-visible bg-gradient-to-br from-primary/5 to-chart-2/5">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3">Newsletter</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Subscribe to our newsletter for the latest updates and insights
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="flex-1 px-3 py-2 rounded-md border bg-background text-sm"
                      data-testid="input-newsletter"
                    />
                    <button
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover-elevate active-elevate-2"
                      data-testid="button-subscribe"
                    >
                      Subscribe
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <ChatbotWidget />
    </div>
  );
}
