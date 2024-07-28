import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import User, { IUser } from "../models/User";

const auth = async (
  req: Request & { user?: IUser },
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { _id: string };
    const user = await User.findById(decoded._id).select("-password");
    if (!user) return res.status(400).json({ message: "Invalid token." });

    req.user = user;
    next();
  } catch (ex) {
    res.status(400).json({ message: "Invalid token." });
  }
};

export default auth;
