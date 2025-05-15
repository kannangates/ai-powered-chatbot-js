import { Request, Response } from 'express';
import { openaiService } from '../services/openai';
import { geminiService } from '../services/gemini';
import { contentRetrieval } from '../services/contentRetrieval';
import { messageMemory } from '../services/messageMemory';
import { faqService } from '../services/faqService';
import { chatConfig } from '@shared/config';

class ChatController {
  async processMessage(req: Request, res: Response) {
    try {
      const { message, sessionId } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required and must be a string' });
      }
      
      if (!sessionId || typeof sessionId !== 'string') {
        return res.status(400).json({ error: 'Session ID is required and must be a string' });
      }
      
      // Add user message to memory
      messageMemory.addMessage(sessionId, {
        role: 'user',
        content: message,
        timestamp: new Date()
      });
      
      // Get chat history for context
      const chatHistory = messageMemory.getFormattedChatHistory(sessionId);
      
      // First, check if we have a match in our FAQ database
      const faqMatch = faqService.findFAQMatch(message);
      
      // If we found a match in our FAQ, use that as the response
      if (faqMatch) {
        console.log('Found FAQ match:', faqMatch.substring(0, 50) + '...');
        
        // Add AI response to memory
        messageMemory.addMessage(sessionId, {
          role: 'assistant',
          content: faqMatch,
          timestamp: new Date()
        });
        
        // Send FAQ response immediately
        return res.status(200).json({ 
          message: faqMatch,
          noRelevantContentFound: false,
          usedFallback: false,
          usedFAQ: true
        });
      }
      
      // If no FAQ match, search for relevant content from website
      console.log('No FAQ match found, searching website content...');
      const relevantContent = await contentRetrieval.findRelevantContent(message);
      
      let response: string;
      let noRelevantContentFound = !relevantContent;
      let usedFallback = false;
      
      // If we found relevant content, add a log
      if (relevantContent) {
        console.log('Found relevant content from website:', relevantContent.substring(0, 50) + '...');
      } else {
        console.log('No relevant content found from website, will use AI general knowledge');
      }
      
      // Decide which AI provider to use based on config
      const primaryProvider = chatConfig.ai.primaryProvider;
      const fallbackEnabled = chatConfig.ai.fallbackEnabled;
      
      console.log(`Using ${primaryProvider} as primary AI provider. Fallback ${fallbackEnabled ? 'enabled' : 'disabled'}.`);
      
      try {
        // Try with primary provider first (OpenAI or Gemini)
        if (primaryProvider === 'openai') {
          console.log('Generating response with OpenAI...');
          response = await openaiService.generateChatResponse(chatHistory, relevantContent || undefined);
        } else { // 'gemini'
          console.log('Generating response with Gemini...');
          response = await geminiService.generateChatResponse(chatHistory, relevantContent || undefined);
        }
      } catch (error) {
        const aiError = error as any; // Type assertion
        console.error(`Error with ${primaryProvider}, ${fallbackEnabled ? 'trying fallback' : 'no fallback available'}:`, aiError);
        
        // Only try fallback if enabled
        if (fallbackEnabled) {
          usedFallback = true;
          
          // Check specifically for quota issues to provide better logging
          const isQuotaIssue = 
            (typeof aiError.message === 'string' && 
              (aiError.message.includes('quota') || aiError.message.includes('rate limit'))) || 
            aiError.code === 'insufficient_quota' ||
            aiError.status === 429;
          
          if (isQuotaIssue) {
            console.log(`${primaryProvider} quota exceeded, using fallback provider`);
          }
          
          // Try the other provider
          try {
            if (primaryProvider === 'openai') {
              console.log('Falling back to Gemini...');
              response = await geminiService.generateChatResponse(chatHistory, relevantContent || undefined);
            } else {
              console.log('Falling back to OpenAI...');
              response = await openaiService.generateChatResponse(chatHistory, relevantContent || undefined);
            }
          } catch (fallbackError) {
            console.error('Error with fallback provider:', fallbackError);
            return res.status(500).json({ 
              error: 'Failed to generate response with both AI providers',
              noRelevantContentFound,
              usedFallback: true
            });
          }
        } else {
          // No fallback available
          return res.status(500).json({ 
            error: `Failed to generate response with ${primaryProvider} and fallback is disabled`,
            noRelevantContentFound
          });
        }
      }
      
      // Add AI response to memory
      messageMemory.addMessage(sessionId, {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      });
      
      // Send response
      return res.status(200).json({ 
        message: response,
        noRelevantContentFound,
        usedFallback,
        usedFAQ: false // This indicates it was AI-generated, not from FAQ
      });
    } catch (error) {
      console.error('Error processing message:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const chatController = new ChatController();
