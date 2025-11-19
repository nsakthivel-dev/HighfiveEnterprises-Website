import ContactForm from "@/components/ContactForm";
import ChatbotWidget from "@/components/ChatbotWidget";
import FeedbackForm from "@/components/FeedbackForm";
import FeedbackDisplay from "@/components/FeedbackDisplay";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin } from "lucide-react";
import { SiGithub, SiLinkedin, SiInstagram, SiFacebook } from "react-icons/si";

export default function Contact() {
  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      value: "teamhfive25@gmail.com",
      href: "mailto:teamhfive25@gmail.com",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Location",
      value: "Puducherry, Tamilnadu",
      href: null,
    },
  ];

  const socialLinks = [
    { icon: <SiGithub className="w-5 h-5" />, label: "GitHub", href: "https://github.com/highfive-tech" },
    { icon: <SiLinkedin className="w-5 h-5" />, label: "LinkedIn", href: "https://www.linkedin.com/in/highfive-enterprises/" },
    { icon: <SiInstagram className="w-5 h-5" />, label: "Instagram", href: "https://instagram.com/highfive.ent" },
    { icon: <SiFacebook className="w-5 h-5" />, label: "Facebook", href: "https://www.facebook.com/HighFiveEnterprises" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? We'd love to hear from you. Send us a message and we'll respond within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form - Takes 2 columns */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>

            {/* Contact Information Sidebar */}
            <div className="space-y-6">
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
                  <h3 className="text-xl font-bold mb-3">Business Hours</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monday - Friday</span>
                      <span className="font-medium">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saturday</span>
                      <span className="font-medium">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sunday</span>
                      <span className="font-medium">Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-muted/50 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied clients and see our overall rating
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="order-2 lg:order-1">
              <FeedbackDisplay />
            </div>
            <div className="order-1 lg:order-2">
              <FeedbackForm />
            </div>
          </div>
        </div>
      </section>

      <ChatbotWidget />
    </div>
  );
}
