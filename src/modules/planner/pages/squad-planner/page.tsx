import { useState, type CSSProperties } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TrendType = "fast_rise" | "rise" | "stable" | "decline" | "fast_decline";

interface Attribute {
    name: string;
    value: number;
    trend: TrendType;
}

interface TrendConfig {
    symbol: string;
    color: string;
}

interface CellStyle {
    bg: string;
    fg: string;
    bold: boolean;
}

interface PlayerData {
    name: string;
    age: number;
    nationality: string;
    club: string;
    position: string;
    height: string;
    weight: string;
    preferredFoot: string;
    personality: string;
    mediaDescription: string;
    goalkeeperRating: number;
    reputation: string;
    traits: string[];
    technical: Attribute[];
    mental: Attribute[];
    physical: Attribute[];
}

interface LegendItem {
    symbol: string;
    color: string;
    label: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const T = {
    FAST_RISE:    "fast_rise"    as TrendType,
    RISE:         "rise"         as TrendType,
    STABLE:       "stable"       as TrendType,
    DECLINE:      "decline"      as TrendType,
    FAST_DECLINE: "fast_decline" as TrendType,
};

const TREND_CFG: Record<TrendType, TrendConfig | null> = {
    fast_rise:    { symbol: "▲", color: "#e87820" },
    rise:         { symbol: "▲", color: "#e8a040" },
    stable:       null,
    decline:      { symbol: "▼", color: "#d4c020" },
    fast_decline: { symbol: "▼", color: "#b09010" },
};

const LEGEND_ITEMS: LegendItem[] = [
    { symbol: "▲", color: "#e87820", label: "Быстро растёт" },
    { symbol: "▲", color: "#e8a040", label: "Растёт" },
    { symbol: "—", color: "#606878", label: "Стабильно" },
    { symbol: "▼", color: "#d4c020", label: "Падает" },
    { symbol: "▼", color: "#b09010", label: "Быстро падает" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCellStyle(v: number): CellStyle {
    if (v >= 17) return { bg: "#197040", fg: "#ffffff",  bold: true  };
    if (v >= 14) return { bg: "#2a7a50", fg: "#e0ffe0",  bold: true  };
    return              { bg: "transparent", fg: "#c8cdd8", bold: false };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface RowProps {
    name: string;
    value: number;
    trend: TrendType;
    active: boolean;
}

function Row({ name, value, trend, active }: RowProps) {
    const { bg, fg, bold } = getCellStyle(value);
    const tCfg = TREND_CFG[trend];

    const rowStyle: CSSProperties = {
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "space-between",
        padding:         "0 6px",
        height:          "22px",
        background:      active ? "#1e3a5f" : "transparent",
        borderLeft:      active ? "2px solid #4a8ac4" : "2px solid transparent",
    };

    const nameStyle: CSSProperties = {
        fontSize:      "12px",
        color:         active ? "#90c8f0" : "#b8bdc8",
        whiteSpace:    "nowrap",
        overflow:      "hidden",
        textOverflow:  "ellipsis",
        maxWidth:      "130px",
    };

    const valueStyle: CSSProperties = {
        fontSize:     "12px",
        fontWeight:   bold ? "bold" : "normal",
        color:        fg,
        background:   bg,
        minWidth:     "20px",
        textAlign:    "center",
        padding:      bg !== "transparent" ? "0 3px" : "0",
        borderRadius: "1px",
        lineHeight:   "18px",
        display:      "inline-block",
    };

    return (
        <div style={rowStyle}>
            <span style={nameStyle}>{name}</span>
            <span style={{ display: "flex", alignItems: "center", gap: "2px", flexShrink: 0 }}>
        {tCfg && (
            <span style={{ color: tCfg.color, fontSize: "9px", lineHeight: 1 }}>
            {tCfg.symbol}
          </span>
        )}
                <span style={valueStyle}>{value}</span>
      </span>
        </div>
    );
}

interface SectionProps {
    title: string;
    attrs: Attribute[];
    activeRow?: string;
}

function Section({ title, attrs, activeRow }: SectionProps) {
    return (
        <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
                fontSize:      "11px",
                fontWeight:    "bold",
                color:         "#d8dde8",
                padding:       "4px 8px 3px",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                background:    "#1a2030",
                borderBottom:  "1px solid #2a3048",
            }}>
                {title}
            </div>
            {attrs.map((a) => (
                <Row key={a.name} {...a} active={a.name === activeRow} />
            ))}
        </div>
    );
}

interface InfoRowProps {
    label: string;
    value: string | number;
    accent?: boolean;
}

function InfoRow({ label, value, accent = false }: InfoRowProps) {
    return (
        <div style={{ marginBottom: "8px" }}>
            <div style={{
                fontSize:      "10px",
                fontWeight:    "bold",
                color:         "#d0d5e0",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
            }}>
                {label}
            </div>
            <div style={{
                fontSize:  "12px",
                color:     accent ? "#ffffff" : "#a8b0c0",
                marginTop: "1px",
            }}>
                {value}
            </div>
        </div>
    );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLAYER: PlayerData = {
    name:             "Wilfried Gnonto",
    age:              19,
    nationality:      "🇮🇹 Italian",
    club:             "Southampton",
    position:         "AM (C), ST (C) / AM (RL)",
    height:           "170 cm",
    weight:           "71 kg",
    preferredFoot:    "Right",
    personality:      "Fairly Determined",
    mediaDescription: "Wonderkid",
    goalkeeperRating: 2,
    reputation:       "Continental",
    traits: [
        "Moves Ball To Right Foot Before Dribble Attempt",
    ],
    technical: [
        { name: "Corners",          value: 4,  trend: T.RISE    },
        { name: "Crossing",         value: 9,  trend: T.STABLE  },
        { name: "Dribbling",        value: 16, trend: T.STABLE  },
        { name: "Finishing",        value: 13, trend: T.STABLE  },
        { name: "First Touch",      value: 13, trend: T.STABLE  },
        { name: "Free Kick Taking", value: 5,  trend: T.RISE    },
        { name: "Heading",          value: 8,  trend: T.STABLE  },
        { name: "Long Shots",       value: 9,  trend: T.DECLINE },
        { name: "Long Throws",      value: 3,  trend: T.STABLE  },
        { name: "Marking",          value: 3,  trend: T.STABLE  },
        { name: "Passing",          value: 11, trend: T.STABLE  },
        { name: "Penalty Taking",   value: 10, trend: T.RISE    },
        { name: "Tackling",         value: 5,  trend: T.STABLE  },
        { name: "Technique",        value: 15, trend: T.STABLE  },
    ],
    mental: [
        { name: "Aggression",    value: 8,  trend: T.STABLE  },
        { name: "Anticipation",  value: 12, trend: T.DECLINE },
        { name: "Bravery",       value: 13, trend: T.STABLE  },
        { name: "Composure",     value: 12, trend: T.STABLE  },
        { name: "Concentration", value: 8,  trend: T.STABLE  },
        { name: "Decisions",     value: 10, trend: T.STABLE  },
        { name: "Determination", value: 15, trend: T.STABLE  },
        { name: "Flair",         value: 15, trend: T.DECLINE },
        { name: "Leadership",    value: 5,  trend: T.STABLE  },
        { name: "Off The Ball",  value: 13, trend: T.DECLINE },
        { name: "Positioning",   value: 5,  trend: T.STABLE  },
        { name: "Teamwork",      value: 11, trend: T.STABLE  },
        { name: "Vision",        value: 11, trend: T.STABLE  },
        { name: "Work Rate",     value: 13, trend: T.DECLINE },
    ],
    physical: [
        { name: "Acceleration",    value: 16, trend: T.STABLE  },
        { name: "Agility",         value: 16, trend: T.STABLE  },
        { name: "Balance",         value: 16, trend: T.RISE    },
        { name: "Jumping Reach",   value: 5,  trend: T.STABLE  },
        { name: "Natural Fitness", value: 17, trend: T.STABLE  },
        { name: "Pace",            value: 15, trend: T.STABLE  },
        { name: "Stamina",         value: 13, trend: T.DECLINE },
        { name: "Strength",        value: 12, trend: T.STABLE  },
    ],
};

// ─── Main component ───────────────────────────────────────────────────────────

export function Page() {
    const [legendOpen, setLegendOpen] = useState<boolean>(false);

    return (
        <div style={{
            fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif",
            background: "#161b26",
            color:      "#c8cdd8",
            minHeight:  "100vh",
            fontSize:   "12px",
            userSelect: "none",
        }}>

            {/* Header */}
            <div style={{
                background:    "#1a2030",
                borderBottom:  "1px solid #2a3048",
                padding:       "7px 12px",
                display:       "flex",
                alignItems:    "center",
                justifyContent:"space-between",
                gap:           "10px",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                        background:   "#253050",
                        border:       "1px solid #3a4870",
                        padding:      "2px 8px",
                        fontSize:     "11px",
                        fontWeight:   "bold",
                        color:        "#a0b8e0",
                        borderRadius: "2px",
                        whiteSpace:   "nowrap",
                    }}>
                        {PLAYER.position}
                    </div>
                    <div>
                        <div style={{ color: "#ffffff", fontWeight: "bold", fontSize: "14px" }}>
                            {PLAYER.name}
                        </div>
                        <div style={{ color: "#788090", fontSize: "11px" }}>
                            {PLAYER.nationality} · {PLAYER.age} лет · {PLAYER.club}
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setLegendOpen((v) => !v)}
                    style={{
                        background:  "#1e2840",
                        border:      "1px solid #3a4870",
                        color:       "#8090b0",
                        padding:     "3px 10px",
                        cursor:      "pointer",
                        fontFamily:  "inherit",
                        fontSize:    "11px",
                        borderRadius:"2px",
                        whiteSpace:  "nowrap",
                    }}
                >
                    {legendOpen ? "✕ Легенда" : "▲▼ Легенда"}
                </button>
            </div>

            {/* Legend */}
            {legendOpen && (
                <div style={{
                    background:   "#1a2030",
                    borderBottom: "1px solid #2a3048",
                    padding:      "6px 12px",
                    display:      "flex",
                    gap:          "20px",
                    flexWrap:     "wrap",
                }}>
                    {LEGEND_ITEMS.map(({ symbol, color, label }) => (
                        <div key={label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ color, fontSize: "10px", width: "10px", textAlign: "center" }}>
                {symbol}
              </span>
                            <span style={{ color: "#7880a0", fontSize: "11px" }}>{label}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Attributes grid */}
            <div style={{ display: "flex", alignItems: "flex-start" }}>

                <div style={{ flex: "0 0 185px", borderRight: "1px solid #252b3a" }}>
                    <Section title="Technical" attrs={PLAYER.technical} activeRow="Passing" />
                </div>

                <div style={{ flex: "0 0 185px", borderRight: "1px solid #252b3a" }}>
                    <Section title="Mental" attrs={PLAYER.mental} />
                </div>

                <div style={{ flex: "0 0 185px", borderRight: "1px solid #252b3a" }}>
                    <Section title="Physical" attrs={PLAYER.physical} />

                    <div style={{ padding: "4px 8px", borderTop: "1px solid #252b3a" }}>
                        {([["Height", PLAYER.height], ["Weight", PLAYER.weight]] as [string, string][]).map(([k, v]) => (
                            <div key={k} style={{
                                display:        "flex",
                                justifyContent: "space-between",
                                height:         "22px",
                                alignItems:     "center",
                            }}>
                                <span style={{ color: "#b8bdc8", fontSize: "12px" }}>{k}</span>
                                <span style={{ color: "#c8cdd8", fontSize: "12px" }}>{v}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info panel */}
                <div style={{ flex: 1, padding: "10px 14px", minWidth: 0 }}>
                    <InfoRow label="Reputation"        value={PLAYER.reputation} />
                    <InfoRow label="Preferred Foot"    value={PLAYER.preferredFoot} />
                    <InfoRow label="Personality"       value={PLAYER.personality} />
                    <InfoRow label="Media Description" value={PLAYER.mediaDescription} accent />
                    <InfoRow label="Goalkeeper Rating" value={PLAYER.goalkeeperRating} />

                    <div style={{ marginTop: "4px" }}>
                        <div style={{
                            fontSize:      "10px",
                            fontWeight:    "bold",
                            color:         "#d0d5e0",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            marginBottom:  "5px",
                        }}>
                            Player Traits
                        </div>
                        {PLAYER.traits.length === 0 ? (
                            <div style={{ color: "#606878", fontSize: "12px" }}>None</div>
                        ) : (
                            PLAYER.traits.map((t) => (
                                <div key={t} style={{ color: "#a8b0c0", fontSize: "12px", lineHeight: "1.6" }}>
                                    {t}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}