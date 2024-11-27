import React, { useState } from "react";
import "./FileUploader.css";

const FileUploader = ({ onFileUpload }) => {
  const [files, setFiles] = useState([]);

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles([...files, ...uploadedFiles]);
    onFileUpload(uploadedFiles);
  };

  return (
    <div className="file-uploader">
      <input
        type="file"
        multiple
        onChange={handleFileUpload}
        className="file-input"
      />
      <div className="uploaded-files">
        {files.map((file, index) => (
          <p key={index}>{file.name}</p>
        ))}
      </div>
    </div>
  );
};

export default FileUploader;
