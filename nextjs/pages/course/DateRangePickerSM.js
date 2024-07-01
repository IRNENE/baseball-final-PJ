import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // 导入 DatePicker 的样式

const DateRangePicker = ({ initialStartDate, initialEndDate, onDateChange }) => {
    // 使用传递的初始值
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);

    // 日期选择变化时的回调
    const handleDateChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        // 调用父组件的回调函数，将新选择的日期传递给父组件
        onDateChange(start, end);
    };

    return (
        <>
            <div style={{ margin: '5px' }}>
            <h6 style={{ marginBottom: '10px' }}>日期</h6>
                <input
                    style={{ width: '130px', border: '1px solid #DDE2E4', borderRadius: '5%', height: '30px', marginRight: '10px' }}
                    type='text'
                    value={startDate ? startDate.toLocaleDateString(): ''}
                    readOnly
                />
                -
                <input
                    style={{ width: '130px', border: '1px solid #DDE2E4', borderRadius: '5%', height: '30px', marginLeft: '10px' }}
                    type='text'
                    value={endDate ? endDate.toLocaleDateString() : ''}
                    readOnly
                />
            </div>
            <DatePicker
                selected={startDate}
                onChange={handleDateChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                inline
            />
        </>
    );
};

export default DateRangePicker;
