import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices, AlertCircle, Shield } from 'lucide-react';
import { DieFace } from './DieFace';

export const DiceRoller = ({ diceCount, targetNumber, onRoll, baseTN, onDifficultyChange, isResolution, pendingResult }) => {
    const [results, setResults] = useState([]);
    const [isRolling, setIsRolling] = useState(false);
    const [rolledDiceCount, setRolledDiceCount] = useState(1);

    // Sync with pending result if available (allows parent to control display)
    useEffect(() => {
        if (pendingResult) {
            setResults(pendingResult.results);
            setRolledDiceCount(pendingResult.results.length);
        } else {
            setResults([]); // Clear results when pendingResult is cleared (e.g. new turn)
        }
    }, [pendingResult]);

    const roll = () => {
        setIsRolling(true);
        setRolledDiceCount(diceCount);
        setTimeout(() => {
            const newResults = Array.from({ length: diceCount }, () => Math.ceil(Math.random() * 6));
            setResults(newResults);
            setIsRolling(false);
            const successes = newResults.filter(r => r >= targetNumber).length;
            const isCritFail = diceCount === 1 && newResults.includes(1);
            onRoll({ results: newResults, successes, isCritFail });
        }, 500);
    };

    return (
        <div className="flex flex-col items-center gap-8" style={{ padding: '8px' }}>
            {/* Difficulty Selector - Only show during setup */}
            {!isResolution && (
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
            )}

            {/* Dice Display */}
            {(isRolling || results.length > 0) && (
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '24px',
                        minHeight: '100px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '16px'
                    }}
                >
                    <AnimatePresence mode="popLayout">
                        {isRolling ? (
                            Array.from({ length: rolledDiceCount }).map((_, i) => (
                                <motion.div
                                    key={`rolling-${i}`}
                                    animate={{ rotate: [0, 360], y: [0, -15, 0] }}
                                    transition={{ duration: 0.4, repeat: Infinity }}
                                    className="rounded-xl flex items-center justify-center shadow-lg"
                                    style={{
                                        background: 'var(--crimson)',
                                        width: '96px',
                                        height: '96px'
                                    }}
                                >
                                    <Dices color="white" size={48} />
                                </motion.div>
                            ))
                        ) : (
                            results.map((val, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                >
                                    <DieFace value={val} targetNumber={targetNumber} size={96} />
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Roll Button - Hide during resolution */}
            {!isResolution && (
                <>
                    <button onClick={roll} disabled={isRolling} style={{ marginTop: '8px' }} className="btn-primary text-lg px-12 py-4 disabled:opacity-50">
                        Roll {diceCount}d6
                    </button>
                    <p className="text-sm text-gray-500">Target: {targetNumber}+</p>
                </>
            )}

            {/* During resolution, show the target number so users see it update with perks */}
            {isResolution && (
                <p className="text-sm font-bold text-gray-500">Target Number: {targetNumber}+</p>
            )}
        </div>
    );
};

