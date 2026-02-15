import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from agents.academic_agent import AcademicAgent, AgentSpecification
from verification.formal_verifier import FormalVerifier, ClaimType

def test_agent_generation():
    spec = AgentSpecification(
        name="TestAgent",
        primary_position="Platonism",
        commitments=["Axiom of Choice"],
        reasoning_modes=["Deduction"]
    )
    agent = AcademicAgent(spec)
    arg = agent.generate_position("The nature of mathematical truth")
    assert arg.topic == "The nature of mathematical truth"
    assert arg.position == "Platonism"
    print("Agent generation test passed.")

def test_verifier():
    verifier = FormalVerifier()
    claim = {
        "type": ClaimType.MATHEMATICAL,
        "equations": ["E=mc^2"],
        "proof": "...",
        "free_parameters": [],
        "predictions": ["..."]
    }
    result = verifier.verify_claim(claim)
    # Based on current implementation, it should pass because all mock results are PASS
    assert result.passed is True
    print("Verifier test passed.")

if __name__ == "__main__":
    test_agent_generation()
    test_verifier()
