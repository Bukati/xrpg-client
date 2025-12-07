import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[var(--background)]">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[linear-gradient(var(--background-secondary)_1px,transparent_1px),linear-gradient(90deg,var(--background-secondary)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <div className="fixed top-1/4 left-1/4 h-96 w-96 rounded-full bg-[var(--primary)] opacity-10 blur-[120px]" />
      <div className="fixed bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[var(--accent)] opacity-10 blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-block mb-8 text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors text-sm"
        >
          ← Back to Home
        </Link>

        <h1 className="pixel-font text-3xl md:text-4xl text-[var(--foreground)] mb-12 text-glow-primary text-center">
          WHAT IS xRPG?
        </h1>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Philosophy */}
          <div className="space-y-6">
            <h2 className="pixel-font text-xl text-[var(--accent)] mb-6">
              THE PHILOSOPHY
            </h2>

            <div className="p-6 border-2 border-[var(--accent)] rounded-lg bg-[var(--background-secondary)]">
              <p className="text-[var(--foreground)] text-xl font-bold mb-3">
                Critical thinking as a blood sport.
              </p>
              <p className="text-[var(--foreground-muted)] leading-relaxed">
                Pick an ideology. Watch history show you the receipts.
              </p>
            </div>

            <div className="p-6 border-2 border-[var(--shield-border)] rounded-lg bg-[var(--background-secondary)]">
              <p className="text-[var(--primary)] font-bold mb-4">
                What you'll learn:
              </p>
              <ul className="space-y-3 text-[var(--foreground)]">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--accent)]">→</span>
                  <span>Pure ideology is suicide</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--accent)]">→</span>
                  <span>Second-order effects are the only gods</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--accent)]">→</span>
                  <span>The "based" option is usually a trap</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--accent)]">→</span>
                  <span>History rhymes. Grok is the DJ.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 border-2 border-[var(--primary)] rounded-lg bg-[var(--primary)]/5">
              <p className="text-[var(--foreground-muted)] leading-relaxed">
                Play obsessively. Argue about it. <span className="text-[var(--primary)]">Accidentally get better at spotting bullshit.</span>
              </p>
            </div>
          </div>

          {/* Right Column - How to Play */}
          <div className="space-y-6">
            <h2 className="pixel-font text-xl text-[var(--primary)] mb-6">
              HOW TO PLAY
            </h2>

            {/* Step 1 */}
            <div className="p-5 border-2 border-[var(--shield-border)] rounded-lg bg-[var(--background-secondary)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--background)] font-bold pixel-font text-sm">
                  1
                </div>
                <h3 className="pixel-font text-base text-[var(--primary)]">TAG @xRPGBot</h3>
              </div>
              <p className="text-[var(--foreground-muted)] text-sm">
                Find a spicy tweet about politics, economics, or any controversial topic.
                Reply to it and tag <span className="text-[var(--accent)]">@xRPGBot</span> to start a quest.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 border-2 border-[var(--shield-border)] rounded-lg bg-[var(--background-secondary)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--background)] font-bold pixel-font text-sm">
                  2
                </div>
                <h3 className="pixel-font text-base text-[var(--primary)]">GROK BUILDS THE SCENARIO</h3>
              </div>
              <p className="text-[var(--foreground-muted)] text-sm">
                Grok analyzes the tweet and creates a branching "what-if" simulation based on real historical parallels.
                You become the decision-maker in a high-stakes scenario.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 border-2 border-[var(--shield-border)] rounded-lg bg-[var(--background-secondary)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--background)] font-bold pixel-font text-sm">
                  3
                </div>
                <h3 className="pixel-font text-base text-[var(--primary)]">COMMUNITY VOTES</h3>
              </div>
              <p className="text-[var(--foreground-muted)] text-sm">
                Each chapter presents two choices. Reply with <span className="text-[var(--accent)]">1</span> or <span className="text-[var(--accent)]">2</span> to vote.
                After 2 minutes, the winning choice shapes the next chapter of the story.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 border-2 border-[var(--shield-border)] rounded-lg bg-[var(--background-secondary)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--background)] font-bold pixel-font text-sm">
                  4
                </div>
                <h3 className="pixel-font text-base text-[var(--primary)]">5 CHAPTERS TO DESTINY</h3>
              </div>
              <p className="text-[var(--foreground-muted)] text-sm">
                The quest runs for 5 chapters. Each decision has consequences backed by real historical events.
                Watch the timeline unfold based on collective choices.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-5 border-2 border-[var(--accent)] rounded-lg bg-[var(--background-secondary)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-[var(--background)] font-bold pixel-font text-sm">
                  5
                </div>
                <h3 className="pixel-font text-base text-[var(--accent)]">FACE THE CONSEQUENCES</h3>
              </div>
              <p className="text-[var(--foreground-muted)] text-sm">
                At the end, see exactly where your choices led — backed by historical precedent.
                Good decisions survive. Bad ones get a history lesson.
              </p>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <a
                href="https://x.com/xRPGBot"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--primary)] text-[var(--background)] font-bold rounded-lg transition-all duration-300 hover:scale-105 glow-primary"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="pixel-font text-sm tracking-wide">FOLLOW @xRPGBot</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
