import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Home, CheckSquare, Layout, Github, Users, Zap, Shield, Clock } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const [isSignedIn] = useState(true);

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '50M+', label: 'Tasks Completed' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' },
  ];

  const testimonials = [
    {
      text: "Colabor8 has transformed how our team works together. The AI integration is a game-changer.",
      author: "Sarah Johnson",
      role: "Product Manager at TechCorp"
    },
    {
      text: "The most intuitive project management tool we've ever used. It's like it reads our minds!",
      author: "Mike Chen",
      role: "CTO at StartupX"
    },
    {
      text: "Finally, a collaboration tool that actually makes our work easier instead of adding complexity.",
      author: "Emily Rodriguez",
      role: "Team Lead at InnovateCo"
    }
  ];

  return (
    <div className="app-container">
      <nav className="nav-bar">
        <div className="nav-content">
          <span className="logo">Colabor8</span>
          
          {isSignedIn && (
            <div className="nav-links">
              <Link to="/todo" className="nav-link">
                <CheckSquare size={20} />
                <span>Todo</span>
              </Link>
              <Link to="/board" className="nav-link">
                <Layout size={20} />
                <span>Board</span>
              </Link>
              <Link to="/gitboard" className="nav-link">
                <Github size={20} />
                <span>GitHub</span>
              </Link>
            </div>
          )}
        </div>
      </nav>

      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">All great projects start with Colabor8</h1>
          <p className="hero-subtitle">
            Empower your team with AI-driven collaboration tools that make project management effortless.
          </p>
          
          {!isSignedIn && (
            <div className="signup-container">
              <input
                type="email"
                placeholder="Work email"
                className="email-input"
              />
              <p className="terms-text">
                By clicking 'sign up' you agree to the Colabor8 Customer Agreement, which incorporates by reference the AI Product-Specific Terms, and acknowledge the Privacy Policy.
              </p>
              <button className="signup-button">Get Started Free</button>
              
              <div className="divider">
                <span>Or continue with</span>
              </div>
              
              <div className="social-buttons">
                {['Google', 'Microsoft', 'Apple', 'Slack'].map((provider) => (
                  <button key={provider} className="social-button">
                    {provider}
                  </button>
                ))}
              </div>
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
          <h2 className="section-title">Ready to transform your workflow?</h2>
          <button className="signup-button">Start Free Trial</button>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-column">
            <h3>Product</h3>
            <ul className="footer-links">
              <li><a href="#">Features</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Security</a></li>
              <li><a href="#">Enterprise</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Company</h3>
            <ul className="footer-links">
              <li><a href="#">About</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Press</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Resources</h3>
            <ul className="footer-links">
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">API</a></li>
              <li><a href="#">Status</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Legal</h3>
            <ul className="footer-links">
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Security</a></li>
              <li><a href="#">Cookies</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;