import { ScrollArea } from "@/components/scroll-area.tsx";
import { JuveBadge } from "@/modules/home/layout/juve-badge";

export function ContractDetailsContent() {
    return (
        <div className="h-[calc(100vh-120px)] px-2.5 pb-2.5">
            <ScrollArea className="h-full">
                <div className="pr-2 pb-4 max-w-3xl">
                    <div className="border border-zinc-700/60 rounded-lg bg-zinc-900/80 overflow-hidden">
                        <div className="px-6 pt-5 pb-2">
                            <p className="text-xs font-bold text-teal-400 uppercase tracking-wider">CONTRACT</p>
                        </div>
                        <div className="px-6 py-4">
                            <div className="flex items-center gap-3 mb-4">
                                <JuveBadge size="md" />
                                <span className="text-sm font-bold text-teal-400 cursor-pointer hover:underline">Juventus</span>
                            </div>
                            <div className="grid grid-cols-3 gap-8 border-t border-zinc-700/40 pt-4">
                                <div>
                                    <p className="text-xs font-semibold text-zinc-200 mb-1">Manager</p>
                                    <p className="text-xs text-zinc-500 mb-3">Full Time Contract</p>
                                    <p className="text-sm font-bold text-zinc-100 mb-0.5">€50,000 p/w</p>
                                    <p className="text-xs text-zinc-500 mb-3">(€30,500 per week after tax)</p>
                                    <p className="text-xs text-zinc-400">
                                        Started <span className="text-zinc-200 font-semibold">11/7/2022</span> Expires <span className="text-zinc-200 font-semibold">30/6/2024</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">BONUSES</p>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-zinc-300">Winning the UEFA Champions League</span>
                                        <span className="text-zinc-200 font-semibold ml-4">€140,000</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">CLAUSES</p>
                                    <span className="text-xs text-zinc-500">None</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}