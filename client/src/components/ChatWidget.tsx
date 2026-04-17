"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { sendMessage, startConversation, ChatMessage } from "@/lib/chatService";
import { useToast } from "@/hooks/use-toast";
import { nanoid } from "nanoid";

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userID, setUserID] = useState<string>("");

  useEffect(() => {
    const savedID = localStorage.getItem("vf_user_id");
    if (savedID) {
      setUserID(savedID);
    } else {
      const newID = nanoid();
      localStorage.setItem("vf_user_id", newID);
      setUserID(newID);
    }
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      handleStart();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleStart = async () => {
    setIsLoading(true);
    try {
      const initialMessages = await startConversation(userID);
      setMessages(initialMessages);
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Could not connect to Luna. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (text: string = inputValue) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const responseMessages = await sendMessage(text, userID);
      setMessages((prev) => [...prev, ...responseMessages]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoice = (choice: any) => {
    handleSend(choice.label || choice.name);
  };

  const resetChat = () => {
    setMessages([]);
    handleStart();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            <Card className="w-[350px] sm:w-[400px] h-[500px] shadow-2xl border-primary/20 flex flex-col overflow-hidden">
              <CardHeader className="bg-primary text-primary-foreground py-4 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border-2 border-primary-foreground/20">
                    <AvatarFallback className="bg-primary-foreground text-primary">L</AvatarFallback>
                    <AvatarImage src="/luna-avatar.png" />
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">Luna</CardTitle>
                    <p className="text-xs opacity-80">AI Assistant</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10"
                    onClick={resetChat}
                    title="Reset Conversation"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-hidden p-0 bg-background/50 backdrop-blur-sm">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground rounded-tr-none"
                              : "bg-muted text-foreground rounded-tl-none border border-border"
                          }`}
                        >
                          {msg.content}
                          
                          {msg.type === "choice" && msg.payload && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {msg.payload.map((choice: any, cIdx: number) => (
                                <Button
                                  key={cIdx}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs bg-background hover:bg-primary hover:text-primary-foreground transition-colors h-7"
                                  onClick={() => handleChoice(choice)}
                                >
                                  {choice.label || choice.name}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3 text-sm border border-border">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        </div>
                      </div>
                    )}
                    <div ref={scrollRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              <CardFooter className="p-4 border-t bg-background">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex w-full items-center gap-2"
                >
                  <Input
                    placeholder="Ask Luna anything..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isLoading}
                    className="flex-1 focus-visible:ring-primary"
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={!inputValue.trim() || isLoading}
                    className="shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`h-14 w-14 rounded-full shadow-2xl transition-all duration-300 ${
            isOpen ? "bg-muted text-foreground hover:bg-muted/80" : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
          size="icon"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </motion.div>
    </div>
  );
};

export default ChatWidget;
