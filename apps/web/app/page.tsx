import Link from "next/link";
import { Card, Button } from "@blackroad/ui";

const portals = [
  {
    emoji: "🏠",
    label: "Main Site",
    description: "The front door to BlackRoad OS",
    href: "https://blackroad.io",
    external: true,
  },
  {
    emoji: "💡",
    label: "Prism Console",
    description: "Live agent dashboard & metrics",
    href: "https://prism.blackroad.io",
    external: true,
  },
  {
    emoji: "💼",
    label: "RoadWork",
    description: "AI-powered job search & tracking",
    href: "https://roadwork.blackroad.io",
    external: true,
  },
  {
    emoji: "📖",
    label: "Docs",
    description: "Guides, API reference, and examples",
    href: "https://docs.blackroad.io",
    external: true,
  },
];

const workspaces = [
  { id: "alpha", name: "Alpha Deck" },
  { id: "beta", name: "Beta Console" },
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-bold mb-1">Welcome to BlackRoad OS</h1>
        <p className="text-white/60 text-sm mb-6">
          Open a portal below — no setup required.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {portals.map((portal) => (
            <Card key={portal.href} className="flex items-center justify-between">
              <div>
                <p className="text-lg leading-none mb-1">{portal.emoji}</p>
                <h2 className="text-base font-semibold">{portal.label}</h2>
                <p className="text-xs text-white/50 mt-0.5">{portal.description}</p>
              </div>
              <Button asChild>
                <a href={portal.href} target="_blank" rel="noopener noreferrer">
                  Open ↗
                </a>
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4 text-br-neon-glow uppercase tracking-[0.2em]">
          Workspaces
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {workspaces.map((workspace) => (
            <Card key={workspace.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm text-br-neon-glow uppercase tracking-[0.2em]">Workspace</p>
                <h2 className="text-lg font-semibold">{workspace.name}</h2>
              </div>
              <Button asChild>
                <Link href={`/workspace/${workspace.id}`}>Open</Link>
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
