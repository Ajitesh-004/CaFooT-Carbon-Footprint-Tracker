import { Request, Response } from 'express';
import Prisma from "../prisma/client";
import { VertexAI } from '@google-cloud/vertexai';
import { GenerateContentResult } from '@google-cloud/vertexai';
import dotenv from 'dotenv';
dotenv.config();

// Type definitions
interface AnalysisData {
  overallEmissions: any[];
  transportation: any[];
  energy: any[];
  waste: any[];
  appliances: any[];
  water: any[];
  airTravel: any[];
}

interface GeminiAnalysis {
  insights: string;
  recommendations: string;
}

interface CategoryAnalysis {
  [key: string]: GeminiAnalysis;
}

// Initialize Vertex AI
const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT_ID,
  location: process.env.VERTEX_AI_LOCATION || 'asia-south1',
});

const model = vertexAI.getGenerativeModel({
  model: 'gemini-1.5-pro-preview-0514',
  generationConfig: {
    maxOutputTokens: 2048,
    temperature: 0.3,
  },
});

// Utility function for date calculation
const getStartDate = (range: string): string => {
  const now = new Date();
  const startDate = new Date(now);
  switch (range) {
    case '7d':
      startDate.setDate(now.getDate() - 7);
      break;
    case '30d':
    default:
      startDate.setDate(now.getDate() - 30);
  }
  return startDate.toISOString().split('T')[0];
};

// Fetch data with proper typing
async function fetchDataForAnalysis(userId: number, range: string): Promise<AnalysisData> {
  const startDate = getStartDate(range);
  console.log(`[DEBUG] Fetching data for user ${userId} from ${startDate}`);
  
  try {
    const [
      overallEmissions,
      transportation,
      energy,
      waste,
      appliances,
      water,
      airTravel
    ] = await Promise.all([
      Prisma.totalEmission.findMany({ where: { userId, date: { gte: startDate } } }),
      Prisma.transportation.findMany({ where: { userId, date: { gte: startDate } } }),
      Prisma.energy.findMany({ where: { userId, date: { gte: startDate } } }),
      Prisma.waste.findMany({ where: { userId, date: { gte: startDate } } }),
      Prisma.appliancesUsage.findMany({ where: { userId, date: { gte: startDate } } }),
      Prisma.waterUsage.findMany({ where: { userId, date: { gte: startDate } } }),
      Prisma.airTravel.findMany({ where: { userId, date: { gte: startDate } } })
    ]);

    console.log('[DEBUG] Data counts:', {
      overall: overallEmissions.length,
      transportation: transportation.length,
      energy: energy.length,
      waste: waste.length,
      appliances: appliances.length,
      water: water.length,
      airTravel: airTravel.length
    });

    return { overallEmissions, transportation, energy, waste, appliances, water, airTravel };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Failed to fetch analysis data');
  }
}



// Enhanced prompt engineering
function createCategoryPrompt(
  category: string,
  data: any,
  pastAnalyses: any[],
  emissionsData: string
): string {
  const pastContext = pastAnalyses
    .map((analysis, i) =>
      `Previous ${category} analysis #${i + 1}:\n` +
      `Insights: ${analysis[`${category}Insights`] || 'N/A'}\n` +
      `Recommendations: ${analysis[`${category}Recommendations`] || 'N/A'}\n`
    )
    .join('\n');

  return `
Please analyze the following carbon emissions data for the "${category}" category and provide a concise, structured response.The word limit for your entire response is strictly 200 words. Each category must have small bullet points which are powerful and actionable. Maximum response for each category is just 50 words, give least possible output.Key Insights must be 50 words only and Recommendations strictly 50 words .Highlight the important key words.Your answer must strictly follow the exact format below:

--------------------------------------------------
[Key Insights]
- Concise bullet points of key observations, Trend analysis and Main contributors to emissions

[Recommendations]
- Prioritized actionable recommendations and Cost-effective solutions

--------------------------------------------------
Current ${category} data:
${emissionsData}

${pastContext ? `Past Analysis Context:\n${pastContext}` : ''}

Focus on:
- Clear, specific recommendations
- Very short and powerful points
- Practical implementation
`.trim();
}

// Improved response parsing with debug logging
function parseGeminiResponse(response: string): GeminiAnalysis {
  console.log('[DEBUG] Raw Gemini Response:', response);

  // Flexible section splitting
  const insightsSection = response.split(/\[Key Insights\]|Recommendations:|### Insights/gi)[1] || '';
  const recommendationsSection = response.split(/\[Recommendations\]|### Recommendations/gi)[1] || '';

  // Clean and format insights
  const insights = insightsSection
    .replace(/(\*\*|[-*]|•)/g, '')
    .split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => line.replace(/^[\s-]+/, '').trim())
    .join('\n- ');

  // Clean and format recommendations
  const recommendations = recommendationsSection
    .replace(/(\*\*|[-*]|•)/g, '')
    .split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => line.replace(/^[\s-]+/, '').trim())
    .join('\n- ');

  return {
    insights: insights ? `- ${insights}` : '- No actionable insights could be generated from the data.',
    recommendations: recommendations ? `- ${recommendations}` : '- No specific recommendations available based on current data patterns.'
  };
}

// Enhanced Gemini interaction with debugging
async function getGeminiAnalysis(prompt: string): Promise<GeminiAnalysis> {
  console.log('[DEBUG] Gemini Prompt:', prompt);
  
  try {
    const result: GenerateContentResult = await model.generateContent(prompt);
    const response = result.response;
    
    if (!response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('[ERROR] Invalid Gemini response structure:', JSON.stringify(response, null, 2));
      throw new Error('Invalid API response structure');
    }
    
    return parseGeminiResponse(response.candidates[0].content.parts[0].text);
  } catch (error) {
    console.error('[ERROR] Gemini API Error:', error);
    return {
      insights: '- Analysis service is currently unavailable',
      recommendations: '- Please try again later or check your connection'
    };
  }
}

// Throttled requests with delay
async function runThrottledRequests(
  requests: (() => Promise<GeminiAnalysis>)[],
  delayMs: number
): Promise<GeminiAnalysis[]> {
  const results: GeminiAnalysis[] = [];
  for (const [index, req] of requests.entries()) {
    console.log(`[DEBUG] Processing request ${index + 1}/${requests.length}`);
    const result = await req();
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
  return results;
}

// Helper to build requests with data checks
function buildRequest(
  category: string,
  data: any[],
  pastAnalyses: any[],
  summary: string
): () => Promise<GeminiAnalysis> {
  if (data.length === 0) {
    console.log(`[DEBUG] No data for ${category}, returning default response`);
    return () => Promise.resolve({
      insights: '- No usage data recorded for this category',
      recommendations: '- Consider logging activities for personalized suggestions'
    });
  }
  return () => getGeminiAnalysis(createCategoryPrompt(category, data, pastAnalyses, summary));
}

// Enhanced summary generators
function generateCategorySummary(category: string, data: any[]): string {
  if (data.length === 0) return 'No data available';

  try {
    switch (category) {
      case 'transportation':
        // Define explicit types for the accumulator
        const transData = data.reduce<Record<string, { distance: number; emissions: number }>>(
          (acc, entry) => {
            const current = acc[entry.transportType] || { distance: 0, emissions: 0 };
            return {
              ...acc,
              [entry.transportType]: {
                distance: current.distance + (entry.distance || 0),
                emissions: current.emissions + (entry.emissions || 0)
              }
            };
          }, 
          {}
        );

        return Object.entries(transData)
          .map(([type, values]) => 
            `- ${type}: ${values.distance.toFixed(2)} km, ${values.emissions.toFixed(2)} kg CO2`
          )
          .join('\n');

      case 'energy':
        // Define types for energy summary
        const energyData = data.reduce<Record<string, { usage: number; emissions: number }>>(
          (acc, entry) => {
            const current = acc[entry.energyType] || { usage: 0, emissions: 0 };
            return {
              ...acc,
              [entry.energyType]: {
                usage: current.usage + (entry.energyUsage || 0),
                emissions: current.emissions + (entry.emissions || 0)
              }
            };
          },
          {}
        );

        return Object.entries(energyData)
          .map(([type, values]) =>
            `- ${type}: ${values.usage.toFixed(2)} kWh, ${values.emissions.toFixed(2)} kg CO2`
          )
          .join('\n');

      case 'waste':
        // Define types for waste summary
        const wasteData = data.reduce<Record<string, { quantity: number; emissions: number }>>(
          (acc, entry) => {
            const current = acc[entry.wasteType] || { quantity: 0, emissions: 0 };
            return {
              ...acc,
              [entry.wasteType]: {
                quantity: current.quantity + (entry.quantity || 0),
                emissions: current.emissions + (entry.emissions || 0)
              }
            };
          },
          {}
        );

        return Object.entries(wasteData)
          .map(([type, values]) =>
            `- ${type}: ${values.quantity.toFixed(2)} kg, ${values.emissions.toFixed(2)} kg CO2`
          )
          .join('\n');

      case 'appliances':
        // Define types for appliances summary
        const appliancesData = data.reduce<Record<string, { usageTime: number; emissions: number }>>(
          (acc, entry) => {
            const current = acc[entry.applianceType] || { usageTime: 0, emissions: 0 };
            return {
              ...acc,
              [entry.applianceType]: {
                usageTime: current.usageTime + (entry.usageTime || 0),
                emissions: current.emissions + (entry.emissions || 0)
              }
            };
          },
          {}
        );

        return Object.entries(appliancesData)
          .map(([type, values]) =>
            `- ${type}: ${values.usageTime.toFixed(2)} hours, ${values.emissions.toFixed(2)} kg CO2`
          )
          .join('\n');

      case 'water':
        // Define types for water summary
        const waterData = data.reduce<Record<string, { usage: number; emissions: number }>>(
          (acc, entry) => {
            const current = acc[entry.waterType] || { usage: 0, emissions: 0 };
            return {
              ...acc,
              [entry.waterType]: {
                usage: current.usage + (entry.waterUsage || 0),
                emissions: current.emissions + (entry.emissions || 0)
              }
            };
          },
          {}
        );

        return Object.entries(waterData)
          .map(([type, values]) =>
            `- ${type}: ${values.usage.toFixed(2)} liters, ${values.emissions.toFixed(2)} kg CO2`
          )
          .join('\n');

      case 'airTravel':
        // Define types for air travel summary
        const airTravelData = data.reduce(
          (acc, entry) => ({
            totalDistance: acc.totalDistance + (entry.flightDistance || 0),
            totalEmissions: acc.totalEmissions + (entry.emissions || 0)
          }),
          { totalDistance: 0, totalEmissions: 0 }
        );

        return `Total Distance: ${airTravelData.totalDistance.toFixed(2)} km\n` +
               `Total Emissions: ${airTravelData.totalEmissions.toFixed(2)} kg CO2`;

      default:
        return `Total entries: ${data.length}`;
    }
  } catch (error) {
    console.error(`[ERROR] Error generating ${category} summary:`, error);
    return 'Data summary unavailable';
  }
}

// Main analysis controller
const performAnalysis = async (req: Request, res: Response) => {
  console.log('[DEBUG] Starting analysis process');
  
  const userId = Number(req.query.userId);
  if (!userId || isNaN(userId)) {
    console.error('[ERROR] Invalid user ID:', req.query.userId);
    res.status(400).json({ error: 'Invalid user ID' });
    return;
  }

  try {
    const user = await Prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      console.error('[ERROR] User not found:', userId);
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (user.lastAnalysisDate?.toISOString().split('T')[0] === today) {
      console.warn('[WARN] Daily limit reached for user:', userId);
      res.status(429).json({ error: 'Daily analysis limit reached' });
      return;
    }

    const range = '7d';
    const analysisData = await fetchDataForAnalysis(userId, range);
    const pastAnalyses = await Prisma.analysisResponse.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 2
    });

    console.log('[DEBUG] Generating category summaries');
    const categorySummaries = {
      overall: analysisData.overallEmissions.length > 0 
        ? `Total emissions: ${analysisData.overallEmissions.reduce((sum, e) => sum + e.totalEmissions, 0).toFixed(2)} kg CO2`
        : 'No overall emissions data',
      transportation: generateCategorySummary('transportation', analysisData.transportation),
      energy: generateCategorySummary('energy', analysisData.energy),
      waste: generateCategorySummary('waste', analysisData.waste),
      appliances: generateCategorySummary('appliances', analysisData.appliances),
      water: generateCategorySummary('water', analysisData.water),
      airTravel: generateCategorySummary('airTravel', analysisData.airTravel)
    };

    console.log('[DEBUG] Building analysis requests');
    const requests = [
      buildRequest('overall', analysisData.overallEmissions, pastAnalyses, categorySummaries.overall),
      buildRequest('transportation', analysisData.transportation, pastAnalyses, categorySummaries.transportation),
      buildRequest('energy', analysisData.energy, pastAnalyses, categorySummaries.energy),
      buildRequest('waste', analysisData.waste, pastAnalyses, categorySummaries.waste),
      buildRequest('appliances', analysisData.appliances, pastAnalyses, categorySummaries.appliances),
      buildRequest('water', analysisData.water, pastAnalyses, categorySummaries.water),
      buildRequest('airTravel', analysisData.airTravel, pastAnalyses, categorySummaries.airTravel)
    ];

    console.log('[DEBUG] Executing Gemini requests');
    const analysisResults = await runThrottledRequests(requests, 2000);

    const categories = [
      'overall', 'transportation', 'energy',
      'waste', 'appliances', 'water', 'airTravel'
    ];

    const analysisPayload = categories.reduce((acc, category, index) => {
      acc[category] = analysisResults[index] || {
        insights: '- Analysis failed for this category',
        recommendations: '- Please try again later'
      };
      return acc;
    }, {} as CategoryAnalysis);

    console.log('[DEBUG] Saving analysis to database');
    await Prisma.analysisResponse.create({
      data: {
        userId,
        range,
        date: new Date(),
        overallInsights: analysisPayload.overall.insights,
        overallRecommendations: analysisPayload.overall.recommendations,
        transportationInsights: analysisPayload.transportation.insights,
        transportationRecommendations: analysisPayload.transportation.recommendations,
        energyInsights: analysisPayload.energy.insights,
        energyRecommendations: analysisPayload.energy.recommendations,
        wasteInsights: analysisPayload.waste.insights,
        wasteRecommendations: analysisPayload.waste.recommendations,
        appliancesInsights: analysisPayload.appliances.insights,
        appliancesRecommendations: analysisPayload.appliances.recommendations,
        waterInsights: analysisPayload.water.insights,
        waterRecommendations: analysisPayload.water.recommendations,
        airTravelInsights: analysisPayload.airTravel.insights,
        airTravelRecommendations: analysisPayload.airTravel.recommendations
      }
    });

    await Prisma.user.update({
      where: { id: userId },
      data: { lastAnalysisDate: new Date() },
    });

    console.log('[DEBUG] Analysis completed successfully');
    res.json({
      status: 'success',
      range,
      dataStatus: {
        hasTransportationData: analysisData.transportation.length > 0,
        hasEnergyData: analysisData.energy.length > 0,
        hasWasteData: analysisData.waste.length > 0,
        hasAppliancesData: analysisData.appliances.length > 0,
        hasWaterData: analysisData.water.length > 0,
        hasAirTravelData: analysisData.airTravel.length > 0
      },
      ...analysisPayload
    });

  } catch (error) {
    console.error('[ERROR] Analysis process failed:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getPreviousAnalyses = async (req: Request, res: Response) => {
  try {
    // Validate userId from the query parameter
    const userId = Number(req.query.userId);
    if (!userId || isNaN(userId)) {
      res.status(400).json({ error: 'Invalid or missing user ID' });
      return;
    }

    // Fetch previous analyses ordered by date descending
    const previousAnalyses = await Prisma.analysisResponse.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    // Return the analyses
    res.json({ previousAnalyses });
  } catch (error) {
    console.error('[ERROR] Failed to fetch previous analyses:', error);
    res.status(500).json({ error: 'Failed to fetch previous analyses' });
  }
};

export default performAnalysis;