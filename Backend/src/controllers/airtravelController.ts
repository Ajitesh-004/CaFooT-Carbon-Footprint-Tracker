import { Request, Response } from 'express';
import Prisma from "../prisma/client";

export const AddAirTravelEmission = async (req: Request, res: Response) => {
    const { userId, date, flightDistance, flightClass, emissionFactor } = req.body;

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
        return;
    }

    try {
        // Calculate the emissions for this entry
        const emissions = flightDistance * emissionFactor;

        // Check if an air travel record already exists for this user and date
        const existingAirTravelRecord = await Prisma.airTravel.findFirst({
            where: {
                userId: userId,
                date: date,
            },
        });

        let airTravel;

        if (existingAirTravelRecord) {
            // If the record exists, update the flight distance and emissions
            airTravel = await Prisma.airTravel.update({
                where: {
                    id: existingAirTravelRecord.id,
                },
                data: {
                    flightDistance: existingAirTravelRecord.flightDistance + flightDistance, // Update flight distance
                    emissions: existingAirTravelRecord.emissions + emissions, // Update emissions
                },
            });
        } else {
            // If the record does not exist, create a new one
            airTravel = await Prisma.airTravel.create({
                data: {
                    userId,
                    date, // Store date as a string in YYYY-MM-DD format
                    flightDistance,
                    emissionFactor,
                    emissions,
                },
            });
        }

        // Fetch the previous total emissions from the TotalEmission table
        const previousTotalEmission = await Prisma.totalEmission.findFirst({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: 'desc', // Get the most recent record
            },
        });

        // Calculate the new total air travel emissions
        const newTotalAirTravelEmission = (previousTotalEmission?.totalAirTravelEmission || 0) + emissions;

        // Calculate the new total emissions
        const newTotalEmissions = (previousTotalEmission?.totalEmissions || 0) + emissions;

        // Update or create the TotalEmission record
        const totalEmission = await Prisma.totalEmission.upsert({
            where: {
                userId_date: {
                    userId: userId,
                    date: date,
                },
            },
            update: {
                totalAirTravelEmission: newTotalAirTravelEmission, // Update totalAirTravelEmission with the new cumulative total
                totalEmissions: newTotalEmissions, // Update totalEmissions with the new cumulative total
            },
            create: {
                userId,
                date, // Store date as a string in YYYY-MM-DD format
                totalTransportationEmission: previousTotalEmission?.totalTransportationEmission || 0,
                totalEnergyEmission: previousTotalEmission?.totalEnergyEmission || 0,
                totalWasteEmission: previousTotalEmission?.totalWasteEmission || 0,
                totalAppliancesEmission: previousTotalEmission?.totalAppliancesEmission || 0,
                totalWaterEmission: previousTotalEmission?.totalWaterEmission || 0,
                totalAirTravelEmission: newTotalAirTravelEmission, // Initialize with the new cumulative total
                totalEmissions: newTotalEmissions, // Initialize with the new cumulative total
            },
        });

        res.status(200).json( airTravel );
    } catch (error) {
        console.error("Error adding air travel emission:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAirTravelData = async (req: Request, res: Response) => {
    const { userId, sortBy } = req.query;

    // Validate userId
    if (!userId) {
        res.status(400).json({ message: "User ID is required." });
        return;
    }

    // Validate sortBy
    const validSortFields = ['date', 'flightDistance', 'emissions'];

    if (sortBy && !validSortFields.includes(sortBy as string)) {
        res.status(400).json({ 
            message: `Invalid sort field. Use one of: ${validSortFields.join(', ')}.`
        });
        return;
    }

    try {
        // Fetch all air travel records for the user
        const airTravelData = await Prisma.airTravel.findMany({
            where: {
                userId: parseInt(userId as string), // Convert userId to number
            },
            orderBy: {
                [sortBy as string || 'date']: 'asc', // Default to sorting by date in ascending order
            },
        });

        // If no data is found, return a 404 response
        if (!airTravelData || airTravelData.length === 0) {
            res.status(404).json({ message: "No air travel data found for this user." });
            return;
        }

        res.status(200).json(airTravelData);
    } catch (error) {
        console.error("Error fetching air travel data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};