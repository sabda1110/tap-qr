import { Link } from "@tanstack/react-router";
import { Eye, Pencil, Store } from "lucide-react";
import type { Messages, Language } from "../../i18n";
import type { OutletList } from "../../server/outlets/outlet.types";
import { CustomInputText } from "../elements/custom-input-text";
import { Button } from "../ui/button";

export function OutletListSection({
  page,
  content,
  activation,
  language,
  query,
  cursor,
  onSearch,
}: {
  page: OutletList;
  content: Messages["adminDashboard"]["outlets"];
  activation: Messages["adminDashboard"]["activation"];
  language: Language;
  query: string;
  cursor?: string;
  onSearch: (query: string) => void;
}) {
  return (
    <section className="mx-auto max-w-6xl">
      <p className="text-xs font-bold tracking-widest text-[#0798ad] uppercase">
        TapQR
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        {content.title}
      </h1>
      <p className="mt-3 text-[#646b75]">{content.description}</p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSearch(
            String(new FormData(event.currentTarget).get("query") ?? ""),
          );
        }}
        className="mt-7 flex items-end gap-3 rounded-2xl border border-black/8 bg-white p-5"
      >
        <div className="min-w-0 flex-1">
          <CustomInputText
            key={query}
            name="query"
            label={content.search}
            defaultValue={query}
            maxLength={150}
          />
        </div>
        <Button className="h-12 px-5" type="submit">
          {content.searchAction}
        </Button>
      </form>
      <p className="mt-2 text-xs text-[#69737d]">{content.searchHelp}</p>
      <div className="mt-6 grid gap-4">
        {page.outlets.map((outlet) => (
          <article
            key={outlet.id}
            className="rounded-2xl border border-black/8 bg-white p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex min-w-0 gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#e8f8fb] text-[#087e91]">
                  <Store className="size-5" />
                </span>
                <div>
                  <h2 className="font-bold break-words">{outlet.name}</h2>
                  <p className="mt-1 text-sm text-[#69737d]">
                    {outlet.city} · {outlet.slug}
                  </p>
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${outlet.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}
              >
                {outlet.status === "active" ? content.active : content.disabled}
              </span>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <span>
                <strong>{outlet.cardCount}</strong>{" "}
                {content.cards.toLowerCase()}
              </span>
              <span>
                <strong>{outlet.activeCardCount}</strong>{" "}
                {content.activeCards.toLowerCase()}
              </span>
              <span className="text-[#087e91]">
                {outlet.channels
                  .map((channel) =>
                    channel in activation.channels
                      ? activation.channels[
                          channel as keyof typeof activation.channels
                        ].title
                      : channel,
                  )
                  .join(" · ") || content.noLinks}
              </span>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                className="h-10 px-4"
                nativeButton={false}
                variant="outline"
                render={
                  <Link
                    to="/$locale/dashboard/admin/outlets"
                    params={{ locale: language }}
                    search={{ query, cursor, outletId: outlet.id, edit: false }}
                  />
                }
              >
                <Eye />
                {content.detail}
              </Button>
              <Button
                className="h-10 px-4"
                nativeButton={false}
                render={
                  <Link
                    to="/$locale/dashboard/admin/outlets"
                    params={{ locale: language }}
                    search={{ query, cursor, outletId: outlet.id, edit: true }}
                  />
                }
              >
                <Pencil />
                {content.edit}
              </Button>
            </div>
          </article>
        ))}
        {!page.outlets.length && (
          <div className="rounded-2xl border border-dashed border-black/15 bg-white p-12 text-center text-[#69737d]">
            {content.empty}
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-end gap-3">
        {cursor && (
          <Button
            nativeButton={false}
            variant="outline"
            render={
              <Link
                to="/$locale/dashboard/admin/outlets"
                params={{ locale: language }}
                search={{ query }}
              />
            }
          >
            {content.previous}
          </Button>
        )}
        {page.nextCursor && (
          <Button
            nativeButton={false}
            render={
              <Link
                to="/$locale/dashboard/admin/outlets"
                params={{ locale: language }}
                search={{ query, cursor: page.nextCursor }}
              />
            }
          >
            {content.next}
          </Button>
        )}
      </div>
    </section>
  );
}
