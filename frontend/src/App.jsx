/* eslint-disable no-unused-vars */
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ToDo from "./pages/ToDo";
import Board from "./pages/taskboard";
import GitHubDashboard from "./pages/GithubDashboard";
import LandingPage from "./pages/LandingPage";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/todo" element={<ToDo />} />
        <Route path="/board" element={<Board />} />
        <Route path="/gitboard" element={<GitHubDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
