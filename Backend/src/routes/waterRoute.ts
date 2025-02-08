import express from 'express';
import { AddWaterEmission, getWaterData } from "../controllers/waterController"

const route = express.Router();

route.post("/addwateremission", AddWaterEmission);
route.get("/wateremission", getWaterData);

export default route;