"use client";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DateChooser() {
  const initialStartDate = new Date("2022-12-16");
  const [startDate, setStartDate] = useState(new Date(initialStartDate));
  const minDate = new Date("2022-09-15");
  const maxDate = new Date("2022-12-16");

  const handleDateSelect = (date) => {
    setStartDate(date);
    onDateSelect(date); // Trigger the callback with the selected date
  };

  return (
    <div>
      <DatePicker
        selected={startDate}
        onChange={handleDateSelect}
        minDate={minDate}
        maxDate={maxDate}
      />
    </div>
  );
}
