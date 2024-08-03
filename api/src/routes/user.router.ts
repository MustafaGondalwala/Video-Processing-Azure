import express from "express";
import { register, login, getUser } from "../controllers/user.controller";
import auth from "../middlewares/auth";
import {
  getFileById,
  getTemporaryUrl,
  getUserFiles,
} from "../controllers/file.controller";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getUser);
router.get("/files", auth, getUserFiles);
router.get("/files/:fileId", auth, getFileById);
router.get("/files/:fileId/temporary-url", auth, getTemporaryUrl); 

export default router;
