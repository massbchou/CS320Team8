'use client'
import React from 'react';
import { useState } from 'react';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js';
import { Bar } from 'react-chartjs-2'
import { Young_Serif } from 'next/font/google';
const youngSerif = Young_Serif({
    subsets: ['latin'],
    weight: '400',
  });


//ChartJS.defaults.font.family = 'youngSerif';
ChartJS.defaults.font.size = '15px';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StatsGraph(props){
    let options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'User #1 Statistics',
          },
        },
      };
      
      let labels = ['12/9', '12/10', '12/11', '12/12', '12/13', '12/14', '12/15'];
      
      let data = {
        labels,
        datasets: [
          {
            label: 'Top Posts',
            data: props.chartData.numTopPosts,
            backgroundColor: 'rgba(0, 224, 255, 0.75)',
          },
          {
            label: 'Trending Posts',
            data: props.chartData.numTrendingPosts,
            backgroundColor: 'rgba(0, 178, 255, 0.75)',
          },
          {
            label: 'Comments',
            data: props.chartData.numComments,
            backgroundColor: 'rgba(0, 132, 255, 0.75)',
          },
          {
            label: 'Post Views',
            data: props.chartData.numPostViews,
            backgroundColor: 'rgba(120, 94, 255, 0.75)',
          },
          {
            label: 'Unanswered Questions',
            data: props.chartData.numUnansweredQuestions,
            backgroundColor: 'rgba(240, 56, 255, 0.75)',
          },
        ],
      };

      const [dataSet, setData] = useState(data);
      const [chartOptions, setOptions] = useState(options);

      return <div style={{backgroundImage: 'linear-gradient(rgba(0, 224, 255, 0.30), rgba(240, 56, 255, 0.30))', border:'2px', borderStyle:'solid', borderRadius: '10px', padding: '20px', margin: '20px', width: '50%'}}>
        <Bar options={chartOptions} data={dataSet}/>
      </div>
}