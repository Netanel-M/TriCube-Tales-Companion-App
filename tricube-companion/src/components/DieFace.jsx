import React from 'react';

export const DieFace = ({ value, targetNumber = 0, size = 64 }) => {
    // Determine colors based on success (if targetNumber provided) or neutral
    const isSuccess = targetNumber > 0 && value >= targetNumber;
    const isFail = targetNumber > 0 && value < targetNumber;

    // Default to neutral/dark if no target number (or for decoration)
    let pipColor = 'var(--ink)';
    let borderColor = 'var(--gold)';
    let bgColor = 'white';

    if (isSuccess) {
        pipColor = 'white';
        borderColor = 'var(--forest)';
        bgColor = 'var(--forest)';
    } else if (isFail) {
        pipColor = 'white';
        borderColor = 'var(--crimson)';
        bgColor = 'var(--crimson)';
    }

    // Grid positions for pips (3x3 grid)
    // 1 2 3
    // 4 5 6
    // 7 8 9
    const pips = [];
    if (value % 2 !== 0) pips.push(5); // Center
    if (value > 1) { pips.push(1); pips.push(9); }
    if (value > 3) { pips.push(3); pips.push(7); }
    if (value === 6) { pips.push(4); pips.push(6); }

    // Map 1-9 positions to grid coordinates (row/col 1-3)
    const getPos = (i) => {
        const row = Math.ceil(i / 3);
        const col = (i - 1) % 3 + 1;
        return { gridRowStart: row, gridColumnStart: col };
    };

    // Calculate pip size relative to container
    const pipSize = Math.max(4, Math.floor(size / 6));
    const padding = Math.max(4, Math.floor(size / 8));

    return (
        <div
            className="rounded-lg shadow-sm flex items-center justify-center border overflow-hidden relative"
            style={{
                width: `${size}px`,
                height: `${size}px`,
                borderColor: borderColor,
                background: bgColor,
                transition: 'all 0.3s ease'
            }}
        >
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gridTemplateRows: 'repeat(3, 1fr)',
                width: '100%',
                height: '100%',
                padding: `${padding}px`,
            }}>
                {pips.map((pos, i) => (
                    <div
                        key={i}
                        className="rounded-full"
                        style={{
                            ...getPos(pos),
                            background: pipColor,
                            width: `${pipSize}px`,
                            height: `${pipSize}px`,
                            margin: 'auto'
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
};
