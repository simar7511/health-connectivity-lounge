
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavigationHeader } from "@/components/layout/NavigationHeader";
import { ReturnToHomeButton } from "@/components/layout/ReturnToHomeButton";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, MoreVertical, FileText } from "lucide-react";
import { DEMO_CONVERSATIONS } from "@/utils/demoData";
import { DocumentPreview } from "@/components/messages/DocumentPreview";
import { Badge } from "@/components/ui/badge";
import { 
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from "@/components/ui/resizable";
import { toast } from "@/hooks/use-toast";

const ChatPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId?: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [patientName, setPatientName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showAttachments, setShowAttachments] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [attachments, setAttachments] = useState<any[]>([]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setIsLoading(true);
    console.log("ChatPage loading with patientId:", patientId);
    
    try {
      // Find the conversation for this patient or use the first one if no patientId
      const conversation = patientId 
        ? DEMO_CONVERSATIONS.find(c => c.patientId === patientId) 
        : DEMO_CONVERSATIONS[0];

      if (conversation) {
        console.log("Found conversation:", conversation.patientName);
        setMessages(conversation.messages);
        setPatientName(conversation.patientName);
        
        // Collect all attachments from all messages
        const allAttachments = conversation.messages.reduce((acc, msg) => {
          if (msg.attachments && msg.attachments.length > 0) {
            return [...acc, ...msg.attachments.map(att => ({
              ...att,
              date: msg.timestamp,
              type: att.type.includes('pdf') ? 'lab_result' : 
                    att.type.includes('image') ? 'image' : 'document'
            }))];
          }
          return acc;
        }, []);
        
        setAttachments(allAttachments);
      } else if (DEMO_CONVERSATIONS.length > 0) {
        // Fallback to first conversation if patient not found
        console.log("Patient not found, using first conversation");
        setMessages(DEMO_CONVERSATIONS[0].messages);
        setPatientName(DEMO_CONVERSATIONS[0].patientName);
      } else {
        console.log("No conversations available");
        setMessages([]);
        setPatientName("No Patient");
      }
    } catch (error) {
      console.error("Error loading chat data:", error);
      toast({
        variant: "destructive",
        title: "Error loading chat",
        description: "There was a problem loading the chat. Please try again."
      });
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
      attachments: [],
      metadata: {
        title: "Provider Message"
      }
    };
    
    setMessages(prev => [...prev, newMsg]);
    setNewMessage("");
    
    // Update the conversation in DEMO_CONVERSATIONS for persistence
    const conversation = DEMO_CONVERSATIONS.find(c => 
      c.patientId === (patientId || DEMO_CONVERSATIONS[0].patientId)
    );
    
    if (conversation) {
      conversation.messages.push(newMsg);
      conversation.lastUpdated = new Date();
    }
    
    // Simulate patient reply after 1.5 seconds
    setTimeout(() => {
      const patientReply = {
        id: `msg-${Date.now() + 1}`,
        sender: "patient",
        content: "Thank you for your response!",
        timestamp: new Date(),
        attachments: [],
        metadata: {
          title: "Patient Reply"
        }
      };
      setMessages(prev => [...prev, patientReply]);
      
      // Update the conversation in DEMO_CONVERSATIONS
      if (conversation) {
        conversation.messages.push(patientReply);
        conversation.lastUpdated = new Date();
      }
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  const toggleAttachments = () => {
    setShowAttachments(prev => !prev);
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
              <div className="flex items-center gap-2">
                {attachments.length > 0 && (
                  <Button
                    variant={showAttachments ? "default" : "outline"}
                    size="sm"
                    onClick={toggleAttachments}
                    className="flex items-center gap-1"
                  >
                    <FileText className="h-4 w-4" />
                    {attachments.length} {attachments.length === 1 ? 'Attachment' : 'Attachments'}
                  </Button>
                )}
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={showAttachments ? 65 : 100} minSize={40}>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 h-full">
                    {messages.map((message, index) => (
                      <div 
                        key={message.id || index}
                        className={`flex ${message.sender === 'provider' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className="max-w-[80%]">
                          {message.metadata && message.metadata.title && (
                            <div className="mb-1 text-xs">
                              <Badge variant="outline" className="ml-1">
                                {message.metadata.title}
                              </Badge>
                            </div>
                          )}
                          <div 
                            className={`rounded-lg p-3 ${
                              message.sender === 'provider' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}
                          >
                            <p>{message.content}</p>
                            <p className="text-xs mt-1 opacity-70">{formatTime(new Date(message.timestamp))}</p>
                          </div>
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs flex items-center gap-1"
                                onClick={toggleAttachments}
                              >
                                <Paperclip className="h-3 w-3" />
                                {message.attachments.length} {message.attachments.length === 1 ? 'attachment' : 'attachments'}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ResizablePanel>
                
                {showAttachments && (
                  <>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={35} minSize={30}>
                      <DocumentPreview
                        attachments={attachments}
                        onClose={toggleAttachments}
                        language="en"
                      />
                    </ResizablePanel>
                  </>
                )}
              </ResizablePanelGroup>
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
