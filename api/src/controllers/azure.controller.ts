import { Request, Response } from "express";
import { StorageEvent } from "../interface";
import User from "../models/User";
import { getRabbitMQChannel } from "../rabbitmq";
import logger from "../middlewares/logger";

export const webhook = async (req: Request, res: Response) => {
  try {
    const events: StorageEvent[] = req.body;

    const channel = getRabbitMQChannel();
    const queue = "file_events";
    console.log(req.body);
    logger.info(`Azure Webhook Event ${events}`);

    // Iterate over each event in the array
    for (const event of events) {
      switch (event.data.api) {
        case "PutBlob":
          const userId = event.subject.split("/")[4];

          // Find the user by ID
          const user = await User.findById(userId);

          if (!user) {
            console.error(`User not found for ID: ${userId}`);
            continue;
          }

          // Create a message object
          const message = {
            userId: user._id,
            event,
          };

          // Send the message to RabbitMQ
          console.log(
            await channel.sendToQueue(
              queue,
              Buffer.from(JSON.stringify(message)),
              {
                persistent: true,
              }
            )
          );
          break;

        default:
          console.warn(`Invalid API action: ${event.data.api}`);
          break;
      }
    }

    res.json({
      message: "Events processed successfully",
    });
  } catch (error) {
    console.error("Error in Azure Webhook:", error);
    res.status(500).send("Error in Azure Webhook");
  }
};
