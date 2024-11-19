import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { verify } from '../../actions/auth';
import { connect } from 'react-redux';
import Footer from "../../components/Footer";
import "./Activate.css";


const Activate = ({ verify }) => {
    //const [isSignedIn, setIsSignedIn] = useState(false);
    const navigate = useNavigate();
    const { uid, token } = useParams();
    const [verified, setVerified] = useState(false);

    const verify_account = e => {
        e.preventDefault();
        verify(uid, token);
        setVerified(true);
    };

    useEffect(() => {
        if (verified) {
            navigate('/');
        }
    }, [verified, navigate]);
    

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
                        Activate your
                        <span className="hero-title--gradient"> account</span>
                    </h1>
                    <div className="signup-container">
                    <button type="button" onClick={verify_account} className="signup-button">Verify</button>

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


export default connect(null, { verify })(Activate);
