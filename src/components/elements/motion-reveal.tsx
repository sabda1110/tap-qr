import {
  type ReactNode,
  type CSSProperties,
  useEffect,
  useRef,
  useState,
} from "react";

type MotionDirection = "up" | "left" | "right";

type MotionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: MotionDirection;
  trigger?: "load" | "scroll";
};

const hiddenTransform: Record<MotionDirection, string> = {
  up: "translate-y-8",
  left: "-translate-x-8",
  right: "translate-x-8",
};

export function MotionReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  trigger = "scroll",
}: MotionRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(trigger === "scroll");

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      setIsVisible(true);
      return;
    }

    if (trigger === "load") {
      const animationFrame = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(animationFrame);
    }

    const element = elementRef.current;
    if (!element) return;

    if (element.getBoundingClientRect().top > window.innerHeight * 0.9) {
      setIsVisible(false);
    }

    let observer: IntersectionObserver;
    let fallbackTimer: number;

    const revealIfVisible = () => {
      const bounds = element.getBoundingClientRect();
      const isInsideViewport =
        bounds.top < window.innerHeight * 0.94 && bounds.bottom > 0;

      if (isInsideViewport) {
        setIsVisible(true);
        observer.disconnect();
        window.removeEventListener("scroll", revealIfVisible);
        window.clearTimeout(fallbackTimer);
      }
    };

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          revealIfVisible();
        }
      },
      { threshold: 0.05 },
    );

    observer.observe(element);
    window.addEventListener("scroll", revealIfVisible, { passive: true });
    fallbackTimer = window.setTimeout(revealIfVisible, 500);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", revealIfVisible);
      window.clearTimeout(fallbackTimer);
    };
  }, [trigger]);

  const style = { transitionDelay: `${delay}ms` } as CSSProperties;
  const visibilityClass = isVisible
    ? "translate-x-0 translate-y-0 opacity-100 blur-none"
    : `${hiddenTransform[direction]} opacity-0 blur-[2px]`;

  return (
    <div
      ref={elementRef}
      className={`transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:blur-none ${visibilityClass} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
