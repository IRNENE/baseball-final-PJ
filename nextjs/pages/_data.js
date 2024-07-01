import "react-datepicker/dist/react-datepicker.css";
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { addDays } from 'date-fns';

const DateRangePicker = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    
    const onChange = (dates) => {
      const [start, end] = dates;
      setStartDate(start);
      setEndDate(end);
    };
    
    return (
      <DatePicker
        swapRange
        selected={startDate}
        onChange={onChange}
        startDate={startDate}
        endDate={endDate}
        excludeDates={[addDays(new Date(), 1), addDays(new Date(), 5)]}
        selectsRange
        selectsDisabledDaysInRange
        inline
      />
    );
  };
  
  export default DateRangePicker;