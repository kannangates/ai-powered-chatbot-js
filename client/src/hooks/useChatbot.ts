import { useContext } from 'react';
import { ChatContext } from '@/components/Chatbot/ChatProvider';

export const useChatbot = () => {
  const context = useContext(ChatContext);
  
  if (!context) {
    throw new Error('useChatbot must be used within a ChatProvider');
  }
  
  return context;
};
