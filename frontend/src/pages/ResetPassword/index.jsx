import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { reset_password } from "../../actions/auth";
import { connect } from "react-redux";
import Footer from "../../components/Footer";
import "./ResetPassword.css";

const ResetPassword = ({ reset_password, errorMessage }) => {
  const [requestSent, setRequestSent] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
  });

  const { email } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    await reset_password(email);
    if (!errorMessage) {
      setRequestSent(true);
    }
  };

  useEffect(() => {
    if (requestSent) {
      navigate("/");
    }
  }, [requestSent, navigate]);

  return (
    <div className="app-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Reset
            <span className="hero-title--gradient"> password</span>
          </h1>
          <p className="hero-subtitle">
            Empower your team with AI-driven collaboration tools that make
            project management effortless.
          </p>

          <div className="signup-container">
            <form onSubmit={(e) => onSubmit(e)}>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Work email"
                  className="email-input"
                  value={email}
                  onChange={(e) => onChange(e)}
                  required
                />
              </div>
              <button type="submit" className="signup-button">
                Reset Password
              </button>
            </form>
            {errorMessage && <p className="error-text">{errorMessage}</p>}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const mapStateToProps = (state) => ({
  errorMessage: state.auth.errorMessage,
});

export default connect(mapStateToProps, { reset_password })(ResetPassword);
