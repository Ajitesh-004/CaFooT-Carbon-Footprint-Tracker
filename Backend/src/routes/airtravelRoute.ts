import express from 'express';
import { AddAirTravelEmission, getAirTravelData } from '../controllers/airtravelController';

const route = express.Router();

route.post("/addairtravelemission", AddAirTravelEmission);
route.get("/airTravelemission", getAirTravelData);

export default route;