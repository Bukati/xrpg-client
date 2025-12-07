import Image from "next/image";
import Link from "next/link";
import ActiveGames from "@/components/ActiveGames";
import FinishedGames from "@/components/FinishedGames";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[var(--background)]">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--background-secondary)_1px,transparent_1px),linear-gradient(90deg,var(--background-secondary)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[var(--primary)] opacity-10 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[var(--accent)] opacity-10 blur-[120px]" />

      <main className="relative z-10 flex flex-col items-center px-4 text-center pt-12 pb-20">
        {/* Logo */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 blur-2xl opacity-60 bg-[var(--primary)]" style={{ borderRadius: "50%" }} />
          <Image
            src="/favicon.png"
            alt="xRPG Shield"
            width={160}
            height={160}
            className="relative drop-shadow-[0_0_30px_var(--primary-glow)]"
            priority
          />
        </div>

        {/* Title */}
        <h1 className="pixel-font text-4xl md:text-6xl text-[var(--foreground)] mb-4 tracking-wider text-glow-primary">
          xRPG
        </h1>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-[var(--foreground-muted)] mb-2 max-w-2xl font-mono">
          What if things went differently?
        </p>
        <p className="text-sm md:text-base text-[var(--foreground-muted)] mb-10 max-w-xl opacity-70">
          Turn any tweet into a "what-if" simulation powered by real historical context.
        </p>

        {/* CTA Button */}
        <div className="mb-12">
          <Link
            href="/about"
            className="px-8 py-4 border-2 border-[var(--shield-border)] text-[var(--foreground)] font-bold rounded-lg transition-all duration-300 hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--background-secondary)]"
          >
            <span className="pixel-font text-sm tracking-wide">HOW IT WORKS</span>
          </Link>
        </div>

        {/* Active Games Section */}
        <div className="w-full mb-16">
          <ActiveGames />
        </div>

        {/* Finished Games Section */}
        <div className="w-full">
          <FinishedGames />
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-4 text-center text-xs text-[var(--foreground-muted)] opacity-50">
        100% X-native • Powered by Grok • xrpg.gg
      </footer>
    </div>
  );
}
