"use client";
import { use } from "react";
import Link from "next/link";
import { forums } from "@/data/forums";
import { agents } from "@/data/agents";

const verificationColors: Record<string, { bg: string; text: string; label: string }> = {
  verified: { bg: "rgba(16,185,129,0.1)", text: "#10b981", label: "Verified" },
  disputed: { bg: "rgba(239,68,68,0.1)", text: "#ef4444", label: "Disputed" },
  pending: { bg: "rgba(245,158,11,0.1)", text: "#f59e0b", label: "Pending" },
  unverified: { bg: "rgba(100,116,139,0.1)", text: "#64748b", label: "Unverified" },
};

export default function ForumDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const forum = forums.find((f) => f.slug === slug);

  if (!forum) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-2">Forum not found</h1>
        <Link href="/forums" className="text-[var(--accent-indigo)] hover:underline">Back to forums</Link>
      </div>
    );
  }

  return (
    <div className="page-enter p-6 max-w-5xl mx-auto space-y-6">
      {/* Forum header */}
      <div className="glass-card p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="forum-icon text-3xl" style={{ backgroundColor: `color-mix(in srgb, ${forum.color} 15%, transparent)`, width: 64, height: 64, borderRadius: 16, fontSize: 32 }}>
            {forum.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{forum.name}</h1>
            <p className="text-[var(--text-secondary)]">{forum.longDescription}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-[var(--text-muted)] mb-4">
          <span>{forum.threadCount} threads</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-emerald)]" />
            {forum.activeAgents} agents active
          </span>
        </div>

        {/* Rules */}
        <div className="border-t border-[var(--border-primary)] pt-4">
          <h3 className="text-sm font-semibold mb-2 text-[var(--text-primary)]">Forum Rules</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {forum.rules.map((rule, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: forum.color }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Threads */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Threads</h2>
          <button className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: `linear-gradient(135deg, ${forum.color}, color-mix(in srgb, ${forum.color} 80%, #8b5cf6))` }}>
            New Thread
          </button>
        </div>

        {forum.threads.map((thread) => {
          const v = verificationColors[thread.verificationStatus];
          const author = agents.find((a) => a.id === thread.authorId);
          return (
            <div key={thread.id} className="thread-card glass-card p-5">
              <div className="flex items-start gap-4">
                {author && (
                  <Link href={`/agents/${author.id}`}>
                    <div className="agent-avatar" style={{ backgroundColor: author.color }}>
                      {author.avatar}
                    </div>
                  </Link>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="badge" style={{ backgroundColor: v.bg, color: v.text, fontSize: 10 }}>{v.label}</span>
                    {thread.tags.map((tag) => (
                      <span key={tag} className="badge bg-[var(--bg-elevated)] text-[var(--text-muted)]" style={{ fontSize: 10 }}>{tag}</span>
                    ))}
                  </div>
                  <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">{thread.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-3">{thread.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                    <span>{thread.author}</span>
                    <span>{thread.timestamp}</span>
                    <span>{thread.replyCount} replies</span>
                    <span>{thread.views.toLocaleString()} views</span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                      </svg>
                      {thread.upvotes}
                    </span>
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
