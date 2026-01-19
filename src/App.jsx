'use client'; 

import React, { useState, useEffect, useRef } from 'react';

import { 
  Clock, DollarSign, Battery, TrendingDown, Activity, 
  Pause, Play, Sliders, Terminal, RotateCcw, Download,
  BrainCircuit, Zap, Sun, ArrowRight, FileText  // <--- ADDED FileText
} from 'lucide-react';

import { 
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell // <--- ADDED Cell
} from 'recharts';


import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

// --- MAIN APP COMPONENT ---
export default function App() {
  const [step, setStep] = useState(1); 
  
  const [inputs, setInputs] = useState({
    ratePeak: 18.0, rateNormal: 10.0, rateOffPeak: 6.0,
    batteryCap: 200, initialSoc: 50, minSocLimit: 10, 
    roundTripEff: 92, cycleDegradation: 2.0,
    inverterMaxPower: 50, gridLimit: 90,
    baseLoad: 60, loadVolatility: 15,
    hasSolar: false, solarCapacity: 60,
    simSpeed: 1000
  });

  const [simResults, setSimResults] = useState(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto h-screen flex flex-col">
        {/* HEADER */}
        <header className="p-6 flex items-center justify-between border-b border-slate-800/50 backdrop-blur-md">
           <div 
             className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
             onClick={() => setStep(1)}
           >
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg shadow-purple-500/20">
                 <BrainCircuit className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">GridFlex</h1>
           </div>
           
           {step === 3 && (
             <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full animate-pulse">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs font-bold text-green-400">OPTIMIZER RUNNING</span>
             </div>
           )}
        </header>

        <main className="flex-1 flex flex-col relative overflow-hidden">
           {step === 1 && <LandingPage onNext={() => setStep(2)} />}
           {step === 2 && <ConfigPage inputs={inputs} setInputs={setInputs} onNext={() => setStep(3)} />}
           {step === 3 && <LiveSimulation inputs={inputs} onComplete={(data) => { setSimResults(data); setStep(4); }} />}
           {step === 4 && <ReportPage data={simResults} inputs={inputs} onRestart={() => setStep(2)} />}
        </main>
      </div>
    </div>
  );
}

// --- STEP 1: LANDING PAGE ---
const LandingPage = ({ onNext }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-20">
    <div className="text-center animate-fade-in-up">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-700 backdrop-blur-sm text-slate-400 text-sm mb-8 shadow-lg shadow-black/20">
        <Zap size={16} className="text-yellow-400 animate-pulse" />
        <span className="font-medium tracking-wide">Algorithmic Energy Management System</span>
      </div>

      <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight tracking-tight drop-shadow-2xl">
          Optimize Your<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-x">
            Energy Strategy.
          </span>
      </h1>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mb-16 px-4">
      {/* 1. PEAK SHAVING EXPLANATION */}
      <FeatureCard 
        icon={<Activity size={24} className="text-red-400" />}
        color="bg-red-500/10"
        border="group-hover:border-red-500/50"
        title="Peak Shaving"
        desc="The process of flattening demand spikes. The system discharges power during high-usage moments to prevent exceeding grid limits, avoiding costly demand charges."
        delay="0ms"
      />
      
      {/* 2. ARBITRAGE EXPLANATION */}
      <FeatureCard 
        icon={<DollarSign size={24} className="text-emerald-400" />}
        color="bg-emerald-500/10"
        border="group-hover:border-emerald-500/50"
        title="Energy Arbitrage"
        desc="The strategy of 'Buy Low, Sell High.' We algorithmically charge the battery when rates are cheap (off-peak) and discharge when prices spike, maximizing ROI."
        delay="100ms"
      />

      {/* 3. SOLAR (Unchanged) */}
      <FeatureCard 
        icon={<Sun size={24} className="text-yellow-400" />}
        color="bg-yellow-500/10"
        border="group-hover:border-yellow-500/50"
        title="Solar Integration"
        desc="Store excess solar power generated during the day to power your facility at night, reducing reliance on the main grid."
        delay="200ms"
      />
    </div>

    <div className="animate-fade-in-up" style={{animationDelay: '300ms'}}>
      <button 
        onClick={onNext} 
        className="group relative px-10 py-5 bg-white text-slate-950 text-lg font-bold rounded-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.2)] overflow-hidden"
      >
         <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
         <span className="relative z-10">Start Optimization</span>
         <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
      </button>
    </div>
  </div>
);
const FeatureCard = ({ icon, color, border, title, desc, delay }) => (
  <div 
    className={`group p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-sm hover:bg-slate-900/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-900/20 cursor-default ${border} animate-fade-in-up`}
    style={{ animationDelay: delay, animationFillMode: 'backwards' }}
  >
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
       {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-100 transition-colors">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
      {desc}
    </p>
  </div>
);

//// --- STEP 2: CONFIG PAGE ---
const ConfigPage = ({ inputs, setInputs, onNext }) => {
  const handleChange = (key, val) => setInputs(prev => ({ ...prev, [key]: parseFloat(val) }));
  const handleTextChange = (key, val) => setInputs(prev => ({ ...prev, [key]: val }));

  return (
    <div className="h-full overflow-y-auto p-6 animate-fade-in-up custom-scrollbar">
      <div className="max-w-5xl mx-auto pb-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">System Configuration</h2>
          <p className="text-slate-400">Define your energy scenario parameters.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
             <div className="glass-panel p-6 space-y-6 border-l-4 border-l-emerald-500">
                <h3 className="flex items-center gap-2 text-emerald-400 font-bold border-b border-slate-700/50 pb-2">
                   <DollarSign size={20}/> Tariff Structure (ToU)
                </h3>
                
                {/* Peak Rate */}
                <div className="flex items-center gap-4 group">
                    <div className="p-3 bg-red-500/10 rounded-lg text-red-400 group-hover:bg-red-500/20 transition-colors">
                        <TrendingDown className="rotate-180" size={20}/>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between mb-1">
                            <label className="text-sm font-bold text-slate-200">Peak Rate <span className="text-slate-500 font-normal text-xs ml-1">(18:00 - 22:00)</span></label>
                            <span className="text-xs text-red-400 font-mono">High Cost</span>
                        </div>
                        <input 
                            type="number" value={inputs.ratePeak} onChange={e => handleChange('ratePeak', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                        />
                    </div>
                </div>

                {/* Normal Rate */}
                <div className="flex items-center gap-4 group">
                    <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                        <Sun size={20}/>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between mb-1">
                            <label className="text-sm font-bold text-slate-200">Standard Rate <span className="text-slate-500 font-normal text-xs ml-1">(Daytime)</span></label>
                            <span className="text-xs text-blue-400 font-mono">Baseline</span>
                        </div>
                        <input 
                            type="number" value={inputs.rateNormal} onChange={e => handleChange('rateNormal', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                {/* Off-Peak Rate */}
                <div className="flex items-center gap-4 group">
                    <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                        <TrendingDown size={20}/>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between mb-1">
                            <label className="text-sm font-bold text-slate-200">Off-Peak Rate <span className="text-slate-500 font-normal text-xs ml-1">(00:00 - 06:00)</span></label>
                            <span className="text-xs text-emerald-400 font-mono">Low Cost</span>
                        </div>
                        <input 
                            type="number" value={inputs.rateOffPeak} onChange={e => handleChange('rateOffPeak', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                </div>
             </div>

             <div className="glass-panel p-6 space-y-5 border-l-4 border-l-indigo-500">
                <h3 className="flex items-center gap-2 text-indigo-400 font-bold border-b border-slate-700/50 pb-2">
                   <Clock size={20}/> Simulation Control
                </h3>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-xs font-bold text-slate-300 uppercase mb-1 block">Start Time</label>
                      <input 
                        type="time" 
                        value={inputs.startTime || "00:00"} 
                        onChange={e => handleTextChange('startTime', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white focus:border-indigo-500 outline-none"
                      />
                   </div>
                   <div>
                      <label className="text-xs font-bold text-slate-300 uppercase mb-1 block">Sim Speed</label>
                      <select 
                          value={inputs.simSpeed} 
                          onChange={(e) => handleChange('simSpeed', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white focus:border-indigo-500 outline-none"
                      >
                          <option value={2000}>Slow (Analysis)</option>
                          <option value={1000}>Normal</option>
                          <option value={200}>Turbo</option>
                      </select>
                   </div>
                </div>
             </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
             <div className="glass-panel p-6 space-y-5 border-l-4 border-l-blue-500">
                <h3 className="flex items-center gap-2 text-blue-400 font-bold border-b border-slate-700/50 pb-2">
                   <Battery size={20}/> Grid & Storage
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                   <SimpleInput label="Grid Load (kW)" value={inputs.baseLoad} onChange={v => handleChange('baseLoad', v)} />
                   <SimpleInput label="Grid Limit (kW)" value={inputs.gridLimit} onChange={v => handleChange('gridLimit', v)} />
                </div>

                <div className="h-px bg-slate-800 my-2"></div>

                <div className="grid grid-cols-2 gap-4">
                   <SimpleInput label="Battery Size (kWh)" value={inputs.batteryCap} onChange={v => handleChange('batteryCap', v)} />
                   <SimpleInput label="Rating (kW)" value={inputs.inverterMaxPower} onChange={v => handleChange('inverterMaxPower', v)} />
                   
                   {/* --- NEW OPTION ADDED HERE --- */}
                   <SimpleInput label="Wear Cost (₹/kWh)" value={inputs.cycleDegradation} onChange={v => handleChange('cycleDegradation', v)} />
                </div>
                
                <div className="pt-2">
                   <label className="text-xs font-bold text-slate-300 uppercase mb-2 flex justify-between">
                      Initial Charge 
                      <span className="text-emerald-400">{inputs.initialSoc}%</span>
                   </label>
                   <input 
                      type="range" min="0" max="100" step="5"
                      value={inputs.initialSoc} 
                      onChange={e => handleChange('initialSoc', e.target.value)}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                   />
                </div>
             </div>

             <div className={`glass-panel p-6 space-y-4 border transition-all duration-300 ${inputs.hasSolar ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-slate-800'}`}>
                 <div className="flex justify-between items-center">
                    <h3 className={`flex items-center gap-2 font-bold transition-colors ${inputs.hasSolar ? 'text-yellow-400' : 'text-slate-500'}`}>
                       <Sun size={20}/> Solar Installation
                    </h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={inputs.hasSolar} onChange={e => setInputs({...inputs, hasSolar: e.target.checked})} />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:bg-yellow-500 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                 </div>
                 
                 {inputs.hasSolar && (
                    <div className="animate-fade-in pt-2">
                       <SimpleInput label="Solar Capacity (kWp)" value={inputs.solarCapacity} onChange={v => handleChange('solarCapacity', v)} />
                    </div>
                 )}
             </div>
          </div>
        </div>

        <div className="mt-10 flex justify-end animate-fade-in-up" style={{animationDelay: '100ms'}}>
            <button 
               onClick={onNext} 
               className="group px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:scale-105 transition-all shadow-xl shadow-indigo-500/10 flex items-center gap-3"
            >
               <span>Launch Optimization</span>
               <div className="p-1 bg-slate-900 rounded-full text-white group-hover:bg-indigo-600 transition-colors">
                  <ArrowRight size={16} />
               </div>
            </button>
        </div>
      </div>
    </div>
  );
};

const SimpleInput = ({ label, value, onChange }) => (
  <div>
     <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">{label}</label>
     <input 
        type="number" 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 font-mono focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" 
     />
  </div>
);
export const LiveSimulation = ({ inputs, onComplete }) => {
  // --- 1. SAFEGUARD INPUTS ---
  const safeInputs = {
    // Basic Params
    initialSoc: parseFloat(inputs.initialSoc) || 0,
    batteryCap: parseFloat(inputs.batteryCap) || 10,
    minSocLimit: parseFloat(inputs.minSocLimit) || 10,
    gridLimit: parseFloat(inputs.gridLimit) || 100,
    solarCapacity: parseFloat(inputs.solarCapacity) || 0,
    baseLoad: parseFloat(inputs.baseLoad) || 0,
    
    // Financials
    rateNormal: parseFloat(inputs.rateNormal) || 0,
    ratePeak: parseFloat(inputs.ratePeak) || 0,
    rateOffPeak: parseFloat(inputs.rateOffPeak) || 0,
    
    // Physics & Wear
    cycleDegradation: parseFloat(inputs.cycleDegradation) || 0, // <--- NEW: Wear Cost
    roundTripEff: parseFloat(inputs.roundTripEff) || 90,
    
    // System
    simSpeed: parseFloat(inputs.simSpeed) || 1000,
    hasSolar: inputs.hasSolar,
    loadVolatility: parseFloat(inputs.loadVolatility) || 0,
    inverterMaxPower: parseFloat(inputs.inverterMaxPower) || 1000
  };

  const [ticks, setTicks] = useState(0);
  const [batteryKwh, setBatteryKwh] = useState((safeInputs.initialSoc / 100) * safeInputs.batteryCap);
  
  // Track specific costs for the Report
  const [financials, setFinancials] = useState({ 
    baseCost: 0,   // Bill without system
    totalCost: 0,  // Bill with system + Wear Cost
    saved: 0,      // Net Profit
    solarUsed: 0 
  });

  const [logs, setLogs] = useState([]);
  const [history, setHistory] = useState([]);
  const [optimizationPlan, setOptimizationPlan] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const [manualBias, setManualBias] = useState({
    loadAdded: 0, 
    gridAvailability: safeInputs.gridLimit 
  });

  const logsEndRef = useRef(null);

  // 1. STRATEGY ENGINE (Runs once on mount)
  useEffect(() => {
    const plan = [];
    const solarProfile = [];
    const loadProfile = [];
    const priceProfile = [];
    
    for(let h=0; h<24; h++) {
       // Solar
       let sol = 0;
       if (safeInputs.hasSolar && h >= 6 && h <= 18) {
           sol = safeInputs.solarCapacity * Math.sin(((h - 6) / 12) * Math.PI);
       }
       solarProfile.push(Math.max(0, sol));

       // Load with randomness
       const volatility = safeInputs.loadVolatility / 100; 
       const randomFactor = 1 + (Math.random() * volatility * 2 - volatility);
       let hourFactor = (h > 8 && h < 18) ? 1.2 : 0.8;
       loadProfile.push(safeInputs.baseLoad * hourFactor * randomFactor);

       // Price
       let p = safeInputs.rateNormal;
       if (h < 6) p = safeInputs.rateOffPeak;
       else if ((h >= 18 && h < 22) || (h >= 10 && h < 14)) p = safeInputs.ratePeak;
       priceProfile.push(p);
    }

    let simSoc = (safeInputs.initialSoc / 100) * safeInputs.batteryCap;
    const minKwh = (safeInputs.minSocLimit / 100) * safeInputs.batteryCap;
    
    // Plan Battery Actions
    for(let h=0; h<24; h++) {
       const netLoad = Math.max(0, loadProfile[h] - solarProfile[h]);
       const currentPrice = priceProfile[h];
       
       let action = "IDLE";
       let amount = 0;

       const availableToDischarge = simSoc - minKwh;
       const availableToCharge = safeInputs.batteryCap - simSoc;

       // Strategy Logic
       if (simSoc <= minKwh + (safeInputs.batteryCap * 0.05) && currentPrice !== safeInputs.ratePeak) {
             amount = Math.min(safeInputs.inverterMaxPower, availableToCharge);
             action = "RECOVERY_CHARGE";
       }
       else if (netLoad > safeInputs.gridLimit) {
           const needed = netLoad - safeInputs.gridLimit;
           amount = -Math.min(needed, availableToDischarge, safeInputs.inverterMaxPower);
           if (Math.abs(amount) > 0) action = "PEAK_SHAVE";
       }
       else if (currentPrice === safeInputs.ratePeak && availableToDischarge > 0) {
           amount = -Math.min(availableToDischarge, safeInputs.inverterMaxPower);
           action = "ARBITRAGE_SELL";
       }
       else if (currentPrice === safeInputs.rateOffPeak) {
           // Only charge if Price Delta > Wear Cost
           const margin = safeInputs.ratePeak - (safeInputs.rateOffPeak + safeInputs.cycleDegradation);
           if (availableToCharge > 0 && margin > 0) {
               amount = Math.min(availableToCharge, safeInputs.inverterMaxPower);
               action = "SMART_CHARGE";
           }
       }

       simSoc += amount;
       if(simSoc > safeInputs.batteryCap) simSoc = safeInputs.batteryCap;
       if(simSoc < 0) simSoc = 0;

       plan.push({ 
           hour: h, plannedAction: action, plannedAmount: amount, 
           forecastLoad: loadProfile[h], forecastSolar: solarProfile[h], price: priceProfile[h]
       });
    }
    setOptimizationPlan(plan);
    setLogs(prev => [...prev, { time: "00:00", msg: "Strategy Optimized (Wear Cost Included).", type: "SYS" }]);
  }, [inputs]);

  // 2. SIMULATION LOOP
  useEffect(() => {
    let timer;
    if (isPlaying && ticks < 24 && optimizationPlan.length > 0) {
      timer = setTimeout(() => runSimulationTick(), safeInputs.simSpeed);
    } else if (ticks >= 24) {
      // COMPLETE
      const totalLoad = history.reduce((acc, curr) => acc + curr.load, 0);
      const totalGrid = history.reduce((acc, curr) => acc + curr.grid, 0);
      const maxLoad = Math.max(...history.map(h => h.load));
      const maxGrid = Math.max(...history.map(h => h.grid));

      onComplete({ 
          history, 
          financials, 
          logs, 
          metrics: { 
            gridIndependence: totalLoad > 0 ? ((totalLoad - totalGrid) / totalLoad) * 100 : 0,
            peakReduction: maxLoad > 0 ? ((maxLoad - maxGrid) / maxLoad) * 100 : 0
          }
      });
    }
    return () => clearTimeout(timer);
  }, [isPlaying, ticks, optimizationPlan]);

  // Scroll to bottom of logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // 3. PROCESS ONE HOUR
  const runSimulationTick = () => {
    const planStep = optimizationPlan[ticks];
    if(!planStep) return;

    // Real world chaos
    const chaos = 1 + (Math.random() * 0.05 - 0.025); 
    const realLoad = (planStep.forecastLoad * chaos) + manualBias.loadAdded; 
    const realSolar = planStep.forecastSolar * chaos; 
    
    // Battery Limits
    let intendedBat = planStep.plannedAmount;
    let actualBat = intendedBat;
    const minKwh = (safeInputs.minSocLimit / 100) * safeInputs.batteryCap;
    
    if (intendedBat < 0) { 
        if ((batteryKwh + intendedBat) < minKwh) actualBat = -(batteryKwh - minKwh);
    } else { 
        if ((batteryKwh + intendedBat) > safeInputs.batteryCap) actualBat = safeInputs.batteryCap - batteryKwh;
    }

    // --- PHYSICS: Efficiency Loss (Heat) ---
    // If you charge 10kWh, you pull 11kWh from grid (Heat loss cost is in electric bill)
    const effDecimal = safeInputs.roundTripEff / 100;
    let storageDelta = actualBat;       
    let batteryGridImpact = actualBat;  

    if (actualBat > 0) {
        storageDelta = actualBat * Math.sqrt(effDecimal); 
        batteryGridImpact = actualBat / Math.sqrt(effDecimal);
    } else if (actualBat < 0) {
        storageDelta = actualBat; 
        batteryGridImpact = actualBat * Math.sqrt(effDecimal); 
    }

    // Grid Draw
    const netLoad = Math.max(0, realLoad - realSolar);
    let desiredGridDraw = netLoad + batteryGridImpact;
    let gridDraw = Math.min(Math.max(0, desiredGridDraw), manualBias.gridAvailability);

    setBatteryKwh(prev => prev + storageDelta);
    
    // --- ECONOMICS: The "Wear Cost" Update ---
    const costNoSys = realLoad * planStep.price; // Baseline Cost
    const costElectricBill = gridDraw * planStep.price; // Actual Bill
    
    // We charge for every kWh that passes through the battery (Usage * Wear Rate)
    const wearCost = Math.abs(storageDelta) * safeInputs.cycleDegradation;
    
    const trueTotalCost = costElectricBill + wearCost;
    
    setFinancials(prev => ({
        baseCost: prev.baseCost + costNoSys,
        totalCost: prev.totalCost + trueTotalCost,
        // Savings = Baseline - (Bill + Wear)
        saved: prev.saved + (costNoSys - trueTotalCost),
        solarUsed: prev.solarUsed + realSolar 
    }));

    // Logs
   // --- UPDATED LOGS LOGIC ---
    let logMsg = "";
    let type = planStep.plannedAction;
    
    // 1. First, determine what the battery is DOING
    if (storageDelta < 0) logMsg = `Discharging (${Math.round(Math.abs(storageDelta))}kWh)`;
    else if (storageDelta > 0) logMsg = `Charging (${Math.round(storageDelta)}kWh)`;
    else logMsg = "Monitoring (Idle)";

    // 2. Then, check for Manual Overrides and ADD to the message, don't replace it
    if (manualBias.loadAdded > 20) {
        logMsg = `⚠️ High Load: ${logMsg}`; 
        type = "WARN"; // Makes text yellow
    } 
    else if (manualBias.gridAvailability < safeInputs.gridLimit) {
        logMsg = `⚠️ Grid Limit: ${logMsg}`;
        type = "WARN";
    }
    // 3. If no manual override, give more specific strategy details
    else {
        if (type === "PEAK_SHAVE") logMsg = `Peak Shave: ${logMsg}`;
        else if (type === "ARBITRAGE_SELL") logMsg = `Arbitrage: ${logMsg}`;
        else if (type === "SMART_CHARGE") logMsg = `Smart Charge: ${logMsg}`;
    }

    setLogs(prev => [...prev, { time: `${ticks}:00`, msg: logMsg, type }]);
    
    setHistory(prev => [...prev, {
       hour: `${ticks}:00`,
       grid: Math.round(gridDraw),
       load: Math.round(realLoad),
       solar: Math.round(realSolar),
       battery: Math.round(batteryGridImpact),
       soc: Math.round(((batteryKwh + storageDelta) / safeInputs.batteryCap) * 100),
       price: planStep.price,
       limit: manualBias.gridAvailability
    }]);

    setTicks(t => t + 1);
  };

  const socPercent = Math.round((batteryKwh / safeInputs.batteryCap) * 100);

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 h-full overflow-hidden animate-fade-in">
       {/* HUD */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-shrink-0">
          <StatCard label="Time" value={`${ticks}:00`} icon={<Clock size={16} className="text-blue-400"/>} />
          <StatCard label="Current Tariff" value={`₹${optimizationPlan[ticks]?.price || 0}`} sub="per kWh" icon={<DollarSign size={16} className="text-yellow-400"/>} />
          <StatCard label="Battery SoC" value={`${socPercent}%`} sub={`${Math.round(batteryKwh)} kWh`} icon={<Battery size={16} className={socPercent < safeInputs.minSocLimit ? "text-red-400" : "text-emerald-400"}/>} />
          
          {/* Active Savings Display */}
          <StatCard 
            label="Real Savings" 
            value={`₹${Math.floor(financials.saved).toLocaleString()}`} 
            sub="Adjusted for Wear"
            icon={<TrendingDown size={16} className="text-purple-400"/>} 
            active 
          />
       </div>

       <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0 relative z-0">
          {/* CHART AREA */}
          <div className="flex-[3] glass-panel p-4 relative flex flex-col overflow-hidden bg-slate-900 border border-slate-700 rounded-xl">
             <div className="flex justify-between items-center mb-2 flex-shrink-0 relative z-20">
                <h3 className="font-bold text-white flex items-center gap-2"><Activity size={16}/> Live Power Flow</h3>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsPlaying(!isPlaying)} 
                        className={`text-xs px-3 py-2 rounded text-white border font-bold flex items-center gap-2 transition-all ${isPlaying ? 'bg-slate-800 border-slate-600 hover:bg-slate-700' : 'bg-yellow-500/20 border-yellow-500 text-yellow-400 animate-pulse'}`}
                    >
                        {isPlaying ? <><Pause size={12}/> PAUSE</> : <><Play size={12}/> RESUME</>}
                    </button>
                </div>
             </div>
             
             <div className="flex-1 w-full min-h-0 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                   <ComposedChart data={history} margin={{top: 10, right: 10, left: 0, bottom: 0}}>
                      <defs>
                        <linearGradient id="colorGrid" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="hour" stroke="#475569" tick={{fontSize: 10}} />
                      <YAxis stroke="#64748b" tick={{fontSize: 10}} />
                      <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px'}} />
                      <Legend />
                      <Area type="monotone" dataKey="solar" stackId="1" fill="#eab308" stroke="none" fillOpacity={0.6} name="Solar" />
                      <Area type="monotone" dataKey="grid" stackId="1" fill="url(#colorGrid)" stroke="#06b6d4" strokeWidth={2} name="Grid Import" />
                      <Line type="step" dataKey="limit" stroke="#94a3b8" strokeDasharray="5 5" dot={false} name="Grid Limit" />
                      <Line type="monotone" dataKey="soc" stroke="#10b981" strokeWidth={2} dot={false} name="Battery SoC %" yAxisId={0} />
                   </ComposedChart>
                </ResponsiveContainer>
             </div>

             {/* MANUAL CONTROLS OVERLAY */}
             {!isPlaying && (
                <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center animate-fade-in">
                    <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-2xl w-80 max-w-full">
                        <div className="flex items-center gap-2 mb-6 text-yellow-400 border-b border-slate-800 pb-3">
                            <Sliders size={20} />
                            <h3 className="font-bold text-lg">Manual Override</h3>
                        </div>
                        <div className="mb-6">
                            <div className="flex justify-between text-sm text-slate-300 mb-2">
                                <span>Inject Load Spike</span>
                                <span className="font-mono text-cyan-400 font-bold">+{Math.round(manualBias.loadAdded)} kW</span>
                            </div>
                            <input 
                                type="range" min="0" max="100" step="5"
                                value={manualBias.loadAdded}
                                onChange={(e) => setManualBias({...manualBias, loadAdded: parseInt(e.target.value)})}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                            />
                        </div>
                        <div className="mb-8">
                            <div className="flex justify-between text-sm text-slate-300 mb-2">
                                <span>Force Grid Limit</span>
                                <span className="font-mono text-red-400 font-bold">{manualBias.gridAvailability} kW</span>
                            </div>
                            <input 
                                type="range" min="0" max={safeInputs.baseLoad * 2} step="5"
                                value={manualBias.gridAvailability}
                                onChange={(e) => setManualBias({...manualBias, gridAvailability: parseInt(e.target.value)})}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                            />
                        </div>
                        <button 
                            onClick={() => setIsPlaying(true)}
                            className="w-full py-3 bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <Play size={16} fill="currentColor"/> Resume
                        </button>
                    </div>
                </div>
             )}
          </div>

          {/* SYSTEM LOGS */}
          <div className="flex-1 lg:max-w-xs p-0 flex flex-col overflow-hidden bg-black border border-slate-800 rounded-xl shadow-inner h-[250px] lg:h-auto">
             <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                   <Terminal size={14} className="text-emerald-500" />
                   <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">System Events</span>
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-[11px] bg-black text-slate-300 custom-scrollbar relative">
                {logs.map((log, i) => (
                   <div key={i} className="animate-fade-in flex items-start gap-2 border-b border-slate-900/50 pb-1">
                      <span className="text-slate-600 shrink-0">[{log.time}]</span>
                      <span className={
                          log.type === "WARN" ? "text-yellow-400 font-bold" :
                          log.msg.includes("Charging") || log.type === "RECOVERY_CHARGE" ? "text-emerald-400 font-bold" :
                          log.msg.includes("Discharging") || log.type === "PEAK_SHAVE" ? "text-orange-400 font-bold" :
                          "text-slate-400"
                      }>
                        {log.msg.includes("Charging") && '⚡ '}
                        {log.msg.includes("Discharging") && '🔋 '}
                        {log.msg}
                      </span>
                   </div>
                ))}
                <div ref={logsEndRef} />
             </div>
          </div>
       </div>
    </div>
  );
};

// Helper for HUD Cards
const StatCard = ({ label, value, sub, icon, active }) => (
    <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${active ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-slate-900 border-slate-800'}`}>
       <div className="flex justify-between items-start mb-2">
          <span className="text-slate-400 text-xs font-bold uppercase">{label}</span>
          {icon}
       </div>
       <div>
          <div className="text-2xl font-bold text-white">{value}</div>
          {sub && <div className="text-xs text-slate-500 font-mono mt-1">{sub}</div>}
       </div>
    </div>
);

//FIXED REPORT PAGE COMPONENT -export const ReportPage = ({ data, inputs, onRestart }) => {
  export const ReportPage = ({ data, inputs, onRestart }) => {
  const reportRef = useRef(null);

  // 1. Safety & Default Values
  const financials = data?.financials || { baseCost: 0, totalCost: 0 };
  const logs = data?.logs || [];
  const history = data?.history || []; 
  
  const baseBill = financials.baseCost;
  const optimizedBill = financials.totalCost;
  const totalSavings = baseBill - optimizedBill;
  const savingsPercent = baseBill > 0 ? ((totalSavings / baseBill) * 100).toFixed(1) : "0.0";

  // 2. Chart Data for Comparison
  const comparisonData = [
    { name: 'Without System', value: baseBill, color: '#ef4444' }, // Red
    { name: 'With GridFlex', value: optimizedBill, color: '#10b981' } // Green
  ];

  // 3. FIXED PDF GENERATION
  const generatePDF = async () => {
    if (!reportRef.current) return;
    
    try {
      // A. Capture the entire dashboard
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#0f172a',
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // --- Header Text ---
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(22);
      pdf.setTextColor(40, 40, 40); 
      pdf.text("GridFlex Simulation Report", 14, 20); 

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      const dateStr = new Date().toLocaleString();
      pdf.text(`Generated: ${dateStr}`, 14, 27); 

      // --- Dashboard Image (Shifted Down) ---
      pdf.addImage(imgData, 'PNG', 0, 35, pdfWidth, pdfHeight);

      // B. Add Logs Page (Only if we have logs)
      if (logs.length > 0) {
        pdf.addPage();
        pdf.setFontSize(16);
        pdf.setTextColor(40, 40, 40);
        pdf.text("Simulation Log Breakdown", 14, 20);
        
        const tableRows = logs.map(log => [
          log.time, 
          log.type, 
          log.msg.replace('⚠️', '')
        ]);

        autoTable(pdf, {
          startY: 30,
          head: [['Time', 'Type', 'Event Description']],
          body: tableRows,
          theme: 'grid',
          headStyles: { fillColor: [79, 70, 229] },
          styles: { fontSize: 9 },
          columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 35 },
            2: { cellWidth: 'auto' }
          }
        });
      }

      pdf.save('GridFlex_Full_Report.pdf');

    } catch (err) {
      console.error("PDF Generation failed:", err);
      alert("PDF failed. See console for details.");
    }
  };

  // --- RETURN STATEMENT (Must be inside ReportPage) ---
  return (
    <div className="flex flex-col h-full animate-fade-in space-y-6 overflow-y-auto custom-scrollbar p-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Simulation Report</h2>
          <p className="text-slate-400">Performance Analysis & Financial Impact</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={generatePDF}
            className="px-5 py-2.5 rounded-lg font-bold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-all flex items-center gap-2"
          >
            <Download size={18} /> Save PDF
          </button>
          <button 
            onClick={onRestart}
            className="px-5 py-2.5 rounded-lg font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            <RotateCcw size={18} /> New Simulation
          </button>
        </div>
      </div>

      {/* --- PRINTABLE DASHBOARD CONTAINER --- */}
      <div ref={reportRef} id="report-content" className="p-8 bg-slate-950 rounded-2xl border border-slate-900 space-y-8">
        
        {/* SECTION 1: FINANCIAL OVERVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Cost Chart */}
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col justify-center min-h-[350px]">
            <div className="flex items-center gap-2 mb-6">
              <TrendingDown className="text-emerald-400" size={24} />
              <h3 className="text-xl font-bold text-white">Cost Comparison</h3>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={comparisonData} barSize={40}>
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100} 
                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff'}}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {comparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 text-center">
              <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Savings</div>
              <div className="text-5xl font-bold text-emerald-400 mt-2">{savingsPercent}%</div>
            </div>
          </div>

          {/* Bill Breakdown */}
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 relative overflow-hidden flex flex-col justify-between min-h-[350px]">
            <div className="absolute top-[-10px] right-[-10px] opacity-5 rotate-12 pointer-events-none">
              <FileText size={180} className="text-white" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-8">Projected Statement</h3>
              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                  <span className="text-slate-400 font-medium">Base Cost (No System)</span>
                  <span className="text-2xl font-mono text-slate-200">₹{Math.floor(baseBill).toLocaleString()}</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-emerald-400">
                    <span className="flex items-center gap-2 text-sm font-medium"><ArrowRight size={16}/> Optimization Savings</span>
                    <span className="font-mono font-bold">- ₹{Math.floor(totalSavings).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-700 flex justify-between items-end mt-8 relative z-10">
              <span className="text-white font-bold text-lg">Final Optimized Bill</span>
              <span className="text-4xl font-bold text-white">₹{Math.floor(optimizedBill).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: ANALYSIS GRAPH */}
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 mb-6">
               <Zap className="text-blue-400" size={24} />
               <h3 className="text-xl font-bold text-white">24-Hour System Analysis</h3>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <ComposedChart data={history} margin={{top: 10, right: 10, left: 0, bottom: 0}}>
                      <defs>
                        <linearGradient id="colorGridReport" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="hour" stroke="#475569" tick={{fontSize: 10}} />
                      <YAxis stroke="#64748b" tick={{fontSize: 10}} label={{ value: 'kW / %', angle: -90, position: 'insideLeft', fill: '#64748b' }}/>
                      <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px'}} />
                      <Legend />
                      <Area type="monotone" dataKey="solar" stackId="1" fill="#eab308" stroke="none" fillOpacity={0.6} name="Solar Generated" />
                      <Area type="monotone" dataKey="grid" stackId="1" fill="url(#colorGridReport)" stroke="#06b6d4" strokeWidth={2} name="Grid Imported" />
                      <Line type="monotone" dataKey="soc" stroke="#10b981" strokeWidth={2} dot={false} name="Battery SoC %" />
                   </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* SECTION 3: SYSTEM CONFIGURATION */}
        {inputs && (
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
             <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
               <FileText className="text-indigo-400" size={24} />
               <h3 className="text-xl font-bold text-white">Configuration Parameters</h3>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                   <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Battery Size</label>
                   <div className="flex items-center gap-2 text-white font-mono text-lg">
                      <Battery size={16} className="text-emerald-400"/>
                      {inputs.batteryCap} kWh
                   </div>
                </div>
                <div>
                   <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Grid Limit</label>
                   <div className="flex items-center gap-2 text-white font-mono text-lg">
                      <Zap size={16} className="text-blue-400"/>
                      {inputs.gridLimit} kW
                   </div>
                </div>
                <div>
                   <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Solar Panel</label>
                   <div className="flex items-center gap-2 text-white font-mono text-lg">
                      <Sun size={16} className="text-yellow-400"/>
                      {inputs.hasSolar ? `${inputs.solarCapacity} kWp` : 'None'}
                   </div>
                </div>
                <div>
                   <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Peak Rate</label>
                   <div className="flex items-center gap-2 text-white font-mono text-lg">
                      <DollarSign size={16} className="text-red-400"/>
                      ₹{inputs.ratePeak}/unit
                   </div>
                </div>
                <div>
                   <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Wear Cost</label>
                   <div className="flex items-center gap-2 text-white font-mono text-lg">
                      <TrendingDown size={16} className="text-orange-400"/>
                      ₹{inputs.cycleDegradation}/kWh
                   </div>
                </div>
                <div>
                   <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Base Load</label>
                   <div className="text-white font-mono text-lg">
                      {inputs.baseLoad} kW
                   </div>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};