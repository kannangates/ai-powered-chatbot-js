import { MessageRole } from '@shared/types';
import { formatRelative } from 'date-fns';
import { chatConfig } from '@shared/config';

interface ChatMessageProps {
  content: string;
  role: MessageRole;
  timestamp: Date;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  role,
  timestamp,
}) => {
  const isUser = role === 'user';
  const msgConfig = chatConfig.ui.messages;
  const formattedTime = formatRelative(timestamp, new Date()).includes('today')
    ? timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : formatRelative(timestamp, new Date());

  return (
    <div className={`flex items-start ${isUser ? 'justify-end mb-4' : 'mb-4'}`}>
      {!isUser && (
        <div 
          className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mr-2"
          style={{ backgroundColor: msgConfig.botAvatarBackground }}
        >
          <span className="text-sm">{msgConfig.botAvatarEmoji}</span>
        </div>
      )}
      
      <div 
        className="p-3 shadow-sm max-w-[80%] rounded-lg"
        style={{ 
          backgroundColor: isUser ? msgConfig.userBackground : msgConfig.botBackground,
          color: isUser ? msgConfig.userTextColor : msgConfig.botTextColor,
          borderTopRightRadius: isUser ? '0' : undefined,
          borderTopLeftRadius: !isUser ? '0' : undefined,
        }}
      >
        <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: content }} />
        <p 
          className="text-xs mt-1"
          style={{ 
            color: msgConfig.timeColor
          }}
        >
          {formattedTime}
        </p>
      </div>
      
      {isUser && (
        <div 
          className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ml-2"
          style={{ backgroundColor: msgConfig.userAvatarBackground }}
        >
          <span className="text-sm">{msgConfig.userAvatarEmoji}</span>
        </div>
      )}
    </div>
  );
};

export const TypingIndicator = () => {
  const msgConfig = chatConfig.ui.messages;
  
  return (
    <div className="flex items-start mb-4">
      <div 
        className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mr-2"
        style={{ backgroundColor: msgConfig.botAvatarBackground }}
      >
        <span className="text-sm">{msgConfig.botAvatarEmoji}</span>
      </div>
      <div 
        className="rounded-lg rounded-tl-none p-3 shadow-sm"
        style={{ backgroundColor: msgConfig.botBackground }}
      >
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-75"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
};
