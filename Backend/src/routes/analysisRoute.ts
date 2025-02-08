import express from 'express';
import performAnalysis, { getPreviousAnalyses } from '../controllers/analysisController';

const route = express.Router();

route.get("/getanalysis", performAnalysis);
route.get('/previous-analyses', getPreviousAnalyses);

export default route;