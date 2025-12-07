"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Quest {
  id: string;
  shortId: string;
  initialTweet: string;
  tweetId: string;
  tweetUrl: string;
  gameUrl: string;
  currentChapter: number;
  createdAt: string;
  chapterDeadline: string | null;
}

const PAGE_SIZE = 5;

export default function ActiveGames() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchQuests = async (offset: number = 0, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/quests/active?limit=${PAGE_SIZE}&offset=${offset}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch active quests");
      }
      const data = await response.json();

      if (append) {
        setQuests((prev) => [...prev, ...data.quests]);
      } else {
        setQuests(data.quests);
      }
      setHasMore(data.hasMore);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchQuests();

    // Refresh every 30 seconds
    const interval = setInterval(() => fetchQuests(), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLoadMore = () => {
    fetchQuests(quests.length, true);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-[var(--foreground-muted)]">
          Loading active games...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-[var(--accent)]">Error: {error}</div>
      </div>
    );
  }

  if (quests.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-[var(--foreground-muted)]">
          No active games right now. Tag @xRPGBot to start one!
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <h2 className="pixel-font text-2xl md:text-3xl text-[var(--foreground)] mb-6 text-center text-glow-primary">
        Active Games
        {total > 0 && (
          <span className="text-sm text-[var(--foreground-muted)] ml-2">
            ({total})
          </span>
        )}
      </h2>

      <div className="space-y-4">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className="border-2 border-[var(--shield-border)] rounded-lg p-4 bg-[var(--background-secondary)] hover:border-[var(--primary)] transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[var(--primary)] font-mono text-sm">
                    Chapter {quest.currentChapter}/5
                  </span>
                  {quest.chapterDeadline && (
                    <span className="text-[var(--foreground-muted)] text-xs">
                      • Ends{" "}
                      {new Date(quest.chapterDeadline).toLocaleTimeString()}
                    </span>
                  )}
                </div>
                <p className="text-[var(--foreground)] text-sm mb-2 line-clamp-2">
                  {quest.initialTweet}
                </p>
                <div className="text-xs text-[var(--foreground-muted)]">
                  Started {new Date(quest.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={quest.tweetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-[var(--shield-border)] text-[var(--foreground)] text-sm rounded hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-300"
                >
                  View Tweet
                </a>
                <Link
                  href={quest.gameUrl}
                  className="px-4 py-2 bg-[var(--primary)] text-[var(--background)] text-sm rounded hover:scale-105 transition-all duration-300 pixel-font"
                >
                  Play
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-6 py-3 border-2 border-[var(--primary)] text-[var(--primary)] rounded-lg hover:bg-[var(--primary)] hover:text-[var(--background)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Loading...
              </span>
            ) : (
              `Load More (${quests.length}/${total})`
            )}
          </button>
        </div>
      )}
    </div>
  );
}
