import { GoogleGenerativeAI } from "@google/generative-ai";
import { chatConfig } from "@shared/config";

class GeminiService {
  private client: GoogleGenerativeAI;
  
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey) {
      console.warn('Gemini API key not found in environment variables!');
    }
    
    this.client = new GoogleGenerativeAI(apiKey);
    // We'll get the model name dynamically from config during each call
  }
  
  async generateChatResponse(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    relevantContent?: string,
  ): Promise<string> {
    try {
      // Get the model name dynamically from config
      const modelName = chatConfig.ai.gemini.model || 'gemini-1.5-pro';
      console.log(`Using Gemini model: ${modelName}`);
      
      // Initialize Gemini model
      const geminiModel = this.client.getGenerativeModel({ model: modelName });
      
      // Gemini doesn't have a system message, so we'll add the system context to the first user message
      // Priority: config.gemini.systemPrompt > config.openai.systemPrompt > messages system > default
      const systemMessage = 
        chatConfig.ai.gemini.systemPrompt || 
        chatConfig.ai.openai.systemPrompt || 
        messages.find(msg => msg.role === 'system')?.content || 
        '';
      
      // Convert messages from OpenAI format to Gemini format
      const geminiMessages = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => {
          if (msg.role === 'user') {
            // If this is the first user message, prepend the system instruction
            const isFirstUserMsg = msg === messages.filter(m => m.role === 'user')[0];
            const content = isFirstUserMsg && systemMessage 
              ? `${systemMessage}\n\n${msg.content}`
              : msg.content;
              
            return { role: 'user', parts: [{ text: content }] };
          } else {
            return { role: 'model', parts: [{ text: msg.content }] };
          }
        });
      
      // Add relevant content context if available
      let prompt = '';
      if (relevantContent) {
        prompt = `Use the following relevant information from our website to answer the user's question:\n${relevantContent}\n\n`;
      } else {
        prompt = "If you don't know the answer based on our website content, be honest and say you're not sure.\n\n";
      }
      
      // Create a chat session
      const chat = geminiModel.startChat({
        history: geminiMessages.slice(0, -1),
        generationConfig: {
          temperature: chatConfig.ai.gemini.temperature,
          maxOutputTokens: chatConfig.ai.gemini.max_tokens,
        },
      });
      
      // Get the response with the latest message
      const latestMessage = geminiMessages[geminiMessages.length - 1];
      const result = await chat.sendMessage(
        prompt + (latestMessage.parts[0].text || '')
      );
      
      return result.response.text();
    } catch (error) {
      console.error("Error generating Gemini chat response:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
