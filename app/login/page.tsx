"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleXLogin = () => {
    setIsLoading(true);
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    // Redirect to home after login from login page
    window.location.href = `${backendUrl}/auth/x-login?returnUrl=${encodeURIComponent('/')}`;
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--background)]">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--background-secondary)_1px,transparent_1px),linear-gradient(90deg,var(--background-secondary)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <div className="absolute top-1/3 left-1/3 h-64 w-64 rounded-full bg-[var(--primary)] opacity-10 blur-[100px]" />

      <div className="relative z-10 w-full max-w-md space-y-8 px-4">
        {/* Logo & Title */}
        <div className="text-center">
          <Link href="/" className="inline-block mb-4">
            <Image
              src="/favicon.png"
              alt="xRPG"
              width={80}
              height={80}
              className="drop-shadow-[0_0_20px_var(--primary-glow)]"
            />
          </Link>
          <h1 className="pixel-font text-3xl text-[var(--foreground)] mb-2 text-glow-primary">
            xRPG
          </h1>
          <p className="text-[var(--foreground-muted)]">
            Enter the ideological arena
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[var(--background-secondary)] rounded-xl p-8 border border-[var(--shield-dark)]">
          <button
            onClick={handleXLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-[var(--background)] hover:bg-[var(--background-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--foreground)] font-semibold py-4 px-6 rounded-lg transition-all duration-300 border border-[var(--shield-border)] hover:border-[var(--primary)] hover:text-[var(--primary)] group"
          >
            <svg
              className="w-6 h-6 transition-colors group-hover:text-[var(--primary)]"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span className="pixel-font text-xs tracking-wide">
              {isLoading ? "CONNECTING..." : "SIGN IN WITH X"}
            </span>
          </button>
        </div>

        {error && (
          <div className="bg-[var(--accent)]/10 border border-[var(--accent)] rounded-lg p-4">
            <p className="text-[var(--accent)] text-sm">Error: {error}</p>
          </div>
        )}

        <p className="text-center text-sm text-[var(--foreground-muted)] opacity-60">
          Connect your X account to join the battle royale
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
          <div className="text-[var(--foreground)] pixel-font text-sm">
            Loading...
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
