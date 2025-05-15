import axios from 'axios';
import * as cheerio from 'cheerio';
import { openaiService } from './openai.ts';
import { chatConfig } from '@shared/config';

interface ContentItem {
  url: string;
  text: string;
  embedding?: number[];
}

class ContentRetrievalService {
  private content: ContentItem[] = [];
  private lastRefresh: Date | null = null;
  private baseUrl: string = '';
  private refreshIntervalHours: number = 24;
  private similarityThreshold: number = 0.7;
  
  constructor() {
    this.baseUrl = chatConfig.retrieval.websiteBaseUrl || process.env.WEBSITE_BASE_URL || '';
    this.refreshIntervalHours = chatConfig.retrieval.refreshIntervalHours || 
      parseInt(process.env.REFRESH_INTERVAL_HOURS || '24', 10);
    this.similarityThreshold = chatConfig.retrieval.similarityThreshold || 0.7;
  }
  
  async initialize(): Promise<void> {
    if (!this.content.length || this.shouldRefreshContent()) {
      await this.scrapeWebsite();
    }
  }
  
  private shouldRefreshContent(): boolean {
    if (!this.lastRefresh) return true;
    
    const now = new Date();
    const hoursSinceLastRefresh = 
      (now.getTime() - this.lastRefresh.getTime()) / (1000 * 60 * 60);
      
    return hoursSinceLastRefresh > this.refreshIntervalHours;
  }
  
  async scrapeWebsite(): Promise<void> {
    try {
      // For demo purposes, we'll just use some hardcoded content
      // In a real implementation, this would scrape the actual website based on baseUrl
      const sampleContent: ContentItem[] = [
        {
          url: '/features',
          text: 'Our platform offers cutting-edge AI integration, blazing-fast performance, and seamless third-party compatibility.'
        },
        {
          url: '/pricing',
          text: 'Choose from our flexible plans: Starter ($29/mo), Pro ($79/mo), or Enterprise (custom pricing).'
        },
        {
          url: '/docs',
          text: 'Find comprehensive guides, API references, and tutorials to get started with our platform.'
        },
        {
          url: '/faq',
          text: 'Integration is simple! Just import our component, add your API keys to your environment variables, and include the ChatbotComponent in your layout file. The chatbot will then appear on all pages of your website.'
        },
        {
          url: '/faq',
          text: 'Yes, the chatbot is fully customizable. You can change colors, typography, icons, and even the layout of the chat interface to match your brand identity.'
        },
        {
          url: '/faq',
          text: 'The AI first attempts to find relevant information from your website content through semantic search. If it cannot find a suitable answer, it will use its general knowledge while clearly indicating that the information is not from your website.'
        }
      ];
      
      // Generate embeddings for each content item
      const contentWithEmbeddings = await Promise.all(
        sampleContent.map(async (item) => {
          try {
            const embedding = await openaiService.generateEmbedding(item.text);
            return { ...item, embedding };
          } catch (error) {
            console.error(`Error generating embedding for content: ${item.url}`, error);
            return item;
          }
        })
      );
      
      this.content = contentWithEmbeddings.filter(item => item.embedding);
      this.lastRefresh = new Date();
      console.log(`Content retrieved and embedded: ${this.content.length} items from ${this.baseUrl}`);
    } catch (error) {
      console.error("Error scraping website:", error);
      throw error;
    }
  }
  
  // Compute cosine similarity between two vectors
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }
  
  async findRelevantContent(query: string): Promise<string | null> {
    try {
      // Make sure content is initialized
      await this.initialize();
      
      // If no content or no embeddings, return null
      if (!this.content.length || !this.content.some(item => item.embedding)) {
        return null;
      }
      
      // Generate embedding for the query
      const queryEmbedding = await openaiService.generateEmbedding(query);
      
      // Calculate similarity scores
      const scoredContent = this.content
        .filter(item => item.embedding)
        .map(item => ({
          text: item.text,
          similarity: this.cosineSimilarity(queryEmbedding, item.embedding!)
        }))
        .sort((a, b) => b.similarity - a.similarity);
      
      // Get top results with similarity above threshold
      const relevantContent = scoredContent
        .filter(item => item.similarity > this.similarityThreshold)
        .slice(0, 3)
        .map(item => item.text)
        .join('\n\n');
      
      return relevantContent || null;
    } catch (error) {
      console.error("Error finding relevant content:", error);
      return null;
    }
  }
}

export const contentRetrieval = new ContentRetrievalService();
