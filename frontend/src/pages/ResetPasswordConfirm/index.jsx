import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { reset_password_confirm } from "../../actions/auth";
import { connect } from "react-redux";
import Footer from "../../components/Footer";
import "./ResetPasswordConfirm.css";

const ResetPasswordConfirm = ({ reset_password_confirm }) => {
    const [requestSent, setRequestSent] = useState(false);
    const navigate = useNavigate();
    const { uid, token } = useParams(); 

    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        new_password: "",
        re_new_password: "",
    });

    const { new_password, re_new_password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
    
        if (new_password !== re_new_password) {
            setError("Passwords do not match.");
            return;
        }
    
        const response = await reset_password_confirm(uid, token, new_password, re_new_password);
    
        if (response.success) {
            setRequestSent(true); 
        } else {
            setError(response.message); 
        }
    };
    

    useEffect(() => {
        if (requestSent) {
            navigate("/");
        }
    }, [requestSent, navigate]);

    const stats = [
        { number: "10K+", label: "Active Users" },
        { number: "50M+", label: "Tasks Completed" },
        { number: "99.9%", label: "Uptime" },
        { number: "24/7", label: "Support" },
    ];

    const testimonials = [
        {
            text: "Colabor8 has transformed how our team works together. The AI integration is a game-changer.",
            author: "Sarah Johnson",
            role: "Product Manager at TechCorp",
        },
        {
            text: "The most intuitive project management tool we've ever used. It's like it reads our minds!",
            author: "Mike Chen",
            role: "CTO at StartupX",
        },
        {
            text: "Finally, a collaboration tool that actually makes our work easier instead of adding complexity.",
            author: "Emily Rodriguez",
            role: "Team Lead at InnovateCo",
        },
    ];

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
                        <form onSubmit={onSubmit}>
                            <div className="form-group">
                                <input
                                    type="password"
                                    name="new_password"
                                    placeholder="New Password"
                                    className="email-input"
                                    value={new_password}
                                    onChange={onChange}
                                    minLength="6"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    name="re_new_password"
                                    placeholder="Confirm New Password"
                                    className="email-input"
                                    value={re_new_password}
                                    onChange={onChange}
                                    minLength="6"
                                    required
                                />
                            </div>
                            {error && <p className="error-text">{error}</p>}
                            <button type="submit" className="signup-button">
                                Reset Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="stats-section">
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-item">
                            <div className="stat-number">{stat.number}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="testimonials-section">
                <h2 className="section-title">What our users say</h2>
                <div className="testimonials-grid">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="testimonial-card">
                            <p className="testimonial-text">{testimonial.text}</p>
                            <div className="testimonial-author">
                                <div className="author-avatar"></div>
                                <div className="author-info">
                                    <h4>{testimonial.author}</h4>
                                    <p>{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default connect(null, { reset_password_confirm })(ResetPasswordConfirm);
