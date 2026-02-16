import { ScrollArea } from "@/components/scroll-area";
import { Button } from "@/components/button";
import { Sparkles } from "lucide-react";
import { AskAI } from "./ask-ai";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLayout } from "./use-layout";

export function ContentView() {
    const [isAskAIOpen, setIsAskAIOpen] = useState(false);
    const { isMailViewExpanded, isMobile } = useLayout();
    return (
        <>
            <div className={cn(
                'bg-background border border-input rounded-xl shadow-xs grow',
                'lg:w-[calc(100%-300px)] xl:w-(--mail-view-width)',
                // Desktop: always visible
                'lg:block',
                // Mobile: positioned absolutely over the list when expanded
                isMobile && !isMailViewExpanded && 'hidden',
                isMobile && isMailViewExpanded && 'fixed inset-0 z-50 m-0 rounded-none'
            )}>
                <div className="p-4 grid content-center h-full">
                    <ScrollArea className="h-[calc(100vh-10rem)] grid content-center">
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => { setIsAskAIOpen(true); }}>
                                    <Sparkles />
                                    Ask Ai
                                </Button>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </div>
            <AskAI
                open={isAskAIOpen}
                onOpenChange={setIsAskAIOpen}
            />
        </>
    );
}