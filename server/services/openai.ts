import OpenAI from "openai";
import { chatConfig } from "@shared/config";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. 
// do not change this unless explicitly requested by the user
// Don't use a constant MODEL - we'll get it dynamically from config each time to support runtime changes

class OpenAIService {
  private client: OpenAI;
  
  constructor() {
    const apiKey = process.env.OPENAI_API_KEY || '';
    if (!apiKey) {
      console.warn('OpenAI API key not found in environment variables!');
    }
    
    this.client = new OpenAI({
      apiKey: apiKey,
    });
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      // Use the embeddingModel from config if available, otherwise fallback to text-embedding-3-small
      const embeddingModel = chatConfig.ai.openai.embeddingModel || "text-embedding-3-small";
      
      const response = await this.client.embeddings.create({
        model: embeddingModel,
        input: text,
      });
      
      return response.data[0].embedding;
    } catch (error) {
      console.error("Error generating OpenAI embedding:", error);
      throw error;
    }
  }

  async generateChatResponse(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    relevantContent?: string,
  ): Promise<string> {
    try {
      let systemMessage = chatConfig.ai.openai.systemPrompt || "You are a helpful customer support AI assistant. Be concise and friendly.";
      
      if (relevantContent) {
        systemMessage += "\n\nUse the following relevant information from our website to answer the user's question:\n" + relevantContent;
      } else {
        systemMessage += "\n\nIf you don't know the answer based on our website content, be honest and say you're not sure.";
      }
      
      const fullMessages = [
        { role: 'system' as const, content: systemMessage },
        ...messages,
      ];
      
      // Get the model dynamically each time to support runtime config changes
      const model = chatConfig.ai.openai.model || "gpt-4o";
      console.log(`Using OpenAI model: ${model}`);
      
      const response = await this.client.chat.completions.create({
        model: model,
        messages: fullMessages,
        temperature: chatConfig.ai.openai.temperature,
        max_tokens: chatConfig.ai.openai.max_tokens,
      });
      
      return response.choices[0].message.content || "I apologize, but I couldn't generate a response.";
    } catch (error) {
      console.error("Error generating OpenAI chat response:", error);
      throw error;
    }
  }
}

export const openaiService = new OpenAIService();
