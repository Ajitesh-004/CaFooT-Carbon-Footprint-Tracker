import React, { useState, useEffect, useCallback } from "react";
import {
  transportationState,
  energyState,
  applianceState,
  wasteState,
  waterState,
  airTravelState,
  totalEmissionsState,
} from "../atoms/atoms";
import { Header } from "../components/Header";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { format } from "date-fns";
import {
  Card,
  Grid,
  Typography,
  Select,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
  Tooltip as MuiTooltip,
  IconButton,
  useTheme,
  LinearProgress,
} from "@mui/material";
import {
  LocalShipping,
  Bolt,
  Kitchen,
  Delete,
  WaterDrop,
  Flight,
  Info,
} from "@mui/icons-material";
import { useRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";

type TotalEmission = {
  totalTransportationEmission: number;
  totalEnergyEmission: number;
  totalWasteEmission: number;
  totalAppliancesEmission: number;
  totalWaterEmission: number;
  totalAirTravelEmission: number;
  totalEmissions: number;
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label, chartType }: any) => {
  const theme = useTheme();

  // Check if the tooltip is active and payload is defined and not empty
  if (!active || !payload || payload.length === 0) return null;

  return (
    <Card sx={{ p: 2, bgcolor: "background.paper", fontSize: theme.breakpoints.down('sm') ? '0.8rem' : '1rem' }}>
      <Typography variant="subtitle2">
        {chartType === 'pie' ? payload[0].name : label}
      </Typography>
      <Typography>
        {`${payload[0].value.toFixed(2)} kg CO₂`}
      </Typography>
    </Card>
  );
};

// Color generator for consistent category colors
const getCategoryColor = (index: number, theme: any) => [
  theme.palette.primary.main,
  theme.palette.secondary.main,
  theme.palette.error.main,
  theme.palette.warning.main,
  theme.palette.info.main,
  theme.palette.success.main,
][index % 6];

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [sortBy, setSortBy] = useState<Record<string, string>>({
    transportation: "date",
    energy: "date",
    appliance: "date",
    waste: "date",
    water: "date",
    airTravel: "date",
    totalEmissions: "date",
  });

  // State for chart type selection
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");

  // Recoil state management
  const [user] = useRecoilState(userAtom);
  const [totalEmissionData, setTotalEmissionData] = useState<TotalEmission | null>(null);
  const [transportationData, setTransportationData] = useRecoilState(transportationState);
  const [energyData, setEnergyData] = useRecoilState(energyState);
  const [applianceData, setApplianceData] = useRecoilState(applianceState);
  const [wasteData, setWasteData] = useRecoilState(wasteState);
  const [waterData, setWaterData] = useRecoilState(waterState);
  const [airTravelData, setAirTravelData] = useRecoilState(airTravelState);
  const [, setTotalEmissions] = useRecoilState(totalEmissionsState);
  const [loading, setLoading] = useState(true);

  // Fetch total emissions
  useEffect(() => {
    const fetchTotalEmissions = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(`https://cafoot-backend.onrender.com/api/totalemission/gettotalemission/?userId=${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch total emissions');
        const data: TotalEmission = await response.json();
        setTotalEmissionData(data);
      } catch (error) {
        console.error('Error fetching total emissions:', error);
      }
    };

    fetchTotalEmissions();
  }, [user]);

  const isNewUser = !totalEmissionData?.totalEmissions;

  // Fetch data for a specific category
  const fetchData = useCallback(async (endpoint: string, sortKey: string) => {
    try {
      const response = await fetch(`https://cafoot-backend.onrender.com/api/${endpoint}?userId=${user?.id}&sortBy=${sortKey}`);
      if (!response.ok) throw new Error(`Failed to fetch data from ${endpoint}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      return [];
    }
  }, [user?.id]);

  // Fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [
          transport,
          energy,
          appliances,
          waste,
          water,
          airTravel,
          totals,
        ] = await Promise.all([
          fetchData("transport/transportationemission", sortBy.transportation),
          fetchData("energy/energyemission", sortBy.energy),
          fetchData("appliance/applianceemission", sortBy.appliance),
          fetchData("waste/wasteemission", sortBy.waste),
          fetchData("water/wateremission", sortBy.water),
          fetchData("airtravel/airTravelemission", sortBy.airTravel),
          fetchData("totalemission/totalEmissions", sortBy.totalEmissions),
        ]);

        setTransportationData(transport);
        setEnergyData(energy);
        setApplianceData(appliances);
        setWasteData(waste);
        setWaterData(water);
        setAirTravelData(airTravel);
        setTotalEmissions(totals);
      } catch (error) {
        console.error('Error fetching all data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [
    fetchData,
    sortBy.transportation,
    sortBy.energy,
    sortBy.appliance,
    sortBy.waste,
    sortBy.water,
    sortBy.airTravel,
    sortBy.totalEmissions,
    setTransportationData,
    setEnergyData,
    setApplianceData,
    setWasteData,
    setWaterData,
    setAirTravelData,
    setTotalEmissions,
  ]);

  // Data processing functions
  const createLineData = useCallback((data: any[]) => {
    if (!data || !Array.isArray(data)) return [];

    // Group emissions by date and sum them up
    const groupedByDate = data.reduce((acc: any, curr: any) => {
      const date = format(new Date(curr.date), "MMM d");
      acc[date] = (acc[date] || 0) + (curr.emissions || 0);
      return acc;
    }, {});

    return Object.entries(groupedByDate).map(([date, emissions]) => ({
      date,
      emissions: parseFloat((emissions as number).toFixed(2)),
    }));
  }, []);

  const createGroupedData = useCallback((data: any[], property: string) => {
    if (!data || !Array.isArray(data)) return [];

    const grouped = data.reduce((acc: any, curr: any) => {
      const key = curr[property];
      if (key) {
        acc[key] = (acc[key] || 0) + (curr.emissions || 0);
      }
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value: parseFloat((value as number).toFixed(2)),
    }));
  }, []);

  // Ensure all categories are included in the data
  const ensureAllCategories = (data: any[], categories: string[]) => {
    const categoryMap = new Map(data.map(item => [item.name, item.value]));
    return categories.map(category => ({
      name: category,
      value: categoryMap.get(category) || 0,
    }));
  };

  // EmissionSection component
  const EmissionSection = ({ title, explanation, chartType, data }: any) => (
    <Card sx={{ p: 2, height: { xs: 300, md: 400 }, overflow: 'hidden' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {explanation}
      </Typography>

      {loading ? (
        <Box sx={{ height: '80%', display: 'flex', alignItems: 'center' }}>
          <LinearProgress sx={{ width: '100%' }} />
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height="80%">
          {chartType === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis dataKey="date" tick={{ fontSize: theme.breakpoints.down('sm') ? 10 : 12 }} />
              <YAxis tick={{ fontSize: theme.breakpoints.down('sm') ? 10 : 12 }} />
              <Tooltip content={<CustomTooltip chartType="line" />} />
              <Line type="monotone" dataKey="emissions" stroke={theme.palette.primary.main} strokeWidth={2} />
            </LineChart>
          ) : chartType === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis
                dataKey="name"
                // Rotate the labels on small screens
                angle={0}
                tick={{
                  fontSize: theme.breakpoints.down("sm") ? 10 : 12,
                }}
                // Format the tick labels (e.g., capitalize first letter)
                tickFormatter={(value: string) =>
                  value.charAt(0).toUpperCase() + value.slice(1)
                }
              />
              <YAxis tick={{ fontSize: theme.breakpoints.down("sm") ? 10 : 12 }} />
              <Tooltip content={<CustomTooltip chartType="bar" />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((_entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={getCategoryColor(index, theme)} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={theme.breakpoints.down('sm') ? 80 : 120}
                minAngle={1}
                paddingAngle={1}
              >
                {data.map((_entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getCategoryColor(index, theme)}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip chartType="pie" />} />
              <Legend wrapperStyle={{ paddingTop: 20 }} />
            </PieChart>
          )}
        </ResponsiveContainer>
      )}
    </Card>
  );

  // Render section for each emission type
  const renderSection = (
    title: string,
    data: any[],
    sortKey: string,
    setSortKey: (key: string) => void,
    groupProperty: string,
    icon: JSX.Element,
    categories: string[]
  ) => {
    // Only render the section if there is data
    if (!data || data.length === 0) return null;
  
    const groupedData = ensureAllCategories(
      createGroupedData(data, groupProperty),
      categories
    );
  
    return (
      <Grid item xs={12}>
        <Box sx={{ p: { xs: 1, md: 3 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            {icon}
            <Typography variant="h6" fontWeight="600">
              {title}
            </Typography>
            <MuiTooltip title={`Detailed ${title} analysis`}>
              <IconButton size="small">
                <Info fontSize="small" />
              </IconButton>
            </MuiTooltip>
          </Box>
  
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Sort By</InputLabel>
            <Select value={sortKey} onChange={(e) => setSortKey(e.target.value)} label="Sort By">
              {["date", "emissions"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option.replace(/([A-Z])/g, " $1")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
  
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Chart Type</InputLabel>
            <Select value={chartType} onChange={(e) => setChartType(e.target.value as "pie" | "bar")} label="Chart Type">
              <MenuItem value="pie">Pie Chart</MenuItem>
              <MenuItem value="bar">Bar Chart</MenuItem>
            </Select>
          </FormControl>
  
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <EmissionSection
                title={`${title} Trend`}
                chartType="line"
                data={createLineData(data)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <EmissionSection
                title={`${title} Distribution`}
                chartType={chartType}
                data={groupedData}
              />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    );
  };

  // Define categories for each section
  const transportCategories = ["car", "bus", "train", "bike"];
  const energyCategories = ["grid", "renewable"];
  const applianceCategories = ["airConditioner", "refrigerator", "washingMachine", "dishwasher", "tv", "computer"];
  const wasteCategories = ["general", "recycling", "composting"];
  const waterCategories = ["hot", "cold"];
  const airTravelCategories = ["Economy", "Business", "FirstClass"];

  return (
    <Box sx={{ p: { xs: 1, md: 4 }, '& .recharts-surface': { overflow: 'visible' } }}>
      <Header />
      {isNewUser ? (
        <Card sx={{ p: 4, textAlign: "center", bgcolor: theme.palette.primary.light }}>
          <Typography variant="h4" gutterBottom color="primary">
            Welcome to CarbonTrack! 🌱
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Get started by adding your first emission source
          </Typography>
        </Card>
      ) : (
        <>
          <Card sx={{ mb: 4, p: { xs: 1, md: 2 } }}>
            <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
              Overall Emission Distribution
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary" gutterBottom>
              A breakdown of your carbon footprint by category
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={Object.entries({
                    transportation: totalEmissionData?.totalTransportationEmission || 0,
                    energy: totalEmissionData?.totalEnergyEmission || 0,
                    appliance: totalEmissionData?.totalAppliancesEmission || 0,
                    waste: totalEmissionData?.totalWasteEmission || 0,
                    water: totalEmissionData?.totalWaterEmission || 0,
                    airTravel: totalEmissionData?.totalAirTravelEmission || 0,
                  }).map(([category, value]) => ({
                    category: category.charAt(0).toUpperCase() + category.slice(1),
                    value: parseFloat(value.toFixed(2)),
                  }))}
                  dataKey="value"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {Object.entries({
                    transportation: totalEmissionData?.totalTransportationEmission || 0,
                    energy: totalEmissionData?.totalEnergyEmission || 0,
                    appliance: totalEmissionData?.totalAppliancesEmission || 0,
                    waste: totalEmissionData?.totalWasteEmission || 0,
                    water: totalEmissionData?.totalWaterEmission || 0,
                    airTravel: totalEmissionData?.totalAirTravelEmission || 0,
                  }).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={getCategoryColor(index, theme)} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip chartType="pie" />} />
                <Legend wrapperStyle={{ paddingTop: 20 }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
  
          {renderSection(
            "Transportation Emissions",
            transportationData,
            sortBy.transportation,
            (v) => setSortBy(p => ({ ...p, transportation: v })),
            "transportType",
            <LocalShipping />,
            transportCategories
          )}
          {renderSection(
            "Energy Consumption",
            energyData,
            sortBy.energy,
            (v) => setSortBy(p => ({ ...p, energy: v })),
            "energyType",
            <Bolt />,
            energyCategories
          )}
          {renderSection(
            "Appliance Usage",
            applianceData,
            sortBy.appliance,
            (v) => setSortBy(p => ({ ...p, appliance: v })),
            "applianceType",
            <Kitchen />,
            applianceCategories
          )}
          {renderSection(
            "Waste Management",
            wasteData,
            sortBy.waste,
            (v) => setSortBy(p => ({ ...p, waste: v })),
            "wasteType",
            <Delete />,
            wasteCategories
          )}
          {renderSection(
            "Water Usage",
            waterData,
            sortBy.water,
            (v) => setSortBy(p => ({ ...p, water: v })),
            "waterType",
            <WaterDrop />,
            waterCategories
          )}
          {renderSection(
            "Air Travel Emissions",
            airTravelData,
            sortBy.airTravel,
            (v) => setSortBy(p => ({ ...p, airTravel: v })),
            "travelClass",
            <Flight />,
            airTravelCategories
          )}
        </>
      )}
    </Box>
  );
};

export default Dashboard;