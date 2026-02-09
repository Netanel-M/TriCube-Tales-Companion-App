import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices, AlertCircle, Shield } from 'lucide-react';

export const DiceRoller = ({ diceCount, targetNumber, onRoll, baseTN, onDifficultyChange, onSpendResolve, canSpendResolve }) => {
    const [results, setResults] = useState([]);
    const [isRolling, setIsRolling] = useState(false);
    const [rolledDiceCount, setRolledDiceCount] = useState(1);
    const [showSpendResolve, setShowSpendResolve] = useState(false);

    const roll = () => {
        setIsRolling(true);
        setShowSpendResolve(false);
        setRolledDiceCount(diceCount);
        setTimeout(() => {
            const newResults = Array.from({ length: diceCount }, () => Math.ceil(Math.random() * 6));
            setResults(newResults);
            setIsRolling(false);
            const successes = newResults.filter(r => r >= targetNumber).length;
            const isCritFail = diceCount === 1 && newResults.includes(1);
            onRoll({ results: newResults, successes, isCritFail });
            // Show spend resolve button if roll failed
            if (successes === 0) {
                setShowSpendResolve(true);
            }
        }, 500);
    };

    const handleSpendResolve = () => {
        setShowSpendResolve(false);
        if (onSpendResolve) onSpendResolve();
    };

    const successes = results.filter(r => r >= targetNumber).length;
    const isCritFail = rolledDiceCount === 1 && results.includes(1);

    return (
        <div className="flex flex-col items-center gap-8" style={{ padding: '8px' }}>
            {/* Difficulty Selector */}
            <div className="w-full max-w-sm">
                <p className="text-center text-xs text-gray-500 mb-3 uppercase tracking-widest">Difficulty</p>
                <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--gold)' }}>
                    {[4, 5, 6].map(tn => (
                        <button
                            key={tn}
                            onClick={() => onDifficultyChange(tn)}
                            className="flex-1 py-3 font-bold transition-all"
                            style={{
                                background: baseTN === tn ? 'var(--gold)' : 'transparent',
                                color: baseTN === tn ? 'white' : 'var(--ink)'
                            }}
                        >
                            {tn === 4 ? 'Easy' : tn === 5 ? 'Medium' : 'Hard'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Dice Display */}
            <div className="flex gap-4 h-24 items-center justify-center">
                <AnimatePresence mode="popLayout">
                    {isRolling ? (
                        Array.from({ length: rolledDiceCount }).map((_, i) => (
                            <motion.div
                                key={`rolling-${i}`}
                                animate={{ rotate: [0, 360], y: [0, -15, 0] }}
                                transition={{ duration: 0.4, repeat: Infinity }}
                                className="w-16 h-16 rounded-lg flex items-center justify-center"
                                style={{ background: 'var(--crimson)' }}
                            >
                                <Dices className="text-white" />
                            </motion.div>
                        ))
                    ) : (
                        results.map((val, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-16 h-16 flex items-center justify-center rounded-lg text-2xl font-bold border-2"
                                style={{
                                    background: val >= targetNumber ? 'var(--forest)' : 'white',
                                    color: val >= targetNumber ? 'white' : 'var(--ink)',
                                    borderColor: 'var(--gold)'
                                }}
                            >
                                {val}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Result */}
            {results.length > 0 && !isRolling && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-3">
                    {isCritFail ? (
                        <span className="flex items-center justify-center gap-2 font-bold" style={{ color: 'var(--crimson)' }}><AlertCircle size={18} /> Critical Failure!</span>
                    ) : (
                        <span className="font-bold text-lg" style={{ color: successes > 0 ? 'var(--forest)' : 'var(--crimson)' }}>
                            {successes > 0 ? `${successes} Success${successes !== 1 ? 'es' : ''}` : 'Failed!'}
                        </span>
                    )}

                    {/* Spend Resolve Button */}
                    {showSpendResolve && canSpendResolve && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={handleSpendResolve}
                            className="btn-secondary flex items-center gap-2 mx-auto"
                            style={{ padding: '8px 16px', fontSize: '14px', marginBottom: '16px' }}
                        >
                            <Shield size={16} /> Accept Failure (-1 Resolve)
                        </motion.button>
                    )}
                </motion.div>
            )}

            {/* Roll Button */}
            <button onClick={roll} disabled={isRolling} style={{ marginTop: '8px' }} className="btn-primary text-lg px-12 py-4 disabled:opacity-50">
                Roll {diceCount}d6
            </button>

            <p className="text-sm text-gray-500">Target: {targetNumber}+</p>
        </div>
    );
};
