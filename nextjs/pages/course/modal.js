import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DateRangePicker from './DateRangePickerSM';
import SuperSimple from './priceSm';
import styles from './type.module.css';
import Price from './price';

export default function ModalComponent( {onDateChange, onPriceChange}  ) {
    // 定義狀態變量
    const [showModal, setShowModal] = useState(false);
    const initialPriceMin = 1;
    const initialPriceMax = 20000;
    const initialStartDate = null;
    const initialEndDate = null;
    const [priceMin, setPriceMin] = useState(initialPriceMin);
    const [priceMax, setPriceMax] = useState(initialPriceMax);
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);

    // 顯示彈窗
    const handleShow = () => setShowModal(true);
    
    // 關閉彈窗
    const handleClose = () => {
        setPriceMax(20000)
        setPriceMin(1)
        setEndDate(null)
        setStartDate(null)
        setShowModal(false);
        if (typeof onDateChange === 'function') {
            onDateChange(null, null);
        }
    }

    // 按下確定按鈕
    const handleConfirm = () => {
        console.log('Confirm button clicked');
        console.log('Selected price range:', priceMin, '-', priceMax);
        console.log(
            'Selected date range:',
            startDate ? startDate.toLocaleDateString() :null,
            endDate ? endDate.toLocaleDateString() : null
        );
        onPriceChange(priceMin, priceMax)
        onDateChange(startDate,endDate)
        // 您可以在此處添加其他操作，例如將選擇的值保存到服務器
        setShowModal(false);
    };

    // 計算篩選條件數
    const calculateFilterCount = () => {
        let filterCount = 0;
        // 比較選擇的價錢範圍和日期範圍與初始值
        if (priceMin !== initialPriceMin || priceMax !== initialPriceMax) {
            filterCount++;
        }
        if (
            (startDate && startDate.toLocaleDateString() !== (initialStartDate ? initialStartDate.toLocaleDateString() : '')) ||
            (endDate && endDate.toLocaleDateString() !== (initialEndDate ? initialEndDate.toLocaleDateString() : ''))
        ) {
            filterCount++;
        }
        
        return filterCount;
    };

    const handlePriceChange = (min, max) => {
        setPriceMin(min);
        setPriceMax(max);
    };

    const handleDateChange = (start, end) => {
        setStartDate(start);
        setEndDate(end);
    };

    const filterCount = calculateFilterCount();

    return (
        <>
            {/* 在按鈕中顯示篩選條件數 */}
            <Button onClick={handleShow} className={`${styles.fifbtn} text-start`}>
                <p>篩選</p>
                <h6 style={{ color: '#ee3e27' }}> 篩選 ({filterCount})</h6>
                {/* 價錢: {priceMin} - {priceMax} <br />
                日期: {startDate.toLocaleDateString()} -{' '}
                {endDate ? endDate.toLocaleDateString() : '無'} */}
            </Button>

            {showModal &&
                createPortal(
                    <Modal style={{ zIndex: '99999' }} show={showModal} fullscreen="true" onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className={`d-flex justify-content-center main-2-sun ${styles.main2Sun}`}>
                                <div className={`filter-sun ${styles.filterSun}`}>
                                    {/* 價錢範圍選擇器 */}
                                    <SuperSimple
                                        initialMin={priceMin}
                                        initialMax={priceMax}
                                        onPriceChange={handlePriceChange}
                                    />
                                    {/* 日期範圍選擇器 */}
                                    <DateRangePicker
                                        initialStartDate={startDate}   
                                        initialEndDate={endDate}
                                        onDateChange={handleDateChange}
                                    />
                                    <div className={`d-flex justify-content-between ${styles.btnBox}`}>
                                        {/* 取消按鈕 */}
                                        <button className="btn btn-secondary me-3" style={{ width: '132.5px' }} onClick={handleClose}>
                                            取消
                                        </button>
                                        {/* 確定按鈕 */}
                                        <button className="btn btn-primary ft-bold" style={{ width: '132.5px', color:'#FFF'}} onClick={handleConfirm}>
                                            確定
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>,
                    document.body
                )}
        </>
    );
}
