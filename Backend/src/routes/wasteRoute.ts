import express from 'express';
import { AddWasteEmission, getWasteData } from "../controllers/wasteController"

const route = express.Router();

route.post("/addwasteemission", AddWasteEmission);
route.get("/wasteemission", getWasteData);

export default route;
