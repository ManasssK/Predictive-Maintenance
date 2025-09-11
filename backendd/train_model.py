import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib

# Load the CSV file (replace 'merged.csv' with your actual file path)
data = pd.read_csv('../frontend/public/merged.csv')  # Adjust path if needed

# Features and target variable
X = data[['Engine rpm', 'Lub oil pressure', 'Fuel pressure', 'Coolant pressure', 'lub oil temp', 'Coolant temp']]
y = data['RUL']  # Assuming 'RUL' is a column in your CSV

# Train a Random Forest model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

# Save the trained model
joblib.dump(model, 'rul_model.pkl')
print("Model trained and saved as 'rul_model.pkl'")