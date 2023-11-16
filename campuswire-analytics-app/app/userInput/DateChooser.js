"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateChooser = () => {
  const initialStartDate = new Date("2022-12-16");
  const [startDate, setStartDate] = useState(new Date(initialStartDate));

  const handleDateChange = async (date) => {
    setStartDate(date);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${year}-${month}-${day}`; // Format: "YYYY-MM-DD"
    console.log(formattedDate);
    
    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: formattedDate }),
      });
      window.location.reload(false);
      if (response.ok) {
        console.log('Date saved successfully');
        // Handle success if needed
      } else {
        console.error('Failed to save date');
        // Handle failure if needed
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle other errors
    }
  };

  return (
    <div>
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        minDate={new Date("2022-09-15")}
        maxDate={new Date("2022-12-15")}
      />
    </div>
  );
};

export default DateChooser;