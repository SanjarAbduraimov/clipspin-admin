import { SearchForm } from "@/components/Sidebar/SearchForm";

import { ChatIcon } from "../../assets/icons/Chat";
import { NotificationIcon } from "../../assets/icons/Notification";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 flex min-h-20 w-full items-center border-b bg-background">
      <div className="flex h-[--header-height] w-full items-center gap-4 pl-5 pr-8">
        <img src="/clipspin-logo.png" alt="logo" className="h-12" />
        <SearchForm className="w-full sm:ml-auto sm:w-auto" />
        <ChatIcon className="text-fg-quaternary" />
        <NotificationIcon className="text-fg-quaternary" />
      </div>
    </header>
  );
}
