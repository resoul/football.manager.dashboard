import { ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {type MenuConfig, type MenuItem} from './types';
import { cn } from '@/lib/utils';
import { useMenu } from './use-menu';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from '@/components/menubar';
import { useLayout } from "./use-layout";

const getEmptyItems = (): MenuItem => {
    return {
        children: []
    }
}

export function NavbarMenu() {
    const { pathname } = useLocation();
    const { isActive, hasActiveChild } = useMenu(pathname);
    const { headerData } = useLayout();
    const menu = headerData?.menu ?? getEmptyItems();

    const buildMenu = (items: MenuConfig) => {
        return items.map((item, index) => {
            if (item.children) {
                return (
                    <MenubarMenu key={index}>
                        <MenubarTrigger
                            className={cn(
                                'flex items-center gap-1.5 px-3 py-3.5 text-sm text-secondary-foreground text-nowrap',
                                'rounded-none border-b-2 border-transparent bg-transparent!',
                                'hover:text-mono hover:bg-transparent',
                                'focus:text-mono focus:bg-transparent',
                                'data-[state=open]:bg-transparent data-[state=open]:text-mono',
                                'data-[here=true]:text-mono data-[here=true]:border-mono',
                            )}
                            data-active={isActive(item.path) || undefined}
                            data-here={hasActiveChild(item.children) || undefined}
                        >
                            {item.title}
                            <ChevronDown className="ms-auto size-3.5" />
                        </MenubarTrigger>
                        <MenubarContent className="min-w-[175px]" sideOffset={0}>
                            {buildSubMenu(item.children)}
                        </MenubarContent>
                    </MenubarMenu>
                );
            } else {
                return (
                    <MenubarMenu key={index}>
                        <MenubarTrigger
                            asChild
                            className={cn(
                                'flex items-center px-2 py-3.5 text-sm text-secondary-foreground text-nowrap',
                                'rounded-none border-b-2 border-transparent bg-transparent!',
                                'hover:text-mono hover:bg-transparent',
                                'focus:text-mono focus:bg-transparent',
                                'data-[active=true]:text-mono data-[active=true]:border-mono',
                            )}
                        >
                            <Link
                                to={item.path || ''}
                                data-active={isActive(item.path) || undefined}
                                data-here={hasActiveChild(item.children) || undefined}
                            >
                                {item.title}
                            </Link>
                        </MenubarTrigger>
                    </MenubarMenu>
                );
            }
        });
    };

    const buildSubMenu = (items: MenuConfig) => {
        return items.map((item, index) => {
            if (item.children) {
                return (
                    <MenubarSub key={index}>
                        <MenubarSubTrigger
                            data-active={isActive(item.path) || undefined}
                            data-here={hasActiveChild(item.children) || undefined}
                        >
                            <span>{item.title}</span>
                        </MenubarSubTrigger>
                        <MenubarSubContent className="min-w-[175px]">
                            {buildSubMenu(item.children)}
                        </MenubarSubContent>
                    </MenubarSub>
                );
            } else {
                return (
                    <MenubarItem
                        key={index}
                        asChild
                        data-active={isActive(item.path) || undefined}
                        data-here={hasActiveChild(item.children) || undefined}
                    >
                        <Link to={item.path || ''}>{item.title}</Link>
                    </MenubarItem>
                );
            }
        });
    };

    return (
        <div className="grid">
            <div className="kt-scrollable-x-auto">
                <Menubar className="flex items-stretch border-none bg-transparent p-0 h-auto">
                    {buildMenu(menu.children as MenuConfig)}
                </Menubar>
            </div>
        </div>
    );
}
