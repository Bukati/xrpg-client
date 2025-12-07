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
  canonTitle?: string;
  currentChapter: number;
  createdAt: string;
  completedAt?: string;
  chapterDeadline?: string | null;
}

export default function QuestSidebar() {
  const [activeQuests, setActiveQuests] = useState<Quest[]>([]);
  const [finishedQuests, setFinishedQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuests() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL ||
          (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001');

        // Fetch active quests
        const activeResponse = await fetch(`${apiUrl}/quests/active`);
        let hasActiveQuests = false;

        if (activeResponse.ok) {
          const activeData = await activeResponse.json();
          setActiveQuests(activeData.quests || []);
          hasActiveQuests = (activeData.quests || []).length > 0;
        }

        // Fetch finished quests if no active quests
        if (!hasActiveQuests) {
          const finishedResponse = await fetch(`${apiUrl}/quests/completed`);
          if (finishedResponse.ok) {
            const finishedData = await finishedResponse.json();
            setFinishedQuests(finishedData.quests?.slice(0, 5) || []);
          }
        }
      } catch (err) {
        console.error('Failed to fetch quests:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchQuests();
  }, []);

  if (loading) {
    return (
      <div className="text-xs text-[var(--foreground-muted)]">
        Loading games...
      </div>
    );
  }

  const questsToShow = activeQuests.length > 0 ? activeQuests : finishedQuests;
  const isShowingActive = activeQuests.length > 0;

  if (questsToShow.length === 0) {
    return (
      <div className="text-xs text-[var(--foreground-muted)]">
        No games available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="pixel-font text-sm text-[var(--foreground)] mb-3">
        {isShowingActive ? "ACTIVE GAMES" : "RECENT GAMES"}
      </h3>
      {questsToShow.map((quest) => (
        <Link
          key={quest.id}
          href={quest.gameUrl}
          className="block border border-[var(--shield-border)] rounded-lg p-3 bg-[var(--background-secondary)] hover:border-[var(--primary)] transition-all text-xs"
        >
          <div className="flex items-center gap-1 mb-1">
            <span className={`${isShowingActive ? 'text-[var(--primary)]' : 'text-[var(--accent)]'} font-mono text-[10px]`}>
              {isShowingActive ? `Ch ${quest.currentChapter}/5` : '✓ Complete'}
            </span>
          </div>
          <p className="text-[var(--foreground)] text-[11px] line-clamp-2 mb-1">
            {quest.initialTweet}
          </p>
          {quest.canonTitle && (
            <p className="text-[var(--primary)] text-[10px] font-bold truncate">
              {quest.canonTitle}
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}
