import React from 'react';

interface MathDisplayProps {
  equation: string;
  display?: 'inline' | 'block';
  verificationStatus?: 'pending' | 'proven' | 'failed';
}

const MathDisplay: React.FC<MathDisplayProps> = ({ equation, display = 'block', verificationStatus }) => {
  return (
    <div className={`math-display ${display} ${verificationStatus}`}>
      {/* In a real app, use KaTeX or MathJax here */}
      <code>{equation}</code>
      {verificationStatus && <span className="status-badge">{verificationStatus}</span>}
    </div>
  );
};

export default MathDisplay;
