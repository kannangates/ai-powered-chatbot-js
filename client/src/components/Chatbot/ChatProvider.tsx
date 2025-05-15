import { createContext, useState, useRef, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { Message } from '@shared/types';
import { chatConfig } from '@shared/config';

interface ChatContextType {
  isOpen: boolean;
  messages: Message[];
  isTyping: boolean;
  showFallbackOptions: boolean;
  sendMessage: (content: string) => Promise<void>;
  toggleChat: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  handleWhatsAppClick: () => void;
  handleContactClick: () => void;
}

export const ChatContext = createContext<ChatContextType>({
  isOpen: false,
  messages: [],
  isTyping: false,
  showFallbackOptions: false,
  sendMessage: async () => {},
  toggleChat: () => {},
  messagesEndRef: { current: null },
  handleWhatsAppClick: () => {},
  handleContactClick: () => {},
});

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showFallbackOptions, setShowFallbackOptions] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat with welcome message
  useEffect(() => {
    // Generate a unique session ID
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    setSessionId(newSessionId);
    
    // Add welcome message with the site name from config
    const siteName = chatConfig.ui.header.title || 'Printo Support';
    setMessages([
      {
        role: 'assistant',
        content: `Hi there! I'm your ${siteName} assistant. I can help answer questions about products, pricing, or anything else related to our services. How can I help you today?`,
        timestamp: new Date()
      }
    ]);
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user' as const, content, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    
    // Start typing indicator
    setIsTyping(true);
    
    // Hide fallback options when sending new message
    setShowFallbackOptions(false);
    
    try {
      // Send message to backend
      const response = await apiRequest('POST', '/api/chat', {
        message: content,
        sessionId,
      });
      
      const data = await response.json();
      
      // Add AI response to chat
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: data.message, 
          timestamp: new Date() 
        }
      ]);
      
      // If the response came from FAQ, log this information
      if (data.usedFAQ) {
        console.log('Response from FAQ database');
      }
      
      // Show fallback options if:
      // 1. No relevant content was found from website crawling, or
      // 2. We had to use the fallback AI provider, and
      // 3. The response did NOT come from our FAQ database (FAQ responses are reliable)
      setShowFallbackOptions(
        (data.noRelevantContentFound || data.usedFallback) && 
        !data.usedFAQ
      );
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message to chat
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm having trouble connecting to our support systems at the moment. Please try contacting us directly through WhatsApp or email using the options below, and our team will assist you promptly.",
          timestamp: new Date()
        }
      ]);
      
      // Show fallback options on error
      setShowFallbackOptions(true);
    } finally {
      setIsTyping(false);
    }
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = chatConfig.ui.fallback.whatsappNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(chatConfig.ui.fallback.whatsappMessage || 'Hi');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleContactClick = () => {
    // Open email client in a new window
    window.open(`mailto:${chatConfig.ui.fallback.contactEmail}`, '_blank');
  };

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        messages,
        isTyping,
        showFallbackOptions,
        sendMessage,
        toggleChat,
        messagesEndRef,
        handleWhatsAppClick,
        handleContactClick
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
