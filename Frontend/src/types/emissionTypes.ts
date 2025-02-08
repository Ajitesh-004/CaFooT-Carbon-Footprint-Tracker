export type EmissionResult = {
    transport?: {
      transportation: { id: number; userId: number; date: string; distance: number; emissionFactor: number; emissions: number; createdAt: string; } | undefined;
      id: number;
      userId: number;
      date: string;
      distance: number;
      emissionFactor: number;
      emissions: number;
      createdAt: string;
    };
    energy?: {
      id: number;
      userId: number;
      date: string;
      energyUsage: number;
      emissionFactor: number;
      emissions: number;
      createdAt: string;
    };
    appliances?: {
      id: number;
      userId: number;
      date: string;
      applianceType: string;
      usageTime: number;
      powerRating: number;
      emissionFactor: number;
      emissions: number;
      createdAt: string;
    };
    water?: {
      id: number;
      userId: number;
      date: string;
      waterUsage: number;
      emissionFactor: number;
      emissions: number;
      createdAt: string;
    };
    waste?: {
      id: number;
      userId: number;
      date: string;
      quantity: number;
      emissionFactor: number;
      emissions: number;
      createdAt: string;
    };
    flight?: {
      id: number;
      userId: number;
      date: string;
      flightDistance: number;
      emissionFactor: number;
      emissions: number;
      createdAt: string;
    };
    totalEmission?: {
      id: number;
      userId: number;
      date: string;
      totalTransportationEmission: number;
      totalEnergyEmission: number;
      totalWasteEmission: number;
      totalAppliancesEmission: number;
      totalWaterEmission: number;
      totalAirTravelEmission: number;
      totalEmissions: number;
      createdAt: string;
    };
  };