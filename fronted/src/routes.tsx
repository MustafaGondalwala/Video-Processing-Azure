import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import FileUpload from "./pages/FileUpload";
import Files from "./pages/Files";
import FileDetails from "./pages/FileDetails"; // Import the new FileDetails page
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="/file-upload" element={<ProtectedRoute />}>
        <Route path="/file-upload" element={<FileUpload />} />
      </Route>
      <Route path="/files" element={<ProtectedRoute />}>
        <Route path="/files" element={<Files />} />
      </Route>
      <Route path="/files/:fileId" element={<ProtectedRoute />}>
        <Route path="/files/:fileId" element={<FileDetails />} />
      </Route>
      <Route path="/" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
