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

// returns a graph showing statistics for some selected user over time, or over the course of the semester
export default function StatsGraph(props) {
  // initialize variables with useState to be able to modify them based on user input
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  // an array index value representing first day currently being displayed
  const [currentInterval, setInterval] = useState(7);
  // a value that keeps track of the currently selected time denomination (7 for weekly, 30 for monthly, the array's total length for all time)
  const [currentLabels, setLabels] = useState(
    generateLabels(props.startDate, currentInterval),
  );
  // an array of strings representing the currently displayed graph labels (ex. ["2022-09-20", "2022-09-21", "2022-09-22", etc.])
  const [showIntervalButtons, setShowIntervalButtons] = useState(true);
  // a boolean value that toggles the visibility of the buttons (buttons hide when 'all time' is selected)

  let postsData;
  let commentsData;
  let postViewsData;
  let unansweredQuestionsData;
  let topPostsData;
  // init variables for all relevent metrics

  if (currentDayIndex < 0) {
    // if the currentDayIndex is less than 0 (outside of the scope of that user's activity), display no data
    postsData = [];
    commentsData = [];
    postViewsData = [];
    unansweredQuestionsData = [];
    topPostsData = [];
  } else {
    // otherwise, display data as normal
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

  // chartJS graph options
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

  // chartJS graph data
  let graphData = {
    labels: currentLabels.map((x) => x.substring(5, 10)), // take all current labels and truncate the year off of them '2022-09-20' => '09-20'
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
      {showIntervalButtons ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            height: "50px",
          }}
        >
          <Button
            onClick={function () {
              // go to previous time interval, generate new graph labels
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
              // go to next time interval, generate new graph labels
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
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50px",
          }}
        >
          <div>All Time</div>
        </div>
      )}
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
              // on interval switch:
              if (event.target.value === props.data.length) {
                // if the target value is 'All Time':
                setCurrentDayIndex(0); // set the setCurrentDayIndex to the first day of that user's activity
                setShowIntervalButtons(false); // hide the interval switching buttons
                setLabels(
                  generateLabels(new Date(props.startDate), event.target.value),
                );
              } else {
                setShowIntervalButtons(true); // otherwise, show the buttons
                setLabels(
                  generateLabels(
                    new Date(currentLabels[0]),
                    event.target.value,
                  ),
                );
              }
              setInterval(event.target.value);
              // switch the interval and generate the new labels
            }}
          >
            <MenuItem value={7}>Weekly</MenuItem>
            <MenuItem value={30}>Monthly</MenuItem>
            <MenuItem value={props.data.length}>All Time</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
}

/**
 * Generates new labels for the graph considering the starting date and the interval
 *
 * Example:
 * generateLabels(Date object for '2022-09-20', 7) =>
 * ['2022-09-20', '2022-09-21', '2022-09-22', '2022-09-23', '2022-09-24', '2022-09-25', '2022-09-26']
 *
 * @param {Date} startingDate
 * @param {7 | 30 | props.data.length} interval
 * @returns {string[]} array of strings representing the new graph labels
 */
function generateLabels(startingDate, interval) {
  let newLabels = [];

  for (let i = 0; i < interval; i++) {
    newLabels.push(
      new Date(startingDate.getTime() + i * (24 * 60 * 60 * 1000))
        .toISOString()
        .substring(0, 10),
    );
  }

  return newLabels;
}
