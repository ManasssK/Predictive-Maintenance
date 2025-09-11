import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line,
  ScatterChart, Scatter, ZAxis,
} from 'recharts';
import Papa from 'papaparse'; // For parsing CSV files

const Reports = () => {
  const [data, setData] = useState([]); // State to store parsed CSV data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [rulPredictions, setRulPredictions] = useState([]); // State for RUL predictions

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

        // Update state with parsed data
        const rows = parsedData.data;
        setData(rows);

        // Fetch RUL predictions for each row
        const predictions = await Promise.all(
          rows.map(async (row) => {
            const features = [
              parseFloat(row['Engine rpm']),
              parseFloat(row['Lub oil pressure']),
              parseFloat(row['Fuel pressure']),
              parseFloat(row['Coolant pressure']),
              parseFloat(row['lub oil temp']),
              parseFloat(row['Coolant temp']),
            ];

            const response = await fetch('http://localhost:5000/predict', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ features }),
            });

            const result = await response.json();
            return result.rul;
          })
        );

        setRulPredictions(predictions);
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

  // Helper function to calculate feature importance (mock calculation)
  const calculateFeatureImportance = () => {
    const fields = ['Engine rpm', 'Lub oil pressure', 'Fuel pressure', 'Coolant pressure', 'lub oil temp', 'Coolant temp'];
    return fields.map((field) => ({
      name: field,
      importance: Math.random(), // Replace with actual importance calculation if available
    }));
  };

  // Helper function to generate correlation heatmap data
  const generateCorrelationHeatmapData = () => {
    const fields = ['Engine rpm', 'Lub oil pressure', 'Fuel pressure', 'Coolant pressure'];
    const headerRow = ['Feature', ...fields];
    const rows = fields.map((field) => [
      field,
      ...fields.map(() => parseFloat((Math.random() * 2 - 1).toFixed(2))), // Random correlation values (-1 to 1)
    ]);
    return [headerRow, ...rows];
  };

  // Helper function to generate box plot data
  const generateBoxPlotData = () => {
    const fields = ['Engine rpm', 'Lub oil pressure', 'Fuel pressure', 'Coolant pressure'];
    return fields.flatMap((field) =>
      data.map((row, index) => ({
        group: field,
        value: parseFloat(row[field]),
        time: index * 5, // Time interval in seconds
      }))
    );
  };

  // Effects of Features on RUL Data
  const featureEffectsData = data.map((row, index) => ({
    time: index * 5, // Time interval in seconds
    pv: parseFloat(row['Lub oil pressure']), // Lub oil pressure (bar)
    uv: parseFloat(row['Engine rpm']), // Engine RPM (rpm)
    amt: parseFloat(row['Coolant pressure']), // Coolant pressure (bar)
  }));

  // RUL Chart Data
  const rulChartData = data.map((row, index) => ({
    time: index * 5, // Time interval in seconds
    rul: rulPredictions[index], // Remaining Useful Life (hours)
  }));

  // Summaries for Each Graph
  const summaries = {
    featureImportance:
      'This graph shows the importance of each sensor feature in predicting Remaining Useful Life (RUL).',
    correlationHeatmap:
      'This heatmap displays the correlation between different sensor readings. Strong correlations can indicate dependencies between features.',
    boxPlot:
      'This box plot shows the distribution of sensor values over time. Outliers may indicate anomalies or issues.',
    featureEffectsOnRUL:
      'This graph illustrates how various sensor readings affect the Remaining Useful Life (RUL). Changes in trends can signal potential failures.',
    rulPrediction:
      'This graph predicts the Remaining Useful Life (RUL) of the engine based on current sensor readings. A decreasing trend indicates wear and tear.',
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-pink-400 p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">MaintAI</div>
          <ul className="flex space-x-4">
            <li><a href="/dashboard" className="hover:text-gray-300 text-lg">Home</a></li>
            {/* <li><a href="/calender" className="hover:text-gray-300 text-lg">Calendar</a></li> */}
            <li><a href="/engine-prediction" className="hover:text-gray-300 text-lg">Machine Prediction</a></li>
            {/* <li><a href="/reports" className="hover:text-gray-300 text-lg">Reports</a></li> */}
            <li><a href="/profile" className="hover:text-gray-300 text-lg">Profile</a></li>
            <li><button className="hover:text-gray-300 text-lg">Logout</button></li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        {/* Section 1: Feature Importance */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4">Feature Importance</h2>
          <BarChart width={600} height={400} data={calculateFeatureImportance()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" label={{ value: 'Parameters', position: 'insideBottom', offset: -10,  }} />
            <YAxis label={{ value: 'Importance (Unitless)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="importance" fill="#8884d8" />
          </BarChart>
          <p className="mt-4 text-sm text-gray-600">{summaries.featureImportance}</p>
        </div>

        {/* Section 2: Correlation Heatmap */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4">Correlation Heatmap</h2>
          <table className="w-full">
            <tbody>
              {generateCorrelationHeatmapData().map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="p-2 text-center border">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-sm text-gray-600">{summaries.correlationHeatmap}</p>
        </div>

        {/* Section 3: Box Plot */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4">Box Plot</h2>
          <ScatterChart width={600} height={400} data={generateBoxPlotData()}>
            <CartesianGrid />
            <XAxis type="number" dataKey="time" name="Time" label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -5 }} />
            <YAxis type="number" dataKey="value" name="Value" label={{ value: 'RPM', angle: -90, position: 'insideLeft' }} />
            <ZAxis range={[100]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Box Plot Data" fill="#82ca9d" />
          </ScatterChart>
          <p className="mt-4 text-sm text-gray-600">{summaries.boxPlot}</p>
        </div>

        {/* Section 4: Effects of Features on RUL */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4">Effects of Features on RUL</h2>
          <LineChart width={600} height={400} data={featureEffectsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" label={{ position: 'insideBottom', offset: -10 }} />
            <YAxis label={{ value: 'RPM', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pv" stroke="#8884d8" name="Lub Oil Pressure (bar)" />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" name="Engine RPM (rpm)" />
          </LineChart>
          <p className="mt-4 text-sm text-gray-600">{summaries.featureEffectsOnRUL}</p>
        </div>

        {/* Section 5: RUL Prediction */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4">RUL Prediction</h2>
          <LineChart width={600} height={400} data={rulChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" label={{  position: 'insideBottom', offset: -10 }} />
            <YAxis label={{ value: 'Remaining Useful Life (hours)', angle: -90, position: 'insideMiddleRight' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="rul" stroke="red" name="RUL (hours)" />
          </LineChart>
          <p className="mt-4 text-sm text-gray-600">{summaries.rulPrediction}</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;