import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';

const ORACLE_DATA = {
    themes: ['Ancient', 'High Tech', 'Wild', 'Mystic', 'Wicked', 'Grim', 'Radiant', 'Frozen', 'Oceanic', 'Celestial'],
    actions: ['Attack', 'Defend', 'Reveal', 'Betray', 'Protect', 'Retrieve', 'Escape', 'Confront', 'Negotiate', 'Transform'],
    subjects: ['Enemy', 'Treasure', 'Secret', 'Ally', 'Artifact', 'Legend', 'Curse', 'Portal', 'Shadow', 'Light']
};

export const Oracle = () => {
    const [wheels, setWheels] = useState({
        theme: ORACLE_DATA.themes[0],
        action: ORACLE_DATA.actions[0],
        subject: ORACLE_DATA.subjects[0]
    });
    const [isSpinning, setIsSpinning] = useState(false);

    const spin = () => {
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

    return (
        <div className="flex flex-col items-center gap-8 p-6 glass rounded-2xl w-full max-w-lg mx-auto">
            <div className="flex items-center gap-2 text-yellow-400">
                <Sparkles size={24} />
                <h2 className="text-xl font-black uppercase tracking-widest">Idea Spark</h2>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full">
                {Object.entries(wheels).map(([key, value]) => (
                    <div key={key} className="flex flex-col items-center gap-2">
                        <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">{key}</span>
                        <div className="w-full h-24 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center overflow-hidden relative">
                            <AnimatePresence mode="popLayout">
                                <motion.div
                                    key={value}
                                    initial={{ y: isSpinning ? 50 : 0, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -50, opacity: 0 }}
                                    className="text-sm font-bold text-center px-1"
                                >
                                    {value}
                                </motion.div>
                            </AnimatePresence>
                            {isSpinning && (
                                <motion.div
                                    animate={{ y: [0, 100] }}
                                    transition={{ duration: 0.1, repeat: Infinity, ease: 'linear' }}
                                    className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none"
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={spin}
                disabled={isSpinning}
                className="flex items-center gap-2 px-8 py-3 bg-yellow-600 hover:bg-yellow-500 rounded-xl font-bold transition-all disabled:opacity-50"
            >
                <RefreshCw size={20} className={isSpinning ? 'animate-spin' : ''} />
                SPIN THE WHEELS
            </button>

            <div className="text-center px-4 py-3 bg-white/5 rounded-lg border border-white/5 w-full italic text-sm text-gray-300">
                "{wheels.theme} {wheels.subject} will {wheels.action.toLowerCase()} tomorrow."
            </div>
        </div>
    );
};
