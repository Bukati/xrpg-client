import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[linear-gradient(var(--background-secondary)_1px,transparent_1px),linear-gradient(90deg,var(--background-secondary)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <div className="fixed top-1/4 left-1/4 h-96 w-96 rounded-full bg-[var(--primary)] opacity-10 blur-[120px]" />

      <div className="relative z-10 text-center max-w-lg">
        <div className="pixel-font text-6xl text-[var(--primary)] mb-4 text-glow-primary">
          404
        </div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-4">
          Quest Not Found
        </h1>
        <p className="text-[var(--foreground-muted)] mb-8">
          This quest doesn't exist or has been lost to the timeline.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[var(--primary)] text-[var(--background)] rounded-lg font-bold hover:opacity-90 transition-opacity"
        >
          Return to Arena
        </Link>
      </div>
    </div>
  );
}
