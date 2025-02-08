export type TransportMode = 'car' | 'bus' | 'train'| 'bike';
export type EnergySource = 'grid' | 'renewable';
export type ApplianceType = 'airConditioner' | 'refrigerator' | 'washingMachine' | 'dishwasher' | 'tv' | 'computer';
export type WasteType = 'general' | 'recycling' | 'composting';
export type WaterType = 'hot' | 'cold';
export type FlightClass = 'economy' | 'business' | 'firstClass';

export interface EmissionFactors {
  transport: Record<TransportMode, number>;
  energy: Record<EnergySource, number>;
  appliances: Record<ApplianceType, number>;
  waste: Record<WasteType, number>;
  water: Record<WaterType, number>;
  flight: Record<FlightClass, number>;
}

export interface EmissionRecord {
  id: number;
  date: string;
  category: keyof EmissionFactors;
  type: string;
  value: number;
  additionalData?: Record<string, any>;
  emissions: number;
}

export interface EmissionLog {
  date: string;
  emissions: number;
}

export interface TransportLog extends EmissionLog {
  transportType: TransportMode;
  distance: number;
}

export interface EnergyLog extends EmissionLog {
  energySource: EnergySource;
  usage: number;
}

export interface ApplianceLog extends EmissionLog {
  applianceType: ApplianceType;
  usageTime: number;
  powerRating: number;
}

export interface WasteLog extends EmissionLog {
  wasteType: WasteType;
  quantity: number;
}

export interface WaterLog extends EmissionLog {
  waterType: WaterType;
  usage: number;
}

export interface AirTravelLog extends EmissionLog {
  flightClass: FlightClass;
  distance: number;
}

export interface TotalEmissions {
  date: string;
  transportationEmissions: number;
  energyEmissions: number;
  applianceEmissions: number;
  wasteEmissions: number;
  waterEmissions: number;
  airTravelEmissions: number;
  total: number;
}