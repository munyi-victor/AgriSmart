# predict_api.py (or app.py - choose one name)
from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# Load the trained model
try:
    model = joblib.load("crop_model.joblib")
except FileNotFoundError:
    print("Error: Model file not found. Please train the model first.")
    model = None

@app.route('/recommend', methods=['POST'])
def predict_crop():
    """Predicts crop recommendations based on input data."""
    if model is None:
        return jsonify({"error": "Model not loaded. Train the model first."}), 500

    try:
        data = request.get_json()
        rainfall = data['Rainfall']
        humidity = data['Humidity']
        temperature = data['Temperature']
        ph = data['pH']

        input_data = pd.DataFrame([[rainfall, humidity, temperature, ph]], columns=['Rainfall', 'Humidity', 'Temperature', 'pH'])

        probabilities = model.predict_proba(input_data)[0]
        top_crops_indices = probabilities.argsort()[-3:][::-1]  # Get indices of top 3 probabilities
        top_crops = [model.classes_[i] for i in top_crops_indices]

        return jsonify({"recommended_crops": top_crops})

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)