import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkAuthenticated, load_user } from "../actions/auth";
import AgoraRTC, { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";
import { VideoRoom } from "../pages/VideoRoom";
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
import Discussion from "../pages/Discussion";
import QuestionPage from "../pages/QuestionPage";
import TextEditor from "../pages/TextEditor";
import Project from "../pages/Project";

const AppRoutes = () => {
  const location = useLocation();
  const showNavbar = !location.pathname.startsWith("/call/");

  const agoraClient = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        await dispatch(checkAuthenticated());
        await dispatch(load_user());
      } catch (error) {
        console.error("Authentication failed", error);
      } finally {
        setIsLoading(false);
      }
    };

    authenticateUser();
  }, [dispatch]);

  if (isLoading) {
    return <div className="loading-container">Loading Please wait...</div>;
  }

  return (
    <>
      {showNavbar && <Navbar />}
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
        <Route
          path="/discussion"
          element={<PrivateRoute element={Discussion} />}
        />
        <Route path="/question/:id" element={<QuestionPage />} />
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
        <Route
          path="/call/:channelName"
          element={
            <AgoraRTCProvider client={agoraClient}>
              <VideoRoom />
            </AgoraRTCProvider>
          }
        />
      </Routes>
    </>
  );
};

export default AppRoutes;
