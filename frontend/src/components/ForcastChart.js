import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import Papa from 'papaparse'; // For parsing CSV files

const ForcastChart = () => {
  // State variables
  const [engineRpm, setEngineRpm] = useState([]); // Engine RPM data
  const [lubOilPressure, setLubOilPressure] = useState([]); // Lubrication Oil Pressure data
  const [fuelPressure, setFuelPressure] = useState([]); // Fuel Pressure data
  const [coolantPressure, setCoolantPressure] = useState([]); // Coolant Pressure data
  const [lubOilTemp, setLubOilTemp] = useState([]); // Lubrication Oil Temperature data
  const [coolantTemp, setCoolantTemp] = useState([]); // Coolant Temperature data
  const [engineCondition, setEngineCondition] = useState([]); // Engine Condition data
  const [error, setError] = useState(null); // For error handling
  const [loading, setLoading] = useState(true); // For loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch the CSV file from the public folder
        const response = await fetch('/merged.csv'); // Ensure the file is in the public folder

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const csvText = await response.text();

        // Parse the CSV file using PapaParse
        const parsedData = Papa.parse(csvText, {
          header: true, // Assumes the CSV has headers
          skipEmptyLines: true,
        });

        if (parsedData.errors.length > 0) {
          throw new Error('Error parsing CSV file');
        }

        const rows = parsedData.data;

        // Extract data for each field from the CSV
        const engineRpmArray = rows.map((row) => parseFloat(row['Engine rpm']));
        const lubOilPressureArray = rows.map((row) => parseFloat(row['Lub oil pressure']));
        const fuelPressureArray = rows.map((row) => parseFloat(row['Fuel pressure']));
        const coolantPressureArray = rows.map((row) => parseFloat(row['Coolant pressure']));
        const lubOilTempArray = rows.map((row) => parseFloat(row['lub oil temp']));
        const coolantTempArray = rows.map((row) => parseFloat(row['Coolant temp']));
        const engineConditionArray = rows.map((row) => parseFloat(row['Engine Condition']));

        // Update state with parsed data
        setEngineRpm(engineRpmArray);
        setLubOilPressure(lubOilPressureArray);
        setFuelPressure(fuelPressureArray);
        setCoolantPressure(coolantPressureArray);
        setLubOilTemp(lubOilTempArray);
        setCoolantTemp(coolantTempArray);
        setEngineCondition(engineConditionArray);

        setError(null);
      } catch (err) {
        console.error('Error fetching or parsing CSV data:', err);
        setError('Failed to load data from CSV. Please check the file.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  // Helper function to create chart data
  const INTERVAL = 5; // Time interval in seconds
  const createChartData = (data, label, borderColor, backgroundColor) => ({
    labels: Array.from({ length: data.length }, (_, i) => `${i*INTERVAL} sec`), // Time periods
    datasets: [
      {
        label,
        data,
        backgroundColor,
        borderColor,
        borderWidth: 4,
        lineTension: 0.4,
      },
    ],
  });

  // Chart options with X-axis and Y-axis labels
  const getChartOptions = (yAxisLabel) => ({
    plugins: {
      title: {
        display: true,
        text: 'Engine Sensor Data',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time Period', // X-axis label
        },
      },
      y: {
        title: {
          display: true,
          text: yAxisLabel, // Y-axis label
        },
        beginAtZero: false,
        grid: {
          color: (context) => (context.tick.value === 40 ? 'red' : 'rgba(0, 0, 0, 0.1)'),
        },
      },
    },
    animation: {
      duration: 0, // Disable animations for smoother updates
    },
  });

  const containerStyle = {
    minWidth: '700px',
    minHeight: '56px',
    marginBottom: '1rem', // Adjust as needed
  };

  // Summary Descriptions for Each Graph
  const summaries = {
    engineRpm:
      'This graph shows the Engine RPM over time. A consistent increase in RPM may indicate higher stress on the engine.',
    lubOilPressure:
      'This graph displays Lubrication Oil Pressure. Low pressure may suggest oil leaks or pump issues.',
    fuelPressure:
      'This graph tracks Fuel Pressure. Fluctuations or drops in pressure can indicate fuel system problems.',
    coolantPressure:
      'This graph monitors Coolant Pressure. Sudden changes may signal cooling system malfunctions.',
    lubOilTemp:
      'This graph shows Lubrication Oil Temperature. High temperatures can lead to increased wear and tear.',
    coolantTemp:
      'This graph tracks Coolant Temperature. Elevated temperatures may indicate overheating risks.',
  };

  return (
    <>
      <div className="flex justify-center items-center flex-col">
        {/* Engine RPM Chart */}
        <div className="flex justify-between items-center flex-col mt-4">
          <div className="font-bold text-3xl text-center">Engine RPM</div>
          <div className="p-2 bg-white rounded shadow" style={containerStyle}>
            <Line
              data={createChartData(engineRpm, 'Engine RPM', 'blue', 'rgba(75, 192, 192, 0.2)')}
              options={getChartOptions('RPM')} // Y-axis label
            />
          </div>
          <div className="text-gray-600 text-sm mt-2 text-center">{summaries.engineRpm}</div>
        </div>

        {/* Lubrication Oil Pressure Chart */}
        <div className="flex justify-between items-center flex-col mt-4">
          <div className="font-bold text-3xl text-center">Lubrication Oil Pressure</div>
          <div className="p-2 bg-white rounded shadow" style={containerStyle}>
            <Line
              data={createChartData(
                lubOilPressure,
                'Lubrication Oil Pressure',
                'purple',
                'rgba(153, 102, 255, 0.2)'
              )}
              options={getChartOptions('Pressure (psi)')} // Y-axis label
            />
          </div>
          <div className="text-gray-600 text-sm mt-2 text-center">{summaries.lubOilPressure}</div>
        </div>

        {/* Fuel Pressure Chart */}
        <div className="flex justify-between items-center flex-col mt-4">
          <div className="font-bold text-3xl text-center">Fuel Pressure</div>
          <div className="p-2 bg-white rounded shadow" style={containerStyle}>
            <Line
              data={createChartData(fuelPressure, 'Fuel Pressure', 'green', 'rgba(75, 192, 192, 0.2)')}
              options={getChartOptions('Pressure (psi)')} // Y-axis label
            />
          </div>
          <div className="text-gray-600 text-sm mt-2 text-center">{summaries.fuelPressure}</div>
        </div>

        {/* Coolant Pressure Chart */}
        <div className="flex justify-between items-center flex-col mt-4">
          <div className="font-bold text-3xl text-center">Coolant Pressure</div>
          <div className="p-2 bg-white rounded shadow" style={containerStyle}>
            <Line
              data={createChartData(
                coolantPressure,
                'Coolant Pressure',
                'orange',
                'rgba(255, 159, 64, 0.2)'
              )}
              options={getChartOptions('Pressure (psi)')} // Y-axis label
            />
          </div>
          <div className="text-gray-600 text-sm mt-2 text-center">{summaries.coolantPressure}</div>
        </div>

        {/* Lubrication Oil Temperature Chart */}
        <div className="flex justify-between items-center flex-col mt-4">
          <div className="font-bold text-3xl text-center">Lubrication Oil Temperature</div>
          <div className="p-2 bg-white rounded shadow" style={containerStyle}>
            <Line
              data={createChartData(lubOilTemp, 'Lubrication Oil Temperature', 'red', 'rgba(255, 99, 132, 0.2)')}
              options={getChartOptions('Temperature (°C)')} // Y-axis label
            />
          </div>
          <div className="text-gray-600 text-sm mt-2 text-center">{summaries.lubOilTemp}</div>
        </div>

        {/* Coolant Temperature Chart */}
        <div className="flex justify-between items-center flex-col mt-4">
          <div className="font-bold text-3xl text-center">Coolant Temperature</div>
          <div className="p-2 bg-white rounded shadow" style={containerStyle}>
            <Line
              data={createChartData(coolantTemp, 'Coolant Temperature', 'brown', 'rgba(139, 69, 19, 0.2)')}
              options={getChartOptions('Temperature (°C)')} // Y-axis label
            />
          </div>
          <div className="text-gray-600 text-sm mt-2 text-center">{summaries.coolantTemp}</div>
        </div>

        {/* Engine Condition */}
        {/* <div className="text-3xl font-bold mt-4">
          Engine Condition: {engineCondition[engineCondition.length - 1]}
        </div> */}
      </div>
    </>
  );
};

export default ForcastChart;