import React, { useState, useEffect } from 'react';
import Papa from 'papaparse'; // For parsing CSV files

const EnginePrediction = () => {
  const [formData, setFormData] = useState({
    rpm: '',
    lub_oil_pressure: '',
    fuel_pressure: '',
    coolant_pressure: '',
    lub_oil_temp: '',
    coolant_temp: ''
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [chatMessages, setChatMessages] = useState([]); // State to store chat messages
  const [userInput, setUserInput] = useState(''); // State for user input in chatbot
  const [csvData, setCsvData] = useState([]); // State to store parsed CSV data
  const [searchInput, setSearchInput] = useState({ date: '', time: '' }); // State for search inputs
  const [searchResult, setSearchResult] = useState(null); // State for search results

  // Load and parse the CSV file
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/merged.csv'); // Ensure the file is in the public folder
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const csvText = await response.text();
        const parsedData = Papa.parse(csvText, {
          header: true, // Assumes the CSV has headers
          skipEmptyLines: true,
        });
        if (parsedData.errors.length > 0) {
          throw new Error('Error parsing CSV file');
        }
        setCsvData(parsedData.data); // Update state with parsed data
      } catch (err) {
        console.error('Error fetching or parsing CSV data:', err);
      }
    };
    fetchData();
  }, []);

  // Handle form input changes for prediction
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle prediction submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://127.0.0.1:5000/predict-condition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          features: [
            parseFloat(formData.rpm),
            parseFloat(formData.lub_oil_pressure),
            parseFloat(formData.fuel_pressure),
            parseFloat(formData.coolant_pressure),
            parseFloat(formData.lub_oil_temp),
            parseFloat(formData.coolant_temp)
          ]
        })
      });

      const data = await response.json();
      if (data.condition !== undefined) {
        setResult(data.condition === 0 ? 'Good' : 'Bad');
      } else {
        setError('Prediction failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Server error: ' + err.message);
    }
  };

  // Handle chatbot input submission
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (userInput.trim() === '') return;

    try {
      // Send user input and CSV data to the backend
      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userInput,
          csv_data: csvData,
        }),
      });

      const data = await response.json();
      if (data.response) {
        // Add user message and bot response to chat history
        setChatMessages([
          ...chatMessages,
          { sender: 'user', text: userInput },
          { sender: 'bot', text: data.response },
        ]);
      } else {
        setError('Chatbot response failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Chatbot server error: ' + err.message);
    }

    // Clear input field
    setUserInput('');
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchInput({ ...searchInput, [e.target.name]: e.target.value });
  };

  // Handle search submission
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSearchResult(null);

    try {
      const response = await fetch('http://127.0.0.1:5000/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: searchInput.date,
          time: searchInput.time
        }),
      });

      const data = await response.json();
      if (response.status === 404) {
        setError(data.message || 'No data found for the given date and time.');
      } else {
        setSearchResult(data);
      }
    } catch (err) {
      console.error(err);
      setError('Server error: ' + err.message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-pink-400 p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">MaintAI</div>
          <ul className="flex space-x-4">
            <li><a href="/dashboard" className="hover:text-gray-300 text-lg">Home</a></li>
            <li><a href="/reports" className="hover:text-gray-300 text-lg">Reports</a></li>
            <li><a href="/profile" className="hover:text-gray-300 text-lg">Profile</a></li>
            <li><button className="hover:text-gray-300 text-lg">Logout</button></li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
        {/* First Column: Engine Condition Prediction */}
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Engine Condition Prediction</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              name="rpm"
              type="number"
              placeholder="Engine RPM"
              value={formData.rpm}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              name="lub_oil_pressure"
              type="number"
              placeholder="Lub Oil Pressure"
              value={formData.lub_oil_pressure}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              name="fuel_pressure"
              type="number"
              placeholder="Fuel Pressure"
              value={formData.fuel_pressure}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              name="coolant_pressure"
              type="number"
              placeholder="Coolant Pressure"
              value={formData.coolant_pressure}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              name="lub_oil_temp"
              type="number"
              placeholder="Lub Oil Temp"
              value={formData.lub_oil_temp}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              name="coolant_temp"
              type="number"
              placeholder="Coolant Temp"
              value={formData.coolant_temp}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <div className="col-span-2">
              <button
                type="submit"
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded w-full"
              >
                Predict
              </button>
            </div>
          </form>

          {result && (
            <div className="mt-6 text-center text-xl font-semibold">
              Predicted Engine Condition:{' '}
              <span className={result === 'Good' ? 'text-green-600' : 'text-red-600'}>
                {result}
              </span>
            </div>
          )}

          {error && (
            <div className="mt-4 text-center text-red-500">{error}</div>
          )}
        </div>

        {/* Second Column: Chatbot */}
        <div className="p-6 bg-white shadow-lg rounded-lg h-[600px] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Chatbot</h2>
          <div className="mb-4">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded ${
                  msg.sender === 'user' ? 'bg-blue-200 self-end' : 'bg-gray-200 self-start'
                }`}
              >
                <strong>{msg.sender === 'user' ? 'You:' : 'Bot:'}</strong> {msg.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleChatSubmit} className="flex">
            <input
              type="text"
              placeholder="Ask about your engine..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-grow border p-2 rounded-l"
            />
            <button
              type="submit"
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-r"
            >
              Send
            </button>
          </form>
        </div>

        {/* Third Column: Search by Date and Time */}
        <div className="p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Search Data by Date and Time</h2>
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-2 gap-4">
            <input
              name="date"
              type="text"
              placeholder="Enter Date (DD-MM-YYYY)"
              value={searchInput.date}
              onChange={handleSearchChange}
              className="border p-2 rounded"
              required
            />
            <input
              name="time"
              type="text"
              placeholder="Enter Time (HH:MM:SS)"
              value={searchInput.time}
              onChange={handleSearchChange}
              className="border p-2 rounded"
              required
            />
            <div className="col-span-2">
              <button
                type="submit"
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded w-full"
              >
                Search
              </button>
            </div>
          </form>

          {searchResult && (
  <div className="mt-4">
    <h3 className="text-lg font-bold text-center">Search Results:</h3>
    <table className="w-full border-collapse mt-2">
      <tbody>
        {Array.isArray(searchResult) ? (
          // If searchResult is an array, iterate over each item
          searchResult.map((item, index) => (
            Object.entries(item).map(([key, value]) => (
              <tr key={`${index}-${key}`} className="border-b">
                <td className="py-2 px-4 font-medium text-left">{key}</td>
                <td className="py-2 px-4 text-left">{value}</td>
              </tr>
            ))
          ))
        ) : (
          // If searchResult is an object, iterate over its keys
          Object.entries(searchResult).map(([key, value]) => (
            <tr key={key} className="border-b">
              <td className="py-2 px-4 font-medium text-left">{key}</td>
              <td className="py-2 px-4 text-left">{value}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
)}

          {error && (
            <div className="mt-4 text-center text-red-500">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnginePrediction;