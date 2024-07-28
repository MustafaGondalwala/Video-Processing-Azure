import express from "express";
import { register, login, getUser } from "../controllers/user.controller";
import auth from "../middlewares/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getUser);

export default router;
