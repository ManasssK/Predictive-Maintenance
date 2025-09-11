from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
from flask_cors import CORS
from openai import OpenAI  # Updated for the latest OpenAI library

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained RUL model
rul_model = joblib.load('rul_model.pkl')

# Load the trained XGBoost condition model
condition_model = joblib.load('xgb_condition_model.pkl')

# Load the merged CSV file into memory
merged_data = pd.read_csv('merged.csv')

# Initialize OpenAI client for DeepSeek API
client = OpenAI(
    api_key="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",  # Replace with your API key
    base_url="https://openrouter.ai/api/v1"  # Base URL for OpenRouter
)

# Route for RUL Prediction
@app.route('/predict', methods=['POST'])
def predict_rul():
    try:
        # Get input data from the request
        data = request.json
        features = np.array(data['features']).reshape(1, -1)

        # Predict RUL
        rul_prediction = rul_model.predict(features)[0]

        # Return the prediction
        return jsonify({'rul': rul_prediction})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Route for Engine Condition Prediction
@app.route('/predict-condition', methods=['POST'])
def predict_condition():
    try:
        # Receive input from frontend/POSTMAN
        data = request.json
        input_features = np.array(data['features']).reshape(1, -1)

        # Predict engine condition
        prediction = condition_model.predict(input_features)[0]

        # Return prediction result
        return jsonify({'condition': int(prediction)})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Route for DeepSeek Chatbot Integration
@app.route('/chat', methods=['POST'])
def chat():
    try:
        # Get user input and CSV data from the request
        data = request.json
        user_message = data.get('message', '')
        csv_data = data.get('csv_data', [])

        # Prepare the prompt for DeepSeek API
        prompt = f"""
        Analyze the following engine sensor data and answer the user's query.
        Sensor Data: {csv_data}
        User Query: {user_message}
        """

        # Call DeepSeek API
        completion = client.chat.completions.create(
            model="deepseek/deepseek-r1-zero:free",  # Specify the DeepSeek model
            messages=[
                {"role": "system", "content": "You are an expert in analyzing engine sensor data."},
                {"role": "user", "content": prompt},
            ]
        )

        # Extract and return the response
        response = completion.choices[0].message.content
        return jsonify({'response': response})

    except Exception as e:
        print("Error in chatbot processing:", str(e))
        return jsonify({'error': str(e)}), 400

# New Route: Search Data by Date
@app.route('/search', methods=['POST'])
def search_data():
    try:
        # Get date and time from the request
        data = request.json
        search_date = data.get('date')
        search_time = data.get('time', None)  # Optional time parameter

        # Filter the dataset based on date and optionally time
        if search_time:
            filtered_data = merged_data[
                (merged_data['DATES'] == search_date) & 
                (merged_data['TIME'] == search_time)
            ]
        else:
            filtered_data = merged_data[
                (merged_data['DATES'] == search_date)
            ]

        # Convert the filtered data to a dictionary and return
        if not filtered_data.empty:
            return jsonify(filtered_data.to_dict(orient='records'))
        else:
            return jsonify({'message': 'No data found for the given date and time.'}), 404

    except Exception as e:
        print("Error in search processing:", str(e))
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)