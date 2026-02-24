import { NextRequest, NextResponse } from "next/server";
import { getAgentById, getPolarPairs, deleteAgent } from "@/lib/queries";

export function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return params.then(({ id }) => {
    const agent = getAgentById(id);
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const polarPairs = getPolarPairs();
    const polarPair = polarPairs.find((p) => p.agents.includes(id));
    const partnerId = agent.polarPartner;
    const polarPartner = partnerId ? getAgentById(partnerId) : undefined;

    return NextResponse.json({ agent, polarPartner: polarPartner ?? null, polarPair: polarPair ?? null });
  });
}

export function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return params.then(({ id }) => {
    const deleted = deleteAgent(id);
    if (!deleted) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  });
}
