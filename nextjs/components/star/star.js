import React, { useState } from 'react'
// 導入.module.css檔案
import styles from './star.module.css'

export default function Star(props) {
    const {value, onChange} = props
        // 點按時的評分，一開始是0分代表沒有評分
        const [rating, setRating] = useState(value)

        // 滑鼠游標懸停(hover)時使用，一開始是0分代表沒有評分
        const [hoverRating, setHoverRating] = useState(0)

    const handleClick = (score) => {
        setRating(score);
        onChange(score);
        console.log(score) //調用父層傳入的onChange函數，將新的星值傳送给父層
    };

    return (
        <>
            <div>
                {/* 
          這裡使用簡易建立5個陣列1...N的語法，可以參考:
          https://github.com/orgs/mfee-react/discussions/50 
        */}
                {Array(5)
                    .fill(1)
                    .map((v, i) => {
                        // 每個按鈕的分數，相當於索引+1
                        const score = i + 1

                        return (
                            <button
                                key={i}
                                className={styles['star-btn']}
                                onClick={() => {
                                    // 點按後設定分數
                                    handleClick(score)
                                }}
                                onMouseEnter={() => {
                                    // 滑鼠游標移入時設定分數
                                    setHoverRating(score)
                                }}
                                onMouseLeave={() => {
                                    // 滑鼠游標移出時設定分數為0
                                    setHoverRating(0)
                                }}
                            >
                                <span
                                    // 如果這個星星的分數(score)小於等於目前的評分(rating)，或小於目前的滑鼠游標懸停(hover)評分，則套用亮起樣式
                                    className={
                                        score <= rating || score <= hoverRating
                                            ? styles['on']
                                            : styles['off']
                                    }
                                >
                                    &#9733;
                                </span>
                            </button>
                        )
                    })}
            </div>
        </>
    )
}