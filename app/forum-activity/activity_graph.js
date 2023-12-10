"use client";
import mp from "../missingParameter";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import React from "react";
import { useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

ChartJS.defaults.font.size = "15px";
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

function generateLabels(startDate, interval) {
  let newLabels = [];

  for (let i = 0; i < interval; i++) {
    newLabels.push(
      new Date(new Date(startDate).getTime() + i * (24 * 60 * 60 * 1000))
        .toISOString()
        .substring(0, 10),
    );
  }

  return newLabels;
}

/**
 * Renders a line graph depicting forum activity
 * x-axis: timeline
 * y-axis: forum activity score
 *
 * @returns jsx block to add to page.js
 */
export function ActivityGraph({ data, startDate } = mp()) {
  /**
   * LineChart takes in data: {labels: str[], datasets: {
   *   data: number[]
   *   ...for more properties see https://www.chartjs.org/docs/latest/charts/line.html
   * }}
   */
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [currentInterval, setInterval] = useState(7);
  const [currentLabels, setLabels] = useState(
    generateLabels(startDate, currentInterval),
  );

  let postsData;
  let commentsData;
  let isAllTime = false;

  if(currentInterval == data.length){
    isAllTime = true;
  }

  if (currentDayIndex < 0) {
    postsData = [];
    commentsData = [];
  } else {
    postsData = data
      .slice(currentDayIndex, currentDayIndex + currentInterval)
      .map((obj) => obj.numPosts);
    commentsData = data
      .slice(currentDayIndex, currentDayIndex + currentInterval)
      .map((obj) => obj.numComments);
  }

  let chartData = {
    labels: currentLabels.map((x) => x.substring(5, 10)),
    datasets: [
      {
        label: "Posts",
        data: postsData,
        borderColor: "rgba(240, 56, 255, 0.5)",
        backgroundColor: "rgba(240, 56, 255)",
      },
      {
        label: "Comments",
        data: commentsData,
        borderColor: "rgba(0, 132, 255, 0.5)",
        backgroundColor: "rgba(0, 132, 255)",
      },
      //dark blue: rgba(0, 132, 255, 0.75)
      //cyan: rgba(0, 224, 255, 0.75)
      //pink: rgba(240, 56, 255)
    ],
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  console.log(chartData);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Forum Activity",
      },
    },
  };
  return (
    // <div
    //   style={{
    //     backgroundImage:
    //       "linear-gradient(rgba(0, 224, 255, 0.45), rgba(240, 56, 255, 0.55))",
    //     borderRadius: "10px",
    //     padding: "20px",
    //     margin: "20px",
    //     width: "25%",
    //   }}
    // >
    //   <div
    //     style={{
    //       display: "flex",
    //       justifyContent: "center",
    //       alignItems: "center",
    //     }}
    //   >
    //     <div
    //       style={{
    //         textAlign: "center",
    //         // fontFamily: youngSerif,
    //         fontSize: "20px",
    //         backgroundColor: "rgba(255, 255, 255, 0.70)",
    //         borderRadius: "10px",
    //         width: "100%",
    //         padding: "6px",
    //         marginBottom: "9px",
    //         marginRight: "9px",
    //       }}
    //     >
    //       {"Forum Activity"}
    //     </div>
    //   </div>
    //   <Line options={options} data={chartData} />
    // </div>
    <div
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 224, 255, 0.30), rgba(240, 56, 255, 0.30))",
        border: "2px",
        borderStyle: "solid",
        borderRadius: "10px",
        padding: "20px",
        margin: "20px",
      }}
    >
      <Line width={1000} height={500} options={options} data={chartData} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          onClick={function () {
            setCurrentDayIndex(currentDayIndex - currentInterval);
            setLabels(
              generateLabels(
                new Date(
                  new Date(currentLabels[0]).getTime() -
                    currentInterval * 24 * 60 * 60 * 1000,
                ),
                currentInterval,
              ),
            );
          }}
          style={{
            display: isAllTime ? "none" : null,
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            marginTop: "10px",
          }}
        >
          <ChevronLeftIcon />
        </Button>
        <div style={{ marginTop: "10px" }}>
          {currentInterval === 7
            ? "Week of " + currentLabels[0].substring(5, 10)
            : currentInterval === 30
            ? months[new Date(currentLabels[0].substring(0, 10)).getMonth()] +
              " - " +
              months[
                new Date(
                  currentLabels[currentInterval - 1].substring(0, 10),
                ).getMonth()
              ]
            : currentInterval === 99
            ? "All Time"
            : ""}
        </div>
        <Button
          onClick={function () {
            setCurrentDayIndex(currentDayIndex + currentInterval);
            setLabels(
              generateLabels(
                new Date(
                  new Date(currentLabels[0]).getTime() +
                    currentInterval * 24 * 60 * 60 * 1000,
                ),
                currentInterval,
              ),
            );
          }}
          style={{
            display: isAllTime ? "none" : null,
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            marginTop: "10px",
          }}
        >
          <ChevronRightIcon />
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "3px",
        }}
      >
        <FormControl>
          <InputLabel>Interval</InputLabel>
          <Select
            labelId="select-interval"
            value={currentInterval}
            label="Interval"
            onChange={(event) => {
              setInterval(event.target.value);
              if(event.target.value === data.length){ // if the target value is 'All Time':
                setCurrentDayIndex(0); // set the setCurrentDayIndex to the first day of that user's activity
              }
              setLabels(
                generateLabels(
                  new Date(currentLabels[0]).getTime(),
                  event.target.value,
                ),
              );
            }}
          >
            <MenuItem value={7}>Weekly</MenuItem>
            <MenuItem value={30}>Monthly</MenuItem>
            <MenuItem value={data.length}>All Time</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
}
