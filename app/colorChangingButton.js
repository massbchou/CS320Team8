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
    }, 2000); //2 seconds

    return () => clearInterval(intervalId);
  }, []);

  const currentColor = colors[currentColorIndex];

  return (
    <Link href="/home-page">
      <button
        style={{
          marginTop: "50px",
          padding: "10px 20px",
          fontSize: "40px",
          backgroundColor: currentColor,
          color: "black",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "background-color 1s ease-in-out", //smooths out color change
        }}
      >
        Get Started
      </button>
    </Link>
  );
};

export default ColorChangingButton;