import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="logo">
          <h1>GOLD<span className="text-primary">X</span></h1>
        </div>
        <div className="nav-actions">
          <Link to="/login" className="btn btn-ghost">Login</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </nav>

      <main className="landing-main">
        <div className="hero-section">
          <div className="hero-glow"></div>
          <h1 className="hero-title">The Future of <br/><span className="text-primary">Digital Gold Trading</span></h1>
          <p className="hero-subtitle">
            Secure, fast, and transparent USDT platform. Build your digital portfolio, calculate your ROI, and unlock new wealth levels today.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary btn-large">Start Trading Now</Link>
            <Link to="/calculator" className="btn btn-secondary btn-large">Calculate ROI</Link>
          </div>
        </div>
        
        <div className="features-section">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Bank-Grade Security</h3>
            <p>Your assets are protected with industry-leading encryption and decentralized nodes. Safe and reliable.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Payouts</h3>
            <p>Withdraw your USDT earnings instantly without any hidden fees or prolonged processing delays.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Multi-Level Referrals</h3>
            <p>Earn passive income through our highly transparent, multi-tier referral compensation strategy.</p>
          </div>
        </div>
      </main>

      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} Gold X Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
