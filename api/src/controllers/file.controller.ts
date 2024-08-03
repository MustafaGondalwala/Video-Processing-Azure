import { Request, Response } from "express";
import File from "../models/File";
import User, { IUser } from "../models/User";
import {
  StorageSharedKeyCredential,
  BlobServiceClient,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from "@azure/storage-blob";
import config from "../config";

export const getUserFiles = async (
  req: Request & { user?: IUser },
  res: Response
) => {
  try {
    const userId = req.user?._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Find user by ID to ensure user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get files of the user with pagination
    const files = await File.find({ user: userId })
      .skip(skip)
      .limit(limit)
      .exec();

    // Get total count of files for pagination info
    const totalFiles = await File.countDocuments({ user: userId });

    res.json({
      page,
      totalPages: Math.ceil(totalFiles / limit),
      totalFiles,
      files,
    });
  } catch (error) {
    console.error("Error fetching user files:", error);
    res.status(500).send("Error fetching user files");
  }
};

export const getFileById = async (
  req: Request & { user?: IUser },
  res: Response
) => {
  try {
    const { fileId } = req.params;

    // Find the file by ID
    const file = await File.findOne({
      _id: fileId,
      user: req.user?._id,
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json(file);
  } catch (error) {
    console.error("Error fetching file details:", error);
    res.status(500).send("Error fetching file details");
  }
};

export const getTemporaryUrl = async (
  req: Request & { user?: IUser },
  res: Response
) => {
  try {
    const { fileId } = req.params;

    // Find the file by ID and user ID
    const file = await File.findOne({
      _id: fileId,
      user: req.user?._id,
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const sharedKeyCredential = new StorageSharedKeyCredential(
      config.azureStorage.accountName,
      config.azureStorage.accountKey
    );

    const blobServiceClient = new BlobServiceClient(
      `https://${config.azureStorage.accountName}.blob.core.windows.net`,
      sharedKeyCredential
    );

    const containerName = req.user?._id.toString() as string;
    console.log(containerName, "ok");
    console.log(file, "ok");
    const containerClient = blobServiceClient.getContainerClient(containerName);
    let blobName = `all/${file.fileName}`;

    const blobClient = containerClient.getBlobClient(blobName);
    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName,
        permissions: BlobSASPermissions.parse("r"),
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + 300 * 1000),
      },
      sharedKeyCredential
    ).toString();

    const temporaryUrl = `${blobClient.url}?${sasToken}`;
    console.log(temporaryUrl, "temp");
    res.json({ url: temporaryUrl });
  } catch (error) {
    console.error("Error generating temporary URL:", error);
    res.status(500).send("Error generating temporary URL");
  }
};
