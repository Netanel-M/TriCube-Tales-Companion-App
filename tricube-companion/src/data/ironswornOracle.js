import classicData from '@datasworn/ironsworn-classic/json/classic.json';

// Map generic IDs to specific Datasworn IDs
const TABLE_MAP = {
    action: 'classic/oracles/action_and_theme/action',
    theme: 'classic/oracles/action_and_theme/theme',
    descriptor: 'classic/oracles/place/descriptor',
    twist: 'classic/oracles/turning_point/major_plot_twist',
    role: 'classic/oracles/character/role',
    goal: 'classic/oracles/character/goal',
    trouble: 'classic/oracles/settlement/trouble',
    combat: 'classic/oracles/turning_point/combat_action'
};

/**
 * Helper to find a table by its Datasworn ID within the nested structure.
 * Datasworn structure is roughly:
 * {
 *   oracles: {
 *     category_id: {
 *       contents: {
 *         oracle_id: { rows: [...] }
 *       }
 *     }
 *   }
 * }
 * We need to traverse this or flatten it.
 * For efficiency, let's build a lookup map on first load if needed,
 * or just traverse since the dataset isn't huge.
 */
const findTable = (id) => {
    // Attempt to find the table in the nested structure
    for (const catKey in classicData.oracles) {
        const category = classicData.oracles[catKey];
        if (category.contents) {
            for (const key in category.contents) {
                const oracle = category.contents[key];
                if (oracle._id === id) return oracle;

                // Handle nested tables (some oracles are groups)
                if (oracle.contents) {
                    for (const subKey in oracle.contents) {
                        const subOracle = oracle.contents[subKey];
                        if (subOracle._id === id) return subOracle;
                    }
                }
            }
        }
    }
    return null;
};

// Cache the found tables
const CACHE = {};

export const getOracleTable = (type) => {
    if (CACHE[type]) return CACHE[type];

    const id = TABLE_MAP[type];
    if (!id) return null;

    const table = findTable(id);
    if (!table) {
        console.error(`Oracle table not found: ${id}`);
        return null;
    }
    CACHE[type] = table;
    return table;
};

export const rollOracle = (type) => {
    const table = getOracleTable(type);
    if (!table) return 'Error';

    const roll = Math.floor(Math.random() * 100) + 1;

    // Find the row where min <= roll <= max
    const row = table.rows.find(r => r.min <= roll && r.max >= roll);
    return row ? row.text : 'Unknown';
};

export const rollOracleMultiple = (types) => {
    const results = {};
    types.forEach(type => {
        results[type] = rollOracle(type);
    });
    return results;
};

// Ironsworn / Hybrid Yes/No Logic
export const YES_NO_ODDS = {
    'Almost Certain': { threshold: 10, label: 'Almost Certain' }, // > 10 (90%)
    'Likely': { threshold: 25, label: 'Likely' },                 // > 25 (75%)
    '50/50': { threshold: 50, label: '50/50' },                   // > 50 (50%)
    'Unlikely': { threshold: 75, label: 'Unlikely' },             // > 75 (25%)
    'Small Chance': { threshold: 90, label: 'Small Chance' }      // > 90 (10%)
};

export const askOracle = (oddsKey) => {
    const odds = YES_NO_ODDS[oddsKey] || YES_NO_ODDS['50/50'];
    const roll = Math.floor(Math.random() * 100) + 1;

    const isYes = roll <= (100 - odds.threshold);

    let yesThreshold = 50;
    switch (oddsKey) {
        case 'Almost Certain': yesThreshold = 90; break;
        case 'Likely': yesThreshold = 75; break;
        case '50/50': yesThreshold = 50; break;
        case 'Unlikely': yesThreshold = 25; break;
        case 'Small Chance': yesThreshold = 10; break;
    }

    const resultIsYes = roll <= yesThreshold;

    // Match check (11, 22, ... 99, 100)
    // Note: 11 is a match. 
    const isMatch = (roll % 11 === 0) || (roll === 100 && false); // 100 % 11 != 0. 99 is match. 
    // In Ironsworn, 100 is often treated as a match or 00.
    // Let's treat 11, 22 ... 99 as matches. 100?
    // "Matches are double digits 11, 22... and 100."
    const isExtreme = (roll % 11 === 0) || (roll === 100);

    let text = resultIsYes ? 'Yes' : 'No';

    let qualifier = '';

    if (isExtreme) {
        qualifier = 'and...';
    } else {
        // 20% chance of "But..."
        // Let's simulate this separte from the main roll to avoid biasing the Yes/No distribution
        // relative to the threshold.
        const qRoll = Math.random();
        if (qRoll < 0.20) {
            qualifier = 'but...';
        }
    }

    return {
        answer: text,
        qualifier: qualifier,
        roll: roll,
        isMatch: isExtreme
    };
};
