import React, { useEffect, useState } from 'react';
import { 
  LineChart, 
  Loader2, 
  AlertCircle,
  Car,
  Zap,
  Trash2,
  Tv,
  Droplet,
  ChevronDown,
  ChevronUp,
  Calendar,
  History
} from 'lucide-react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { analysisAtom } from '../atoms/analysisAtom';
import { userAtom } from '../atoms/userAtom';
import type { AnalysisData, AnalysisCategory } from '../types/analysis';

/**
 * Update or create a new interface for the parsed previous analysis.
 */
export interface PreviousAnalysis {
  date: string;
  totalEmissions: number;
  sections: {
    category: string;
    insights: string[];
    recommendations: string[];
  }[];
}

/**
 * Helper: Filters out unwanted lines.
 */
const isValidLine = (line: string): boolean => {
  const trimmed = line.trim().toLowerCase();

  // Remove empty lines or lines that contain only whitespace
  if (!trimmed) return false;

  // Remove common headers that we already display in the UI
  const headersToRemove = [
    'key insights',
    'recommendations',
    '[recommendations]',
    '## [recommendations]',
    '## [Recommendations]',
  ];
  if (headersToRemove.includes(trimmed)) return false;

  // Remove lines with common unwanted phrases
  const unwantedKeywords = [
    'ai assistance', 'gemini', 'non sense'
  ];
  if (unwantedKeywords.some(keyword => trimmed.includes(keyword))) return false;

  // Remove lines that contain only markdown formatting or special characters
  const markdownPatterns = [
    /^#+\s*/,         // Markdown headers (e.g., # Header, ## Subheader)
    /^\d+\.\s+/,      // Numbered lists (e.g., 1. Item)
    /^\>\s*/,         // Blockquotes (e.g., > Quote)
    /^\*\*.*\*\*$/,   // Bold text (e.g., **bold**)
    /^\*.*\*$/,       // Italic text (e.g., *italic*)
    /^_{2,}$/,        // Horizontal lines (e.g., __ or ----)
    /^[\W_]+$/        // Lines with only symbols (e.g., "----" or "****")
  ];
  if (markdownPatterns.some(pattern => pattern.test(trimmed))) return false;

  // Remove very short lines (e.g., single words, single letters, or symbols)
  if (trimmed.length < 3) return false;

  return true;
};

/**
 * Parses the raw analysis data for the current analysis.
 */
const parseAnalysisData = (rawData: any): AnalysisData => {
  return {
    date: rawData.date || new Date().toISOString(),
    overall: {
      insights: Array.isArray(rawData.overall?.insights)
        ? rawData.overall.insights 
        : rawData.overall?.insights?.split('\n')
            .filter((line: string) => line.trim() && isValidLine(line)) || [],
      recommendations: Array.isArray(rawData.overall?.recommendations)
        ? rawData.overall.recommendations
        : rawData.overall?.recommendations?.split('\n')
            .filter((line: string) => line.trim() && isValidLine(line)) || [],
      detailedAnalysis: rawData.overall?.detailedAnalysis || ''
    },
    transportation: {
      insights: Array.isArray(rawData.transportation?.insights)
        ? rawData.transportation.insights
        : rawData.transportation?.insights?.split('\n')
            .filter((line: string) => line.trim() && isValidLine(line)) || [],
      recommendations: Array.isArray(rawData.transportation?.recommendations)
        ? rawData.transportation.recommendations
        : rawData.transportation?.recommendations?.split('\n')
            .filter((line: string) => line.trim() && isValidLine(line)) || [],
      detailedAnalysis: rawData.transportation?.detailedAnalysis || ''
    },
    energy: {
      insights: Array.isArray(rawData.energy?.insights)
        ? rawData.energy.insights
        : rawData.energy?.insights?.split('\n')
            .filter((line: string) => line.trim() && isValidLine(line)) || [],
      recommendations: Array.isArray(rawData.energy?.recommendations)
        ? rawData.energy.recommendations
        : rawData.energy?.recommendations?.split('\n')
            .filter((line: string) => line.trim() && isValidLine(line)) || [],
      detailedAnalysis: rawData.energy?.detailedAnalysis || ''
    },
    waste: {
      insights: Array.isArray(rawData.waste?.insights)
        ? rawData.waste.insights
        : rawData.waste?.insights?.split('\n')
            .filter((line: string) => line.trim() && isValidLine(line)) || [],
      recommendations: Array.isArray(rawData.waste?.recommendations)
        ? rawData.waste.recommendations
        : rawData.waste?.recommendations?.split('\n')
            .filter((line: string) => line.trim() && isValidLine(line)) || [],
      detailedAnalysis: rawData.waste?.detailedAnalysis || ''
    },
    appliances: {
      insights: Array.isArray(rawData.appliances?.insights)
        ? rawData.appliances.insights
        : rawData.appliances?.insights?.split('\n')
            .filter((line: string) => line.trim() && isValidLine(line)) || [],
      recommendations: Array.isArray(rawData.appliances?.recommendations)
        ? rawData.appliances.recommendations
        : rawData.appliances?.recommendations?.split('\n')
            .filter((line: string) => line.trim() && isValidLine(line)) || [],
      detailedAnalysis: rawData.appliances?.detailedAnalysis || ''
    },
    water: {
      insights: Array.isArray(rawData.water?.insights)
        ? rawData.water.insights
        : rawData.water?.insights?.split('\n')
            .filter((line: string) => line.trim() && isValidLine(line)) || [],
      recommendations: Array.isArray(rawData.water?.recommendations)
        ? rawData.water.recommendations
        : rawData.water?.recommendations?.split('\n')
            .filter((line: string) => line.trim() && isValidLine(line)) || [],
      detailedAnalysis: rawData.water?.detailedAnalysis || ''
    }
  };
};

/**
 * Parses a single previous analysis entry by categorizing data into sections.
 */
const parsePreviousAnalysis = (rawAnalysis: any): PreviousAnalysis => {
  // Define categories and corresponding keys.
  const categories = [
    { category: "Overall", insightsKey: "overallInsights", recommendationsKey: "overallRecommendations" },
    { category: "Air Travel", insightsKey: "airTravelInsights", recommendationsKey: "airTravelRecommendations" },
    { category: "Appliances", insightsKey: "appliancesInsights", recommendationsKey: "appliancesRecommendations" },
    { category: "Energy", insightsKey: "energyInsights", recommendationsKey: "energyRecommendations" },
    { category: "Transportation", insightsKey: "transportationInsights", recommendationsKey: "transportationRecommendations" },
    { category: "Waste", insightsKey: "wasteInsights", recommendationsKey: "wasteRecommendations" },
    { category: "Water", insightsKey: "waterInsights", recommendationsKey: "waterRecommendations" }
  ];

  const sections = categories.map((item: { category: string; insightsKey: string; recommendationsKey: string; }) => {
    let insights: string[] = [];
    let recommendations: string[] = [];
    const rawInsights = rawAnalysis[item.insightsKey];
    if (typeof rawInsights === 'string') {
      insights = rawInsights
        .split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line && isValidLine(line));
    } else if (Array.isArray(rawInsights)) {
      insights = rawInsights
        .map((line: string) => line.trim())
        .filter((line: string) => line && isValidLine(line));
    }
    const rawRecs = rawAnalysis[item.recommendationsKey];
    if (typeof rawRecs === 'string') {
      recommendations = rawRecs
        .split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line && isValidLine(line));
    } else if (Array.isArray(rawRecs)) {
      recommendations = rawRecs
        .map((line: string) => line.trim())
        .filter((line: string) => line && isValidLine(line));
    }
    return { category: item.category, insights, recommendations };
  }).filter((section) => section.insights.length > 0 || section.recommendations.length > 0);

  return {
    date: rawAnalysis.date,
    totalEmissions: rawAnalysis.totalEmissions,
    sections
  };
};

/**
 * Props for the CategoryCard component.
 */
type CategoryCardProps = {
  title: string;
  data: AnalysisCategory;
  icon: React.ElementType;
};

/**
 * CategoryCard shows details (insights, recommendations, detailed analysis) for each category.
 */
const CategoryCard: React.FC<CategoryCardProps> = ({ title, data, icon: Icon }) => {
  const [showDetails] = useState<boolean>(false);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-green-100 rounded-lg">
          <Icon className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Key Insights</h4>
          <ul className="list-disc list-inside space-y-1">
            {data.insights.map((insight: string, index: number) => (
              <li key={index} className="text-gray-600">{insight}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Recommendations</h4>
          <ul className="list-disc list-inside space-y-1">
            {data.recommendations.map((rec: string, index: number) => (
              <li key={index} className="text-gray-600">{rec}</li>
            ))}
          </ul>
        </div>

        <div>
          
          {showDetails && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-gray-600 font-sans">
                  {data.detailedAnalysis}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Props for DateAnalysisCard.
 * Now only the date is required.
 */
type DateAnalysisCardProps = {
  date: string;
};

/**
 * DateAnalysisCard shows the analysis date.
 */
const DateAnalysisCard: React.FC<DateAnalysisCardProps> = ({ date }) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Calendar className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Analysis Date</h3>
          <p className="text-gray-600">{formattedDate}</p>
        </div>
      </div>
    </div>
  );
};

/**
 * Props for PreviousAnalysisCard.
 */
type PreviousAnalysisCardProps = {
  analysis: PreviousAnalysis;
};

/**
 * PreviousAnalysisCard displays a summary of a previous analysis.
 * The total emissions part has been removed.
 */
const PreviousAnalysisCard: React.FC<PreviousAnalysisCardProps> = ({ analysis }) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const formattedDate = new Date(analysis.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700">{formattedDate}</span>
        </div>
      </div>
      
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-2"
      >
        {showDetails ? (
          <>
            <ChevronUp className="w-4 h-4" /> Hide Details
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" /> Show Details
          </>
        )}
      </button>

      {showDetails && (
        <div className="mt-3 space-y-6">
          {analysis.sections.map((section: { category: string; insights: string[]; recommendations: string[]; }, idx: number) => (
            <div key={idx} className="border p-3 rounded-md">
              <h4 className="text-md font-bold text-gray-800 mb-2">{section.category}</h4>
              {section.insights.length > 0 && (
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-700">Key Insights</p>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {section.insights.map((insight: string, index: number) => (
                      <li key={index}>{insight}</li>
                    ))}
                  </ul>
                </div>
              )}
              {section.recommendations.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Recommendations</p>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {section.recommendations.map((rec: string, index: number) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Main Analysis Component
 */
const Analysis: React.FC = () => {
  const user = useRecoilValue(userAtom);
  const [analysisState, setAnalysisState] = useRecoilState(analysisAtom);
  const { currentAnalysis, previousAnalyses } = analysisState;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch previous analyses when the component mounts.
  useEffect(() => {
    const fetchPreviousAnalyses = async () => {
      if (!user?.id) return;
      try {
        const prevResponse = await fetch(`https://cafoot-backend.onrender.com/api/analysis/previous-analyses?userId=${user.id}`);
        if (!prevResponse.ok) {
          throw new Error(`Previous analyses error: ${prevResponse.statusText}`);
        }
        const prevData = await prevResponse.json();
        // Parse each previous analysis entry into categorized sections.
        setAnalysisState((prevState) => ({
          ...prevState,
          previousAnalyses: prevData.previousAnalyses.map((pa: any) => parsePreviousAnalysis(pa))
        }));
      } catch (err) {
        console.error('Error fetching previous analyses:', err);
      }
    };
    fetchPreviousAnalyses();
  }, [user, setAnalysisState]);

  const handleAnalysisClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const userId = user?.id;
      if (!userId) {
        throw new Error('User not found');
      }
      
      // Fetch the current analysis from the backend.
      const analysisResponse = await fetch(`https://cafoot-backend.onrender.com/api/analysis/getanalysis?userId=${userId}`);
      if (!analysisResponse.ok) {
        throw new Error(`Current analysis error: ${analysisResponse.statusText}`);
      }
      const analysisJson = await analysisResponse.json();
      const parsedData = parseAnalysisData(analysisJson);
      
      // Update the atom with the current analysis.
      setAnalysisState((prevState) => ({
        ...prevState,
        currentAnalysis: parsedData
      }));

      // Optionally, refetch previous analyses after current analysis.
      const prevResponse = await fetch(`https://cafoot-backend.onrender.com/api/analysis/previous-analyses?userId=${userId}`);
      if (!prevResponse.ok) {
        throw new Error(`Previous analyses error: ${prevResponse.statusText}`);
      }
      const prevData = await prevResponse.json();
      setAnalysisState((prevState) => ({
        ...prevState,
        previousAnalyses: prevData.previousAnalyses.map((pa: any) => parsePreviousAnalysis(pa))
      }));
      
    } catch (err: any) {
      console.error('Error during analysis:', err);
      setError('Analysis failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CaFooT AI Analysis
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get personalized insights and recommendations about your carbon footprint through our
            advanced AI analysis. Click below to analyze your environmental impact data.
          </p>
          <button
            onClick={handleAnalysisClick}
            disabled={loading}
            className="mt-8 px-8 py-3 bg-green-600 text-white rounded-lg font-medium
                     hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 
                     focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-200 flex items-center gap-2 mx-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
              </>
            ) : (
              <>
                <LineChart className="w-5 h-5" /> Start AI Analysis
              </>
            )}
          </button>
          {loading && (
            <p className="mt-4 text-sm text-gray-600">
              Your analysis is processing – this may take up to a minute...
            </p>
          )}
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 rounded-lg flex items-center gap-3 text-red-700 max-w-3xl mx-auto">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {currentAnalysis && (
          <>
            <DateAnalysisCard 
              date={currentAnalysis.date}
            />
            
            {/* List layout for the analysis category cards */}
            <div className="space-y-6 mb-12">
              <CategoryCard 
                title="Overall Analysis" 
                data={currentAnalysis.overall} 
                icon={LineChart}
              />
              <CategoryCard 
                title="Transportation" 
                data={currentAnalysis.transportation} 
                icon={Car}
              />
              <CategoryCard 
                title="Energy Usage" 
                data={currentAnalysis.energy} 
                icon={Zap}
              />
              <CategoryCard 
                title="Waste Management" 
                data={currentAnalysis.waste} 
                icon={Trash2}
              />
              <CategoryCard 
                title="Appliances" 
                data={currentAnalysis.appliances} 
                icon={Tv}
              />
              <CategoryCard 
                title="Water Usage" 
                data={currentAnalysis.water} 
                icon={Droplet}
              />
            </div>
          </>
        )}

        {previousAnalyses.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg">
                <History className="w-6 h-6 text-gray-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Previous Analyses</h2>
            </div>
            {/* List layout for previous analyses */}
            <div className="space-y-4">
              {previousAnalyses.map((analysis: PreviousAnalysis, index: number) => (
                <PreviousAnalysisCard key={index} analysis={analysis} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analysis;
