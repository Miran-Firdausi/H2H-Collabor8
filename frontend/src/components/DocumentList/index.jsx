import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DocumentList.css";

const DocumentList = () => {
  const [documents, setDocuments] = useState([
    {
      id: "174d01d5-e0ab-4110-ab40-e0aa5f12dbc1",
      title: "Project Proposal",
      date: "2024-11-10",
    },
    {
      id: "e0bc0f22-80a7-49bb-a9c7-eb9fd07579e7",
      title: "Design Specification",
      date: "2024-11-15",
    },
  ]);

  const navigate = useNavigate();

  const createNewDocument = () => {
    const newDoc = {
      id: documents.length + 1,
      title: `Untitled Document ${documents.length + 1}`,
      date: new Date().toISOString().split("T")[0], // Current date
    };
    setDocuments([...documents, newDoc]);
    navigate(`/document/${newDoc.id}`); // Navigate to the document editor
  };

  const handleCardClick = (id) => {
    navigate(`/document/${id}`); // Open existing document
  };

  return (
    <div className="document-list">
      <h2>My Documents</h2>
      <button className="new-document-button" onClick={createNewDocument}>
        New Document
      </button>
      <div className="document-cards">
        {documents.map((doc) => (
          <div
            className="document-card"
            key={doc.id}
            onClick={() => handleCardClick(doc.id)}
          >
            <h3>{doc.title}</h3>
            <p>Date: {doc.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentList;
