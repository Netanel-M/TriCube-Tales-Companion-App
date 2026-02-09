import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, HelpCircle, Zap, AlertTriangle } from 'lucide-react';
import { ORACLE_DATA, getYesNoResult } from '../data/oracleData';

export const Oracle = () => {
    const [activeTab, setActiveTab] = useState('spark'); // spark, yesno, twist

    // Spark State
    const [wheels, setWheels] = useState({
        theme: ORACLE_DATA.themes[0],
        action: ORACLE_DATA.actions[0],
        subject: ORACLE_DATA.subjects[0]
    });
    const [isSpinning, setIsSpinning] = useState(false);

    // Yes/No State
    const [odds, setOdds] = useState('50/50');
    const [yesNoResult, setYesNoResult] = useState(null);
    const [isAsking, setIsAsking] = useState(false);

    // Twist State
    const [twist, setTwist] = useState(null);
    const [isTwisting, setIsTwisting] = useState(false);

    // Handlers
    const spinSpark = () => {
        setIsSpinning(true);
        setTimeout(() => {
            setWheels({
                theme: ORACLE_DATA.themes[Math.floor(Math.random() * ORACLE_DATA.themes.length)],
                action: ORACLE_DATA.actions[Math.floor(Math.random() * ORACLE_DATA.actions.length)],
                subject: ORACLE_DATA.subjects[Math.floor(Math.random() * ORACLE_DATA.subjects.length)]
            });
            setIsSpinning(false);
        }, 800);
    };

    const askOracle = () => {
        setIsAsking(true);
        setYesNoResult(null);
        setTimeout(() => {
            const result = getYesNoResult(odds);
            setYesNoResult(result);
            setIsAsking(false);
        }, 600);
    };

    const generateTwist = () => {
        setIsTwisting(true);
        setTimeout(() => {
            setTwist(ORACLE_DATA.plotTwists[Math.floor(Math.random() * ORACLE_DATA.plotTwists.length)]);
            setIsTwisting(false);
        }, 600);
    };

    // Dynamic Button Config
    const getActionConfig = () => {
        switch (activeTab) {
            case 'spark': return { label: 'SPIN IDEAS', icon: RefreshCw, action: spinSpark, disabled: isSpinning };
            case 'yesno': return { label: 'ASK THE ORACLE', icon: HelpCircle, action: askOracle, disabled: isAsking };
            case 'twist': return { label: 'REVEAL PLOT TWIST', icon: Zap, action: generateTwist, disabled: isTwisting };
            default: return { label: 'ACT', icon: Sparkles, action: () => { }, disabled: true };
        }
    };

    const actionConfig = getActionConfig();
    const ActionIcon = actionConfig.icon;

    return (
        <div className="flex flex-col items-center gap-4 w-full max-w-xl mx-auto h-[500px]">

            {/* Tabs */}
            <div className="flex gap-2 p-1 rounded-xl w-full border shrink-0" style={{ borderColor: 'var(--gold)', background: 'rgba(0,0,0,0.05)' }}>
                {[
                    { id: 'spark', icon: Sparkles, label: 'Spark' },
                    { id: 'yesno', icon: HelpCircle, label: 'Ask' },
                    { id: 'twist', icon: Zap, label: 'Twist' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm transition-all`}
                        style={{
                            background: activeTab === tab.id ? 'var(--gold)' : 'transparent',
                            color: activeTab === tab.id ? 'white' : 'var(--ink)',
                            opacity: activeTab === tab.id ? 1 : 0.6
                        }}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area - Scrollable Container */}
            <div style={{ width: '300px' }} className="w-full flex-1 overflow-y-auto overflow-x-hidden relative">
                <AnimatePresence mode="wait">

                    {/* SPARK TAB */}
                    {activeTab === 'spark' && (
                        <motion.div
                            key="spark"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex flex-col gap-6 h-full justify-center w-full"
                        >
                            <div className="grid grid-cols-3 gap-3 w-full">
                                {Object.entries(wheels).map(([key, value]) => (
                                    <div key={key} className="flex flex-col items-center gap-2">
                                        <span className="text-[10px] uppercase font-bold tracking-widest" style={{ color: 'var(--ink)', opacity: 0.6 }}>{key}</span>
                                        <div className="w-full h-24 border rounded-xl flex items-center justify-center overflow-hidden relative" style={{ borderColor: 'var(--gold)', background: 'white' }}>
                                            <AnimatePresence mode="popLayout">
                                                <motion.div
                                                    key={value}
                                                    initial={{ y: isSpinning ? 50 : 0, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    exit={{ y: -50, opacity: 0 }}
                                                    className="text-xs md:text-sm font-bold text-center px-1 break-words w-full"
                                                    style={{ color: 'var(--ink)' }}
                                                >
                                                    {value}
                                                </motion.div>
                                            </AnimatePresence>
                                            {isSpinning && (
                                                <motion.div
                                                    animate={{ y: [0, 100] }}
                                                    transition={{ duration: 0.1, repeat: Infinity, ease: 'linear' }}
                                                    className="absolute inset-x-0 top-0 h-full pointer-events-none"
                                                    style={{ background: 'linear-gradient(to bottom, transparent, rgba(201, 162, 39, 0.2), transparent)' }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="text-center px-4 py-3 rounded-lg w-full italic text-sm border" style={{ background: 'rgba(255,255,255,0.5)', borderColor: 'var(--gold)', color: 'var(--ink)' }}>
                                "{wheels.theme} {wheels.subject} will {wheels.action.toLowerCase()}."
                            </div>
                        </motion.div>
                    )}

                    {/* YES/NO TAB */}
                    {activeTab === 'yesno' && (
                        <motion.div
                            key="yesno"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex flex-col gap-4 h-full items-center justify-center p-2 w-full"
                        >
                            <label className="w-full">
                                <span className="text-xs uppercase font-bold tracking-widest block mb-2 text-center" style={{ color: 'var(--ink)', opacity: 0.6 }}>Likelihood</span>
                                <div className="grid grid-cols-5 gap-1 p-1 rounded-lg border" style={{ borderColor: 'var(--gold)' }}>
                                    {['Almost Certain', 'Likely', '50/50', 'Unlikely', 'Rare'].map(o => (
                                        <button
                                            key={o}
                                            onClick={() => setOdds(o)}
                                            className={`text-[10px] md:text-xs py-2 rounded transition-colors`}
                                            style={{
                                                background: odds === o ? 'var(--forest)' : 'transparent',
                                                color: odds === o ? 'white' : 'var(--ink)'
                                            }}
                                        >
                                            {o}
                                        </button>
                                    ))}
                                </div>
                            </label>

                            <div className="flex-1 flex items-center justify-center w-full min-h-[140px]">
                                {isAsking ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        style={{ color: 'var(--gold)' }}
                                    >
                                        <RefreshCw size={48} />
                                    </motion.div>
                                ) : yesNoResult ? (
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-center"
                                    >
                                        <h3 className="text-4xl md:text-5xl font-black mb-2" style={{ color: 'var(--ink)' }}>{yesNoResult.split(',')[0]}</h3>
                                        {yesNoResult.includes(',') && (
                                            <p className="font-bold text-lg" style={{ color: 'var(--crimson)' }}>{yesNoResult.split(',')[1]}</p>
                                        )}
                                    </motion.div>
                                ) : (
                                    <div className="text-center" style={{ color: 'var(--ink)', opacity: 0.5 }}>
                                        <HelpCircle size={48} className="mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Set the odds and ask...</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* TWIST TAB */}
                    {activeTab === 'twist' && (
                        <motion.div
                            key="twist"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex flex-col gap-6 h-full items-center justify-center text-center p-2 w-full"
                        >
                            <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[140px]">
                                {isTwisting ? (
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 0.5, repeat: Infinity }}
                                        style={{ color: 'var(--crimson)' }}
                                    >
                                        <Zap size={48} />
                                    </motion.div>
                                ) : twist ? (
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="p-6 border rounded-xl w-full max-h-[220px] overflow-y-auto"
                                        style={{ background: 'rgba(139, 30, 63, 0.1)', borderColor: 'var(--crimson)' }}
                                    >
                                        <AlertTriangle size={32} className="mx-auto mb-4" style={{ color: 'var(--crimson)' }} />
                                        <p className="text-lg md:text-xl font-bold leading-tight" style={{ color: 'var(--ink)' }}>
                                            "{twist}"
                                        </p>
                                    </motion.div>
                                ) : (
                                    <div className="text-center" style={{ color: 'var(--ink)', opacity: 0.5 }}>
                                        <Zap size={48} className="mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Ready to disrupt the narrative?</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* Action Area (Fixed Bottom) */}
            <div className="w-full shrink-0 border-t pt-4" style={{ borderColor: 'var(--gold)' }}>
                <button
                    onClick={actionConfig.action}
                    disabled={actionConfig.disabled}
                    className="btn-primary w-full flex items-center justify-center gap-2 px-8 py-4 text-lg"
                >
                    <ActionIcon size={20} className={actionConfig.disabled ? 'animate-spin' : ''} />
                    {actionConfig.label}
                </button>
            </div>
        </div>
    );
};
