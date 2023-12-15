"use client";
import { DatePicker } from "antd";
import { useState } from "react";
const { RangePicker } = DatePicker;

/**
 * Component for selecting a date range and handling selected dates.
 */
function RangeChooser() {
  // State to manage selected dates
  const [dates, setDates] = useState([]);

  /**
   * Formats the date as 'YYYY-MM-DD'.
   * @param {Date} date - The input date object.
   * @returns {string} The formatted date string.
   */
  const getYearMonthDay = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    let day = date.getDate();
    day = day < 10 ? `0${day}` : day;
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  /**
   * Disables dates outside the range of 2022-09-15 to 2022-12-16.
   * @param {Date} current - The current date.
   * @returns {boolean} True if the date is disabled, otherwise false.
   */
  const disabledDate = (current) => {
    const currentDate = current ? current.valueOf() : 0;
    const startDate = new Date("2022-09-15").valueOf();
    const endDate = new Date("2022-12-16").valueOf();
    return currentDate < startDate || currentDate > endDate;
  };

  /**
   * Handles the change of selected dates.
   * @param {array} values - The selected date values.
   */
  const handleDateChange = async (values) => {
    // Extract begin and end dates and format them
    let beginDate = new Date(values[0].$d);
    let formattedBeginDate = getYearMonthDay(beginDate);
    let endDate = new Date(values[1].$d);
    let formattedEndDate = getYearMonthDay(endDate);

    if (values && values.length === 2) {
      // Set selected dates
      setDates([formattedBeginDate, formattedEndDate]);

      // Calculate the difference in days between dates
      const diffDays = Math.floor(
        (new Date(formattedEndDate) - new Date(formattedBeginDate)) /
          (1000 * 3600 * 24),
      );

      const date = [formattedBeginDate, formattedEndDate, diffDays];

      try {
        // Send a POST request with the selected dates
        const response = await fetch("/api/current", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ date }),
        });
        // Reload the page upon successful submission
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
    <div style={{ margin: "20px", cursor: "pointer" }}>
      {/* Date range picker component */}
      <RangePicker onChange={handleDateChange} disabledDate={disabledDate} />
      {/* Display selected dates */}
      {dates.length > 0 && (
        <div>
          Selected Dates: {dates[0]} to {dates[1]}
        </div>
      )}
    </div>
  );
}

export default RangeChooser;
