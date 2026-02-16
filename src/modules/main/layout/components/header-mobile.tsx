import { Button } from '@/components/button';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetBody } from '@/components/sheet';
import { Menu, PanelTopBottomDashed } from 'lucide-react';
import { useState } from 'react';
import { SidebarContent } from './sidebar-content';
import { UserPanel } from './user-panel';
import { AsideContent } from './aside-content';

export function HeaderMobile() {
  const [isSidebarSheetOpen, setIsSidebarSheetOpen] = useState(false);
  const [isAsideSheetOpen, setIsAsideSheetOpen] = useState(false);

  return (
    <header className="flex items-stretch fixed z-10 top-0 start-0 end-0 h-(--header-height-mobile) bg-zinc-100 dark:bg-zinc-900">
      <div className="flex items-stretch w-full bg-background border border-border rounded-xl shadow-xs shadow-black/5 mx-2 mt-2">
        <div className="grow flex items-center justify-between gap-2.5 px-2.5">
          <div className="flex items-center">
            <UserPanel/>
          </div>

          <div className="flex items-center gap-1">
            {/* Sidebar */}
            <Sheet open={isSidebarSheetOpen} onOpenChange={setIsSidebarSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" mode="icon" size="sm">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent
                className="bg-zinc-100 dark:bg-zinc-900 p-0 gap-0 w-(--sidebar-width-mobile)"
                side="left"
                close={false}
              >
                <SheetHeader className="p-0 space-y-0" />
                <SheetBody className="flex flex-col grow p-0 pt-2.5">
                  <SidebarContent />
                </SheetBody>
              </SheetContent>
            </Sheet>

            {/* Aside */}
            <Sheet open={isAsideSheetOpen} onOpenChange={setIsAsideSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" mode="icon" size="sm">
                  <PanelTopBottomDashed />
                </Button>
              </SheetTrigger>
              <SheetContent
                className="p-0 gap-0 w-(--aside-width-mobile)"
                side="right"
                close={false}
              >
                <SheetHeader className="p-0 space-y-0" />
                <SheetBody className="flex flex-col grow p-0 py-2.5">
                  <AsideContent />
                </SheetBody>
              </SheetContent>
            </Sheet>
          </div>   
        </div>
      </div>
    </header>
  );
}
