import { ArrowUpRight, Link2, MapPin, Store } from "lucide-react";
import type { Messages } from "../../i18n";
import type { PublicOutletProfile } from "../../server/outlets/public-profile.types";
import { SocialBrandMark } from "../elements/social-brand-mark";

export function OutletProfileSection({ profile, content }: {
  profile: PublicOutletProfile;
  content: Messages["outletProfile"];
}) {
  return (
    <section className="w-full max-w-md overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
      <div className="h-24 bg-accent sm:h-32" />
      <div className="px-5 pb-8 sm:px-8">
        <div className="relative mx-auto -mt-10 flex size-20 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-primary text-primary-foreground">
          {profile.avatarUrl ? <img src={profile.avatarUrl} alt="" className="size-full object-cover" width={80} height={80} /> : <Store aria-hidden="true" className="size-8" />}
        </div>
        <h1 className="mt-4 break-words text-center text-2xl font-extrabold tracking-tight">{profile.name}</h1>
        {profile.slug && <p className="mt-1 break-all text-center text-sm text-muted-foreground">@{profile.slug}</p>}
        {profile.location && <p className="mt-3 flex justify-center gap-2 text-center text-xs leading-5 text-muted-foreground"><MapPin aria-hidden="true" className="mt-1 size-3 shrink-0" />{profile.location}</p>}
        <p className="mt-4 whitespace-pre-line break-words text-center text-sm leading-6 text-muted-foreground">{profile.description || content.welcome}</p>
        <nav aria-label={content.linksLabel} className="mt-6 grid gap-3">
          {profile.links.map((link) => (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className={`flex min-h-16 items-center gap-3 rounded-2xl border p-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring ${link.type === "google_review" ? "border-primary bg-primary text-primary-foreground hover:opacity-90" : "border-border bg-background hover:bg-muted"}`}>
              {link.type === "facebook" ? <Link2 aria-hidden="true" className="size-10 shrink-0 p-2" /> : <SocialBrandMark type={link.type} />}
              <span className="min-w-0 flex-1 break-words text-sm font-bold">{link.label.trim() || content.channels[link.type]}</span>
              <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
            </a>
          ))}
        </nav>
        {profile.links.length === 0 && <p className="mt-6 rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">{content.empty}</p>}
      </div>
    </section>
  );
}
