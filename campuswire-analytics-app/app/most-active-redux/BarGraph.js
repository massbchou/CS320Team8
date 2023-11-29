'use client';
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarGraph = () => {
  const chartContainer = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (chartContainer.current) {
      const names = [
        'Linda', 'Alexander',  'Jessica',
         'Brian', 'Christopher'
      ];

      const scores = [74, 37, 61, 62, 24];

      const ctx = chartContainer.current.getContext('2d');

      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: names.slice(0, scores.length),
          datasets: [{
            label: 'Scores',
            data: scores,
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
              text: 'Scores by Person',
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
  }, []);

  return (
    <div>
      <canvas ref={chartContainer} width="400" height="200"></canvas>
    </div>
  );
};

export default BarGraph;
