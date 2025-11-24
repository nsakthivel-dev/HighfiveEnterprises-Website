import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface SubQuestionData {
  questions: string[];
  answers: { [key: number]: string };
}

interface ChatbotData {
  welcome: string;
  mainQuestions: string[];
  subQuestions: { [key: number]: SubQuestionData };
}

const chatbotData: ChatbotData = {
  welcome: "Welcome to HighFive Enterprises! I'm here to help you learn more about our company. Please select a topic below:",
  mainQuestions: [
    "What services does HighFive Enterprises offer?",
    "Can you tell me about your team?",
    "Show me your featured projects",
    "How can I contact HighFive Enterprises?",
    "What is your company's mission?",
    "Do you offer internship opportunities?"
  ],
  subQuestions: {
    0: {
      questions: [
        "Web Development Services",
        "Logo Design Services", 
        "Mobile App Development",
        "UI/UX Design",
        "E-commerce Solutions",
        "Maintenance & Support",
        "Consultation Services"
      ],
      answers: {
        0: "We specialize in creating responsive, modern websites using cutting-edge technologies. Our web development services include static websites, dynamic portals, and complex web applications tailored to your business needs.",
        1: "Our logo design service creates unique brand identities that represent your company's values. We provide multiple design concepts, unlimited revisions, and complete copyright ownership.",
        2: "We develop cross-platform mobile applications for iOS and Android that deliver exceptional user experiences with intuitive interfaces and robust functionality.",
        3: "Our UI/UX design services focus on creating user-centered designs that enhance engagement and conversion rates through research, wireframing, and prototyping.",
        4: "We build secure, scalable e-commerce platforms with payment integration, inventory management, and analytics to help you grow your online business.",
        5: "Our maintenance packages ensure your digital products remain secure, up-to-date, and perform optimally with regular updates, monitoring, and technical support.",
        6: "Our expert consultants provide strategic guidance on technology decisions, project planning, and digital transformation to align with your business objectives."
      }
    },
    1: {
      questions: [
        "Team Size & Structure",
        "Technical Expertise",
        "Design Capabilities",
        "Project Management",
        "Quality Assurance",
        "Continuous Learning",
        "Collaboration Approach"
      ],
      answers: {
        0: "Our team consists of 10+ skilled professionals including developers, designers, project managers, and QA specialists who work in cross-functional squads to deliver exceptional results.",
        1: "Our developers are proficient in modern technologies including React, Next.js, Node.js, Python, TypeScript, and cloud platforms like AWS and Azure.",
        2: "Our design team excels in creating intuitive user interfaces with expertise in Figma, Adobe Creative Suite, and user experience research methodologies.",
        3: "We follow agile methodologies with experienced project managers who ensure timely delivery, clear communication, and alignment with your business goals.",
        4: "Our QA process includes automated testing, manual testing, and continuous integration to ensure bug-free, high-performance applications.",
        5: "We invest in our team's growth through regular training, certifications, hackathons, and knowledge-sharing sessions to stay current with industry trends.",
        6: "We believe in transparent collaboration with clients through regular updates, feedback sessions, and shared project management tools for complete visibility."
      }
    },
    2: {
      questions: [
        "E-commerce Platform",
        "Healthcare Portal",
        "Educational App",
        "Finance Dashboard",
        "Social Media Platform",
        "Analytics Tool",
        "Mobile Banking App"
      ],
      answers: {
        0: "Our flagship e-commerce solution features real-time inventory management, multiple payment gateways, personalized recommendations, and advanced analytics dashboard.",
        1: "We developed a HIPAA-compliant healthcare portal with appointment scheduling, telemedicine capabilities, patient records management, and insurance integration.",
        2: "Our learning management system includes course creation tools, interactive assessments, progress tracking, and multi-device synchronization for seamless learning.",
        3: "This financial analytics dashboard provides real-time data visualization, automated reporting, risk assessment tools, and regulatory compliance features.",
        4: "We built a scalable social platform with real-time messaging, content sharing, community features, and advanced privacy controls.",
        5: "Our business intelligence tool offers customizable dashboards, predictive analytics, data integration from multiple sources, and automated insights generation.",
        6: "This secure banking application includes biometric authentication, transaction history, fund transfers, bill payments, and fraud detection mechanisms."
      }
    },
    3: {
      questions: [
        "Email Address",
        "Phone Number",
        "Office Location",
        "Business Hours",
        "Social Media",
        "Contact Form",
        "Support Channels"
      ],
      answers: {
        0: "You can reach us at teamhfive25@gmail.com for general inquiries, project discussions, and partnership opportunities.",
        1: "Our primary contact number is +91 123 456 7890, available during business hours for immediate assistance.",
        2: "We're based in Puducherry, Tamilnadu, India, with team members working remotely across multiple time zones.",
        3: "Our standard business hours are Monday to Friday, 9:00 AM to 6:00 PM IST, and Saturday 10:00 AM to 4:00 PM IST.",
        4: "Connect with us on LinkedIn, GitHub, Instagram, and Facebook @highfive.enterprises for updates and insights.",
        5: "Use the contact form on our website to send us detailed project requirements and we'll get back to you within 24 hours.",
        6: "For existing clients, we provide dedicated support channels including email, Slack, and priority phone support based on your package."
      }
    },
    4: {
      questions: [
        "Core Mission",
        "Vision Statement",
        "Company Values",
        "Approach Methodology",
        "Quality Standards",
        "Client Commitment",
        "Innovation Focus"
      ],
      answers: {
        0: "Our mission is to empower businesses through innovative digital solutions that drive growth, enhance user experiences, and create lasting value.",
        1: "We envision a world where technology bridges gaps between businesses and their customers, fostering meaningful connections and sustainable growth.",
        2: "We operate on principles of transparency, craftsmanship, continuous learning, collaboration, and ethical business practices in all our engagements.",
        3: "Our approach combines deep listening, rapid prototyping, iterative development, and continuous feedback to ensure perfect alignment with your goals.",
        4: "We maintain rigorous quality standards through code reviews, automated testing, user acceptance testing, and post-launch monitoring.",
        5: "We're committed to being your long-term technology partner, providing ongoing support, maintenance, and strategic guidance for your digital assets.",
        6: "We stay at the forefront of technology trends, regularly experimenting with new tools and methodologies to deliver cutting-edge solutions."
      }
    },
    5: {
      questions: [
        "Internship Programs",
        "Eligibility Criteria",
        "Application Process",
        "Duration & Schedule",
        "Learning Opportunities",
        "Mentorship System",
        "Project Exposure"
      ],
      answers: {
        0: "We offer structured internship programs in web development, UI/UX design, mobile app development, and digital marketing for students and recent graduates.",
        1: "Applicants should be pursuing or have completed a degree in Computer Science, Design, or related fields with basic knowledge of relevant tools and technologies.",
        2: "Apply through our 'Join Team' page by submitting your resume, portfolio (if applicable), and a brief introduction about your interests and goals.",
        3: "Internships typically last 3-6 months with flexible scheduling options including full-time, part-time, and remote arrangements to accommodate academic commitments.",
        4: "Interns gain hands-on experience working on real projects, attending workshops, participating in code reviews, and learning from industry experts.",
        5: "Each intern is paired with a senior team member who provides guidance, feedback, and career advice throughout the internship period.",
        6: "Interns work on actual client projects (under supervision), internal tools development, and innovation projects to build a diverse portfolio."
      }
    }
  }
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: chatbotData.welcome }
  ]);
  const [currentView, setCurrentView] = useState<"main" | "sub">("main");
  const [currentMainIndex, setCurrentMainIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentView]);

  const handleMainQuestionClick = (index: number) => {
    const userMessage: Message = { 
      role: "user", 
      content: chatbotData.mainQuestions[index] 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentView("sub");
    setCurrentMainIndex(index);
  };

  const handleSubQuestionClick = (index: number) => {
    if (currentMainIndex === null) return;
    
    const userMessage: Message = { 
      role: "user", 
      content: chatbotData.subQuestions[currentMainIndex].questions[index] 
    };
    
    const aiMessage: Message = { 
      role: "assistant", 
      content: chatbotData.subQuestions[currentMainIndex].answers[index] 
    };
    
    setMessages(prev => [...prev, userMessage, aiMessage]);
  };

  const handleExit = () => {
    setIsOpen(false);
  };

  const handleBack = () => {
    setCurrentView("main");
    setCurrentMainIndex(null);
    setMessages([{ role: "assistant", content: chatbotData.welcome }]);
  };

  // Reset chat when widget is opened
  useEffect(() => {
    if (isOpen) {
      setMessages([{ role: "assistant", content: chatbotData.welcome }]);
      setCurrentView("main");
      setCurrentMainIndex(null);
    }
  }, [isOpen]);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen ? (
          <Card className="w-80 md:w-96 shadow-xl overflow-visible">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg">Chat with us</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleExit}
                data-testid="button-close-chat"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-64 overflow-y-auto space-y-3 pr-2">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
                
                {/* Main questions section */}
                {currentView === "main" && (
                  <div className="mt-2 space-y-2">
                    {chatbotData.mainQuestions.map((question, index) => (
                      <div 
                        key={index}
                        className="bg-muted text-muted-foreground rounded-lg px-4 py-2 cursor-pointer hover:bg-muted/80 transition-colors text-sm"
                        onClick={() => handleMainQuestionClick(index)}
                      >
                        {question}
                      </div>
                    ))}
                    <div 
                      className="bg-muted text-muted-foreground rounded-lg px-4 py-2 cursor-pointer hover:bg-muted/80 transition-colors text-sm"
                      onClick={handleExit}
                    >
                      Exit
                    </div>
                  </div>
                )}
                
                {/* Sub questions section */}
                {currentView === "sub" && currentMainIndex !== null && (
                  <div className="mt-2 space-y-2">
                    {chatbotData.subQuestions[currentMainIndex].questions.map((question, index) => (
                      <div 
                        key={index}
                        className="bg-muted text-muted-foreground rounded-lg px-4 py-2 cursor-pointer hover:bg-muted/80 transition-colors text-sm"
                        onClick={() => handleSubQuestionClick(index)}
                      >
                        {question}
                      </div>
                    ))}
                    <div 
                      className="bg-muted text-muted-foreground rounded-lg px-4 py-2 cursor-pointer hover:bg-muted/80 transition-colors text-sm"
                      onClick={handleBack}
                    >
                      Back to Main Topics
                    </div>
                    <div 
                      className="bg-muted text-muted-foreground rounded-lg px-4 py-2 cursor-pointer hover:bg-muted/80 transition-colors text-sm"
                      onClick={handleExit}
                    >
                      Exit
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button
            onClick={() => setIsOpen(true)}
            size="icon"
            className="w-14 h-14 rounded-full shadow-lg"
            data-testid="button-open-chat"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        )}
      </div>
    </>
  );
}