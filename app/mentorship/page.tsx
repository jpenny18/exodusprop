// app/mentorship/page.tsx

export default function MentorshipLandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Navbar (very minimal on purpose) */}
      <header className="border-b border-slate-800/70 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 shadow-md shadow-amber-500/40" />
            <div className="leading-tight">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-400">
                Ascendant Academy
              </p>
              <p className="text-sm font-semibold text-slate-100">
                Flip Blueprint Mentorship
              </p>
            </div>
          </div>
          <a
            href="#apply"
            className="rounded-full border border-amber-400/60 bg-amber-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300 transition hover:bg-amber-400/20"
          >
            Apply for a call
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-10">
        {/* HERO */}
        <section className="grid gap-10 lg:grid-cols-[1.4fr,1fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-slate-900/80 px-3 py-1 text-xs text-amber-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              8-Week 1:1 Mentorship • Limited spots
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
              Learn to{" "}
              <span className="bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                read the charts like me
              </span>{" "}
              in 8 weeks — watching me trade live, 5 days a week.
            </h1>

            <p className="mt-5 max-w-xl text-sm text-slate-300 sm:text-base">
              Skip the 50-hour course grind. This mentorship is built to take
              you from confused beginner to confidently reading the market using
              the exact framework I use on my own live accounts — with weekly
              1:1 coaching and live trading sessions.
            </p>

            {/* Trust bullets */}
            <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-amber-300">
                  ★
                </span>
                <span>Verified broker statements & account flips</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-amber-300">
                  ⬆
                </span>
                <span>Live markets, real-time decision making</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-amber-300">
                  👤
                </span>
                <span>Weekly 30-min 1:1 calls with me</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#apply"
                className="inline-flex items-center justify-center rounded-full bg-amber-400 px-7 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/40 transition hover:bg-amber-300"
              >
                Apply for the 8-Week Mentorship
              </a>
              <a
                href="#track-record"
                className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400 hover:text-amber-200"
              >
                View my track record ↓
              </a>
            </div>

            <p className="mt-4 text-[11px] text-slate-500 max-w-md">
              Disclaimer: Nothing here is financial advice and no results are
              guaranteed. Trading involves risk. This mentorship focuses on
              teaching analysis, risk management, and execution process — not
              promising specific returns.
            </p>
          </div>

          {/* Right side: "Proof" card */}
          <div className="space-y-4 lg:space-y-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-[0_0_35px_rgba(15,23,42,0.9)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Snapshot: Live Trading Performance
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
                <div className="rounded-xl bg-slate-950/80 px-3 py-3 border border-slate-800/80">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    Win Rate*
                  </p>
                  <p className="mt-2 text-lg font-semibold text-emerald-400">
                    61%
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500">Last 6 months</p>
                </div>
                <div className="rounded-xl bg-slate-950/80 px-3 py-3 border border-slate-800/80">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    R:R Focus
                  </p>
                  <p className="mt-2 text-lg font-semibold text-amber-300">
                    2.3R
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500">Avg. per trade*</p>
                </div>
                <div className="rounded-xl bg-slate-950/80 px-3 py-3 border border-slate-800/80">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    Flip Examples
                  </p>
                  <p className="mt-2 text-lg font-semibold text-sky-300">
                    $300 → $3k
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500">Documented</p>
                </div>
              </div>
              <p className="mt-4 text-[10px] text-slate-500">
                *Statistics based on my own live accounts over a rolling period.
                Individual results vary and depend on execution, discipline, and
                risk.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                What you&apos;ll get:
              </p>
              <ul className="mt-3 space-y-2 text-xs text-slate-200">
                <li>✅ Weekly 30-minute 1:1 call with me (8 weeks)</li>
                <li>✅ 5×/week live trading sessions</li>
                <li>✅ 2 months of my live trade ideas & livestreams included</li>
                <li>✅ Simple, beginner-friendly chart & Discord setup</li>
                <li>✅ My exact process to read structure, levels & entries</li>
              </ul>
            </div>
          </div>
        </section>

        {/* TRACK RECORD / PROOF */}
        <section id="track-record" className="mt-16 border-t border-slate-900 pt-12">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-50 sm:text-2xl">
                Track record & verified case studies
              </h2>
              <p className="mt-2 max-w-xl text-sm text-slate-300">
                Before you book a call, you should know I&apos;m not teaching
                theory. Below are real examples of account flips, funded payouts,
                and live accounts. On the call, you can ask about any of these in
                detail.
              </p>
            </div>
          </div>

          {/* Broker statements / screenshots */}
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {/* Card 1 */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="aspect-[4/3] rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-center text-xs text-slate-600">
                {/* Replace these with actual broker statement images */}
                Broker Statement Screenshot #1
              </div>
              <div className="mt-3 text-xs text-slate-200">
                <p className="font-semibold">Case Study: $300 → $3,000</p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Small account flip documented step-by-step. You&apos;ll see
                  entries, exits, and journal notes, not just the ending balance.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="aspect-[4/3] rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-center text-xs text-slate-600">
                Funded Payout Proof Screenshot
              </div>
              <div className="mt-3 text-xs text-slate-200">
                <p className="font-semibold">Case Study: Prop Payouts</p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Multiple funded payouts with clear risk rules and position sizing
                  — the same risk logic I walk you through inside the mentorship.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="aspect-[4/3] rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-center text-xs text-slate-600">
                Live Equity Curve Screenshot
              </div>
              <div className="mt-3 text-xs text-slate-200">
                <p className="font-semibold">Case Study: 6-Month Journal</p>
                <p className="mt-1 text-[11px] text-slate-400">
                  A transparent view of wins, losses, break-evens, and drawdowns —
                  so you understand the real path, not just the highlights.
                </p>
              </div>
            </div>
          </div>

          {/* Social proof / testimonials */}
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-200">
              <p className="text-[11px] uppercase tracking-[0.18em] text-amber-300">
                Student Story
              </p>
              <p className="mt-2 text-[13px]">
                &quot;I knew nothing about MT5 or TradingView when I started. In
                6 weeks I was calling out levels in the Discord that actually
                lined up with Josh&apos;s charts.&quot;
              </p>
              <p className="mt-3 text-[11px] text-slate-500">— M., Mentorship Member</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-200">
              <p className="text-[11px] uppercase tracking-[0.18em] text-amber-300">
                Student Story
              </p>
              <p className="mt-2 text-[13px]">
                &quot;The weekly 1:1 calls kept me from doing dumb stuff. I
                finally understood why I was losing trades instead of just taking
                more.&quot;
              </p>
              <p className="mt-3 text-[11px] text-slate-500">— A., Mentorship Member</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-200">
              <p className="text-[11px] uppercase tracking-[0.18em] text-amber-300">
                Community
              </p>
              <p className="mt-2 text-[13px]">
                &quot;Watching the live sessions every morning has literally
                replaced scrolling TikTok. I just follow along and ask questions
                when I&apos;m lost.&quot;
              </p>
              <p className="mt-3 text-[11px] text-slate-500">— K., Discord Member</p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mt-16 border-t border-slate-900 pt-12">
          <h2 className="text-xl font-semibold text-slate-50 sm:text-2xl">
            How the 8-Week Mentorship works
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            No fluff, no massive course library. Just structured, repeatable
            mentorship focused on helping you actually read the charts and manage
            risk — not chase signals.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="relative rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="absolute -top-3 left-4 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-semibold text-slate-950">
                Step 1
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-50">
                Book your call & get pre-qualified
              </p>
              <p className="mt-2 text-xs text-slate-300">
                Fill out a short application, then we&apos;ll hop on a call to make
                sure this fits your goals, schedule, and risk tolerance.
              </p>
            </div>

            <div className="relative rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="absolute -top-3 left-4 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-semibold text-slate-950">
                Step 2
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-50">
                We set up your tools & framework
              </p>
              <p className="mt-2 text-xs text-slate-300">
                We get your Discord, TradingView/MT5, and journal structured.
                Then I walk you through how I mark structure, key levels, and
                high-probability zones.
              </p>
            </div>

            <div className="relative rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="absolute -top-3 left-4 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-semibold text-slate-950">
                Step 3
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-50">
                8 weeks of live markets & 1:1 coaching
              </p>
              <p className="mt-2 text-xs text-slate-300">
                You join my live sessions 5× per week, plus a dedicated 1:1 call
                each week. You&apos;ll submit charts and questions, and we&apos;ll fix
                mistakes in real time.
              </p>
            </div>
          </div>
        </section>

        {/* OFFER / PRICING HIGHLIGHT */}
        <section className="mt-16 border-t border-slate-900 pt-12">
          <div className="grid gap-8 lg:grid-cols-[1.2fr,1fr] lg:items-center">
            <div>
              <h2 className="text-xl font-semibold text-slate-50 sm:text-2xl">
                What&apos;s included inside the mentorship
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                This isn&apos;t a signal service. It&apos;s a mentorship designed to
                help you think like a trader — process, not predictions.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <ul className="space-y-2 text-xs text-slate-200">
                  <li>• 8× weekly 30-min 1:1 coaching calls</li>
                  <li>• 5×/week live trading sessions with me</li>
                  <li>• 2 months free access to my live streams & trade ideas</li>
                  <li>• Beginner setup: Discord, TradingView/MT5, and journaling</li>
                </ul>
                <ul className="space-y-2 text-xs text-slate-200">
                  <li>• My risk management approach & drawdown rules</li>
                  <li>• How I filter trades vs. forcing entries</li>
                  <li>• Feedback on your charts, not just mine</li>
                  <li>• Access to a private Discord channel for mentees</li>
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-400/60 bg-slate-950 p-6 shadow-[0_0_40px_rgba(251,191,36,0.35)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                Investment
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-50">
                $1,495 <span className="text-base font-normal text-slate-400">one-time</span>
              </p>
              <p className="mt-1 text-xs text-slate-400">
                8-Week 1:1 Mentorship • 2 months of live streams included
              </p>

              <div className="mt-4 rounded-xl bg-slate-900/80 p-3 text-xs text-slate-200">
                <p className="font-semibold">After the mentorship:</p>
                <p className="mt-1 text-[11px] text-slate-300">
                  Continue in the community, live streams, and trade idea flow for{" "}
                  <span className="font-semibold text-amber-300">$99/month</span>{" "}
                  after your first 2 free months.
                </p>
              </div>

              <a
                href="#apply"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
              >
                Apply for a call
              </a>

              <p className="mt-3 text-[11px] text-slate-500">
                No guarantees, no "get rich quick". On the call, we&apos;ll see if
                your expectations, financial situation, and risk tolerance make
                this a fit before you ever pay.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16 border-t border-slate-900 pt-12">
          <h2 className="text-xl font-semibold text-slate-50 sm:text-2xl">
            Common questions
          </h2>

          <div className="mt-6 space-y-5 text-sm">
            <div>
              <p className="font-medium text-slate-100">
                Do you guarantee I&apos;ll be profitable?
              </p>
              <p className="mt-1 text-xs text-slate-300">
                No. Nobody can guarantee that. What I can do is show you exactly
                how I analyze markets, manage risk, and review trades. You&apos;ll
                get live access to how I think, but your results depend on your
                discipline and execution.
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-100">
                I&apos;m a total beginner. Is this still for me?
              </p>
              <p className="mt-1 text-xs text-slate-300">
                Yes — we start with the basics: setting up your platforms,
                understanding candles, and reading structure. You don&apos;t need
                previous experience, but you do need the time and focus to show up.
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-100">
                What if I can&apos;t attend every live session?
              </p>
              <p className="mt-1 text-xs text-slate-300">
                Live is best, but you&apos;ll still have your 1:1 weekly call to go
                over missed sessions and recap the market using your own charts.
              </p>
            </div>
          </div>
        </section>

        {/* APPLY / CALENDAR */}
        <section
          id="apply"
          className="mt-16 border-t border-slate-900 pt-12 pb-6"
        >
          <div className="grid gap-8 lg:grid-cols-[1.1fr,1fr] lg:items-start">
            <div>
              <h2 className="text-xl font-semibold text-slate-50 sm:text-2xl">
                Apply for a free 15-minute clarity call
              </h2>
              <p className="mt-2 max-w-xl text-sm text-slate-300">
                No hard pitch. We&apos;ll look at where you&apos;re at, what
                you&apos;ve tried, and whether the 8-week mentorship makes sense
                for you right now.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-slate-200">
                <li>• We review your current experience and schedule</li>
                <li>• I show you how the mentorship would plug into your life</li>
                <li>• You can ask anything about my track record & case studies</li>
                <li>• If it&apos;s not a fit, I&apos;ll tell you straight up</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Book your time
              </p>
              <p className="mt-2 text-xs text-slate-300">
                Pick a time below and fill out the short application form.
              </p>

              <div className="mt-4 h-[380px] overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80 flex items-center justify-center">
                {/* Replace src with your Calendly / SavvyCal / TidyCal embed */}
                <p className="text-slate-600 text-sm">Calendar booking widget goes here</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-10 border-t border-slate-900 pt-6 text-[10px] text-slate-500">
          <p>
            © {new Date().getFullYear()} Ascendant Academy / Shockwave Capital. For
            educational purposes only. No financial advice. Trading involves risk
            and may not be suitable for all investors.
          </p>
        </footer>
      </main>
    </div>
  );
}

