import {
  type ChangeEventHandler,
  forwardRef,
  type ComponentProps,
} from "react";

import { sanitizeWhatsAppNumber } from "../../lib/validation/whatsapp-number";
import { CustomInputText } from "./custom-input-text";

type WhatsAppNumberInputProps = Omit<
  ComponentProps<typeof CustomInputText>,
  "onChange" | "type" | "inputMode" | "maxLength"
> & {
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

const WhatsAppNumberInput = forwardRef<
  HTMLInputElement,
  WhatsAppNumberInputProps
>(({ onChange, ...props }, ref) => (
  <CustomInputText
    {...props}
    ref={ref}
    type="tel"
    inputMode="tel"
    autoComplete="tel"
    maxLength={16}
    onChange={(event) => {
      event.currentTarget.value = sanitizeWhatsAppNumber(event.currentTarget.value);
      onChange?.(event);
    }}
  />
));

WhatsAppNumberInput.displayName = "WhatsAppNumberInput";

export { WhatsAppNumberInput };
