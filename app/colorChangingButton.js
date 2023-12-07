"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const ColorChangingButton = () => {
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  //colors eyedropped from CampusWire logo
  const darkBlue = "#0F84FF";
  const magenta = "#E83EFD";
  const colors = [darkBlue, magenta];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, 3000); //3 seconds, this is how often it switches

    return () => clearInterval(intervalId);
  }, []);

  const currentColor = colors[currentColorIndex];

  return (
    <Link href="/home-page">
      <button
        style={{
          marginTop: "40px",
          padding: "10px 20px",
          fontSize: "40px",
          backgroundColor: currentColor,
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "background-color 3s ease-in-out", //smooths out color change, make the time longer to make the transition smoother
        }}
      >
        Get Started
      </button>
    </Link>
  );
};

export default ColorChangingButton;
