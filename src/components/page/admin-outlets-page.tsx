import { useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "../../i18n";
import { useDashboardSession } from "../../hooks/use-dashboard-session";
import type { UserProfile } from "../../lib/auth/user-profile";
import type {
  OutletDetail as Detail,
  OutletList,
} from "../../server/outlets/outlet.types";
import { AdminDashboardLayout } from "../layouts/admin-dashboard-layout";
import { OutletListSection } from "../organisms/outlet-list-section";
import { OutletDetail } from "../molecules/outlet-detail";
import { OutletCardEditForm } from "../organisms/outlet-card-edit-form";
import { OutletEditForm } from "../organisms/outlet-edit-form";
import { OutletCreateForm } from "../organisms/outlet-create-form";
import { Dialog, DialogBody } from "../ui/dialog";
import { CreditCard, Pencil, Store } from "lucide-react";
import { ToasterProvider } from "../ui/toaster";

export function AdminOutletsPage({
  page,
  detail,
  profile,
  search,
}: {
  page: OutletList;
  detail: Detail | null;
  profile: UserProfile;
  search: { query: string; cursor?: string; outletId?: string; edit?: boolean };
}) {
  const { language, messages } = useI18n();
  const signOut = useDashboardSession(profile, language);
  const navigate = useNavigate({ from: "/$locale/dashboard/admin/outlets" });
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const selectedCard = detail?.cards.find((card) => card.id === selectedCardId);
  const content = messages.adminDashboard.outlets;
  const close = () => {
    setSelectedCardId(null);
    void navigate({ search: { query: search.query, cursor: search.cursor } });
  };
  const edit = () => {
    void navigate({ search: { ...search, edit: true } });
  };
  return (
    <ToasterProvider>
      <AdminDashboardLayout
        homeLabel={messages.header.brandHomeLabel}
        language={language}
        navigation={messages.adminDashboard.sidebar}
        onSignOut={() => void signOut()}
      >
        <OutletListSection
          page={page}
          content={content}
          activation={messages.adminDashboard.activation}
          language={language}
          query={search.query}
          cursor={search.cursor}
          createLabel={messages.adminDashboard.outletCreate.action}
          onCreate={() => {
            setSelectedCardId(null);
            setCreating(true);
          }}
          onSearch={(query) => {
            void navigate({ search: { query } });
          }}
        />
        {creating && (
          <Dialog
            title={messages.adminDashboard.outletCreate.title}
            description={messages.adminDashboard.outletCreate.description}
            icon={Store}
            dismissOnOutsidePress={false}
            closeLabel={content.close}
            busy={busy}
            onClose={() => setCreating(false)}
          >
            <OutletCreateForm
              content={content}
              createContent={messages.adminDashboard.outletCreate}
              activation={messages.adminDashboard.activation}
              onBusyChange={setBusy}
              onCancel={() => setCreating(false)}
              onSaved={async (outletId) => {
                await router.invalidate();
                await navigate({
                  search: { query: "", outletId, edit: false },
                });
                setCreating(false);
              }}
            />
          </Dialog>
        )}
        {detail && !creating && (
          <Dialog
            title={`${selectedCard ? content.editCardLinks : search.edit ? content.edit : content.detail} · ${detail.name}`}
            icon={selectedCard ? CreditCard : search.edit ? Pencil : Store}
            closeLabel={content.close}
            onClose={close}
            busy={busy}
          >
            {selectedCard ? (
              <OutletCardEditForm
                key={selectedCard.id}
                outletId={detail.id}
                card={selectedCard}
                content={content}
                activation={messages.adminDashboard.activation}
                onBusyChange={setBusy}
                onCancel={() => setSelectedCardId(null)}
                onSaved={async () => {
                  await router.invalidate();
                  setSelectedCardId(null);
                }}
              />
            ) : search.edit ? (
              <OutletEditForm
                key={detail.id}
                outlet={detail}
                content={content}
                activation={messages.adminDashboard.activation}
                onBusyChange={setBusy}
                onCancel={close}
                onSaved={async () => {
                  await router.invalidate();
                  await navigate({ search: { ...search, edit: false } });
                }}
              />
            ) : (
              <DialogBody>
                <OutletDetail
                  outlet={detail}
                  content={content}
                  activation={messages.adminDashboard.activation}
                  language={language}
                  onEdit={edit}
                  onEditCard={setSelectedCardId}
                />
              </DialogBody>
            )}
          </Dialog>
        )}
      </AdminDashboardLayout>
    </ToasterProvider>
  );
}
