import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Login from "../pages/Login";
// import Signup from "../pages/Signup";
// import Header from "../components/Commons/Header";
import LandingPage from "../pages/LandingPage";
import ToDo from "../pages/ToDo";
import Board from "../pages/taskboard";
import GitHubDashboard from "../pages/GithubDashboard";
import Calendar from "../pages/Calendar";
import PrivateRoute from "./PrivateRoute";
import Navbar from "../components/Navbar";
import ProjectsDashboard from "../pages/ProjectDashboard";
import AdminDashboard from "../pages/AdminDashboard";

const AppRoutes = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route index path="/" element={<LandingPage />} />
        <Route path="/todo" element={<PrivateRoute element={ToDo} />} />
        <Route path="/board" element={<PrivateRoute element={Board} />} />
        <Route
          path="/gitboard"
          element={<PrivateRoute element={GitHubDashboard} />}
        />
        <Route
          path="/projects"
          element={<PrivateRoute element={ProjectsDashboard} />}
        />
        <Route path="/calendar" element={<PrivateRoute element={Calendar} />} />
        <Route
          path="/AdminDashboard"
          element={<PrivateRoute element={AdminDashboard} />}
        />
        {/* <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
