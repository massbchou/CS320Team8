"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
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
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function StatsGraph(props) {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [currentInterval, setInterval] = useState(7);
  const [currentLabels, setLabels] = useState(
    generateLabels(props.startDate, currentInterval),
  );

  let postsData;
  let commentsData;
  let postViewsData;
  let unansweredQuestionsData;
  let topPostsData;

  if (currentDayIndex < 0) {
    postsData = [];
    commentsData = [];
    postViewsData = [];
    unansweredQuestionsData = [];
    topPostsData = [];
  } else {
    postsData = props.data
      .slice(currentDayIndex, currentDayIndex + currentInterval)
      .map((obj) => obj.numPosts);
    commentsData = props.data
      .slice(currentDayIndex, currentDayIndex + currentInterval)
      .map((obj) => obj.numComments);
    postViewsData = props.data
      .slice(currentDayIndex, currentDayIndex + currentInterval)
      .map((obj) => obj.numPostViews);
    unansweredQuestionsData = props.data
      .slice(currentDayIndex, currentDayIndex + currentInterval)
      .map((obj) => obj.numUnansweredQuestions);
    topPostsData = props.data
      .slice(currentDayIndex, currentDayIndex + currentInterval)
      .map((obj) => obj.numTopPosts);
  }

  let options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Stats for " + props.name,
      },
    },
  };

  let graphData = {
    labels: currentLabels.map((x) => x.substring(5, 10)),
    datasets: [
      {
        label: "Posts",
        data: postsData,
        backgroundColor: "rgba(0, 224, 255, 0.75)",
      },
      {
        label: "Top Posts",
        data: topPostsData,
        backgroundColor: "rgba(0, 178, 255, 0.75)",
      },
      {
        label: "Comments",
        data: commentsData,
        backgroundColor: "rgba(0, 132, 255, 0.75)",
      },
      {
        label: "Post Views",
        data: postViewsData,
        backgroundColor: "rgba(120, 94, 255, 0.75)",
      },
      {
        label: "Unanswered Questions",
        data: unansweredQuestionsData,
        backgroundColor: "rgba(240, 56, 255, 0.75)",
      },
    ],
  };

  let months = [
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

  return (
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
      <Bar width={1000} height={500} options={options} data={graphData} />
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
            <MenuItem value={99}>All Time</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
}

function generateLabels(startingDate, interval) {
  let newLabels = [];

  for (let i = 0; i < interval; i++) {
    newLabels.push(
      new Date(new Date(startingDate).getTime() + i * (24 * 60 * 60 * 1000))
        .toISOString()
        .substring(0, 10),
    );
  }

  return newLabels;
}
