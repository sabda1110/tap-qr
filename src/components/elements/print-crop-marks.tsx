type PrintCropMarksProps = {
  className?: string;
};

/**
 * Standard print trim / crop marks for professional print shops.
 * Placed at the 4 corners outside the trim area.
 */
export function PrintCropMarks({ className = "" }: PrintCropMarksProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 select-none ${className}`}
    >
      {/* Top Left Corner */}
      <div className="absolute -top-3 -left-3 size-4">
        {/* Horizontal crop mark */}
        <div className="absolute top-3 left-0 h-[1px] w-2.5 bg-black" />
        {/* Vertical crop mark */}
        <div className="absolute top-0 left-3 h-2.5 w-[1px] bg-black" />
      </div>

      {/* Top Right Corner */}
      <div className="absolute -top-3 -right-3 size-4">
        {/* Horizontal crop mark */}
        <div className="absolute top-3 right-0 h-[1px] w-2.5 bg-black" />
        {/* Vertical crop mark */}
        <div className="absolute top-0 right-3 h-2.5 w-[1px] bg-black" />
      </div>

      {/* Bottom Left Corner */}
      <div className="absolute -bottom-3 -left-3 size-4">
        {/* Horizontal crop mark */}
        <div className="absolute bottom-3 left-0 h-[1px] w-2.5 bg-black" />
        {/* Vertical crop mark */}
        <div className="absolute bottom-0 left-3 h-2.5 w-[1px] bg-black" />
      </div>

      {/* Bottom Right Corner */}
      <div className="absolute -bottom-3 -right-3 size-4">
        {/* Horizontal crop mark */}
        <div className="absolute bottom-3 right-0 h-[1px] w-2.5 bg-black" />
        {/* Vertical crop mark */}
        <div className="absolute bottom-0 right-3 h-2.5 w-[1px] bg-black" />
      </div>
    </div>
  );
}
