import { useState } from "react";
import { ScrollArea } from "@/components/scroll-area.tsx";
import { cn } from "@/lib/utils.ts";
import { JuveBadge } from "@/modules/home/layout/juve-badge";

const CHARACTERISTICS = [
    { label: 'Reputation', value: 1 },
    { label: 'Media Handling', value: 3 },
    { label: 'Tactical Consistency', value: 3 },
    { label: 'Hands On Approach', value: 3 },
    { label: 'Managing Finances', value: 3 },
    { label: 'Handling Team Discipline', value: 3 },
    { label: 'Loyalty To Players', value: 3 },
    { label: 'Domestic Player Bias', value: 2 },
];

const COACHING_ATTRS = [
    { label: 'Attacking', value: 12 },
    { label: 'Defending', value: 12 },
    { label: 'Fitness', value: 11 },
    { label: 'Goalkeeper Distribution', value: 6 },
    { label: 'Goalkeeper Handling', value: 6 },
    { label: 'Goalkeeper Shot Stopping', value: 6 },
    { label: 'Tactical', value: 11 },
    { label: 'Technical', value: 11 },
    { label: 'Mental', value: 11 },
    { label: 'Working With Youngsters', value: 11 },
];

const MENTAL_ATTRS = [
    { label: 'Adaptability', value: 10 },
    { label: 'Determination', value: 10 },
    { label: 'Player Knowledge', value: 9 },
    { label: 'Youngster Knowledge', value: 9 },
    { label: 'Level Of Discipline', value: 9 },
    { label: 'People Management', value: 9 },
    { label: 'Motivating', value: 9 },
];

function BarValue({ value, max = 5 }: { value: number; max?: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: max }).map((_, i) => (
                <div key={i} className={cn('h-3 w-7 rounded-sm', i < value ? 'bg-teal-500' : 'bg-zinc-700')} />
            ))}
        </div>
    );
}

function AttrValue({ value }: { value: number }) {
    const color = value >= 12 ? 'text-teal-400' : value >= 10 ? 'text-yellow-400' : 'text-zinc-300';
    return <span className={cn('text-xs font-semibold', color)}>{value}</span>;
}

export function ProfilePageContent() {
    const [tab, setTab] = useState<'Characteristics' | 'Attributes'>('Characteristics');

    return (
        <div className="h-[calc(100vh-120px)] px-2.5 pb-2.5">
            <ScrollArea className="h-full">
                <div className="pr-2 pb-4 space-y-3">
                    {/* Identity Row */}
                    <div className="grid grid-cols-3 gap-4 border border-zinc-700/60 rounded-lg bg-zinc-900/80 p-4">
                        <div className="flex items-start gap-3">
                            <div className="size-14 rounded bg-zinc-700 border border-zinc-600 flex items-center justify-center shrink-0">
                                <svg viewBox="0 0 24 30" className="h-10 text-zinc-500" fill="currentColor">
                                    <ellipse cx="12" cy="8" rx="6" ry="7" />
                                    <path d="M2 28 Q5 16 12 16 Q19 16 22 28 Z" />
                                </svg>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-3.5 relative overflow-hidden shrink-0 border border-zinc-500">
                                        <div className="absolute inset-0 bg-white" />
                                        <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-0.5 bg-red-600" />
                                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-0.5 bg-red-600" />
                                    </div>
                                    <span className="text-xs text-zinc-300">36 years old (1/11/1985)</span>
                                </div>
                                <p className="text-xs text-zinc-500">English</p>
                                <p className="text-xs text-zinc-500">Male</p>
                                <p className="text-xs text-zinc-500">0 caps / 0 goals</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-2">
                                <JuveBadge size="sm" />
                                <span className="text-xs text-zinc-400">Contracted to Juventus</span>
                            </div>
                            <p className="text-sm font-semibold text-zinc-200">Manager</p>
                            <p className="text-xs text-zinc-400">€50K p/w until 30/6/2024</p>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5">
                                <svg viewBox="0 0 12 12" className="size-3.5 text-yellow-400" fill="currentColor">
                                    <path d="M6 1l1.5 3 3.5.5-2.5 2.5.5 3.5L6 9 3 10.5l.5-3.5L1 4.5 4.5 4z" />
                                </svg>
                                <span className="text-xs text-zinc-400">Reputation</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                                {[1,2,3,4,5].map(i => (
                                    <svg key={i} viewBox="0 0 12 12" className={cn('size-3', i === 1 ? 'text-yellow-400' : 'text-zinc-700')} fill="currentColor">
                                        <path d="M6 1l1.5 3 3.5.5-2.5 2.5.5 3.5L6 9 3 10.5l.5-3.5L1 4.5 4.5 4z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-xs font-semibold text-zinc-200">Continental A Licence</p>
                            <p className="text-xs text-zinc-500">Professional Footballer (Regional level)</p>
                        </div>
                    </div>

                    {/* Style Row */}
                    <div className="grid grid-cols-4 gap-4 border border-zinc-700/60 rounded-lg bg-zinc-900/80 p-3">
                        {[
                            ['TACTICAL STYLE', 'Control Possession'],
                            ['PREFERRED FORMATION', 'Custom'],
                            ['PLAYING STYLE', 'Standard'],
                            ['2ND PREF FORMATION', 'Unknown'],
                        ].map(([label, val]) => (
                            <div key={label}>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">{label}</p>
                                <p className="text-xs text-zinc-200 font-medium">{val}</p>
                            </div>
                        ))}
                    </div>

                    {/* Main content */}
                    <div className="grid grid-cols-3 gap-3">
                        {/* Tabs area */}
                        <div className="col-span-2 border border-zinc-700/60 rounded-lg bg-zinc-900/80 overflow-hidden">
                            <div className="flex border-b border-zinc-700/60">
                                {(['Characteristics', 'Attributes'] as const).map(t => (
                                    <button key={t} onClick={() => setTab(t)}
                                            className={cn('px-4 py-2.5 text-xs font-medium transition-colors',
                                                tab === t ? 'text-zinc-100 border-b-2 border-teal-400 -mb-px bg-zinc-800/40' : 'text-zinc-500 hover:text-zinc-300'
                                            )}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                            <div className="p-4">
                                {tab === 'Characteristics' && (
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            {CHARACTERISTICS.map((c, i) => (
                                                <div key={i} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-zinc-600 text-[10px]">ⓘ</span>
                                                        <span className="text-xs text-zinc-400">{c.label}</span>
                                                    </div>
                                                    <BarValue value={c.value} />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] font-bold text-teal-400 uppercase tracking-wider mb-2">KNOWN FOR</p>
                                                <p className="text-xs text-zinc-500">Not enough is known about this manager yet.</p>
                                            </div>
                                            <div className="space-y-2">
                                                {[
                                                    ['PRESS CONFERENCES', 'Yet to complete a press conference'],
                                                    ['INTERACTION STYLE', 'Has not spoken directly to any of his players recently'],
                                                    ['LANGUAGES SPOKEN', 'English (Fluent)'],
                                                ].map(([label, val]) => (
                                                    <div key={label}>
                                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{label}</p>
                                                        <p className="text-xs text-zinc-400">{val}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {tab === 'Attributes' && (
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">COACHING</p>
                                            {COACHING_ATTRS.map((a, i) => (
                                                <div key={i} className="flex items-center justify-between py-0.5 text-xs">
                                                    <span className="text-zinc-400">{a.label}</span>
                                                    <AttrValue value={a.value} />
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">MENTAL</p>
                                            {MENTAL_ATTRS.map((a, i) => (
                                                <div key={i} className="flex items-center justify-between py-0.5 text-xs">
                                                    <span className="text-zinc-400">{a.label}</span>
                                                    <AttrValue value={a.value} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right sidebar */}
                        <div className="space-y-3">
                            <div className="border border-zinc-700/60 rounded-lg bg-zinc-900/80 p-3">
                                <p className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-3">RELATIONSHIPS</p>
                                {['BEST OPINION', 'WORST OPINION'].map(title => (
                                    <div key={title} className="mb-3">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">{title}</p>
                                        <div className="grid grid-cols-2 text-[10px] text-zinc-700 uppercase tracking-wider border-b border-zinc-800 pb-1">
                                            <span>NAME</span><span>RELATIONSHIP</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border border-zinc-700/60 rounded-lg bg-zinc-900/80 p-3">
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">SCOUTING KNOWLEDGE</p>
                                {/* World map */}
                                <div className="h-20 bg-zinc-800/50 rounded relative overflow-hidden mb-3">
                                    <svg viewBox="0 0 200 100" className="w-full h-full opacity-30" preserveAspectRatio="xMidYMid meet">
                                        <ellipse cx="25" cy="55" rx="18" ry="28" fill="#71717a" />
                                        <ellipse cx="75" cy="42" rx="28" ry="22" fill="#71717a" />
                                        <ellipse cx="125" cy="42" rx="22" ry="18" fill="#71717a" />
                                        <ellipse cx="165" cy="38" rx="14" ry="18" fill="#71717a" />
                                        <ellipse cx="50" cy="68" rx="12" ry="16" fill="#71717a" />
                                    </svg>
                                    <div className="absolute top-[28%] left-[45%] size-1.5 rounded-full bg-teal-400" />
                                    <div className="absolute top-[36%] left-[50%] size-1.5 rounded-full bg-yellow-400" />
                                </div>
                                <div>
                                    <div className="grid grid-cols-2 text-[10px] text-zinc-600 uppercase tracking-wider mb-1.5">
                                        <span>NATION</span><span>KNOWLEDGE</span>
                                    </div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-4 h-2.5 relative overflow-hidden border border-zinc-600 shrink-0">
                                                <div className="absolute inset-0 bg-white" />
                                                <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-px bg-red-500" />
                                                <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-px bg-red-500" />
                                            </div>
                                            <span className="text-zinc-300">England</span>
                                        </div>
                                        <span className="text-teal-400">Extensive</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-4 h-2.5 flex flex-col border border-zinc-600 overflow-hidden shrink-0">
                                                <div className="flex-1 bg-green-600" />
                                                <div className="flex-1 bg-white" />
                                                <div className="flex-1 bg-red-600" />
                                            </div>
                                            <span className="text-zinc-300">Italy</span>
                                        </div>
                                        <span className="text-yellow-400">Minimal</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom row */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="border border-zinc-700/60 rounded-lg bg-zinc-900/80 p-3">
                            <p className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2">HISTORY ›</p>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="text-zinc-500">2022 -</span>
                                <JuveBadge size="xs" />
                                <span className="text-teal-400 cursor-pointer hover:underline">Juventus</span>
                                <span className="text-zinc-500 ml-auto">Manager</span>
                            </div>
                        </div>
                        <div className="border border-zinc-700/60 rounded-lg bg-zinc-900/80 p-3">
                            <p className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-3">VIEW MANAGER TIMELINE ›</p>
                            <div className="relative pl-5">
                                <div className="absolute left-2 top-0 bottom-0 w-px bg-zinc-700" />
                                <div className="relative">
                                    <div className="absolute -left-5 top-0 size-3.5 rounded-full bg-green-500 flex items-center justify-center">
                                        <div className="size-1.5 rounded-full bg-white" />
                                    </div>
                                    <p className="text-xs font-semibold text-zinc-300">2022</p>
                                    <div className="flex justify-between text-xs mt-1">
                                        <span className="text-zinc-400">Hired as Juventus manager</span>
                                        <span className="text-zinc-500">11/7/2022</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border border-zinc-700/60 rounded-lg bg-zinc-900/80 p-3">
                            <p className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2">CAREER STATS ›</p>
                            <div className="grid grid-cols-2 gap-x-3 text-xs">
                                {[['Games Played','-'],['Goals For','-'],['Games Won','-'],['Goals Against','-'],['Games Drawn','-'],['Goal Difference','-'],['Games Lost','-'],['Win Percentage','-']].map(([l,v]) => (
                                    <div key={l} className="flex justify-between py-0.5">
                                        <span className="text-zinc-500 truncate mr-1">{l}</span>
                                        <span className="text-zinc-400 shrink-0">{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}