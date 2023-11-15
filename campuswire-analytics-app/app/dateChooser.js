'use client';
import { useState } from "react";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateChooser = () => {
    const initialStartDate = new Date("2022-12-16");
    const [startDate, setStartDate] = useState(new Date(initialStartDate));
  
    const handleDateChange = async (date) => {
      setStartDate(date);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const formattedDate = ""+month+"-"+ day + "-"+ year;
      console.log(formattedDate);
      try {
        console.log("made it inside try block");
        const response = await fetch('/api/saveDate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userInputDate: formattedDate}),
        });
  
        if (response.ok) {
          console.log('Date saved successfully!');
          // Handle success, e.g., show a success message to the user
        } else {
          console.error('Error saving date:', response.statusText);
          // Handle error, e.g., display an error message
        }
      } catch (error) {
        console.error('Error saving date:', error);
        // Handle error, e.g., display an error message
      }
    };
  
    return (
      <div>
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          minDate={new Date('2022-09-15')}
          maxDate={new Date('2022-12-15')}
        />
      </div>
    );
  };
  
  export default DateChooser;