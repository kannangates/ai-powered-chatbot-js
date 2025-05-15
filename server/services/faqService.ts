import { faqData } from '../data/faq';

class FAQService {
  // Find a match in the FAQ data based on user query
  findFAQMatch(query: string): string | null {
    // Convert query to lowercase for case-insensitive matching
    const normalizedQuery = query.toLowerCase().trim();
    
    // Try to find an exact match first
    for (const category of faqData) {
      for (const qa of category.qa) {
        if (qa.question.toLowerCase() === normalizedQuery) {
          return qa.answer;
        }
      }
    }
    
    // If no exact match, look for partial matches
    const matchThreshold = 0.7; // How close the match needs to be
    const matches: Array<{ answer: string, score: number }> = [];
    
    for (const category of faqData) {
      for (const qa of category.qa) {
        // Simple keyword matching
        const questionWords = qa.question.toLowerCase().split(/\s+/);
        const queryWords = normalizedQuery.split(/\s+/);
        
        // Count how many words from the query appear in the question
        const matchingWords = queryWords.filter(word => 
          questionWords.some(qWord => qWord.includes(word) || word.includes(qWord))
        );
        
        const score = matchingWords.length / queryWords.length;
        
        if (score >= matchThreshold) {
          matches.push({ answer: qa.answer, score });
        }
      }
    }
    
    // If we found matches, return the best one
    if (matches.length > 0) {
      matches.sort((a, b) => b.score - a.score);
      return matches[0].answer;
    }
    
    // No good match found
    return null;
  }
}

export const faqService = new FAQService();