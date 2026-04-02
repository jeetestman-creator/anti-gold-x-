import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import './Calculator.css';

const Calculator = () => {
  // ROI Calculation State
  const [investmentAmount, setInvestmentAmount] = useState(100);
  const [roiRate, setRoiRate] = useState(5.0); // 5% default
  const [duration, setDuration] = useState(30); // 30 days
  const [durationUnit, setDurationUnit] = useState('Days');

  // Outputs
  const [netInvested, setNetInvested] = useState(0);
  const [dailyRoi, setDailyRoi] = useState(0);
  const [totalRoi, setTotalRoi] = useState(0);
  const [totalReturn, setTotalReturn] = useState(0);
  const [roiData, setRoiData] = useState([]);

  useEffect(() => {
    // Re-calculate dynamically
    const depositFee = investmentAmount * 0.05;
    const net = investmentAmount - depositFee;
    setNetInvested(net);

    const actualDaysInMonth = 30; // standard month length
    const mRoi = (net * (roiRate / 100));
    const dRoi = mRoi / actualDaysInMonth;
    setDailyRoi(dRoi);

    let daysDuration = durationUnit === 'Days' ? duration : duration * actualDaysInMonth;
    const tRoi = dRoi * daysDuration;
    setTotalRoi(tRoi);

    const fullReturn = net + tRoi;
    const withdrawFee = fullReturn * 0.05;
    setTotalReturn(fullReturn - withdrawFee);

    // Chart Data Generation
    let genData = [];
    let currentTotal = 0;
    let limit = durationUnit === 'Days' ? daysDuration : duration;
    for (let i = 0; i <= limit; i++) {
        if(i > 0) currentTotal += (durationUnit === 'Days' ? dRoi : mRoi);
        genData.push({ time: i, ROI: parseFloat(currentTotal.toFixed(2)) });
    }
    setRoiData(genData);
  }, [investmentAmount, roiRate, duration, durationUnit]);

  return (
    <div className="calculator-wrapper page-container">
      <h1 className="calc-header">Investment & Return Calculator</h1>
      <p className="calc-sub">Estimate your projected ROI and Referral Commissions with real-time analytics.</p>
      
      <div className="calc-grid">
        <div className="calc-panel form-card">
          <h2>Personal ROI Configuration</h2>
          <div className="input-group">
            <label>Investment Amount (USDT)</label>
            <input type="number" value={investmentAmount} onChange={e => setInvestmentAmount(Number(e.target.value))} min="100"/>
          </div>
          <div className="input-group">
            <label>Expected Monthly ROI Rate (%)</label>
            <input type="number" value={roiRate} onChange={e => setRoiRate(Number(e.target.value))} step="0.1"/>
          </div>
          <div className="input-group">
            <label>Duration</label>
            <div className="duration-split">
              <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} min="1"/>
              <select value={durationUnit} onChange={e => setDurationUnit(e.target.value)}>
                <option value="Days">Days</option>
                <option value="Months">Months</option>
              </select>
            </div>
          </div>
          <div className="summary-section">
            <div className="summary-row"><span>Net Invested Amount:</span> <strong>{netInvested.toFixed(2)} USDT</strong></div>
            <div className="summary-row"><span>Expected Daily ROI:</span> <strong>{dailyRoi.toFixed(2)} USDT</strong></div>
            <div className="summary-row"><span>Total ROI Mined:</span> <strong className="highlight">{totalRoi.toFixed(2)} USDT</strong></div>
            <div className="summary-row"><span>Total Net Payout:</span> <strong>{totalReturn.toFixed(2)} USDT</strong></div>
          </div>
          <button className="btn btn-secondary pdf-export">Export as PDF</button>
        </div>

        <div className="calc-panel chart-panel card">
          <h2>ROI Growth Over Time</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={roiData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
                    <XAxis dataKey="time" stroke="#888" label={{ value: durationUnit, position: 'insideBottom', offset: -5 }} />
                    <YAxis stroke="#888" label={{ value: 'USDT', angle: -90, position: 'insideLeft' }} />
                    <RechartsTooltip contentStyle={{backgroundColor: '#1a1b1e', border: '1px solid #d4af37'}} itemStyle={{color: '#d4af37'}} />
                    <Line type="monotone" dataKey="ROI" stroke="#d4af37" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="disclaimer">* These figures are estimates based on the entered values and current ROI rate. Actual returns may vary.</p>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
