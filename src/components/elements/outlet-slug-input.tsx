import {
  type ChangeEventHandler,
  forwardRef,
  type ComponentProps,
} from "react";

import { toOutletSlug } from "../../lib/validation/outlet-slug";
import { CustomInputText } from "./custom-input-text";

type OutletSlugInputProps = Omit<
  ComponentProps<typeof CustomInputText>,
  "onChange" | "maxLength"
> & {
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

const OutletSlugInput = forwardRef<HTMLInputElement, OutletSlugInputProps>(
  ({ onChange, ...props }, ref) => (
    <CustomInputText
      {...props}
      ref={ref}
      maxLength={80}
      onChange={(event) => {
        event.currentTarget.value = toOutletSlug(event.currentTarget.value);
        onChange?.(event);
      }}
    />
  ),
);

OutletSlugInput.displayName = "OutletSlugInput";

export { OutletSlugInput };
