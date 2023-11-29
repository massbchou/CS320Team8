'use client';
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarGraph = ({ namesArr, scoresArr, title }) => {
  const chartContainer = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (chartContainer.current) {
      const ctx = chartContainer.current.getContext('2d');

      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: namesArr.slice(0, scoresArr.length),
          datasets: [{
            label: 'Scores',
            data: scoresArr,
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2,
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            title: {
              display: true,
              text: title,
              font: {
                size: 20
              }
            },
            legend: {
              display: false
            }
          }
        }
      });
    }
  }, [namesArr, scoresArr]); // Added namesArr and scoresArr as dependencies to re-render on change

  return (
    <div>
      <canvas ref={chartContainer} width="400" height="200"></canvas>
    </div>
  );
};

export default BarGraph;