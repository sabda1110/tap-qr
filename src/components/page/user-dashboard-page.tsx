import { lazy, Suspense, useState } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { CreditCard, Store } from "lucide-react";
import { useI18n } from "../../i18n";
import type { UserProfile } from "../../lib/auth/user-profile";
import { useDashboardSession } from "../../hooks/use-dashboard-session";
import type { OutletDetail } from "../../server/outlets/outlet.types";
import {
  checkOwnerOutletSlug,
  updateUserOutlet,
  updateUserOutletCardLinks,
} from "../../server/outlets/user-outlet.functions";
import { uploadOutletLogo } from "../../server/uploads/image-upload.functions";
import { UserDashboardLayout } from "../layouts/user-dashboard-layout";
import { UserDashboardOverview } from "../organisms/user-dashboard-overview";
import { UserOutletsSection } from "../organisms/user-outlets-section";
import { Dialog, DialogBody } from "../ui/dialog";
import { Button } from "../ui/button";

const CardClaimDialog = lazy(() =>
  import("../organisms/card-claim-dialog").then((module) => ({
    default: module.CardClaimDialog,
  })),
);
const OutletEditForm = lazy(() =>
  import("../organisms/outlet-edit-form").then((module) => ({
    default: module.OutletEditForm,
  })),
);
const OutletCardEditForm = lazy(() =>
  import("../organisms/outlet-card-edit-form").then((module) => ({
    default: module.OutletCardEditForm,
  })),
);

type Editor = { outletId: string; cardId?: string };
type Claim = { outletId?: string; mode?: "new" | "existing" };

export function UserDashboardPage({
  profile,
  cardId,
  outlets,
}: {
  profile: UserProfile;
  cardId?: string;
  outlets: OutletDetail[];
}) {
  const { language, messages } = useI18n();
  const signOut = useDashboardSession(profile, language);
  const navigate = useNavigate();
  const router = useRouter();
  const [claim, setClaim] = useState<Claim | null>(cardId ? {} : null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [busy, setBusy] = useState(false);
  const outlet = outlets.find((outlet) => outlet.id === editor?.outletId);
  const card = outlet?.cards.find((card) => card.id === editor?.cardId);
  const content = messages.userDashboard;
  const formContent = messages.adminDashboard.outlets;
  const activeOutlets = outlets.filter((outlet) => outlet.status === "active");
  const closeClaim = async () => {
    setClaim(null);
    if (cardId)
      await navigate({
        to: "/$locale/dashboard/user",
        params: { locale: language },
        search: {},
        replace: true,
      });
  };
  const saved = async () => {
    await router.invalidate();
    setEditor(null);
  };
  const placeIdGuide = (
    <p className="text-xs leading-5 text-[#69737d]">
      {messages.cardClaim.placeIdGuide.quick}{" "}
      <a
        href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder"
        target="_blank"
        rel="noreferrer"
        className="font-semibold text-[#087e91] underline"
      >
        {messages.cardClaim.placeIdGuide.googleDocs}
      </a>
      .{" "}
      <a
        href={"/" + language + "/tutorial/google-place-id"}
        target="_blank"
        rel="noreferrer"
        className="font-semibold text-[#087e91] underline"
      >
        {messages.cardClaim.placeIdGuide.tutorial}
      </a>
      .
    </p>
  );
  return (
    <UserDashboardLayout
      activeItem="dashboard"
      homeLabel={messages.header.brandHomeLabel}
      language={language}
      navigation={content.sidebar}
      onSignOut={() => void signOut()}
    >
      <div className="mx-auto max-w-5xl pb-[env(safe-area-inset-bottom)]">
        <UserDashboardOverview
          content={content}
          name={profile.name.split(" ")[0]}
          outletCount={outlets.length}
          cardCount={outlets.reduce(
            (total, outlet) => total + outlet.cardCount,
            0,
          )}
          activeCardCount={activeOutlets.reduce(
            (total, outlet) => total + outlet.activeCardCount,
            0,
          )}
          onAddCard={() => setClaim({})}
          onAddOutlet={() => setClaim({ mode: "new" })}
        />
        <UserOutletsSection
          outlets={outlets}
          language={language}
          content={content}
          materials={formContent}
          onEditOutlet={(outletId) => setEditor({ outletId })}
          onEditCard={(outletId, cardId) => setEditor({ outletId, cardId })}
          onAddCard={(outletId) =>
            setClaim({ outletId, mode: outletId ? "existing" : undefined })
          }
        />
      </div>
      {claim && (
        <Suspense
          fallback={
            <Dialog
              title={messages.cardClaim.title}
              closeLabel={formContent.close}
              onClose={() => void closeClaim()}
            >
              <DialogBody>
                <p role="status" className="text-sm text-[#69737d]">
                  {content.loading}
                </p>
              </DialogBody>
            </Dialog>
          }
        >
          <CardClaimDialog
            cardId={cardId}
            messages={messages}
            outlets={activeOutlets}
            initialOutletId={claim.outletId}
            initialMode={claim.mode}
            onClose={() => void closeClaim()}
            onSaved={async () => {
              await closeClaim();
              await router.invalidate();
            }}
          />
        </Suspense>
      )}
      {outlet && (
        <Dialog
          title={
            (card ? content.editLinks : content.editOutlet) +
            " · " +
            outlet.name
          }
          icon={card ? CreditCard : Store}
          closeLabel={formContent.close}
          busy={busy}
          dismissOnOutsidePress={false}
          onClose={() => setEditor(null)}
        >
          <Suspense
            fallback={
              <DialogBody>
                <p role="status" className="text-sm text-[#69737d]">
                  {content.loading}
                </p>
              </DialogBody>
            }
          >
            {card ? (
              <OutletCardEditForm
                key={card.id}
                outletId={outlet.id}
                card={card}
                content={formContent}
                activation={messages.adminDashboard.activation}
                saveCardLinks={updateUserOutletCardLinks}
                googleReviewInput="placeId"
                placeIdGuide={placeIdGuide}
                onBusyChange={setBusy}
                onCancel={() => setEditor(null)}
                onSaved={saved}
              />
            ) : (
              <OutletEditForm
                key={outlet.id}
                outlet={outlet}
                content={formContent}
                activation={messages.adminDashboard.activation}
                saveOutlet={updateUserOutlet}
                checkOutletSlug={checkOwnerOutletSlug}
                uploadImage={uploadOutletLogo}
                onBusyChange={setBusy}
                onCancel={() => setEditor(null)}
                onSaved={saved}
              />
            )}
          </Suspense>
        </Dialog>
      )}
    </UserDashboardLayout>
  );
}

export function UserDashboardLoadError() {
  const { messages } = useI18n();
  const router = useRouter();
  const [retrying, setRetrying] = useState(false);
  return (
    <main className="mx-auto max-w-lg px-5 py-16 text-center">
      <p role="alert" className="text-sm leading-6">
        {messages.userDashboard.loadError}
      </p>
      <Button
        className="mt-5 h-11 px-5"
        disabled={retrying}
        onClick={async () => {
          setRetrying(true);
          try {
            await router.invalidate();
          } finally {
            setRetrying(false);
          }
        }}
      >
        {messages.userDashboard.retry}
      </Button>
    </main>
  );
}
