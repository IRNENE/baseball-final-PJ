import React, { useState, useEffect } from 'react';
import styles from './type.module.css';
export default function Type({ onTypeSelect }) {
    const [types, setTypes] = useState([]);
    
    useEffect(() => {
        fetch('http://localhost:3005/api/course/type')
            .then(response => response.json())
            .then(data => {
                setTypes(data);
            })
            .catch(error => console.error('Error fetching types:', error));
    }, []);

    const handleTypeClick = (typeName) => {
        if (onTypeSelect) {
            onTypeSelect(typeName);
        }
    };

    return (
        <div className="type-container d-flex justify-content-center">
            {types.map((type) => (
                <div
                    key={type.name}
                    className={`type-item me-3  ${styles.icon}`}
                    onClick={() => handleTypeClick(type.name)}
                >
                    <img src={`/images/course/${type.img}`} alt={type.name}  />
                    <h6>{type.name}</h6>
                </div>
            ))}
        </div>
    );
}
