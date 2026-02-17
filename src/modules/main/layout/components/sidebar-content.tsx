import { SidebarMenu } from './sidebar-menu';

export function SidebarContent() {
  return (
    <div className="in-data-[sidebar-collapsed=true]:w-15">
      <div className="in-data-[sidebar-collapsed=true]:flex in-data-[sidebar-collapsed=true]:justify-center in-data-[sidebar-collapsed=true]:w-full">
        <SidebarMenu />
      </div>
    </div>
  );
}
