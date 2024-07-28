import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info", // Ensure the logging level is set to 'info'
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
    )
  ),
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: "app.log" }), // Log to a file
  ],
});

export default logger;
