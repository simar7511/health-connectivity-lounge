
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send, UserCircle2 } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";

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

  if (!patientName) {
    return (
      <div className="flex flex-col h-screen bg-background p-4">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="ml-4 text-xl font-semibold">Select Patient</h1>
        </div>
        <div className="grid gap-4">
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
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex items-center p-4 border-b bg-primary/5">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="hover:bg-primary/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="ml-4 flex items-center gap-3">
          <UserCircle2 className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-semibold">{patientName}</h1>
        </div>
      </div>

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
