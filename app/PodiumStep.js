"use client";
import { motion } from "framer-motion";
import React from "react";

export default function PodiumStep({ podium, winner }) {
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
              delay: (offset + 1),
              duration: 0.25,
            },
          },
          hidden: { opacity: 0 },
        }}
      >
        {winner.name}
      </motion.div>

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
          {winner.position + 1}
        </span>
      </motion.div>
    </div>
  );
}
