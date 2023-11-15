'use client';
import { useState } from "react";

const dateChooser = () => {
    const [selectedDate, setSelectedDate] = useState('');
  
    const handleDateChange = async (date) => {
      setSelectedDate(date);
  
      try {
        const response = await fetch('/api/saveDate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userInputDate: date }),
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
          selected={selectedDate}
          onChange={handleDateChange}
          minDate={new Date('2022-09-15')}
          maxDate={new Date('2022-12-15')}
        />
      </div>
    );
  };
  
  export default dateChooser;