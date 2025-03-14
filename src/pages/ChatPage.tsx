
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Send, UserCircle2, Paperclip, PanelRight, X } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NavigationHeader } from "@/components/layout/NavigationHeader";
import { DocumentPreview } from "@/components/messages/DocumentPreview";
import { 
  Message, 
  Conversation,
  loadConversations, 
  addMessage, 
  getConversationByPatientName, 
  markConversationAsRead, 
  initializeMessageStore
} from "@/utils/messageStore";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

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
  const [showAttachments, setShowAttachments] = useState(false);
  const [hasAttachments, setHasAttachments] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { patientName } = useParams();
  const location = useLocation();
  const state = location.state as LocationState;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [language, setLanguage] = useState<"en" | "es">(() => {
    return (sessionStorage.getItem("preferredLanguage") as "en" | "es") || "en";
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initialize message store on component mount
  useEffect(() => {
    const initMessages = async () => {
      await initializeMessageStore();
      console.log("Message store initialized");
      
      // If we have a patientName, load that conversation immediately
      if (patientName) {
        loadPatientConversation(patientName);
      }
    };
    
    initMessages();
  }, []);

  // Function to load a specific patient's conversation
  const loadPatientConversation = async (name: string) => {
    try {
      console.log(`Loading conversation for ${name}`);
      // Mark the conversation as read when opened
      await markConversationAsRead(name);
      
      // Load conversation
      const conversation = await getConversationByPatientName(name);
      if (conversation) {
        console.log("Conversation found:", conversation);
        setMessages(conversation.messages);
        // Check if there are any messages with attachments
        setHasAttachments(conversation.messages.some(msg => msg.attachments && msg.attachments.length > 0));
      } else {
        console.log("No conversation found for patient:", name);
        setMessages([]);
        setHasAttachments(false);
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle patient name change in URL
  useEffect(() => {
    if (patientName) {
      loadPatientConversation(patientName);
    }
  }, [patientName]);

  // Handle auto-scrolling when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle initial message from state
  useEffect(() => {
    if (state?.initialMessage && patientName) {
      const handleInitialMessage = async () => {
        const newMsg: Omit<Message, 'id'> = {
          content: state.initialMessage as string,
          sender: "provider",
          timestamp: new Date(),
        };
        
        await addMessage(patientName, newMsg);
        
        // Reload the conversation to get the updated messages
        loadPatientConversation(patientName);
        
        // Clear the state
        window.history.replaceState({}, document.title);
      };
      
      handleInitialMessage();
    }
  }, [state?.initialMessage, patientName]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !patientName) return;

    const message: Omit<Message, 'id'> = {
      content: newMessage,
      sender: "provider",
      timestamp: new Date(),
    };

    try {
      // Add message to store
      await addMessage(patientName, message);
      
      // Reload the conversation
      loadPatientConversation(patientName);
      
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat(language === "en" ? "en-US" : "es-ES", {
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  // If we're not on a specific patient's chat, show the patient selection screen
  const pageTitle = patientName 
    ? patientName 
    : language === "en" 
      ? "Select Patient" 
      : "Seleccionar Paciente";

  // Get all attachments from all messages for the current patient
  const allAttachments = messages
    .filter(message => message.attachments && message.attachments.length > 0)
    .flatMap(message => message.attachments || []);

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

      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="w-full">
          <ResizablePanel defaultSize={showAttachments ? 65 : 100} minSize={50}>
            <div className="flex flex-col h-full">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "provider" ? "justify-end" : "justify-start"
                      } animate-fade-in`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-lg shadow-sm ${
                          message.sender === "provider"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {message.metadata?.title && message.sender === "user" && (
                          <div className="mb-2">
                            <Badge variant="outline" className="bg-background/50 mb-1">
                              {message.metadata.title}
                            </Badge>
                          </div>
                        )}
                        
                        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                        
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-background/20">
                            {message.attachments.map((attachment) => (
                              <Badge 
                                key={attachment.id} 
                                variant="outline" 
                                className="bg-background/30 mr-2 cursor-pointer"
                                onClick={() => setShowAttachments(true)}
                              >
                                <Paperclip className="h-3 w-3 mr-1" />
                                {attachment.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
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
                  {hasAttachments && (
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setShowAttachments(!showAttachments)}
                      className="shrink-0"
                    >
                      {showAttachments ? (
                        <X className="h-5 w-5" />
                      ) : (
                        <PanelRight className="h-5 w-5" />
                      )}
                    </Button>
                  )}
                  <Button type="submit" className="shrink-0">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </form>
            </div>
          </ResizablePanel>
          
          {showAttachments && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={35} minSize={30}>
                <DocumentPreview 
                  attachments={allAttachments}
                  onClose={() => setShowAttachments(false)}
                  language={language}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default ChatPage;
