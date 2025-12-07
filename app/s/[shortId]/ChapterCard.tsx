"use client";

import { useState } from "react";

interface QuestOption {
  text: string;
  label: string;
}

interface HistoricalSource {
  title: string;
  url: string;
  relevantFact: string;
}

interface ChapterVote {
  id: string;
  selectedOption: number;
  user: {
    xHandle: string;
  };
}

interface Chapter {
  id: string;
  chapterNumber: number;
  chapterTitle: string;
  content: string;
  options: QuestOption[] | null;
  sources: HistoricalSource[];
  postedTweetId: string;
  tweetUrl: string;
  voteCount: number;
  createdAt: string;
  votes?: ChapterVote[];
  winningOption?: number;
}

interface User {
  id: string;
  xHandle: string;
  accessToken?: string;
}

interface ChapterCardProps {
  chapter: Chapter;
  isLatest: boolean;
  isFinal: boolean;
  isPast: boolean;
  user: User | null;
  questStatus: string;
}

export default function ChapterCard({
  chapter,
  isLatest,
  isFinal,
  isPast,
  user,
  questStatus,
}: ChapterCardProps) {
  const [voting, setVoting] = useState<number | null>(null);
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredOption, setHoveredOption] = useState<number | null>(null);

  const isActive = questStatus === "ACTIVE";
  const canVote = isLatest && isActive && user && !isFinal && !voted;

  // Group voters by option
  const votersByOption: Record<number, string[]> = {};
  if (chapter.votes) {
    for (const vote of chapter.votes) {
      if (!votersByOption[vote.selectedOption]) {
        votersByOption[vote.selectedOption] = [];
      }
      votersByOption[vote.selectedOption].push(vote.user.xHandle);
    }
  }

  const handleVote = async (optionIndex: number) => {
    if (!canVote) return;

    setVoting(optionIndex);
    setError(null);

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chapterId: chapter.id,
          optionIndex: optionIndex,
          tweetId: chapter.postedTweetId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to vote");
      }

      setVoted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setVoting(null);
    }
  };

  return (
    <div className="flex gap-4">
      {/* Main Chapter Content */}
      <div
        className={`flex-1 border-2 rounded-lg p-6 ${
          isLatest
            ? "border-[var(--primary)] bg-[var(--background-secondary)] glow-primary"
            : "border-[var(--shield-border)] bg-[var(--background-secondary)]"
        }`}
      >
        {/* Chapter Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--foreground-muted)] bg-[var(--background)] px-2 py-1 rounded">
              CH {chapter.chapterNumber}
            </span>
            <h2 className="pixel-font text-xl text-[var(--primary)]">
              {chapter.chapterTitle?.toUpperCase() || `UNTITLED`}
            </h2>
          </div>
          <div className="flex gap-2 items-center text-xs text-[var(--foreground-muted)]">
            <span>{chapter.voteCount} votes</span>
            <a
              href={chapter.tweetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:underline"
            >
              View Tweet
            </a>
          </div>
        </div>

        {/* Chapter Content */}
        <div className="prose prose-invert max-w-none mb-6">
          <div className="text-[var(--foreground)] whitespace-pre-line leading-relaxed">
            {chapter.content}
          </div>
        </div>

        {/* Options */}
        {chapter.options && chapter.options.length > 0 && !isFinal && (
          <div className="mt-6 pt-6 border-t border-[var(--shield-border)]">
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
                {error}
              </div>
            )}

            {voted && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded text-green-400 text-sm">
                Vote submitted! Your reply has been posted.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chapter.options.map((option, idx) => {
                const optionNum = idx + 1;
                const isWinner = isPast && chapter.winningOption === optionNum;
                const voters = votersByOption[optionNum] || [];
                const isHovered = hoveredOption === optionNum;

                return (
                  <div
                    key={idx}
                    className="relative"
                    onMouseEnter={() => setHoveredOption(optionNum)}
                    onMouseLeave={() => setHoveredOption(null)}
                  >
                    <button
                      onClick={() => handleVote(optionNum)}
                      disabled={!canVote || voting !== null}
                      className={`
                        w-full text-left p-5 rounded-lg border-2 transition-all duration-200
                        ${
                          isWinner
                            ? "border-[var(--primary)] bg-[var(--primary)]/10"
                            : isPast
                            ? "border-[var(--shield-border)] bg-[var(--background)] opacity-60"
                            : canVote
                            ? "border-[var(--shield-border)] bg-[var(--background)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 hover:scale-[1.02] cursor-pointer"
                            : "border-[var(--shield-border)] bg-[var(--background)] opacity-50 cursor-not-allowed"
                        }
                        ${voting === optionNum ? "animate-pulse" : ""}
                      `}
                    >
                      {/* Option Number Badge */}
                      <div
                        className={`
                          inline-flex items-center justify-center w-8 h-8 rounded-full mb-3 font-bold
                          ${
                            isWinner
                              ? "bg-[var(--primary)] text-[var(--background)]"
                              : "bg-[var(--shield-border)] text-[var(--foreground-muted)]"
                          }
                        `}
                      >
                        {optionNum}
                      </div>

                      {/* Option Text */}
                      <div className="text-[var(--foreground)] font-medium mb-2">
                        {option.text}
                      </div>

                      {/* Winner Badge */}
                      {isWinner && (
                        <div className="text-xs text-[var(--primary)] font-bold mt-2">
                          CHOSEN PATH
                        </div>
                      )}

                      {/* Vote Count for Past Chapters */}
                      {isPast && voters.length > 0 && (
                        <div className="text-xs text-[var(--foreground-muted)] mt-2">
                          {voters.length} voter{voters.length !== 1 ? "s" : ""}
                        </div>
                      )}

                      {/* Login Prompt */}
                      {!user && isLatest && isActive && (
                        <div className="text-xs text-[var(--accent)] mt-2">
                          Login to vote
                        </div>
                      )}
                    </button>

                    {/* Voters Tooltip */}
                    {isPast && isHovered && voters.length > 0 && (
                      <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-[var(--background)] border border-[var(--shield-border)] rounded-lg shadow-xl min-w-[200px]">
                        <div className="text-xs font-bold text-[var(--primary)] mb-2">
                          VOTERS
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {voters.slice(0, 10).map((handle, i) => (
                            <a
                              key={i}
                              href={`https://x.com/${handle}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[var(--accent)] hover:underline"
                            >
                              @{handle}
                            </a>
                          ))}
                          {voters.length > 10 && (
                            <span className="text-xs text-[var(--foreground-muted)]">
                              +{voters.length - 10} more
                            </span>
                          )}
                        </div>
                        {/* Tooltip Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[var(--shield-border)]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Chapter metadata */}
        <div className="mt-4 text-xs text-[var(--foreground-muted)]">
          Posted {new Date(chapter.createdAt).toLocaleString()}
        </div>
      </div>

      {/* Right Side - Historical Sources */}
      {chapter.sources && chapter.sources.length > 0 && (
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-4">
            <div className="text-xs font-bold text-[var(--primary)] mb-3 flex items-center gap-2">
              <span>SOURCES</span>
            </div>
            <div className="space-y-3">
              {chapter.sources.map((source, idx) => (
                <a
                  key={idx}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-[var(--background)] border border-[var(--shield-border)] rounded-lg hover:border-[var(--accent)] transition-colors group"
                >
                  <div className="text-sm font-medium text-[var(--accent)] group-hover:underline mb-1 line-clamp-2">
                    {source.title}
                  </div>
                  <div className="text-xs text-[var(--foreground-muted)] line-clamp-3">
                    {source.relevantFact}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
