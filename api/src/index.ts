import express from "express";
import videoController from "./controllers/video.controller";
import uploadMiddleware from "./middlewares/upload";
import logger from "./middlewares/logger";
import config from "./config";
import morganMiddleware from "./middlewares/morgan";
import cors from "cors";

const app = express();
const PORT = config.port;

app.use(cors()); // Add this line to enable CORS
app.use(express.json());
app.use(morganMiddleware); // Add morgan middleware

app.post("/upload", uploadMiddleware, (req, res) =>
  videoController.upload(req, res)
);

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
