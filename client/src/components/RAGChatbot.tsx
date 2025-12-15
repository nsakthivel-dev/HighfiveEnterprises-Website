import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

// RAG Chatbot Component

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function RAGChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! Ask me anything about the Highfive Enterprises." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call the RAG API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from chat API");
      }

      const data = await response.json();
      
      // Add assistant message
      const assistantMessage: Message = { role: "assistant", content: data.response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting response:", error);
      const errorMessage: Message = { 
        role: "assistant", 
        content: "Sorry, I encountered an error processing your request." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExit = () => {
    setIsOpen(false);
  };

  // Reset chat when widget is opened
  useEffect(() => {
    if (isOpen) {
      setMessages([
        { role: "assistant", content: "Hello! Ask me anything about the Highfive Enterprises." }
      ]);
    }
  }, [isOpen]);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen ? (
          <Card className="w-80 md:w-96 shadow-xl overflow-visible">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg">Document Assistant</CardTitle>
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
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-muted-foreground rounded-lg px-4 py-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about documents..."
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 border rounded-md text-sm"
                />
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={isLoading || !input.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
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