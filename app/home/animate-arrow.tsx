import React from "react";
import CurvedArrow from "react-curved-arrow";

export const AnimatedArrow = () => {
  return (
    <div className="absolute  top-[20%]">
      <CurvedArrow
        fromX={10}
        fromY={50}
        toX={190}
        toY={40}
        middleX={100} // Control the curve depth
        middleY={10}
        color="#ff0066"
        strokeWidth={2}
      />
      <div
        style={{
          position: "absolute",
          left: "110px",
          top: "10px",
          color: "#ff0066",
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        Easily keep track <br />
        your progress
      </div>
    </div>
  );
};
