import { GHOST_SLOTS } from '../ghost-grid';

interface GhostGridProps {
    visible: boolean; // brightens during drag
}

function GhostShirt({ isGK }: { isGK: boolean }) {
    return (
        <svg width="52" height="52" viewBox="0 0 40 40">
            <path
                d="M8 12 L4 18 L10 20 L10 34 L30 34 L30 20 L36 18 L32 12 L26 10 Q20 14 14 10 Z"
                fill={isGK ? 'rgba(150,60,40,0.18)' : 'rgba(255,255,255,0.07)'}
                stroke={isGK ? 'rgba(200,100,70,0.55)' : 'rgba(255,255,255,0.32)'}
                strokeWidth="1"
            />
            <path d="M14 10 Q20 16 26 10" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
            <path d="M8 12 L4 18 L10 20 L10 16" fill="rgba(255,255,255,0.03)" />
            <path d="M32 12 L36 18 L30 20 L30 16" fill="rgba(255,255,255,0.03)" />
        </svg>
    );
}

export function GhostGrid({ visible }: GhostGridProps) {
    return (
        <div
            className="absolute inset-0 pointer-events-none"
            style={{
                opacity: visible ? 1 : 0,
                transition: 'opacity 0.25s ease',
                zIndex: 5,
            }}
        >
            {GHOST_SLOTS.map(slot => (
                <div
                    key={slot.id}
                    style={{
                        position: 'absolute',
                        left: `${slot.x}%`,
                        top: `${slot.y}%`,
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <GhostShirt isGK={slot.isGK} />
                </div>
            ))}
        </div>
    );
}