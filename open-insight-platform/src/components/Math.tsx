"use client";
import { useEffect, useRef } from "react";
import katex from "katex";

interface MathProps {
  tex: string;
  display?: boolean;
  className?: string;
}

export default function Math({ tex, display = false, className = "" }: MathProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(tex, ref.current, {
          displayMode: display,
          throwOnError: false,
          trust: true,
          strict: false,
          macros: {
            "\\R": "\\mathbb{R}",
            "\\C": "\\mathbb{C}",
            "\\Z": "\\mathbb{Z}",
            "\\N": "\\mathbb{N}",
            "\\H": "\\mathcal{H}",
            "\\braket": "\\langle #1 | #2 \\rangle",
            "\\ket": "|#1\\rangle",
            "\\bra": "\\langle #1|",
            "\\Tr": "\\operatorname{Tr}",
            "\\Phi": "\\Phi",
          },
        });
      } catch {
        if (ref.current) {
          ref.current.textContent = tex;
        }
      }
    }
  }, [tex, display]);

  return (
    <span
      ref={ref}
      className={`${display ? "block my-3 overflow-x-auto" : "inline"} ${className}`}
    />
  );
}

/** Parse text with inline $...$ and display $$...$$ LaTeX */
export function MathText({ children, className = "" }: { children: string; className?: string }) {
  const parts = parseLatex(children);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.type === "display") {
          return <Math key={i} tex={part.content} display />;
        } else if (part.type === "inline") {
          return <Math key={i} tex={part.content} />;
        }
        return <span key={i}>{part.content}</span>;
      })}
    </span>
  );
}

interface ParsedPart {
  type: "text" | "inline" | "display";
  content: string;
}

function parseLatex(text: string): ParsedPart[] {
  const parts: ParsedPart[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    // Check for display math $$...$$
    const displayMatch = remaining.match(/\$\$([\s\S]*?)\$\$/);
    // Check for inline math $...$
    const inlineMatch = remaining.match(/\$([^\$\n]+?)\$/);

    if (displayMatch && (!inlineMatch || displayMatch.index! <= inlineMatch.index!)) {
      const idx = displayMatch.index!;
      if (idx > 0) parts.push({ type: "text", content: remaining.slice(0, idx) });
      parts.push({ type: "display", content: displayMatch[1].trim() });
      remaining = remaining.slice(idx + displayMatch[0].length);
    } else if (inlineMatch) {
      const idx = inlineMatch.index!;
      if (idx > 0) parts.push({ type: "text", content: remaining.slice(0, idx) });
      parts.push({ type: "inline", content: inlineMatch[1].trim() });
      remaining = remaining.slice(idx + inlineMatch[0].length);
    } else {
      parts.push({ type: "text", content: remaining });
      break;
    }
  }

  return parts;
}
