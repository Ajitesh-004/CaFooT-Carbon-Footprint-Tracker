import { atom } from 'recoil';
import {
  TransportLog,
  EnergyLog,
  ApplianceLog,
  WasteLog,
  WaterLog,
  AirTravelLog,
  TotalEmissions,
} from "../types/emission"

export const transportationState = atom<TransportLog[]>({
  key: 'transportationState',
  default: []
});

export const energyState = atom<EnergyLog[]>({
  key: 'energyState',
  default: []
});

export const applianceState = atom<ApplianceLog[]>({
  key: 'applianceState',
  default: []
});

export const wasteState = atom<WasteLog[]>({
  key: 'wasteState',
  default: []
});

export const waterState = atom<WaterLog[]>({
  key: 'waterState',
  default: []
});

export const airTravelState = atom<AirTravelLog[]>({
  key: 'airTravelState',
  default: []
});

export const totalEmissionsState = atom<TotalEmissions[]>({
  key: 'totalEmissionsState',
  default: []
});