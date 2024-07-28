import express from "express";
import { generateSasToken } from "../controllers/sasToken.controller";
import auth from "../middlewares/auth";

const router = express.Router();

router.get("/generate-upload-token", auth, generateSasToken);

export default router;
