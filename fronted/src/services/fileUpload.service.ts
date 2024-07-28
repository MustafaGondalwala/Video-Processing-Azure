import axios, { AxiosProgressEvent } from "axios";

const API_BASE_URL = "http://localhost:3000";

export const generateSasToken = async (blobName: string, token: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/sas-token/generate-upload-token`,
    {
      params: { blobName },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.sasUrl;
};

export const uploadFileToAzure = async (
  sasUrl: string,
  file: File,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void
) => {
  return await axios.put(sasUrl, file, {
    headers: {
      "x-ms-blob-type": "BlockBlob",
    },
    onUploadProgress,
  });
};
