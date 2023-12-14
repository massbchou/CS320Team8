"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

/**
 * Creates a BarGraph component displaying a bar chart using Chart.js library.
 * @param {Array} namesArr - Array containing names for labels on the X-axis.
 * @param {Array} scoresArr - Array containing data values for the bars.
 * @param {string} title - Title of the bar chart.
 * @param {string} font - Font family for the title.
 */
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
  }, [namesArr, scoresArr]);

  return (
    <div
      style={{
        width: "50%",
        height: "500px",
        color: "black",
      }}
    >
      <canvas ref={chartContainer} width="400" height="300"></canvas>
    </div>
  );
};

export default BarGraph;
