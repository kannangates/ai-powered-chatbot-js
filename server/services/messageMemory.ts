import { Message } from '@shared/types';
import { chatConfig } from '@shared/config';

interface Session {
  messages: Message[];
  createdAt: Date;
  lastUpdated: Date;
}

class MessageMemoryService {
  private sessions: Map<string, Session>;
  private readonly MAX_SESSION_AGE_MS: number;
  private readonly MAX_MESSAGES_PER_SESSION: number;
  
  constructor() {
    this.sessions = new Map();
    this.MAX_SESSION_AGE_MS = (chatConfig.session.maxSessionAgeMinutes || 30) * 60 * 1000;
    this.MAX_MESSAGES_PER_SESSION = chatConfig.session.maxMessagesPerSession || 20;
    
    // Clean up expired sessions periodically
    setInterval(() => this.cleanupSessions(), 15 * 60 * 1000); // every 15 minutes
  }
  
  private cleanupSessions(): void {
    const now = new Date();
    // Iterate through map keys and access values directly to avoid iterator issues
    this.sessions.forEach((session, sessionId) => {
      const sessionAge = now.getTime() - session.lastUpdated.getTime();
      if (sessionAge > this.MAX_SESSION_AGE_MS) {
        this.sessions.delete(sessionId);
      }
    });
  }
  
  getSession(sessionId: string): Session {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        messages: [],
        createdAt: new Date(),
        lastUpdated: new Date()
      });
    }
    
    return this.sessions.get(sessionId)!;
  }
  
  addMessage(sessionId: string, message: Message): void {
    const session = this.getSession(sessionId);
    
    // Add message, keeping only the most recent MAX_MESSAGES_PER_SESSION messages
    session.messages.push(message);
    if (session.messages.length > this.MAX_MESSAGES_PER_SESSION) {
      // Keep the first message (usually system message) and the most recent messages
      const systemMessage = session.messages[0];
      session.messages = [
        systemMessage,
        ...session.messages.slice(-(this.MAX_MESSAGES_PER_SESSION - 1))
      ];
    }
    
    // Update last updated timestamp
    session.lastUpdated = new Date();
    
    // Update the session in the map
    this.sessions.set(sessionId, session);
  }
  
  getMessages(sessionId: string): Message[] {
    return this.getSession(sessionId).messages;
  }
  
  getFormattedChatHistory(sessionId: string): Array<{ role: 'system' | 'user' | 'assistant', content: string }> {
    const messages = this.getMessages(sessionId);
    
    return messages.map(msg => ({
      role: msg.role as 'system' | 'user' | 'assistant',
      content: msg.content
    }));
  }
}

export const messageMemory = new MessageMemoryService();
