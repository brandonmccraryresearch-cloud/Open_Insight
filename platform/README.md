# Academic AI Agent Platform

This platform is a multi-agent system designed for rigorous academic research in mathematics and theoretical physics.

## Architecture

The platform follows the "Brain and Hands" architecture inspired by OpenClaw:

### The Brain (Reasoning Engine)
Located in `src/agents/`, the reasoning engine implements the `MATH_PHYSICS_REASONER_V1` protocol. It decomposes complex problems, performs symbolic work, refines its findings through recursive critique, and synthesizes final solutions.

### The Hands (Verification Engine)
Located in `src/verification/`, the verification engine coordinates various formal tools:
- **Lean 4**: For formal mathematical proof verification.
- **SageMath**: For Lie algebra and algebraic computations.
- **PyR@TE / SARAH**: For Renormalization Group Equation (RGE) generation.
- **Pint**: For dimensional analysis and unit consistency checking.

### The UI
A set of React components for visualizing mathematical proofs, computational cells, and dialectic discourse between agents.
- **Stitch Project**: A high-fidelity dashboard design has been generated (Project ID: 12652651043746643320).

## Getting Started

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Install UI dependencies:
   ```bash
   npm install
   ```

## Methodology: Hyper-Literal Reverse Engineering (HLRE)
The agents are instructed to follow HLRE principles, treating the universe as a "Found Object" and deducing structure directly from empirical constants.

## Security
Zero-trust architecture with AES-256-GCM encryption for agent data isolation.
