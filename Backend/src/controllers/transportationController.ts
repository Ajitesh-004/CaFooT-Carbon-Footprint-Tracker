import { Request, Response } from 'express';
import Prisma from "../prisma/client";

export const AddTransportEmission = async (req: Request, res: Response) => {
    const { userId, date, distance, transportType, emissionFactor } = req.body;

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
        return;
    }

    // Validate required fields
    if (!userId || !date || !distance || !transportType || emissionFactor === undefined) {
        res.status(400).json({ message: "Missing required fields." });
        return;
    }

    try {
        // Calculate emissions based on distance and emissionFactor
        const emissions = distance * emissionFactor;

        // Check if a transportation record already exists for this user, date, and transportType
        const existingTransportationRecord = await Prisma.transportation.findFirst({
            where: {
                userId: userId,
                date: date,
                transportType: transportType,
            },
        });

        let transportation;

        if (existingTransportationRecord) {
            // If the record exists, update the distance and emissions
            transportation = await Prisma.transportation.update({
                where: {
                    id: existingTransportationRecord.id,
                },
                data: {
                    distance: existingTransportationRecord.distance + distance, // Update distance
                    emissions: existingTransportationRecord.emissions + emissions, // Update emissions
                },
            });
        } else {
            // If the record does not exist, create a new one
            transportation = await Prisma.transportation.create({
                data: {
                    userId,
                    date, // Store date as a string in YYYY-MM-DD format
                    distance,
                    transportType,
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

        // Calculate the new total transportation emissions
        const newTotalTransportationEmission = (previousTotalEmission?.totalTransportationEmission || 0) + emissions;

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
                totalTransportationEmission: newTotalTransportationEmission, // Update totalTransportationEmission with the new cumulative total
                totalEmissions: newTotalEmissions, // Update totalEmissions with the new cumulative total
            },
            create: {
                userId,
                date, // Store date as a string in YYYY-MM-DD format
                totalTransportationEmission: newTotalTransportationEmission, // Initialize with the new cumulative total
                totalEnergyEmission: 0,
                totalWasteEmission: 0,
                totalAppliancesEmission: 0,
                totalWaterEmission: 0,
                totalAirTravelEmission: 0,
                totalEmissions: newTotalEmissions, // Initialize with the new cumulative total
            },
        });

        res.status(200).json({ transportation, totalEmission });
    } catch (error) {
        console.error("Error adding transport emission:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getTransportationData = async (req: Request, res: Response) => {
    const { userId, sortBy } = req.query;

    // Validate userId
    if (!userId) {
        res.status(400).json({ message: "User ID is required." });
        return;
    }

    // Validate sortBy
    const validSortFields = ['date', 'distance', 'emissions', 'transportType'];

    if (sortBy && !validSortFields.includes(sortBy as string)) {
        res.status(400).json({ 
            message: `Invalid sort field. Use one of: ${validSortFields.join(', ')}.`
        });
        return;
    }

    try {
        // Fetch all transportation records for the user
        const transportationData = await Prisma.transportation.findMany({
            where: {
                userId: parseInt(userId as string), // Convert userId to number
            },
            orderBy: {
                [sortBy as string || 'date']: 'asc', // Default to sorting by date in ascending order
            },
        });

        // If no data is found, return a 404 response
        if (!transportationData || transportationData.length === 0) {
            res.status(404).json({ message: "No transportation data found for this user." });
            return;
        }

        res.status(200).json(transportationData);
    } catch (error) {
        console.error("Error fetching transportation data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};