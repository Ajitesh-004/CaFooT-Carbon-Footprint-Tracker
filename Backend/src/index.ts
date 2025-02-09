import express, {Request, Response} from 'express';
import cors from 'cors';
import authRoute from "./routes/authRoute";
import transportRoute from "./routes/transportationRoute";
import energyRoute from "./routes/energyRoute";
import wasteRoute from "./routes/wasteRoute";
import waterRoute from "./routes/waterRoute";
import applianceRoute from "./routes/applianceRoute";
import airtravelRoute from "./routes/airtravelRoute";
import totalemissionRoute from "./routes/totalemissionRoute";
import analysisRoute from "./routes/analysisRoute";
import communityRoute from "./routes/communityRoute";
import './initCredentials';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5069;

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to CaFooT API!');
});

app.use("/api/auth", authRoute);
app.use("/api/transport", transportRoute);
app.use("/api/energy", energyRoute);
app.use("/api/waste", wasteRoute);
app.use("/api/water", waterRoute);
app.use("/api/appliance", applianceRoute);
app.use("/api/airtravel", airtravelRoute);
app.use("/api/totalemission", totalemissionRoute);
app.use("/api/analysis", analysisRoute)
app.use("/api/community", communityRoute);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});