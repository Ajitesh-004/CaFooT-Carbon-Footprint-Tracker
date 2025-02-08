import express from 'express';
import { AddTransportEmission, getTransportationData } from '../controllers/transportationController';

const route = express.Router();

route.post("/addtransportemission", AddTransportEmission);
route.get("/transportationemission", getTransportationData)

export default route;