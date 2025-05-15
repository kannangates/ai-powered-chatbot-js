import { Button } from '@/components/ui/button';
import { chatConfig } from '@shared/config';

interface ChatHeaderProps {
  onClose: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose }) => {
  const config = chatConfig.ui.header;
  
  return (
    <div 
      className="p-4 rounded-t-lg flex justify-between items-center"
      style={{ 
        backgroundColor: config.backgroundColor,
        color: config.textColor
      }}
    >
      <div className="flex items-center">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
          style={{ backgroundColor: config.avatarBackgroundColor }}
        >
          <span className="text-sm">{config.avatarEmoji}</span>
        </div>
        <div>
          <h3 className="font-semibold">{config.title}</h3>
          <div className="flex items-center text-xs" style={{ color: `${config.textColor}/80` }}>
            <span 
              className="w-2 h-2 rounded-full mr-1.5"
              style={{ backgroundColor: config.onlineStatusColor }}
            />
            <span>{config.onlineStatusText}</span>
          </div>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClose} 
        className="hover:bg-white/10"
        style={{ color: `${config.textColor}/90` }}
      >
        <span className="text-sm">{chatConfig.ui.floatingButton.closeIcon}</span>
      </Button>
    </div>
  );
};
