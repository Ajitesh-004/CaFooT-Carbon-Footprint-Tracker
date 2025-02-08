import { Request, Response } from 'express';
import Prisma from "../prisma/client";

export const AddEnergyEmission = async (req: Request, res: Response) => {
    const { userId, date, energyType, energyUsage, emissionFactor } = req.body;

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
        return;
    }

    // Validate energyType (e.g., "grid", "renewable")
    const validEnergyTypes = ['grid', 'renewable'];
    if (!validEnergyTypes.includes(energyType)) {
        res.status(400).json({ message: "Invalid energyType. Use 'grid' or 'renewable'." });
        return;
    }

    try {
        // Calculate the emissions for this entry
        const emissions = energyUsage * emissionFactor;

        // Check if an energy record already exists for this user, date, and energyType
        const existingEnergyRecord = await Prisma.energy.findFirst({
            where: {
                userId: userId,
                date: date,
                energyType: energyType, // Include energyType in the query
            },
        });

        let energy;

        if (existingEnergyRecord) {
            // If the record exists, update the energy usage and emissions
            energy = await Prisma.energy.update({
                where: {
                    id: existingEnergyRecord.id,
                },
                data: {
                    energyUsage: existingEnergyRecord.energyUsage + energyUsage, // Update energy usage
                    emissions: existingEnergyRecord.emissions + emissions, // Update emissions
                },
            });
        } else {
            // If the record does not exist, create a new one
            energy = await Prisma.energy.create({
                data: {
                    userId,
                    date, // Store date as a string in YYYY-MM-DD format
                    energyType, // Include energyType
                    energyUsage,
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

        // Calculate the new total energy emissions
        const newTotalEnergyEmission = (previousTotalEmission?.totalEnergyEmission || 0) + emissions;

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
                totalEnergyEmission: newTotalEnergyEmission, // Update totalEnergyEmission with the new cumulative total
                totalEmissions: newTotalEmissions, // Update totalEmissions with the new cumulative total
            },
            create: {
                userId,
                date, // Store date as a string in YYYY-MM-DD format
                totalTransportationEmission: previousTotalEmission?.totalTransportationEmission || 0,
                totalEnergyEmission: newTotalEnergyEmission, // Initialize with the new cumulative total
                totalWasteEmission: previousTotalEmission?.totalWasteEmission || 0,
                totalAppliancesEmission: previousTotalEmission?.totalAppliancesEmission || 0,
                totalWaterEmission: previousTotalEmission?.totalWaterEmission || 0,
                totalAirTravelEmission: previousTotalEmission?.totalAirTravelEmission || 0,
                totalEmissions: newTotalEmissions, // Initialize with the new cumulative total
            },
        });

        res.status(200).json(energy);
    } catch (error) {
        console.error("Error adding energy emission:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getEnergyData = async (req: Request, res: Response) => {
    const { userId, sortBy } = req.query;

    // Validate userId
    if (!userId) {
        res.status(400).json({ message: "User ID is required." });
        return;
    }

    // Validate sortBy
    const validSortFields = ['date', 'energyUsage', 'emissions', 'energyType'];

    if (sortBy && !validSortFields.includes(sortBy as string)) {
        res.status(400).json({ 
            message: `Invalid sort field. Use one of: ${validSortFields.join(', ')}.`
        });
        return;
    }

    try {
        // Fetch all energy records for the user
        const energyData = await Prisma.energy.findMany({
            where: {
                userId: parseInt(userId as string), // Convert userId to number
            },
            orderBy: {
                [sortBy as string || 'date']: 'asc', // Default to sorting by date in ascending order
            },
        });

        // If no data is found, return a 404 response
        if (!energyData || energyData.length === 0) {
            res.status(404).json({ message: "No energy data found for this user." });
            return;
        }

        res.status(200).json(energyData);
    } catch (error) {
        console.error("Error fetching energy data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};