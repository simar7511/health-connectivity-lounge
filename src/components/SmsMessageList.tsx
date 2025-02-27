
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface SmsMessage {
  to: string;
  message: string;
  timestamp: string;
}

export const SmsMessageList = () => {
  const [messages, setMessages] = useState<SmsMessage[]>([]);

  useEffect(() => {
    // Retrieve messages from session storage
    const storedMessages = JSON.parse(sessionStorage.getItem("sentSmsMessages") || "[]");
    setMessages(storedMessages);

    // Set up an interval to check for new messages
    const interval = setInterval(() => {
      const updatedMessages = JSON.parse(sessionStorage.getItem("sentSmsMessages") || "[]");
      if (updatedMessages.length !== messages.length) {
        setMessages(updatedMessages);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [messages.length]);

  if (messages.length === 0) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>SMS Message Log (Demo Mode)</span>
          <Badge variant="outline" className="ml-2">
            {messages.length} {messages.length === 1 ? "message" : "messages"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] rounded-md border p-4">
          {messages.map((msg, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>To: {msg.to}</span>
                <span>{new Date(msg.timestamp).toLocaleString()}</span>
              </div>
              <div className="mt-1 rounded-md bg-muted p-3">{msg.message}</div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
