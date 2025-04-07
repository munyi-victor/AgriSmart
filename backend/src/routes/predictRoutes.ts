import { Router } from "express";
import { getPrediction, getAIPlantProcedure } from "../controllers/predictionController";

const router = Router();

router.route("/recommend").post(getPrediction);
router.route("/plant-procedure/:crop").get(getAIPlantProcedure);

export default router;