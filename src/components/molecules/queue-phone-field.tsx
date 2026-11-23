import { useState, type ChangeEvent } from "react";
import { Input } from "../ui/input";

export function QueuePhoneField({ name, label, placeholder, help, warning }: {
  name: string;
  label: string;
  placeholder: string;
  help: string;
  warning: string;
}) {
  const [showWarning, setShowWarning] = useState(false);
  const [value, setValue] = useState("");
  const id = `queue-${name}`;

  function normalize(event: ChangeEvent<HTMLInputElement>) {
    let digits = event.currentTarget.value.replace(/\D/g, "");
    const startedWithZero = digits.startsWith("0");
    digits = digits.replace(/^0+/, "");
    if (digits.startsWith("62") && digits.charAt(2) === "8") digits = digits.slice(2);
    digits = digits.slice(0, 12);
    setValue(digits);
    setShowWarning(startedWithZero || Boolean(digits && !digits.startsWith("8")));
  }

  return <label htmlFor={id} className="block text-sm font-bold">
    {label}
    <Input id={id} name={name} type="tel" inputMode="numeric" autoComplete="tel" required pattern="8[0-9]{7,11}" maxLength={14} value={value} placeholder={placeholder} onChange={normalize} aria-describedby={`${id}-help${showWarning ? ` ${id}-warning` : ""}`} className="mt-2 min-h-12" />
    <span id={`${id}-help`} className="mt-1.5 block text-xs font-normal leading-5 text-[#69737d]">{help}</span>
    {showWarning && <span id={`${id}-warning`} role="status" className="mt-1 block text-xs font-semibold text-amber-800">{warning}</span>}
  </label>;
}
