import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Calendar from "../pages/Calendar";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Activate from "../pages/Activate";
import ResetPassword from "../pages/ResetPassword";
import ResetPasswordConfirm from "../pages/ResetPasswordConfirm";
import PrivateRoute from "./PrivateRoute";
import ProfilePage from "../pages/ProfilePage";
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
        <Route path="/calendar" element={<PrivateRoute element={Calendar} />} />
        <Route path="/chat" element={<PrivateRoute element={Chat} />} />
        <Route path="/share" element={<PrivateRoute element={Share} />} />
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
  );
};

export default AppRoutes;
