import React, { useState, useEffect } from 'react'
// import '@/node_modules/bootstrap/dist/css/bootstrap.min.css'
import styles from './product.module.css'


export default function Product() {


    useEffect(() => {
        // 要document物件出現後才能導入 bootstrap的js函式庫
        import('@/node_modules/bootstrap/dist/js/bootstrap')
    }, [])

    const [classifType, setClassifType] = useState('分類');

    const [sortType, setSortType] = useState('排序');



    //Productclass2///////////////////////////////////////////////////////////////////////////////////////////////

      const [batType, setBatType] = useState('球棒');
      const [isAccordionOpen, setIsAccordionOpen] = useState(false);

      const handleBatSelect = (type) => {
          setBatType(type);
          setIsAccordionOpen(false); // Collapse the accordion after selection
      };
      const [ballType, setBallType] = useState('球');
      const [isAccordionOpen1, setIsAccordionOpen1] = useState(false);

      const handleBallSelect = (type) => {
          setBallType(type);
          setIsAccordionOpen1(false); // Collapse the accordion after selection
      };
      
      const [hatType, setHatType] = useState('帽子');
      const [isAccordionOpen2, setIsAccordionOpen2] = useState(false);

      const handleHatSelect = (type) => {
          setHatType(type);
          setIsAccordionOpen2(false); // Collapse the accordion after selection
      };
      const [clothType, setClothType] = useState('球衣');
      const [isAccordionOpen3, setIsAccordionOpen3] = useState(false);

      const handleClothSelect = (type) => {
          setClothType(type);
          setIsAccordionOpen3(false); // Collapse the accordion after selection
      };
      const [glovesType, setGlovesType] = useState('手套');
      const [isAccordionOpen4, setIsAccordionOpen4] = useState(false);

      const handleGlovesSelect = (type) => {
          setGlovesType(type);
          setIsAccordionOpen4(false); // Collapse the accordion after selection
      };
      const [pantsType, setPantsType] = useState('球褲');
      const [isAccordionOpen5, setIsAccordionOpen5] = useState(false);

      const handlePantsSelect = (type) => {
          setPantsType(type);
          setIsAccordionOpen5(false); // Collapse the accordion after selection
      };
      const [sockType, setSockType] = useState('襪子');
      const [isAccordionOpen6, setIsAccordionOpen6] = useState(false);

      const handleSockSelect = (type) => {
          setSockType(type);
          setIsAccordionOpen6(false); // Collapse the accordion after selection
      };
      const [shoeType, setShoeType] = useState('球鞋');
      const [isAccordionOpen7, setIsAccordionOpen7] = useState(false);

      const handleShoeSelect = (type) => {
          setShoeType(type);
          setIsAccordionOpen7(false); // Collapse the accordion after selection
      };
      const [equipType, setEquipType] = useState('裝備');
      const [isAccordionOpen8, setIsAccordionOpen8] = useState(false);

      const handleEquipSelect = (type) => {
          setEquipType(type);
          setIsAccordionOpen8(false); // Collapse the accordion after selection
      };
      const [gearType, setGearType] = useState('護具');
      const [isAccordionOpen9, setIsAccordionOpen9] = useState(false);

      const handleGearSelect = (type) => {
          setGearType(type);
          setIsAccordionOpen9(false); // Collapse the accordion after selection
      };
      ///////////////////////////////////////////////////////////////////////////////


    return (


        <>


            <div className="container ">
                <div className="row">
                    

                    <div className="col-12 col-sm-10 mt-5">

                    <div className={`boxbox3  ${styles.boxbox3}`}>
                            <div className={`child light  ${styles.child} ${styles.light}`}>
                                <a href="#" className={`noUnderline ${styles.noUnderline}`} data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    <p className={`child1  ${styles.child1}`}>分類</p>
                                </a>
                                <h6 className={`child2  ${styles.child2}`}>{classifType}</h6>
                            </div>
                            <div className={`child light  ${styles.child}  ${styles.light}`}>
                                <a href="#" className={`noUnderline ${styles.noUnderline}`} data-bs-toggle="modal" data-bs-target="#exampleModal1">
                                    <p className={`child1  ${styles.child1}`}>篩選</p></a>
                                <h6 className={`child2  ${styles.child2}`}>篩選[{selectedFiltersCount}]</h6>
                            </div>
                            <div className={`child  ${styles.child}`}>
                                <a href="#" className={`noUnderline ${styles.noUnderline}`} data-bs-toggle="modal" data-bs-target="#exampleModal2">
                                    <p className={`child1  ${styles.child1}`}>排序</p></a>
                                <h6 className={`child2  ${styles.child2}`}>{sortType}</h6>
                            </div>
                        </div>

                        {/* 手機版彈窗 */}
                        <div
                            className={`modal fade ${styles.win5}`}
                            id="exampleModal"
                            tabIndex={-1}
                            aria-labelledby="exampleModalLabe"
                            aria-hidden="true"
                        >
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className={`accordion ${styles.accordion}`} id="accordionExample">
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingOne">
                                                <button
                                                    className="accordion-button"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#collapseOne, #collapseOne2 "


                                                    onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                                                    aria-expanded={isAccordionOpen}
                                                    aria-controls="collapseOne collapseOne2"
                                                >
                                                    {batType}
                                                </button>
                                            </h2>
                                            <div
                                                id="collapseOne"
                                                className={`accordion-collapse collapse ${isAccordionOpen ? 'show' : ''}`}

                                                aria-labelledby="headingOne"
                                                data-bs-parent="#accordionExample"
                                            >
                                                <div className="accordion-body" onClick={() => handleBatSelect('鋁棒')}>
                                                    鋁棒
                                                </div>
                                            </div>
                                            <div
                                                id="collapseOne2"
                                                className={`accordion-collapse collapse ${isAccordionOpen ? 'show' : ''}`}
                                                aria-labelledby="headingOne"
                                                data-bs-parent="#accordionExample"
                                            >
                                                <div className="accordion-body" onClick={() => handleBatSelect('木棒')}>
                                                    木棒
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingTwo">
                                                <button
                                                    className="accordion-button collapsed"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#collapseTwo,#collapseTwo2"

                                                    onClick={() => setIsAccordionOpen1(!isAccordionOpen1)}
                                                    aria-expanded={isAccordionOpen1}
                                                    aria-controls="collapseTwo collapseTwo2"

                                                >
                                                    {ballType}
                                                </button>
                                            </h2>
                                            <div
                                                id="collapseTwo"
                                                className={`accordion-collapse collapse ${isAccordionOpen1 ? 'show' : ''}`}

                                                aria-labelledby="headingTwo"
                                                data-bs-parent="#accordionExample"
                                            >
                                                <div className="accordion-body" onClick={() => handleBallSelect('硬式')}>
                                                    硬式
                                                </div>
                                            </div>
                                            <div
                                                id="collapseTwo2"
                                                className={`accordion-collapse collapse ${isAccordionOpen1 ? 'show' : ''}`}

                                                aria-labelledby="headingTwo"
                                                data-bs-parent="#accordionExample"
                                            >
                                                <div className="accordion-body" onClick={() => handleBallSelect('軟式')}>
                                                    軟式
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingThree">
                                                <button
                                                    className="accordion-button collapsed"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#collapseThree,#collapseThree2"

                                                    onClick={() => setIsAccordionOpen2(!isAccordionOpen2)}
                                                    aria-expanded={isAccordionOpen2}
                                                    aria-controls="collapseThree collapseThree2"

                                                >
                                                    {hatType}
                                                </button>
                                            </h2>
                                            <div
                                                id="collapseThree"
                                                className={`accordion-collapse collapse ${isAccordionOpen2 ? 'show' : ''}`}

                                                aria-labelledby="headingThree"
                                                data-bs-parent="#accordionExample"
                                            >
                                                <div className="accordion-body" onClick={() => handleHatSelect('球帽')}>
                                                    球帽
                                                </div>
                                            </div>
                                            <div
                                                id="collapseThree2"
                                                className={`accordion-collapse collapse ${isAccordionOpen2 ? 'show' : ''}`}

                                                aria-labelledby="headingThree"
                                                data-bs-parent="#accordionExample"
                                            >
                                                <div className="accordion-body" onClick={() => handleHatSelect('打擊頭盔')}>
                                                    打擊頭盔
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingfour">
                                                <button
                                                    className="accordion-button collapsed"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#collapsefour,#collapsefour2"


                                                    onClick={() => setIsAccordionOpen3(!isAccordionOpen3)}
                                                    aria-expanded={isAccordionOpen3}
                                                    aria-controls="collapsefour collapsefour2"
                                                >
                                                    {clothType}
                                                </button>
                                            </h2>
                                            <div
                                                id="collapsefour"
                                                className={`accordion-collapse collapse ${isAccordionOpen3 ? 'show' : ''}`}

                                                aria-labelledby="headingfour"
                                                data-bs-parent="#accordionExample"
                                            >
                                                <div className="accordion-body" onClick={() => handleClothSelect('長袖')}>
                                                    長袖
                                                </div>
                                            </div>
                                            <div
                                                id="collapsefour2"
                                                className={`accordion-collapse collapse ${isAccordionOpen3 ? 'show' : ''}`}

                                                aria-labelledby="headingfour"
                                                data-bs-parent="#accordionExample"
                                            >
                                                <div className="accordion-body" onClick={() => handleClothSelect('短袖')}>
                                                    短袖
                                                </div>
                                            </div>
                                        </div>
                                        

                                       
                                        <hr />
                                        <div className="">
                                            <div className={`row justify-content-center rrr ${styles.rrr}`}>
                                                <div className="col-auto text-center">
                                                    <button className={`btn btn3 btn-secondary rounded-0 ${styles.btn3}`} type="submit">
                                                        送出
                                                    </button>
                                                </div>
                                            </div>
                                        </div>



                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                        </div>
                        </div>



        </>

    );
}