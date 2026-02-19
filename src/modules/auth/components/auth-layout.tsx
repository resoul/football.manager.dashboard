import type { ReactNode } from 'react';

export function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#0a1a0f]">
            {/* Layered gradient background — stadium atmosphere */}
            <div
                className="absolute inset-0"
                style={{
                    background: `
                        radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.12) 0%, transparent 60%),
                        radial-gradient(ellipse at 20% 50%, rgba(16, 85, 40, 0.3) 0%, transparent 50%),
                        radial-gradient(ellipse at 80% 20%, rgba(22, 101, 52, 0.2) 0%, transparent 50%),
                        radial-gradient(ellipse at 50% 80%, rgba(5, 46, 22, 0.4) 0%, transparent 50%),
                        linear-gradient(180deg, #0d1f12 0%, #0a1a0f 30%, #071a0d 70%, #050e08 100%)
                    `,
                }}
            />

            {/* Stadium floodlight effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute -top-20 left-1/4 h-[500px] w-[300px] -translate-x-1/2 rotate-12 opacity-[0.04]"
                    style={{
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, transparent 100%)',
                        filter: 'blur(40px)',
                    }}
                />
                <div
                    className="absolute -top-20 right-1/4 h-[500px] w-[300px] translate-x-1/2 -rotate-12 opacity-[0.04]"
                    style={{
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, transparent 100%)',
                        filter: 'blur(40px)',
                    }}
                />
            </div>

            {/* Pitch lines pattern */}
            <div className="absolute inset-0 opacity-[0.03]">
                {/* Centre line */}
                <div className="absolute left-1/2 top-0 h-full w-px bg-white" />
                {/* Centre circle */}
                <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white" />
                {/* Centre dot */}
                <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
                {/* Side lines */}
                <div className="absolute left-[10%] top-[10%] bottom-[10%] right-[10%] border border-white" />
                {/* Penalty boxes */}
                <div className="absolute left-[10%] top-[30%] h-[40%] w-[15%] border-r border-y border-white" />
                <div className="absolute right-[10%] top-[30%] h-[40%] w-[15%] border-l border-y border-white" />
            </div>

            {/* Floating particles — stadium atmosphere */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: `${3 + i * 1.5}px`,
                            height: `${3 + i * 1.5}px`,
                            left: `${10 + i * 11}%`,
                            top: `${8 + i * 10}%`,
                            background: i % 2 === 0
                                ? 'rgba(16, 185, 129, 0.15)'
                                : 'rgba(255, 255, 255, 0.06)',
                            animation: `float-particle ${3 + i * 0.7}s ease-in-out infinite alternate`,
                            animationDelay: `${i * 0.4}s`,
                        }}
                    />
                ))}
            </div>

            {/* Main card */}
            <div className="relative z-10 w-full max-w-md px-4">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-8 shadow-2xl shadow-black/50 backdrop-blur-xl">
                    {/* Logo */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center">
                            <img
                                src="/logo.png"
                                alt="Football Manager"
                                className="h-20 w-20 object-contain drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                            />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-white">
                            Football Manager
                        </h1>
                        <p className="mt-1 text-sm text-white/40">
                            Your tactical journey starts here
                        </p>
                    </div>

                    {children}
                </div>
            </div>

            {/* CSS animations */}
            <style>{`
                @keyframes float-particle {
                    0% { transform: translateY(0) scale(1); opacity: 0.3; }
                    100% { transform: translateY(-20px) scale(1.5); opacity: 0.08; }
                }
            `}</style>
        </div>
    );
}
