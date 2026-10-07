import { Trash2, X } from "lucide-react";
import { Button } from "../ui/button";

type Props = {
  count: number;
  pending: boolean;
  content: { selectedCount: string; delete: string; cancel: string };
  onDelete: () => void;
  onCancel: () => void;
};

export function CardSelectionActions({ count, pending, content, onDelete, onCancel }: Props) {
  if (count <= 1) return null;
  return <div className="fixed right-4 bottom-4 left-4 z-40 lg:left-[280px]">
    <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#bce8ef] bg-white/95 p-4 shadow-[0_8px_36px_rgba(23,32,41,0.16)] backdrop-blur-sm">
      <p aria-live="polite" className="text-sm font-bold text-[#087e91]">{content.selectedCount.replace("{count}", String(count))}</p>
      <div className="flex gap-2">
        <Button className="h-10 px-4" variant="outline" disabled={pending} type="button" onClick={onCancel}><X />{content.cancel}</Button>
        <Button className="h-10 px-4" variant="destructive" disabled={pending} type="button" onClick={onDelete}><Trash2 />{content.delete}</Button>
      </div>
    </div>
  </div>;
}
