import React, { useState } from "react";
import axios from "axios";

const FileUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setUploadProgress(0);
      setMessage("");
    }
  };

  const onFileUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:3000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent: any) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      setMessage("File uploaded successfully!");
    } catch (error) {
      setMessage("File upload failed!");
    }
  };

  return (
    <div className="file-upload">
      <h2>File Upload with Progress Bar</h2>
      <input type="file" onChange={onFileChange} />
      <button onClick={onFileUpload}>Upload</button>
      {uploadProgress > 0 && (
        <progress value={uploadProgress} max="100">
          {uploadProgress}%
        </progress>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUpload;
