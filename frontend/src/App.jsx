import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Calculator from './pages/Calculator/Calculator';
import Landing from './pages/Landing/Landing';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import OtpVerification from './pages/OtpVerification/OtpVerification';
import Dashboard from './pages/Dashboard/Dashboard';
import AdminPanel from './pages/AdminPanel/AdminPanel';
import Deposit from './pages/Deposit/Deposit';
import Withdraw from './pages/Withdraw/Withdraw';
import ReferralLevels from './pages/ReferralLevels/ReferralLevels';
import Profile from './pages/Profile/Profile';
import Transactions from './pages/Transactions/Transactions';
import Support from './pages/Support/Support';
import DownlineAnalytics from './pages/DownlineAnalytics/DownlineAnalytics';
import TeamGrowthSimulator from './pages/TeamGrowthSimulator/TeamGrowthSimulator';

const App = () => {
  return (
    <Router>
  <div className="app-wrapper">
    <Routes>
      <Route path="/calculator" element={<Calculator />} />
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otpverification" element={<OtpVerification />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/admin/*" element={<AdminPanel />} />
      <Route path="/deposit" element={<Deposit />} />
      <Route path="/withdraw" element={<Withdraw />} />
      <Route path="/referrallevels" element={<ReferralLevels />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/support" element={<Support />} />
      <Route path="/downline-analytics" element={<DownlineAnalytics />} />
      <Route path="/teamgrowthsimulator" element={<TeamGrowthSimulator />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </div>
</Router>
  );
};

export default App;
