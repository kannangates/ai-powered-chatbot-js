import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { chatConfig } from '@shared/config';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, disabled }) => {
  const [message, setMessage] = useState('');
  const inputConfig = chatConfig.ui.input;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !disabled) {
      onSubmit(message);
      setMessage('');
    }
  };

  return (
    <div className="p-4 border-t" style={{ borderColor: inputConfig.borderColor }}>
      <form onSubmit={handleSubmit} className="flex items-center">
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={inputConfig.placeholder}
          disabled={disabled}
          className="flex-1 mr-2 rounded-full px-4 py-2"
          style={{
            borderColor: inputConfig.borderColor,
            '--focus-ring-color': inputConfig.focusRingColor
          } as React.CSSProperties}
        />
        <Button 
          type="submit"
          disabled={!message.trim() || disabled}
          style={{ 
            backgroundColor: inputConfig.buttonColor, 
            color: 'white',
            '--hover-color': inputConfig.buttonHoverColor 
          } as React.CSSProperties}
          className="hover:bg-[var(--hover-color)] rounded-full h-10 w-10 p-0 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </Button>
      </form>
      <div className="text-xs text-gray-500 mt-2 flex items-center">
        <span className="mr-1">ℹ️</span>
        <span>Powered by {chatConfig.ai.primaryProvider === 'openai' ? 'GPT-4o' : 'Gemini'} with website knowledge</span>
      </div>
    </div>
  );
};
