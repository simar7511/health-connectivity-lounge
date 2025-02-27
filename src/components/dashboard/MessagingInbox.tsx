
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Circle, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface MessagingInboxProps {
  language: "en" | "es";
  onStartChat: () => void;
}

const content = {
  en: {
    title: "Secure Messages",
    chat: "Secure Chat",
    aiChat: "AI Health Assistant",
    unread: "unread messages",
  },
  es: {
    title: "Mensajes Seguros",
    chat: "Chat Seguro",
    aiChat: "Asistente de Salud IA",
    unread: "mensajes sin leer",
  },
};

const mockMessages = [
  { id: 1, unread: true, from: "Maria Garcia", preview: "Lab results attached" },
  { id: 2, unread: true, from: "John Smith", preview: "Follow-up question" },
];

export const MessagingInbox = ({ language }: MessagingInboxProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {content[language].title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate("/chat")}
            >
              <MessageSquare className="h-4 w-4" />
              {content[language].chat}
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate("/ai-chat")}
            >
              <Bot className="h-4 w-4" />
              {content[language].aiChat}
            </Button>
          </div>
          
          <div className="space-y-2">
            {mockMessages.map((message) => (
              <div
                key={message.id}
                className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                onClick={() => navigate(`/chat/${message.from}`)}
              >
                <div className="flex items-start gap-2">
                  {message.unread && (
                    <Circle className="h-2 w-2 mt-2 fill-blue-500 text-blue-500" />
                  )}
                  <div>
                    <p className="font-medium">{message.from}</p>
                    <p className="text-sm text-muted-foreground">
                      {message.preview}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
