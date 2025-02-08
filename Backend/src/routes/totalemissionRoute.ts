import express from "express";
import { getTotalEmissionsData, TotalEmission } from "../controllers/totalemissionController";

const route = express.Router();

route.get("/gettotalemission", TotalEmission);
route.get("/totalEmissions", getTotalEmissionsData);

export default route;