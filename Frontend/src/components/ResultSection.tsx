// This could be placed in a file like ResultSection.tsx
import React from 'react';
import { EmissionResult } from '../types/emissionTypes';

interface ResultSectionProps {
  emissionResult: EmissionResult | null;
}

const ResultSection: React.FC<ResultSectionProps> = ({ emissionResult }) => {
  if (!emissionResult) return null;
  else console.log("emissionResult:",emissionResult);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mt-8">
      <h3 className="text-2xl font-bold mb-4 text-green-700">Your Emission Calculation Results</h3>
      <p className="mb-6 text-gray-600">
        Here are the emissions calculated based on your recent inputs. Review the breakdown below for details.
        console.log(emissionResult)
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {emissionResult.transport && emissionResult.transport.transportation && (
          <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold text-green-800 mb-2">Transport Emissions</h4>
            <p className="text-2xl font-bold text-green-700">
              {emissionResult.transport.transportation.emissions?.toFixed(2)} kg CO2
            </p>
            <p className="text-sm text-gray-600 mt-2">Calculated on: {emissionResult.transport.transportation.date}</p>
          </div>
        )}

        {emissionResult.energy && (
          <div className="p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold text-yellow-800 mb-2">Energy Emissions</h4>
            <p className="text-2xl font-bold text-yellow-700">
              {emissionResult.energy.emissions?.toFixed(2)} kg CO2
            </p>
            <p className="text-sm text-gray-600 mt-2">Calculated on: {emissionResult.energy.date}</p>
          </div>
        )}
        {emissionResult.waste && (
          <div className="p-4 bg-gradient-to-br from-red-100 to-red-200 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold text-red-800 mb-2">Waste Emissions</h4>
            <p className="text-2xl font-bold text-red-700">
              {emissionResult.waste.emissions?.toFixed(2)} kg CO2
            </p>
            <p className="text-sm text-gray-600 mt-2">Calculated on: {emissionResult.waste.date}</p>
          </div>
        )}
        {emissionResult.appliances && (
          <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold text-purple-800 mb-2">Appliance Emissions</h4>
            <p className="text-2xl font-bold text-purple-700">
              {emissionResult.appliances.emissions?.toFixed(2)} kg CO2
            </p>
            <p className="text-sm text-gray-600 mt-2">Calculated on: {emissionResult.appliances.date}</p>
          </div>
        )}
        {emissionResult.water && (
          <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold text-blue-800 mb-2">Water Emissions</h4>
            <p className="text-2xl font-bold text-blue-700">
              {emissionResult.water.emissions?.toFixed(2)} kg CO2
            </p>
            <p className="text-sm text-gray-600 mt-2">Calculated on: {emissionResult.water.date}</p>
          </div>
        )}
        {emissionResult.flight && (
          <div className="p-4 bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold text-pink-800 mb-2">Flight Emissions</h4>
            <p className="text-2xl font-bold text-pink-700">
              {emissionResult.flight.emissions?.toFixed(2)} kg CO2
            </p>
            <p className="text-sm text-gray-600 mt-2">Calculated on: {emissionResult.flight.date}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultSection;