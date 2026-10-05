import type { ReactNode } from "react";

export type AuthMode = "login" | "register";

type AuthLayoutProps = {
  mode: AuthMode;
  header: ReactNode;
  showcase: ReactNode;
  form: ReactNode;
};

export function AuthLayout({ mode, header, showcase, form }: AuthLayoutProps) {
  const isRegister = mode === "register";

  return (
    <div className="min-h-screen bg-[#f5f8fb] text-[#161a22]">
      {header}
      <main className="relative isolate overflow-hidden px-4 pb-6 sm:px-6 sm:pb-10 lg:px-8">
        <span className="pointer-events-none absolute -left-16 top-28 size-52 rounded-full border border-[#0798ad]/15" />
        <span className="pointer-events-none absolute -right-8 bottom-16 size-32 rotate-12 rounded-[2rem] border border-[#ffb332]/35" />

        <div
          className={`relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-black/[0.07] bg-white shadow-[0_28px_90px_rgba(23,36,52,0.11)] transition-[height] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none lg:grid-cols-2 ${
            isRegister ? "lg:h-[780px]" : "lg:h-[700px]"
          }`}
        >
          <div
            className={`relative z-10 min-h-[390px] overflow-hidden bg-[#eaf6f8] transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none lg:absolute lg:inset-y-0 lg:left-0 lg:w-1/2 ${
              isRegister ? "lg:translate-x-full" : "lg:translate-x-0"
            }`}
          >
            {showcase}
          </div>

          <div
            className={`relative z-20 bg-white transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none lg:absolute lg:inset-y-0 lg:left-1/2 lg:w-1/2 ${
              isRegister ? "lg:-translate-x-full" : "lg:translate-x-0"
            }`}
          >
            {form}
          </div>
        </div>
      </main>
    </div>
  );
}
