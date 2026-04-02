import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Zap, TrendingUp, ChevronRight, BarChart3, Lock, Users, Globe2 } from 'lucide-react';
import './Landing.css';

const Landing = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="landing-wrapper">
      <div className="landing-background">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="noise-overlay"></div>
      </div>

      <nav className="landing-nav-modern">
        <div className="logo-modern">
          <div className="logo-mark">GX</div>
          <h1>GOLD<span className="text-gold">X</span></h1>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it Works</a>
          <a href="#security">Security</a>
        </div>
        <div className="nav-actions">
          <Link to="/login" className="btn-modern ghost">Log In</Link>
          <Link to="/register" className="btn-modern primary">Get Started</Link>
        </div>
      </nav>

      <main className="landing-content">
        {/* Dynamic Hero Section */}
        <section className="hero-modern">
          <motion.div 
            initial="hidden" animate="visible" variants={staggerContainer}
            className="hero-text-content"
          >
            <motion.div variants={fadeUp} className="hero-badge">
              <span className="live-dot"></span> Web3 Ready Platform
            </motion.div>
            <motion.h1 variants={fadeUp} className="hero-heading">
              The Next Era of <br />
              <span className="gradient-text">Digital Wealth</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="hero-subtext">
              Institutional-grade infrastructure meets decentralized finance. 
              Trade USDT securely, scale your portfolio, and access multi-tier referral networks engineered for passive growth.
            </motion.p>
            <motion.div variants={fadeUp} className="hero-buttons">
              <Link to="/register" className="btn-modern primary lg">
                Start Trading <ChevronRight size={18} />
              </Link>
              <Link to="/calculator" className="btn-modern secondary lg">
                View ROI Calculator
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Abstract Hero Graphic */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1.2, delay: 0.3 }}
            className="hero-graphic"
          >
            <div className="glass-panel main-panel">
              <div className="panel-header">
                <div>
                  <p className="panel-label">Total Portfolio</p>
                  <h3 className="panel-value">124,592.00 <span className="text-gold">USDT</span></h3>
                </div>
                <div className="trend-up">+14.2% <TrendingUp size={16}/></div>
              </div>
              <div className="graph-bars">
                <div className="bar b1"></div>
                <div className="bar b2"></div>
                <div className="bar b3"></div>
                <div className="bar b4"></div>
                <div className="bar b5"></div>
              </div>
            </div>
            <div className="glass-panel minor-panel floating-1">
              <Shield className="text-gold" size={24} />
              <div className="panel-text">
                <p>Encrypted</p>
                <span>Vault Status</span>
              </div>
            </div>
            <div className="glass-panel minor-panel floating-2">
              <Zap className="text-gold" size={24} />
              <div className="panel-text">
                <p>Instant</p>
                <span>Settlement</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="stats-modern">
          <div className="stat-block">
            <h2>$2.4B+</h2>
            <p>Quarterly Volume</p>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-block">
            <h2>142K+</h2>
            <p>Active Investors</p>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-block">
            <h2>0.01s</h2>
            <p>Execution Latency</p>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section id="features" className="bento-section">
          <div className="section-head">
            <h2>Engineered for <span className="text-gold">Excellence</span></h2>
            <p>Everything you need to dominate the market, built into one seamless ecosystem.</p>
          </div>
          
          <div className="bento-grid">
            <div className="bento-card large">
              <div className="bento-content">
                <div className="icon-wrapper"><Globe2 size={28} /></div>
                <h3>Global Liquidity Pools</h3>
                <p>Access deep liquidity across major exchanges with zero slippage. Our proprietary routing algorithms ensure you always get the best execution price.</p>
              </div>
              <div className="bento-visual map-bg"></div>
            </div>
            <div className="bento-card medium">
              <div className="bento-content">
                <div className="icon-wrapper"><Lock size={28} /></div>
                <h3>Military-Grade Security</h3>
                <p>Cold storage architecture with multi-sig protocols and real-time threat detection.</p>
              </div>
            </div>
            <div className="bento-card medium">
              <div className="bento-content">
                <div className="icon-wrapper"><Users size={28} /></div>
                <h3>Unlimited Referrals</h3>
                <p>Scale your income exponentially with our 10-tier dynamic compensation plan.</p>
              </div>
            </div>
            <div className="bento-card wide">
              <div className="bento-content horizontal">
                <div className="flex-text">
                  <div className="icon-wrapper"><BarChart3 size={28} /></div>
                  <h3>Advanced Analytics</h3>
                  <p>Track your downline performance, visualize ROI projections, and manage your portfolio with institutional-grade charting tools.</p>
                </div>
                <div className="chart-abstract">
                  <div className="line-chart"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to action */}
        <section className="cta-modern">
          <div className="cta-box">
            <h2>Ready to build your legacy?</h2>
            <p>Join thousands of high-net-worth individuals scaling their portfolios with Gold X.</p>
            <Link to="/register" className="btn-modern cta-btn">Create Free Account</Link>
          </div>
        </section>
      </main>

      <footer className="footer-modern">
        <div className="footer-container">
          <div className="brand-col">
            <div className="logo-modern">
              <div className="logo-mark">GX</div>
              <h2>GOLD<span className="text-gold">X</span></h2>
            </div>
            <p>The definitive standard in digital asset management and automated yield generation.</p>
          </div>
          <div className="links-col">
            <h4>Platform</h4>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/calculator">Calculator</Link>
            <Link to="/transactions">Transactions</Link>
          </div>
          <div className="links-col">
            <h4>Company</h4>
            <a href="#about">About</a>
            <a href="#careers">Careers</a>
            <a href="#security">Security</a>
          </div>
          <div className="links-col">
            <h4>Legal</h4>
            <a href="#terms">Terms of Service</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#compliance">Compliance</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Gold X International. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
