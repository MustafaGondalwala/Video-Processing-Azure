import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllFiles } from "../services/fileUpload.service";

interface File {
  _id: string;
  fileName: string;
  url: string;
  createdAt: string;
}

const Files: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("User not authenticated");
          return;
        }

        const data = await getAllFiles(page, limit, token);
        setFiles(data.files);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, [page]);

  return (
    <div className="container mt-4">
      <h2>Files</h2>
      <ul className="list-group">
        {files.map((file) => (
          <li key={file._id} className="list-group-item">
            <Link to={`/files/${file._id}`}>{file.fileName}</Link>
            <span className="text-muted">
              {" "}
              (Uploaded on {new Date(file.createdAt).toLocaleDateString()})
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-3">
        <button
          className="btn btn-primary"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span className="mx-2">
          Page {page} of {totalPages}
        </span>
        <button
          className="btn btn-primary"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Files;
