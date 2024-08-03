import express from "express";
import { webhook } from "../controllers/azure.controller";

const router = express.Router();

router.post("/storage/webhook", webhook);

export default router;
