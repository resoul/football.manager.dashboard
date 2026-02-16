import { ScrollArea } from "@/components/scroll-area";
import { AsideContent } from "./aside-content";

export function Aside() {
  return (
    <div className="fixed z-10 top-0 bottom-0 end-0 flex flex-col py-5 items-stretch shrink-0 w-(--aside-width)">
      {/* Navigation */}
      <ScrollArea className="grow w-full h-[calc(100vh-5.5rem)] lg:h-[calc(100vh-5.5rem)]">
        <AsideContent/>
      </ScrollArea>
    </div>
  );
}
