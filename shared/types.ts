export type MessageRole = 'system' | 'user' | 'assistant';

export interface Message {
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface ChatConfig {
  primaryProvider: 'openai' | 'gemini';
  fallbackEnabled: boolean;
  retrievalMethod: 'live' | 'periodic' | 'google';
}
