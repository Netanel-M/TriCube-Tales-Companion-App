import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, X, FileText, Calendar, CheckCircle2 } from 'lucide-react';

export const ChangelogModal = ({ isOpen, onClose, updates }) => {
    if (!isOpen || !updates) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10000,
                        padding: '16px'
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="card"
                        style={{
                            maxWidth: '500px',
                            width: '100%',
                            background: 'var(--parchment)',
                            maxHeight: '85vh',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                            overflow: 'hidden',
                            border: '1px solid var(--gold)'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, var(--crimson), var(--crimson-light))',
                            padding: '24px',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            borderBottom: '2px solid var(--gold)'
                        }} className="relative overflow-hidden">
                            {/* Decorative background element */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 0,
                                opacity: 0.1,
                                backgroundImage: 'radial-gradient(circle at 80% 20%, var(--gold) 0%, transparent 50%)'
                            }} />

                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '8px',
                                    opacity: 0.9
                                }}>
                                    <Rocket size={18} className="text-white" />
                                    <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>What's New</span>
                                </div>
                                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                                    {updates.title || 'Update Available'}
                                </h2>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    marginTop: '8px',
                                    fontSize: '13px',
                                    opacity: 0.9,
                                    color: 'var(--gold-light)'
                                }}>
                                    <span style={{ background: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: '4px' }}>v{updates.version}</span>
                                    <span>•</span>
                                    <Calendar size={12} />
                                    <span>{updates.date}</span>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                style={{
                                    background: 'rgba(0,0,0,0.2)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '50%',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: 'white',
                                    marginTop: '-8px',
                                    marginRight: '-8px',
                                    position: 'relative',
                                    zIndex: 2,
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--crimson)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '24px', overflowY: 'auto' }}>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {updates.changes.map((change, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        style={{
                                            display: 'flex',
                                            gap: '12px',
                                            marginBottom: '16px',
                                            alignItems: 'flex-start'
                                        }}
                                    >
                                        <div style={{
                                            minWidth: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            background: 'rgba(201,162,39,0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--gold)',
                                            marginTop: '2px',
                                            border: '1px solid rgba(201,162,39,0.3)'
                                        }}>
                                            <CheckCircle2 size={14} />
                                        </div>
                                        <span style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: '1.5' }}>{change}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        {/* Footer */}
                        <div style={{
                            padding: '16px 24px',
                            borderTop: '1px solid var(--gold)',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            background: 'var(--parchment)'
                        }}>
                            <button
                                onClick={onClose}
                                className="btn-primary"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 24px'
                                }}
                            >
                                <span>Got it!</span>
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
