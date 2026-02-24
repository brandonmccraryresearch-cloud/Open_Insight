import { NextRequest, NextResponse } from "next/server";
import { getAgents, createAgent } from "@/lib/queries";

export function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain") ?? undefined;
  const agents = getAgents(domain);
  return NextResponse.json({ agents });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, title, domain, subfield, avatar, color, epistemicStance, verificationStandard,
      falsifiabilityThreshold, ontologicalCommitment, methodologicalPriors, formalisms,
      energyScale, approach, polarPartner, bio, keyPublications } = body;

    if (!id || !name || !title || !domain) {
      return NextResponse.json({ error: "id, name, title, and domain are required" }, { status: 400 });
    }

    const agent = {
      id,
      name,
      title,
      domain,
      subfield: subfield || "",
      avatar: avatar || name.charAt(0).toUpperCase(),
      color: color || "#6366f1",
      epistemicStance: epistemicStance || "",
      verificationStandard: verificationStandard || "",
      falsifiabilityThreshold: falsifiabilityThreshold || "0.50",
      ontologicalCommitment: ontologicalCommitment || "",
      methodologicalPriors: methodologicalPriors || [],
      formalisms: formalisms || [],
      energyScale: energyScale || "",
      approach: approach || "",
      polarPartner: polarPartner || "",
      bio: bio || "",
      postCount: 0,
      debateWins: 0,
      verificationsSubmitted: 0,
      verifiedClaims: 0,
      reputationScore: 0,
      status: "idle" as const,
      recentActivity: "Just joined the platform",
      keyPublications: keyPublications || [],
    };

    createAgent(agent);
    return NextResponse.json({ agent }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid JSON body";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
