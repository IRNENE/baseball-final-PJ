import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Type from './Type'
import styles  from './type.module.css'

export default function Example({ onTypeSelect }) {
    // 初始值為 "所有"
    const [showModal, setShowModal] = useState(false);
    const [selectedType, setSelectedType] = useState('所有');

    function handleShow() {
        setShowModal(true);
    }

    // 處理選擇類別
    function handleTypeSelect(typeName) {
        // 更新 selectedType 並調用父組件的 onTypeSelect
        setSelectedType(typeName);
        onTypeSelect(typeName);
        setShowModal(false);
    }

    return (
        <>
            {/* 顯示所選的類別名稱 */}
            <Button  className={`${styles.fifbtn} text-start`} onClick={handleShow}>
                <p>類別</p>
                <h6 style={{color:'#ee3e27'}}>{selectedType}</h6>
            </Button>

            {showModal && createPortal(
                <Modal show={showModal} style={{zIndex: '99999'}} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                            <Modal.Title></Modal.Title>
                        </Modal.Header>
                    <Modal.Body>
                        <div>
                            <Type
                                onTypeSelect={handleTypeSelect}
                            />
                        </div>
                    </Modal.Body>
                </Modal>,
                document.body
            )}
        </>
    );
}
