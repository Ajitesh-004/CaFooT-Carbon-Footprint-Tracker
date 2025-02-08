import express from 'express';
import { AddAppliancesEmission, getAppliancesData } from '../controllers/appliancesController';

const route = express.Router();

route.post("/addapplianceemission", AddAppliancesEmission);
route.get("/applianceemission", getAppliancesData);

export default route;