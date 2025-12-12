import { notFound } from "next/navigation";
import { WindowPane, Button } from "@blackroad/ui";
import Link from "next/link";

const workspaceMeta: Record<string, { title: string; summary: string }> = {
  alpha: { title: "Alpha Deck", summary: "Mission control for core agents." },
  beta: { title: "Beta Console", summary: "Testing bay for new docks." }
};

export default function WorkspacePage({ params }: { params: { id: string } }) {
  const meta = workspaceMeta[params.id];

  if (!meta) return notFound();

  return (
    <WindowPane title={meta.title} className="space-y-4">
      <p className="text-sm text-white/80">{meta.summary}</p>

      <div className="space-y-3">
        <div className="border border-br-neon-glow/30 rounded-lg p-4 bg-black/20">
          <h3 className="text-xs font-semibold text-br-neon-glow mb-2">Active Agents</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs p-2 bg-br-neon-accent/10 rounded">
              <span className="text-white/70">No agents running</span>
              <span className="text-white/50">0/10</span>
            </div>
          </div>
        </div>

        <div className="border border-br-neon-glow/30 rounded-lg p-4 bg-black/20 font-mono">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-br-neon-glow">Terminal</h3>
            <span className="text-[10px] text-white/40">blackroad-os v0.1.0</span>
          </div>
          <div className="bg-black rounded p-3 text-xs text-green-400">
            <div>$ blackroad-os status</div>
            <div className="text-white/50 mt-1">System ready. Waiting for commands...</div>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-br-neon-glow">$</span>
              <span className="animate-pulse">_</span>
            </div>
          </div>
        </div>
      </div>

      <Button asChild>
        <Link href="/">Back to chooser</Link>
      </Button>
    </WindowPane>
  );
}
