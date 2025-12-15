import ContactForm from "@/components/ContactForm";
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
      value: "Puducherry",
      href: null,
    }
  ];

  const socialLinks = [
    { icon: <SiGithub className="w-5 h-5" />, label: "GitHub", href: "https://github.com/highfive-tech" },
    { icon: <SiLinkedin className="w-5 h-5" />, label: "LinkedIn", href: "https://www.linkedin.com/in/highfive-enterprises/" },
    { icon: <SiInstagram className="w-5 h-5" />, label: "Instagram", href: "https://instagram.com/highfive.ent" },
    { icon: <SiFacebook className="w-5 h-5" />, label: "Facebook", href: "https://www.facebook.com/HighFiveEnterprises" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions or ready to start your project? We'd love to hear from you!
          </p>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div>
              <div className="space-y-8">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                    <div className="space-y-4">
                      {contactInfo.map((info, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                            {info.icon}
                          </div>
                          <div>
                            <h3 className="font-medium">{info.label}</h3>
                            {info.href ? (
                              <a 
                                href={info.href} 
                                className="text-muted-foreground hover:text-primary transition-colors"
                              >
                                {info.value}
                              </a>
                            ) : (
                              <p className="text-muted-foreground">{info.value}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Social Links */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Connect With Us</h2>
                    <div className="flex flex-wrap gap-4">
                      {socialLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                          aria-label={link.label}
                        >
                          {link.icon}
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Business Hours */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Business Hours</h2>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monday - Friday</span>
                        <span className="font-medium">9:00 - 18:00 IST</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Saturday</span>
                        <span className="font-medium">Closed</span>
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
    </div>
  );
}