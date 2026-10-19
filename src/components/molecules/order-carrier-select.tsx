import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const popularIndonesianCarriers = [
  "J&T Express",
  "JNE",
  "SiCepat Ekspres",
  "SPX Express",
  "AnterAja",
  "Ninja Xpress",
  "Pos Indonesia",
  "TIKI",
  "Lion Parcel",
  "ID Express",
] as const;

type Props = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  disabled?: boolean;
  labelClassName?: string;
  onValueChange: (value: string) => void;
};

export function OrderCarrierSelect({
  id,
  label,
  placeholder,
  value,
  disabled,
  labelClassName = "text-sm",
  onValueChange,
}: Props) {
  const carriers = value && !popularIndonesianCarriers.includes(
    value as (typeof popularIndonesianCarriers)[number],
  )
    ? [value, ...popularIndonesianCarriers]
    : popularIndonesianCarriers;

  return (
    <div>
      <label htmlFor={id} className={`mb-2 block font-semibold ${labelClassName}`}>
        {label}
      </label>
      <Select
        items={Object.fromEntries(carriers.map((carrier) => [carrier, carrier]))}
        value={value || null}
        disabled={disabled}
        onValueChange={(nextValue) => {
          if (nextValue) onValueChange(nextValue);
        }}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {carriers.map((carrier) => (
            <SelectItem key={carrier} value={carrier}>
              {carrier}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
