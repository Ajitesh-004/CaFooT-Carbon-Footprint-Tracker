import { Request, Response } from 'express';
import Prisma from "../prisma/client";

export const AddWaterEmission = async (req: Request, res: Response) => {
    const { userId, date, waterUsage, waterType, emissionFactor } = req.body;

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
        return;
    }

    try {
        // Calculate the emissions for this entry
        const emissions = waterUsage * emissionFactor;

        // Check if a water usage record already exists for this user, date, and waterType
        const existingWaterRecord = await Prisma.waterUsage.findFirst({
            where: {
                userId: userId,
                date: date,
                waterType: waterType, // Ensure the waterType matches
            },
        });

        let waterUsageRecord;

        if (existingWaterRecord) {
            // If the record exists, update the water usage and emissions
            waterUsageRecord = await Prisma.waterUsage.update({
                where: {
                    id: existingWaterRecord.id,
                },
                data: {
                    waterUsage: existingWaterRecord.waterUsage + waterUsage, // Update water usage
                    emissions: existingWaterRecord.emissions + emissions, // Update emissions
                },
            });
        } else {
            // If the record does not exist, create a new one
            waterUsageRecord = await Prisma.waterUsage.create({
                data: {
                    userId,
                    date, // Store date as a string in YYYY-MM-DD format
                    waterUsage,
                    waterType,
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

        // Calculate the new total water emissions
        const newTotalWaterEmission = (previousTotalEmission?.totalWaterEmission || 0) + emissions;

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
                totalWaterEmission: newTotalWaterEmission, // Update totalWaterEmission with the new cumulative total
                totalEmissions: newTotalEmissions, // Update totalEmissions with the new cumulative total
            },
            create: {
                userId,
                date, // Store date as a string in YYYY-MM-DD format
                totalTransportationEmission: previousTotalEmission?.totalTransportationEmission || 0,
                totalEnergyEmission: previousTotalEmission?.totalEnergyEmission || 0,
                totalWasteEmission: previousTotalEmission?.totalWasteEmission || 0,
                totalAppliancesEmission: previousTotalEmission?.totalAppliancesEmission || 0,
                totalWaterEmission: newTotalWaterEmission, // Initialize with the new cumulative total
                totalAirTravelEmission: previousTotalEmission?.totalAirTravelEmission || 0,
                totalEmissions: newTotalEmissions, // Initialize with the new cumulative total
            },
        });

        res.status(200).json(waterUsageRecord);
    } catch (error) {
        console.error("Error adding water emission:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getWaterData = async (req: Request, res: Response) => {
    const { userId, sortBy } = req.query;

    // Validate userId
    if (!userId) {
        res.status(400).json({ message: "User ID is required." });
        return;
    }

    // Validate sortBy
    const validSortFields = ['date', 'waterUsage', 'emissions', 'waterType'];

    if (sortBy && !validSortFields.includes(sortBy as string)) {
        res.status(400).json({ 
            message: `Invalid sort field. Use one of: ${validSortFields.join(', ')}.`
        });
        return;
    }

    try {
        // Fetch all water usage records for the user
        const waterData = await Prisma.waterUsage.findMany({
            where: {
                userId: parseInt(userId as string), // Convert userId to number
            },
            orderBy: {
                [sortBy as string || 'date']: 'asc', // Default to sorting by date in ascending order
            },
        });

        // If no data is found, return a 404 response
        if (!waterData || waterData.length === 0) {
            res.status(404).json({ message: "No water usage data found for this user." });
            return;
        }

        res.status(200).json(waterData);
    } catch (error) {
        console.error("Error fetching water usage data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};