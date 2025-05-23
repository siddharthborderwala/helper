import { useParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { AppSidebarOpen } from "@/app/(dashboard)/mailboxes/[mailbox_slug]/appSidebarOpen";
import { TauriDragArea } from "@/components/tauriDragArea";
import { useNativePlatform } from "@/components/useNativePlatform";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { CategoryNav } from "../../categoryNav";
import { List } from "./conversationList";

export const MobileList = () => {
  const params = useParams<{ mailbox_slug: string; category: string }>();
  const mailboxSlug = params.mailbox_slug;
  const [conversationSlug] = useQueryState("id");
  const { nativePlatform, isLegacyTauri } = useNativePlatform();

  const { data: openCount } = api.mailbox.openCount.useQuery(
    { mailboxSlug },
    {
      staleTime: 0,
    },
  );

  return (
    <div
      aria-label="Inbox"
      className={cn(
        `relative flex w-full min-w-[20rem] flex-col h-[100dvh] bg-background`,
        conversationSlug ? "hidden" : "",
      )}
    >
      {nativePlatform === "macos" && isLegacyTauri && <TauriDragArea className="top-0 inset-x-0 h-8" />}
      <CategoryNav
        openCount={openCount}
        mailboxSlug={mailboxSlug}
        variant="mobile"
        className={cn("flex items-center h-14 px-4", nativePlatform === "macos" && "mt-8")}
        prefix={
          <div className="shrink-0 mr-2">
            <AppSidebarOpen mailboxSlug={mailboxSlug} />
          </div>
        }
      />
      <List variant="mobile" />
    </div>
  );
};
