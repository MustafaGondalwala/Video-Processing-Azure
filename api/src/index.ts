import express from "express";
import userRoutes from "./routes/user.router";
import sasTokenRouter from "./routes/sasToken.router";
import azureRoutes from "./routes/azure.router";
import morganMiddleware from "./middlewares/morgan";
import cors from "cors";
import mongoose from "mongoose";
import config from "./config";
import { connectRabbitMQ } from "./rabbitmq";

const app = express();
const PORT = config.port;

app.use(cors());
app.use(express.json());
app.use(morganMiddleware);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

connectRabbitMQ().then(() => {});

app.use("/users", userRoutes);
app.use("/sas-token", sasTokenRouter);
app.use("/azure", azureRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
