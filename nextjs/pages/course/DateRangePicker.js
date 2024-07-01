import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateRangePicker = ({ onDateChange }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);

    const onChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    const handleConfirmClick = () => {
        if (typeof onDateChange === 'function') {
            onDateChange(startDate, endDate);
        }
       
    };

    const handleCancelClick = () => {
        // 重置 startDate 和 endDate 為 null
        setStartDate(null);
        setEndDate(null);
        
        // 如果 onDateChange 是函數，傳遞 null 值
        if (typeof onDateChange === 'function') {
            onDateChange(null, null);
        }
    };

    return (
        <>
            <div  className="mb-3" style={{ margin: '5px' }}>
                <input
                    style={{ width: '130px', border: '1px solid #DDE2E4', borderRadius: '5%', height: '30px', marginRight: '10px' }}
                    type="text"
                    value={startDate ? startDate.toLocaleDateString() : ''}
                    readOnly
                />
                -
                <input
                    style={{ width: '130px', border: '1px solid #DDE2E4', borderRadius: '5%', height: '30px', marginLeft: '10px' }}
                    type="text"
                    value={endDate ? endDate.toLocaleDateString() : ''}
                    readOnly
                />
            </div>

            <DatePicker
                selected={startDate}
                onChange={onChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                inline
            />

            <div className="mt-3 mb-5 d-flex justify-content-between" style={{ width: '100%' }}>
                <button
                    className="btn btn-secondary me-3"
                    style={{ width: '132.5px', marginRight: '10px' }}
                    onClick={handleCancelClick}
                >
                    取消
                </button>
                <button
                    className="btn btn-primary"
                    style={{ width: '132.5px', color: '#fff' }}
                    onClick={handleConfirmClick}
                >
                    確認
                </button>
            </div>
        </>
    );
};

export default DateRangePicker;
