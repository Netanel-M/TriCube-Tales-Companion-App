export const ORACLE_DATA = {
    themes: [
        'Ancient', 'Modern', 'Wild', 'Mystic', 'Corrupt', 'Grim', 'Radiant', 'Cold', 'Vast', 'Celestial',
        'Abandoned', 'Artificial', 'Cursed', 'Digital', 'Ethereal', 'Forgotten', 'Glorious', 'Haunted', 'Infernal', 'Sharp',
        'Kinetic', 'Luminous', 'Mechanical', 'Decaying', 'Opulent', 'Primal', 'Quiet', 'Rusty', 'Savage', 'Toxic',
        'Unstable', 'Vengeful', 'Warped', 'Foreign', 'Yielding', 'Zealous', 'Arcane', 'Barren', 'Chaotic', 'Divine',
        'Eternal', 'Fragile', 'Hollow', 'Heavy', 'Jaded', 'Lost', 'Misty', 'Noble', 'Dark', 'Pale'
    ],
    actions: [
        'Attack', 'Defend', 'Reveal', 'Betray', 'Protect', 'Retrieve', 'Escape', 'Confront', 'Negotiate', 'Change',
        'Abandon', 'Banish', 'Capture', 'Destroy', 'Escort', 'Find', 'Guard', 'Hunt', 'Imprison', 'Journey',
        'Kill', 'Locate', 'Mend', 'Neutralize', 'Observe', 'Pursue', 'Pacify', 'Rescue', 'Steal', 'Transport',
        'Uncover', 'Violate', 'Warn', 'Examine', 'Yield', 'Preserve', 'Ambush', 'Breach', 'Create', 'Trick',
        'Eliminate', 'Flee', 'Gather', 'Access', 'Infiltrate', 'Block', 'Abduct', 'Liberate', 'Modify', 'Navigate'
    ],
    subjects: [
        'Enemy', 'Treasure', 'Secret', 'Ally', 'Artifact', 'Legend', 'Curse', 'Door', 'Shadow', 'Light',
        'Stranger', 'Beast', 'Construct', 'Evil', 'Experiment', 'Fugitive', 'Spirit', 'Horror', 'Device', 'Wealth',
        'Killer', 'Leader', 'Machine', 'Organization', 'Oracle', 'Prisoner', 'Ruler', 'Relic', 'Survivor', 'Traitor',
        'Group', 'Sickness', 'Weapon', 'Outsider', 'Youth', 'Zealot', 'Automaton', 'Structure', 'Settlement', 'Information',
        'Entity', 'Faction', 'Deity', 'Swarm', 'Message', 'Refuse', 'Key', 'Titan', 'Monster', 'Guide'
    ],
    plotTwists: [
        'It was all a lie.',
        'The ally is actually the antagonist.',
        'The object is fake.',
        'Reinforcements arrive for the opposition.',
        'A third party intervenes.',
        'The location is unstable.',
        'Time flows strangely here.',
        'Physics behave incorrectly.',
        'The mission was a test.',
        'An old enemy returns as a friend.',
        'The prize is dangerous.',
        'Identity is mistaken.',
        'Powers fail unexpectedly.',
        'Technology malfunctions.',
        'A natural disaster strikes.',
        'The victim was the perpetrator.',
        'Memory is unreliable.',
        'The environment adapts.',
        'Silence falls, deafeningly.',
        'The way back is gone.',
        'A countdown begins.',
        'The solution is the problem.',
        'Everything is upside down.',
        'A secret sibling is revealed.',
        'The map is wrong.',
        'A monster is actually a guardian.',
        'The weather turns violent.',
        'Gravity shifts.',
        'A trap is triggered.',
        'Something important is missing.',
        'The target is already dead.',
        'A contagion spreads.',
        'Communication is cut off.',
        'The shadows move.',
        'An innocent is endangered.',
        'Supplies are destroyed.',
        'A rival group appears.',
        'The leader falls ill.',
        'A curse is activated.',
        'The past repeats itself.',
        'A prophecy is fulfilled.',
        'The rules change.',
        'Ammo/Energy runs out.',
        'A vehicle crashes.',
        'A fire breaks out.',
        'Water levels rise.',
        'The ground opens up.',
        'A message arrives too late.',
        'The key breaks.',
        'The enemy surrenders.',
        'A wild beast attacks.',
        'A ghost appears.',
        'The deadline moves up.'
    ],
    yesNoOdds: {
        'Almost Certain': { threshold: 2, text: 'Yes' }, // Rolls 2+ on d6 (simulated)
        'Likely': { threshold: 3, text: 'Yes' },
        '50/50': { threshold: 4, text: 'Yes' },
        'Unlikely': { threshold: 5, text: 'Yes' },
        'Rare': { threshold: 6, text: 'Yes' }
    }
};

export const getYesNoResult = (odds) => {
    // Standard d6 roll logic
    // 1 is always a "No, and..." (Critical Fail equivalent logic in typical oracles)
    // 6 is always a "Yes, and..." (Critical Success)

    // We'll simulate a more nuanced oracle:
    // Roll 2d6.
    // 2-6: No
    // 7-9: Mixed / 50-50
    // 10-12: Yes

    // Actually, let's stick to a simpler logic that fits TriCube's d6 nature or a standard GM emulator logic.
    // Let's use a flat probability based on the selected odds.

    const roll = Math.random();

    // Base probabilities for "Yes"
    let threshold = 0.5;

    switch (odds) {
        case 'Almost Certain': threshold = 0.90; break;
        case 'Likely': threshold = 0.75; break;
        case '50/50': threshold = 0.50; break;
        case 'Unlikely': threshold = 0.25; break;
        case 'Rare': threshold = 0.10; break;
        default: threshold = 0.50;
    }

    const isYes = roll < threshold;

    // Secondary roll for qualifiers (And/But)
    // 20% chance of a qualifier
    const qualifierRoll = Math.random();
    let qualifier = '';

    if (qualifierRoll < 0.1) {
        qualifier = ', and... (Extreme)';
    } else if (qualifierRoll < 0.25) {
        qualifier = ', but... (Complication)';
    }

    return (isYes ? 'Yes' : 'No') + qualifier;
};
