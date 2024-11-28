import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkAuthenticated, load_user } from "../actions/auth";

const PrivateRoute = ({ element: Component }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
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

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/login" />;
  }

  return <Component />;
};

export default PrivateRoute;
