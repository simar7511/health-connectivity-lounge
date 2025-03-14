
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Circle, Paperclip } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { DEMO_CONVERSATIONS } from "@/utils/demoData";

interface MessagingInboxProps {
  language: "en" | "es";
  onStartChat?: () => void;
}

const content = {
  en: {
    title: "Secure Messages",
    chat: "Secure Chat",
    unread: "unread messages",
    noMessages: "No messages",
    attachment: "attachment",
    attachments: "attachments",
    loading: "Loading messages..."
  },
  es: {
    title: "Mensajes Seguros",
    chat: "Chat Seguro",
    unread: "mensajes sin leer",
    noMessages: "No hay mensajes",
    attachment: "archivo adjunto",
    attachments: "archivos adjuntos",
    loading: "Cargando mensajes..."
  },
};

export const MessagingInbox = ({ language, onStartChat }: MessagingInboxProps) => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState(DEMO_CONVERSATIONS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat(language === "en" ? "en-US" : "es-ES", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  const getAttachmentCountText = (count: number) => {
    if (count === 0) return "";
    return `${count} ${count === 1 ? content[language].attachment : content[language].attachments}`;
  };

  const handleOpenChat = (patientId: string) => {
    console.log(`Opening chat for ${patientId}`);
    navigate(`/chat/${patientId}`);
  };

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
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate("/chat")}
            >
              <MessageSquare className="h-4 w-4" />
              {content[language].chat}
            </Button>
          </div>
          
          <div className="space-y-2">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-muted-foreground">{content[language].loading}</p>
              </div>
            ) : conversations.length > 0 ? (
              conversations.map((conversation) => {
                // Get the latest message
                const latestMessage = conversation.messages[conversation.messages.length - 1];
                // Count attachments across all messages
                const attachmentCount = conversation.messages.reduce(
                  (count, msg) => count + (msg.attachments?.length || 0), 
                  0
                );
                
                return (
                  <div
                    key={conversation.id}
                    className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => handleOpenChat(conversation.patientId)}
                  >
                    <div className="flex items-start gap-2">
                      {conversation.unread && (
                        <Circle className="h-2 w-2 mt-2 fill-blue-500 text-blue-500 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="font-medium">{conversation.patientName}</p>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(conversation.lastUpdated)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground truncate">
                          {latestMessage.content}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-1">
                          {latestMessage.metadata && latestMessage.metadata.title && (
                            <Badge variant="outline" className="text-xs">
                              {latestMessage.metadata.title}
                            </Badge>
                          )}
                          
                          {attachmentCount > 0 && (
                            <Badge variant="secondary" className="text-xs flex items-center gap-1">
                              <Paperclip className="h-3 w-3" />
                              {getAttachmentCountText(attachmentCount)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                {content[language].noMessages}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
