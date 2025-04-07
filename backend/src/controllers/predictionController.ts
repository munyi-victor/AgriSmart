import asyncHandler from 'express-async-handler';
import axios from 'axios';
import { aiReponse } from '../config/genai';

export const getPrediction = asyncHandler(async (req: any, res: any) => {
  const { temperature, humidity, rainfall } = req.body;

  if (temperature == null || humidity == null || rainfall == null) {
    return res.status(400).json({ error: 'Missing input parameters' });
  }

  const prediction: any = await axios.post('http://localhost:5000/recommend', {
    temperature,
    humidity,
    rainfall,
  });

  if (prediction) {
    return res.status(200).json(prediction.data.recommended_crops);
  } else {
    res.status(400).json({ Error: "Prediction failed" });
  }
});

export const getAIPlantProcedure = asyncHandler(async (req: any, res: any) => {
  const { crop } = req.params;

  if (!crop) {
    return res.status(400).json({ error: 'Crop name is required' });
  }

  try {
    const procedure = await aiReponse(`Give me a simple but detailed step by step procedure on how to plant ${crop} in Kenya, just the procedure, straight to the point, no introduction statement, no conclusion, no extra information, just the procedure.`);
    return res.status(200).json(procedure);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to get AI response', details: error.message });
  }
});