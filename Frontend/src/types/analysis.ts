export type AnalysisCategory = {
    insights: string[];
    recommendations: string[];
    detailedAnalysis: string;
  };
  
  export type AnalysisData = {
    date: string;
    overall: AnalysisCategory;
    transportation: AnalysisCategory;
    energy: AnalysisCategory;
    waste: AnalysisCategory;
    appliances: AnalysisCategory;
    water: AnalysisCategory;
  };
  
  export interface PreviousAnalysis {
    date: string;
    totalEmissions: number;
    sections: {
      category: string;
      insights: string[];
      recommendations: string[];
    }[];
  }
  