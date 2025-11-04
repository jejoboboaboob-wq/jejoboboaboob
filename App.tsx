import React, { useState } from 'react';
import { SearchPanel } from './components/SearchPanel';
import { ResultsDashboard } from './components/ResultsDashboard';
import { AiArticleStudio } from './components/AiArticleStudio';
import { analyzeKeyword, generateArticle } from './services/geminiService';
import { getMockAnalysisResult } from './services/mockDataService';
import { AnalysisResult, GeneratedArticle, ArticleSettingsData } from './types';
import './App.css';

type View = 'search' | 'results' | 'editor';

const USE_MOCK_DATA = false; // Switch to true for development without API calls

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('search');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [generatedArticle, setGeneratedArticle] = useState<GeneratedArticle | null>(null);
  const [initialTopic, setInitialTopic] = useState<string | null>(null);

  const handleAnalyze = async (keyword: string, country: string, device: string, lang: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setGeneratedArticle(null);
    try {
      let result;
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        result = getMockAnalysisResult(keyword);
      } else {
        result = await analyzeKeyword(keyword, country, device, lang);
      }
      setAnalysisResult(result);
      setCurrentView('results');
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('فشل تحليل الكلمة المفتاحية. يرجى المحاولة مرة أخرى.');
      setCurrentView('search');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateArticle = async (settings: ArticleSettingsData, topic?: string) => {
    if (!analysisResult) return;
    setIsLoading(true);
    setError(null);
    try {
      const article = await generateArticle(analysisResult, settings, topic);
      setGeneratedArticle(article);
      setInitialTopic(null); // Clear topic after generation
      setCurrentView('editor');
    } catch (err) {
      console.error('Article generation failed:', err);
      setError('فشل توليد المقال. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectTopicAndNavigate = (topic: string) => {
      setInitialTopic(topic);
      setCurrentView('editor');
  };

  const handleBackToDashboard = () => {
    setGeneratedArticle(null); // Clear article when going back
    setCurrentView('results');
  };

  const handleBackToHome = () => {
    setCurrentView('search');
    setAnalysisResult(null);
    setGeneratedArticle(null);
    setInitialTopic(null);
    setError(null);
  };
  
  const renderContent = () => {
    switch (currentView) {
      case 'search':
        return <SearchPanel onAnalyze={handleAnalyze} isLoading={isLoading} />;
      case 'results':
        if (analysisResult) {
          return <ResultsDashboard 
            analysisResult={analysisResult} 
            onSelectTopicAndNavigate={handleSelectTopicAndNavigate}
            setAnalysisResult={setAnalysisResult}
          />;
        }
        return null; // Or a loading/error state
      case 'editor':
        if (analysisResult) {
            return <AiArticleStudio 
                analysisData={analysisResult} 
                articleData={generatedArticle} 
                onGenerate={handleGenerateArticle}
                onBack={handleBackToDashboard}
                isLoading={isLoading}
                initialTopic={initialTopic}
            />
        }
        return null; // Or a loading/error state
      default:
        return <SearchPanel onAnalyze={handleAnalyze} isLoading={isLoading} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans" dir="rtl">
        <header className="bg-white shadow-sm sticky top-0 z-20">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <i className="fas fa-robot text-primary text-3xl"></i>
                    <span className="hidden sm:block">SEO Content AI</span>
                </h1>
                 {currentView !== 'search' && (
                    <button onClick={handleBackToHome} className="text-gray-600 hover:text-primary transition" title="العودة إلى الصفحة الرئيسية">
                        <i className="fas fa-home text-2xl"></i>
                    </button>
                )}
            </nav>
        </header>
        <main className="container mx-auto px-6 py-8">
            {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
                <strong className="font-bold">خطأ!</strong>
                <span className="block sm:inline ml-2">{error}</span>
            </div>
            )}
            {renderContent()}
        </main>
        <footer className="text-center py-6 text-sm text-gray-500">
             <p>صنع بحب باستخدام Gemini API</p>
        </footer>
    </div>
  );
};

export default App;