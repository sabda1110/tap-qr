import { useState } from "react";
import { createPortal } from "react-dom";
import type { Messages } from "../../i18n";
import type { PublicOutletHighlight } from "../../server/outlets/outlet-highlights";
import { OutletHighlightViewer } from "../organisms/outlet-highlight-viewer";
import "./outlet-highlights.css";

export function OutletHighlights({
  highlights,
  content,
  onHighlightOpen,
}: {
  highlights: PublicOutletHighlight[];
  content: Messages["outletGallery"];
  onHighlightOpen: (highlightId: string) => void;
}) {
  const [activeHighlightIndex, setActiveHighlightIndex] = useState<number | null>(
    null,
  );
  if (highlights.length === 0) return null;
  return (
    <>
      <nav className="outlet-highlights" aria-label={content.publicLabel}>
        <ul>
          {highlights.map((highlight, index) => (
            <li key={highlight.id}>
              <button
                type="button"
                aria-label={content.openHighlight.replace(
                  "{title}",
                  highlight.title,
                )}
                onClick={() => setActiveHighlightIndex(index)}
              >
                <span className="outlet-highlight__ring">
                  <img
                    src={highlight.coverUrl}
                    alt=""
                    width={72}
                    height={72}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span className="outlet-highlight__title">{highlight.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {activeHighlightIndex !== null &&
        typeof document !== "undefined" &&
        createPortal(
          <OutletHighlightViewer
            highlights={highlights}
            initialHighlightIndex={activeHighlightIndex}
            content={content}
            onClose={() => setActiveHighlightIndex(null)}
            onHighlightOpen={onHighlightOpen}
          />,
          document.body,
        )}
    </>
  );
}
