import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface MessagingInboxProps {
  language: "en" | "es";
  onStartChat: () => void;
}

const content = {
  en: {
    title: "Secure Messages",
    chat: "Secure Chat",
  },
  es: {
    title: "Mensajes Seguros",
    chat: "Chat Seguro",
  },
};

export const MessagingInbox = ({ language, onStartChat }: MessagingInboxProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        {content[language].title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={onStartChat}
        >
          <MessageSquare className="h-4 w-4" />
          {content[language].chat}
        </Button>
      </div>
    </CardContent>
  </Card>
);