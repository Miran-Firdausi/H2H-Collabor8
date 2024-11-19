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

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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

const mapStateToProps = (state) => ({
    errorMessage: state.auth.errorMessage,
});

export default connect(mapStateToProps, { reset_password })(ResetPassword);
