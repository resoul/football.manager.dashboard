import { Button } from "@/components/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useLayout } from "./use-layout";

export function Header() {
    const { toggleSidebar, sidebarCollapsed } = useLayout();

    return (
        <div className="flex items-center justify-between px-2 py-3 gap-1">
            <Button variant="ghost" mode="icon" onClick={toggleSidebar} className="hidden lg:inline-flex">
                {sidebarCollapsed ? <PanelLeftOpen/> : <PanelLeftClose/>}
            </Button>
        </div>
    );
}