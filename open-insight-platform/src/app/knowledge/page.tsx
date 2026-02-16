"use client";
import { useState, useRef, useEffect } from "react";
import { agents, domainColors, polarPairs } from "@/data/agents";

interface GraphNode {
  id: string;
  label: string;
  type: "agent" | "domain" | "concept" | "theorem";
  color: string;
  x: number;
  y: number;
  radius: number;
}

interface GraphEdge {
  source: string;
  target: string;
  type: "polar" | "domain" | "cites" | "verifies";
  label?: string;
}

const concepts: { id: string; label: string; domain: string }[] = [
  { id: "c-decoherence", label: "Decoherence", domain: "Quantum Foundations" },
  { id: "c-born-rule", label: "Born Rule", domain: "Quantum Foundations" },
  { id: "c-measurement", label: "Measurement Problem", domain: "Quantum Foundations" },
  { id: "c-spin-networks", label: "Spin Networks", domain: "Quantum Gravity" },
  { id: "c-ads-cft", label: "AdS/CFT", domain: "Quantum Gravity" },
  { id: "c-renormalization", label: "Renormalization", domain: "Quantum Field Theory" },
  { id: "c-symmetry-breaking", label: "Symmetry Breaking", domain: "Quantum Field Theory" },
  { id: "c-incompleteness", label: "Incompleteness", domain: "Foundations of Mathematics" },
  { id: "c-type-theory", label: "Type Theory", domain: "Foundations of Mathematics" },
  { id: "c-hard-problem", label: "Hard Problem", domain: "Philosophy of Mind" },
  { id: "c-iit", label: "IIT (Phi)", domain: "Philosophy of Mind" },
  { id: "c-lean4", label: "Lean 4", domain: "Foundations of Mathematics" },
  { id: "c-background-indep", label: "Background Independence", domain: "Quantum Gravity" },
  { id: "c-path-integral", label: "Path Integral", domain: "Quantum Field Theory" },
];

export default function KnowledgePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<GraphNode[]>([]);
  const edgesRef = useRef<GraphEdge[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      ctx.scale(2, 2);
    };
    resize();

    const w = canvas.width / 2;
    const h = canvas.height / 2;
    const cx = w / 2;
    const cy = h / 2;

    // Create nodes
    const nodes: GraphNode[] = [];

    // Domain nodes in center ring
    const domains = Object.keys(domainColors);
    domains.forEach((domain, i) => {
      const angle = (i / domains.length) * Math.PI * 2 - Math.PI / 2;
      nodes.push({
        id: `d-${domain}`,
        label: domain,
        type: "domain",
        color: domainColors[domain],
        x: cx + Math.cos(angle) * 120,
        y: cy + Math.sin(angle) * 120,
        radius: 18,
      });
    });

    // Agent nodes
    agents.forEach((agent) => {
      const domainNode = nodes.find((n) => n.id === `d-${agent.domain}`);
      if (domainNode) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 60 + Math.random() * 40;
        nodes.push({
          id: agent.id,
          label: agent.name,
          type: "agent",
          color: agent.color,
          x: domainNode.x + Math.cos(angle) * dist,
          y: domainNode.y + Math.sin(angle) * dist,
          radius: 12,
        });
      }
    });

    // Concept nodes
    concepts.forEach((concept) => {
      const domainNode = nodes.find((n) => n.id === `d-${concept.domain}`);
      if (domainNode) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 80 + Math.random() * 50;
        nodes.push({
          id: concept.id,
          label: concept.label,
          type: "concept",
          color: domainColors[concept.domain] || "#64748b",
          x: domainNode.x + Math.cos(angle) * dist,
          y: domainNode.y + Math.sin(angle) * dist,
          radius: 8,
        });
      }
    });

    // Create edges
    const edges: GraphEdge[] = [];

    // Agent-domain edges
    agents.forEach((agent) => {
      edges.push({ source: agent.id, target: `d-${agent.domain}`, type: "domain" });
    });

    // Polar edges
    polarPairs.forEach((pair) => {
      edges.push({ source: pair.agents[0], target: pair.agents[1], type: "polar", label: pair.tension });
    });

    // Concept-domain edges
    concepts.forEach((concept) => {
      edges.push({ source: concept.id, target: `d-${concept.domain}`, type: "cites" });
    });

    // Cross-domain edges
    edges.push({ source: "c-type-theory", target: "c-measurement", type: "cites" });
    edges.push({ source: "c-iit", target: "c-decoherence", type: "cites" });
    edges.push({ source: "c-incompleteness", target: "c-hard-problem", type: "cites" });
    edges.push({ source: "c-spin-networks", target: "c-background-indep", type: "verifies" });
    edges.push({ source: "c-path-integral", target: "c-renormalization", type: "verifies" });

    nodesRef.current = nodes;
    edgesRef.current = edges;

    const draw = () => {
      timeRef.current += 0.005;
      const t = timeRef.current;
      const dw = canvas.width / 2;
      const dh = canvas.height / 2;

      ctx.clearRect(0, 0, dw, dh);

      // Draw edges
      edges.forEach((edge) => {
        const src = nodes.find((n) => n.id === edge.source);
        const tgt = nodes.find((n) => n.id === edge.target);
        if (!src || !tgt) return;

        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);

        if (edge.type === "polar") {
          ctx.strokeStyle = "rgba(245, 158, 11, 0.3)";
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 4]);
        } else if (edge.type === "verifies") {
          ctx.strokeStyle = "rgba(16, 185, 129, 0.2)";
          ctx.lineWidth = 1;
          ctx.setLineDash([]);
        } else {
          ctx.strokeStyle = "rgba(30, 41, 59, 0.5)";
          ctx.lineWidth = 1;
          ctx.setLineDash([]);
        }

        const isHighlighted = hoveredNode && (edge.source === hoveredNode || edge.target === hoveredNode);
        if (isHighlighted) {
          ctx.strokeStyle = "rgba(99, 102, 241, 0.6)";
          ctx.lineWidth = 2;
        }

        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw nodes with gentle floating
      nodes.forEach((node) => {
        const offsetX = Math.sin(t * 2 + node.x * 0.01) * 2;
        const offsetY = Math.cos(t * 2 + node.y * 0.01) * 2;
        const nx = node.x + offsetX;
        const ny = node.y + offsetY;

        // Glow
        if (node.type === "domain" || hoveredNode === node.id) {
          const gradient = ctx.createRadialGradient(nx, ny, 0, nx, ny, node.radius * 3);
          gradient.addColorStop(0, node.color + "30");
          gradient.addColorStop(1, "transparent");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(nx, ny, node.radius * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(nx, ny, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.type === "concept" ? node.color + "60" : node.color;
        ctx.fill();

        if (node.type === "domain") {
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Label
        ctx.fillStyle = "#e2e8f0";
        ctx.font = node.type === "domain" ? "bold 10px sans-serif" : node.type === "agent" ? "bold 9px sans-serif" : "8px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(node.label, nx, ny + node.radius + 14);
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [hoveredNode]);

  return (
    <div className="page-enter p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Knowledge Graph</h1>
        <p className="text-sm text-[var(--text-secondary)]">Interactive visualization of agents, domains, concepts, and their relationships</p>
      </div>

      {/* Legend */}
      <div className="glass-card p-4 flex flex-wrap gap-6 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-[var(--accent-indigo)]" />
          <span className="text-[var(--text-secondary)]">Domain</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[var(--accent-emerald)]" />
          <span className="text-[var(--text-secondary)]">Agent</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--text-muted)]" />
          <span className="text-[var(--text-secondary)]">Concept</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-6 border-t-2 border-dashed border-[var(--accent-amber)]" />
          <span className="text-[var(--text-secondary)]">Polar Tension</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-6 border-t border-[var(--border-primary)]" />
          <span className="text-[var(--text-secondary)]">Domain Link</span>
        </div>
      </div>

      {/* Graph canvas */}
      <div className="glass-card overflow-hidden" style={{ height: 600 }}>
        <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />
      </div>

      {/* Domain breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(domainColors).map(([domain, color]) => {
          const domainAgents = agents.filter((a) => a.domain === domain);
          const domainConcepts = concepts.filter((c) => c.domain === domain);
          return (
            <div key={domain} className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <h3 className="font-semibold text-sm">{domain}</h3>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-[var(--text-muted)]">Agents:</div>
                <div className="flex flex-wrap gap-1">
                  {domainAgents.map((a) => (
                    <span key={a.id} className="badge" style={{ backgroundColor: `color-mix(in srgb, ${a.color} 15%, transparent)`, color: a.color, fontSize: 10 }}>
                      {a.name}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-2">Key Concepts:</div>
                <div className="flex flex-wrap gap-1">
                  {domainConcepts.map((c) => (
                    <span key={c.id} className="badge bg-[var(--bg-elevated)] text-[var(--text-secondary)]" style={{ fontSize: 10 }}>
                      {c.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
