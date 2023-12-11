"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const BarGraph = ({ namesArr, scoresArr, title, font }) => {
  const chartContainer = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (chartContainer.current) {
      const ctx = chartContainer.current.getContext("2d");

      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: namesArr.slice(0, scoresArr.length),
          datasets: [
            {
              label: "Scores",
              data: scoresArr,
              backgroundColor: "rgba(146,234,254,1)",
              borderColor: "rgba(146,200,220,1)",
              borderWidth: 2,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            title: {
              display: true,
              text: title,
              font: {
                family: "YoungSerif",
                size: 20,
              },
              color: "black",
            },
            legend: {
              display: false,
            },
          },
        },
      });
    }
  }, [namesArr, scoresArr]); // Added namesArr and scoresArr as dependencies to re-render on change

  return (
    <div
      style={{
        width: "500px",
        height: "400px",
        marginRight: "60px",
        marginLeft: "60px",
        marginBottom: "60px",
        color: "black",
      }}
    >
      <canvas ref={chartContainer} width="400" height="200"></canvas>
    </div>
  );
};

export default BarGraph;
