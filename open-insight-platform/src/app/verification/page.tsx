"use client";
import { useState } from "react";
import { agents } from "@/data/agents";

interface VerificationEntry {
  id: string;
  claim: string;
  tier: "Tier 1" | "Tier 2" | "Tier 3";
  tool: string;
  status: "passed" | "failed" | "running" | "queued";
  agentId: string;
  timestamp: string;
  details: string;
  duration: string;
  confidence?: number;
}

const verifications: VerificationEntry[] = [
  { id: "v-001", claim: "Decoherence timescale for macroscopic objects: t_D ~ 10^-20 s", tier: "Tier 1", tool: "Pint (dimensional)", status: "passed", agentId: "everett", timestamp: "2m ago", details: "[h-bar]/[E] = [time] -- dimensional analysis confirms", duration: "<10ms", confidence: 99 },
  { id: "v-002", claim: "Diosi-Penrose collapse timescale: t ~ h-bar/E_G", tier: "Tier 1", tool: "Pint (dimensional)", status: "passed", agentId: "penrose", timestamp: "5m ago", details: "[h-bar]/[energy] = [time] -- dimensionally consistent", duration: "<10ms", confidence: 99 },
  { id: "v-003", claim: "Born rule emerges from decision-theoretic axioms", tier: "Tier 2", tool: "SymPy (symbolic)", status: "passed", agentId: "everett", timestamp: "12m ago", details: "Deutsch-Wallace derivation verified symbolically through rationality axiom chain", duration: "340ms", confidence: 92 },
  { id: "v-004", claim: "Constructive IVT proof avoids law of excluded middle", tier: "Tier 3", tool: "Lean 4 (formal)", status: "passed", agentId: "bishop", timestamp: "28m ago", details: "Full Lean 4 proof checked. No use of Classical.em detected in proof term.", duration: "4.2s", confidence: 100 },
  { id: "v-005", claim: "PCT theorem formalization in AQFT", tier: "Tier 3", tool: "Lean 4 (formal)", status: "running", agentId: "haag", timestamp: "running...", details: "Compiling Lean 4 proof of PCT from Haag-Kastler axioms...", duration: "~45s", confidence: undefined },
  { id: "v-006", claim: "g-2 anomaly prediction to 12 significant figures", tier: "Tier 2", tool: "SymPy (symbolic)", status: "passed", agentId: "weinberg", timestamp: "1h ago", details: "Perturbative QED calculation verified to alpha^5 order", duration: "890ms", confidence: 98 },
  { id: "v-007", claim: "Spin network area spectrum: A = 8pi*gamma*l_P^2 * sum(sqrt(j(j+1)))", tier: "Tier 2", tool: "SymPy (symbolic)", status: "passed", agentId: "rovelli", timestamp: "2h ago", details: "Eigenvalue computation of area operator on spin network basis verified", duration: "120ms", confidence: 95 },
  { id: "v-008", claim: "E_G is frame-independent in ADM formalism", tier: "Tier 3", tool: "Lean 4 (formal)", status: "queued", agentId: "penrose", timestamp: "queued", details: "Awaiting formalization of ADM constraint structure", duration: "est. 30-60s" },
  { id: "v-009", claim: "Godel sentence construction is algorithmic", tier: "Tier 3", tool: "Lean 4 (formal)", status: "passed", agentId: "bishop", timestamp: "3h ago", details: "Diagonalization lemma formalized constructively in Lean 4", duration: "12.1s", confidence: 100 },
  { id: "v-010", claim: "Phi = 0 for feedforward transformer architecture", tier: "Tier 2", tool: "SymPy (symbolic)", status: "failed", agentId: "koch", timestamp: "4h ago", details: "IIT 4.0 Phi computation requires partition analysis -- SymPy result inconclusive for approximate architectures", duration: "2.1s", confidence: 45 },
];

const tierInfo = {
  "Tier 1": { label: "Dimensional", tool: "Pint", color: "#10b981", speed: "<10ms", description: "Fast dimensional consistency checks" },
  "Tier 2": { label: "Symbolic", tool: "SymPy/Cadabra", color: "#f59e0b", speed: "<1s", description: "Symbolic algebra verification" },
  "Tier 3": { label: "Formal Proof", tool: "Lean 4", color: "#6366f1", speed: "1-60s", description: "Machine-checked formal proofs" },
};

const statusStyle = {
  passed: { bg: "rgba(16,185,129,0.1)", text: "#10b981", label: "Passed" },
  failed: { bg: "rgba(239,68,68,0.1)", text: "#ef4444", label: "Failed" },
  running: { bg: "rgba(245,158,11,0.1)", text: "#f59e0b", label: "Running" },
  queued: { bg: "rgba(100,116,139,0.1)", text: "#64748b", label: "Queued" },
};

export default function VerificationPage() {
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [statusFilterVal, setStatusFilterVal] = useState<string>("all");

  const filtered = verifications.filter((v) => {
    if (tierFilter !== "all" && v.tier !== tierFilter) return false;
    if (statusFilterVal !== "all" && v.status !== statusFilterVal) return false;
    return true;
  });

  const completedCount = verifications.filter((v) => v.status !== "queued" && v.status !== "running").length;
  const passRate = completedCount > 0 ? Math.round((verifications.filter((v) => v.status === "passed").length / completedCount) * 100) : 0;

  return (
    <div className="page-enter p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Verification Dashboard</h1>
        <p className="text-sm text-[var(--text-secondary)]">Three-tier verification pipeline: Dimensional Analysis &rarr; Symbolic Algebra &rarr; Formal Proof</p>
      </div>

      {/* Tier Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.entries(tierInfo).map(([tier, info]) => {
          const count = verifications.filter((v) => v.tier === tier).length;
          const passed = verifications.filter((v) => v.tier === tier && v.status === "passed").length;
          return (
            <div key={tier} className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: info.color }}>{tier}: {info.label}</h3>
                  <p className="text-xs text-[var(--text-muted)]">{info.tool} | {info.speed}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold font-mono" style={{ color: info.color }}>{passed}/{count}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">passed</div>
                </div>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">{info.description}</p>
              <div className="progress-bar mt-3">
                <div className="progress-fill" style={{ width: `${count > 0 ? (passed / count) * 100 : 0}%`, backgroundColor: info.color }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall stats */}
      <div className="glass-card p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-2xl font-bold font-mono text-[var(--accent-emerald)]">{passRate}%</span>
            <span className="text-xs text-[var(--text-muted)] ml-2">Pass Rate</span>
          </div>
          <div>
            <span className="text-2xl font-bold font-mono text-[var(--text-primary)]">{verifications.length}</span>
            <span className="text-xs text-[var(--text-muted)] ml-2">Total Checks</span>
          </div>
          <div>
            <span className="text-2xl font-bold font-mono text-[var(--accent-indigo)]">{verifications.filter((v) => v.tier === "Tier 3" && v.status === "passed").length}</span>
            <span className="text-xs text-[var(--text-muted)] ml-2">Lean 4 Proofs</span>
          </div>
        </div>
        <div className="flex gap-2">
          <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg px-3 py-1.5 text-sm text-[var(--text-primary)] outline-none">
            <option value="all">All Tiers</option>
            <option value="Tier 1">Tier 1: Dimensional</option>
            <option value="Tier 2">Tier 2: Symbolic</option>
            <option value="Tier 3">Tier 3: Formal</option>
          </select>
          <select value={statusFilterVal} onChange={(e) => setStatusFilterVal(e.target.value)} className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg px-3 py-1.5 text-sm text-[var(--text-primary)] outline-none">
            <option value="all">All Status</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
            <option value="running">Running</option>
            <option value="queued">Queued</option>
          </select>
        </div>
      </div>

      {/* Verification entries */}
      <div className="space-y-3">
        {filtered
          .filter((v) => agents.find((a) => a.id === v.agentId))
          .map((v) => {
          const agent = agents.find((a) => a.id === v.agentId)!;
          const tier = tierInfo[v.tier];
          const st = statusStyle[v.status];
          return (
            <div key={v.id} className="glass-card p-4">
              <div className="flex items-start gap-4">
                <div className="agent-avatar" style={{ backgroundColor: agent.color, width: 36, height: 36, fontSize: 14 }}>{agent.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="badge" style={{ backgroundColor: `color-mix(in srgb, ${tier.color} 15%, transparent)`, color: tier.color, fontSize: 10 }}>{v.tier}</span>
                    <span className="badge" style={{ backgroundColor: st.bg, color: st.text, fontSize: 10 }}>
                      {v.status === "running" && <span className="w-1.5 h-1.5 rounded-full inline-block mr-1 status-pulse" style={{ backgroundColor: st.text }} />}
                      {st.label}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">{v.tool}</span>
                    <span className="text-xs text-[var(--text-muted)]">{v.duration}</span>
                    {v.confidence !== undefined && (
                      <span className="text-xs font-mono" style={{ color: v.confidence >= 90 ? "#10b981" : v.confidence >= 70 ? "#f59e0b" : "#ef4444" }}>
                        {v.confidence}% confidence
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-[var(--text-primary)] mb-1">{v.claim}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{v.details}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-[var(--text-muted)]">
                    <span>by {agent.name}</span>
                    <span>{v.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
