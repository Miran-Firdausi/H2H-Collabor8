import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import "./TextEditor.css";

const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

export default function TextEditor() {
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  // Unique identifier for the user
  const userId = Math.random().toString(36).substring(2);

  const connect = () => {
    const s = new WebSocket(`ws://localhost:8000/ws/documents/${documentId}/`);

    s.onopen = () => {
      // Load the document when WebSocket connection opens
      s.send(JSON.stringify({ event_type: "get-document" }));
    };

    s.onclose = (event) => {
      console.log("WebSocket closed:", event);
      // Attempt to reconnect after a delay
      setTimeout(connect, 1000);
    };

    s.onerror = (error) => {
      console.error("WebSocket error observed:", error);
    };

    setSocket(s);
  };

  useEffect(() => {
    // Create WebSocket connection
    connect();

    // Clean up WebSocket connection on unmount
    return () => {
      socket?.close(); // Clean up on unmount
    };
  }, [documentId]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.event_type === "load-document") {
        quill.setContents(data.data.ops);
        quill.enable();
      } else if (data.event_type === "receive-changes") {
        if (data.userId !== userId) {
          console.log("Received changes:", data.data);
          quill.updateContents(data.data);
        } else {
          console.log("own work");
        }
      }
    };

    // Listen for changes made by other users
    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      if (socket.readyState === WebSocket.OPEN && source === "user") {
        console.log("sent");
        socket.send(
          JSON.stringify({
            event_type: "send-changes",
            data: delta,
            userId: userId,
          })
        );
        console.log("error");
      } else {
        console.error(
          "WebSocket is not open. Current state:",
          socket.readyState
        );
      }
    };
    quill.on("text-change", handler);

    // Save document changes at intervals
    const interval = setInterval(() => {
      socket.send(
        JSON.stringify({
          event_type: "save-document",
          data: quill.getContents(),
        })
      );
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    q.disable();
    q.setText("Loading, Please wait...");
    setQuill(q);
  }, []);

  return <div className="docs-container" ref={wrapperRef}></div>;
}
