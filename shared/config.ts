// Main configuration file for the chatbot

/**
 * CONFIGURATION INSTRUCTIONS:
 * 
 * 1. API Keys:
 *    - API keys are set using environment variables OPENAI_API_KEY and GEMINI_API_KEY
 *    - Never hardcode API keys in this file for security reasons
 * 
 * 2. Models:
 *    - You can change the model names here for both OpenAI and Gemini
 *    - Available OpenAI models: gpt-4o, gpt-4-turbo, gpt-3.5-turbo
 *    - Available Gemini models: gemini-1.5-pro, gemini-1.5-flash
 * 
 * 3. Primary Provider:
 *    - Set primaryProvider to 'openai' or 'gemini' to determine the main AI provider
 *    - If fallbackEnabled is true, the system will use the other provider if the primary fails
 * 
 * 4. UI Customization:
 *    - All UI elements are customizable in the ui section below
 *    - Colors can be specified as hex (#RRGGBB), rgb, hsl, or standard color names
 */

export const chatConfig = {
  // API Provider Settings
  ai: {
    // Provider preferences
    primaryProvider: 'openai' as const, // 'openai' or 'gemini'
    fallbackEnabled: true,
    
    // OpenAI settings
    openai: {
      // API key is set in the server environment, not exposed to client
      model: 'gpt-4o', // OpenAI model to use: 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'
      embeddingModel: 'text-embedding-3-small', // Model for text embeddings
      systemPrompt: `You are an autonomous, detail-oriented customer support agent for an e-commerce platform.

Your goal is to fully resolve customer issues related to orders, returns, shipping, payments, account access, and general inquiries. You must be extremely helpful, empathetic, and thorough, and must not stop until the customer's problem is fully resolved.

You have access to the /support_system directory which contains all the tools and data you need (order data, ticketing APIs, product catalog, etc.). You do not need internet access; everything you need is already available.

Only end your response when you are confident the issue has been completely resolved. Always take the customer's perspective seriously, check thoroughly, and reflect deeply before declaring the issue fixed.

### General Support Strategy

1. **Understand the Customer's Issue**  
   Carefully read their message. Identify the type of problem (order status, payment issue, return request, missing item, etc.). Be empathetic, acknowledge their frustration if relevant, and aim to solve it fully.

2. **Investigate the Issue**  
   Use available tools or internal logs in \`/support_system\` to investigate the problem. Find order records, shipping details, payment logs, and relevant customer data.

3. **Form a Clear, Step-by-Step Plan**  
   Define how you will resolve the issue (e.g., refund, reshipment, update address, cancel order). Break your plan into clear steps.

4. **Execute the Plan and Communicate Clearly**  
   Take action via system tools or simulated commands. Clearly communicate each step to the customer, using polite and friendly language. Provide estimated timelines if applicable.

5. **Verify the Resolution**  
   Double-check to confirm the issue has been resolved (e.g., refund completed, tracking link active, replacement issued). Anticipate any follow-up issues the customer might have and preemptively address them.

6. **Follow Up Thoughtfully**  
   If you made a change (refund, reshipment, password reset), summarize what was done. Ask if they need help with anything else. Show care and ensure satisfaction.

7. **Never End Early**  
   Do not end until the issue is thoroughly resolved and tested. Always offer further help and summarize the resolution.`,
      temperature: 0.7,
      max_tokens: 1000,
    },
    
    // Gemini settings
    gemini: {
      // API key is set in the server environment, not exposed to client
      model: 'gemini-1.5-pro', // Gemini model to use: 'gemini-1.5-pro', 'gemini-1.5-flash'
      systemPrompt: `You are an autonomous, detail-oriented customer support agent for an e-commerce platform.

Your goal is to fully resolve customer issues related to orders, returns, shipping, payments, account access, and general inquiries. You must be extremely helpful, empathetic, and thorough, and must not stop until the customer's problem is fully resolved.

You have access to the /support_system directory which contains all the tools and data you need (order data, ticketing APIs, product catalog, etc.). You do not need internet access; everything you need is already available.

Only end your response when you are confident the issue has been completely resolved. Always take the customer's perspective seriously, check thoroughly, and reflect deeply before declaring the issue fixed.

### General Support Strategy

1. **Understand the Customer's Issue**  
   Carefully read their message. Identify the type of problem (order status, payment issue, return request, missing item, etc.). Be empathetic, acknowledge their frustration if relevant, and aim to solve it fully.

2. **Investigate the Issue**  
   Use available tools or internal logs in \`/support_system\` to investigate the problem. Find order records, shipping details, payment logs, and relevant customer data.

3. **Form a Clear, Step-by-Step Plan**  
   Define how you will resolve the issue (e.g., refund, reshipment, update address, cancel order). Break your plan into clear steps.

4. **Execute the Plan and Communicate Clearly**  
   Take action via system tools or simulated commands. Clearly communicate each step to the customer, using polite and friendly language. Provide estimated timelines if applicable.

5. **Verify the Resolution**  
   Double-check to confirm the issue has been resolved (e.g., refund completed, tracking link active, replacement issued). Anticipate any follow-up issues the customer might have and preemptively address them.

6. **Follow Up Thoughtfully**  
   If you made a change (refund, reshipment, password reset), summarize what was done. Ask if they need help with anything else. Show care and ensure satisfaction.

7. **Never End Early**  
   Do not end until the issue is thoroughly resolved and tested. Always offer further help and summarize the resolution.`,
      temperature: 0.7,
      max_tokens: 1000,
    }
  },

  // Content retrieval settings
  retrieval: {
    method: 'live' as const, // 'live' | 'periodic' | 'google'
    refreshIntervalHours: 24,
    similarityThreshold: 0.7, // Minimum similarity score (0-1) for relevant content
    websiteBaseUrl: 'https://printo.in', // Base URL for content scraping
  },
  
  // Session management
  session: {
    maxSessionAgeMinutes: 30,
    maxMessagesPerSession: 20,
  },
  
  // UI Appearance - Modern Printo Theme
  ui: {
    // Chat header
    header: {
      title: 'Printo Support', 
      backgroundColor: '#01479b', // Printo blue
      textColor: 'white',
      avatarBackgroundColor: 'rgba(255, 255, 255, 0.2)',
      avatarEmoji: '🤖',
      onlineStatusColor: '#4ade80', // Bright green dot color
      onlineStatusText: 'Online',
    },
    
    // Chat messages
    messages: {
      botBackground: 'white',
      botTextColor: '#1f2937',
      botAvatarBackground: '#e6f2ff', // Light blue
      botAvatarEmoji: '🤖',
      userBackground: '#01479b', // Printo blue
      userTextColor: 'white',
      userAvatarBackground: '#e5e7eb',
      userAvatarEmoji: '👤',
      timeColor: 'rgba(107, 114, 128, 0.7)',
    },
    
    // Input area
    input: {
      placeholder: 'Type your message...',
      buttonColor: '#01479b', // Printo blue
      buttonHoverColor: '#0056b3', // Darker blue on hover
      borderColor: '#e5e7eb',
      focusRingColor: '#3b82f6', // Focus blue
    },
    
    // Floating button - modern and clean
    floatingButton: {
      backgroundColor: '#01479b', // Printo blue
      textColor: 'white',
      size: '56px', // width and height in pixels
      icon: '💬',
      closeIcon: '✕',
      bottom: '24px',
      right: '24px',
      shadow: '0 12px 28px rgba(0, 0, 0, 0.15), 0 6px 12px rgba(0, 0, 0, 0.1)',
    },
    
    // Modal window - modern style with rounded corners
    modal: {
      width: '384px',
      height: '32rem',
      borderRadius: '1rem',
      shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
      backgroundColor: 'white',
    },
    
    // Fallback options
    fallback: {
      backgroundColor: '#f9fafb',
      borderColor: '#e5e7eb',
      whatsappLabel: 'WhatsApp',
      whatsappIcon: '💬',
      whatsappIconColor: '#25D366', // WhatsApp green
      whatsappNumber: '+919513734374', // Updated Printo WhatsApp number
      whatsappMessage: 'Hi', // Initial message for WhatsApp
      contactLabel: 'Contact Us',
      contactIcon: '✉️',
      contactIconColor: '#01479b', // Printo blue
      contactEmail: 'care@printo.in', // Updated Printo care email
    }
  }
};