import { Request, Response } from "express";
import videoService from "../services/video.service";
import logger from "../middlewares/logger";

class VideoController {
  async upload(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).send("No file uploaded.");
      }
      await videoService.uploadToAzure(req.file);
      res.status(200).send({
        data: {
          message: `File Uploadded Successfully`,
        },
      });
    } catch (error: any) {
      logger.error(`Upload failed: ${error.message}`);
      res.status(500).send("Internal Server Error");
    }
  }
}

export default new VideoController();
