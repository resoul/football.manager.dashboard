import { useState } from 'react';
import { ScrollArea } from "@/components/scroll-area";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Settings, CheckSquare, Users, ArrowRight, Check, X, Mail } from "lucide-react";
import { Button } from "@/components/button";

// ─── Types ───────────────────────────────────────────────────────────────────

type MessageCategory = 'Messages' | 'Scouting' | 'Transfers' | 'Training';

interface InboxMessage {
    id: string;
    sender: string;
    senderRole?: string;
    subject: string;
    time: string;
    date: string;
    category: MessageCategory;
    read: boolean;
    hasReply?: boolean;
    body: MessageBody;
}

type MessageBody =
    | CoachingAdviceBody
    | RecruitmentFocusBody
    | SimpleTextBody
    | TransferRejectionBody;

interface CoachingAdviceBody {
    type: 'coaching-advice';
    intro: string;
    section: string;
    rows: Array<{ player: string; training: string; reason: string }>;
}

interface RecruitmentFocusBody {
    type: 'recruitment-focus';
    intro: string;
    focuses: Array<{
        label: string;
        sublabel: string;
        description: string;
        results: { recommendations: number; nearMatches: number; inProgress: number };
    }>;
}

interface SimpleTextBody {
    type: 'simple-text';
    intro: string;
}

interface TransferRejectionBody {
    type: 'transfer-rejection';
    intro: string;
    player: {
        name: string;
        age: number;
        role: string;
        wage: string;
        contractExpiry: string;
    };
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MESSAGES: InboxMessage[] = [
    {
        id: '1',
        sender: 'Oleh Ratiy',
        senderRole: 'Assistant Manager',
        subject: 'Coaching Advice Summary',
        time: '8:53',
        date: 'Tuesday 13th September 2022',
        category: 'Messages',
        read: false,
        body: {
            type: 'coaching-advice',
            intro: "As requested, I've compiled a brief summary of my coaching advice to send through to you.",
            section: 'INDIVIDUAL TRAINING TO START',
            rows: [
                { player: 'Vladyslav Naumets', training: 'Final Third', reason: 'Currently a slight weakness' },
                { player: 'Yevhen Riazantsev', training: 'Endurance', reason: 'Currently a slight weakness' },
            ],
        },
    },
    {
        id: '2',
        sender: 'Papa Guèye',
        senderRole: 'Director of Football',
        subject: 'Recruitment Focus Update',
        time: '16:57',
        date: 'Monday 12th September 2022',
        category: 'Scouting',
        read: true,
        body: {
            type: 'recruitment-focus',
            intro: 'Here is an update on how the recruitment team is getting on with their active recruitment focus assignments.',
            focuses: [
                {
                    label: 'AGE: 15-30',
                    sublabel: 'Standard',
                    description: 'We appear to be finding a few recommended players, but may want to widen the search parameters to generate more recommendations.',
                    results: { recommendations: 1, nearMatches: 6, inProgress: 6 },
                },
                {
                    label: 'UKRAINIAN PREMIER LEAGUE',
                    sublabel: 'Ongoing',
                    description: 'We appear to be finding a few recommended players, but may want to widen the search parameters to generate more recommendations.',
                    results: { recommendations: 1, nearMatches: 0, inProgress: 0 },
                },
                {
                    label: 'AGE: 15-22',
                    sublabel: 'Standard',
                    description: 'We appear to be struggling to find any recommended players, so you may want to widen the search parameters to generate more recommendations.',
                    results: { recommendations: 0, nearMatches: 8, inProgress: 2 },
                },
            ],
        },
    },
    {
        id: '3',
        sender: 'Papa Guèye',
        senderRole: 'Director of Football',
        subject: 'Inhulets scouting report',
        time: '16:46',
        date: 'Monday 12th September 2022',
        category: 'Scouting',
        read: true,
        body: {
            type: 'simple-text',
            intro: 'Here is the latest scouting report on Inhulets ahead of your upcoming fixture.',
        },
    },
    {
        id: '4',
        sender: 'Papa Guèye',
        senderRole: 'Director of Football',
        subject: 'Okun rejects Kolos',
        time: '15:35',
        date: 'Monday 12th September 2022',
        category: 'Transfers',
        read: true,
        body: {
            type: 'transfer-rejection',
            intro: 'Oleksandr Okun has decided against moving to Kolos, having revealed that he would be happier staying at Metalist at the present time.',
            player: {
                name: 'Oleksandr Okun',
                age: 32,
                role: 'Head Physio',
                wage: '£425 p/w',
                contractExpiry: 'Jun 2024',
            },
        },
    },
    {
        id: '5',
        sender: 'Oleh Ratiy',
        senderRole: 'Assistant Manager',
        subject: 'Weekly Staff Meeting',
        time: '8:48',
        date: 'Monday 12th September 2022',
        category: 'Messages',
        read: true,
        hasReply: true,
        body: {
            type: 'simple-text',
            intro: 'The weekly staff meeting is scheduled for this afternoon. Please confirm your attendance.',
        },
    },
    {
        id: '6',
        sender: 'Andriy Kolesnyk',
        senderRole: 'Data Analyst',
        subject: 'Post-Match Analysis: (UPL) Metalist 1-2 Vorskla',
        time: '8:47',
        date: 'Monday 12th September 2022',
        category: 'Messages',
        read: true,
        body: {
            type: 'simple-text',
            intro: 'Here is the post-match analysis following our defeat to Vorskla in the Ukrainian Premier League.',
        },
    },
];

// Group messages by date
function groupByDate(messages: InboxMessage[]) {
    const groups: Record<string, InboxMessage[]> = {};
    for (const msg of messages) {
        if (!groups[msg.date]) groups[msg.date] = [];
        groups[msg.date].push(msg);
    }
    return Object.entries(groups);
}

// ─── Category Badge ───────────────────────────────────────────────────────────

const categoryColors: Record<MessageCategory, string> = {
    Messages: 'text-teal-400',
    Scouting: 'text-green-400',
    Transfers: 'text-blue-400',
    Training: 'text-yellow-400',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SenderAvatar({ sender }: { sender: string }) {
    const initials = sender.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    return (
        <div className="size-10 rounded-full bg-zinc-700 border border-zinc-600 flex items-center justify-center text-xs font-semibold text-zinc-200 shrink-0">
            {initials}
        </div>
    );
}

// ─── Message Detail Views ─────────────────────────────────────────────────────

function CoachingAdviceView({ body, message }: { body: CoachingAdviceBody; message: InboxMessage }) {
    console.log(message);

    return (
        <div className="space-y-5">
            <p className="text-sm text-zinc-300 leading-relaxed">{body.intro}</p>
            <div className="border border-zinc-700 rounded-lg overflow-hidden">
                <div className="bg-zinc-800/80 px-4 py-3 border-b border-zinc-700 flex items-center justify-between">
                    <span className="text-xs font-bold tracking-wider text-teal-400">{body.section}</span>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-7 text-xs px-3 border-zinc-600 bg-zinc-700 text-zinc-200 hover:bg-zinc-600">
                            Apply All
                        </Button>
                        <Button size="sm" variant="outline" mode="icon" className="h-7 w-7 border-zinc-600 bg-zinc-700 text-zinc-200 hover:bg-zinc-600">
                            <Settings className="size-3" />
                        </Button>
                    </div>
                </div>
                <div className="divide-y divide-zinc-700/50">
                    <div className="grid grid-cols-[1fr_1fr_1fr_40px] gap-4 px-4 py-2 text-xs text-zinc-500 uppercase tracking-wider">
                        <span>Player</span>
                        <span>Recommended Training</span>
                        <span>Reason</span>
                        <span>Apply</span>
                    </div>
                    {body.rows.map((row, i) => (
                        <div key={i} className="grid grid-cols-[1fr_1fr_1fr_40px] gap-4 px-4 py-3 items-center hover:bg-zinc-800/50 transition-colors">
                            <div className="flex items-center gap-2 text-sm text-zinc-200">
                                <div className="size-5 rounded-full bg-zinc-700 flex items-center justify-center">
                                    <Users className="size-3 text-zinc-400" />
                                </div>
                                {row.player}
                            </div>
                            <span className="text-sm text-zinc-300">{row.training}</span>
                            <span className="text-sm text-zinc-400">{row.reason}</span>
                            <div className="flex justify-center">
                                <div className="size-6 rounded bg-teal-600 flex items-center justify-center cursor-pointer hover:bg-teal-500 transition-colors">
                                    <Check className="size-3.5 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-end">
                <Button size="sm" variant="outline" className="text-xs border-zinc-600 bg-zinc-700/50 text-zinc-300 hover:bg-zinc-600">
                    Backroom Advice Settings
                    <ArrowRight className="size-3" />
                </Button>
            </div>
        </div>
    );
}

function RecruitmentFocusView({ body }: { body: RecruitmentFocusBody }) {
    return (
        <div className="space-y-4">
            <p className="text-sm text-zinc-300 leading-relaxed">{body.intro}</p>
            <button className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors">
                RECRUITMENT FOCUSES <ArrowRight className="size-3" />
            </button>
            <div className="space-y-3">
                {body.focuses.map((focus, i) => (
                    <div key={i} className="border border-zinc-700 rounded-lg overflow-hidden hover:border-zinc-600 transition-colors">
                        <div className="flex items-stretch">
                            {/* Formation icon */}
                            <div className="w-20 bg-zinc-800 flex items-center justify-center border-r border-zinc-700 shrink-0 p-3">
                                <FormationGrid />
                            </div>
                            {/* Info */}
                            <div className="flex-1 p-4 space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <div className="size-4 rounded-full border border-zinc-500 flex items-center justify-center">
                                        <div className="size-2 rounded-full bg-zinc-400" />
                                    </div>
                                    <span className="text-xs font-bold text-zinc-200 tracking-wide">{focus.label}</span>
                                </div>
                                <p className="text-xs text-zinc-500 font-medium">{focus.sublabel}</p>
                                <p className="text-xs text-zinc-400 leading-relaxed">{focus.description}</p>
                            </div>
                            {/* Scouting results */}
                            <div className="w-48 p-4 border-l border-zinc-700 bg-zinc-800/40 shrink-0">
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Scouting Results</p>
                                <div className="space-y-1">
                                    {[
                                        { label: 'Recommendations', val: focus.results.recommendations },
                                        { label: 'Near Matches', val: focus.results.nearMatches },
                                        { label: 'In Progress', val: focus.results.inProgress },
                                    ].map((r, j) => (
                                        <button key={j} className="w-full flex items-center justify-between text-xs text-zinc-300 hover:text-zinc-100 transition-colors py-0.5 group">
                                            <span>{r.val} {r.label}</span>
                                            <ArrowRight className="size-3 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" className="text-xs border-zinc-600 bg-zinc-700/50 text-zinc-300 hover:bg-zinc-600">
                    Recruitment Focus <ArrowRight className="size-3" />
                </Button>
                <Button size="sm" variant="outline" className="text-xs border-zinc-600 bg-zinc-700/50 text-zinc-300 hover:bg-zinc-600">
                    <Settings className="size-3" />
                    Preferences
                    <ChevronDown className="size-3" />
                </Button>
            </div>
        </div>
    );
}

function FormationGrid() {
    // 4-dot formation representation
    const dots = [
        [0, 2],
        [1, 0], [1, 1], [1, 2], [1, 3],
        [2, 0], [2, 1], [2, 2], [2, 3],
        [3, 0], [3, 1], [3, 2], [3, 3],
        [4, 1], [4, 2],
    ];
    const activeDot = [4, 1];
    return (
        <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(4, 8px)', gridTemplateRows: 'repeat(5, 8px)' }}>
            {Array.from({ length: 5 }).map((_, row) =>
                Array.from({ length: 4 }).map((_, col) => {
                    const isDot = dots.some(([r, c]) => r === row && c === col);
                    const isActive = activeDot[0] === row && activeDot[1] === col;
                    return isDot ? (
                        <div key={`${row}-${col}`} className={cn(
                            "size-2 rounded-full",
                            isActive ? "bg-zinc-900 border border-zinc-500" : "bg-yellow-500/80"
                        )} />
                    ) : <div key={`${row}-${col}`} />;
                })
            )}
        </div>
    );
}

function TransferRejectionView({ body }: { body: TransferRejectionBody }) {
    const { player } = body;
    return (
        <div className="space-y-5">
            <p className="text-sm text-zinc-300 leading-relaxed">{body.intro}</p>
            <div className="border border-zinc-700 rounded-lg overflow-hidden">
                <div className="flex items-center gap-4 p-5 bg-zinc-800/40">
                    <div className="size-14 rounded-full bg-zinc-700 border border-zinc-600 flex items-center justify-center shrink-0">
                        <Users className="size-6 text-zinc-400" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center">
                            <svg viewBox="0 0 32 36" className="size-5 text-yellow-500" fill="currentColor">
                                <path d="M16 2L3 8v10c0 8.5 5.5 16.5 13 19 7.5-2.5 13-10.5 13-19V8L16 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-base font-semibold text-zinc-100">{player.name}</p>
                            <p className="text-xs text-zinc-400">{player.age} year-old {player.role}</p>
                        </div>
                    </div>
                    <div className="ml-auto flex items-center gap-2 bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-1.5 rounded-full text-xs font-semibold">
                        <X className="size-3.5" />
                        Rejected
                    </div>
                </div>
                <div className="border-t border-zinc-700 p-4">
                    <p className="text-xs text-zinc-500 text-center mb-3 font-medium">Contract Details</p>
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-base font-semibold text-zinc-200">{player.wage}</p>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider mt-0.5">Wage</p>
                        </div>
                        <div>
                            <p className="text-base font-semibold text-zinc-200">{player.contractExpiry}</p>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider mt-0.5">Expires</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SimpleTextView({ body }: { body: SimpleTextBody }) {
    return (
        <p className="text-sm text-zinc-300 leading-relaxed">{body.intro}</p>
    );
}

function MessageDetail({ message }: { message: InboxMessage }) {
    const { body } = message;
    return (
        <div className="flex flex-col h-full">
            {/* Message header */}
            <div className="flex items-start gap-3 p-5 border-b border-zinc-700/60">
                <SenderAvatar sender={message.sender} />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-zinc-200">{message.sender}</span>
                        {message.senderRole && (
                            <span className="text-xs text-zinc-500">({message.senderRole})</span>
                        )}
                    </div>
                    <p className="text-sm font-medium text-zinc-100 mt-0.5">{message.subject}</p>
                </div>
                <div className="text-right shrink-0">
                    <span className={cn("text-xs font-semibold", categoryColors[message.category])}>
                        {message.category}
                    </span>
                    <p className="text-xs text-zinc-500 mt-0.5">{message.time}</p>
                </div>
            </div>

            {/* Message body */}
            <ScrollArea className="flex-1">
                <div className="p-5">
                    {body.type === 'coaching-advice' && (
                        <CoachingAdviceView body={body} message={message} />
                    )}
                    {body.type === 'recruitment-focus' && (
                        <RecruitmentFocusView body={body} />
                    )}
                    {body.type === 'transfer-rejection' && (
                        <TransferRejectionView body={body} />
                    )}
                    {body.type === 'simple-text' && (
                        <SimpleTextView body={body} />
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}

// ─── Inbox List ───────────────────────────────────────────────────────────────

function MessageListItem({
                             message,
                             isSelected,
                             onClick,
                         }: {
    message: InboxMessage;
    isSelected: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150',
                'border border-transparent',
                isSelected
                    ? 'bg-zinc-700/60 border-zinc-600/60'
                    : 'hover:bg-zinc-800/60',
                !message.read && 'bg-zinc-800/30'
            )}
        >
            <div className="flex items-start justify-between gap-2 mb-0.5">
                <span className={cn(
                    'text-xs truncate',
                    !message.read ? 'font-semibold text-zinc-200' : 'font-normal text-zinc-400'
                )}>
                    {message.sender}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                    {message.hasReply && (
                        <div className="text-zinc-500">
                            <svg className="size-3" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M6 3L1 8l5 5V9.5c5 0 8.5 1.5 11 5-1-5-4-9-11-9.5V3z" />
                            </svg>
                        </div>
                    )}
                    <span className="text-xs text-zinc-500">{message.time}</span>
                </div>
            </div>
            <p className={cn(
                'text-xs leading-snug line-clamp-2',
                !message.read ? 'text-zinc-200 font-medium' : 'text-zinc-400'
            )}>
                {message.subject}
            </p>
        </button>
    );
}

function DateGroup({
                       date,
                       messages,
                       selectedId,
                       onSelect,
                       defaultOpen = true,
                   }: {
    date: string;
    messages: InboxMessage[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div>
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-2 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
            >
                <span>{date} ({messages.length} {messages.length === 1 ? 'item' : 'items'})</span>
                {open ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
            </button>
            {open && (
                <div className="space-y-0.5">
                    {messages.map(msg => (
                        <MessageListItem
                            key={msg.id}
                            message={msg}
                            isSelected={selectedId === msg.id}
                            onClick={() => onSelect(msg.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function InboxPage() {
    const [selectedId, setSelectedId] = useState<string | null>(MESSAGES[0]?.id ?? null);
    const selectedMessage = MESSAGES.find(m => m.id === selectedId) ?? null;
    const grouped = groupByDate(MESSAGES);

    return (
        <div className="flex gap-2.5 h-[calc(100vh-120px)] px-2.5 pb-2.5">
            {/* ── List panel ── */}
            <div className="w-[280px] shrink-0 bg-zinc-900 border border-zinc-700/60 rounded-xl shadow-sm flex flex-col overflow-hidden">
                {/* Filter bar */}
                <div className="flex items-center gap-2 px-3 py-2.5 border-b border-zinc-700/60">
                    <div className="flex items-center gap-1.5 flex-1 bg-zinc-800 rounded-md px-2.5 py-1.5">
                        <Mail className="size-3.5 text-zinc-500 shrink-0" />
                        <span className="text-xs text-zinc-400">All Items</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="size-6 flex items-center justify-center text-zinc-500 hover:text-zinc-200 transition-colors rounded">
                            <CheckSquare className="size-3.5" />
                        </button>
                        <button className="size-6 flex items-center justify-center text-zinc-500 hover:text-zinc-200 transition-colors rounded">
                            <ChevronDown className="size-3.5" />
                        </button>
                    </div>
                </div>

                {/* Message list */}
                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-1">
                        {grouped.map(([date, msgs], i) => (
                            <DateGroup
                                key={date}
                                date={date}
                                messages={msgs}
                                selectedId={selectedId}
                                onSelect={setSelectedId}
                                defaultOpen={i === 0}
                            />
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* ── Detail panel ── */}
            <div className="flex-1 bg-zinc-900 border border-zinc-700/60 rounded-xl shadow-sm overflow-hidden min-w-0">
                {selectedMessage ? (
                    <MessageDetail message={selectedMessage} />
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center space-y-2">
                            <Mail className="size-10 text-zinc-700 mx-auto" />
                            <p className="text-sm text-zinc-500">Select a message to read</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}