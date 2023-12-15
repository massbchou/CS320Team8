"use client";
import { motion } from "framer-motion";
import React from "react";

//This code was adapted from https://medium.com/geekculture/how-to-animate-a-winners-podium-88fab739e686

//Returns two motion components
export default function PodiumStep({ podium, winner }) {
  // Calculate the offset based on podium length and winner's position
  const offset = podium.length - winner.position;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        placeContent: "center",
        alignItems: "center",
      }}
    >
      {/* Animated component for winner's name */}
      <motion.div
        style={{
          alignSelf: "center",
          marginBottom: ".25rem",
          textAlign: "center",
          fontWeight: "bold",
        }}
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            opacity: 1,
            transition: {
              delay: offset + 1,
              duration: 0.25,
            },
          },
          hidden: { opacity: 0 },
        }}
      >
        {/* Displays the winner's name */}
        {winner.name}
      </motion.div>
      {/* Animated component for the podium step */}
      <motion.div
        style={{
          width: "4rem",
          placeContent: "center",
          display: "flex",
          borderTopLeftRadius: ".5rem",
          borderTopRightRadius: ".5rem",
          borderColor: "rgba(190,24,93,1)",
          backgroundColor: "rgba(247,113,250,1)",
          marginBottom: -1,
          filter: `opacity(${0.1 + offset / podium.length})`,
        }}
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            height: 200 * (offset / podium.length),
            opacity: 1,
            transition: {
              delay: offset,
              duration: 2,
              ease: "backInOut",
            },
          },
          hidden: { opacity: 0, height: 0 },
        }}
      >
        <span style={{ color: "white", alignSelf: "flex-end" }}>
          {/* Displays the position number on the podium */}
          {winner.position + 1}
        </span>
      </motion.div>
    </div>
  );
}
