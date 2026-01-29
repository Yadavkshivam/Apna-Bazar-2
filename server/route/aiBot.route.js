import express from "express";
import { askBot } from "../controllers/aiBotController.js";

const router = express.Router();

router.post("/ask", askBot);

export default router;
