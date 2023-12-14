"use client";
import React, { useState } from "react";
import { Young_Serif } from "next/font/google";

const youngSerif = Young_Serif({
  subsets: ["latin"],
  weight: "400",
});
// Returns a formatted Feature component for the Overview tab given a title and some data

export default function Feature(props) {
  const [isHovered, setIsHovered] = useState(false);

  const handleOnClick = (linkToGoTo) => () => {
    window.location.href = "/" + linkToGoTo;
  };

  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseOut = () => {
    setIsHovered(false);
  };

  const containerStyle = {
    padding: "20px",
    transition: "transform 0.3s ease-in-out",
    transform: isHovered ? "scale(1.1)" : "scale(1)",
    backgroundImage:
      "linear-gradient(rgba(0, 224, 255, 0.45), rgba(240, 56, 255, 0.55))",
    borderRadius: "10px",
    margin: "20px",
    width: "18%",
  };

  if (props.hasButton) {
    return (
      <div
        style={{
          ...containerStyle,
          cursor: isHovered ? "pointer" : "initial", // Change cursor to pointer when hovered
          border: isHovered ? "2px solid black" : "none",
        }}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onClick={handleOnClick(props.linkTo)}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontFamily: youngSerif,
              fontSize: "20px",
              backgroundColor: "rgba(255, 255, 255, 0.70)",
              borderRadius: "10px",
              width: "100%",
              padding: "6px",
              marginBottom: "9px",
              marginRight: "9px",
            }}
          >
            {props.title}
          </div>
        </div>
        {props.content.map((x, i) => (
          <div
            key={i + "a"}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span
              key={i + "b"}
              style={{
                fontFamily: youngSerif,
                fontSize: "17px",
                textAlign: "center",
                margin: "6px",
                padding: "2px",
                backgroundColor: "rgba(255, 255, 255, 1)",
                opacity: "0.6",
                borderRadius: "7px",
                width: "10%",
              }}
            >
              {i + 1}
            </span>
            <span
              key={i + "c"}
              style={{
                fontFamily: youngSerif,
                fontSize: "17px",
                textAlign: "center",
                margin: "6px",
                padding: "2px",
                backgroundColor: "rgba(255, 255, 255, 1)",
                opacity: "0.6",
                borderRadius: "7px",
                width: "70%",
              }}
            >
              {x}
            </span>
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 224, 255, 0.45), rgba(240, 56, 255, 0.55))",
          borderRadius: "10px",
          padding: "20px",
          margin: "20px",
          width: "18%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontFamily: youngSerif,
              fontSize: "20px",
              backgroundColor: "rgba(255, 255, 255, 0.70)",
              borderRadius: "10px",
              width: "100%",
              padding: "6px",
              marginBottom: "9px",
              marginRight: "9px",
            }}
          >
            {props.title}
          </div>
        </div>
        {props.content.map((x, i) => (
          <div
            key={i + "a"}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span
              key={i + "b"}
              style={{
                fontFamily: youngSerif,
                fontSize: "17px",
                textAlign: "center",
                margin: "6px",
                padding: "2px",
                backgroundColor: "rgba(255, 255, 255, 1)",
                opacity: "0.6",
                borderRadius: "7px",
                width: "10%",
              }}
            >
              {i + 1}
            </span>
            <span
              key={i + "c"}
              style={{
                fontFamily: youngSerif,
                fontSize: "17px",
                textAlign: "center",
                margin: "6px",
                padding: "2px",
                backgroundColor: "rgba(255, 255, 255, 1)",
                opacity: "0.6",
                borderRadius: "7px",
                width: "70%",
              }}
            >
              {x}
            </span>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "6px",
            color: "rgba(255, 255, 255, 1)",
            opacity: "0.6",
          }}
        ></div>
      </div>
    );
  }
}
