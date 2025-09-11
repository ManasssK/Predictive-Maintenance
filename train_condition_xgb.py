import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import seaborn as sns
import matplotlib.pyplot as plt

# Load your dataset
df = pd.read_csv('merged.csv')  # Adjust path as needed

# Features and target
X = df[['Engine rpm', 'Lub oil pressure', 'Fuel pressure',
        'Coolant pressure', 'lub oil temp', 'Coolant temp']]
y = df['Engine Condition']  # 0 = Good, 1 = Bad

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train the model
model = xgb.XGBClassifier(use_label_encoder=False, eval_metric='logloss')
model.fit(X_train, y_train)

# Predict and evaluate
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))

# Confusion matrix
cm = confusion_matrix(y_test, y_pred)
sns.heatmap(cm, annot=True, cmap="Blues", fmt='d', xticklabels=["Good", "Bad"], yticklabels=["Good", "Bad"])
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix - Engine Condition")
plt.show()

# Save the model
joblib.dump(model, 'xgb_condition_model.pkl')
print("Model saved as xgb_condition_model.pkl")
