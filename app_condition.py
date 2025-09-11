from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load your trained XGBoost model
model = joblib.load('xgb_condition_model.pkl')

@app.route('/predict-condition', methods=['POST'])
def predict_condition():
    try:
        # Receive input from frontend/POSTMAN
        data = request.json
        print("Input Data:", data)

        # Extract features from JSON
        input_features = np.array(data['features']).reshape(1, -1)

        # Predict engine condition
        prediction = model.predict(input_features)[0]
        print("Predicted Condition:", prediction)

        # Return prediction result
        return jsonify({'condition': int(prediction)})
    
    except Exception as e:
        print("Error:", str(e))
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
