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

export const getAllFiles = async (
  page: number,
  limit: number,
  token: string
) => {
  const response = await axios.get(`${API_BASE_URL}/users/files`, {
    params: { page, limit },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getFileById = async (fileId: string, token: string) => {
  const response = await axios.get(`${API_BASE_URL}/users/files/${fileId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const getTemporaryUrl = async (fileId: string, token: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/users/files/${fileId}/temporary-url`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.url;
};
