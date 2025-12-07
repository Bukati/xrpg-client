"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface User {
  id: string;
  name?: string;
  username: string;
  profile_image_url?: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchUser() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const response = await fetch(`${apiUrl}/auth/session`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch {
        // Not logged in
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      await fetch(`${apiUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/90 backdrop-blur-sm border-b border-[var(--shield-border)]">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="pixel-font text-xl text-[var(--primary)]">xRPG</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-[var(--shield-border)] animate-pulse" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                {user.profile_image_url ? (
                  <Image
                    src={user.profile_image_url}
                    alt={user.name || user.username}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--background)] font-bold text-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm text-[var(--foreground)] hidden sm:block">
                  @{user.username}
                </span>
                <svg
                  className={`w-4 h-4 text-[var(--foreground-muted)] transition-transform ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--background)] border border-[var(--shield-border)] rounded-lg shadow-xl overflow-hidden">
                  <div className="p-3 border-b border-[var(--shield-border)]">
                    <div className="text-sm font-bold text-[var(--foreground)]">
                      {user.name || user.username}
                    </div>
                    <div className="text-xs text-[var(--foreground-muted)]">
                      @{user.username}
                    </div>
                  </div>
                  <a
                    href={`https://x.com/${user.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
                  >
                    View X Profile
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-[var(--background-secondary)] transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/x-login?returnUrl=${encodeURIComponent(pathname)}`}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--background)] rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Login with X
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
