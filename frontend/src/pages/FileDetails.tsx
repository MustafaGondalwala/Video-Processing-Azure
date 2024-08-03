import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFileById, getTemporaryUrl } from "../services/fileUpload.service";

interface File {
  _id: string;
  fileName: string;
  url: string;
  createdAt: string;
  contentLength: number;
  eTag: string;
  container: string;
}

const FileDetails: React.FC = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage("User not authenticated");
          return;
        }

        const fileDetails = await getFileById(fileId!, token);
        setFile(fileDetails);
      } catch (error) {
        console.error("Error fetching file details:", error);
        setMessage("Error fetching file details");
      }
    };

    fetchFileDetails();
  }, [fileId]);

  const handleGeneratePreviewUrl = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("User not authenticated");
        return;
      }

      const url = await getTemporaryUrl(fileId!, token);
      setPreviewUrl(url);
    } catch (error) {
      console.error("Error generating preview URL:", error);
      setMessage("Error generating preview URL");
    }
  };

  if (message) {
    return <div className="container mt-4">{message}</div>;
  }

  if (!file) {
    return <div className="container mt-4">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>File Details</h2>
      <ul className="list-group">
        <li className="list-group-item">
          <strong>File Name:</strong> {file.fileName}
        </li>
        <li className="list-group-item">
          <strong>URL:</strong>{" "}
          <a href={file.url} target="_blank" rel="noopener noreferrer">
            {file.url}
          </a>
        </li>
        <li className="list-group-item">
          <strong>Container:</strong> {file.container}
        </li>
        <li className="list-group-item">
          <strong>Content Length:</strong> {file.contentLength} bytes
        </li>
        <li className="list-group-item">
          <strong>ETag:</strong> {file.eTag}
        </li>
        <li className="list-group-item">
          <strong>Uploaded At:</strong>{" "}
          {new Date(file.createdAt).toLocaleString()}
        </li>
      </ul>
      <button
        className="btn btn-primary mt-3"
        onClick={handleGeneratePreviewUrl}
      >
        Generate Preview URL
      </button>
      {previewUrl && (
        <div className="mt-3">
          <h3>Preview</h3>
          <img src={previewUrl} alt="File Preview" className="img-fluid" />
        </div>
      )}
    </div>
  );
};

export default FileDetails;
