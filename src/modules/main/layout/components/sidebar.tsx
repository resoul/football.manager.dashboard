import { UserPanel } from './user-panel';
import { SidebarFooter } from './sidebar-footer';

export function Sidebar() {
  return (
    <div className="fixed z-10 top-0 bottom-0 start-0 flex flex-col items-stretch shrink-0 w-(--sidebar-width) lg:in-data-[sidebar-collapsed=true]:w-(--sidebar-width-collapse) transition-[width] duration-300 overflow-hidden">
      <div className="flex flex-col items-stretch shrink-0 w-(--sidebar-width)">
          <div className="space-y-3 py-4 in-data-[sidebar-collapsed=true]:w-15">
              <div className="flex flex-col gap-2.5 in-data-[sidebar-collapsed=true]:items-center">
                  <UserPanel />
              </div>
          </div>
          <div className="in-data-[sidebar-collapsed=true]:w-15">
              <div className="in-data-[sidebar-collapsed=true]:flex in-data-[sidebar-collapsed=true]:justify-center in-data-[sidebar-collapsed=true]:w-full">
                  <SidebarFooter />
              </div>
          </div>
      </div>
    </div>
  );
}
