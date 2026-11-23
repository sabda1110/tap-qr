import { ArrowUpRight, Clock3, MapPin, Store } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState, type CSSProperties } from "react";
import type { Language, Messages } from "../../i18n";
import type {
  OutletProfileAction,
  OutletProfileConfig,
} from "../page/outlet-profile-config";
import { OutletActionIcon } from "../elements/outlet-action-icon";
import { OutletHighlights } from "../molecules/outlet-highlights";
import "./outlet-profile.css";

export function OutletProfileSection({
  config,
  content,
  queueContent,
  language,
  onAction,
  galleryContent,
  onHighlightOpen,
}: {
  config: OutletProfileConfig;
  content: Messages["outletProfile"];
  queueContent: Messages["queue"]["public"];
  language: Language;
  onAction: (action: OutletProfileAction) => void;
  galleryContent: Messages["outletGallery"];
  onHighlightOpen: (highlightId: string) => void;
}) {
  const [activeActionIds, setActiveActionIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );

  function activateAction(action: OutletProfileAction) {
    setActiveActionIds((current) => new Set(current).add(action.id));
    onAction(action);
  }

  return (
    <section className="outlet-profile" style={config.theme}>
      <div className="outlet-profile__pattern" aria-hidden="true" />
      <div className="outlet-marquee" aria-label={config.marquee}>
        <div className="outlet-marquee__track">
          <span>{config.marquee}</span>
          <span aria-hidden="true">{config.marquee}</span>
        </div>
      </div>

      <div className="outlet-profile__content">
        <header className="outlet-header">
          <div className="outlet-avatar">
            {config.avatarUrl ? (
              <img
                src={config.avatarUrl}
                alt={`${content.outletLogo}: ${config.name}`}
                width={92}
                height={92}
              />
            ) : (
              <Store aria-hidden="true" strokeWidth={2.75} />
            )}
          </div>
          <div className="outlet-header__copy">
            <h1>{config.name}</h1>
            <p>{config.tagline}</p>
            {config.address && (
              <address className="outlet-header__address">
                <MapPin aria-hidden="true" />
                <span>
                  <span className="sr-only">{content.addressLabel}: </span>
                  {config.address}
                </span>
              </address>
            )}
            {config.status && (
              <span className={`outlet-status outlet-status--${config.status.tone}`}>
                <span aria-hidden="true" />
                {config.status.label}
              </span>
            )}
          </div>
        </header>

        <OutletHighlights
          highlights={config.highlights}
          content={galleryContent}
          onHighlightOpen={onHighlightOpen}
        />

        {config.reviewAction && (
          <div className="outlet-review">
            <a
              className="outlet-review-button outlet-pressable"
              href={config.reviewAction.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onAction(config.reviewAction!)}
            >
              <span className="outlet-review__cue">
                <span>{content.reviewTapHint}</span>
                <svg aria-hidden="true" viewBox="0 0 48 44" fill="none">
                  <path d="M2 5C30 0 43 12 34 26C31 31 26 35 20 40M20 40L21 29M20 40L31 38" />
                </svg>
              </span>
              <span className="outlet-review-button__label">★ {config.reviewAction.label}</span>
              <span className="outlet-stars" aria-label={content.ratingLabel}>
                {[0, 1, 2, 3, 4].map((star) => (
                  <span
                    key={star}
                    aria-hidden="true"
                  >
                    ★
                  </span>
                ))}
              </span>
              <span className="outlet-review-sticker">{content.reviewTime}</span>
            </a>
            <p className="outlet-review__note">{config.greeting}</p>
          </div>
        )}

        {config.queueEnabled && <Link to="/$locale/q/$id" params={{ locale: language, id: config.profileId }} className="mt-5 flex min-h-14 items-center justify-center gap-2 border-[3px] border-[var(--ink)] bg-[var(--accent)] px-5 text-center text-base font-black text-[var(--ink)] no-underline shadow-[4px_4px_0_var(--ink)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]">
          {queueContent.submit}<ArrowUpRight aria-hidden="true" className="size-5" />
        </Link>}

        <nav aria-label={content.linksLabel} className="outlet-actions">
          {config.secondaryActions.map((action) => {
            const isActive = activeActionIds.has(action.id);
            return (
              <a
                key={action.id}
                className="outlet-action outlet-pressable"
                href={action.url}
                target="_blank"
                rel="noopener noreferrer"
                data-active={isActive || undefined}
                style={{
                  "--action-bg": isActive ? action.activeColor : action.color,
                  "--action-fg": isActive
                    ? action.activeForeground
                    : action.foreground,
                } as CSSProperties}
                onClick={() => activateAction(action)}
              >
                <span className="outlet-action__icon">
                  <OutletActionIcon kind={action.kind} />
                </span>
                <span>{action.label}</span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="outlet-action__arrow"
                  strokeWidth={3}
                />
              </a>
            );
          })}
        </nav>

        {!config.reviewAction && config.secondaryActions.length === 0 && !config.queueEnabled && (
          <p className="outlet-empty">{content.empty}</p>
        )}

        {(config.todayHours || config.allHoursUrl) && (
          <aside className="outlet-info">
            {config.todayHours && (
              <p>
                <Clock3 aria-hidden="true" />
                <span>{config.todayHours}</span>
              </p>
            )}
            {config.allHoursUrl && (
              <a
                href={config.allHoursUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content.viewAllHours} <ArrowUpRight aria-hidden="true" />
              </a>
            )}
          </aside>
        )}

        <footer className="outlet-footer">
          <p>{content.madeFor} <strong>{config.name}</strong></p>
          <small>{content.poweredBy}</small>
        </footer>
      </div>
    </section>
  );
}
