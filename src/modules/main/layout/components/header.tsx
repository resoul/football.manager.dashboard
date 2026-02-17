import { Button } from "@/components/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useLayout } from "./use-layout";
import { NavbarMenu } from './navbar-menu';

export function Header() {
    const { toggleSidebar, sidebarCollapsed } = useLayout();

    return (
        <div className="">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" mode="icon" onClick={toggleSidebar} className="hidden lg:inline-flex">
                        {sidebarCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
                    </Button>
                </div>
            </div>
            <NavbarMenu />
        </div>
    );
}