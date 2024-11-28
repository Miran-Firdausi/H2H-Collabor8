import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../store";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Activate from "../pages/Activate";
import ResetPassword from "../pages/ResetPassword";
import ResetPasswordConfirm from "../pages/ResetPasswordConfirm";
import PrivateRoute from "./PrivateRoute";
import ProfilePage from "../pages/ProfilePage";
import Navbar from "../components/Navbar";
import ProjectsDashboard from "../pages/ProjectDashboard";
import TextEditor from "../pages/TextEditor";
import Project from "../pages/Project";

const AppRoutes = () => {
  return (
    <Provider store={store}>
      {/* Pass the store as a prop to Provider */}
      <Router>
        <Navbar />
        <Routes>
          <Route index path="/" element={<LandingPage />} />
          <Route
            path="/profile"
            element={<PrivateRoute element={ProfilePage} />}
          ></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/activate/:uid/:token" element={<Activate />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/password/reset/confirm/:uid/:token"
            element={<ResetPasswordConfirm />}
          />
          <Route
            path="/projects"
            element={<PrivateRoute element={ProjectsDashboard} />}
          />
          <Route
            path="/project/:tab"
            element={<PrivateRoute element={Project} />}
          />
          <Route path="/project" element={<PrivateRoute element={Project} />} />
          <Route path="/document/:id" element={<TextEditor />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default AppRoutes;
