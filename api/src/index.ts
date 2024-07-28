import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/user.route";
import videoController from "./controllers/video.controller";
import uploadMiddleware from "./middlewares/upload";
import logger from "./middlewares/logger";
import config from "./config";
import morganMiddleware from "./middlewares/morgan";
import cors from "cors";

const app = express();
const PORT = config.port;

app.use(cors());
app.use(express.json());
app.use(morganMiddleware);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => logger.info("Connected to MongoDB"))
  .catch((err) => logger.error("Failed to connect to MongoDB", err));

app.use("/users", userRoutes);
app.post("/upload", uploadMiddleware, videoController.upload);

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
