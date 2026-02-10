import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';
import { CharacterCreator } from './components/CharacterCreator';
import { DiceRoller } from './components/DiceRoller';
import { Oracle } from './components/Oracle';
import { GENRES } from './data/genres';
import { changelogData } from './data/changelog';
import { ChangelogModal } from './components/ChangelogModal';
import { User, Dices, Sparkles, History, Settings, Sword, Zap, Shield, Trash2, Activity, AlertTriangle, Star, TrendingUp, Flag, Plus, BookOpen, Type } from 'lucide-react';

const App = () => {
  const { character, session, addLogEntry, updateStats, resetGame, endScene, preferences, setFontSize } = useStore();
  const [activeTab, setActiveTab] = useState('game');
  const [matchTrait, setMatchTrait] = useState(false);
  const [matchConcept, setMatchConcept] = useState(false);
  const [usePerk, setUsePerk] = useState(false);
  const [useQuirk, setUseQuirk] = useState(false);
  const [baseTN, setBaseTN] = useState(5);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpStep, setLevelUpStep] = useState('ask'); // 'ask', 'stat', 'perk'
  const [customPerk, setCustomPerk] = useState('');
  const [customQuirk, setCustomQuirk] = useState('');
  const [journalEntry, setJournalEntry] = useState('');

  // Changelog State
  const [showChangelog, setShowChangelog] = useState(false);
  const latestVersion = changelogData[changelogData.length - 1];

  useEffect(() => {
    const lastSeenVersion = localStorage.getItem('tricube_last_version');
    if (lastSeenVersion !== latestVersion.version) {
      setShowChangelog(true);
    }
  }, []);

  const handleCloseChangelog = () => {
    setShowChangelog(false);
    localStorage.setItem('tricube_last_version', latestVersion.version);
  };

  const diceCount = matchTrait ? 3 : (matchConcept ? 2 : 1);
  let derivedTN = baseTN;
  if (usePerk) derivedTN -= 1;
  if (useQuirk) derivedTN += 1;
  derivedTN = Math.max(2, Math.min(6, derivedTN));

  const handleRollResult = (result) => {
    const { successes } = result;
    addLogEntry({ id: crypto.randomUUID(), timestamp: Date.now(), type: 'roll', content: `Roll (TN ${derivedTN}+)`, result });
    let newKarma = character.karma;
    let newResolve = character.resolve;
    if (usePerk) { newKarma = Math.max(0, newKarma - 1); setUsePerk(false); }
    if (useQuirk) {
      if (successes > 0) newResolve = Math.min(6, newResolve + 1);
      else newKarma = Math.min(6, newKarma + 1);
      setUseQuirk(false);
    }
    updateStats({ karma: newKarma, resolve: newResolve });
    setMatchTrait(false);
    setMatchConcept(false);
  };

  if (!character) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8" style={{ background: 'var(--parchment)' }}>
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-5xl md:text-7xl font-bold text-gradient mb-4 text-center">TRICUBE</motion.h1>
        <p className="text-gray-600 mb-12 tracking-widest text-sm">SOLO RPG COMPANION</p>
        <CharacterCreator />
      </div>
    );
  }

  const tabs = [
    { id: 'game', icon: Dices, label: 'Roll' },
    { id: 'oracle', icon: Sparkles, label: 'Oracle' },
    { id: 'logs', icon: History, label: 'Logs' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--parchment)', fontSize: `${preferences?.fontSize || 16}px` }}>
      {/* Header */}
      <header style={{ padding: '16px', borderBottom: '1px solid var(--gold)', background: 'rgba(255,255,255,0.5)' }}>
        <div className="app-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Character Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--crimson)', flexShrink: 0 }}>
                  <User style={{ color: 'white' }} size={24} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{character.name}</h2>
                  <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{character.trait} • {character.concept}</p>
                </div>
              </div>
              {/* Stats */}
              <div style={{ display: 'flex', gap: '24px', justifyContent: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', marginBottom: '4px', color: 'var(--gold)' }}><Zap size={12} /> Karma</div>
                  <div style={{ display: 'flex', gap: '3px' }}>{[...Array(character.maxKarma || 3)].map((_, i) => <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: i < character.karma ? 'var(--gold)' : '#ddd' }} />)}</div>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', marginBottom: '4px', color: 'var(--forest)' }}><Shield size={12} /> Resolve</div>
                  <div style={{ display: 'flex', gap: '3px' }}>{[...Array(character.maxResolve || 3)].map((_, i) => <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: i < character.resolve ? 'var(--forest)' : '#ddd' }} />)}</div>
                </div>
              </div>
            </div>
            {/* End Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '110px' }}>
              <button
                onClick={() => endScene()}
                className="btn-secondary flex items-center justify-center gap-2"
                style={{ padding: '8px 12px', fontSize: '12px', width: '100%' }}
              >
                <Sparkles size={14} /> End Scene
              </button>
              <button
                onClick={() => { endScene(); setShowLevelUp(true); }}
                className="btn-secondary flex items-center justify-center gap-2"
                style={{ padding: '8px 12px', fontSize: '12px', width: '100%' }}
              >
                <Flag size={14} /> End Session
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow app-container" style={{ paddingTop: '24px', paddingBottom: '100px' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'game' && (
            <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Dice Advantage */}
              <div className="card p-4 space-y-3">
                <p style={{ textAlign: 'center', paddingLeft: '16px', paddingRight: '16px' }} className="text-xs text-gray-500 uppercase tracking-wider">Do you have advantage?</p>

                {/* No Advantage */}
                <button onClick={() => { setMatchTrait(false); setMatchConcept(false); }} className="card p-3 text-left transition-all" style={{ width: 'calc(100% - 8px)', margin: '8px auto 0', display: 'block', borderColor: (!matchTrait && !matchConcept) ? 'var(--crimson)' : 'var(--gold)', background: (!matchTrait && !matchConcept) ? 'rgba(139,30,63,0.1)' : '' }}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">No Advantage</span>
                    <span className="text-sm text-gray-500" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>1 die</span>
                  </div>
                </button>

                {/* Concept */}
                <button onClick={() => { setMatchConcept(!matchConcept); setMatchTrait(false); }} className="card p-3 text-left transition-all" style={{ width: 'calc(100% - 8px)', margin: '8px auto', display: 'block', borderColor: matchConcept ? 'var(--forest)' : 'var(--gold)', background: matchConcept ? 'rgba(45,74,62,0.1)' : '' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3"><Sword size={18} style={{ color: 'var(--forest)' }} /><span className="font-bold">{character.concept}</span></div>
                    <span className="text-sm text-gray-500" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>2 dice</span>
                  </div>
                </button>

                {/* Trait */}
                <button onClick={() => { setMatchTrait(!matchTrait); setMatchConcept(false); }} className="card p-3 text-left transition-all" style={{ width: 'calc(100% - 8px)', margin: '8px auto', display: 'block', borderColor: matchTrait ? 'var(--crimson)' : 'var(--gold)', background: matchTrait ? 'rgba(139,30,63,0.1)' : '' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3"><Activity size={18} style={{ color: 'var(--crimson)' }} /><span className="font-bold">{character.trait}</span></div>
                    <span className="text-sm text-gray-500" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>3 dice</span>
                  </div>
                </button>

              </div>



              {/* Difficulty Modifiers */}
              <div className="card p-4 space-y-3">
                <p style={{ textAlign: 'center' }} className="text-xs text-gray-500 uppercase tracking-wider">Difficulty Modifiers</p>

                {/* All Perks */}
                <button disabled={character.karma === 0} onClick={() => { setUsePerk(!usePerk); setUseQuirk(false); }} className={`card p-3 text-left transition-all ${character.karma === 0 ? 'opacity-50' : ''}`} style={{ width: 'calc(100% - 8px)', margin: '8px auto', display: 'block', borderColor: usePerk ? 'var(--gold)' : 'var(--gold)', background: usePerk ? 'rgba(201,162,39,0.1)' : '' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Zap size={18} style={{ color: 'var(--gold)' }} />
                      <div>
                        <span className="font-bold">Perks</span>
                        <p className="text-xs text-gray-500">{(character.perks || []).join(', ')}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>-1 TN</span>
                  </div>
                </button>

                {/* All Quirks */}
                <button onClick={() => { setUseQuirk(!useQuirk); setUsePerk(false); }} className="card p-3 text-left transition-all" style={{ width: 'calc(100% - 8px)', margin: '8px auto', display: 'block', borderColor: useQuirk ? 'var(--crimson)' : 'var(--gold)', background: useQuirk ? 'rgba(139,30,63,0.1)' : '' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle size={18} style={{ color: 'var(--crimson)' }} />
                      <div>
                        <span className="font-bold">Quirks</span>
                        <p className="text-xs text-gray-500">{(character.quirks || []).join(', ')}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>+1 TN</span>
                  </div>
                </button>
              </div>
              {/* Dice Roller */}
              <div className="card p-6 md:p-10">
                <DiceRoller
                  diceCount={diceCount}
                  targetNumber={derivedTN}
                  onRoll={handleRollResult}
                  baseTN={baseTN}
                  onDifficultyChange={setBaseTN}
                  canSpendResolve={character.resolve > 0}
                  onSpendResolve={() => updateStats({ resolve: Math.max(0, character.resolve - 1) })}
                />
              </div>
            </motion.div>
          )}
          {activeTab === 'oracle' && <motion.div key="oracle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6"><Oracle /></motion.div>}
          {activeTab === 'logs' && (
            <motion.div key="logs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="text-2xl font-bold text-gradient">Adventure Log</h2>

              </div>

              {/* Journal Entry Input */}
              <div className="card p-6" style={{ marginBottom: '16px', padding: '32px' }}>
                <textarea
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  placeholder="Writer's Log: Describe the scene or add notes..."
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                  style={{ borderColor: 'var(--gold)', '--tw-ring-color': 'var(--forest)', minHeight: '80px', marginBottom: '8px' }}
                />
                <button
                  onClick={() => {
                    if (journalEntry.trim()) {
                      useStore.getState().addLogEntry({ id: Date.now(), content: journalEntry, type: 'journal' });
                      setJournalEntry('');
                    }
                  }}
                  disabled={!journalEntry.trim()}
                  className="btn-primary text-sm disabled:opacity-50 block mx-auto"
                  style={{ marginTop: '8px', padding: '8px 24px' }}
                >
                  <BookOpen size={14} style={{ display: 'inline', marginRight: '6px' }} />
                  Add to Log
                </button>
              </div>

              {session.log.length > 0 && (

                <button onClick={() => useStore.getState().clearLog()} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '12px', marginBottom: "8px" }}>
                  Clear Log
                </button>
              )}
              {session.log.length === 0 ? <p className="text-gray-500">No entries yet.</p> : session.log.map(entry => (
                <div key={entry.id} className="card p-4" style={{ padding: '16px', marginBottom: '8px' }}>
                  <p className="font-bold">{entry.content}</p>
                  <div className="flex gap-2 mt-2">{entry.result?.results.map((r, i) => <span key={i} className={`w-8 h-8 flex items-center justify-center rounded font-bold ${r >= derivedTN ? 'text-white' : 'bg-gray-200'}`} style={{ background: r >= derivedTN ? 'var(--forest)' : '' }}>{r}</span>)}</div>
                </div>
              ))}
            </motion.div>
          )}
          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-10 text-center">

              {/* Font Size Slider */}
              <div className="mb-8 p-4 border rounded-lg bg-white/50" style={{ borderColor: 'var(--gold)' }}>
                <p className="font-bold mb-4 flex items-center justify-center gap-2">
                  <Type size={18} /> Font Size: {preferences?.fontSize || 16}px
                </p>
                <input
                  type="range"
                  min="12"
                  max="32"
                  step="1"
                  value={preferences?.fontSize || 16}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full accent-[var(--forest)]"
                  style={{ height: '6px', borderRadius: '3px' }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Small</span>
                  <span>Medium</span>
                  <span>Large</span>
                </div>
              </div>

              <Trash2 size={48} className="mx-auto mb-4" style={{ color: 'var(--crimson)' }} />
              <h2 className="text-2xl font-bold mb-2">Reset Adventure</h2>
              <p className="text-gray-600 mb-6">This will delete your character and all logs.</p>
              <button onClick={resetGame} className="btn-primary">Confirm Reset</button>

              <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--gold)' }}>
                <p className="text-xs text-gray-500">
                  Based on <a href="https://www.drivethrurpg.com/en/product/294202" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>Tricube Tales</a> by Richard Woolcock.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Nav - Centered Floating Dock */}
      <nav style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}>
        <div className="flex gap-1 p-2 rounded-full shadow-xl">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="flex items-center gap-2 px-5 py-3 rounded-full transition-all" style={{ background: isActive ? 'var(--crimson)' : 'transparent', color: isActive ? 'white' : 'var(--ink)' }}>
                <Icon size={20} />
                {isActive && <span className="text-sm font-bold">{tab.label}</span>}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Level Up Modal */}
      <AnimatePresence>
        {showLevelUp && (() => {
          const selectedGenre = GENRES.find(g => g.id === character.genre);
          const sceneNum = character.sceneCount || 1;
          const currentLevel = character.level || 0;
          const nextLevel = currentLevel + 1;
          const isStatUpgrade = nextLevel % 2 === 0;

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'var(--parchment)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '16px' }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="card p-6"
                style={{ maxWidth: '450px', width: '100%', background: 'white', maxHeight: '90vh', overflowY: 'auto' }}
              >
                {/* Scene rewards info - Only show in 'ask' step */}
                {levelUpStep === 'ask' && (
                  <div className="card p-4" style={{ margin: '16px', background: 'rgba(201,162,39,0.1)' }}>
                    <p className="text-sm text-center" style={{ marginBottom: '12px' }}>
                      <strong>Level Up Rewards:</strong>
                    </p>
                    <div className="text-xs text-gray-600 space-y-2" style={{ marginLeft: '16px' }}>
                      <p> <strong>Every 1 level:</strong> Choose a new Perk OR Quirk</p>
                      <p> <strong>Every 2 levels:</strong> Increase max Karma OR Resolve</p>
                    </div>
                  </div>
                )}

                {/* Current progress - Only show in 'ask' step */}
                {levelUpStep === 'ask' && (
                  <div style={{ display: 'flex', gap: '12px', margin: '24px' }}>
                    <div className="flex-1 text-center card p-3">
                      <p className="text-2xl font-bold" style={{ color: 'var(--crimson)' }}>{character.sceneCount || 1}</p>
                      <p className="text-xs text-gray-500">Sessions</p>
                    </div>
                    <div className="flex-1 text-center card p-3">
                      <p className="text-2xl font-bold" style={{ color: 'var(--gold)' }}>{character.maxKarma || 3}</p>
                      <p className="text-xs text-gray-500">Max Karma</p>
                    </div>
                    <div className="flex-1 text-center card p-3">
                      <p className="text-2xl font-bold" style={{ color: 'var(--forest)' }}>{character.maxResolve || 3}</p>
                      <p className="text-xs text-gray-500">Max Resolve</p>
                    </div>
                  </div>
                )}

                {/* Step: Ask */}
                {levelUpStep === 'ask' && (
                  <>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                      <Flag size={48} style={{ color: 'var(--crimson)', margin: '0 auto 12px' }} />
                      <h2 className="text-2xl font-bold">Session Complete!</h2>
                      <p className="text-gray-600" style={{ marginTop: '8px' }}>Karma and Resolve restored.</p>
                    </div>

                    <p className="text-center text-sm text-gray-600 mb-4">You are currently Level {currentLevel + 1}. Next level ({nextLevel + 1}) grants: <strong>{isStatUpgrade ? 'Stat Upgrade' : 'Perk/Quirk'}</strong>.</p>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{ margin: "16px" }} onClick={() => { setShowLevelUp(false); setLevelUpStep('ask'); }} className="flex-1 btn-secondary">
                        Skip Level Up
                      </button>
                      <button style={{ margin: "16px" }} onClick={() => setLevelUpStep(isStatUpgrade ? 'stat' : 'perk')} className="flex-1 btn-primary flex items-center justify-center gap-2">
                        <TrendingUp size={16} /> Level Up to {nextLevel + 1}
                      </button>
                    </div>
                  </>
                )}

                {/* Step: Stat Upgrade (Even Levels) */}
                {levelUpStep === 'stat' && (
                  <>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                      <TrendingUp size={48} style={{ color: 'var(--gold)', margin: '0 auto 12px' }} />
                      <h2 className="text-2xl font-bold">Level {nextLevel + 1}: Increase Stat</h2>
                      <p className="text-gray-600" style={{ marginTop: '8px' }}>Time to boost your maximum Karma or Resolve.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', margin: '16px' }}>
                      <button
                        onClick={() => {
                          if ((character.maxKarma || 3) < 6) {
                            updateStats({ maxKarma: (character.maxKarma || 3) + 1, karma: (character.maxKarma || 3) + 1, level: nextLevel });
                          }
                          setShowLevelUp(false);
                          setLevelUpStep('ask');
                        }}
                        disabled={(character.maxKarma || 3) >= 6}
                        className="flex-1 btn-secondary disabled:opacity-50"
                        style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                      >
                        <Zap size={24} style={{ color: 'var(--gold)', marginBottom: '8px' }} />
                        <span className="font-bold">+1 Max Karma</span>
                        <span className="text-xs text-gray-500">{character.maxKarma || 3} → {Math.min(6, (character.maxKarma || 3) + 1)}</span>
                      </button>
                      <button
                        onClick={() => {
                          if ((character.maxResolve || 3) < 6) {
                            updateStats({ maxResolve: (character.maxResolve || 3) + 1, resolve: (character.maxResolve || 3) + 1, level: nextLevel });
                          }
                          setShowLevelUp(false);
                          setLevelUpStep('ask');
                        }}
                        disabled={(character.maxResolve || 3) >= 6}
                        className="flex-1 btn-secondary disabled:opacity-50"
                        style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                      >
                        <Shield size={24} style={{ color: 'var(--forest)', marginBottom: '8px' }} />
                        <span className="font-bold">+1 Max Resolve</span>
                        <span className="text-xs text-gray-500">{character.maxResolve || 3} → {Math.min(6, (character.maxResolve || 3) + 1)}</span>
                      </button>
                    </div>

                    <button style={{ marginBottom: "4px" }} onClick={() => { setShowLevelUp(false); setLevelUpStep('ask'); }} className="btn-secondary w-full text-sm">
                      Cancel (Skip Level Up)
                    </button>
                  </>
                )}

                {/* Step: Perk/Quirk Selection (Odd Levels) */}
                {levelUpStep === 'perk' && selectedGenre && (
                  <>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                      <Plus size={48} style={{ color: 'var(--forest)', margin: '0 auto 12px' }} />
                      <h2 className="text-2xl font-bold">Level {nextLevel + 1}: New Trait</h2>
                      <p className="text-gray-600" style={{ marginTop: '8px' }}>Choose one new perk or quirk from your genre.</p>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <p style={{ margin: "16px" }} className="text-xs text-gray-500 uppercase tracking-wider mb-2">Perks (reduce difficulty)</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {selectedGenre.perks.filter(p => !(character.perks || []).includes(p)).map(perk => (
                          <button
                            key={perk}
                            onClick={() => {
                              updateStats({ perks: [...(character.perks || []), perk], level: nextLevel });
                              setShowLevelUp(false);
                              setLevelUpStep('ask');
                            }}
                            className="btn-secondary text-sm"
                            style={{ background: 'rgba(201,162,39,0.1)', margin: "4px" }}
                          >
                            <Zap size={12} style={{ display: 'inline', marginRight: '4px', color: 'var(--gold)' }} />
                            {perk}
                          </button>
                        ))}
                        {selectedGenre.perks.filter(p => !(character.perks || []).includes(p)).length === 0 && (
                          <p className="text-xs text-gray-400">All perks collected!</p>
                        )}
                      </div>

                      {/* Custom Perk Input */}
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          placeholder="Or define custom perk..."
                          value={customPerk}
                          disabled={customQuirk.length > 0}
                          onChange={(e) => setCustomPerk(e.target.value)}
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 text-sm disabled:bg-gray-50 disabled:text-gray-300"
                          style={{ borderColor: 'var(--gold)', '--tw-ring-color': 'var(--forest)' }}
                        />
                        {customPerk && (
                          <button
                            onClick={() => {
                              updateStats({ perks: [...(character.perks || []), customPerk], level: nextLevel });
                              setShowLevelUp(false);
                              setLevelUpStep('ask');
                              setCustomPerk('');
                              setCustomQuirk('');
                            }}
                            className="btn-primary w-full flex items-center justify-center gap-2 text-xs py-2"
                          >
                            <Plus size={14} /> Confirm Custom Perk
                          </button>
                        )}
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Quirks (increase difficulty, gain resources)</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {selectedGenre.quirks.filter(q => !(character.quirks || []).includes(q)).map(quirk => (
                          <button
                            key={quirk}
                            onClick={() => {
                              updateStats({ quirks: [...(character.quirks || []), quirk], level: nextLevel });
                              setShowLevelUp(false);
                              setLevelUpStep('ask');
                            }}
                            className="btn-secondary text-sm"
                            style={{ background: 'rgba(139,30,63,0.1)', margin: "4px" }}
                          >
                            <AlertTriangle size={12} style={{ display: 'inline', marginRight: '4px', color: 'var(--crimson)' }} />
                            {quirk}
                          </button>
                        ))}
                        {selectedGenre.quirks.filter(q => !(character.quirks || []).includes(q)).length === 0 && (
                          <p className="text-xs text-gray-400">All quirks collected!</p>
                        )}
                      </div>

                      {/* Custom Quirk Input */}
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          placeholder="Or define custom quirk..."
                          value={customQuirk}
                          disabled={customPerk.length > 0}
                          onChange={(e) => setCustomQuirk(e.target.value)}
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 text-sm disabled:bg-gray-50 disabled:text-gray-300"
                          style={{ borderColor: 'var(--gold)', '--tw-ring-color': 'var(--crimson)' }}
                        />
                        {customQuirk && (
                          <button
                            onClick={() => {
                              updateStats({ quirks: [...(character.quirks || []), customQuirk], level: nextLevel });
                              setShowLevelUp(false);
                              setLevelUpStep('ask');
                              setCustomPerk('');
                              setCustomQuirk('');
                            }}
                            className="btn-primary w-full flex items-center justify-center gap-2 text-xs py-2"
                          >
                            <Plus size={14} /> Confirm Custom Quirk
                          </button>
                        )}
                      </div>
                    </div>

                    <button onClick={() => { setShowLevelUp(false); setLevelUpStep('ask'); setCustomPerk(''); setCustomQuirk(''); }} className="btn-secondary w-full">
                      Cancel (Skip Level Up)
                    </button>
                  </>
                )}
              </motion.div>
            </motion.div>
          );
        })()}

      </AnimatePresence>

      {/* Changelog Modal */}
      <ChangelogModal
        isOpen={showChangelog}
        onClose={handleCloseChangelog}
        updates={latestVersion}
      />
    </div>
  );
};

export default App;
