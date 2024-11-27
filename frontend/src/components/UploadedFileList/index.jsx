import React, { useState } from "react";
import FileUploader from "../../components/FileUploader";
import "./UploadedFileList.css";

import { Eye, Download, Trash } from "lucide-react";

const fileIcons = {
  pdf: "/icons/pdf.png", // Replace with the actual path to your icons
  ppt: "/icons/ppt.png",
  pptx: "/icons/pptx.png",
  zip: "/icons/zip.png",
  docx: "/icons/docx.png",
  default: "/icons/default-file.png", // Generic file graphic
};

const UploadedFileList = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileUpload = (files) => {
    const filesWithDetails = Array.from(files).map((file) => {
      const fileExtension = file.name.split(".").pop().toLowerCase();

      return {
        id: Date.now() + Math.random(), // Unique ID
        name: file.name,
        type: fileExtension, // Use the file extension
        size: (file.size / 1024).toFixed(2), // Size in KB
        uploadDate: new Date().toISOString().split("T")[0], // Current date
        file: file,
        url: URL.createObjectURL(file), // Temporary URL for preview and download
      };
    });

    setUploadedFiles((prevFiles) => [...prevFiles, ...filesWithDetails]);
  };

  const handleDelete = (fileId) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((file) => file.id !== fileId)
    );
  };

  return (
    <div className="uploaded-file-list">
      <h2>Uploaded Files</h2>
      <FileUploader onFileUpload={handleFileUpload} />
      <h3 className="file-list-title">My Files</h3>
      {uploadedFiles.length > 0 ? (
        <div className="file-list">
          {uploadedFiles.map((file) => (
            <div className="file-card" key={file.id}>
              <div className="file-preview">
                {file.type === "jpg" ||
                file.type === "jpeg" ||
                file.type === "png" ||
                file.type === "gif" ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="image-preview"
                  />
                ) : (
                  <img
                    src={fileIcons[file.type] || fileIcons.default}
                    alt={`${file.type} icon`}
                    className="icon-preview"
                  />
                )}
              </div>
              <div className="file-details">
                <h3>{file.name}</h3>
                <p>Type: {file.type}</p>
                <p>Size: {file.size} KB</p>
                <p>Uploaded: {file.uploadDate}</p>
              </div>
              <div className="file-actions">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-button"
                >
                  <Eye size={20} />
                </a>
                <a
                  href={file.url}
                  download={file.name}
                  className="download-button"
                >
                  <Download size={20} />
                </a>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="delete-button"
                >
                  <Trash size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No files uploaded yet.</p>
      )}
    </div>
  );
};

export default UploadedFileList;
