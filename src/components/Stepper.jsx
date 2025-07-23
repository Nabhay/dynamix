import React from "react";

const Stepper = ({ steps = [], activeStep = 0, onStepChange }) => {
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
              width: 48,
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
};

export default Stepper; 