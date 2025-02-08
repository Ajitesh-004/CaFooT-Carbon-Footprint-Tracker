import { Request, Response } from 'express';
import Prisma from "../prisma/client";

export const AddWasteEmission = async (req: Request, res: Response) => {
    const { userId, date, wasteType, quantity, emissionFactor } = req.body;

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
        return;
    }

    try {
        // Calculate the emissions for this entry
        const emissions = quantity * emissionFactor;

        // Check if a waste record already exists for this user and date
        const existingWasteRecord = await Prisma.waste.findFirst({
            where: {
                userId: userId,
                date: date,
            },
        });

        let waste;

        if (existingWasteRecord) {
            // If the record exists, update the quantity and emissions
            waste = await Prisma.waste.update({
                where: {
                    id: existingWasteRecord.id,
                },
                data: {
                    quantity: existingWasteRecord.quantity + quantity, // Update quantity
                    emissions: existingWasteRecord.emissions + emissions, // Update emissions
                },
            });
        } else {
            // If the record does not exist, create a new one
            waste = await Prisma.waste.create({
                data: {
                    userId,
                    date, // Store date as a string in YYYY-MM-DD format
                    wasteType,
                    quantity,
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

        // Calculate the new total waste emissions
        const newTotalWasteEmission = (previousTotalEmission?.totalWasteEmission || 0) + emissions;

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
                totalWasteEmission: newTotalWasteEmission, // Update totalWasteEmission with the new cumulative total
                totalEmissions: newTotalEmissions, // Update totalEmissions with the new cumulative total
            },
            create: {
                userId,
                date, // Store date as a string in YYYY-MM-DD format
                totalTransportationEmission: previousTotalEmission?.totalTransportationEmission || 0,
                totalEnergyEmission: previousTotalEmission?.totalEnergyEmission || 0,
                totalWasteEmission: newTotalWasteEmission, // Initialize with the new cumulative total
                totalAppliancesEmission: previousTotalEmission?.totalAppliancesEmission || 0,
                totalWaterEmission: previousTotalEmission?.totalWaterEmission || 0,
                totalAirTravelEmission: previousTotalEmission?.totalAirTravelEmission || 0,
                totalEmissions: newTotalEmissions, // Initialize with the new cumulative total
            },
        });

        res.status(200).json( waste );
    } catch (error) {
        console.error("Error adding waste emission:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getWasteData = async (req: Request, res: Response) => {
    const { userId, sortBy } = req.query;

    // Validate userId
    if (!userId) {
        res.status(400).json({ message: "User ID is required." });
        return;
    }

    // Validate sortBy
    const validSortFields = ['date', 'quantity', 'emissions', 'wasteType'];

    if (sortBy && !validSortFields.includes(sortBy as string)) {
        res.status(400).json({ 
            message: `Invalid sort field. Use one of: ${validSortFields.join(', ')}.`
        });
        return;
    }

    try {
        // Fetch all waste records for the user
        const wasteData = await Prisma.waste.findMany({
            where: {
                userId: parseInt(userId as string), // Convert userId to number
            },
            orderBy: {
                [sortBy as string || 'date']: 'asc', // Default to sorting by date in ascending order
            },
        });

        // If no data is found, return a 404 response
        if (!wasteData || wasteData.length === 0) {
            res.status(404).json({ message: "No waste data found for this user." });
            return;
        }

        res.status(200).json(wasteData);
    } catch (error) {
        console.error("Error fetching waste data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};