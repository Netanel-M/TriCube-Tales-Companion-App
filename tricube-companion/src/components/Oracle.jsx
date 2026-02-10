import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, HelpCircle, Zap, AlertTriangle, LayoutGrid, Target, User, MapPin, Sword } from 'lucide-react';
import { rollOracle, askOracle as askIronswornOracle, YES_NO_ODDS } from '../data/ironswornOracle';

export const Oracle = () => {
    const [activeTab, setActiveTab] = useState('spark'); // spark, yesno, twist, misc

    // Spark State
    const [wheels, setWheels] = useState({
        action: 'Spin to Reveal',
        theme: 'Spin to Reveal',
        descriptor: 'Spin to Reveal'
    });
    const [isSpinning, setIsSpinning] = useState(false);

    // Yes/No State
    const [odds, setOdds] = useState('50/50');
    const [yesNoResult, setYesNoResult] = useState(null);
    const [isAsking, setIsAsking] = useState(false);

    // Twist State
    const [twist, setTwist] = useState(null);
    const [isTwisting, setIsTwisting] = useState(false);

    // Misc State
    const [miscResult, setMiscResult] = useState(null);
    const [isMiscSpinning, setIsMiscSpinning] = useState(false);
    const [miscType, setMiscType] = useState(null); // 'role', 'goal', 'trouble', 'combat'

    // Handlers
    const spinSpark = () => {
        setIsSpinning(true);
        setTimeout(() => {
            setWheels({
                action: rollOracle('action'),
                theme: rollOracle('theme'),
                descriptor: rollOracle('descriptor')
            });
            setIsSpinning(false);
        }, 800);
    };

    const askOracle = () => {
        setIsAsking(true);
        setYesNoResult(null);
        setTimeout(() => {
            const result = askIronswornOracle(odds);
            setYesNoResult(result);
            setIsAsking(false);
        }, 600);
    };

    const generateTwist = () => {
        setIsTwisting(true);
        setTimeout(() => {
            setTwist(rollOracle('twist'));
            setIsTwisting(false);
        }, 600);
    };

    const rollMisc = (type) => {
        setIsMiscSpinning(true);
        setMiscType(type);
        setMiscResult(null);
        setTimeout(() => {
            setMiscResult(rollOracle(type));
            setIsMiscSpinning(false);
        }, 500);
    };

    // Dynamic Button Config
    const getActionConfig = () => {
        switch (activeTab) {
            case 'spark': return { label: 'SPIN IDEAS', icon: RefreshCw, action: spinSpark, disabled: isSpinning };
            case 'yesno': return { label: 'ASK THE ORACLE', icon: HelpCircle, action: askOracle, disabled: isAsking };
            case 'twist': return { label: 'REVEAL PLOT TWIST', icon: Zap, action: generateTwist, disabled: isTwisting };
            case 'misc': return { label: 'SELECT A TABLE', icon: LayoutGrid, action: () => { }, disabled: true }; // Action is handled by internal buttons
            default: return { label: 'ACT', icon: Sparkles, action: () => { }, disabled: true };
        }
    };

    const actionConfig = getActionConfig();
    const ActionIcon = actionConfig.icon;

    return (
        <div className="flex flex-col items-center gap-4 w-full max-w-xl mx-auto h-[500px]">

            {/* Tabs */}
            <div className="flex gap-2 p-1  w-full shrink-0" style={{ borderColor: 'var(--gold)', padding: '5px', margin: '10px' }}>
                {[
                    { id: 'spark', icon: Sparkles, label: 'Spark' },
                    { id: 'yesno', icon: HelpCircle, label: 'Ask' },
                    { id: 'twist', icon: Zap, label: 'Twist' },
                    { id: 'misc', icon: LayoutGrid, label: 'Misc' }
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
                            <div className="flex flex-col gap-3 w-full px-2">
                                {wheels.action === 'Spin to Reveal' ? (
                                    <div className="text-center px-4 py-8 rounded-lg w-full italic text-sm border bg-white/50" style={{ borderColor: 'var(--gold)', color: 'var(--ink)' }}>
                                        Spin to reveal an oracle...
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex flex-col gap-1 p-3 rounded-lg border bg-white" style={{ borderColor: 'var(--gold)' }}>
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-center w-full" style={{ color: 'var(--ink)', opacity: 0.6 }}>Action</span>
                                            <span className="font-bold text-xl text-center break-words" style={{ color: 'var(--ink)' }}>{wheels.action}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 p-3 rounded-lg border bg-white" style={{ borderColor: 'var(--gold)' }}>
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-center w-full" style={{ color: 'var(--ink)', opacity: 0.6 }}>Theme</span>
                                            <span className="font-bold text-xl text-center break-words" style={{ color: 'var(--ink)' }}>{wheels.theme}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 p-3 rounded-lg border bg-white" style={{ borderColor: 'var(--gold)' }}>
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-center w-full" style={{ color: 'var(--ink)', opacity: 0.6 }}>Descriptor</span>
                                            <span className="font-bold text-xl text-center break-words" style={{ color: 'var(--ink)' }}>{wheels.descriptor}</span>
                                        </div>
                                    </>
                                )}
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
                                    {Object.keys(YES_NO_ODDS).map(o => (
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
                                        <h3 className="text-4xl md:text-5xl font-black mb-2" style={{ color: 'var(--ink)' }}>{yesNoResult.answer}</h3>
                                        {yesNoResult.qualifier && (
                                            <p className="font-bold text-lg" style={{ color: 'var(--crimson)' }}>{yesNoResult.qualifier}</p>
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
                            <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[140px] px-4">
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
                                        className="p-6 border rounded-xl w-full max-h-[300px] overflow-y-auto break-words"
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

                    {/* MISC TAB */}
                    {activeTab === 'misc' && (
                        <motion.div
                            key="misc"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex flex-col gap-6 h-full items-center justify-start pt-4 p-2 w-full"
                        >
                            <div className="grid grid-cols-2 gap-3 w-full">
                                <button onClick={() => rollMisc('role')} className={`btn-secondary flex flex-col items-center gap-1 p-3 text-xs ${miscType === 'role' ? 'ring-2 ring-gold' : ''}`}>
                                    <User size={16} /> Role
                                </button>
                                <button onClick={() => rollMisc('goal')} className={`btn-secondary flex flex-col items-center gap-1 p-3 text-xs ${miscType === 'goal' ? 'ring-2 ring-gold' : ''}`}>
                                    <Target size={16} /> Goal
                                </button>
                                <button onClick={() => rollMisc('trouble')} className={`btn-secondary flex flex-col items-center gap-1 p-3 text-xs ${miscType === 'trouble' ? 'ring-2 ring-gold' : ''}`}>
                                    <MapPin size={16} /> Trouble
                                </button>
                                <button onClick={() => rollMisc('combat')} className={`btn-secondary flex flex-col items-center gap-1 p-3 text-xs ${miscType === 'combat' ? 'ring-2 ring-gold' : ''}`}>
                                    <Sword size={16} /> Combat
                                </button>
                            </div>

                            <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[140px] px-4">
                                {isMiscSpinning ? (
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 0.5, repeat: Infinity }}
                                        style={{ color: 'var(--gold)' }}
                                    >
                                        <LayoutGrid size={48} />
                                    </motion.div>
                                ) : miscResult ? (
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="p-6 border rounded-xl w-full max-h-[220px] overflow-y-auto break-words text-center"
                                        style={{ background: 'white', borderColor: 'var(--gold)' }}
                                    >
                                        <span className="text-[10px] uppercase font-bold tracking-widest block mb-2 opacity-60">{miscType}</span>
                                        <p className="text-lg md:text-xl font-bold leading-tight" style={{ color: 'var(--ink)' }}>
                                            "{miscResult}"
                                        </p>
                                    </motion.div>
                                ) : (
                                    <div className="text-center" style={{ color: 'var(--ink)', opacity: 0.5 }}>
                                        <LayoutGrid size={48} className="mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Select a category above...</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Action Area (Fixed Bottom) */}
            <div className="w-full shrink-0 border-t" style={{ borderColor: 'var(--gold)' }}>
                {activeTab === 'misc' ? (
                    <div className="flex items-center justify-center gap-2 px-8 py-6 text-lg text-gray-400 italic">
                        Select a category above to roll
                    </div>
                ) : (
                    <button
                        onClick={actionConfig.action}
                        disabled={actionConfig.disabled}
                        className="btn-primary flex items-center justify-center gap-2 px-8 py-4 text-lg"
                        style={{ margin: '16px', width: 'calc(100% - 32px)' }}
                    >
                        <ActionIcon size={20} className={actionConfig.disabled ? 'animate-spin' : ''} />
                        {actionConfig.label}
                    </button>
                )}
            </div>
        </div>
    );
};
