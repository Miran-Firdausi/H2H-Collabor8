import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verify } from "../../actions/auth";
import { connect } from "react-redux";
import Footer from "../../components/Footer";
import "./Activate.css";

const Activate = ({ verify }) => {
  //const [isSignedIn, setIsSignedIn] = useState(false);
  const navigate = useNavigate();
  const { uid, token } = useParams();
  const [verified, setVerified] = useState(false);

  const verify_account = (e) => {
    e.preventDefault();
    verify(uid, token);
    setVerified(true);
  };

  useEffect(() => {
    if (verified) {
      navigate("/");
    }
  }, [verified, navigate]);

  return (
    <div className="app-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Activate your
            <span className="hero-title--gradient"> account</span>
          </h1>
          <div className="signup-container">
            <button
              type="button"
              onClick={verify_account}
              className="signup-button"
            >
              Verify
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default connect(null, { verify })(Activate);
