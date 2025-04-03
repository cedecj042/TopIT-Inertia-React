import React from "react";

const AbilityEstimateLegend = () => {
  return (
    <>
      {/* <h5 className="fw-semibold mb-3">Your Ability Estimate</h5> */}
      
      <div className="score-legend">
        <div className="legend-item">
          <span className="legend-color bg-low"></span>
          <span>Low (θ ≤ -3)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color bg-medium"></span>
          <span>Average (-3 - +3)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color bg-high"></span>
          <span>High (θ ≥ +3)</span>
        </div>
      </div>
    </>
  );
};

export default AbilityEstimateLegend;