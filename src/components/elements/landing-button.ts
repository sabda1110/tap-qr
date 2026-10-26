import { cn } from "../../lib/utils";
import { buttonVariants } from "../ui/button";
import "./landing-button.css";

type Options = {
  tone?: "orange" | "black";
  compact?: boolean;
  className?: string;
};

export function landingButtonStyles({ tone = "orange", compact = false, className }: Options = {}) {
  return cn(
    buttonVariants({ variant: "outline" }),
    "landing-cta",
    tone === "black" ? "landing-cta-black" : "landing-cta-orange",
    compact && "landing-cta-compact",
    className,
  );
}
