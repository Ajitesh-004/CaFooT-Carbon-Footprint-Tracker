import { Request, Response } from 'express';
import Prisma from "../prisma/client";

export const AddAppliancesEmission = async (req: Request, res: Response) => {
    const { userId, date, applianceType, usageTime, powerRating, emissionFactor } = req.body;


    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
        return;
    }

    try {
        // Calculate the emissions for this entry
        const emissions = usageTime * powerRating * emissionFactor;

        // Check if an appliances usage record already exists for this user, date, and appliance type
        const existingAppliancesRecord = await Prisma.appliancesUsage.findFirst({
            where: {
                userId: userId,
                date: date,
                applianceType: applianceType, // Ensure the record is for the same appliance type
            },
        });

        let appliancesUsage;

        if (existingAppliancesRecord) {
            // If the record exists, update the usage time and emissions for the specific appliance type
            appliancesUsage = await Prisma.appliancesUsage.update({
                where: {
                    id: existingAppliancesRecord.id,
                },
                data: {
                    usageTime: existingAppliancesRecord.usageTime + usageTime, // Update usage time
                    emissions: existingAppliancesRecord.emissions + emissions, // Update emissions
                },
            });
        } else {
            // If the record does not exist, create a new one for the specific appliance type
            appliancesUsage = await Prisma.appliancesUsage.create({
                data: {
                    userId,
                    date, // Store date as a string in YYYY-MM-DD format
                    applianceType,
                    usageTime,
                    powerRating,
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

        // Calculate the new total appliances emissions
        const newTotalAppliancesEmission = (previousTotalEmission?.totalAppliancesEmission || 0) + emissions;

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
                totalAppliancesEmission: newTotalAppliancesEmission, // Update totalAppliancesEmission with the new cumulative total
                totalEmissions: newTotalEmissions, // Update totalEmissions with the new cumulative total
            },
            create: {
                userId,
                date, // Store date as a string in YYYY-MM-DD format
                totalTransportationEmission: previousTotalEmission?.totalTransportationEmission || 0,
                totalEnergyEmission: previousTotalEmission?.totalEnergyEmission || 0,
                totalWasteEmission: previousTotalEmission?.totalWasteEmission || 0,
                totalAppliancesEmission: newTotalAppliancesEmission, // Initialize with the new cumulative total
                totalWaterEmission: previousTotalEmission?.totalWaterEmission || 0,
                totalAirTravelEmission: previousTotalEmission?.totalAirTravelEmission || 0,
                totalEmissions: newTotalEmissions, // Initialize with the new cumulative total
            },
        });
        res.status(200).json(appliancesUsage);
    } catch (error) {
        console.error("Error adding appliances emission:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAppliancesData = async (req: Request, res: Response) => {
    const { userId, sortBy } = req.query;

    // Validate userId
    if (!userId) {
        res.status(400).json({ message: "User ID is required." });
        return;
    }

    // Validate sortBy
    const validSortFields = ['date', 'usageTime', 'emissions', 'applianceType'];

    if (sortBy && !validSortFields.includes(sortBy as string)) {
        res.status(400).json({ 
            message: `Invalid sort field. Use one of: ${validSortFields.join(', ')}.`
        });
        return;
    }

    try {
        // Fetch all appliances records for the user
        const appliancesData = await Prisma.appliancesUsage.findMany({
            where: {
                userId: parseInt(userId as string), // Convert userId to number
            },
            orderBy: {
                [sortBy as string || 'date']: 'asc', // Default to sorting by date in ascending order
            },
        });

        // If no data is found, return a 404 response
        if (!appliancesData || appliancesData.length === 0) {
            res.status(404).json({ message: "No appliances data found for this user." });
            return;
        }

        res.status(200).json(appliancesData);
    } catch (error) {
        console.error("Error fetching appliances data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};