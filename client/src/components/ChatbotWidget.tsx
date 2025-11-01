import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your virtual assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: input },
    ];

    setTimeout(() => {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Thanks for your message! A team member will respond shortly.",
        },
      ]);
    }, 500);

    setMessages(newMessages);
    setInput("");
  };

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
                onClick={() => setIsOpen(false)}
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
              </div>

              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a message..."
                  data-testid="input-chat-message"
                />
                <Button onClick={handleSend} size="icon" data-testid="button-send-chat">
                  <Send className="w-4 h-4" />
                </Button>
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
