import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import styles from './type.module.css'

export default function Sorting({onSortChange}) {
  const [selectedOption, setSelectedOption] = useState('預設')
  const [showModal, setShowModal] = useState(false)

  function handleShow() {
    setShowModal(true)
  }

  function handleClose() {
    setShowModal(false)
  }

  function handleOptionChange(event) {
    setSelectedOption(event.target.id)
    setShowModal(false)
    onSortChange(event.target.value)
  }

  return (
    <>
      <Button
        className={`${styles.fifbtn} text-start`}
        style={{ borderRightColor: 'transparent' }}
        onClick={handleShow}
      >
        <p>排序</p>
        <h6 style={{ color: '#ee3e27' }}>{selectedOption}</h6>
      </Button>

      {showModal &&
        createPortal(
          <Modal
            show={showModal}
            style={{ zIndex: '99999' }}
            onHide={handleClose}
          >
            <Modal.Header closeButton>
              <Modal.Title></Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ marginInline: 'auto' }}>
              <div className={` main-2-sun`}>
                <label>
                <input
                className="m-1"
                    type="radio"
                    name="sorting"
                    id='預設'
                    value="預設"
                    onChange={handleOptionChange}
                    checked={selectedOption === '預設'}
                  />{' '}
                  預設
                  <br />
                  <input 
                  className="m-1"
                    type="radio"
                    name="sorting"
                    id='價格:高-低'
                    value="1"
                    onChange={handleOptionChange}
                    checked={selectedOption === '價格:高-低'}
                  />{' '}
                  價格:高-低
                  
                  <br />
                  <input
                  className="m-1"
                    type="radio"
                    name="sorting"
                    id='價格:低-高'
                    value="2"
                    onChange={handleOptionChange}
                    checked={selectedOption ==='價格:低-高'}
                  />{' '}
                  價格:低-高
                  <br />
                  <input
                  className="m-1"
                    type="radio"
                    name="sorting"
                    value="3"
                    id='更新日期:新-舊'
                    onChange={handleOptionChange}
                    checked={selectedOption === '更新日期:新-舊'}
                  />{' '}
                  更新日期:新-舊
                  <br />
                  <input
                  className="m-1"
                    type="radio"
                    name="sorting"
                    id='更新日期:舊-新'
                    value="4"
                    onChange={handleOptionChange}
                    checked={selectedOption === '更新日期:舊-新'}
                  />{' '}
                  更新日期:舊-新
                </label>
              </div>
            </Modal.Body>
          </Modal>,
          document.body
        )}
    </>
  )
}
