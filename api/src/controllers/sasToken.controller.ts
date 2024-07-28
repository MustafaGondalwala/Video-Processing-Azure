import { Request, Response } from "express";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from "@azure/storage-blob";
import config from "../config";
import User, { IUser } from "../models/User";

const sharedKeyCredential = new StorageSharedKeyCredential(
  config.azureStorage.accountName,
  config.azureStorage.accountKey
);

export const generateSasToken = async (
  req: Request & { user?: IUser },
  res: Response
) => {
  try {
    const blobServiceClient = new BlobServiceClient(
      `https://${config.azureStorage.accountName}.blob.core.windows.net`,
      sharedKeyCredential
    );
    const containerName = req.user?._id.toString() as string;
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Create container if it doesn't exist
    const createContainerResponse = await containerClient.createIfNotExists();
    console.log(
      `Create container response: ${createContainerResponse.succeeded}`
    );

    const blobName = `all/${req.query.blobName as string}`;

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName,
        permissions: BlobSASPermissions.parse("cwr"),
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // 1 hour
      },
      sharedKeyCredential
    ).toString();

    const sasUrl = `${containerClient.url}/${blobName}?${sasToken}`;

    res.json({ sasUrl });
  } catch (error) {
    console.error("Error generating SAS token:", error);
    res.status(500).send("Error generating SAS token");
  }
};
