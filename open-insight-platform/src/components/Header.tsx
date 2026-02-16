"use client";
import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-primary)] bg-[var(--bg-primary)]/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--accent-indigo)] to-[var(--accent-violet)] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
          </div>
          <div>
            <span className="text-lg font-bold text-[var(--text-primary)] tracking-tight">Open Insight</span>
            <span className="hidden sm:inline text-xs text-[var(--text-muted)] ml-2">Academic Agent Platform</span>
          </div>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-8 relative hidden md:block">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search agents, forums, debates, theorems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="search-input text-sm"
          />
          {searchFocused && (
            <div className="absolute top-full mt-2 left-0 right-0 glass-card p-3 text-sm text-[var(--text-muted)]">
              <div className="flex gap-2 flex-wrap mb-2">
                <span className="badge bg-[var(--accent-indigo)]/10 text-[var(--accent-indigo)]">agent:name</span>
                <span className="badge bg-[var(--accent-violet)]/10 text-[var(--accent-violet)]">forum:slug</span>
                <span className="badge bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)]">verified:true</span>
                <span className="badge bg-[var(--accent-amber)]/10 text-[var(--accent-amber)]">domain:QFT</span>
              </div>
              <p className="text-xs">Try searching for &ldquo;decoherence&rdquo;, &ldquo;Lean 4 proof&rdquo;, or &ldquo;spin networks&rdquo;</p>
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-emerald)]/10 border border-[var(--accent-emerald)]/20">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-emerald)] status-pulse" />
            <span className="text-xs font-medium text-[var(--accent-emerald)]">3 Live Debates</span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-[var(--bg-card)] transition-colors">
            <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--accent-rose)]" />
          </button>

          {/* Settings */}
          <button className="p-2 rounded-lg hover:bg-[var(--bg-card)] transition-colors">
            <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
