import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';

const RULChart = () => {
  const [sensordata, setSensordata] = useState([]);
  const [rul, setRul] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get('http://localhost:5000/predict');
        console.log('API Response:', response.data);

        // Validate and update sensor data
        const new_data = response.data.s_data || [];
        console.log('Sensor Data:', new_data); // Log the sensor data
        setSensordata(new_data);

        // Validate and update RUL
        const new_rul = response.data.rul || 0;
        setRul(new_rul);

        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    console.log('Updated Sensor Data:', sensordata); // Log updated sensor data
  }, [sensordata]);

  const data = {
    labels: Array.from({ length: sensordata.length }, (_, i) => `sensor_${i + 1}`),
    datasets: [
      {
        label: 'Sensor data',
        data: sensordata,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        lineTension: 0.4,
      },
    ],
  };

  console.log('Chart Data:', data); // Log the chart data

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Live updation of data',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (sensordata.length === 0) {
    return <div className="text-center text-lg">No sensor data available.</div>;
  }

  return (
    <>
      <div className="flex justify-center items-center flex-col mt-4">
        <div className="p-2 bg-white rounded shadow" style={{ height: '550px', width: '700px' }}>
          <Line data={data} options={options} />
        </div>
        <div className="text-3xl font-bold">The RUL is: {rul}</div>
      </div>
    </>
  );
};

export default RULChart;