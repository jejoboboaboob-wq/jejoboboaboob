export interface WordCountSuggestion {
  min: number;
  max: number;
  recommended: number;
  average: number;
}

export interface CompetitorInfo {
  title: string;
  url: string;
  strengths: string[];
  weaknesses: string[];
}

export interface AnalysisResult {
  keyword: string;
  searchIntent: string;
  seoDifficulty: {
    score: number; // 0-100
    explanation: string;
  };
  wordCountSuggestion: WordCountSuggestion;
  faqSuggestions: string[];
  relatedKeywords: string[];
  competitors: CompetitorInfo[];
  suggestedOutline: string[];
  suggestedTitles: string[];
}

export interface ArticleSettingsData {
  targetWords: number;
  includeMedia: boolean;
  imageSource: 'Pexels' | 'Unsplash';
  maxImages: number;
  includeTable: boolean;
  tableType: string;
  tone: string;
  customTone?: string;
}

export interface GeneratedArticle {
  title: string;
  metaTitle: string;
  metaDescription: string;
  content: string; // HTML content
}

export interface TargetedAnalysis {
    outline: string[];
}

export interface QuickArticleSettings {
    includeImage: boolean;
    includeVideo: boolean;
    includeTable: boolean;
}

export interface SeoCheck {
  passed: boolean;
  text: string;
}

export interface SeoAnalysis {
  score: number;
  checks: SeoCheck[];
}