import "dotenv/config";

const required = (name: string, value?: string): string => {
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
};

const config = {
  port: required("PORT", process.env.PORT),
  azureStorage: {
    sasToken: required(
      "AZURE_STORAGE_SAS_TOKEN",
      process.env.AZURE_STORAGE_SAS_TOKEN
    ),
    accountName: required(
      "AZURE_STORAGE_ACCOUNT_NAME",
      process.env.AZURE_STORAGE_ACCOUNT_NAME
    ),
    containerName: required(
      "AZURE_STORAGE_CONTAINER_NAME",
      process.env.AZURE_STORAGE_CONTAINER_NAME
    ),
  },
};

export default config;
