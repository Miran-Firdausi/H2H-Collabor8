import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Login from "../pages/Login";
// import Signup from "../pages/Signup";
// import Header from "../components/Commons/Header";
import LandingPage from "../pages/LandingPage";
import Calendar from "../pages/Calendar";
import PrivateRoute from "./PrivateRoute";
import Navbar from "../components/Navbar";
import ProjectsDashboard from "../pages/ProjectDashboard";
import Chat from "../pages/Chat";
import Share from "../pages/Share";
import TextEditor from "../pages/TextEditor";
import Project from "../pages/Project";

const AppRoutes = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route index path="/" element={<LandingPage />} />
        <Route
          path="/projects"
          element={<PrivateRoute element={ProjectsDashboard} />}
        />
        <Route path="/calendar" element={<PrivateRoute element={Calendar} />} />
        <Route path="/chat" element={<PrivateRoute element={Chat} />} />
        <Route path="/share" element={<PrivateRoute element={Share} />} />
        <Route
          path="/project/:tab"
          element={<PrivateRoute element={Project} />}
        />
        <Route path="/project" element={<PrivateRoute element={Project} />} />
        <Route path="/document/:id" element={<TextEditor />} />
        {/* <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
