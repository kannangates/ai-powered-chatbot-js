import { chatConfig } from '@shared/config';
import { FaWhatsapp } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

interface FallbackOptionsProps {
  onWhatsAppClick: () => void;
  onContactClick: () => void;
}

export const FallbackOptions: React.FC<FallbackOptionsProps> = ({
  onWhatsAppClick,
  onContactClick,
}) => {
  const fallbackConfig = chatConfig.ui.fallback;
  
  return (
    <div 
      className="p-4 border-t"
      style={{ 
        backgroundColor: fallbackConfig.backgroundColor,
        borderColor: fallbackConfig.borderColor
      }}
    >
      <p className="text-sm text-gray-600 mb-3">Can't find what you're looking for? Try these options:</p>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onWhatsAppClick}
          className="flex items-center justify-center bg-white p-3 rounded-md border border-gray-300 hover:bg-gray-50 transition"
        >
          <span 
            className="mr-2"
            style={{ color: fallbackConfig.whatsappIconColor }}
          >
            <FaWhatsapp size={16} />
          </span>
          <span className="text-sm font-medium">{fallbackConfig.whatsappLabel}</span>
        </button>
        <button
          onClick={onContactClick}
          className="flex items-center justify-center bg-white p-3 rounded-md border border-gray-300 hover:bg-gray-50 transition"
        >
          <span 
            className="mr-2"
            style={{ color: fallbackConfig.contactIconColor }}
          >
            <MdEmail size={16} />
          </span>
          <span className="text-sm font-medium">{fallbackConfig.contactLabel}</span>
        </button>
      </div>
    </div>
  );
};
