
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavigationHeader } from "@/components/layout/NavigationHeader";
import { ReturnToHomeButton } from "@/components/layout/ReturnToHomeButton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, ArrowLeft, MoreVertical } from "lucide-react";
import { DEMO_CONVERSATIONS } from "@/utils/demoData";

const ChatPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [patientName, setPatientName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    // Find the conversation for this patient or use the first one if no patientId
    const conversation = patientId 
      ? DEMO_CONVERSATIONS.find(c => c.patientId === patientId) 
      : DEMO_CONVERSATIONS[0];

    if (conversation) {
      setMessages(conversation.messages);
      setPatientName(conversation.patientName);
    } else if (DEMO_CONVERSATIONS.length > 0) {
      // Fallback to first conversation if patient not found
      setMessages(DEMO_CONVERSATIONS[0].messages);
      setPatientName(DEMO_CONVERSATIONS[0].patientName);
    }
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, [patientId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: "provider",
      content: newMessage,
      timestamp: new Date(),
      attachments: []
    };
    
    setMessages(prev => [...prev, newMsg]);
    setNewMessage("");
    
    // Simulate patient reply after 1 second
    setTimeout(() => {
      const patientReply = {
        id: `msg-${Date.now() + 1}`,
        sender: "patient",
        content: "Thank you for your response!",
        timestamp: new Date(),
        attachments: []
      };
      setMessages(prev => [...prev, patientReply]);
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <NavigationHeader 
        title={patientName || "Secure Chat"} 
        showBackButton
        language="en"
      />
      
      <div className="flex-1 overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-3 border-b">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <div className="bg-primary text-white flex items-center justify-center h-full w-full rounded-full">
                    {patientName?.charAt(0) || "P"}
                  </div>
                </Avatar>
                <div>
                  <p className="font-medium">{patientName || "Patient"}</p>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={message.id || index}
                  className={`flex ${message.sender === 'provider' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'provider' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">{formatTime(message.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 border-t bg-card">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="icon">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
      
      <div className="p-4 border-t">
        <ReturnToHomeButton language="en" />
      </div>
    </div>
  );
};

export default ChatPage;
