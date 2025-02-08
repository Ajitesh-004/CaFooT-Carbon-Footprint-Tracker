import { Request, Response } from "express";
import Prisma from "../prisma/client";

export const TotalEmission = async (req: Request, res: Response) => {
    const { userId } = req.query;
  
    if (!userId) {
      res.status(400).json({ error: 'userId is required' });
      return 
    }
  
    try {
      // Fetch the most recent TotalEmission record for the user
      const mostRecentEmission = await Prisma.totalEmission.findFirst({
        where: {
          userId: Number(userId),
        },
        orderBy: {
          createdAt: 'desc', // Order by createdAt in descending order to get the most recent record
        },
      });
  
      if (!mostRecentEmission) {
        res.status(404).json({ error: 'No emission records found for this user' });
        return 
      }
  
      // Return the most recent emission record
      res.status(200).json(mostRecentEmission);
    } catch (error) {
      console.error('Error fetching total emissions:', error);
      res.status(500).json({ error: 'Failed to fetch total emissions' });
    }
  };

export const getTotalEmissionsData = async (req: Request, res: Response) => {
  const { userId, sortBy } = req.query;

    // Validate userId
    if (!userId) {
        res.status(400).json({ message: "User ID is required." });
        return;
    }

    // Validate sortBy
    const validSortFields = ['date', 'totalEmissions'];

    if (sortBy && !validSortFields.includes(sortBy as string)) {
        res.status(400).json({ 
            message: `Invalid sort field. Use one of: ${validSortFields.join(', ')}.`
        });
        return;
    }

    try {
        // Fetch all total emissions records for the user
        const totalEmissionsData = await Prisma.totalEmission.findMany({
            where: {
                userId: parseInt(userId as string), // Convert userId to number
            },
            orderBy: {
                [sortBy as string || 'date']: 'asc', // Default to sorting by date in ascending order
            },
        });

        // If no data is found, return a 404 response
        if (!totalEmissionsData || totalEmissionsData.length === 0) {
            res.status(404).json({ message: "No total emissions data found for this user." });
            return;
        }

        res.status(200).json(totalEmissionsData);
    } catch (error) {
        console.error("Error fetching total emissions data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};