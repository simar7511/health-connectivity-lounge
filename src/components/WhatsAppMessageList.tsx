
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WhatsAppMessage {
  to: string;
  message: string;
  timestamp: string;
}

export const WhatsAppMessageList = () => {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [showMessages, setShowMessages] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Retrieve messages from localStorage
    const storedMessages = JSON.parse(localStorage.getItem("sentWhatsAppMessages") || "[]");
    setMessages(storedMessages);

    // Set up an interval to check for new messages
    const interval = setInterval(() => {
      const updatedMessages = JSON.parse(localStorage.getItem("sentWhatsAppMessages") || "[]");
      if (JSON.stringify(updatedMessages) !== JSON.stringify(messages)) {
        setMessages(updatedMessages);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [messages]);

  const clearMessages = () => {
    localStorage.removeItem("sentWhatsAppMessages");
    setMessages([]);
    toast({
      title: "WhatsApp Inbox Cleared",
      description: "All captured WhatsApp messages have been deleted",
    });
  };

  if (messages.length === 0 && !showMessages) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5 text-green-600" />
            <span>WhatsApp Inbox</span>
          </div>
          <Badge variant="outline" className="ml-2">
            {messages.length} {messages.length === 1 ? "message" : "messages"}
          </Badge>
        </CardTitle>
        <CardDescription>
          Captured WhatsApp messages (free implementation)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Your WhatsApp inbox is empty</p>
            <p className="text-sm mt-2">Messages will appear here when they are sent</p>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[300px] rounded-md border p-4">
              {[...messages].reverse().map((msg, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>To: {msg.to}</span>
                    <span>{new Date(msg.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="mt-1 rounded-md bg-green-50 p-3">{msg.message}</div>
                </div>
              ))}
            </ScrollArea>
            <div className="flex justify-end mt-4">
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={clearMessages}
                className="flex items-center"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
