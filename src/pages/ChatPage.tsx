
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Send, UserCircle2 } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { NavigationHeader } from "@/components/layout/NavigationHeader";

interface Message {
  id: string;
  content: string;
  sender: "user" | "provider";
  timestamp: Date;
}

interface LocationState {
  initialMessage?: string;
}

const mockRecipients = [
  { id: 1, name: "Maria Garcia" },
  { id: 2, name: "John Smith" },
];

export const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { patientName } = useParams();
  const location = useLocation();
  const state = location.state as LocationState;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [language, setLanguage] = useState<"en" | "es">("en");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (state?.initialMessage) {
      const message: Message = {
        id: Date.now().toString(),
        content: state.initialMessage,
        sender: "provider",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, message]);
      window.history.replaceState({}, document.title);
    }
  }, [state?.initialMessage]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  const pageTitle = patientName 
    ? patientName 
    : language === "en" 
      ? "Select Patient" 
      : "Seleccionar Paciente";

  if (!patientName) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavigationHeader 
          title={pageTitle}
          language={language}
        />
        
        <main className="flex-1 container mx-auto p-4">
          <div className="grid gap-4 max-w-md mx-auto">
            {mockRecipients.map((recipient) => (
              <Card
                key={recipient.id}
                className="p-4 cursor-pointer hover:bg-accent transition-colors animate-fade-in"
                onClick={() => navigate(`/chat/${recipient.name}`)}
              >
                <div className="flex items-center gap-3">
                  <UserCircle2 className="h-8 w-8 text-primary" />
                  <p className="font-medium">{recipient.name}</p>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <NavigationHeader 
        title={pageTitle}
        language={language}
      />

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } animate-fade-in`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg shadow-sm ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                <p className="text-xs mt-2 opacity-70">
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" className="shrink-0">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatPage;
