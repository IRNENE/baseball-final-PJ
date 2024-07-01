import React, { useState ,useEffect }  from 'react'
// import '@/node_modules/bootstrap/dist/css/bootstrap.min.css'
import styles from './product.module.css'
import Link from 'next/link'
import Script from 'next/script'
import { FaRegHeart } from "react-icons/fa"; // 引入 Heart 的使用者圖標(空心)
import { FaHeart } from "react-icons/fa"; // 引入 Heart 的使用者圖標(實心)
import { BiSolidLeftArrow } from "react-icons/bi";
import { BiSolidRightArrow } from "react-icons/bi";
import Pagination from '@/components/pagination/pagination'


 export default function Productclass2(){

    useEffect(() => {
        // 要document物件出現後才能導入 bootstrap的js函式庫
        import('@/node_modules/bootstrap/dist/js/bootstrap')
      }, []);

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
      
      
      
     
      


     
    

// const Index = () => {

   

    return (
        <>
        <div  className= {`accordion ${styles.accordion}`} id="accordionExample">
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
                <div className="accordion-body" onClick={() =>  handleBallSelect('硬式')}>
                硬式
                </div>
                </div>
                <div
                id="collapseTwo2"
                className={`accordion-collapse collapse ${isAccordionOpen1 ? 'show' : ''}`}
                
                aria-labelledby="headingTwo"
                data-bs-parent="#accordionExample"
                >
                <div className="accordion-body" onClick={() =>  handleBallSelect('軟式')}>
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
            <div className="accordion-item">
                <h2 className="accordion-header" id="headingfive">
                <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapsefive,#collapsefive2,#collapsefive3"
                    onClick={() => setIsAccordionOpen4(!isAccordionOpen4)}
                    aria-expanded={isAccordionOpen4}
                    aria-controls="collapsefive collapsefive2 collapsefive3"
                    
                    
                >
                    {glovesType}
                </button>
                </h2>
                <div
                id="collapsefive"
                className={`accordion-collapse collapse ${isAccordionOpen4 ? 'show' : ''}`}
                
                aria-labelledby="headingfive"
                data-bs-parent="#accordionExample"
                >
                <div className="accordion-body" onClick={() => handleGlovesSelect('左手')}>
                左手
                </div>
                </div>
                <div
                id="collapsefive2"
                className={`accordion-collapse collapse ${isAccordionOpen4 ? 'show' : ''}`}
                
                aria-labelledby="headingfive"
                data-bs-parent="#accordionExample"
                >
                <div className="accordion-body" onClick={() => handleGlovesSelect('右手')}>
                右手
                </div>
                </div>
                <div
                id="collapsefive3"
                className={`accordion-collapse collapse ${isAccordionOpen4 ? 'show' : ''}`}
                
                aria-labelledby="headingfive"
                data-bs-parent="#accordionExample"
                >
                <div className="accordion-body" onClick={() => handleGlovesSelect('打擊手套')}>
                打擊手套
                </div>
                </div>
            </div>
            <div className="accordion-item">
                <h2 className="accordion-header" id="headingsix">
                <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapsesix,#collapsesix2"
                    onClick={() => setIsAccordionOpen5(!isAccordionOpen5)}
                    aria-expanded={isAccordionOpen5}
                    aria-controls="collapsesix collapsesix2 "
                    
                    
                >
                    {pantsType}
                </button>
                </h2>
                <div
                id="collapsesix"
                className={`accordion-collapse collapse ${isAccordionOpen5 ? 'show' : ''}`}
                
                aria-labelledby="headingsix"
                data-bs-parent="#accordionExample"
                >
                <div className="accordion-body" onClick={() => handlePantsSelect('長褲')}>
                長褲
                </div>
                </div>
                <div
                id="collapsesix2"
                className={`accordion-collapse collapse ${isAccordionOpen5 ? 'show' : ''}`}
                
                aria-labelledby="headingsix"
                data-bs-parent="#accordionExample"
                >
                <div className="accordion-body" onClick={() =>  handlePantsSelect('短褲')}>
                短褲
                </div>
                </div>
                
                
            </div>

            <div className="accordion-item">
                <h2 className="accordion-header" id="headingseven">
                <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseseven,#collapseseven2"
                    
                    onClick={() => setIsAccordionOpen6(!isAccordionOpen6)}
                    aria-expanded={isAccordionOpen6}
                    aria-controls="collapseseven collapseseven2 "
                >
                    {sockType}
                </button>
                </h2>
                <div
                id="collapseseven"
                className={`accordion-collapse collapse ${isAccordionOpen6 ? 'show' : ''}`}
                
                aria-labelledby="headingseven"
                data-bs-parent="#accordionExample"
                >
                <div className="accordion-body" onClick={() => handleSockSelect('長筒')}>
                長筒
                </div>
                </div>
                <div
                id="collapseseven2"
                className={`accordion-collapse collapse ${isAccordionOpen6 ? 'show' : ''}`}
                
                aria-labelledby="headingseven"
                data-bs-parent="#accordionExample"
                >
                <div className="accordion-body" onClick={() => handleSockSelect('短筒')}>
                短筒
                </div>
                </div>
                
                
            </div>

            <div className="accordion-item">
                <h2 className="accordion-header" id="headingeight">
                <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseeight,#collapseeight2"
                    onClick={() => setIsAccordionOpen7(!isAccordionOpen7)}
                    aria-expanded={isAccordionOpen7}
                    aria-controls="collapseeight collapseeight2 "
                    
                >
                    {shoeType}
                </button>
                </h2>
                <div
                id="collapseeight"
                className={`accordion-collapse collapse ${isAccordionOpen7 ? 'show' : ''}`}
                
                aria-labelledby="headingeight"
                data-bs-parent="#accordionExample"
                >
                <div className="accordion-body" onClick={() => handleShoeSelect('跑鞋')}>
                跑鞋
                </div>
                </div>
                <div
                id="collapseeight2"
                className={`accordion-collapse collapse ${isAccordionOpen7 ? 'show' : ''}`}
                
                aria-labelledby="headingeight"
                data-bs-parent="#accordionExample"
                >
                <div className="accordion-body" onClick={() => handleShoeSelect('釘鞋')}>
                釘鞋
                </div>
                </div>
                
                
            </div>

            <div className="accordion-item">
                <h2 className="accordion-header" id="headingnine">
                <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapsenine,#collapsenine2,#collapsenine3,#collapsenine4"
                    onClick={() => setIsAccordionOpen8(!isAccordionOpen8)}
                    aria-expanded={isAccordionOpen8}
                    aria-controls="collapsenine collapsenine2 collapsenine3 collapsenine4"
                    
                >
                     {equipType}
                </button>
                </h2>
                <div
                id="collapsenine"
                className={`accordion-collapse collapse ${isAccordionOpen8 ? 'show' : ''}`}
                
                aria-labelledby="headingnine"
                data-bs-parent="#accordionExample"
                >
                <div className="accordion-body" onClick={() => handleEquipSelect('球袋')}>
                球袋
                </div>
                </div>
                <div
                id="collapsenine2"
                className={`accordion-collapse collapse ${isAccordionOpen8 ? 'show' : ''}`}
                
                aria-labelledby="headingnine"
                data-bs-parent="#accordionExample"
                >
                <div className="accordion-body" onClick={() => handleEquipSelect('手套袋')}>
                手套袋
                </div>
                </div>
                <div
                id="collapsenine3"
                className={`accordion-collapse collapse ${isAccordionOpen8 ? 'show' : ''}`}
                aria-labelledby="headingnine"
                data-bs-parent="#accordionExample"
                >
                <div className="accordion-body" onClick={() => handleEquipSelect('球鞋袋')}>
                球鞋袋
                </div>
                </div>
                <div
                id="collapsenine4"
                className={`accordion-collapse collapse ${isAccordionOpen8 ? 'show' : ''}`}
                aria-labelledby="headingnine"
                data-bs-parent="#accordionExample"
                >
                <div className="accordion-body" onClick={() => handleEquipSelect('球棒袋')}>
                球棒袋
                </div>
                </div>
                
                
            </div>

            <div className="accordion-item">
                <h2 className="accordion-header" id="headingten">
                <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseten,#collapseten2"
                   
                    onClick={() => setIsAccordionOpen9(!isAccordionOpen9)}
                    aria-expanded={isAccordionOpen9}
                    aria-controls="collapseten collapseten2 "
                    
                >
                     {gearType}
                </button>
                </h2>
                <div
                id="collapseten"
                className={`accordion-collapse collapse ${isAccordionOpen9 ? 'show' : ''}`}
                
                aria-labelledby="headingten"
                data-bs-parent="#accordionExample"
                >
                <div className="accordion-body" onClick={() => handleGearSelect('捕手護具')}>
                捕手護具
                </div>
                </div>
                <div
                id="collapseten2"
                className={`accordion-collapse collapse ${isAccordionOpen9 ? 'show' : ''}`}
                
                aria-labelledby="headingten"
                data-bs-parent="#accordionExample"
                >
                <div className="accordion-body" onClick={() => handleGearSelect('打擊護具')}>
                打擊護具
                </div>
                </div>
                
                
            </div>
            <hr />
                <div className="">
                    <div className= {`row justify-content-center rrr ${styles.rrr}`}>
                    <div className="col-auto text-center">
                        <button  className={`btn btn3 btn-secondary rounded-0 ${styles.btn3}`} type="submit">
                        送出
                        </button>
                    </div>
                    </div>
                </div>


            
            </div>
            </>

        

          
       
  );
       
}
        