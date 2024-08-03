import "dotenv/config";

const required = (name: string, value?: string): string => {
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
};

const config = {
  port: required("PORT", process.env.PORT),
  jwtSecret: required("JWT_SECRET", process.env.JWT_SECRET),
  azureStorage: {
    sasToken: required(
      "AZURE_STORAGE_SAS_TOKEN",
      process.env.AZURE_STORAGE_SAS_TOKEN
    ),
    accountName: required(
      "AZURE_STORAGE_ACCOUNT_NAME",
      process.env.AZURE_STORAGE_ACCOUNT_NAME
    ),
    accountKey: required(
      "AZURE_STORAGE_ACCOUNT_KEY",
      process.env.AZURE_STORAGE_ACCOUNT_KEY
    ),
  },
  rabbitmqUrl: required("RABBITMQ_URL", process.env.RABBITMQ_URL),
};

export default config;