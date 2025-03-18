from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler

# Load the trained model
model = tf.keras.models.load_model("crop_recommendation_model.h5")

# Load label encoder and scaler
label_classes = np.load("label_classes.npy", allow_pickle=True)
scaler_mean = np.load("scaler.npy", allow_pickle=True)

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get input data
        data = request.get_json()
        rainfall = data.get("rainfall")
        humidity = data.get("humidity")
        temperature = data.get("temperature")

        # Convert to numpy array and normalize
        input_features = np.array([[rainfall, humidity, temperature]])
        scaler = StandardScaler()
        scaler.mean_ = scaler_mean
        input_scaled = scaler.transform(input_features)

        # Make prediction
        predictions = model.predict(input_scaled)[0]

        # Get top 3 crops
        top_indices = predictions.argsort()[-3:][::-1]
        recommended_crops = [label_classes[i] for i in top_indices]

        return jsonify({"recommended_crops": recommended_crops})

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
