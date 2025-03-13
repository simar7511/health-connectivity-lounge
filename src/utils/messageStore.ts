
import { set, get } from 'idb-keyval';

export interface Attachment {
  id: string;
  name: string;
  type: 'lab_result' | 'prescription' | 'image' | 'document';
  url: string;
  preview?: string;
  date: Date;
}

export interface Message {
  id: string;
  content: string;
  sender: "user" | "provider";
  timestamp: Date;
  attachments?: Attachment[];
  metadata?: {
    title?: string;
    description?: string;
  };
  read?: boolean;
}

export interface Conversation {
  id: string;
  patientId: number;
  patientName: string;
  messages: Message[];
  lastUpdated: Date;
  unread: boolean;
}

// Mock data for initial conversations
const mockAttachments: Record<string, Attachment[]> = {
  "Maria Garcia": [
    {
      id: "att-001",
      name: "Blood Test Results.pdf",
      type: "lab_result",
      url: "#",
      preview: "Hemoglobin: 13.2 g/dL (Normal)\nWhite Blood Cells: 7,500/μL (Normal)\nPlatelets: 250,000/μL (Normal)\nGlucose: 95 mg/dL (Normal)",
      date: new Date(2023, 10, 15)
    }
  ],
  "John Smith": [
    {
      id: "att-002",
      name: "Prescription.pdf",
      type: "prescription",
      url: "#",
      preview: "Medication: Amoxicillin\nDosage: 500mg\nFrequency: 3 times daily\nDuration: 7 days\nNotes: Take with food",
      date: new Date(2023, 10, 20)
    }
  ]
};

// Initial mock conversations for patients
const initialConversations: Conversation[] = [
  {
    id: "conv-1",
    patientId: 1,
    patientName: "Maria Garcia",
    messages: [
      {
        id: "msg-1",
        content: "Hello Dr. Johnson, I've attached my recent lab results for your review.",
        sender: "user",
        timestamp: new Date(2023, 10, 15, 14, 30),
        metadata: {
          title: "Lab results attached",
        },
        attachments: mockAttachments["Maria Garcia"],
      },
      {
        id: "msg-2",
        content: "Thank you for sending these over. Your hemoglobin, white blood cell count, and other values look normal. We should continue monitoring your glucose levels, but I don't see any immediate concerns.",
        sender: "provider",
        timestamp: new Date(2023, 10, 15, 16, 45),
      }
    ],
    lastUpdated: new Date(2023, 10, 15, 16, 45),
    unread: true
  },
  {
    id: "conv-2",
    patientId: 2,
    patientName: "John Smith",
    messages: [
      {
        id: "msg-3",
        content: "Dr. Johnson, I have a follow-up question about my prescription.",
        sender: "user",
        timestamp: new Date(2023, 10, 20, 9, 15),
        metadata: {
          title: "Follow-up question",
        },
        attachments: mockAttachments["John Smith"]
      }
    ],
    lastUpdated: new Date(2023, 10, 20, 9, 15),
    unread: true
  }
];

// In-memory store as a fallback
let memoryStore: {
  conversations: Conversation[];
} = {
  conversations: [...initialConversations]
};

// Load conversations from localStorage or use initial data
export const loadConversations = async (): Promise<Conversation[]> => {
  try {
    // Try to get from IndexedDB first
    const storedConversations = await get('secureMessages');
    if (storedConversations) {
      // Parse dates from stored JSON
      const conversations = storedConversations.map((conv: any) => ({
        ...conv,
        lastUpdated: new Date(conv.lastUpdated),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
          attachments: msg.attachments?.map((att: any) => ({
            ...att,
            date: new Date(att.date)
          }))
        }))
      }));
      memoryStore.conversations = conversations;
      return conversations;
    }
    
    // Fallback to localStorage
    const localStorage = window.localStorage.getItem('secureMessages');
    if (localStorage) {
      const parsed = JSON.parse(localStorage);
      // Parse dates from stored JSON
      const conversations = parsed.map((conv: any) => ({
        ...conv,
        lastUpdated: new Date(conv.lastUpdated),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
          attachments: msg.attachments?.map((att: any) => ({
            ...att,
            date: new Date(att.date)
          }))
        }))
      }));
      memoryStore.conversations = conversations;
      return conversations;
    }
  } catch (error) {
    console.error('Error loading conversations:', error);
  }
  
  // Return initial data if nothing is stored
  return memoryStore.conversations;
};

// Save conversations to localStorage
export const saveConversations = async (conversations: Conversation[]): Promise<void> => {
  try {
    memoryStore.conversations = conversations;
    
    // Try to save to IndexedDB
    await set('secureMessages', conversations);
    
    // Fallback to localStorage
    window.localStorage.setItem('secureMessages', JSON.stringify(conversations));
  } catch (error) {
    console.error('Error saving conversations:', error);
  }
};

// Get conversation by patient name
export const getConversationByPatientName = async (patientName: string): Promise<Conversation | undefined> => {
  const conversations = await loadConversations();
  return conversations.find(conv => conv.patientName === patientName);
};

// Add message to conversation
export const addMessage = async (patientName: string, message: Omit<Message, 'id'>): Promise<void> => {
  const conversations = await loadConversations();
  const conversation = conversations.find(conv => conv.patientName === patientName);
  
  if (conversation) {
    // Add message to existing conversation
    conversation.messages.push({
      ...message,
      id: `msg-${Date.now()}`
    });
    conversation.lastUpdated = new Date();
    
    // If it's a user message, mark as unread
    if (message.sender === 'user') {
      conversation.unread = true;
    }
  } else {
    // Create new conversation
    conversations.push({
      id: `conv-${Date.now()}`,
      patientId: conversations.length + 1,
      patientName,
      messages: [{
        ...message,
        id: `msg-${Date.now()}`
      }],
      lastUpdated: new Date(),
      unread: message.sender === 'user'
    });
  }
  
  await saveConversations(conversations);
};

// Mark conversation as read
export const markConversationAsRead = async (patientName: string): Promise<void> => {
  const conversations = await loadConversations();
  const conversation = conversations.find(conv => conv.patientName === patientName);
  
  if (conversation) {
    conversation.unread = false;
    conversation.messages.forEach(msg => {
      if (msg.sender === 'user') {
        msg.read = true;
      }
    });
    
    await saveConversations(conversations);
  }
};

// Initialize data
export const initializeMessageStore = async (): Promise<void> => {
  const conversations = await loadConversations();
  
  // If no conversations exist, save the initial ones
  if (conversations.length === 0) {
    await saveConversations(initialConversations);
  }
};
