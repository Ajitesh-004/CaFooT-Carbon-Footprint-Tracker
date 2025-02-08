import { EmissionFactors } from "../types/emission"

export const EMISSION_FACTORS: EmissionFactors = {
  transport: {
    car: 0.184,
    bus: 0.799,
    train: 0.09,
    bike: 0.073
  },
  energy: {
    grid: 0.707,
    renewable: 0.233
  },
  appliances: {
    airConditioner: 1.23,
    refrigerator: 0.14,
    washingMachine: 0.9,
    dishwasher: 0.75,
    tv: 0.08,
    computer: 0.15
  },
  waste: {
    general: 2.28,
    recycling: 0.0001,
    composting: 1.925
  },
  water: {
    hot: 0.0534,
    cold: 0.0022
  },
  flight: {
    economy: 0.12,
    business: 0.275,
    firstClass: 0.4
  }
};