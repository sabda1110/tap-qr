type GoogleBrandTextProps = {
  className?: string;
};

export function GoogleBrandText({ className = "" }: GoogleBrandTextProps) {
  return (
    <span className={`inline-block font-extrabold tracking-tight ${className}`}>
      <span className="text-[#4285f4]">G</span>
      <span className="text-[#ea4335]">o</span>
      <span className="text-[#fbbc05]">o</span>
      <span className="text-[#4285f4]">g</span>
      <span className="text-[#34a853]">l</span>
      <span className="text-[#ea4335]">e</span>
    </span>
  );
}
