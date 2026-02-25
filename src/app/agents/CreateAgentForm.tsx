"use client";
import { useState } from "react";

interface CreateAgentFormProps {
  onCreated: () => void;
  onCancel: () => void;
}

export default function CreateAgentForm({ onCreated, onCancel }: CreateAgentFormProps) {
  const [form, setForm] = useState({
    id: "",
    name: "",
    title: "",
    domain: "",
    subfield: "",
    color: "#6366f1",
    epistemicStance: "",
    verificationStandard: "",
    falsifiabilityThreshold: "0.50",
    ontologicalCommitment: "",
    methodologicalPriors: "",
    formalisms: "",
    energyScale: "",
    approach: "",
    polarPartner: "",
    bio: "",
    keyPublications: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const slug = form.id.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (!slug) {
      setError("ID must contain at least one alphanumeric character");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          id: slug,
          avatar: form.name ? form.name.charAt(0).toUpperCase() : "?",
          methodologicalPriors: form.methodologicalPriors.split(",").map((s) => s.trim()).filter(Boolean),
          formalisms: form.formalisms.split(",").map((s) => s.trim()).filter(Boolean),
          keyPublications: form.keyPublications.split("\n").map((s) => s.trim()).filter(Boolean),
        }),
      });

      if (!res.ok) {
        let message = "Failed to create agent";
        try {
          const data = await res.json();
          if (data && typeof data.error === "string" && data.error.trim()) {
            message = data.error;
          }
        } catch {
          // keep default message
        }
        setError(message);
        return;
      }

      onCreated();
    } catch (err) {
      const message = err instanceof Error && err.message ? err.message : "Failed to create agent";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = "w-full bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-indigo)]";
  const labelClass = "text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider";

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold mb-4">Create New Agent</h2>
      {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>ID (unique slug)</label>
            <input className={fieldClass} value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })} required placeholder="e.g. einstein" pattern="[a-z0-9-]+" title="Lowercase letters, numbers, and hyphens only" />
          </div>
          <div>
            <label className={labelClass}>Name</label>
            <input className={fieldClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Dr. Einstein" />
          </div>
          <div>
            <label className={labelClass}>Title</label>
            <input className={fieldClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Relativity Theorist" />
          </div>
          <div>
            <label className={labelClass}>Domain</label>
            <input className={fieldClass} value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} required placeholder="e.g. Quantum Foundations" />
          </div>
          <div>
            <label className={labelClass}>Subfield</label>
            <input className={fieldClass} value={form.subfield} onChange={(e) => setForm({ ...form, subfield: e.target.value })} placeholder="e.g. Gravitational Physics" />
          </div>
          <div>
            <label className={labelClass}>Color</label>
            <input type="color" className="w-full h-9 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-elevated)] cursor-pointer" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Bio</label>
          <textarea className={fieldClass} rows={2} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Short biography..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Epistemic Stance</label>
            <input className={fieldClass} value={form.epistemicStance} onChange={(e) => setForm({ ...form, epistemicStance: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Verification Standard</label>
            <input className={fieldClass} value={form.verificationStandard} onChange={(e) => setForm({ ...form, verificationStandard: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Ontological Commitment</label>
            <input className={fieldClass} value={form.ontologicalCommitment} onChange={(e) => setForm({ ...form, ontologicalCommitment: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Falsifiability Threshold</label>
            <input className={fieldClass} value={form.falsifiabilityThreshold} onChange={(e) => setForm({ ...form, falsifiabilityThreshold: e.target.value })} placeholder="0.50" />
          </div>
          <div>
            <label className={labelClass}>Energy Scale</label>
            <input className={fieldClass} value={form.energyScale} onChange={(e) => setForm({ ...form, energyScale: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Approach</label>
            <input className={fieldClass} value={form.approach} onChange={(e) => setForm({ ...form, approach: e.target.value })} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Methodological Priors (comma-separated)</label>
          <input className={fieldClass} value={form.methodologicalPriors} onChange={(e) => setForm({ ...form, methodologicalPriors: e.target.value })} placeholder="e.g. Mathematical elegance, Empirical adequacy" />
        </div>
        <div>
          <label className={labelClass}>Formalisms (comma-separated)</label>
          <input className={fieldClass} value={form.formalisms} onChange={(e) => setForm({ ...form, formalisms: e.target.value })} placeholder="e.g. Lean 4, SymPy, ZFC set theory" />
        </div>
        <div>
          <label className={labelClass}>Key Publications (one per line)</label>
          <textarea className={fieldClass} rows={3} value={form.keyPublications} onChange={(e) => setForm({ ...form, keyPublications: e.target.value })} placeholder="One publication per line" />
        </div>
        <div>
          <label className={labelClass}>Polar Partner (agent ID)</label>
          <input className={fieldClass} value={form.polarPartner} onChange={(e) => setForm({ ...form, polarPartner: e.target.value })} placeholder="e.g. penrose" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={submitting} className="px-4 py-2 bg-[var(--accent-indigo)] text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50">
            {submitting ? "Creating..." : "Create Agent"}
          </button>
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-[var(--bg-elevated)] text-[var(--text-secondary)] rounded-lg text-sm font-medium hover:bg-[var(--bg-card)]">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
