import { useEffect, useRef } from 'react';
import { useChatbot } from '@/hooks/useChatbot';
import { ChatHeader } from './ChatHeader';
import { ChatInput } from './ChatInput';
import { ChatMessage, TypingIndicator } from './ChatMessage';
import { FallbackOptions } from './FallbackOptions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { chatConfig } from '@shared/config';

export const Chatbot = () => {
  const { 
    isOpen, 
    messages, 
    isTyping, 
    showFallbackOptions,
    sendMessage, 
    toggleChat,
    messagesEndRef,
    handleWhatsAppClick,
    handleContactClick
  } = useChatbot();

  const btnConfig = chatConfig.ui.floatingButton;
  const modalConfig = chatConfig.ui.modal;

  // Automatically scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <>
      {/* Chat Icon Button */}
      <Button
        onClick={toggleChat}
        style={{
          backgroundColor: btnConfig.backgroundColor,
          color: btnConfig.textColor,
          width: btnConfig.size,
          height: btnConfig.size,
          bottom: btnConfig.bottom,
          right: btnConfig.right,
          boxShadow: btnConfig.shadow,
          transition: 'all 0.3s ease'
        }}
        className={cn(
          "fixed rounded-full z-50 p-0 flex items-center justify-center",
          isOpen ? "rotate-0" : "rotate-0" // No rotation needed
        )}
      >
        <span className="text-xl">{isOpen ? btnConfig.closeIcon : btnConfig.icon}</span>
      </Button>

      {/* Chat Modal */}
      <div 
        style={{
          backgroundColor: modalConfig.backgroundColor,
          width: modalConfig.width,
          height: modalConfig.height,
          borderRadius: modalConfig.borderRadius,
          boxShadow: modalConfig.shadow,
          bottom: btnConfig.bottom,
          right: btnConfig.right
        }}
        className={cn(
          "fixed flex flex-col z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <ChatHeader onClose={toggleChat} />

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto scrollbar-hide space-y-4 bg-gray-50">
          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              content={msg.content}
              role={msg.role}
              timestamp={msg.timestamp}
            />
          ))}
          
          {isTyping && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>

        <ChatInput 
          onSubmit={sendMessage} 
          disabled={isTyping} 
        />

        {showFallbackOptions && (
          <FallbackOptions 
            onWhatsAppClick={handleWhatsAppClick}
            onContactClick={handleContactClick}
          />
        )}
      </div>
    </>
  );
};
