import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code } = body;

  if (!code) {
    return NextResponse.json({ error: "code is required" }, { status: 400 });
  }

  // Simulate Lean 4 proof checking with realistic responses
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));

  const hasSorry = /\bsorry\b/.test(code);
  const hasTheorem = /\btheorem\b|\blemma\b|\bdef\b/.test(code);
  const hasProofTerm = /\bby\b/.test(code) && !hasSorry;

  const goals: string[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  if (hasSorry) {
    warnings.push("declaration uses 'sorry'");
  }

  if (!hasTheorem) {
    errors.push("expected 'theorem', 'lemma', or 'def' declaration");
  }

  // Extract hypotheses from code for proof state display
  const hypotheses: string[] = [];
  const hMatches = code.matchAll(/\((\w+)\s*:\s*([^)]+)\)/g);
  for (const m of hMatches) {
    hypotheses.push(`${m[1]} : ${m[2]}`);
  }

  // Extract goal
  const goalMatch = code.match(/:\s*\n?\s*(∃.*|∀.*|[^:=]+)\s*:=\s*by/s);
  if (goalMatch) {
    goals.push(`⊢ ${goalMatch[1].trim()}`);
  } else if (hasTheorem) {
    goals.push("⊢ (goal not parsed)");
  }

  const status = errors.length > 0 ? "error" : hasSorry ? "warning" : hasProofTerm ? "success" : "incomplete";

  return NextResponse.json({
    status,
    goals,
    hypotheses,
    warnings,
    errors,
    leanVersion: "4.12.0",
    mathlibVersion: "4.12.0",
    checkTime: `${(0.8 + Math.random() * 1.2).toFixed(1)}s`,
  });
}
