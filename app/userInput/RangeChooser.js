"use client";
import { DatePicker } from "antd";
import { useState } from "react";
const { RangePicker } = DatePicker;

function RangeChooser() {
  const [dates, setDates] = useState([]);
  // console.log(dates);

  const getYearMonthDay = (date) => {
    let year = date.getFullYear(); // Get the year (YYYY)
    let month = date.getMonth() + 1; // Get the month (0-11), adding 1 to match human-readable months
    month = month < 10 ? `0${month}` : month; // Ensure two digits for month (MM)
    let day = date.getDate(); // Get the day (1-31)
    day = day < 10 ? `0${day}` : day; // Ensure two digits for day (DD)
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  const disabledDate = (current) => {
    const currentDate = current ? current.valueOf() : 0;
    const startDate = new Date("2022-09-16").valueOf();
    const endDate = new Date("2022-12-17").valueOf();
    return currentDate < startDate || currentDate > endDate;
  };

  const handleDateChange = async (values) => {
    let beginDate = new Date(values[0].$d);
    let formattedBeginDate = getYearMonthDay(beginDate);
    let endDate = new Date(values[1].$d);
    let formattedEndDate = getYearMonthDay(endDate);

    if (values && values.length === 2) {
      setDates([formattedBeginDate, formattedEndDate]);
      const diffDays = Math.floor(
        (new Date(formattedEndDate) - new Date(formattedBeginDate)) /
          (1000 * 3600 * 24),
      );
      const date = [formattedBeginDate, formattedEndDate, diffDays];

      try {
        const response = await fetch("/api/current", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ date }),
        });
        window.location.reload(false);
        if (response.ok) {
          console.log("Date saved successfully");
          // Handle success if needed
        } else {
          console.error("Failed to save date");
          // Handle failure if needed
        }
      } catch (error) {
        console.error("Error:", error);
        // Handle other errors
      }
    } else {
      setDates([]);
    }
  };

  return (
    <div style={{ margin: '20px', cursor: "pointer" }}>
      <RangePicker onChange={handleDateChange} disabledDate={disabledDate} />
      {dates.length > 0 && (
        <div>
          Selected Dates: {dates[0]} to {dates[1]}
        </div>
      )}
    </div>
  );
}

export default RangeChooser;
