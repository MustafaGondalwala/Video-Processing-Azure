import { BlobServiceClient } from "@azure/storage-blob";
import fs from "fs";
import config from "../config";
import logger from "../middlewares/logger";

const { accountName, sasToken, containerName } = config.azureStorage;

class VideoService {
  async uploadToAzure(file: Express.Multer.File): Promise<string> {
    logger.info(`Starting upload for file: ${file.originalname}`);

    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net?${sasToken}`
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(
      file.originalname
    );

    const stream = fs.createReadStream(file.path);
    const uploadOptions = { bufferSize: 4 * 1024 * 1024, maxBuffers: 5 }; // 4 MB buffer size

    try {
      await blockBlobClient.uploadStream(
        stream,
        uploadOptions.bufferSize,
        uploadOptions.maxBuffers
      );
      logger.info(`File uploaded to Azure Blob Storage: ${file.originalname}`);
      return `File uploaded to Azure Blob Storage: ${file.originalname}`;
    } catch (error: any) {
      logger.error(`Upload failed: ${error.message}`);
      throw new Error("Upload failed");
    } finally {
      try {
        fs.unlinkSync(file.path);
        logger.info(`File deleted from disk: ${file.path}`);
      } catch (deleteError: any) {
        logger.error(`Failed to delete file: ${deleteError.message}`);
      }
    }
  }
}

export default new VideoService();
