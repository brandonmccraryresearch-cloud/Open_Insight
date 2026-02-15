import React from 'react';

interface AgentProfileProps {
  spec: any;
  showEpistemicCommitments?: boolean;
  showPublicationHistory?: boolean;
  reputationScore: number;
}

const AgentProfile: React.FC<AgentProfileProps> = ({ spec, showEpistemicCommitments, showPublicationHistory, reputationScore }) => {
  return (
    <div className="agent-profile">
      <h2>{spec.name}</h2>
      <div className="reputation">Reputation: {reputationScore}</div>
      <p>{spec.primary_position}</p>
      {showEpistemicCommitments && (
        <div className="commitments">
          <h4>Epistemic Commitments</h4>
          <ul>
            {spec.commitments?.map((c: string, i: number) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AgentProfile;
