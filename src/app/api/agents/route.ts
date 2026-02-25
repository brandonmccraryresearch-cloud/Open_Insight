import { NextRequest, NextResponse } from "next/server";
import { getAgents, getAgentById, createAgent } from "@/lib/queries";

const MAX_FIELD_LENGTH = 5000;
const VALID_STATUSES = ["active", "reasoning", "verifying", "idle"] as const;

export function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain") ?? undefined;
  const agents = getAgents(domain);
  return NextResponse.json({ agents });
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { id, name, title, domain, subfield, avatar, color, epistemicStance, verificationStandard,
    falsifiabilityThreshold, ontologicalCommitment, methodologicalPriors, formalisms,
    energyScale, approach, polarPartner, bio, keyPublications } = body as Record<string, string | string[]>;

  if (!id || !name || !title || !domain) {
    return NextResponse.json({ error: "id, name, title, and domain are required" }, { status: 400 });
  }

  if (!/^[a-z0-9-]+$/.test(id as string)) {
    return NextResponse.json({ error: "id must contain only lowercase alphanumeric characters and hyphens" }, { status: 400 });
  }

  if (typeof body.status === "string" && !VALID_STATUSES.includes(body.status as typeof VALID_STATUSES[number])) {
    return NextResponse.json({ error: `status must be one of: ${VALID_STATUSES.join(", ")}` }, { status: 400 });
  }

  const textFields = { name, title, domain, subfield, bio, epistemicStance, verificationStandard, ontologicalCommitment, energyScale, approach };
  for (const [key, value] of Object.entries(textFields)) {
    if (typeof value === "string" && value.length > MAX_FIELD_LENGTH) {
      return NextResponse.json({ error: `${key} exceeds maximum length of ${MAX_FIELD_LENGTH} characters` }, { status: 400 });
    }
  }

  const existing = getAgentById(id as string);
  if (existing) {
    return NextResponse.json({ error: `Agent with id "${id}" already exists` }, { status: 409 });
  }

  try {
    const agent = {
      id: id as string,
      name: name as string,
      title: title as string,
      domain: domain as string,
      subfield: (subfield as string) || "",
      avatar: (avatar as string) || (name as string).charAt(0).toUpperCase(),
      color: (color as string) || "#6366f1",
      epistemicStance: (epistemicStance as string) || "",
      verificationStandard: (verificationStandard as string) || "",
      falsifiabilityThreshold: (falsifiabilityThreshold as string) || "0.50",
      ontologicalCommitment: (ontologicalCommitment as string) || "",
      methodologicalPriors: (methodologicalPriors as string[]) || [],
      formalisms: (formalisms as string[]) || [],
      energyScale: (energyScale as string) || "",
      approach: (approach as string) || "",
      polarPartner: (polarPartner as string) || "",
      bio: (bio as string) || "",
      postCount: 0,
      debateWins: 0,
      verificationsSubmitted: 0,
      verifiedClaims: 0,
      reputationScore: 0,
      status: "idle" as const,
      recentActivity: "Just joined the platform",
      keyPublications: (keyPublications as string[]) || [],
    };

    createAgent(agent);
    return NextResponse.json({ agent }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create agent";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
