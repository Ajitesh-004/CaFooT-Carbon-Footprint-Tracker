import express from 'express';
import { AddEnergyEmission, getEnergyData } from "../controllers/energyController"

const route = express.Router();

route.post("/addenergyemission", AddEnergyEmission);
route.get("/energyemission", getEnergyData);

export default route;