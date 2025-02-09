import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import toast from 'react-hot-toast';
import {
  Car, Bus, Train, Bike, Zap, Home, Trash2, Droplet,
  PlaneTakeoff, Plus, ChevronDown, ChevronUp, Award, Sun
} from 'lucide-react';
import { userAtom } from '../atoms/userAtom';
import { formatDate } from "../utils/formatDate";
import { EMISSION_FACTORS } from '../constants/emissionFactors';
import type { TransportMode, EnergySource, ApplianceType, WasteType, WaterType, FlightClass, EmissionFactors } from "../types/emission";
import { EmissionResult } from "../types/emissionTypes";
import ResultSection from '../components/ResultSection';

// API endpoints
const API_ENDPOINTS = {
  transport: 'https://cafoot-backend.onrender.com/api/transport/addtransportemission',
  energy: 'https://cafoot-backend.onrender.com/api/energy/addenergyemission',
  waste: 'https://cafoot-backend.onrender.com/api/waste/addwasteemission',
  appliances: 'https://cafoot-backend.onrender.com/api/appliance/addapplianceemission',
  water: 'https://cafoot-backend.onrender.com/api/water/addwateremission',
  flight: 'https://cafoot-backend.onrender.com/api/airtravel/addairtravelemission',
  totalEmissions: 'https://cafoot-backend.onrender.com/api/totalemission/gettotalemission', // Endpoint to fetch total emissions
};

// Type for the TotalEmission object
type TotalEmission = {
  totalTransportationEmission: number;
  totalEnergyEmission: number;
  totalWasteEmission: number;
  totalAppliancesEmission: number;
  totalWaterEmission: number;
  totalAirTravelEmission: number;
  totalEmissions: number;
};

export default function EmissionsCalculator() {
  const user = useRecoilValue(userAtom);
  const [activeCategory, setActiveCategory] = useState<keyof EmissionFactors | null>(null);
  const [totalEmissionData, setTotalEmissionData] = useState<TotalEmission | null>(null); // State for total emission data
  const [emissionResult, setEmissionResult] = useState<EmissionResult | null>(null);

  // Form states
  const [transportMode, setTransportMode] = useState<TransportMode>('car');
  const [distance, setDistance] = useState('');
  const [energySource, setEnergySource] = useState<EnergySource>('grid');
  const [energyUsage, setEnergyUsage] = useState('');
  const [applianceType, setApplianceType] = useState<ApplianceType>('airConditioner');
  const [usageTime, setUsageTime] = useState('');
  const [powerRating, setPowerRating] = useState('');
  const [wasteType, setWasteType] = useState<WasteType>('general');
  const [wasteQuantity, setWasteQuantity] = useState('');
  const [waterType, setWaterType] = useState<WaterType>('cold');
  const [waterUsage, setWaterUsage] = useState('');
  const [flightClass, setFlightClass] = useState<FlightClass>('economy');
  const [flightDistance, setFlightDistance] = useState('');

  // Fetch total emissions when the component mounts or when the user changes
  useEffect(() => {
    const fetchTotalEmissions = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(`${API_ENDPOINTS.totalEmissions}?userId=${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch total emissions');
        }

        const data: TotalEmission = await response.json();
        setTotalEmissionData(data); // Set the total emission data
      } catch (error) {
        console.error('Error fetching total emissions:', error);
      }
    };

    fetchTotalEmissions();
  }, [user]);

  // Handle form submission for each emission factor
  const handleSubmit = async (e: React.FormEvent, category: keyof EmissionFactors) => {
    e.preventDefault();

    const userId = user?.id;
    const date = formatDate(new Date());

    try {
      let response;

      switch (category) {
        case 'transport':
          if (!distance) {
            toast.error('Please enter a distance');
            return;
          }
          response = await fetch(API_ENDPOINTS.transport, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              date,
              transportType: transportMode, 
              distance: parseFloat(distance),
              emissionFactor: EMISSION_FACTORS.transport[transportMode],
            }),
          });
          setDistance('');
          break;

        case 'energy':
          if (!energyUsage) {
            toast.error('Please enter energy usage');
            return;
          }
          response = await fetch(API_ENDPOINTS.energy, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              date,
              energyType: energySource,
              energyUsage: parseFloat(energyUsage),
              emissionFactor: EMISSION_FACTORS.energy[energySource],
            }),
          });
          setEnergyUsage('');
          break;

        case 'appliances':
          if (!usageTime || !powerRating) {
            toast.error('Please fill in all fields');
            return;
          }
          response = await fetch(API_ENDPOINTS.appliances, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              date,
              applianceType,
              usageTime: parseFloat(usageTime),
              powerRating: parseFloat(powerRating),
              emissionFactor: EMISSION_FACTORS.appliances[applianceType],
            }),
          });
          setUsageTime('');
          setPowerRating('');
          break;

        case 'waste':
          if (!wasteQuantity) {
            toast.error('Please enter waste quantity');
            return;
          }
          response = await fetch(API_ENDPOINTS.waste, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              date,
              wasteType,
              quantity: parseFloat(wasteQuantity),
              emissionFactor: EMISSION_FACTORS.waste[wasteType],
            }),
          });
          setWasteQuantity('');
          break;

        case 'water':
          if (!waterUsage) {
            toast.error('Please enter water usage');
            return;
          }
          response = await fetch(API_ENDPOINTS.water, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              date,
              waterType,
              waterUsage: parseFloat(waterUsage),
              emissionFactor: EMISSION_FACTORS.water[waterType],
            }),
          });
          setWaterUsage('');
          break;

        case 'flight':
          if (!flightDistance) {
            toast.error('Please enter flight distance');
            return;
          }
          response = await fetch(API_ENDPOINTS.flight, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              date,
              flightDistance: parseFloat(flightDistance),
              emissionFactor: EMISSION_FACTORS.flight[flightClass],
            }),
          });
          setFlightDistance('');
          break;

        default:
          return;
      }

      if (!response.ok) {
        throw new Error('Failed to calculate emissions');
      }

      const result = await response.json();
      console.log(result);
      setEmissionResult((prev) => {
        const updatedResult = {
          ...prev,
          [category]: result,
        };
        console.log('Result:', result); // Log the backend response
        console.log('Updated Emission Result:', updatedResult); // Log the updated state
        return updatedResult;
      });

      toast.success('Emissions calculated and saved successfully!');
    } catch (error) {
      toast.error('Failed to calculate emissions. Please try again.');
      console.error(error);
    }
  };

  // Get the icon for a category
  const getCategoryIcon = (category: keyof EmissionFactors) => {
    switch (category) {
      case 'transport': return <Car className="w-6 h-6" />;
      case 'energy': return <Zap className="w-6 h-6" />;
      case 'appliances': return <Home className="w-6 h-6" />;
      case 'waste': return <Trash2 className="w-6 h-6" />;
      case 'water': return <Droplet className="w-6 h-6" />;
      case 'flight': return <PlaneTakeoff className="w-6 h-6" />;
      default: return <Plus className="w-6 h-6" />;
    }
  };

  // Get the icon for a specific type within a category
  const getTypeIcon = (category: keyof EmissionFactors, type: string) => {
    switch (category) {
      case 'transport':
        switch (type) {
          case 'car': return <Car className="w-6 h-6" />;
          case 'bus': return <Bus className="w-6 h-6" />;
          case 'train': return <Train className="w-6 h-6" />;
          case 'bike': return <Bike className="w-6 h-6" />;
          default: return null;
        }
      case 'energy':
        switch (type) {
          case 'grid': return <Zap className="w-6 h-6" />;
          case 'renewable': return <Sun className="w-6 h-6" />;
          default: return null;
        }
      case 'waste':
        return <Trash2 className="w-6 h-6" />;
      case 'water':
        return <Droplet className="w-6 h-6" />;
      case 'flight':
        return <PlaneTakeoff className="w-6 h-6" />;
      default:
        return null;
    }
  };

  // Render the form for the active category
  const renderCategoryForm = (category: keyof EmissionFactors) => {
    switch (category) {
      case 'transport':
        return (
          <form onSubmit={(e) => handleSubmit(e, 'transport')} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {(Object.keys(EMISSION_FACTORS.transport) as TransportMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setTransportMode(mode)}
                  className={`flex items-center justify-center p-4 rounded-lg border transition-all duration-200 transform hover:scale-105 ${
                    transportMode === mode
                      ? 'bg-green-50 border-green-500 text-green-700 shadow-md'
                      : 'border-gray-200 hover:border-green-200 hover:bg-green-50'
                  }`}
                >
                  {getTypeIcon('transport', mode)}
                  <span className="ml-2 capitalize">{mode}</span>
                </button>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distance (km)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow duration-200"
                placeholder="Enter distance"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Calculate Transport Emissions
            </button>
          </form>
        );

      case 'energy':
        return (
          <form onSubmit={(e) => handleSubmit(e, 'energy')} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {(Object.keys(EMISSION_FACTORS.energy) as EnergySource[]).map((source) => (
                <button
                  key={source}
                  type="button"
                  onClick={() => setEnergySource(source)}
                  className={`flex items-center justify-center p-4 rounded-lg border transition-all duration-200 transform hover:scale-105 ${
                    energySource === source
                      ? 'bg-green-50 border-green-500 text-green-700 shadow-md'
                      : 'border-gray-200 hover:border-green-200 hover:bg-green-50'
                  }`}
                >
                  {getTypeIcon('energy', source)}
                  <span className="ml-2 capitalize">{source}</span>
                </button>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Energy Usage (kWh)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={energyUsage}
                onChange={(e) => setEnergyUsage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow duration-200"
                placeholder="Enter energy usage"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Calculate Energy Emissions
            </button>
          </form>
        );

      case 'appliances':
        return (
          <form onSubmit={(e) => handleSubmit(e, 'appliances')} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {(Object.keys(EMISSION_FACTORS.appliances) as ApplianceType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setApplianceType(type)}
                  className={`flex items-center justify-center p-4 rounded-lg border transition-all duration-200 transform hover:scale-105 ${
                    applianceType === type
                      ? 'bg-green-50 border-green-500 text-green-700 shadow-md'
                      : 'border-gray-200 hover:border-green-200 hover:bg-green-50'
                  }`}
                >
                  {getTypeIcon('appliances', type)}
                  <span className="ml-2 capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</span>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usage Time (hours)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={usageTime}
                  onChange={(e) => setUsageTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow duration-200"
                  placeholder="Enter usage time"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Power Rating (kW)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={powerRating}
                  onChange={(e) => setPowerRating(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow duration-200"
                  placeholder="Enter power rating"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Calculate Appliance Emissions
            </button>
          </form>
        );

      case 'waste':
        return (
          <form onSubmit={(e) => handleSubmit(e, 'waste')} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {(Object.keys(EMISSION_FACTORS.waste) as WasteType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setWasteType(type)}
                  className={`flex items-center justify-center p-4 rounded-lg border transition-all duration-200 transform hover:scale-105 ${
                    wasteType === type
                      ? 'bg-green-50 border-green-500 text-green-700 shadow-md'
                      : 'border-gray-200 hover:border-green-200 hover:bg-green-50'
                  }`}
                >
                  {getTypeIcon('waste', type)}
                  <span className="ml-2 capitalize">{type}</span>
                </button>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity (kg)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={wasteQuantity}
                onChange={(e) => setWasteQuantity(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow duration-200"
                placeholder="Enter waste quantity"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Calculate Waste Emissions
            </button>
          </form>
        );

      case 'water':
        return (
          <form onSubmit={(e) => handleSubmit(e, 'water')} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {(Object.keys(EMISSION_FACTORS.water) as WaterType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setWaterType(type)}
                  className={`flex items-center justify-center p-4 rounded-lg border transition-all duration-200 transform hover:scale-105 ${
                    waterType === type
                      ? 'bg-green-50 border-green-500 text-green-700 shadow-md'
                      : 'border-gray-200 hover:border-green-200 hover:bg-green-50'
                  }`}
                >
                  {getTypeIcon('water', type)}
                  <span className="ml-2 capitalize">{type}</span>
                </button>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Water Usage (liters)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={waterUsage}
                onChange={(e) => setWaterUsage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow duration-200"
                placeholder="Enter water usage"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Calculate Water Emissions
            </button>
          </form>
        );

      case 'flight':
        return (
          <form onSubmit={(e) => handleSubmit(e, 'flight')} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {(Object.keys(EMISSION_FACTORS.flight) as FlightClass[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFlightClass(type)}
                  className={`flex items-center justify-center p-4 rounded-lg border transition-all duration-200 transform hover:scale-105 ${
                    flightClass === type
                      ? 'bg-green-50 border-green-500 text-green-700 shadow-md'
                      : 'border-gray-200 hover:border-green-200 hover:bg-green-50'
                  }`}
                >
                  {getTypeIcon('flight', type)}
                  <span className="ml-2 capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</span>
                </button>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flight Distance (km)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={flightDistance}
                onChange={(e) => setFlightDistance(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow duration-200"
                placeholder="Enter flight distance"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Calculate Flight Emissions
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">Welcome, {user?.username}!</h2>
              <p className="text-green-100 mt-2">{user?.email}</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Display total emissions and breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Overall Total Emissions</h3>
              <p className="text-3xl font-bold text-green-700">
                {totalEmissionData?.totalEmissions.toFixed(2) || '0.00'} kg CO2
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Transport Emissions</h3>
              <p className="text-3xl font-bold text-blue-700">
                {totalEmissionData?.totalTransportationEmission.toFixed(2) || '0.00'} kg CO2
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Energy Emissions</h3>
              <p className="text-3xl font-bold text-yellow-700">
                {totalEmissionData?.totalEnergyEmission.toFixed(2) || '0.00'} kg CO2
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Waste Emissions</h3>
              <p className="text-3xl font-bold text-red-700">
                {totalEmissionData?.totalWasteEmission.toFixed(2) || '0.00'} kg CO2
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Appliance Emissions</h3>
              <p className="text-3xl font-bold text-purple-700">
                {totalEmissionData?.totalAppliancesEmission.toFixed(2) || '0.00'} kg CO2
              </p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Water Emissions</h3>
              <p className="text-3xl font-bold text-indigo-700">
                {totalEmissionData?.totalWaterEmission.toFixed(2) || '0.00'} kg CO2
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Flight Emissions</h3>
              <p className="text-3xl font-bold text-pink-700">
                {totalEmissionData?.totalAirTravelEmission.toFixed(2) || '0.00'} kg CO2
              </p>
            </div>
          </div>

          {/* Emission category forms */}
          <div className="space-y-4">
            {Object.keys(EMISSION_FACTORS).map((category) => (
              <div
                key={category}
                className="border rounded-xl overflow-hidden transition-shadow duration-200 hover:shadow-md"
              >
                <button
                  onClick={() => setActiveCategory(activeCategory === category ? null : category as keyof EmissionFactors)}
                  className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-50 rounded-lg text-green-600">
                      {getCategoryIcon(category as keyof EmissionFactors)}
                    </div>
                    <span className="font-medium capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                  <div className="transform transition-transform duration-200">
                    {activeCategory === category ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </button>
                {activeCategory === category && (
                  <div className="p-4 border-t bg-gray-50">
                    {renderCategoryForm(category as keyof EmissionFactors)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <ResultSection emissionResult={emissionResult} />
    </div>
  );
}