import React, { useState, useEffect } from 'react';
import styles from './product.module.css'
import Link from 'next/link'
import Script from 'next/script'
import { PiBaseball } from "react-icons/pi";
import { IoMdStar } from "react-icons/io"; //實心星星
import { IoMdStarOutline } from "react-icons/io"; //空心星星
import { IoMdArrowDropright } from "react-icons/io";
import { MdArrowRight } from "react-icons/md";
import { FiShoppingCart } from "react-icons/fi"; //購物車
import { FaHeart } from "react-icons/fa"; //愛心
import { BsBoxSeam } from "react-icons/bs"; //box
import { useRouter } from 'next/router';
import { initUserData, useAuth } from '@/hooks/use-auth'
import Swal from 'sweetalert2'
import favorite from '@/public/images/course/Rectangle false.svg'
import favoriteLove from '@/public/images/course/Rectangle true.svg'
import Image from 'next/image'
import axios from 'axios'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { initLightboxJS } from 'lightbox.js-react'
import 'lightbox.js-react/dist/index.css'
import { SlideshowLightbox } from 'lightbox.js-react'

import "photoswipe/dist/photoswipe.css";

import { Gallery, Item } from "react-photoswipe-gallery";

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';






export default function ProductDetail() {
    const router = useRouter();
    const { id } = router.query;
    const { auth, setAuth } = useAuth() // 使用對象解構語法
    const { isAuth, useData } = auth
    const userData = auth.userData
    const [favoriteProductIds, setFavoriteProductIds] = useState([])

    // 定義狀態來保存商品數據
    const [productDetail, setProductDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recommendedProducts, setRecommendedProducts] = useState([])
    const [selectedPhoto, setSelectedPhoto] = useState(null)
    // const [sizes, setSizes] = useState([]);
    // const [colors, setColors] = useState([]);
    const [product, setProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState('');  // 状态：存储选中的颜色
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedPhotoUrl, setSelectedPhotoUrl] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);


    //數量變化
    const [quantity, setQuantity] = useState(1);

    const handleIncrement = () => {
        setQuantity(quantity + 1);

    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }

    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // 在這裡處理表單提交的邏輯
    };

    // 獲取USER的收藏商品列表
    const fetchFavorites = async () => {
        console.log('抓取我的收藏資料...')
        try {
            const response = await fetch(
                `http://localhost:3005/api/wishlist-product/user/${userData.id}/`
                , {
                    method: 'GET',
                    credentials: 'include'
                });
            const favoriteProducts = await response.json();
            // 將收藏商品列表中的商品ID提取出來，存儲在favoriteProducts變數中
            // console.log(favoriteProducts);
            const favorite = favoriteProducts.map((item) => item.product_id)

            // 將提取出來的商品ID存儲在favoriteProductIds狀態中，以便後續使用
            setFavoriteProductIds(favorite)
            console.log('我的收藏清單編號:', favorite)
        } catch (error) {
            console.error('Error fetching favorite data:', error)
        }
    }
    // 使用useEffect鉤子來確保在userData.id發生變化時調用fetchFavorites函數
    useEffect(() => {
        fetchFavorites()
    }, [userData.id])



    // 使用 id 获取课程详细信息
    useEffect(() => {
        if (id) {
            // 使用 `fetch` 获取课程详细信息
            fetch(`http://localhost:3005/api/product/${id}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch product detail');
                    }
                    return response.json();
                })
                .then(data => {
                    setProductDetail(data);
                    setIsLoading(false);
                    // setSizes(data[0].sizes || []);  // 假設 sizes 字段是個陣列
                    // setColors(data[0].colors || []);  // 假設 colors 字段也是個陣列
                    // 重置 selectedPhoto 為新產品的第一張照片
                    if (data[0].image_url) {
                        const initialPhotoArray = typeof data[0].image_url === 'string' ? data[0].image_url.split(',') : data[0].image_url;
                        setSelectedPhoto(initialPhotoArray[0]); // 假設照片 URL 正確存儲
                    }

                })

                
                .catch(err => {
                    setError(err);
                    setIsLoading(false);
                });
        }
    }, [id]);

    useEffect(() => {
        if (productDetail && productDetail[0].class) {
            // 使用产品类型获取推荐商品
            const productClass = productDetail[0].class;
            fetch(`http://localhost:3005/api/product/by-type/${productClass}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch recommended products');
                    }
                    return response.json();
                })
                .then((data) => {
                    setRecommendedProducts(data);
                })
                .catch((error) => { });
        }
    }, [productDetail]);
    useEffect(() => {
        initLightboxJS("Insert your License Key here", "Insert plan type here");
    }, []);


    if (!id) {
        return <div>Product ID not provided</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>; // 数据加载中
    }

    if (error) {
        return <div>Error: {error.message}</div>; // 显示错误信息
    }
    // 點擊圖標切換收藏狀態
    const handleToggleFav = () => {
        // 檢查使用者是否已登入
        if (userData.name == "") {
            Swal.fire({
                icon: 'error',
                zIndex: '9999999',
                title: '請先完成登入',
            });
            return;
        }
        // 取得要收藏的商品ID
        const productId = id;
        // 向後端發送 POST 請求以添加收藏
        fetch(`http://localhost:3005/api/wishlist-product/${productId}`,
            {
                method: 'POST',
                credentials: 'include'
            })
            .then((res) => {
                if (res.ok) {
                    // 如果收藏成功，更新收藏狀態
                    setFavoriteProductIds(prevIds => {
                        if (prevIds.includes(productId)) {
                            // 如果已經收藏，則移除之
                            return prevIds.filter(id => id !== productId)
                        } else {
                            // 否則將其加入到收藏夾中
                            return [...prevIds, productId]
                        }
                    });
                    // 彈窗部分
                    // console.log(favoriteProductIds)
                    // console.log(productId);
                    const numberId = parseInt(productId)
                    // console.log(numberId)
                    if (favoriteProductIds.includes(numberId)) {
                        Swal.fire({
                            icon: 'success',
                            zIndex: '9999999',
                            title: '此收藏已成功移除',
                        });
                        console.log('收藏已成功移除');
                    } else {

                        Swal.fire({
                            icon: 'success',
                            zIndex: '9999999',
                            title: '此商品已成功收藏',
                        });
                        console.log('已加入我的收藏');
                    }


                    // 操作完成後，使用 fetchFavorites 刷新數據
                    fetchFavorites();

                }

                else {
                    // 如果收藏失敗，檢查錯誤訊息是否為授權失敗
                    return res.json()
                }
            })
            .catch((error) => {
                console.log('收藏狀態切換失敗', error);

                // 在這裡處理錯誤


            });

    };





    //渲染商品详细信息
    if (productDetail) {
        const productData = productDetail[0];

        // let photoArray
        // if (typeof productData.image_url === 'string') {
        //     photoArray = productData.image_url.split(',') // 將字符串分割為陣列
        // } else if (Array.isArray(productData.image_url)) {
        //     photoArray = productData.image_url // 已經是陣列，直接使用
        // } else {
        //     // 處理其他類型的數據（如 null、undefined 等），這裡設置為空陣列
        //     photoArray = []
        // }

        // console.log('Is productData.image_url an array?:', Array.isArray(photoArray))

        let sizeArray
        if (typeof productData.size === 'string') {
            sizeArray = productData.size.split(',') // 將字符串分割為陣列
        } else if (Array.isArray(productData.size)) {
            sizeArray = productData.size // 已經是陣列，直接使用
        } else {
            // 處理其他類型的數據（如 null、undefined 等），這裡設置為空陣列
            sizeArray = []
        }

        console.log('Is productData.size an array?:', Array.isArray(sizeArray))

        const handlePhotoClick = (photo) => {
            // 更新 selectedPhoto 為點擊的小圖片的路徑
            setSelectedPhoto(photo)
        }
        // const handleColorClick = (color) => {
        //     setSelectedColor(color);
        // };
        // console.log(selectedColor);


        const handleColorClick = (color) => {
            setSelectedColor(color);
            // 根据选择的颜色更新图片
            switch (color) {
                case '熱門色':
                    setSelectedPhotoUrl(productData.image_url);
                    break;
                case '紅':
                    setSelectedPhotoUrl(productData.red);
                    break;
                case '綠':
                    setSelectedPhotoUrl(productData.green);
                    break;
                case '藍':
                    setSelectedPhotoUrl(productData.blue);
                    break;
                case '黃':
                    setSelectedPhotoUrl(productData.yellow);
                    break;
                default:
                    setSelectedPhotoUrl(productData.image_url); // 默认图片或处理其他情况
                    break;
            }
        };
        const images = [`/images/product/${productData.image_url}`, `/images/product/${productData.red}`, `/images/product/${productData.green}`, `/images/product/${productData.blue}`, `/images/product/${productData.yellow}`];

        // 处理加入购物车
        const handleAddToCart = () => {
            const requestData = {
                user_id: userData.id, // 请确保 initUserData.name 是正确的
                product_id: productData.id, // 商品ID
                p_price: productData.price, // 商品价格
                p_color: selectedColor,
                p_size: selectedSize,
                p_amount: quantity, // 数量
                img: productData.image_url,  // 使用更新后的图片 UR

            }

            fetch('http://localhost:3005/api/shopping-cart2/product', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to add to cart')
                    }
                    return response.json()
                })
                .then((data) => {
                    if (data.status === 'success') {
                        Swal.fire({
                            icon: 'success',
                            title: '成功加入購物車',
                            showConfirmButton: false,
                            timer: 2000,
                        })
                    } else if (data.status === 'update') {
                        Swal.fire({
                            icon: 'success',
                            title: '成功修改購物車數量',
                            showConfirmButton: false,
                            timer: 2000,
                        })
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: '添加到購物車失敗',
                            text: data.error || '請稍後再試',
                        })
                    }
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000)
                })
                .catch((err) => {
                    Swal.fire({
                        icon: 'error',
                        title: '請先完成登入或選取顏色尺寸',
                    })
                })
        }
        const handleClick = (index) => {
            setPhotoIndex(index);
            setIsOpen(true);
            console.log('Index set to:', index, 'isOpen set to true');
           

            // 根据索引设置所选颜色和图片 URL
            switch (index) {
                case 0: // 第一个图片
                    setSelectedPhoto(productData.image_url);
                    handleColorClick('熱門色');
                    break;
                case 1: // 第二个图片
                    setSelectedPhoto(productData.red);
                    handleColorClick('紅');
                    break;
                case 2: // 第三个图片
                    setSelectedPhoto(productData.green);
                    handleColorClick('綠');
                    break;
                case 3: // 第四个图片
                    setSelectedPhoto(productData.blue);
                    handleColorClick('藍');
                    break;
                case 4: // 第五个图片
                    setSelectedPhoto(productData.yellow);
                    handleColorClick('黃');
                    break;
                default:
                    setSelectedPhoto(productData.image_url); // 默认情况
                    handleColorClick('熱門色');
                    break;
            }
            
        };





        return (

            <>
                <div className="container ">
                    <div className={`breadcrumb  ${styles.breadcrumb}`}  >
                        <a href="/product" className={`tete ${styles.tete}`}>所有商品</a> /
                        <a href="/category" className={`tete ${styles.tete}`}>分類</a> /
                        {/* <a href="/category/subcategory" className={`tete ${styles.tete}`}>棒球手套</a> */}
                        <a href="/category/subcategory" className={`tete ${styles.tete}`}>
                            {productData.class === "手套" && "手套"}
                            {productData.class === "球" && "球"}
                            {productData.class === "球棒" && "球棒"}
                            {productData.class === "球鞋" && "球鞋"}
                            {productData.class === "帽子" && "帽子"}
                            {productData.class === "球衣" && "球衣"}
                            {productData.class === "球褲" && "球褲"}
                            {productData.class === "襪子" && "襪子"}
                            {productData.class === "裝備" && "裝備"}
                            {productData.class === "護具" && "護具"}
                        </a>                 {/* <span /> */}


                    </div>

                    <div className="row">
                        <div className={`col-12 col-sm-6 left1  ${styles.left1}`}>
                            <div className={`bigpic ${styles.bigpic}`}>
                                <figcaption className={`avatar1 ${styles.avatar1}`}>
                                    <Zoom overlayBgColorEnd="rgba(0, 0, 0, 0.95)" transitionDuration={500}>

                                        <img
                                            src={`/images/product/${selectedPhoto}`}
                                            // src={`/images/product/${selectedPhoto !== null ? selectedPhoto : photoArray[0]
                                            //     }`}
                                            alt=""
                                            className="w-full rounded"

                                        />

                                    </Zoom>
                                </figcaption>


                            </div>

                            <div className={`ppic2  ${styles.ppic2}`}>

                                {/* {photoArray.map((photo, index) => (
                                    <div className={`pic  ${styles.pic}`}>
                                        <figcaption className={`avatar2 ${styles.avatar2}`}>
                                            <img
                                                key={index}
                                                src={`/images/product/${photo}`}
                                                alt={`${productData.name} photo ${index + 1}`}
                                                onClick={() => handlePhotoClick(photo)}
                                            />
                                        </figcaption>
                                    </div>

                                ))} */}

                                {/* 其中一種光箱 */}
                                {/* {images.map((src, index) => (
                                    <div key={index} className={`pic ${styles.pic}`} onClick={() =>
                                        handleClick(index)
                                    }>

                                        <figcaption className={`avatar2 ${styles.avatar2}`} >
                                            <SlideshowLightbox className="container grid grid-cols-3 gap-2 mx-auto">
                                                <img className="w-full rounded" src={`${src}`} alt="" />

                                            </SlideshowLightbox>
                                        </figcaption>
                                    </div>
                                ))} */}

                                {images.map((src, index) => (
        <div key={index} className={`pic ${styles.pic}`} onClick={() => 
            handleClick(index)
        }>
            
            <figcaption className={`avatar2 ${styles.avatar2}`} >
                                        <img src={`${src}`} alt=""  />
                                    </figcaption>
        </div>
    ))}
    {isOpen && (
    <Lightbox
        mainSrc={images[photoIndex]}
        nextSrc={images[(photoIndex + 1) % images.length]}
        prevSrc={images[(photoIndex + images.length - 1) % images.length]}
        onCloseRequest={() => setIsOpen(false)}
        onMovePrevRequest={() => setPhotoIndex((photoIndex + images.length - 1) % images.length)}
        onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
    />
)}

                                
                                {/* <Gallery>
                                <Item
    original={`/images/product/${productData.red}`}
    thumbnail={`/images/product/${productData.red}`}
    width="1024"
    height="768"
  >
    {({ ref, open }) => (
      <img
        ref={ref}
        onClick={open}
        src={`/images/product/${productData.red}`}
        alt="Product"
      />
    )}
  </Item>
  <Item
    original={`/images/product/${productData.green}`}
    thumbnail={`/images/product/${productData.green}`}
    width="768"
    height="768"
  >
    {({ ref, open }) => (
      <img
        ref={ref}
        onClick={open}
        src={`/images/product/${productData.green}`}
        alt="Product"
      />
    )}
  </Item>
  
</Gallery> */}
                                {/* {images.map((src, index) => (
                                    <div key={index} className={`pic ${styles.pic}`} onClick={() =>
                                        handleClick(index)
                                    }>

                                        <figcaption className={`avatar2 ${styles.avatar2}`} >
                                            
                                                <img className="w-full rounded" src={`${src}`} alt="" />

                                            
                                        </figcaption>
                                    </div>
                                ))} */}

                                    
                                {/* <SlideshowLightbox className="container grid grid-cols-3 gap-2 mx-auto">
                                    {images.map((src, index) => (
                                        <img
                                            key={index}
                                            className={`w-full rounded ${styles.avatar2}`}
                                            src={`${src}`}
                                            alt=""
                                            onClick={() => handleClick(index)}
                                        />
                                    ))}
                                </SlideshowLightbox> */}

                                {/* <div className={`pic  ${styles.pic}`}>

                                    <figcaption className={`avatar2 ${styles.avatar2}`}>
                                    
                                        <img className="w-full rounded" src={`/images/product/${productData.image_url}`} alt="" onClick={() => {
                                            handleColorClick('熱門色');
                                            setSelectedPhoto(productData.image_url);
                                        }} />
                                        
                                    </figcaption>

                                </div>

                                <div className={`pic  ${styles.pic}`}>
                                    <figcaption className={`avatar2 ${styles.avatar2}`}>
                                    
                                        <img className="w-full rounded" src={`/images/product/${productData.red}`} alt="" onClick={() => {
                                            handleColorClick('紅');
                                            setSelectedPhoto(productData.red);
                                        }} />
                                        
                                    </figcaption>

                                </div>
                                <div className={`pic  ${styles.pic}`}>
                                    <figcaption className={`avatar2 ${styles.avatar2}`}>
                                   
                                        <img className="w-full rounded" src={`/images/product/${productData.green}`} alt="" onClick={() => {
                                            handleColorClick('綠');
                                            setSelectedPhoto(productData.green);
                                        }} />
                                        
                                    </figcaption>

                                </div>
                                <div className={`pic  ${styles.pic}`}>
                                    <figcaption className={`avatar2 ${styles.avatar2}`}>
                                        <img className="w-full rounded" src={`/images/product/${productData.blue}`} alt="" onClick={() => {
                                            handleColorClick('藍');
                                            setSelectedPhoto(productData.blue);
                                        }} />
                                    </figcaption>

                                </div>
                                <div className={`pic  ${styles.pic}`}>
                                    <figcaption className={`avatar2 ${styles.avatar2}`}>
                                        <img className="w-full rounded" src={`/images/product/${productData.yellow}`} alt="" onClick={() => {
                                            handleColorClick('黃');
                                            setSelectedPhoto(productData.yellow);
                                        }} />
                                    </figcaption>

                                </div> */}


                            </div>






                        </div>


                        <div className={`col-12 col-sm-6  right1 sss  ${styles.right1}  `}>
                            <form onSubmit={handleSubmit}>

                                <div className={`brand  ${styles.brand}`}>
                                    <h5 className=" ">{productData.brand} </h5>
                                </div>
                                <div className="row  mt-3">
                                    <h4> {productData.name}  </h4>
                                </div>
                                <div className=" mt-3">
                                    <div className={`pric1 me-2  ${styles.pric1}`}>
                                        <h3 className=" text-danger">${Math.round(productData.price * 0.8)}</h3>
                                    </div>
                                    <div className={`pric2  ${styles.pric2}`}>
                                        <h6 className="">${productData.price}</h6>
                                    </div>
                                </div>
                                <div className={`row  mt-3 mx-1 rounded-0 colorr  ${styles.colorr}`} >
                                    <h6>顏色</h6>
                                    <label htmlFor="color-select"></label>
                                    <select className="form-select  rounded-0 mt-2" name="color" id="color-select" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>

                                        <option value="">請選擇顏色</option>
                                        <option value="熱門色">熱門色</option>
                                        <option value="紅">紅</option>
                                        <option value="綠">綠</option>
                                        <option value="藍">藍</option>
                                        <option value="黃">黃</option>
                                        {/* {colors.map((color, index) => (
            <option key={index} value={color}>{color}</option>
        ))} */}
                                        {/* <option value={1}>紅</option>
                                        <option value={2}>黑</option>
                                        <option value={3}>白</option>
                                        <option value={4}>黃</option>
                                        <option value={5}>藍</option> */}
                                    </select>

                                </div>
                                <div className={`row  mt-3 mx-1 rounded-0   `} >
                                    <h6>尺寸</h6>
                                    <select className=" form-select  rounded-0 mt-2" name="size" id="size" value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>

                                        <option>請選擇尺寸 </option>
                                        {sizeArray.map((size, index) => (
                                            <option key={index} value={size}>{size}</option>
                                        ))}
                                        {/* {sizes.map((size, index) => (
            <option key={index} value={size}>{size}</option>
        ))} */}
                                        {/* <option value={1}>S</option>
                                        <option value={2}>M</option>
                                        <option value={3}>L</option>
                                        <option value={4}>XL</option> */}
                                    </select>
                                </div>

                                <div className={`divv row  mt-3   ${styles.divv}`}>
                                    <h6>數量</h6>
                                    <div className={`div3333 ${styles.div3333}`}>
                                        <button className={`div4 ${styles.div4}`} type="button" onClick={handleDecrement} >-</button>
                                        <div className={`div5 text-danger ${styles.div5}`}>{quantity}</div>
                                        <button className={`div6 ${styles.div6}`} type="button" onClick={handleIncrement} >+</button>
                                    </div>

                                </div>

                                <div className="d-grid gap-2    mt-3 ">
                                    <button className="btn btn-danger rounded-0 d-flex justify-content-center align-items-center" type="button" onClick={handleAddToCart}>
                                        <div className="d-flex align-items-center">
                                            <FiShoppingCart className="me-2" />
                                            加入購物車
                                        </div>
                                    </button>
                                    <button onClick={handleToggleFav} className="btn btn-dark rounded-0 mt-2 d-flex justify-content-center align-items-center" type="button">
                                        <div className="d-flex align-items-center">
                                            <Image
                                                className='me-2'
                                                src={
                                                    favoriteProductIds.includes(productData.id)
                                                        ? favoriteLove
                                                        : favorite
                                                }
                                                alt=""
                                            />
                                            收藏商品
                                        </div>
                                    </button>
                                </div>

                                <div className="mt-3">
                                    <div className="d-flex  ">
                                        <p className={`aa me-3 ${styles.aa}`}>免運</p>
                                        <p className="pt-1">滿 <span className={`qq1 ${styles.qq1}`} >5000</span> 元即享免運</p>
                                    </div>
                                    <div className="d-flex  ">
                                        <p className={`aa me-3 ${styles.aa}`}>物流</p>
                                        <p className="pt-1">宅配｜7-11、全家超商取貨付款</p>
                                    </div>
                                    <div className="d-flex  ">
                                        <p className={`aa me-3 ${styles.aa}`}>寄送</p>
                                        <p className="pt-1">全年無休，週末假日照常出貨</p>
                                    </div>
                                    <div className="d-flex  ">
                                        <p className={` asa me-3 ${styles.asa}`}>注意</p>

                                        <p className="pt-1 ">因拍照環境、光線與螢幕顯示器等因素，照片多少存在些許色差，請以實品顏色為準。</p>

                                    </div>
                                </div>
                            </form>





                        </div>



                    </div>
                    <div className="row">
                        <div className={`col-12 col-sm-6  left1  ${styles.left1}`}>
                            <div className={`ppp d-flex  align-items-center mb-4  ${styles.ppp} ${styles.qqq2}`}>
                                <div className="" style={{ fontSize: '1.5rem', color: 'red', display: 'flex', alignItems: 'center' }} >
                                    <PiBaseball />
                                </div>
                                <h5 className="ms-2 align-items-end">商品介紹</h5>
                            </div>
                            {/* <hr className={`custom-hr  ${styles.customHr}`} /> */}
                            <div>
                                <p>
                                    {/* 使用split和map将description字符串分割成多行 */}
                                    {productData.description.split('\n').map((line, index) => (
                                        // 为每行文本添加一个唯一的 key
                                        <React.Fragment key={index}>
                                            {line}
                                            {/* 不是最后一行时，添加换行 */}
                                            {index !== productData.description.split('\n').length - 1 && <br />}
                                        </React.Fragment>
                                    ))}
                                    <br />
                                    {/* 材質- <br />
                                鞋面：人工皮革 <br />
                                大底：射出成型大底 <br />
                                重量- 約290g(27.0cm單腳) <br />
                                <br />
                                產地- 柬埔寨 <br />
                                <br />
                                上市月份- 2023年 8月 <br /> */}
                                    <br />
                                    《注意事項》<br />
                                    ※ 此商品可退換，詳情請參閱退換貨規則 <br />
                                    ※ 商品展示顏色依實際販售狀況為主 <br />
                                    ※ 商品物質特性不同，可能會有約1-2cm前後的誤差。 <br />
                                    ※ 依據商品款式、版型、材質、設計等，同樣尺寸於不同商品可能會有所差異 <br />
                                    <br />
                                    購物須知 <br />
                                    寄送時間 : 全年無休，週末假日照常出貨 <br />
                                    送貨方式 : 透過宅配送達。除網頁另有特別標示外，均為常溫配送。 <br />
                                    送貨範圍 : 限台灣本島與離島地區註，部分離島地區包括連江馬祖、綠島、蘭嶼、琉球鄉…等 <br />
                                </p>
                            </div>

                            <div className={`sizepp ${styles.sizepp}`}>
                                <figcaption className={`avatar6 ${styles.avatar6}`}>
                                    <img src={`/images/product/${productData.sizepic}`} alt="" />
                                </figcaption>

                                {/* <table className={`table1 align-middle  ${styles.table1}`} style={{ tableLayout: 'fixed', width: '100%' }}>
                                <tbody>
                                    <tr className="">
                                        <th className={`th1 text-center font-weight-bold  ${styles.th1}`}>US男</th>
                                        <th className={`th1 text-center font-weight-bold  ${styles.th1}`}>US女</th>
                                        <th className={`th1 text-center font-weight-bold  ${styles.th1}`}>UK</th>
                                        <th className={`th1 text-center font-weight-bold  ${styles.th1}`}>EU</th>
                                        <th className={`th1 text-center font-weight-bold  ${styles.th1}`}>CM</th>
                                    </tr>
                                    <tr className="" >
                                        <td className={`td1 text-center  ${styles.td1}`}>8</td>
                                        <td className={`td1 text-center  ${styles.td1}`}>9.5</td>
                                        <td className={`td1 text-center  ${styles.td1}`}>7</td>
                                        <td className={`td1 text-center  ${styles.td1}`}>41</td>
                                        <td className={`td1 text-center  ${styles.td1}`}>26</td>

                                    </tr>
                                    <tr className="">
                                        <td className={`td1 text-center  ${styles.td1}`}>8.5</td>
                                        <td className={`td1 text-center  ${styles.td1}`}>10</td>
                                        <td className={`td1 text-center  ${styles.td1}`}>7.5</td>
                                        <td className={`td1 text-center  ${styles.td1}`}>41.5</td>
                                        <td className={`td1 text-center  ${styles.td1}`}>26.5</td>

                                    </tr>
                                    <tr>
                                        <td className={`td1 text-center  ${styles.td1}`}>9</td>
                                        <td className={`td1 text-center  ${styles.td1}`}>10.5</td>
                                        <td className={`td1 text-center  ${styles.td1}`}>8</td>
                                        <td className={`td1 text-center  ${styles.td1}`}>42</td>
                                        <td className={`td1 text-center  ${styles.td1}`}>27</td>

                                    </tr>
                                    <tr>
                                        <td className={`td1 text-center  ${styles.td1}`}>9.5</td>
                                        <td className={`td1 text-center  ${styles.td1}`}>11</td>
                                        <td className={`td1 text-center  ${styles.td1}`}>8.5</td>
                                        <td className={`td1 text-center  ${styles.td1}`}>42.5</td>
                                        <td className={`td1 text-center  ${styles.td1}`}>27.5</td>

                                    </tr>
                                    <tr>
                                        <td className={`td1 text-center  ${styles.td1}`}>10</td>
                                        <td className={`td1 text-center  ${styles.td1}`}>11.5</td>
                                        <td className={`td1 text-center  ${styles.td1}`}>9</td>
                                        <td className={`td1 text-center  ${styles.td1}`}>43</td>
                                        <td className={`td1 text-center  ${styles.td1}`}>28</td>

                                    </tr>
                                    <tr>
                                        <td className={`td1 text-center  ${styles.td1}`}>10.5</td>
                                        <td className={`td1 text-center  ${styles.td1}`}>12</td>
                                        <td className={`td1 text-center  ${styles.td1}`}>9.5</td>
                                        <td className={`td1 text-center  ${styles.td1}`}>43.5</td>
                                        <td className={`td1 text-center  ${styles.td1}`}>28.5</td>

                                    </tr>
                                    <tr>
                                        <td className={`td1 text-center  ${styles.td1}`}>11</td>
                                        <td className={`td1 text-center  ${styles.td1}`}>12.5</td>
                                        <td className={`td1 text-center  ${styles.td1}`}>10</td>
                                        <td className={`td1 text-center  ${styles.td1}`}>43</td>
                                        <td className={`td1 text-center  ${styles.td1}`}>29</td>

                                    </tr>
                                </tbody>
                            </table> */}
                            </div>
                            <div className={`d-flex mt-4 mb-4 ${styles.qqq2}`}>
                                <div className="" style={{ fontSize: '1.5rem', color: 'red', display: 'flex', alignItems: 'center' }}>
                                    <BsBoxSeam />

                                </div>
                                <h5 className="align-self-center ms-2">商品評價</h5>


                            </div>
                            {/* <hr /> */}
                            <div className={`card rounded-0 shadow  ${styles.card}`}>
                                <div className="card-body">
                                    <div className={`qqq ${styles.qqq}`}>
                                        <div className={`peo ${styles.peo}`}>
                                            <img src="" alt="" />
                                        </div>
                                        <div className={`nam ${styles.nam}`}>
                                            <h6 className="card-title">abc***@***</h6>
                                            <p className="card-title">2024/11/11</p>
                                        </div>
                                        <div className="ms-auto  " style={{ fontSize: '1.5rem', color: 'red' }}>

                                            <IoMdStar />
                                            <IoMdStar />
                                            <IoMdStar />
                                            <IoMdStar />
                                            <IoMdStarOutline />

                                        </div>
                                    </div>
                                    <p className={`card-text ${styles.cardText}`}>版型不錯，但穿起來偏硬，個人較不習慣。有穿去慢跑、打網球，鞋墊的緩衝力很好。</p>

                                </div>
                            </div>

                            <div className={`card rounded-0 shadow  ${styles.card}`}>
                                <div className="card-body">
                                    <div className={`qqq ${styles.qqq}`}>
                                        <div className={`peo ${styles.peo}`}>
                                            <img src="" alt="" />
                                        </div>
                                        <div className={`nam ${styles.nam}`}>
                                            <h6 className="card-title">abc***@***</h6>
                                            <p className="card-title">2024/11/11</p>
                                        </div>
                                        <div className="ms-auto " style={{ fontSize: '1.5rem', color: 'red' }}>

                                            <IoMdStar />
                                            <IoMdStar />
                                            <IoMdStar />
                                            <IoMdStar />
                                            <IoMdStarOutline />

                                        </div>
                                    </div>
                                    <p className={`card-text ${styles.cardText}`}>一收到馬上就拆箱，讓人捨不得開耶！包裝就像禮物一樣，這次是我要自用的，打開時讚嘆了一下，很適合下次也送給親友整個設計質感都讓人喜歡，無可挑剔</p>

                                </div>
                            </div>

                            <div className="ms-auto text-end">
                                <button className="btn text-danger d-flex align-items-center ms-auto mb-2" type="button" > 查看更多評論 <MdArrowRight /> </button>
                            </div>
                        </div>

                        <div className={`col-12 col-sm-6  right1 sss  ${styles.right1} `}>
                            <div className={`ccc d-flex ${styles.ccc}`}>

                                <h5 className="align-self-center ms-2">更多相似商品</h5>
                            </div>
                            {/* <hr /> */}

                            <div className={`allp mt-2  ${styles.allp} ${styles.recommendedContainer}`}>

                                {recommendedProducts.map((product) => {
                                    const photoArray = product.image_url.split(',')

                                    // 使用 photoArray[0] 作為圖片的路徑
                                    const firstPhoto = photoArray[0]
                                    return (
                                        <Link key={product.id} href={`/product/${product.id}`}>

                                            <div className={`box7  ${styles.box7}`}>


                                                <figcaption className={`avatar3 ${styles.avatar3}`}>
                                                    <img src={`/images/product/${firstPhoto}`} alt="" />
                                                </figcaption>
                                                <div className={`single-ellipsis name1 ${styles.singleEllipsis}`}>
                                                    {product.name}
                                                </div>

                                                <h6 className={`box8 me-2 ${styles.box8}`}>${product.price}</h6>
                                                <p className={`box9 ${styles.box9}`}>${product.price}</p>


                                            </div>
                                        </Link>
                                    )
                                })}



                                {/* <div className={`box7  ${styles.box7}`}>
                                <figcaption className={`avatar3 ${styles.avatar3}`}>
                                    <img src="/images/product/baseball_shoes006_2.jpg" alt="" />
                                </figcaption>
                                <div className={`single-ellipsis name1 ${styles.singleEllipsis}`}>
                                    PROSTATUS SPECIAL EDITION 頂級金標 硬式 反手 投手
                                </div>

                                <h6 className={`box8 me-2 ${styles.box8}`}>$3700</h6>
                                <p className={`box9 ${styles.box9}`}>$3700</p>


                            </div> */}
                            </div>

                        </div>


                    </div>
                </div>
            </>


        );


    }



    return <div>Product not found</div>; // 未找到商品信息

}