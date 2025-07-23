import React from "react";

// Helper to split steps into two rows
function splitSteps(steps) {
  if (steps.length < 4) return [steps, []];
  if (steps.length === 4) return [steps.slice(0, 2), steps.slice(2)];
  // For 5+, max 3 on top, rest on bottom
  const topRow = steps.slice(0, Math.min(3, steps.length));
  const bottomRow = steps.slice(Math.min(3, steps.length));
  return [topRow, bottomRow];
}

const STEP_WIDTH = 120;
const CONNECTOR_WIDTH = 48;

const Stepper = ({ steps = [], activeStep = 0, onStepChange }) => {
  if (steps.length < 4) {
    // Original single row rendering
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        marginBottom: "2.5rem",
        fontFamily: 'Inter, sans-serif',
      }}>
        {steps.map((label, idx) => (
          <React.Fragment key={label}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: idx <= activeStep ? "pointer" : "default",
              opacity: idx <= activeStep ? 1 : 0.5,
              minWidth: STEP_WIDTH,
            }}
            onClick={() => idx <= activeStep && onStepChange && onStepChange(idx)}
            >
              <div style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: idx === activeStep ? "#2563eb" : "#1e293b",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 18,
                border: idx === activeStep ? "2px solid #60a5fa" : "2px solid #334155",
                boxShadow: idx === activeStep ? "0 0 8px #2563eb55" : undefined,
                marginBottom: 6,
                transition: "all 0.2s"
              }}>{idx + 1}</div>
              <span style={{
                color: idx === activeStep ? "#fff" : "#b0b8c1",
                fontSize: 14,
                fontWeight: idx === activeStep ? 600 : 400,
                marginTop: 2,
                textAlign: "center"
              }}>{label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div style={{
                width: CONNECTOR_WIDTH,
                height: 2,
                background: idx < activeStep ? "#2563eb" : "#334155",
                borderRadius: 1,
                margin: "0 0.5rem"
              }} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  // For 4+ steps, split into two rows (special case for 4: 2/2)
  const [topRow, bottomRow] = splitSteps(steps);
  const topStart = 0;
  const bottomStart = topRow.length;

  // For 2/2 layout, center bottom row under top row
  const isTwoByTwo = steps.length === 4;
  const rowWidth = isTwoByTwo ? (STEP_WIDTH * 2 + CONNECTOR_WIDTH) : undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem', fontFamily: 'Inter, sans-serif', gap: 12 }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, minWidth: rowWidth }}>
        {topRow.map((label, idx) => (
          <React.Fragment key={label}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: (idx + topStart) <= activeStep ? "pointer" : "default",
              opacity: (idx + topStart) <= activeStep ? 1 : 0.5,
              minWidth: STEP_WIDTH,
            }}
            onClick={() => (idx + topStart) <= activeStep && onStepChange && onStepChange(idx + topStart)}
            >
              <div style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: (idx + topStart) === activeStep ? "#2563eb" : "#1e293b",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 18,
                border: (idx + topStart) === activeStep ? "2px solid #60a5fa" : "2px solid #334155",
                boxShadow: (idx + topStart) === activeStep ? "0 0 8px #2563eb55" : undefined,
                marginBottom: 6,
                transition: "all 0.2s"
              }}>{idx + 1}</div>
              <span style={{
                color: (idx + topStart) === activeStep ? "#fff" : "#b0b8c1",
                fontSize: 14,
                fontWeight: (idx + topStart) === activeStep ? 600 : 400,
                marginTop: 2,
                textAlign: "center"
              }}>{label}</span>
            </div>
            {idx < topRow.length - 1 && (
              <div style={{
                width: CONNECTOR_WIDTH,
                height: 2,
                background: (idx + topStart) < activeStep ? "#2563eb" : "#334155",
                borderRadius: 1,
                margin: "0 0.5rem"
              }} />
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Bottom row (if any) */}
      {bottomRow.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, minWidth: rowWidth, marginTop: 8 }}>
          {bottomRow.map((label, idx) => (
            <React.Fragment key={label}>
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: (idx + bottomStart) <= activeStep ? "pointer" : "default",
                opacity: (idx + bottomStart) <= activeStep ? 1 : 0.5,
                minWidth: STEP_WIDTH,
              }}
              onClick={() => (idx + bottomStart) <= activeStep && onStepChange && onStepChange(idx + bottomStart)}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: (idx + bottomStart) === activeStep ? "#2563eb" : "#1e293b",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 18,
                  border: (idx + bottomStart) === activeStep ? "2px solid #60a5fa" : "2px solid #334155",
                  boxShadow: (idx + bottomStart) === activeStep ? "0 0 8px #2563eb55" : undefined,
                  marginBottom: 6,
                  transition: "all 0.2s"
                }}>{idx + 1 + topRow.length}</div>
                <span style={{
                  color: (idx + bottomStart) === activeStep ? "#fff" : "#b0b8c1",
                  fontSize: 14,
                  fontWeight: (idx + bottomStart) === activeStep ? 600 : 400,
                  marginTop: 2,
                  textAlign: "center"
                }}>{label}</span>
              </div>
              {idx < bottomRow.length - 1 && (
                <div style={{
                  width: CONNECTOR_WIDTH,
                  height: 2,
                  background: (idx + bottomStart) < activeStep ? "#2563eb" : "#334155",
                  borderRadius: 1,
                  margin: "0 0.5rem"
                }} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default Stepper; 