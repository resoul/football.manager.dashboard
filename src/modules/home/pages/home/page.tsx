import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/scroll-area";
import { Button } from "@/components/button";
import { ChevronRight } from "lucide-react";
import { JuveBadge } from "@/modules/home/layout/juve-badge";

function SectionHeader({ title, chevron = true }: { title: string; chevron?: boolean }) {
    return (
        <div className="flex items-center justify-between mb-2">
            <span className={cn("text-xs font-bold uppercase tracking-wider", chevron ? "text-teal-400 cursor-pointer hover:text-teal-300" : "text-zinc-400")}>
                {title} {chevron && <ChevronRight className="inline size-3" />}
            </span>
        </div>
    );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────

const LEAGUE_TABLE = [
    { pos: 1, team: 'Atalanta', p: 0, gd: 0, pts: 0, color: 'bg-blue-500' },
    { pos: 2, team: 'Bologna', p: 0, gd: 0, pts: 0, color: 'bg-red-600' },
    { pos: 3, team: 'Brianza', p: 0, gd: 0, pts: 0, color: 'bg-red-500' },
    { pos: 4, team: 'Capitoline', p: 0, gd: 0, pts: 0, color: 'bg-yellow-500' },
    { pos: 5, team: 'Cremonese', p: 0, gd: 0, pts: 0, color: 'bg-red-700' },
    { pos: 6, team: 'Empoli', p: 0, gd: 0, pts: 0, color: 'bg-blue-400' },
    { pos: 7, team: 'Fiorentina', p: 0, gd: 0, pts: 0, color: 'bg-purple-600' },
    { pos: 8, team: 'Inter', p: 0, gd: 0, pts: 0, color: 'bg-blue-700' },
    { pos: 9, team: 'Juventus', p: 0, gd: 0, pts: 0, highlighted: true, color: 'bg-zinc-800' },
    { pos: 10, team: 'Lazio', p: 0, gd: 0, pts: 0, color: 'bg-blue-300' },
    { pos: 11, team: 'Milan', p: 0, gd: 0, pts: 0, color: 'bg-red-700' },
    { pos: 12, team: 'Parthenope', p: 0, gd: 0, pts: 0, color: 'bg-blue-500' },
    { pos: 13, team: 'Salento', p: 0, gd: 0, pts: 0, color: 'bg-yellow-600' },
    { pos: 14, team: 'Salernitana', p: 0, gd: 0, pts: 0, color: 'bg-red-500' },
    { pos: 15, team: 'Sampdoria', p: 0, gd: 0, pts: 0, color: 'bg-blue-600' },
    { pos: 16, team: 'Sassuolo', p: 0, gd: 0, pts: 0, color: 'bg-green-600' },
    { pos: 17, team: 'Spezia', p: 0, gd: 0, pts: 0, color: 'bg-zinc-700' },
    { pos: 18, team: 'Torino', p: 0, gd: 0, pts: 0, color: 'bg-red-800' },
    { pos: 19, team: 'Udinese', p: 0, gd: 0, pts: 0, color: 'bg-zinc-600' },
    { pos: 20, team: 'Verona', p: 0, gd: 0, pts: 0, color: 'bg-yellow-600' },
];

const FIXTURES = [
    { date: '12/07', venue: 'N', opponent: 'Juventus Second XI', type: 'FR', opponentBadge: null },
    { date: '16/07', venue: 'A', opponent: 'Galatasaray', type: 'FR', opponentBadge: 'bg-yellow-500' },
    { date: '30/07', venue: 'H', opponent: 'Milan', type: 'FR', opponentBadge: 'bg-red-700' },
    { date: '03/08', venue: 'A', opponent: 'Shakhtar', type: 'FR', opponentBadge: 'bg-orange-500' },
    { date: '06/08', venue: 'A', opponent: 'PAOK', type: 'FR', opponentBadge: 'bg-zinc-700' },
];

function HomePageContent() {
    return (
        <div className="h-[calc(100vh-120px)] px-2.5 pb-2.5">
            <ScrollArea className="h-full">
                <div className="pr-2 space-y-2 pb-4">
                    {/* Top row: Team news + Fixtures */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="border border-zinc-700/60 rounded-lg bg-zinc-900/80 p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <JuveBadge size="sm" />
                                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider cursor-pointer hover:text-teal-300">JUVENTUS TEAM NEWS</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-red-500 text-xs mt-0.5 shrink-0">●</span>
                                <span className="text-xs text-zinc-300">Four players out injured</span>
                            </div>
                            <div className="mt-3 flex items-center gap-2 mb-2">
                                <JuveBadge size="sm" />
                                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider cursor-pointer hover:text-teal-300">JUVENTUS SECOND XI TEAM NEWS</span>
                            </div>
                            <p className="text-xs text-zinc-500 ml-2">No team news</p>
                        </div>

                        <div className="border border-zinc-700/60 rounded-lg bg-zinc-900/80 p-3">
                            <SectionHeader title="JUVENTUS FIXTURES" />
                            <table className="w-full text-xs">
                                <tbody>
                                {FIXTURES.map((fix, i) => (
                                    <tr key={i} className="hover:bg-zinc-800/40 cursor-pointer transition-colors">
                                        <td className="py-1 text-zinc-400 w-12">{fix.date}</td>
                                        <td className="py-1 w-8">
                                                <span className={cn('text-[10px] font-bold px-1',
                                                    fix.venue === 'H' ? 'text-teal-400' :
                                                        fix.venue === 'A' ? 'text-zinc-400' : 'text-yellow-400'
                                                )}>
                                                    {fix.venue}
                                                </span>
                                        </td>
                                        <td className="py-1">
                                            <div className="flex items-center gap-1.5">
                                                {fix.opponentBadge ? (
                                                    <div className={cn('size-4 rounded-full shrink-0 flex items-center justify-center', fix.opponentBadge)}>
                                                        <svg viewBox="0 0 32 36" className="size-2.5 text-white/70" fill="currentColor">
                                                            <path d="M16 2L3 8v10c0 8.5 5.5 16.5 13 19 7.5-2.5 13-10.5 13-19V8L16 2z" />
                                                        </svg>
                                                    </div>
                                                ) : (
                                                    <JuveBadge size="xs" />
                                                )}
                                                <span className={cn('text-zinc-300', i === 0 && 'text-teal-400')}>{fix.opponent}</span>
                                            </div>
                                        </td>
                                        <td className="py-1 text-right text-zinc-500">{fix.type}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Next Match */}
                    <div className="border border-zinc-700/60 rounded-lg bg-zinc-900/80 p-4">
                        <div className="text-center mb-3">
                            <p className="text-xs font-bold text-teal-400 uppercase tracking-wider">NEXT MATCH</p>
                            <p className="text-xs text-zinc-400">Tuesday 12th July 2022 (Tomorrow)</p>
                        </div>
                        <div className="flex items-center justify-center gap-8">
                            <JuveBadge size="lg" />
                            <div className="text-center flex-1">
                                <h2 className="text-base font-bold text-zinc-100">Juventus v Juventus Second XI</h2>
                                <p className="text-xs text-teal-400 mt-0.5">Friendly</p>
                                <p className="text-xs text-zinc-500 mt-1">⚽ Giuseppe Moccagatta &nbsp;🌡 31°C</p>
                                <div className="flex items-center justify-center gap-8 mt-2 text-xs text-zinc-500">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-zinc-600">MANAGER</p>
                                        <p className="text-zinc-300">Yurii Maksymov</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-zinc-600">PREVIOUS MEETINGS</p>
                                        <p className="text-zinc-300">None</p>
                                    </div>
                                </div>
                            </div>
                            <JuveBadge size="lg" />
                        </div>
                    </div>

                    {/* 4-col grid */}
                    <div className="grid grid-cols-4 gap-2">
                        {/* League Table */}
                        <div className="border border-zinc-700/60 rounded-lg bg-zinc-900/80 p-3">
                            <SectionHeader title="LEAGUE TABLE" />
                            <p className="text-[10px] text-zinc-500 text-center mb-2">League Positions</p>
                            <table className="w-full text-xs">
                                <thead>
                                <tr className="text-zinc-600 text-[10px]">
                                    <th className="text-left py-0.5 w-6">POS</th>
                                    <th className="text-left py-0.5">TEAM</th>
                                    <th className="text-right py-0.5 w-4">P</th>
                                    <th className="text-right py-0.5 w-6">GD</th>
                                    <th className="text-right py-0.5 w-7">PTS</th>
                                </tr>
                                </thead>
                                <tbody>
                                {LEAGUE_TABLE.map(row => (
                                    <tr key={row.pos} className={cn('cursor-pointer hover:bg-zinc-800/30 transition-colors', row.highlighted && 'bg-zinc-800/50')}>
                                        <td className="py-px text-zinc-600 text-[10px]">{row.pos}</td>
                                        <td className="py-px">
                                            <div className="flex items-center gap-1">
                                                <div className={cn('size-2.5 rounded-full shrink-0', row.color ?? 'bg-zinc-600')} />
                                                <span className={cn('truncate text-[11px]', row.highlighted ? 'text-teal-400 font-medium' : 'text-zinc-300')}>
                                                        {row.team}
                                                    </span>
                                            </div>
                                        </td>
                                        <td className="py-px text-right text-zinc-600 text-[10px]">{row.p}</td>
                                        <td className="py-px text-right text-zinc-600 text-[10px]">{row.gd}</td>
                                        <td className="py-px text-right text-zinc-500 text-[10px] font-medium">{row.pts}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Player Stats */}
                        <div className="border border-zinc-700/60 rounded-lg bg-zinc-900/80 p-3">
                            <SectionHeader title="PLAYER STATS" />
                            <div className="flex items-center justify-center h-32">
                                <p className="text-xs text-zinc-500">No match stats available</p>
                            </div>
                        </div>

                        {/* Promises */}
                        <div className="border border-zinc-700/60 rounded-lg bg-zinc-900/80 p-3">
                            <SectionHeader title="PROMISES" />
                            <div className="flex items-center justify-center h-32">
                                <p className="text-xs text-zinc-500 text-center px-2">You have no outstanding promises at this time.</p>
                            </div>
                        </div>

                        {/* Finance */}
                        <div className="border border-zinc-700/60 rounded-lg bg-zinc-900/80 p-3">
                            <SectionHeader title="FINANCE & SALARY" />
                            <div className="h-20 relative mb-2">
                                <span className="absolute top-0 right-0 text-[9px] text-zinc-600">(€180M)</span>
                                <span className="absolute bottom-0 right-0 text-[9px] text-zinc-600">(€200M)</span>
                                <div className="h-full flex items-end gap-px px-1">
                                    {Array.from({ length: 28 }).map((_, i) => (
                                        <div key={i} className="flex-1 bg-blue-500/50 rounded-t-sm"
                                             style={{ height: `${30 + Math.sin(i * 0.4) * 20}%` }} />
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1.5 text-[10px]">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-zinc-600 uppercase tracking-wide">OVERALL BALANCE</p>
                                        <p className="text-zinc-200 font-semibold text-xs">€8,464,884</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-zinc-600 uppercase tracking-wide">PROFIT/(LOSS)</p>
                                        <p className="text-zinc-200 font-semibold text-xs">€188,484,974</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-zinc-600 uppercase tracking-wide">TRANSFER BUDGET</p>
                                    <p className="text-zinc-200 font-semibold text-xs">€18,100,000</p>
                                </div>
                                <div>
                                    <p className="text-zinc-600 uppercase tracking-wide">WAGE BUDGET</p>
                                    <p className="text-zinc-200 font-semibold text-xs">€3,664,148 p/w</p>
                                    <p className="text-red-400">Currently spending €3,688,120 p/w</p>
                                    <p className="text-zinc-500">Available Wage Budget: N/A</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}



function ContractOfferContent() {
    return (
        <div className="h-[calc(100vh-120px)] px-2.5 pb-2.5 flex items-center justify-center">
            <div className="text-center space-y-3">
                <p className="text-sm font-semibold text-zinc-200">You haven't been offered a contract at this time.</p>
                <p className="text-xs text-zinc-500">You could either negotiate your contract with your board or look for alternative employment.</p>
                <div className="flex items-center justify-center gap-3 mt-4">
                    <Button variant="outline" size="sm"
                            className="border-zinc-600 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 text-xs">
                        View Jobs ›
                    </Button>
                    <Button variant="outline" size="sm"
                            className="border-zinc-600 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 text-xs">
                        Request New Contract ›
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ─── HISTORY PAGES ────────────────────────────────────────────────────────────

function StatRow({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="flex items-center justify-between py-0.5 text-xs">
            <span className="text-zinc-400">{label}</span>
            <span className="text-zinc-300">{value}</span>
        </div>
    );
}

function HistoryOverviewContent() {
    return (
        <div className="h-[calc(100vh-120px)] px-2.5 pb-2.5">
            <ScrollArea className="h-full">
                <div className="pr-2 pb-4">
                    <div className="border border-zinc-700/60 rounded-lg bg-zinc-900/80 p-5">
                        <p className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-4">OVERVIEW</p>
                        <div className="grid grid-cols-2 gap-12">
                            <div>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">MANAGER STATS</p>
                                <div className="space-y-0.5">
                                    <StatRow label="Number of club manager jobs" value={1} />
                                    <StatRow label="Number of national manager jobs" value={0} />
                                    <StatRow label="Longest Time at Club (Mgr)" value="-" />
                                    <StatRow label="Shortest Time at Club (Mgr)" value="-" />
                                    <StatRow label="Awards" value={0} />
                                    <StatRow label="Total career earnings" value="€0" />
                                    <StatRow label="Total game time" value="-" />
                                    <StatRow label="Time spent on holiday" value="0 days (0.00%)" />
                                </div>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-4 mb-2">HALL OF FAME</p>
                                <div className="space-y-0.5">
                                    <StatRow label="Highest nationality ranking" value="-" />
                                    <StatRow label="Highest continental ranking" value="-" />
                                </div>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-4 mb-2">JUVENTUS STATS - (0 DAYS IN CHARGE)</p>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="space-y-0.5">
                                        <StatRow label="Games played" value="-" />
                                        <StatRow label="Club Games Won" value="-" />
                                        <StatRow label="Club Games Drawn" value="-" />
                                        <StatRow label="Club Games Lost" value="-" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <StatRow label="Goals For" value="-" />
                                        <StatRow label="Goals Against" value="-" />
                                        <StatRow label="Club Goal Difference" value="-" />
                                        <StatRow label="Win Percentage" value="-" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <StatRow label="Cups" value={0} />
                                        <StatRow label="League wins" value={0} />
                                        <StatRow label="League Promotions" value={0} />
                                        <StatRow label="League Relegations" value={0} />
                                    </div>
                                </div>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-4 mb-2">OVERALL CAREER STATS</p>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="space-y-0.5">
                                        <StatRow label="Games Played" value="-" />
                                        <StatRow label="Games Won" value="-" />
                                        <StatRow label="Games Drawn" value="-" />
                                        <StatRow label="Games Lost" value="-" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <StatRow label="Goals For" value="-" />
                                        <StatRow label="Goals Against" value="-" />
                                        <StatRow label="Goal Difference" value="-" />
                                        <StatRow label="Win Percentage" value="-" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <StatRow label="Cups" value={0} />
                                        <StatRow label="Leagues" value={0} />
                                        <StatRow label="Promotions" value={0} />
                                        <StatRow label="Relegations" value={0} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">PLAYER STATS</p>
                                <div className="space-y-0.5">
                                    <StatRow label="Players Bought" value={0} />
                                    <StatRow label="Transfer Value" value="€0" />
                                    <StatRow label="Players Sold" value={0} />
                                    <StatRow label="Transfer Value" value="€0" />
                                    <StatRow label="Highest fee spent" value="-" />
                                    <StatRow label="Highest fee received" value="-" />
                                    <StatRow label="Total fees paid to agents" value="€0" />
                                    <StatRow label="Number of players released" value={0} />
                                </div>
                                <div className="mt-4 space-y-0.5">
                                    <StatRow label="Highest nation ranking" value="-" />
                                    <StatRow label="Highest world ranking" value="-" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}

function JobHistoryContent() {
    return (
        <div className="h-[calc(100vh-120px)] px-2.5 pb-2.5">
            <ScrollArea className="h-full">
                <div className="pr-2 pb-4">
                    <div className="border border-zinc-700/60 rounded-lg bg-zinc-900/80 overflow-hidden">
                        <div className="px-4 py-3 border-b border-zinc-700/40">
                            <p className="text-xs font-bold text-teal-400 uppercase tracking-wider">JOB HISTORY</p>
                        </div>
                        <div className="grid grid-cols-[80px_1fr_200px_80px_150px_180px] gap-4 px-4 py-2 border-b border-zinc-700/40 bg-zinc-800/40">
                            {['YEAR', 'TEAM', 'LEAGUE', 'POSITION', 'AWARDS', 'COMPETITION WINS'].map(h => (
                                <span key={h} className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{h}</span>
                            ))}
                        </div>
                        <div className="grid grid-cols-[80px_1fr_200px_80px_150px_180px] gap-4 px-4 py-3 hover:bg-zinc-800/30 cursor-pointer">
                            <span className="text-xs text-zinc-300">2022/23</span>
                            <div className="flex items-center gap-2">
                                <JuveBadge size="xs" />
                                <span className="text-xs text-teal-400 cursor-pointer hover:underline">Juventus</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="size-4 rounded bg-blue-700 shrink-0 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" className="size-2.5 text-white" fill="currentColor">
                                        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </div>
                                <span className="text-xs text-zinc-300">Italian Serie A</span>
                            </div>
                            <span className="text-xs text-zinc-500">-</span>
                            <span className="text-xs text-zinc-500">-</span>
                            <span className="text-xs text-zinc-500">-</span>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}

function EmptyPage({ message = '' }: { message?: string }) {
    return (
        <div className="h-[calc(100vh-120px)] px-2.5 pb-2.5 flex items-center justify-center">
            {message && <p className="text-xs text-zinc-500">{message}</p>}
        </div>
    );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

export function Page() {
    const { pathname } = useLocation();


    if (pathname.endsWith('/contract-offer') || pathname.endsWith('/resign')) return <ContractOfferContent />;
    if (pathname.endsWith('/overview')) return <HistoryOverviewContent />;
    if (pathname.endsWith('/job-history')) return <JobHistoryContent />;
    if (pathname.endsWith('/promises')) return <EmptyPage message="You have no outstanding promises at this time." />;
    if (pathname.endsWith('/relationships')) return <EmptyPage />;

    return <HomePageContent />;
}