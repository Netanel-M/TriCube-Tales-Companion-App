import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { GENRES } from '../data/genres';
import { Sword, Wand2, Skull, Car, ChevronRight, Star } from 'lucide-react';

const icons = { Sword, Wand2, Skull, Car, Star };

export const CharacterCreator = () => {
    const { setCharacter } = useStore();
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({ name: '', genre: '', trait: '', concept: '', perk: '', quirk: '' });

    const selectedGenre = GENRES.find(g => g.id === formData.genre);

    const handleSubmit = () => {
        setCharacter({
            ...formData,
            id: crypto.randomUUID(),
            karma: 3,
            resolve: 3,
            maxKarma: 3,
            maxResolve: 3,
            sceneCount: 0,
            perks: [formData.perk],
            quirks: [formData.quirk],
            tags: [formData.trait, formData.concept, formData.perk, formData.quirk]
        });
    };

    const canProceed = () => {
        switch (step) {
            case 0: return !!formData.genre;
            case 1: return formData.name.trim().length >= 2;
            case 2: return !!formData.trait && !!formData.concept;
            case 3: return !!formData.perk;
            case 4: return !!formData.quirk;
            default: return false;
        }
    };

    const stepTitles = ['Choose Your Setting', 'Name Your Hero', 'Define Your Archetype', 'Select a Perk', 'Accept a Quirk'];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
            <div className="card p-6 md:p-10">
                {/* Progress */}
                <div className="flex gap-2 mb-8">
                    {stepTitles.map((_, i) => (
                        <div key={i} className="flex-1 h-2 rounded-full" style={{ background: i <= step ? 'var(--gold)' : '#e0e0e0' }} />
                    ))}
                </div>

                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">{stepTitles[step]}</h2>

                {/* Step 0: Genre */}
                {step === 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {GENRES.map(genre => {
                            const Icon = icons[genre.icon] || Star;
                            const isSelected = formData.genre === genre.id;
                            return (
                                <button
                                    key={genre.id}
                                    onClick={() => setFormData({ ...formData, genre: genre.id })}
                                    className={`card p-5 text-left transition-all ${isSelected ? 'ring-2' : ''}`}
                                    style={{ borderColor: isSelected ? 'var(--crimson)' : 'var(--gold)' }}
                                >
                                    <div className="flex items-center gap-4 mb-2">
                                        <Icon size={24} style={{ color: 'var(--crimson)' }} />
                                        <span className="font-bold text-lg">{genre.name}</span>
                                    </div>
                                    <p className="text-sm text-gray-600">{genre.description}</p>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Step 1: Name */}
                {step === 1 && (
                    <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter character name..."
                        className="w-full p-4 text-xl border rounded-lg focus:outline-none focus:ring-2"
                        style={{ borderColor: 'var(--gold)', '--tw-ring-color': 'var(--crimson)' }}
                    />
                )}

                {/* Step 2: Trait & Concept */}
                {step === 2 && selectedGenre && (
                    <div className="space-y-6">
                        <div>
                            <p className="font-bold mb-3">Trait (Primary Strength)</p>
                            <div className="flex flex-wrap gap-3">
                                {['Brawny', 'Agile', 'Crafty'].map(t => (
                                    <button key={t} onClick={() => setFormData({ ...formData, trait: t })} className="btn-secondary" style={{ background: formData.trait === t ? 'var(--gold)' : '', color: formData.trait === t ? 'white' : '' }}>{t}</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="font-bold mb-3">Concept (Your Role)</p>
                            <div className="flex flex-wrap gap-3">
                                {selectedGenre.concepts.map(c => (
                                    <button key={c} onClick={() => setFormData({ ...formData, concept: c })} className="btn-secondary" style={{ background: formData.concept === c ? 'var(--gold)' : '', color: formData.concept === c ? 'white' : '' }}>{c}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Perk */}
                {step === 3 && selectedGenre && (
                    <div className="flex flex-wrap gap-3">
                        {selectedGenre.perks.map(p => (
                            <button key={p} onClick={() => setFormData({ ...formData, perk: p })} className="btn-secondary" style={{ background: formData.perk === p ? 'var(--forest)' : '', color: formData.perk === p ? 'white' : '' }}>{p}</button>
                        ))}
                    </div>
                )}

                {/* Step 4: Quirk */}
                {step === 4 && selectedGenre && (
                    <div className="flex flex-wrap gap-3">
                        {selectedGenre.quirks.map(q => (
                            <button key={q} onClick={() => setFormData({ ...formData, quirk: q })} className="btn-secondary" style={{ background: formData.quirk === q ? 'var(--crimson)' : '', color: formData.quirk === q ? 'white' : '' }}>{q}</button>
                        ))}
                    </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between" style={{ margin: '4px', padding: '4px', borderTop: '1px solid var(--gold)' }}>
                    {step > 0 ? <button onClick={() => setStep(step - 1)} className="btn-secondary">Back</button> : <div />}
                    {step < 4 ? (
                        <button onClick={() => setStep(step + 1)} disabled={!canProceed()} className="btn-primary flex items-center gap-2 disabled:opacity-50">Next <ChevronRight size={18} /></button>
                    ) : (
                        <button onClick={handleSubmit} disabled={!canProceed()} className="btn-primary flex items-center gap-2 disabled:opacity-50">Begin Adventure <ChevronRight size={18} /></button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
