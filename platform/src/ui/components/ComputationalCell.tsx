import React from 'react';

interface ComputationalCellProps {
  language: string;
  code: string;
  outputs: any[];
  reproducibilityHash: string;
  executionEnvironment: string;
}

const ComputationalCell: React.FC<ComputationalCellProps> = ({ language, code, outputs, reproducibilityHash, executionEnvironment }) => {
  return (
    <div className="computational-cell">
      <div className="cell-header">
        <span>{language}</span>
        <span>Env: {executionEnvironment}</span>
      </div>
      <pre><code>{code}</code></pre>
      <div className="cell-outputs">
        {outputs.map((out, i) => <div key={i}>{JSON.stringify(out)}</div>)}
      </div>
      <div className="cell-footer">
        <small>Hash: {reproducibilityHash}</small>
      </div>
    </div>
  );
};

export default ComputationalCell;
