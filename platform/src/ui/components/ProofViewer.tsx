import React from 'react';

interface ProofViewerProps {
  proofType: string;
  theoremStatement: string;
  proofSteps: any;
  verificationStatus: string;
  interactiveMode?: boolean;
}

const ProofViewer: React.FC<ProofViewerProps> = ({ proofType, theoremStatement, proofSteps, verificationStatus, interactiveMode }) => {
  return (
    <div className="proof-viewer">
      <h3>{theoremStatement}</h3>
      <div className="proof-meta">
        <span>Type: {proofType}</span>
        <span>Status: {verificationStatus}</span>
      </div>
      <pre>{JSON.stringify(proofSteps, null, 2)}</pre>
      {interactiveMode && <button>Enter Interactive Mode</button>}
    </div>
  );
};

export default ProofViewer;
