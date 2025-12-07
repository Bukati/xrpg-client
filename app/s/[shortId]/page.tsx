"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import QuestSidebar from "./QuestSidebar";

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
}

interface Quest {
  id: string;
  shortId: string;
  status: string;
  initialTweet: string;
  tweetId: string;
  tweetUrl: string;
  canonTitle?: string;
  currentChapter: number;
  chapterDeadline: string | null;
  createdAt: string;
  chapters: Chapter[];
}

interface Session {
  id: string;
  name?: string;
  username: string;
  profile_image_url?: string;
}

async function getQuest(shortId: string): Promise<Quest | null> {
  const isServer = typeof window === 'undefined';

  let apiUrl: string;
  if (isServer) {
    apiUrl = process.env.API_URL || 'http://localhost:3001';
  } else {
    apiUrl = process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001');
  }

  const url = `${apiUrl}/quests/${shortId}`;

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch quest: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("[Quest Fetch] Error:", error);
    return null;
  }
}

async function getSession(): Promise<Session | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/auth/session`, {
      credentials: 'include',
    });

    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function Countdown({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(deadline).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft("Tallying votes...");
        return;
      }

      const minutes = Math.floor(diff / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${seconds}s`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  return <span className="text-[var(--accent)]">⏱️ {timeLeft}</span>;
}

function ChapterComponent({
  chapter,
  quest,
  isLatest,
  isFinal,
  session
}: {
  chapter: Chapter;
  quest: Quest;
  isLatest: boolean;
  isFinal: boolean;
  session: Session | null;
}) {
  const [voting, setVoting] = useState(false);
  const [votingOption, setVotingOption] = useState<number | null>(null);

  // Check if user has already voted on this chapter
  const getUserVote = (): number | null => {
    if (!session || !chapter.votes) return null;
    const userVote = chapter.votes.find(
      (vote) => vote.user.xHandle.toLowerCase() === session.username.toLowerCase()
    );
    return userVote ? userVote.selectedOption - 1 : null; // Convert to 0-based index
  };

  const [selectedOption, setSelectedOption] = useState<number | null>(getUserVote());
  const hasVoted = selectedOption !== null;

  // Get winning option for past chapters
  const getWinningOption = (): { option: number; count: number; voters: string[] } | null => {
    if (!chapter.votes || chapter.votes.length === 0) return null;

    const voteCounts: { [key: number]: { count: number; voters: string[] } } = {};
    chapter.votes.forEach(vote => {
      if (!voteCounts[vote.selectedOption]) {
        voteCounts[vote.selectedOption] = { count: 0, voters: [] };
      }
      voteCounts[vote.selectedOption].count++;
      voteCounts[vote.selectedOption].voters.push(vote.user.xHandle);
    });

    let maxVotes = 0;
    let winningOpt: { option: number; count: number; voters: string[] } | null = null;
    Object.entries(voteCounts).forEach(([opt, data]) => {
      if (data.count > maxVotes) {
        maxVotes = data.count;
        winningOpt = { option: parseInt(opt), ...data };
      }
    });

    return winningOpt;
  };

  const winningOption = !isLatest ? getWinningOption() : null;

  const handleVote = async (optionIndex: number) => {
    if (!session || voting || hasVoted) return;

    setVoting(true);
    setVotingOption(optionIndex);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/quests/${quest.shortId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          chapterId: chapter.id,
          tweetId: chapter.postedTweetId,
          optionIndex: optionIndex + 1, // Convert to 1-based
        }),
      });

      if (response.ok) {
        setSelectedOption(optionIndex);
      } else {
        alert('Failed to vote. Please try voting on X directly.');
      }
    } catch (error) {
      console.error('Vote error:', error);
      alert('Failed to vote. Please try voting on X directly.');
    } finally {
      setVoting(false);
      setVotingOption(null);
    }
  };

  return (
    <div className="flex gap-6">
      {/* Main Chapter Content */}
      <div className="flex-1">
        <div
          className={`border-2 rounded-lg p-6 ${
            isLatest
              ? "border-[var(--primary)] bg-[var(--background-secondary)] glow-primary"
              : "border-[var(--shield-border)] bg-[var(--background-secondary)]"
          }`}
        >
          {/* Chapter Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="pixel-font text-xl text-[var(--primary)]">
              {chapter.chapterTitle?.toUpperCase()}
            </h2>
            <div className="flex gap-2 items-center text-xs text-[var(--foreground-muted)]">
              <span>
                {isLatest && !isFinal && quest.status === 'ACTIVE'
                  ? '🗳️ voting in progress'
                  : `${chapter.voteCount} votes`}
              </span>
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

          {/* Options for latest chapter */}
          {chapter.options && chapter.options.length > 0 && !isFinal && isLatest && (
            <div className="space-y-4 mt-6 pt-6 border-t-2 border-[var(--shield-border)]">
              <div className="text-sm font-bold text-[var(--primary)] mb-4 pixel-font">
                ⚔️ CHOOSE YOUR PATH:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chapter.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleVote(idx)}
                    disabled={!session || voting || hasVoted}
                    className={`group relative p-6 border-2 rounded-lg transition-all duration-200 text-left ${
                      selectedOption === idx
                        ? "border-[var(--primary)] bg-[var(--primary)]/10 scale-105"
                        : hasVoted
                        ? "border-[var(--shield-border)] bg-[var(--background)] opacity-50 cursor-not-allowed"
                        : !session
                        ? "border-[var(--shield-border)] bg-[var(--background)] opacity-60 cursor-not-allowed"
                        : "border-[var(--shield-border)] bg-[var(--background)] hover:border-[var(--primary)] hover:scale-105 hover:shadow-lg cursor-pointer"
                    }`}
                  >
                    <div className="font-bold text-2xl text-[var(--primary)] mb-3 pixel-font">
                      {option.label}
                    </div>
                    <div className="text-sm text-[var(--foreground)]">
                      {option.text}
                    </div>
                    {!session && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/x-login?returnUrl=${encodeURIComponent(`/s/${quest.shortId}`)}`}
                          className="px-4 py-2 bg-[var(--primary)] text-[var(--background)] rounded font-bold hover:scale-110 transition-transform"
                        >
                          Login to Vote
                        </a>
                      </div>
                    )}
                    {votingOption === idx && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs text-[var(--primary)] pixel-font">POSTING VOTE...</span>
                        </div>
                      </div>
                    )}
                    {selectedOption === idx && !voting && (
                      <div className="absolute -top-2 -right-2 bg-[var(--primary)] text-[var(--background)] px-3 py-1 rounded-full text-xs font-bold">
                        YOUR VOTE ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {session && !hasVoted && !voting && (
                <div className="text-center text-xs text-[var(--foreground-muted)] mt-4">
                  Click an option to vote on X on your behalf
                </div>
              )}
              {session && voting && (
                <div className="text-center text-xs text-[var(--accent)] mt-4 flex items-center justify-center gap-2">
                  <div className="w-3 h-3 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                  Posting your vote to X...
                </div>
              )}
              {session && hasVoted && !voting && (
                <div className="text-center text-xs text-[var(--primary)] mt-4">
                  You have voted! Waiting for results...
                </div>
              )}
            </div>
          )}

          {/* Past chapter - show winning option */}
          {chapter.options && chapter.options.length > 0 && !isFinal && !isLatest && winningOption && (
            <div className="mt-6 pt-6 border-t-2 border-[var(--shield-border)]">
              <div className="text-sm font-bold text-[var(--primary)] mb-4 pixel-font">
                🏆 COMMUNITY CHOSE:
              </div>
              <div className="relative group">
                <div className="p-6 border-2 border-[var(--primary)] bg-[var(--primary)]/10 rounded-lg">
                  <div className="font-bold text-2xl text-[var(--primary)] mb-3 pixel-font">
                    {chapter.options[winningOption.option - 1]?.label}
                  </div>
                  <div className="text-sm text-[var(--foreground)]">
                    {chapter.options[winningOption.option - 1]?.text}
                  </div>
                  <div className="mt-3 text-xs text-[var(--accent)]">
                    {winningOption.count} {winningOption.count === 1 ? 'vote' : 'votes'}
                  </div>
                </div>

                {/* Hover tooltip with voters */}
                <div className="absolute left-0 right-0 top-full mt-2 p-4 bg-[var(--background)] border-2 border-[var(--primary)] rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="text-xs font-bold text-[var(--primary)] mb-2">
                    VOTERS ({winningOption.voters.length}):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {winningOption.voters.map((voter, idx) => (
                      <a
                        key={idx}
                        href={`https://x.com/${voter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-2 py-1 bg-[var(--background-secondary)] border border-[var(--shield-border)] rounded hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                      >
                        @{voter}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chapter metadata */}
          <div className="mt-6 flex justify-between items-center text-xs text-[var(--foreground-muted)]">
            <span>Posted {new Date(chapter.createdAt).toLocaleString()}</span>
            {isLatest && !isFinal && quest.status === 'ACTIVE' && quest.chapterDeadline && (
              <Countdown deadline={quest.chapterDeadline} />
            )}
          </div>
        </div>
      </div>

      {/* Historical Sources - Right Side */}
      {chapter.sources && chapter.sources.length > 0 && (
        <div className="w-80 flex-shrink-0">
          <div className="sticky top-4 p-4 border-2 border-[var(--accent)] rounded-lg bg-[var(--background)]">
            <div className="text-xs font-bold text-[var(--accent)] mb-4 pixel-font">
              📚 CONTEXT
            </div>
            <div className="space-y-4">
              {chapter.sources.map((source, idx) => (
                <div
                  key={idx}
                  className="border-l-2 border-[var(--accent)] pl-3"
                >
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent)] hover:underline text-xs font-bold block mb-1"
                  >
                    {source.title}
                  </a>
                  <div className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                    {source.relevantFact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuestStoryPage({
  params,
}: {
  params: Promise<{ shortId: string }>;
}) {
  const [quest, setQuest] = useState<Quest | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [shortId, setShortId] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      const resolvedParams = await params;
      setShortId(resolvedParams.shortId);

      const [questData, sessionData] = await Promise.all([
        getQuest(resolvedParams.shortId),
        getSession(),
      ]);

      if (!questData) {
        notFound();
      }

      setQuest(questData);
      setSession(sessionData);
      setLoading(false);
    }

    loadData();
  }, [params]);

  if (loading || !quest) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-[var(--primary)] pixel-font text-xl">Loading...</div>
      </div>
    );
  }

  const isCompleted = quest.status === "COMPLETED";

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[linear-gradient(var(--background-secondary)_1px,transparent_1px),linear-gradient(90deg,var(--background-secondary)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <div className="fixed top-1/4 left-1/4 h-96 w-96 rounded-full bg-[var(--primary)] opacity-10 blur-[120px]" />
      <div className="fixed bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[var(--accent)] opacity-10 blur-[120px]" />

      <div className="relative z-10 w-full px-4 py-12">
        {/* Two column layout */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
          {/* Left Sidebar - Games */}
          <div className="hidden lg:block">
            <div className="sticky top-20">
              <QuestSidebar />
            </div>
          </div>

          {/* Center Column - Story */}
          <div>
            {/* Header */}
            <div className="mb-8">
              <Link
                href="/"
                className="inline-block mb-4 text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors text-sm"
              >
                ← Back to Arena
              </Link>

              {quest.canonTitle && (
                <h1 className="pixel-font text-3xl md:text-5xl text-[var(--foreground)] mb-4 text-glow-primary">
                  📜 {quest.canonTitle.toUpperCase()}
                </h1>
              )}

              <div className="flex flex-wrap gap-4 items-center text-sm text-[var(--foreground-muted)]">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full ${
                      isCompleted
                        ? "bg-[var(--primary)] text-[var(--background)]"
                        : "bg-[var(--accent)] text-[var(--background)]"
                    }`}
                  >
                    {isCompleted ? "COMPLETED" : "ACTIVE"}
                  </span>
                  <span>Chapter {quest.currentChapter}/5</span>
                </div>
                <a
                  href={quest.tweetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--primary)] hover:underline"
                >
                  View Original Tweet →
                </a>
              </div>

              <div className="mt-4 p-4 border-2 border-[var(--shield-border)] rounded-lg bg-[var(--background-secondary)]">
                <div className="text-xs text-[var(--foreground-muted)] mb-2">
                  ORIGINAL TWEET
                </div>
                <div className="text-[var(--foreground)]">{quest.initialTweet}</div>
              </div>
            </div>

            {/* Active Chapter */}
            {quest.status === 'ACTIVE' && quest.chapters.length > 0 && (
              <div className="mb-8">
                {quest.chapters
                  .filter((ch) => ch.chapterNumber === quest.currentChapter)
                  .map((chapter) => (
                    <ChapterComponent
                      key={chapter.id}
                      chapter={chapter}
                      quest={quest}
                      isLatest={true}
                      isFinal={chapter.chapterNumber === 5}
                      session={session}
                    />
                  ))}
              </div>
            )}

            {/* Chapters - ordered by chapter number (oldest first) */}
            <div className="space-y-8">
              {quest.chapters
                .filter((ch) =>
                  quest.status === 'COMPLETED'
                    ? true
                    : ch.chapterNumber !== quest.currentChapter
                )
                .sort((a, b) => a.chapterNumber - b.chapterNumber)
                .map((chapter) => {
                  const isLatest = quest.status === 'COMPLETED' && chapter.chapterNumber === quest.currentChapter;
                  const isFinal = chapter.chapterNumber === 5;

                  return (
                    <ChapterComponent
                      key={chapter.id}
                      chapter={chapter}
                      quest={quest}
                      isLatest={isLatest}
                      isFinal={isFinal}
                      session={session}
                    />
                  );
                })}
            </div>

            {/* Footer */}
            {!isCompleted && (
              <div className="mt-8 p-6 border-2 border-[var(--accent)] rounded-lg bg-[var(--background-secondary)] text-center">
                <div className="text-[var(--accent)] font-bold mb-2">
                  TIMELINE IN PROGRESS
                </div>
                <div className="text-sm text-[var(--foreground-muted)]">
                  This quest is still active. Check back to see how the story
                  unfolds!
                </div>
                {quest.chapterDeadline && (
                  <div className="text-xs text-[var(--foreground-muted)] mt-2">
                    Next chapter deadline:{" "}
                    {new Date(quest.chapterDeadline).toLocaleString()}
                  </div>
                )}
              </div>
            )}

            {isCompleted && (
              <div className="mt-8 p-6 border-2 border-[var(--primary)] rounded-lg bg-[var(--background-secondary)] text-center">
                <div className="text-[var(--primary)] pixel-font text-xl mb-2">
                  THE TIMELINE HAS SPOKEN
                </div>
                <div className="text-sm text-[var(--foreground-muted)]">
                  This quest has concluded. The fate of this timeline is sealed.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
