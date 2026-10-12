import { Trash2 } from "lucide-react";
import type { MasterCard } from "../../server/cards/card.repository.server";
import { Button } from "../ui/button";

export type CardTableRowContent = {
  pvc: string;
  acrylic: string;
  claimed: string;
  unclaimed: string;
  enabled: string;
  disabled: string;
  printed: string;
  unprinted: string;
  delete: string;
  selectCard: string;
};

type CardTableRowProps = {
  card: MasterCard;
  content: CardTableRowContent;
  disabled: boolean;
  isSelected: boolean;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
};

export function CardTableRow({
  card,
  content,
  disabled,
  isSelected,
  onDelete,
  onToggle,
}: CardTableRowProps) {
  const isUnused = card.claimStatus === "unclaimed";
  return (
    <tr className="border-t border-black/6">
      <td className="px-5 py-4">
        <input
          aria-label={`${content.selectCard} ${card.cardId}`}
          checked={isSelected}
          disabled={disabled || !isUnused}
          onChange={() => onToggle(card.id)}
          type="checkbox"
        />
      </td>
      <td className="px-5 py-4 font-bold text-[#172029]">{card.cardId}</td>
      <td className="px-5 py-4">
        {card.material === "pvc" ? content.pvc : content.acrylic}
      </td>
      <td className="px-5 py-4">
        <StatusBadge
          label={card.claimStatus === "claimed" ? content.claimed : content.unclaimed}
        />
      </td>
      <td className="px-5 py-4">
        <StatusBadge
          label={card.isEnabled ? content.enabled : content.disabled}
          muted={!card.isEnabled}
        />
      </td>
      <td className="px-5 py-4">
        <StatusBadge
          label={card.printStatus === "printed" ? content.printed : content.unprinted}
          muted={card.printStatus === "unprinted"}
        />
      </td>
      <td className="px-5 py-4 text-right">
        <Button
          aria-label={`${content.delete} ${card.cardId}`}
          disabled={disabled || !isUnused}
          onClick={() => void onDelete(card.id)}
          size="icon-sm"
          type="button"
          variant="destructive"
        >
          <Trash2 />
        </Button>
      </td>
    </tr>
  );
}

function StatusBadge({ label, muted = false }: { label: string; muted?: boolean }) {
  return (
    <span
      className={
        muted
          ? "rounded-full bg-[#f1f3f5] px-2.5 py-1 text-xs font-bold text-[#69737d]"
          : "rounded-full bg-[#eaf9fb] px-2.5 py-1 text-xs font-bold text-[#087e91]"
      }
    >
      {label}
    </span>
  );
}
