import React, { useState } from 'react';
import { Range, getTrackBackground } from 'react-range';

const STEP = 1;
const MIN = 1;
const MAX = 20000;

function SuperSimple({ initialMin, initialMax, onPriceChange }) {
    // 定义价格范围的状态
    const [values, setValues] = useState([initialMin, initialMax]);

    // 处理价格范围变化的函数
    const handlePriceChange = (newValues) => {
        setValues(newValues);
        // 调用父组件的回调函数
        onPriceChange(newValues[0], newValues[1]);
    };

    // 处理输入框值变化的函数
    const handleInputChange = (index, event) => {
        const newValue = parseFloat(event.target.value);
        // 确保输入的值在范围内，并且不是 NaN
        if (!isNaN(newValue) && newValue >= MIN && newValue <= MAX) {
            const newValues = [...values];
            newValues[index] = newValue;
            setValues(newValues);
            // 调用父组件的回调函数
            onPriceChange(newValues[0], newValues[1]);
        }
    };

    return (
        <div style={{ marginBottom: '30px' }}>
            <h6 style={{ marginBottom: '2px' }}>價格</h6>
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="number"
                    value={values[0]}
                    // 为输入框添加 onChange 事件处理程序
                    onChange={(event) => handleInputChange(0, event)}
                    style={{
                        width: '130px',
                        border: '1px solid #DDE2E4',
                        borderRadius: '5%',
                        height: '30px',
                        marginRight: '10px',
                    }}
                />
                {' - '}
                <input
                    type="number"
                    value={values[1]}
                    // 为输入框添加 onChange 事件处理程序
                    onChange={(event) => handleInputChange(1, event)}
                    style={{
                        width: '130px',
                        border: '1px solid #DDE2E4',
                        borderRadius: '5%',
                        height: '30px',
                        marginRight: '10px',
                    }}
                />
            </div>
            <Range
                values={values}
                step={STEP}
                min={MIN}
                max={MAX}
                onChange={handlePriceChange}
                allowOverlap={false}
                renderTrack={({ props, children }) => (
                    <div
                        onMouseDown={props.onMouseDown}
                        onTouchStart={props.onTouchStart}
                        style={{
                            ...props.style,
                            height: '36px',
                            display: 'flex',
                            width: '100%',
                        }}
                    >
                        <div
                            ref={props.ref}
                            style={{
                                height: '6px',
                                width: '100%',
                                borderRadius: '4px',
                                background: getTrackBackground({
                                    values,
                                    colors: ['#ccc', '#EE3E27', '#ccc'],
                                    min: MIN,
                                    max: MAX,
                                }),
                                alignSelf: 'center',
                            }}
                        >
                            {children}
                        </div>
                    </div>
                )}
                renderThumb={({ props, index }) => (
                    <div
                        {...props}
                        style={{
                            ...props.style,
                            height: '30px',
                            width: '30px',
                            borderRadius: '50%',
                            backgroundColor: '#FFF',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: '0px 2px 6px #AAA',
                        }}
                    >
                        <span style={{ position: 'absolute', top: '30px' }}>
                            {values[index]}
                        </span>
                    </div>
                )}
            />
        </div>
    );
}

export default SuperSimple;
