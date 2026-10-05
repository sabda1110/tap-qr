import { useEffect, useState } from "react";

export function useActiveSection(sectionIds: readonly string[]) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    let animationFrame: number | null = null;

    const updateActiveSection = () => {
      animationFrame = null;
      const marker = window.scrollY + Math.min(window.innerHeight * 0.35, 320);
      let nextSection: string | null = null;

      for (const sectionId of sectionIds) {
        const section = document.getElementById(sectionId);
        if (!section) continue;

        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        if (marker >= sectionTop && marker < sectionBottom) {
          nextSection = sectionId;
          break;
        }
      }

      const isPageBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (isPageBottom) nextSection = sectionIds.at(-1) ?? null;

      setActiveSection((currentSection) =>
        currentSection === nextSection ? currentSection : nextSection,
      );
    };

    const scheduleUpdate = () => {
      if (animationFrame !== null) return;
      animationFrame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    };
  }, [sectionIds]);

  return activeSection;
}
