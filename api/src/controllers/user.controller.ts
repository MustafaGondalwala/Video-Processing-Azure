import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { registerSchema, loginSchema } from "../validation/user";
import { BlobServiceClient } from "@azure/storage-blob";
import config from "../config";
import logger from "../middlewares/logger";

const blobServiceClient = new BlobServiceClient(
  `https://${config.azureStorage.accountName}.blob.core.windows.net?${config.azureStorage.sasToken}`
);

const formatJoiErrors = (error: any) => {
  return error.details.map((detail: any) => {
    return {
      message: detail.message,
      path: detail.path,
    };
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        errors: formatJoiErrors(error),
      });
    }

    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        errors: [{ message: "User already exists", path: ["email"] }],
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    }) as IUser;
    await user.save();

    const containerClient = blobServiceClient.getContainerClient(
      user._id.toString()
    );
    await containerClient.create();

    res.status(201).json({
      message: "User registered successfully",
      user: { _id: user._id, username: user.username, email: user.email },
    });
  } catch (error: any) {
    console.error(error);
    logger.error(error.toString());
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        errors: formatJoiErrors(error),
      });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        errors: [{ message: "Invalid email or password", path: ["email"] }],
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        errors: [{ message: "Invalid email or password", path: ["password"] }],
      });
    }

    const token = jwt.sign({ _id: user._id }, config.jwtSecret, {
      expiresIn: "100h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUser = async (
  req: Request & { user?: IUser },
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
