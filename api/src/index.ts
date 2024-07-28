import express from "express";
import userRoutes from "./routes/user.router";
import sasTokenRouter from "./routes/sasToken.router";
import morganMiddleware from "./middlewares/morgan";
import cors from "cors";
import mongoose from "mongoose";
import config from "./config";

const app = express();
const PORT = config.port;

app.use(cors());
app.use(express.json());
app.use(morganMiddleware);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.use("/users", userRoutes);
app.use("/sas-token", sasTokenRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
