from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

model = joblib.load('crop_recommendation_model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    N = data['N']
    P = data['P']
    K = data['K']
    temperature = data['temperature']
    humidity = data['humidity']
    ph = data['ph']
    rainfall = data['rainfall']

    input_data = np.array([[N, P, K, temperature, humidity, ph, rainfall]])
    prediction = model.predict(input_data)

    return jsonify({'prediction': prediction.tolist()})


@app.route('/getdata', methods=['GET'])
def getdata():
    return jsonify({"hello world":"hello sir"})


if __name__ == '__main__':
    app.run(port=5000, debug=True)
