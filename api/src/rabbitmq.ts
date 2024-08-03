import amqp from "amqplib";
import logger from "./middlewares/logger";
import config from "./config";

let channel: amqp.Channel;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(config.rabbitmqUrl);
    channel = await connection.createChannel();
    const queue = "file_events";

    await channel.assertQueue(queue, {
      durable: true,
    });

    logger.info("Connected to RabbitMQ");

    return channel;
  } catch (error) {
    logger.error("Failed to connect to RabbitMQ", error);
    process.exit(1);
  }
};

const getRabbitMQChannel = (): amqp.Channel => {
  if (!channel) {
    throw new Error("RabbitMQ channel is not initialized");
  }
  return channel;
};

export { connectRabbitMQ, getRabbitMQChannel };
