import React, { useState } from 'react';
import { Range, getTrackBackground } from 'react-range';
import styles from '@/pages/course/price.module.css';

const STEP = 1;
const MIN = 1;
const MAX = 20000;
const INITIAL_VALUES = [1, 20000];

function Price({ onPriceChange, onPriceNull }) {
    // 定义临时价格范围状态
    const [tempValues, setTempValues] = useState(INITIAL_VALUES);
    // 定义最终价格范围状态
    const [values, setValues] = useState(INITIAL_VALUES);

    // 处理价格范围变化的函数
    const handleTempChange = (newValues) => {
        setTempValues(newValues);
    };

    // 处理确认按钮点击事件的函数
    const handleConfirmClick = () => {
        // 将临时价格范围设置为最终价格范围
        setValues(tempValues);
        // 调用父组件的回调函数，将最终价格范围传递给父组件
        onPriceChange(tempValues[0], tempValues[1]);
    };

    // 处理取消按钮点击事件的函数
    const handleCancelClick = () => {
        // 将临时价格范围重置为初始值
        setTempValues(INITIAL_VALUES);
        // 重置最终价格范围
        setValues(INITIAL_VALUES);
        // 调用父组件的回调函数
        onPriceNull();
    };

    // 处理输入框值变化的函数
    const handleInputChange = (index, event) => {
        const newValue = parseInt(event.target.value, 10);
        // 验证输入值是否在允许的范围内
        if (!isNaN(newValue) && newValue >= MIN && newValue <= MAX) {
            const newValues = [...tempValues];
            newValues[index] = newValue;
            setTempValues(newValues);
        }
    };

    return (
        <div style={{ marginBottom: '30px' }}>
            <h6 style={{ marginBottom: '10px' }}>價格</h6>
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="number"
                    value={tempValues[0]}
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
                    value={tempValues[1]}
                    onChange={(event) => handleInputChange(1, event)}
                    style={{
                        width: '130px',
                        border: '1px solid #DDE2E4',
                        borderRadius: '5%',
                        height: '30px',
                        marginLeft  : '10px',
                    }}
                />
            </div>
            <Range
                values={tempValues}
                step={STEP}
                min={MIN}
                max={MAX}
                onChange={handleTempChange}
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
                                    values: tempValues,
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
                            {tempValues[index]}
                        </span>
                    </div>
                )}
            />
            <div
                className="mt-5 d-flex justify-content-between"
                style={{ width: '100%' }}
            >
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
        </div>
    );
}

export default Price;
