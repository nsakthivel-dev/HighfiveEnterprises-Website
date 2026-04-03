import ContactForm from "@/components/ContactForm";
import FeedbackForm from "@/components/FeedbackForm";
import FeedbackDisplay from "@/components/FeedbackDisplay";
import { Mail, MapPin, Sparkles, Clock, Globe } from "lucide-react";
import { SiGithub, SiLinkedin, SiInstagram, SiFacebook } from "react-icons/si";
import { motion } from "framer-motion";

export default function ReachUs() {
  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      label: "Email",
      value: "touch@lupusventure.com",
      href: "mailto:touch@lupusventure.com",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      label: "Location",
      value: "Chennai, India",
      href: null,
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: "Business Hours",
      value: "Mon–Fri, 9:00–18:00 IST",
      href: null,
    },
    {
      icon: <Globe className="w-6 h-6" />,
      label: "Availability",
      value: "Remote & On-site",
      href: null,
    },
  ];

  const socialLinks = [
    { icon: <SiGithub className="w-6 h-6" />, label: "GitHub", href: "https://github.com/lupus-venture" },
    { icon: <SiLinkedin className="w-6 h-6" />, label: "LinkedIn", href: "https://www.linkedin.com/company/lupus-venture/" },
    { icon: <SiInstagram className="w-6 h-6" />, label: "Instagram", href: "https://instagram.com/lupus.venture" },
    { icon: <SiFacebook className="w-6 h-6" />, label: "Facebook", href: "https://www.facebook.com/LupusVenture" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 origin-left" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-widest">Connect</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight font-heading">
              Let's Start a <span className="text-primary">Conversation</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              Ready to bring your vision to life? Our team is here to help you navigate the digital landscape.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16">
            {/* Left: Contact Info */}
            <div className="lg:col-span-5 space-y-12">
              <div>
                <h2 className="text-3xl font-bold mb-8 font-heading">Contact Information</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 rounded-3xl bg-secondary/30 border border-border/50 flex items-start gap-4 group hover:bg-card transition-colors"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        {info.icon}
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-semibold">{info.label}</p>
                        {info.href ? (
                          <a href={info.href} className="text-lg font-medium hover:text-primary transition-colors">
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-lg font-medium">{info.value}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6 font-heading">Follow Our Journey</h2>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((link, index) => (
                    <motion.a
                      key={index}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
                      aria-label={link.label}
                    >
                      {link.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-7">
              <div className="p-8 md:p-12 rounded-[3rem] bg-card border border-border shadow-2xl shadow-primary/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-8 font-heading">Send us a Message</h2>
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-16 px-6 bg-secondary/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 font-heading">What Our Clients Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
              We take pride in our work and the relationships we build with our clients.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <FeedbackDisplay />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 md:p-8 rounded-[2rem] bg-card border border-border shadow-xl"
            >
              <h3 className="text-2xl font-bold mb-4 font-heading">Share Your Experience</h3>
              <FeedbackForm />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
