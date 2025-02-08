import { atom } from "recoil";
import { AnalysisData, PreviousAnalysis } from "../types/analysis";

export const analysisAtom = atom<{
    currentAnalysis: AnalysisData | null;
    previousAnalyses: PreviousAnalysis[];
  }>({
    key: 'analysisAtom',
    default: {
      currentAnalysis: null,
      previousAnalyses: []
    }
});