import { BlobServiceClient, logger } from "@azure/storage-blob";
import { Readable } from "stream";
import config from "../config";

const { accountName, sasToken, containerName } = config.azureStorage;

class VideoService {
  async uploadToAzure(file: Express.Multer.File): Promise<void> {
    logger.info(`Starting upload for file: ${file.originalname}`);

    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net?${sasToken}`
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(
      file.originalname
    );

    const stream = Readable.from(file.buffer);
    const response = await blockBlobClient.uploadStream(stream, file.size);
    logger.info(`Uploaded Successfully ${response.etag}`);
  }
}

export default new VideoService();
