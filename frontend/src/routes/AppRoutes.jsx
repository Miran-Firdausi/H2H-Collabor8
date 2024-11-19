import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";  // Make sure Provider is imported
import store from "../store";  // Make sure your Redux store is imported

import LandingPage from "../pages/LandingPage";
import ToDo from "../pages/ToDo";
import Board from "../pages/taskboard";
import GitHubDashboard from "../pages/GithubDashboard";
import Calendar from "../pages/Calendar";
import Navbar from "../components/Navbar";
import ProjectsDashboard from "../pages/ProjectDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Activate from "../pages/Activate";
import ResetPassword from "../pages/ResetPassword";
import ResetPasswordConfirm from "../pages/ResetPasswordConfirm";
import PrivateRoute from "./PrivateRoute";  // Make sure you have the correct path
import ProfilePage from "../pages/ProfilePage";

const AppRoutes = () => {
  return (
    <Provider store={store}>  {/* Pass the store as a prop to Provider */}
      <Router>
        <Navbar />
        <Routes>
          <Route index path="/" element={<LandingPage />} />
          <Route path="/todo" element={<PrivateRoute component={ToDo} />} />
          <Route path="/board" element={<PrivateRoute component={Board} />} />
          <Route
            path="/gitboard"
            element={<PrivateRoute component={GitHubDashboard} />}
          />
          <Route
            path="/projects"
            element={<PrivateRoute component={ProjectsDashboard} />}
          />
          <Route path="/calendar" element={<PrivateRoute component={Calendar} />} />
          <Route
            path="/AdminDashboard"
            element={<PrivateRoute component={AdminDashboard} />}
          />
          <Route path='/profile' element={<PrivateRoute component={ProfilePage} />}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/activate/:uid/:token" element={<Activate />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordConfirm />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default AppRoutes;
