import React, { useState, useRef } from "react";
import {
  generateSasToken,
  uploadFileToAzure,
} from "../services/fileUpload.service";

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setFile(null);
    setUploadProgress(0);
    setMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setMessage("Please select a file first!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("User not authenticated");
        return;
      }

      // Generate SAS token for the file
      const sasUrl = await generateSasToken(file.name, token);

      // Upload the file to Azure Blob Storage using the SAS URL
      await uploadFileToAzure(sasUrl, file, (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        }
      });

      setMessage("File uploaded successfully!");
      resetForm(); // Reset form after successful upload
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("File upload failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Upload File</h2>
      <div className="mb-3">
        <input
          type="file"
          className="form-control"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
      </div>
      <button className="btn btn-primary" onClick={handleFileUpload}>
        Upload
      </button>
      {uploadProgress > 0 && (
        <div className="progress mt-3">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${uploadProgress}%` }}
            aria-valuenow={uploadProgress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            {uploadProgress}%
          </div>
        </div>
      )}
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
};

export default FileUpload;
