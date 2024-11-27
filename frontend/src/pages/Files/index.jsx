import React, { useState } from "react";
import DocumentList from "../../components/DocumentList";
import FigmaFileList from "../../components/FigmaFileList";
import UploadedFileList from "../../components/UploadedFileList";
import "./Files.css";

const Files = () => {
  const [activeTab, setActiveTab] = useState("documents");

  return (
    <div className="file-viewer">
      <div className="tabs">
        <button
          className={activeTab === "files" ? "active" : ""}
          onClick={() => setActiveTab("files")}
        >
          Files
        </button>
        <button
          className={activeTab === "documents" ? "active" : ""}
          onClick={() => setActiveTab("documents")}
        >
          Documents
        </button>
        <button
          className={activeTab === "figma" ? "active" : ""}
          onClick={() => setActiveTab("figma")}
        >
          Figma Files
        </button>
      </div>
      <div className="tab-content">
        {activeTab === "documents" && <DocumentList />}
        {activeTab === "files" && <UploadedFileList />}
        {activeTab === "figma" && <FigmaFileList />}
      </div>
    </div>
  );
};

export default Files;
