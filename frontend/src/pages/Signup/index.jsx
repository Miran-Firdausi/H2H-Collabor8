import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import "./Signup.css";
import { useNavigate, Link } from 'react-router-dom';
import { signup } from "../../actions/auth";
import { connect } from 'react-redux';
import axios from "axios";

const Signup = ({ signup, isAuthenticated }) => {

    const [accountCreated, setAccountCreated] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        re_password: ''
    });

    const { first_name, last_name, email, password, re_password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
    
        if (password !== re_password) {
            setError("Passwords do not match.");
            return;
        }
    
        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }
    
        const response = await signup(first_name, last_name, email, password, re_password);
    
        if (response.success) {
            setAccountCreated(true);
        } else {
            setError(response.message); 
        }
    };
    
    const continueWithGoogle = async() => {
        try{
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/o/google-oauth2/?redirect_url=http://localhost:5173`)
            window.location.replace(res.data.authorization_url);
        }
        catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (accountCreated) {
            navigate('/login');
        }
    }, [accountCreated]);

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
                        Create an
                        <span className="hero-title--gradient"> account</span>
                    </h1>
                    <p className="hero-subtitle">
                        Empower your team with AI-driven collaboration tools that make
                        project management effortless.
                    </p>

                    {!isAuthenticated && (
                        <div className="signup-container">
                            <form onSubmit={e => onSubmit(e)}>

                                <div className='form-group'>
                                    <input
                                        type="text"
                                        name="first_name"
                                        placeholder="First name*"
                                        className="email-input"
                                        value={first_name}
                                        onChange={e => onChange(e)}
                                        required
                                    />
                                </div>
                                <div className='form-group'>
                                    <input
                                        type="text"
                                        name="last_name"
                                        placeholder="Last name*"
                                        className="email-input"
                                        value={last_name}
                                        onChange={e => onChange(e)}
                                        required
                                    />
                                </div>
                                <div className='form-group'>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Work email*"
                                        className="email-input"
                                        value={email}
                                        onChange={e => onChange(e)}
                                        required
                                    />
                                </div>


                                <div className='form-group'>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password*"
                                        className="email-input"
                                        value={password}
                                        onChange={e => onChange(e)}
                                        minLength='6'
                                        required
                                    />
                                </div>

                                <div className='form-group'>
                                    <input
                                        type="password"
                                        name="re_password"
                                        placeholder="Confirm Password*"
                                        className="email-input"
                                        value={re_password}
                                        onChange={e => onChange(e)}
                                        minLength='6'
                                        required
                                    />
                                </div>

                                {error && <p className="error-message">{error}</p>}

                                <p className="terms-text">
                                    By clicking 'sign up' you agree to the Colabor8 Customer
                                    Agreement, which incorporates by reference the AI
                                    Product-Specific Terms, and acknowledge the Privacy Policy.
                                </p>
                                <button type="submit" className="signup-button">Sign Up</button>
                            </form>
                            <div className="divider">
                                <span>Or continue with</span>
                            </div>

                            <div className="social-buttons">
                                <button
                                    className="social-button"
                                    onClick={continueWithGoogle}
                                >
                                    Google
                                </button>
                                <button
                                    className="social-button"
                                    onClick={continueWithGoogle}
                                >
                                    Facebook
                                </button>
                            </div>

                            <p className="already-user-text">Already a user? <Link to='/login'>Login</Link></p>

                        </div>
                    )}
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

            <div className="features-section">
                <h2 className="section-title">Why teams love Colabor8</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h2 className="feature-title">Launch campaigns</h2>
                        <div className="feature-content">
                            <div className="icon-placeholder"></div>
                            <span>Complete MVP Strategy</span>
                            <span className="tag">TO DO</span>
                        </div>
                    </div>

                    <div className="feature-card">
                        <h2 className="feature-title">Plan out projects</h2>
                        <div className="feature-content">
                            <div className="timeline">
                                <span>June</span>
                                <span>July</span>
                            </div>
                            <div className="timeline-bar"></div>
                        </div>
                    </div>

                    <div className="feature-card">
                        <h2 className="feature-title">Automate tasks</h2>
                        <div className="feature-content">
                            <span>Demo AI capabilities</span>
                            <span className="tag">TBT-6</span>
                        </div>
                    </div>
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

            <div className="cta-section">
                <div className="cta-content">
                    <h2 className="cta-section-title">
                        Ready to transform your workflow?
                    </h2>
                    <button className="signup-button">Start Free Trial</button>
                </div>
            </div>

            <Footer />
        </div>
    );
};
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});


export default connect(mapStateToProps, { signup })(Signup);
