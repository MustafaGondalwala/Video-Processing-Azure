import amqp from "amqplib";
import "dotenv/config";

const startWorker = async () => {
  try {
    // Connect to MongoDB
    console.log("Connected to MongoDB");

    // Connect to RabbitMQ
    const connection = await amqp.connect(process.env.RABBITMQ_URL as string);
    const channel = await connection.createChannel();
    const queue = "file_events";

    await channel.assertQueue(queue, {
      durable: true,
    });

    console.log(`Worker is waiting for messages in ${queue}`);

    channel.consume(
      queue,
      async (msg: any) => {
        if (msg !== null) {
          const message = JSON.parse(msg.content.toString());
          console.log("Received message:", message);
          channel.ack(msg);
        }
      },
      {
        noAck: false,
      }
    );
  } catch (error) {
    console.error("Worker error:", error);
    process.exit(1);
  }
};

startWorker();
