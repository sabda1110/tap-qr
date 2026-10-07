import type { Messages, Language } from "../../i18n";
import type { OutletDetail as Detail } from "../../server/outlets/outlet.types";
import { SocialBrandMark } from "../elements/social-brand-mark";
import { Button } from "../ui/button";

type Content = Messages["adminDashboard"]["outlets"];

export function OutletDetail({
  outlet,
  content,
  activation,
  language,
  onEdit,
  onEditCard,
}: {
  outlet: Detail;
  content: Content;
  activation: Messages["adminDashboard"]["activation"];
  language: Language;
  onEdit: () => void;
  onEditCard: (cardId: string) => void;
}) {
  const info = [
    [content.name, outlet.name],
    [content.slug, outlet.slug],
    [content.address, outlet.address],
    [content.city, outlet.city],
    [content.province, outlet.province],
    [content.phone, outlet.phone],
    [
      content.status,
      outlet.status === "active" ? content.active : content.disabled,
    ],
    [
      content.created,
      outlet.createdAt
        ? new Date(outlet.createdAt).toLocaleString(language)
        : "—",
    ],
    [
      content.updated,
      outlet.updatedAt
        ? new Date(outlet.updatedAt).toLocaleString(language)
        : "—",
    ],
  ];
  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-3 gap-3">
        {[
          [content.cards, outlet.cardCount],
          [content.activeCards, outlet.activeCardCount],
          [content.links, outlet.channels.length],
        ].map(([label, count]) => (
          <div
            key={label}
            className="rounded-2xl border border-black/8 bg-white p-4"
          >
            <p className="text-xs text-[#69737d]">{label}</p>
            <p className="mt-2 text-2xl font-bold text-[#087e91]">{count}</p>
          </div>
        ))}
      </div>
      <section className="rounded-2xl border border-black/8 bg-white p-5">
        <h2 className="mb-4 font-bold">{content.information}</h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          {info.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-[#69737d]">{label}</dt>
              <dd className="mt-1 text-sm font-semibold break-words">
                {value || "—"}
              </dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="rounded-2xl border border-black/8 bg-white p-5">
        <h2 className="mb-4 font-bold">{content.owner}</h2>
        <dl className="grid gap-4 sm:grid-cols-3">
          {[
            [activation.onboarding.fields.name, outlet.owner?.name],
            [content.email, outlet.owner?.email],
            [content.phone, outlet.owner?.phone],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-[#69737d]">{label}</dt>
              <dd className="mt-1 text-sm font-semibold break-words">
                {value || "—"}
              </dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="rounded-2xl border border-black/8 bg-white p-5">
        <h2 className="mb-4 font-bold">{content.cards}</h2>
        <div className="grid gap-3">
          {outlet.cards.map((card) => (
            <article
              key={card.id}
              className="rounded-xl border border-black/8 p-3"
            >
              <p className="text-sm font-bold break-all">{card.cardId}</p>
              <p className="mt-2 text-xs text-[#69737d]">
                {card.material === "acrylic" ? content.acrylic : content.pvc} ·{" "}
                {card.claimStatus === "claimed"
                  ? content.used
                  : content.unclaimed}{" "}
                · {card.isEnabled ? content.active : content.disabled}
              </p>
              <p className="mt-2 text-xs">
                {card.channels
                  .map((type) =>
                    type in activation.channels
                      ? activation.channels[
                          type as keyof typeof activation.channels
                        ].title
                      : type,
                  )
                  .join(" · ") || "—"}
              </p>
              <div className="mt-4 grid gap-2">
                {card.links.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center gap-3 rounded-xl bg-[#f8fafc] p-3"
                  >
                    <SocialBrandMark
                      type={link.type === "facebook" ? "custom" : link.type}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{link.label}</p>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block truncate text-xs text-[#087e91] underline"
                      >
                        {link.url}
                      </a>
                    </div>
                    <span className="text-xs">
                      {link.isActive ? content.active : content.disabled}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-4 h-10 px-4"
                disabled={card.claimStatus !== "claimed"}
                onClick={() => onEditCard(card.id)}
              >
                {content.editCardLinks}
              </Button>
            </article>
          ))}
          {!outlet.cards.length && (
            <p className="text-sm text-[#69737d]">{content.noCards}</p>
          )}
        </div>
      </section>
      <Button className="h-11 justify-self-start px-5" onClick={onEdit}>
        {content.edit}
      </Button>
    </div>
  );
}
