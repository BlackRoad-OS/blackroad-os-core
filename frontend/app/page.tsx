const featureHighlights = [
  {
    title: "Unified mission control",
    description:
      "Coordinate strategy, operations, and data in a single, resilient workspace built for distributed teams.",
  },
  {
    title: "Adaptive automation",
    description:
      "Automate repeatable playbooks, trigger responses, and keep humans in the loop with clear governance.",
  },
  {
    title: "Operational intelligence",
    description:
      "Stream insights from every system into live dashboards so you can see, predict, and act faster.",
  },
];

const capabilityTracks = [
  {
    label: "Integrations",
    items: [
      "Streaming data connectors",
      "Secure service mesh",
      "Multi-cloud ready",
    ],
  },
  {
    label: "Reliability",
    items: [
      "Health and dependency maps",
      "Automated runbooks",
      "Disaster recovery defaults",
    ],
  },
  {
    label: "Collaboration",
    items: [
      "Shared situational rooms",
      "Role-based controls",
      "Executive-ready reporting",
    ],
  },
];

const milestones = [
  {
    title: "Connect your universe",
    description:
      "Plug in the systems that matter most and establish a unified source of operational truth in minutes.",
  },
  {
    title: "Codify decisions",
    description:
      "Turn expert judgment into guardrailed automations that activate the right people at the right time.",
  },
  {
    title: "Stay always-on",
    description:
      "Run with confidence using adaptive controls, live observability, and safety-first defaults you can trust.",
  },
];

const testimonials = [
  {
    quote:
      "BlackRoad OS helps us orchestrate complex responses while keeping leadership aligned. It's the nerve center we needed.",
    name: "Elena Torres",
    role: "Director of Reliability, Meridian Labs",
  },
  {
    quote:
      "The automation guardrails reduced our incident time-to-resolution by nearly half without sacrificing oversight.",
    name: "Ravi Narayanan",
    role: "VP Engineering, Eastward Systems",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.08),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(248,113,113,0.06),transparent_30%),radial-gradient(circle_at_50%_60%,rgba(94,234,212,0.08),transparent_30%)]" />
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-10 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-lg shadow-blue-700/30">
            <span className="text-lg font-bold tracking-tight text-white">BR</span>
          </div>
          <div>
            <p className="text-lg font-semibold text-white">BlackRoad OS</p>
            <p className="text-sm text-slate-400">Operational intelligence for decisive teams</p>
          </div>
        </div>
        <div className="hidden items-center gap-3 text-sm font-medium text-slate-200 sm:flex">
          <a href="#features" className="transition hover:text-white">
            Platform
          </a>
          <a href="#milestones" className="transition hover:text-white">
            How it works
          </a>
          <a href="#stories" className="transition hover:text-white">
            Stories
          </a>
          <button className="rounded-full border border-slate-700/70 px-4 py-2 transition hover:border-cyan-400/70 hover:text-white">
            Talk to us
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-20 lg:px-12">
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-900/10 ring-1 ring-white/10 backdrop-blur">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-cyan-200">
                Built for resilience
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Keep your mission running with a command center designed for complexity.
              </h1>
              <p className="text-lg text-slate-300">
                BlackRoad OS fuses your data, workflows, and people into a coordinated operating system so you can move from
                reactive to ready.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#features"
                  className="rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-900/30 transition hover:scale-[1.01]"
                >
                  Explore the platform
                </a>
                <a
                  href="#stories"
                  className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/50 hover:text-cyan-100"
                >
                  See what teams achieve
                </a>
              </div>
              <div className="grid grid-cols-1 gap-4 text-sm text-slate-300 sm:grid-cols-3">
                {[
                  { label: "99.95% uptime", detail: "hardened by design" },
                  { label: "<15 min", detail: "to actionable insights" },
                  { label: "Global", detail: "built for distributed teams" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                    <p className="text-base font-semibold text-white">{stat.label}</p>
                    <p className="text-slate-400">{stat.detail}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative w-full max-w-md self-start rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl shadow-cyan-900/20 ring-1 ring-white/10">
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-cyan-500/20 via-transparent to-indigo-600/20 blur-3xl" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">Live ops signal</h2>
              <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-slate-950/60 p-4 text-sm ring-1 ring-white/10">
                {[
                  { label: "Sensors", value: "642 active" },
                  { label: "Automations", value: "37 playbooks" },
                  { label: "Response teams", value: "12 on-call" },
                  { label: "Latency", value: "89ms" },
                  { label: "Risk surface", value: "LOW" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600" />
                      <p className="text-slate-200">{item.label}</p>
                    </div>
                    <p className="font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-gradient-to-r from-emerald-400/10 via-cyan-400/10 to-blue-500/10 p-4 ring-1 ring-cyan-500/30">
                <p className="text-xs uppercase tracking-[0.15em] text-cyan-200">Next move</p>
                <p className="mt-2 text-sm text-slate-200">Deploy adaptive defense playbook to APAC edge sites.</p>
                <button className="mt-4 w-full rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                  Execute with safeguards
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-blue-900/10 ring-1 ring-white/10 backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">Platform pillars</p>
              <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">All the signal. None of the noise.</h2>
              <p className="mt-3 max-w-2xl text-lg text-slate-300">
                Translate live telemetry into confident action. BlackRoad OS balances automation with oversight, giving your teams the clarity to move together.
              </p>
            </div>
            <a className="text-sm font-semibold text-cyan-200 transition hover:text-white" href="#stories">
              Read field stories →
            </a>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featureHighlights.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-slate-950/40 p-6 shadow-lg ring-1 ring-white/10 transition hover:-translate-y-1 hover:border-cyan-400/40"
              >
                <div className="absolute inset-x-0 -top-20 h-40 bg-gradient-to-b from-cyan-500/20 to-transparent blur-2xl transition duration-500 group-hover:translate-y-6" />
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950">
                  <span className="text-lg font-bold">{feature.title.slice(0, 1)}</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-6 rounded-2xl border border-white/5 bg-slate-950/40 p-6 ring-1 ring-white/10 md:grid-cols-3">
            {capabilityTracks.map((capability) => (
              <div key={capability.label} className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-cyan-200">{capability.label}</p>
                <ul className="space-y-3 text-slate-200">
                  {capability.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="milestones" className="grid gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-blue-950/50 p-8 shadow-2xl shadow-blue-900/10 ring-1 ring-white/10">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">How it works</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">From intake to action in three moves.</h2>
            <p className="max-w-3xl text-lg text-slate-300">
              Bring every signal together, codify how your teams respond, and keep everything measurable.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.title}
                className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-6 ring-1 ring-white/10"
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/5 blur-2xl" />
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-lg font-bold text-cyan-200">
                  0{index + 1}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">{milestone.title}</h3>
                <p className="mt-2 text-slate-300">{milestone.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="stories" className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-900/10 ring-1 ring-white/10">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">Field stories</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">Built for leaders who protect what matters.</h2>
            <p className="max-w-3xl text-lg text-slate-300">
              See how teams keep critical services available, informed, and ready for anything.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-400/10 via-blue-500/5 to-indigo-600/5 p-6 ring-1 ring-cyan-300/20">
              <div className="flex items-center justify-between text-sm text-cyan-100">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Always-on defense
                </span>
                <span className="text-slate-200">Global operations</span>
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-white">Coordinating critical responses across 14 regions</h3>
              <p className="mt-3 text-slate-200">
                A distributed engineering org used BlackRoad OS to consolidate telemetry, orchestrate automated mitigations, and keep executives synced. Incident resolution times dropped 42% while compliance reporting became automatic.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Signal coverage", value: "+63%" },
                  { label: "Time to act", value: "-18 min" },
                  { label: "Confidence", value: "Tier-1 ready" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-white/10 p-3 text-sm">
                    <p className="text-slate-200">{stat.label}</p>
                    <p className="text-lg font-semibold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
              <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/90 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white">
                View the playbook
                <span aria-hidden className="text-lg">→</span>
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 shadow-lg ring-1 ring-white/10"
                >
                  <p className="text-lg text-slate-100">“{testimonial.quote}”</p>
                  <p className="mt-3 text-sm font-semibold text-cyan-100">{testimonial.name}</p>
                  <p className="text-sm text-slate-400">{testimonial.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-600/30 via-cyan-500/40 to-emerald-400/30 p-[1px] shadow-2xl shadow-cyan-900/20">
          <div className="flex flex-col items-center gap-4 rounded-3xl bg-slate-950/60 px-8 py-12 text-center ring-1 ring-white/10">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-100">Ready to move</p>
            <h2 className="max-w-3xl text-3xl font-semibold text-white sm:text-4xl">Build your mission-ready operating system.</h2>
            <p className="max-w-2xl text-lg text-slate-200">
              Launch with a guided pilot or bring your own stack. We’ll help you design resilient workflows that keep everyone aligned when the stakes are highest.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-[1px]">
                Start a pilot
              </button>
              <button className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white">
                Download the blueprint
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
