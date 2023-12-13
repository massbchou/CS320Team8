"use client";
import React, { useState } from "react";
import { Young_Serif } from "next/font/google";

const youngSerif = Young_Serif({
  subsets: ["latin"],
  weight: "400",
});

export default function SubHeader() {
  const [isLeftHovered, setLeftHovered] = useState(false);
  const [isRightHovered, setRightHovered] = useState(false);

  const handleLeftMouseOver = () => {
    setLeftHovered(true);
  };

  const handleLeftMouseOut = () => {
    setLeftHovered(false);
  };

  const handleRightMouseOver = () => {
    setRightHovered(true);
  };

  const handleRightMouseOut = () => {
    setRightHovered(false);
  };

  const leftLinkStyle = {
    marginRight: "30px",
    textDecoration: "none",
    color: "black",
  };

  const rightLinkStyle = {
    textDecoration: "none",
    color: "black",
  };

  const highlightedStyle = {
    borderRadius: "5px", 
    padding: "8px",
    background:
      "linear-gradient(to right, rgba(0, 224, 255, 0.45), rgba(240, 56, 255, 0.55))", // Change this to your desired highlight color
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily: youngSerif,
          fontWeight: "bold",
          fontSize: "20px",
          color: "black",
          marginBottom: "10px",
        }}
      >
        <a
          href={"most-active-redux"}
          style={Object.assign(
            {},
            leftLinkStyle,
            isLeftHovered && highlightedStyle,
          )}
          onMouseOver={handleLeftMouseOver}
          onMouseOut={handleLeftMouseOut}
        >
          Leaderboard
        </a>
        <a
          href={"member-stats"}
          style={Object.assign(
            {},
            rightLinkStyle,
            isRightHovered && highlightedStyle,
          )}
          onMouseOver={handleRightMouseOver}
          onMouseOut={handleRightMouseOut}
        >
          Member Stats
        </a>
      </div>
      <span
        style={{
          position: "relative",
          width: "100%",
          height: "5px", // Adjust line thickness
          background:
            "linear-gradient(to right, rgba(0, 224, 255, 0.45), rgba(240, 56, 255, 0.55))",
        }}
      ></span>
    </div>
  );
}
