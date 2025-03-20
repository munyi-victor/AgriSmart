# app.py

from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load the trained model
MODEL_PATH = "crop_recommendation_model.pkl"
model = joblib.load(MODEL_PATH)

@app.route('/recommend', methods=['POST'])
def recommend_crops():
    try:
        # Get input data from the request
        data = request.json
        temperature = data.get('temperature')
        humidity = data.get('humidity')
        rainfall = data.get('rainfall')

        # Validate input
        if None in [temperature, humidity, rainfall]:
            return jsonify({"error": "Missing input parameters"}), 400

        # Prepare input for prediction
        input_data = np.array([[temperature, humidity, rainfall]])

        # Predict probabilities and get top 3 crops
        probabilities = model.predict_proba(input_data)[0]
        top_3_indices = probabilities.argsort()[-3:][::-1]
        top_3_crops = [model.classes_[i] for i in top_3_indices]

        # Return the recommendations
        return jsonify({
            "recommended_crops": top_3_crops,
            "message": "Crop recommendations generated successfully."
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)