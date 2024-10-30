/* eslint-disable no-unused-vars */
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ToDo from "./pages/ToDo";
import Board from "./pages/taskboard";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ToDo />} />
        <Route path="/board" element={<Board />} />
      </Routes>
    </Router>
  );
};

export default App;
