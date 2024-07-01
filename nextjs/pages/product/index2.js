import React, { useState, useEffect, useMemo } from 'react'
// import '@/node_modules/bootstrap/dist/css/bootstrap.min.css'
import styles from './product.module.css'
import Link from 'next/link'
import Script from 'next/script'
import { FaHeart, FaRegHeart } from 'react-icons/fa';
// import { FaRegHeart } from "react-icons/fa"; // 引入 Heart 的使用者圖標(空心)
// import { FaHeart } from "react-icons/fa"; // 引入 Heart 的使用者圖標(實心)
import { BiSolidLeftArrow, BiSolidRightArrow } from 'react-icons/bi';
// import { BiSolidLeftArrow } from "react-icons/bi";
// import { BiSolidRightArrow } from "react-icons/bi";
import Pagination from '@/components/pagination/pagination'
import Productclass from '@/components/productclass/productclass';
import Productsearch from '@/components/productsearch/productsearch';
import Productselection from '@/components/productselection/productselection';
import Productsort from '@/components/productsort/productsort';
import Productclass2 from '@/components/productclass2/productclass2';
import Image from 'next/image';
import { useRouter } from 'next/router';
import axios from 'axios';
import Swal from 'sweetalert2';
import { initUserData, useAuth } from '@/hooks/use-auth'
import favorite from '@/public/images/course/Rectangle false.svg'
import favoriteLove from '@/public/images/course/Rectangle true.svg'










export default function Product() {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({ inputValue: '' });
    const [productCount, setProductCount] = useState(0)
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [sortOption, setSortOption] = useState('')
    const [isSearchPerformed, setIsSearchPerformed] = useState(false)
    const [tempInputValue, setTempInputValue] = useState('')
    const [price, setPrice] = useState('');
    const [brand, setBrand] = useState('');
    const [color, setColor] = useState('');
    const [other, setOther] = useState('');
    const [class2, setClass2] = useState('');
    const [currentPage, setCurrentPage] = useState(1)
    const [shouldShowPagination, setShouldShowPagination] = useState(true)
    const [isSmallScreen, setIsSmallScreen] = useState(false)
    //收藏用的
    const { auth, setAuth } = useAuth() // 使用對象解構語法
    const { isAuth, useData } = auth
    const userData = auth.userData
    const [favoriteProductIds, setFavoriteProductIds] = useState([])


    //篩選
    const filterOptionsInitial = {
        price: price,
        brand: brand,
        color: color,
        other: other,
        class2: class2
    };


    // 定义一个对象来存储筛选条件
    const [filterOptions, setFilterOptions] = useState(filterOptionsInitial);




    useEffect(() => {
        // 要document物件出現後才能導入 bootstrap的js函式庫
        import('@/node_modules/bootstrap/dist/js/bootstrap')
    }, [])

    useEffect(() => {
        fetchURL();
    }, [filterOptions, formData, sortOption]);

    const fetchURL = async () => {
        let url = 'http://localhost:3005/api/product?';

        // 构建查询参数
        const queryParams = [];
        Object.keys(filterOptions).forEach(key => {
            if (filterOptions[key]) {
                queryParams.push(`${key}=${filterOptions[key]}`);
            }
        });
        if (formData.inputValue) {
            const encodedKeyword = encodeURIComponent(formData.inputValue);
            queryParams.push(`search=${encodedKeyword}`);
        }
        if (sortOption) {
            queryParams.push(`sortOption=${sortOption}`);
        }

        // 拼接查询参数
        url += queryParams.join('&');

        // 发送请求获取数据
        await fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setProducts(data);
                setProductCount(data.length);
            });
    };

    // 定义一个对象来存储筛选条件

    // 更新筛选条件的函数
    const updateFilterOptions = (type, value) => {
        setFilterOptions(prevOptions => ({
            ...prevOptions,
            [type]: value
        }));
    };

    // 更新各种筛选条件的函数
    const filterByPrice = (selectedPrice) => {
        updateFilterOptions('price', selectedPrice);
    };

    const filterByBrand = (selectedBrand) => {
        updateFilterOptions('brand', selectedBrand);
    };

    const filterByColor = (selectedColor) => {
        updateFilterOptions('color', selectedColor);
    };

    const filterByClass = (selectedClass) => {
        updateFilterOptions('class2', selectedClass);
    };

    const filterByOther = (selectedOther) => {
        updateFilterOptions('other', selectedOther);
    };

    //     useEffect(() => {
    //      // 獲取商品數據
    //      const fetchProducts = async () => {
    //         let url = (searchQuery === '') ? 
    //         'http://localhost:3005/api/product' : 
    //         `http://localhost:3005/api/product/search/${encodeURIComponent(searchQuery)}`;
    //      try {
    //         const response = await fetch(url);
    //         const data = await response.json();

    //         setProducts(data);
    //         setProductCount(data.length); // 获取商品列表的长度并更新productCount
    //         setSearchResults(searchQuery === '' ? [] : data); // 如果不是搜索，清空搜索结果
    //         // 初始化每个商品的收藏状态为 false
    //         const status = {};
    //         data.forEach((product) => {
    //             status[product.id] = false;
    //         });

    //         setFavoriteStatus(status);
    //     } catch (error) {
    //         console.error('Error fetching products:', error);
    //     }
    // };

    // 调用异步函数
    // fetchProducts();
    // },  [formData, searchQuery]);



    const [classifType2, setClassifType2] = useState('全部商品');
    const [classifType, setClassifType] = useState('全部');

    const [sortType, setSortType] = useState('排序');


    //點擊愛心變化
    // const [favorites, setFavorites] = useState({});

    // 使用物件來存儲每個商品的收藏狀態
    const [favoriteStatus, setFavoriteStatus] = useState({});

    // 點擊愛心變化
    // const handleToggleFav = (isbn) => {
    //     setFavoriteStatus(prevStatus => ({
    //         ...prevStatus,
    //         [isbn]: !prevStatus[isbn] // 切換收藏狀態
    //     }));
    // };
    // const handleToggleFav = (event, productId) => {
    //     阻止事件冒泡，以免影响其他元素
    //     event.preventDefault();
    //     event.stopPropagation();
    //     setFavoriteStatus(prevStatus => ({
    //         ...prevStatus,
    //         [productId]: !prevStatus[productId]
    //     }));
    // };

    // 點擊圖標切換收藏狀態

    //若有更換使用者更新我的收藏愛心判斷wun
    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3005/api/wishlist-product/user/${userData.id}/`
                    , {
                        method: 'GET',
                        credentials: 'include'
                    })
                const favoriteProducts = await response.json();
                const favorite = response.data.map((item) => item.product_id)
                setFavoriteProductIds(favorite)
                console.log('favoriteProductIds:', favorite)
            } catch (error) {
                console.error('Error fetching favorite data:', error)
            }
        }
        fetchFavorites()
    }, [userData.id])


    // 獲取USER的收藏商品列表
    const fetchFavorites = async () => {
        console.log("抓取此會員的收藏列表...")
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
            console.log("我的收藏清單編號:", favorite)
        } catch (error) {
            console.error('Error fetching favorite data:', error)
        }
    }
    // 使用useEffect鉤子來確保在userData.id發生變化時調用fetchFavorites函數
    useEffect(() => {
        fetchFavorites()
    }, [userData.id])


    // 點擊圖標切換收藏狀態
    const handleToggleFav = (productId) => {
        // 檢查使用者是否已登入
        if (userData.name == "") {
            Swal.fire({
                icon: 'error',
                zIndex: '9999999',
                title: '請先完成登入',
            });
            return;
        }

        // 向後端發送 POST 請求以添加收藏
        fetch(`http://localhost:3005/api/wishlist-product/${productId}`,
            {
                method: 'POST',
                credentials: 'include'
            })
            .then((res) => {
                if (res.ok) {
                    // 如果收藏成功，更新收藏狀態
                    setProducts(prevProducts => {
                        return prevProducts.map(product => {
                            if (product.id === productId) {
                                // 切换收藏狀態
                                return { ...product, fav: !product.fav };
                            }
                            return product;
                        });
                    });
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


    // ////////////////////////////////////////////////////////////////productselection 元件那邊的
    // const handleClear = () => {
    //     // 清除品牌選項
    //     const brandInputs = document.getElementsByName("brand");
    //     brandInputs.forEach(input => {
    //         input.checked = false;
    //     });

    //     // 清除顏色選項
    //     const colorInputs = document.getElementsByName("color");
    //     colorInputs.forEach(input => {
    //         input.checked = false;
    //     });

    //     // 清除價格選項
    //     const priceInputs = document.getElementsByName("price");
    //     priceInputs.forEach(input => {
    //         input.checked = false;
    //     });

    //     // 将选定的过滤器数量设置为零
    //     setSelectedFiltersCount(0);
    // };

    // const handleSubmit = (event) => {
    //     // 在這裡添加提交選項的邏輯
    //     // 獲取所有已選中的品牌
    //     const selectedBrands = document.querySelectorAll('input[name="brand"]:checked');
    //     const selectedBrandValues = Array.from(selectedBrands).map(input => input.value);

    //     // 獲取所有已選中的顏色
    //     const selectedColors = document.querySelectorAll('input[name="color"]:checked');
    //     const selectedColorValues = Array.from(selectedColors).map(input => input.value);

    //     // 獲取所有已選中的價格
    //     const selectedPrices = document.querySelectorAll('input[name="price"]:checked');
    //     const selectedPriceValues = Array.from(selectedPrices).map(input => input.value);

    //     // 執行提交操作，這裡可以根據應用程序的需要執行相應的操作，例如將選項提交到後端處理、顯示結果等等
    //     console.log("已選中的品牌:", selectedBrandValues);
    //     console.log("已選中的顏色:", selectedColorValues);
    //     console.log("已選中的價格:", selectedPriceValues);

    //     event.preventDefault()
    //     const formData = new FormData(event.target)
    //     const inputValue = formData.get('inputName')
    //     setFormData({ inputValue })
    //     event.target.reset()




    // };


    // 定义状态变量以跟踪所选过滤器的数量
    const [selectedFiltersCount, setSelectedFiltersCount] = useState(0);

    // 定义状态变量以存储已选择的过滤器选项
    const [selectedFilters, setSelectedFilters] = useState([]);

    // 处理过滤器选择的函数
    // 定义状态变量以跟踪所选过滤器的数量

    const initialSelectedBrand = "";
    const initialSelectedColor = "";
    const initialSelectedPrice = "";

    // 定义状态变量以跟踪所选品牌、颜色和价格
    const [selectedBrand, setSelectedBrand] = useState(initialSelectedBrand);
    const [selectedColor, setSelectedColor] = useState(initialSelectedColor);
    const [selectedPrice, setSelectedPrice] = useState(initialSelectedPrice);
    
    // 处理过滤器选择的函数
    // 处理过滤器选择的函数
    // 处理过滤器选择的函数
    // 处理过滤器选择的函数
    const handleFilterSelection = (event, filterType) => {
        // 获取当前选择的过滤器值
        const filterValue = event.target.value;

        // 根据 filterType 更新对应的状态变量
        switch (filterType) {
            case "brand":
                setSelectedBrand(filterValue);
                break;
            case "color":
                setSelectedColor(filterValue);
                break;
            case "price":
                setSelectedPrice(filterValue);
                break;
                case "other":
                    setSelectedOther(filterValue);
                    break;
            default:
                break;
        }

        // 查找现有的筛选器是否已存在于 selectedFilters 数组中
        const existingFilterIndex = selectedFilters.findIndex(filter => filter.type === filterType);

        // 如果当前选择的值与先前的值不同，则更新 selectedFilters 数组
        if (existingFilterIndex !== -1) {
            setSelectedFilters(prevState => {
                const updatedFilters = [...prevState];
                updatedFilters[existingFilterIndex] = { type: filterType, value: filterValue };
                return updatedFilters;
            });
        } else {
            // 否则，将新的筛选器添加到 selectedFilters 数组中
            setSelectedFilters(prevState => [...prevState, { type: filterType, value: filterValue }]);
        }

        // 更新 selectedFiltersCount
        setSelectedFiltersCount(selectedFilters.length);
    };



    





    // 提交过滤器选择的函数
    // const handleSubmit = () => {
    //     // 在这里添加提交选项的逻辑
    //     // 执行提交操作，根据应用程序的需要执行相应的操作，例如将选项提交到后端处理、显示结果等等
    //     console.log("已选择的过滤器选项:", selectedFilters);
    // };

    // 根据 selectedFilters 数组的长度动态设置已选择的过滤器数量
    useEffect(() => {
        setSelectedFiltersCount(selectedFilters.length);
    }, [selectedFilters]);

    // 根据 selectedFiltersCount 动态生成过滤器标签
    const filterLabel = `篩選[${selectedFiltersCount}]`;


    const handleClear = () => {
        setSelectedPrice(null); 
        setSelectedBrand(null); 
        setSelectedColor(null);
        
        // 清除品牌选项
        const brandInputs = document.getElementsByName("brand");
        brandInputs.forEach(input => {
            input.checked = false;
        });
        filterByBrand("")
        filterByColor("")
        filterByPrice("")
        filterByOther("")
        // 清除颜色选项
        const colorInputs = document.getElementsByName("color");
        colorInputs.forEach(input => {
            input.checked = false;
        });

        // 清除价格选项
        const priceInputs = document.getElementsByName("price");
        priceInputs.forEach(input => {
            input.checked = false;
        });
        // 清除价格选项
        const otherInputs = document.getElementsByName("other");
        otherInputs.forEach(input => {
            input.checked = false;
        });

        // 清除所有已选择的过滤器选项并将 selectedFiltersCount 设置为零
        setSelectedFilters([]);
        setSelectedFiltersCount(0);

        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.checked = false;
        });

    };
    const handleButtonClick = () => {
        handleClear();  // 调用清除函数
        handleClassifSelect('所有');  // 设置硬式棒球选项
    };





    //Productclass2///////////////////////////////////////////////////////////////////////////////////////////////

    const [batType, setBatType] = useState('球棒');
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);

    const handleBatSelect = (type) => {
        setBatType(type);
        setIsAccordionOpen(false); // Collapse the accordion after selection
        setClassifType(type); // 根據球棒類型更新分類類型
    };
    const [ballType, setBallType] = useState('球');
    const [isAccordionOpen1, setIsAccordionOpen1] = useState(false);

    const handleBallSelect = (type) => {
        setBallType(type);
        setIsAccordionOpen1(false); // Collapse the accordion after selection
        setClassifType(type); // 根據球棒類型更新分類類型
    };

    const [hatType, setHatType] = useState('帽子');
    const [isAccordionOpen2, setIsAccordionOpen2] = useState(false);

    const handleHatSelect = (type) => {
        setHatType(type);
        setIsAccordionOpen2(false); // Collapse the accordion after selection
        setClassifType(type); // 根據球棒類型更新分類類型
    };
    const [clothType, setClothType] = useState('球衣');
    const [isAccordionOpen3, setIsAccordionOpen3] = useState(false);

    const handleClothSelect = (type) => {
        setClothType(type);
        setIsAccordionOpen3(false); // Collapse the accordion after selection
        setClassifType(type); // 根據球棒類型更新分類類型
    };
    const [glovesType, setGlovesType] = useState('手套');
    const [isAccordionOpen4, setIsAccordionOpen4] = useState(false);

    const handleGlovesSelect = (type) => {
        setGlovesType(type);
        setIsAccordionOpen4(false); // Collapse the accordion after selection
        setClassifType(type); // 根據球棒類型更新分類類型
    };
    const [pantsType, setPantsType] = useState('球褲');
    const [isAccordionOpen5, setIsAccordionOpen5] = useState(false);

    const handlePantsSelect = (type) => {
        setPantsType(type);
        setIsAccordionOpen5(false); // Collapse the accordion after selection
        setClassifType(type); // 根據球棒類型更新分類類型
    };
    const [sockType, setSockType] = useState('襪子');
    const [isAccordionOpen6, setIsAccordionOpen6] = useState(false);

    const handleSockSelect = (type) => {
        setSockType(type);
        setIsAccordionOpen6(false); // Collapse the accordion after selection
        setClassifType(type); // 根據球棒類型更新分類類型
    };
    const [shoeType, setShoeType] = useState('球鞋');
    const [isAccordionOpen7, setIsAccordionOpen7] = useState(false);

    const handleShoeSelect = (type) => {
        setShoeType(type);
        setIsAccordionOpen7(false); // Collapse the accordion after selection
        setClassifType(type); // 根據球棒類型更新分類類型
    };
    const [equipType, setEquipType] = useState('裝備');
    const [isAccordionOpen8, setIsAccordionOpen8] = useState(false);

    const handleEquipSelect = (type) => {
        setEquipType(type);
        setIsAccordionOpen8(false); // Collapse the accordion after selection
        setClassifType(type); // 根據球棒類型更新分類類型
    };
    const [gearType, setGearType] = useState('護具');
    const [isAccordionOpen9, setIsAccordionOpen9] = useState(false);

    const handleGearSelect = (type) => {
        setGearType(type);
        setIsAccordionOpen9(false); // Collapse the accordion after selection
        setClassifType(type); // 根據球棒類型更新分類類型
    };
    ///////////////////////////////////////////////////////////////////////////////


    // 点击筛选器项时更新分类类型
    const handleClassifSelect = (type) => {
        setClassifType(type);
    };
    //////////////////////////////////////////////////////////////////////////////
    //處理排序

    const handleSortChange = (event) => {
        setSortOption(event.target.value)
        console.log(event.target.value)
    }

    // 處理搜尋表單提交
    const handleSubmit = (event) => {
        event.preventDefault()

        if (isSearchPerformed) {
            // 如果搜索已执行，用户按下了返回按钮
            // 重置输入框的值
            setFormData({ inputValue: '' })
            setTempInputValue('')
            // 重置搜索执行状态
            setIsSearchPerformed(false)
        } else {
            // 获取输入框的值
            const formData = new FormData(event.target)
            const inputValue = formData.get('inputName')

            // 将输入值存储在状态变量中
            setFormData({ inputValue })

            // 设置搜索执行状态为 true
            setIsSearchPerformed(true)
        }

        // 重置表单输入框
        event.target.reset()
    }

    //篩金額
    //   async function filterByPrice(price) {
    //     try {
    //         const response = await fetch(`http://localhost:3005/api/product?price=${price}`);
    //         const data = await response.json();
    //         console.log(data); // 处理返回的数据
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // }

    // async function filterByBrand(brand) {
    //     try {
    //         const response = await fetch(`http://localhost:3005/api/product?brand=${brand}`);
    //         const data = await response.json();
    //         console.log(data); // 处理返回的数据
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // }
    // async function filterByColor(color) {
    //     try {
    //         const response = await fetch(`http://localhost:3005/api/product?color=${color}`);
    //         const data = await response.json();
    //         console.log(data); // 处理返回的数据
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // }
    // 使用 useEffect 监听状态变化并触发获取数据的函数

    // 處理類型點擊事件
    const handleTypeClick = (typeName) => {

        setCurrentPage(1)
    }

    //分業手機板隱藏
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia('(max-width: 575px)')

            // 處理媒體查詢變化
            function handleMediaQueryChange(event) {
                setShouldShowPagination(!event.matches) // 如果寬度小於 575 像素，設置 shouldShowPagination 為 false
                setIsSmallScreen(event.matches) // 如果寬度小於 575 像素，設置 isSmallScreen 為 true
            }

            // 添加監聽器
            mediaQuery.addEventListener('change', handleMediaQueryChange)

            // 初始檢查媒體查詢結果
            handleMediaQueryChange(mediaQuery)

            // 在組件卸載時清除監聽器
            return () => {
                mediaQuery.removeEventListener('change', handleMediaQueryChange)
            }
        }
    }, [])

    // 處理分頁按鈕點擊事件
    const handlePageChange = (page) => {
        setCurrentPage(page)
    }
    const pageSize = 20 //一頁有幾個產品
    // 計算總頁數
    const totalPages = Math.ceil(products.length / pageSize)

    // 計算顯示的課程列表
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, products.length)
    const visibleCourses = products.slice(startIndex, endIndex)

    // 根據 isSmallScreen 狀態條件渲染數據列表
    const dataToShow = isSmallScreen ? products : visibleCourses










    return (


        <>











            <div className={`navber-img-sun ${styles.navberImgSun}`} style={{ position: 'relative' }}>
                <img src=" " alt="" />
                <h1 className={`text text-white ${styles.text}`} style={{ position: 'absolute', top: '30%', left: '18%', transform: 'translate(-50%, -50%)' }}>商品列表</h1>
                <h4 className={`text text-white ${styles.text} ${styles.text2}`} style={{ position: 'absolute', top: '50%', left: '24.5%', transform: 'translate(-50%, -50%)' }}>提供最專業的用品 讓您場上表現不打折</h4>
            </div>

            <div className="container ">
                <div className="row">
                    <div className="col-2 mt-5">
                        <div className={`breadcrumb1 ${styles.breadcrumb1}`}>
                            <a href="/product" className={`tete ${styles.tete}`}>所有商品</a> /
                            <a href="/category" className={`tete ${styles.tete}`}>分類</a> /
                            <a href="/category/subcategory" className={`tete ${styles.tete}`}>{classifType2}</a>
                            <span />


                        </div>


                        <form action="">
                            <div className={`div form-item  ${styles.div}`}>
                                <div className={`div-2  ${styles.div2}`}>商品分類</div>
                                <div className={` form-item   `}>
                                    <input className={`div-3 me-2    ${styles.div3}`} type="radio" id="bat" name="class" value="球棒" onClick={() => {
                                        filterByClass('球棒');
                                        setClassifType2('球棒');
                                    }} />
                                    <label htmlFor="bat"  >球棒</label>
                                    <br />
                                    <input className={`div-3 me-2   ${styles.div3}`} type="radio" id="ball" name="class" value="球" onClick={() => {
                                        filterByClass('球');
                                        setClassifType2('球');
                                    }} />
                                    <label htmlFor="ball" >球</label>
                                    <br />
                                    <input className={`div-3 me-2   ${styles.div3}`} type="radio" id="hat" name="class" value="帽子" onClick={() => {
                                        filterByClass('帽子');
                                        setClassifType2('帽子');
                                    }} />
                                    <label htmlFor="hat" >帽子</label>
                                    <br />
                                    <input className={`div-3 me-2   ${styles.div3}`} type="radio" id="cloth" name="class" value="球衣" onClick={() => {
                                        filterByClass('球衣');
                                        setClassifType2('球衣');
                                    }} />
                                    <label htmlFor="cloth" >球衣</label>
                                    <br />
                                    <input className={`div-3 me-2  ${styles.div3}`} type="radio" id="gloves" name="class" value="手套" onClick={() => {
                                        filterByClass('手套');
                                        setClassifType2('手套');
                                    }} />
                                    <label htmlFor="gloves" >手套</label>
                                    <br />
                                    <input className={`div-3 me-2   ${styles.div3}`} type="radio" id="pants" name="class" value="球褲" onClick={() => {
                                        filterByClass('球褲');
                                        setClassifType2('球褲');
                                    }} />
                                    <label htmlFor="pants" >球褲</label>
                                    <br />
                                    <input className={`div-3 me-2    ${styles.div3}`} type="radio" id="sock" name="class" value="襪子" onClick={() => {
                                        filterByClass('襪子');
                                        setClassifType2('襪子');
                                    }} />
                                    <label htmlFor="sock" >襪子</label>
                                    <br />
                                    <input className={`div-3 me-2   ${styles.div3}`} type="radio" id="sneaker" name="class" value="球鞋" onClick={() => {
                                        filterByClass('球鞋');
                                        setClassifType2('球鞋');
                                    }} />
                                    <label htmlFor="sneaker" >球鞋</label>
                                    <br />
                                    <input className={`div-3 me-2   ${styles.div3}`} type="radio" id="equip" name="class" value="裝備" onClick={() => {
                                        filterByClass('裝備');
                                        setClassifType2('裝備');
                                    }} />
                                    <label htmlFor="equip" >裝備</label>
                                    <br />
                                    <input className={`div-3 me-2   ${styles.div3}`} type="radio" id="gear" name="class" value="護具" onClick={() => {
                                        filterByClass('護具');
                                        setClassifType2('護具');
                                    }} />
                                    <label htmlFor="gear" >護具</label>
                                    <br />
                                    <div className={`div-33  ${styles.div33}`}></div>
                                </div>
                            </div>

                            <div className={`div form-item  ${styles.div}`}>
                                <div className={`div-2 mt-3 ${styles.div2}`} >品牌分類</div>
                                <div className={` form-item  `}>
                                    <input className={`div-3 me-2 t   ${styles.div3}`} type="radio" id="ASICS" name="brand" value="ASICS" onClick={() => filterByBrand('ASICS')} checked={selectedBrand === 'ASICS'} onChange={(event) => handleFilterSelection(event, "brand")}/>
                                    <label htmlFor="ASICS" >ASICS</label>
                                    <br />
                                    <input className={`div-3 me-2    ${styles.div3}`} type="radio" id="BRETT" name="brand" value="BRETT" onClick={() => filterByBrand('BRETT')}  checked={selectedBrand === 'BRETT'} onChange={(event) => handleFilterSelection(event, "brand")}/>
                                    <label htmlFor="BRETT" >BRETT</label>
                                    <br />
                                    <input className={`div-3 me-2    ${styles.div3}`} type="radio" id="EASTON" name="brand" value="EASTON" onClick={() => filterByBrand('EASTON')}  checked={selectedBrand === 'EASTON'} onChange={(event) => handleFilterSelection(event, "brand")}/>
                                    <label htmlFor="EASTON" >EASTON</label>
                                    <br />
                                    <input className={`div-3 me-2   ${styles.div3}`} type="radio" id="FILA" name="brand" value="FILA" onClick={() => filterByBrand('FILA')}  checked={selectedBrand === 'FILA'} onChange={(event) => handleFilterSelection(event, "brand")}/>
                                    <label htmlFor="fila" >FILA</label>
                                    <br />
                                    <input className={`div-3 me-2   ${styles.div3}`} type="radio" id="MIZUNO" name="brand" value="MIZUNO" onClick={() => filterByBrand('MIZUNO')}  checked={selectedBrand === 'MIZUNO'} onChange={(event) => handleFilterSelection(event, "brand")}/>
                                    <label htmlFor="MIZUNO" >MIZUNO</label>
                                    <br />
                                    <input className={`div-3 me-2   ${styles.div3}`} type="radio" id="New Balance" name="brand" value="New Balance" onClick={() => filterByBrand('New Balance')}  checked={selectedBrand === 'New Balance'} onChange={(event) => handleFilterSelection(event, "brand")}/>
                                    <label htmlFor="New Balance" >New Balance</label>
                                    <br />
                                    <input className={`div-3 me-2   ${styles.div3}`} type="radio" id="Nike" name="brand" value="Nike" onClick={() => filterByBrand('Nike')}  checked={selectedBrand === 'Nike'} onChange={(event) => handleFilterSelection(event, "brand")}/>
                                    <label htmlFor="Nike" >Nike</label>
                                    <br />
                                    <input className={`div-3 me-2   ${styles.div3}`} type="radio" id="OAKLEY" name="brand" value="OAKLEY" onClick={() => filterByBrand('OAKLEY')} checked={selectedBrand === 'OAKLEY'} onChange={(event) => handleFilterSelection(event, "brand")}/>
                                    <label htmlFor="OAKLEY" >OAKLEY</label>
                                    <br />
                                    <input className={`div-3 me-2   ${styles.div3}`} type="radio" id="UNDER ARMOUR" name="brand" value="UNDER ARMOUR" onClick={() => filterByBrand('UNDER ARMOUR')} checked={selectedBrand === 'UNDER ARMOUR'} onChange={(event) => handleFilterSelection(event, "brand")}/>
                                    <label htmlFor="UNDER ARMOUR" >UNDER ARMOUR</label>
                                    <br />
                                    <input className={`div-3 me-2   ${styles.div3}`} type="radio" id="SSK" name="brand" value="SSK" onClick={() => filterByBrand('SSK')} checked={selectedBrand === 'SSK'} onChange={(event) => handleFilterSelection(event, "brand")}/>
                                    <label htmlFor="SSK" >SSK</label>
                                    <br />
                                    <input className={`div-3 me-2   ${styles.div3}`} type="radio" id="ZETT" name="brand" value="ZETT" onClick={() => filterByBrand('ZETT')} checked={selectedBrand === 'ZETT'} onChange={(event) => handleFilterSelection(event, "brand")}/>
                                    <label htmlFor="ZETT" >ZETT</label>
                                    <br />
                                    <div className={`div-33  ${styles.div33}`}></div>
                                </div>
                            </div>

                            <div className={`div form-item  ${styles.div}`}>
                                <div className={`div-2 mt-3 ${styles.div2}`}>金額</div>
                                <div className={` form-item  `}>
                                    <input className={`div-3 me-2   ${styles.div3}`} type="radio" id="below500" name="price" value="below500" onClick={() => filterByPrice('below500')}  checked={selectedPrice === 'below500'} onChange={(event) => handleFilterSelection(event, "price")}/>
                                    <label htmlFor="below500" > 500 以下</label>
                                    <br />
                                    <input className={`div-3 me-2   ${styles.div3}`} type="radio" id="500to1000" name="price" value="500to1000" onClick={() => filterByPrice('500to1000')} checked={selectedPrice === '500to1000'} onChange={(event) => handleFilterSelection(event, "price")}/>
                                    <label htmlFor="500to1000" >500~1000</label>
                                    <br />
                                    <input className={`div-3 me-2  ${styles.div3}`} type="radio" id="1000to2000" name="price" value="1000to2000" onClick={() => filterByPrice('1000to2000')} checked={selectedPrice === '1000to2000'} onChange={(event) => handleFilterSelection(event, "price")} />
                                    <label htmlFor="1000to2000">1000~2000</label>
                                    <br />
                                    <input className={`div-3 me-2   ${styles.div3}`} type="radio" id="2000to3000" name="price" value="2000to3000" onClick={() => filterByPrice('2000to3000')}  checked={selectedPrice === '2000to3000'} onChange={(event) => handleFilterSelection(event, "price")}/>
                                    <label htmlFor="2000to3000">2000~3000</label>
                                    <br />
                                    <input className={`div-3 me-2   ${styles.div3}`} type="radio" id="above3000" name="price" value="above3000" onClick={() => filterByPrice('above3000')} checked={selectedPrice === 'above3000'} onChange={(event) => handleFilterSelection(event, "price")}/>
                                    <label htmlFor="above3000" >3000 以上</label>
                                    <br />
                                    <div className={`div-33  ${styles.div33}`}></div>
                                </div>
                            </div>

                            <div className={`div form-item  ${styles.div}`}>
                                <div className={`div-2 mt-3 ${styles.div2}`}>顏色</div>
                                <div className={` form-item  `}>
                                    <input className={`div-3 me-2   ${styles.div3}`} type="radio" id="黑" name="color" value="黑" onClick={() => filterByColor('黑')} checked={selectedColor === '黑'} onChange={(event) => handleFilterSelection(event, "color")}/>
                                    <label htmlFor="黑" >黑</label>
                                    <br />
                                    <input className={`div-3 me-2   ${styles.div3}`} type="radio" id="白" name="color" value="白" onClick={() => filterByColor('白')} checked={selectedColor === '白'} onChange={(event) => handleFilterSelection(event, "color")}/>
                                    <label htmlFor="白" >白</label>
                                    <br />
                                    <input className={`div-3 me-2   ${styles.div3}`} type="radio" id="紅" name="color" value="紅" onClick={() => filterByColor('紅')} checked={selectedColor === '紅'} onChange={(event) => handleFilterSelection(event, "color")}/>
                                    <label htmlFor="紅" >紅</label>
                                    <br />
                                    <input className={`div-3 me-2   ${styles.div3}`} type="radio" id="黃" name="color" value="黃" onClick={() => filterByColor('黃')} checked={selectedColor === '黃'} onChange={(event) => handleFilterSelection(event, "color")}/>
                                    <label htmlFor="黃" >黃</label>
                                    <br />
                                    <input className={`div-3 me-2  ${styles.div3}`} type="radio" id="藍" name="color" value="藍" onClick={() => filterByColor('藍')} checked={selectedColor === '藍'} onChange={(event) => handleFilterSelection(event, "color")}/>
                                    <label htmlFor="blue" >藍</label>
                                    <br />
                                    <input className={`div-3 me-2   ${styles.div3}`} type="radio" id="綠" name="color" value="綠" onClick={() => filterByColor('綠')} checked={selectedColor === '綠'} onChange={(event) => handleFilterSelection(event, "color")}/>
                                    <label htmlFor="綠" >綠</label>
                                    <br />
                                    <input className={`div-3 me-2   ${styles.div3}`} type="radio" id="橘" name="color" value="橘" onClick={() => filterByColor('橘')} checked={selectedColor === '橘'} onChange={(event) => handleFilterSelection(event, "color")}/>
                                    <label htmlFor="橘" >橘</label>
                                    <br />
                                    <input className={`div-3 me-2   ${styles.div3}`} type="radio" id="one" name="color" value="單一顏色" onClick={() => filterByColor('單一顏色')} checked={selectedColor === '單一顏色'} onChange={(event) => handleFilterSelection(event, "color")}/>
                                    <label htmlFor="one" >單色</label>
                                    <br />
                                    <div className={`div-33  ${styles.div33}`}></div>
                                </div>
                            </div>

                        </form>



                    </div>

                    <div className="col-12 col-sm-10 mt-5">

                        <div className={`box1  ${styles.box1}`}>
                            <div>
                                <h4>{classifType2}</h4>
                            </div>
                            <div className="col-4 ">
                                <form onSubmit={handleSubmit}>
                                    <div className="input-group mb-3">

                                        <input
                                            type="text"
                                            className="form-control rounded-0"
                                            placeholder="輸入關鍵字搜尋商品"
                                            aria-label="Recipient's username"
                                            aria-describedby="button-addon2"

                                            value={tempInputValue}
                                            // onChange 事件处理函数仅更新临时状态变量 tempInputValue
                                            onChange={(e) => setTempInputValue(e.target.value)}
                                            name="inputName"

                                        />

                                        <button

                                            type="submit"
                                            id="button-addon2"
                                            className={`btn btn-secondary rounded-0 ${isSearchPerformed ? 'btn-return' : 'btn-search'
                                                } `} // 根据状态决定按钮样式
                                        >
                                            {/* 根据 isSearchPerformed 状态决定按钮内容 */}
                                            {isSearchPerformed ? '返回' : '搜索'}



                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        {/* 手機板的搜尋和所有商品 */}
                        <div className={`box54  ${styles.box54}`}>
                            
                            <div className="col-12 ">
                            <a href="/product" className={`tete ${styles.tete}`}><h3>所有商品</h3></a>
                            </div>
                        </div>

                        <div className={`box55  ${styles.box55}`}>
                            
                            <div className="col-12 ">
                                <form onSubmit={handleSubmit}>
                                    <div className="input-group mb-3">

                                        <input
                                            type="text"
                                            className="form-control rounded-0"
                                            placeholder="輸入關鍵字搜尋商品"
                                            aria-label="Recipient's username"
                                            aria-describedby="button-addon2"

                                            value={tempInputValue}
                                            // onChange 事件处理函数仅更新临时状态变量 tempInputValue
                                            onChange={(e) => setTempInputValue(e.target.value)}
                                            name="inputName"

                                        />

                                        <button

                                            type="submit"
                                            id="button-addon2"
                                            className={`btn btn-secondary rounded-0 ${isSearchPerformed ? 'btn-return' : 'btn-search'
                                                } `} // 根据状态决定按钮样式
                                        >
                                            {/* 根据 isSearchPerformed 状态决定按钮内容 */}
                                            {isSearchPerformed ? '返回' : '搜索'}



                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        

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
                                                <div className="accordion-body" onClick={() => {
                                                    filterByOther('鋁棒');
                                                    // handleBatSelect('鋁棒');
                                                    handleClassifSelect('鋁棒');
                                                }}  >
                                                    鋁棒
                                                </div>
                                            </div>
                                            <div
                                                id="collapseOne2"
                                                className={`accordion-collapse collapse ${isAccordionOpen ? 'show' : ''}`}
                                                aria-labelledby="headingOne"
                                                data-bs-parent="#accordionExample"
                                            >
                                                <div className="accordion-body" onClick={() => {
                                                    filterByOther('木棒');
                                                    // handleBatSelect('木棒');
                                                    handleClassifSelect('木棒');
                                                }}  >
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
                                                <div className="accordion-body" onClick={() => {
                                                    filterByOther('硬式');
                                                    // handleBallSelect('硬式');
                                                    handleClassifSelect('硬式');
                                                }}  >
                                                    硬式
                                                </div>
                                            </div>
                                            <div
                                                id="collapseTwo2"
                                                className={`accordion-collapse collapse ${isAccordionOpen1 ? 'show' : ''}`}

                                                aria-labelledby="headingTwo"
                                                data-bs-parent="#accordionExample"
                                            >
                                                <div className="accordion-body" onClick={() => {
                                                    filterByOther('軟式');
                                                    // handleBallSelect('軟式');
                                                    handleClassifSelect('軟式');
                                                }}  >
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
                                                <div className="accordion-body" onClick={() => {
                                                    filterByOther('球帽');
                                                    // handleHatSelect('球帽');
                                                    handleClassifSelect('球帽');
                                                }}>
                                                    球帽
                                                </div>
                                            </div>
                                            <div
                                                id="collapseThree2"
                                                className={`accordion-collapse collapse ${isAccordionOpen2 ? 'show' : ''}`}

                                                aria-labelledby="headingThree"
                                                data-bs-parent="#accordionExample"
                                            >
                                                <div className="accordion-body" onClick={() => {
                                                    filterByOther('打擊頭盔');
                                                    // handleHatSelect('打擊頭盔');
                                                    handleClassifSelect('打擊頭盔');
                                                }}>
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
                                                <div className="accordion-body" onClick={() => {
                                                    filterByOther('長袖');
                                                    // handleClothSelect('長袖');
                                                    handleClassifSelect('長袖');
                                                }}>
                                                    長袖
                                                </div>
                                            </div>
                                            <div
                                                id="collapsefour2"
                                                className={`accordion-collapse collapse ${isAccordionOpen3 ? 'show' : ''}`}

                                                aria-labelledby="headingfour"
                                                data-bs-parent="#accordionExample"
                                            >
                                                <div className="accordion-body" onClick={() => {
                                                    filterByOther('短袖');
                                                    // handleClothSelect('短袖');
                                                    handleClassifSelect('短袖');
                                                }}>
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
                                                <div className="accordion-body" onClick={() => {
                                                    filterByOther('左手');
                                                    // handleGlovesSelect('左手');
                                                    handleClassifSelect('左手');
                                                }}>
                                                    左手
                                                </div>
                                            </div>
                                            <div
                                                id="collapsefive2"
                                                className={`accordion-collapse collapse ${isAccordionOpen4 ? 'show' : ''}`}

                                                aria-labelledby="headingfive"
                                                data-bs-parent="#accordionExample"
                                            >
                                                <div className="accordion-body" onClick={() => {
                                                    filterByOther('右手');
                                                    // handleGlovesSelect('右手');
                                                    handleClassifSelect('右手');
                                                }}>
                                                    右手
                                                </div>
                                            </div>
                                            <div
                                                id="collapsefive3"
                                                className={`accordion-collapse collapse ${isAccordionOpen4 ? 'show' : ''}`}

                                                aria-labelledby="headingfive"
                                                data-bs-parent="#accordionExample"
                                            >
                                                <div className="accordion-body" onClick={() => {
                                                    filterByOther('打擊手套');
                                                    // handleGlovesSelect('打擊手套');
                                                    handleClassifSelect('打擊手套');
                                                }}>
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
                                                <div className="accordion-body" onClick={() => {
                                                    filterByOther('長褲');
                                                    // handlePantsSelect('長褲');
                                                    handleClassifSelect('長褲');
                                                }}>
                                                    長褲
                                                </div>
                                            </div>
                                            <div
                                                id="collapsesix2"
                                                className={`accordion-collapse collapse ${isAccordionOpen5 ? 'show' : ''}`}

                                                aria-labelledby="headingsix"
                                                data-bs-parent="#accordionExample"
                                            >
                                                <div className="accordion-body" onClick={() => {
                                                    filterByOther('短褲');
                                                    // handlePantsSelect('短褲');
                                                    handleClassifSelect('短褲');
                                                }}>
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
                                                <div className="accordion-body" onClick={() => {
                                                    filterByOther('長筒');
                                                    // handleSockSelect('長筒');
                                                    handleClassifSelect('長筒');
                                                }}>
                                                    長筒
                                                </div>
                                            </div>
                                            <div
                                                id="collapseseven2"
                                                className={`accordion-collapse collapse ${isAccordionOpen6 ? 'show' : ''}`}

                                                aria-labelledby="headingseven"
                                                data-bs-parent="#accordionExample"
                                            >
                                                <div className="accordion-body" onClick={() => {
                                                    filterByOther('短筒');
                                                    // handleSockSelect('短筒');
                                                    handleClassifSelect('短筒');
                                                }}>
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
                                                <div className="accordion-body" onClick={() => {
                                                    filterByOther('跑鞋');
                                                    // handleShoeSelect('跑鞋');
                                                    handleClassifSelect('跑鞋');
                                                }}>
                                                    跑鞋
                                                </div>
                                            </div>
                                            <div
                                                id="collapseeight2"
                                                className={`accordion-collapse collapse ${isAccordionOpen7 ? 'show' : ''}`}

                                                aria-labelledby="headingeight"
                                                data-bs-parent="#accordionExample"
                                            >
                                                <div className="accordion-body" onClick={() => {
                                                    filterByOther('釘鞋');
                                                    // handleShoeSelect('釘鞋');
                                                    handleClassifSelect('釘鞋');
                                                }}>
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
                                                <div className="accordion-body" onClick={() => {
                                                    filterByOther('球袋');
                                                    // handleEquipSelect('球袋');
                                                    handleClassifSelect('球袋');
                                                }}>
                                                    球袋
                                                </div>
                                            </div>
                                            <div
                                                id="collapsenine2"
                                                className={`accordion-collapse collapse ${isAccordionOpen8 ? 'show' : ''}`}

                                                aria-labelledby="headingnine"
                                                data-bs-parent="#accordionExample"
                                            >
                                                <div className="accordion-body" onClick={() => {
                                                    filterByOther('手套袋');
                                                    // handleEquipSelect('手套袋');
                                                    handleClassifSelect('手套袋');
                                                }}>
                                                    手套袋
                                                </div>
                                            </div>
                                            <div
                                                id="collapsenine3"
                                                className={`accordion-collapse collapse ${isAccordionOpen8 ? 'show' : ''}`}
                                                aria-labelledby="headingnine"
                                                data-bs-parent="#accordionExample"
                                            >
                                                <div className="accordion-body" onClick={() => {
                                                    filterByOther('球鞋袋');
                                                    // handleEquipSelect('球鞋袋');
                                                    handleClassifSelect('球鞋袋');
                                                }}>
                                                    球鞋袋
                                                </div>
                                            </div>
                                            <div
                                                id="collapsenine4"
                                                className={`accordion-collapse collapse ${isAccordionOpen8 ? 'show' : ''}`}
                                                aria-labelledby="headingnine"
                                                data-bs-parent="#accordionExample"
                                            >
                                                <div className="accordion-body" onClick={() => {
                                                    filterByOther('球棒袋');
                                                    // handleEquipSelect('球棒袋');
                                                    handleClassifSelect('球棒袋');
                                                }}>
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
                                                <div className="accordion-body" onClick={() => {
                                                    filterByOther('捕手護具');
                                                    // handleGearSelect('捕手護具');
                                                    handleClassifSelect('捕手護具');
                                                }}>
                                                    捕手護具
                                                </div>
                                            </div>
                                            <div
                                                id="collapseten2"
                                                className={`accordion-collapse collapse ${isAccordionOpen9 ? 'show' : ''}`}

                                                aria-labelledby="headingten"
                                                data-bs-parent="#accordionExample"
                                            >
                                                <div className="accordion-body" onClick={() => {
                                                    filterByOther('打擊護具');
                                                    // handleGearSelect('打擊護具');
                                                    handleClassifSelect('打擊護具');
                                                }}>
                                                    打擊護具
                                                </div>
                                            </div>


                                        </div>
                                        <hr />
                                        <div className="">
                                            <div className={`row justify-content-center rrr ${styles.rrr}`}>
                                                <div className="col-auto text-center">
                                                    <button className={`btn me-5 btn3 btn-secondary rounded-0 ${styles.btn3}`} type="button" data-bs-dismiss="modal" aria-label="Close">
                                                        送出
                                                    </button>
                                                    <button className={`btn btn3 btn-secondary rounded-0 ${styles.btn3}`} type="submit" data-bs-dismiss="modal" aria-label="Close" 
                                                    onClick={handleButtonClick}>
                                                        清除
                                                    </button>
                                                </div>
                                            </div>
                                        </div>



                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`modal fade ${styles.win4}`}
                            id="exampleModal1"
                            tabIndex={-1}
                            aria-labelledby="exampleModalLabel"
                            aria-hidden="true"
                        >
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className={`ch ${styles.ch}`}>
                                        <div className={`titlee ${styles.titlee}`}>
                                            <h5>篩選</h5>
                                            <button
                                                type="button"
                                                className={`btn2 btn-close ml-auto ${styles.btn2}`}
                                                data-bs-dismiss="modal" aria-label="Close"

                                            />
                                        </div>
                                        <div className={`brandb ${styles.brandb}`}>
                                            <p>品牌</p>
                                            <div className={`brand-options ${styles.brandOptions}`}>
                                                <div className={`brand-option ${styles.brandOption}`}>
                                                    <input
                                                        className={`brr ${styles.brr}`}
                                                        type="radio"
                                                        id="ASICS"
                                                        name="brand"
                                                        // defaultValue=""
                                                        value="ASICS"
                                                        onClick={() => filterByBrand('ASICS')}
                                                        checked={selectedBrand === 'ASICS'}
                                                        onChange={(event) => handleFilterSelection(event, "brand")}
                                                        


                                                    />
                                                    <label htmlFor="ASICS">ASICS</label>
                                                </div>
                                                <div className={`brand-option ${styles.brandOption}`}>
                                                    <input
                                                        className={`brr ${styles.brr}`}
                                                        type="radio"
                                                        id="FILA"
                                                        name="brand"
                                                        // defaultValue=""
                                                        value="FILA"
                                                        onClick={() => filterByBrand('FILA')}
                                                        checked={selectedBrand === 'FILA'}
                                                        onChange={(event) => handleFilterSelection(event, "brand")}
                                                        
                                                        
                                                    />
                                                    <label htmlFor="FILA">FILA</label>
                                                </div>
                                                <div className={`brand-option ${styles.brandOption}`}>
                                                    <input
                                                        className={`brr ${styles.brr}`}
                                                        type="radio"
                                                        id="NIKE"
                                                        name="brand"
                                                        // defaultValue=""
                                                        value="NIKE"
                                                        onClick={() => filterByBrand('NIKE')}
                                                        checked={selectedBrand === 'NIKE'}
                                                        onChange={(event) => handleFilterSelection(event, "brand")}
                                                        
                                                    />
                                                    <label htmlFor="NIKE">NIKE</label>
                                                    <br />
                                                </div>
                                            </div>
                                            <div className={`brand-options ${styles.brandOptions}`}>
                                                <div className={`brand-option ${styles.brandOption}`}>
                                                    <input
                                                        className={`brr ${styles.brr}`}
                                                        type="radio"
                                                        id="BRETT"
                                                        name="brand"
                                                        // defaultValue=""
                                                        value="BRETT"
                                                        onClick={() => filterByBrand('BRETT')}
                                                        checked={selectedBrand === 'BRETT'}
                                                        onChange={(event) => handleFilterSelection(event, "brand")}
                                                        
                                                    />
                                                    <label htmlFor="BRETT">BRETT</label>
                                                </div>
                                                <div className={`brand-option ${styles.brandOption}`}>
                                                    <input
                                                        className={`brr ${styles.brr}`}
                                                        type="radio"
                                                        id="MIZUNO"
                                                        name="brand"
                                                        // defaultValue=""
                                                        value="MIZUNO"
                                                        onClick={() => filterByBrand('MIZUNO')}
                                                        checked={selectedBrand === 'MIZUNO'}
                                                        onChange={(event) => handleFilterSelection(event, "brand")}
                                                        
                                                    />

                                                    <label htmlFor="MIZUNO">MIZUNO</label>
                                                </div>
                                                <div className={`brand-option ${styles.brandOption}`}>
                                                    <input
                                                        className={`brr ${styles.brr}`}
                                                        type="radio"
                                                        id="ZETT"
                                                        name="brand"
                                                        // defaultValue=""
                                                        value="ZETT"
                                                        onClick={() => filterByBrand('ZETT')}
                                                        checked={selectedBrand === 'ZETT'}
                                                        onChange={(event) => handleFilterSelection(event, "brand")}
                                                        
                                                    />
                                                    <label htmlFor="ZETT">ZETT</label>
                                                    <br />
                                                </div>
                                            </div>
                                            <div className={`brand-options ${styles.brandOptions}`}>
                                                <div className={`brand-option ${styles.brandOption}`}>
                                                    <input
                                                        className={`brr ${styles.brr}`}
                                                        type="radio"
                                                        id="EASTON"
                                                        name="brand"
                                                        // defaultValue=""
                                                        value="EASTON"
                                                        onClick={() => filterByBrand('EASTON')}
                                                        checked={selectedBrand === 'EASTON'}
                                                        onChange={(event) => handleFilterSelection(event, "brand")}
                                                        
                                                    />
                                                    <label htmlFor="EASTON">EASTON</label>
                                                </div>
                                                <div className={`brand-option ${styles.brandOption}`}>
                                                    <input
                                                        className={`brr ${styles.brr}`}
                                                        type="radio"
                                                        id="OAKLEY"
                                                        name="brand"
                                                        // defaultValue=""
                                                        value="OAKLEY"
                                                        onClick={() => filterByBrand('OAKLEY')}
                                                        checked={selectedBrand === 'OAKLEY'}
                                                        onChange={(event) => handleFilterSelection(event, "brand")}
                                                        
                                                    />
                                                    <label htmlFor="OAKLEY">OAKLEY</label>
                                                </div>
                                                <div className={`brand-option ${styles.brandOption}`}>
                                                    <input
                                                        className={`brr ${styles.brr}`}
                                                        type="radio"
                                                        id="SSK"
                                                        name="brand"
                                                        // defaultValue=""
                                                        value="SSK"
                                                        onClick={() => filterByBrand('SSK')}
                                                        checked={selectedBrand === 'SSK'}
                                                        onChange={(event) => handleFilterSelection(event, "brand")}
                                                        
                                                    />
                                                    <label htmlFor="SSK">SSK</label>
                                                    <br />
                                                </div>
                                            </div>
                                            <div className={`brand-options ${styles.brandOptions}`}>
                                                <div className={`brand-option ${styles.brandOption}`}>
                                                    <input
                                                        className={`brr ${styles.brr}`}
                                                        type="radio"
                                                        id="NEW BALANCE"
                                                        name="brand"
                                                        // defaultValue=""
                                                        value="NEW BALANCE"
                                                        onClick={() => filterByBrand('NEW BALANCE')}
                                                        checked={selectedBrand === 'NEW BALANCE'}
                                                        onChange={(event) => handleFilterSelection(event, "brand")}
                                                        
                                                    />
                                                    <label htmlFor="NEW BALANCE">New Balance</label>
                                                </div>
                                                <div className={`brand-option ${styles.brandOption}`}>
                                                    <input
                                                        className={`brr ${styles.brr}`}
                                                        type="radio"
                                                        id="UNDER ARMOURS"
                                                        name="brand"
                                                        // defaultValue=""
                                                        value="UNDER ARMOURS"
                                                        onClick={() => filterByBrand('UNDER ARMOURS')}
                                                        checked={selectedBrand === 'UNDER ARMOURS'}
                                                        onChange={(event) => handleFilterSelection(event, "brand")}
                                                        
                                                    />
                                                    <label htmlFor="UNDER ARMOURS">UNDER ARMOUR</label>
                                                </div>
                                                <div className={`brand-option ${styles.brandOption}`}></div>
                                            </div>
                                        </div>
                                        <hr className={`hh ${styles.hh}`} />
                                        <div className={`color ${styles.color}`}>
                                            <p>顏色</p>
                                            <div className={`brand-options ${styles.brandOptions}`}>
                                                <div className={`brand-option ${styles.brandOption}`}>
                                                    <input
                                                        className={`brr ${styles.brr}`}
                                                        type="radio"
                                                        id="黑"
                                                        name="color"
                                                        // defaultValue=""
                                                        value="黑"
                                                        onClick={() => filterByColor('黑')}
                                                        checked={selectedColor === '黑'}
                                                        onChange={(event) => handleFilterSelection(event, "color")}

                                                    />
                                                    <label htmlFor="黑">黑</label>
                                                </div>
                                                <div className={`brand-option ${styles.brandOption}`}>
                                                    <input
                                                        className={`brr ${styles.brr}`}
                                                        type="radio"
                                                        id="白"
                                                        name="color"
                                                        // defaultValue=""
                                                        value="白"
                                                        onClick={() => filterByColor('白')}
                                                        checked={selectedColor === '白'}
                                                        onChange={(event) => handleFilterSelection(event, "color")}
                                                    />
                                                    <label htmlFor="白">白</label>
                                                </div>
                                                <div className={`brand-option ${styles.brandOption}`}>
                                                    <input
                                                        className={`brr ${styles.brr}`}
                                                        type="radio"
                                                        id="藍"
                                                        name="color"
                                                        // defaultValue=""
                                                        value="藍"
                                                        onClick={() => filterByColor('藍')}
                                                        checked={selectedColor === '藍'}
                                                        onChange={(event) => handleFilterSelection(event, "color")}
                                                    />
                                                    <label htmlFor="藍">藍</label>
                                                </div>
                                                <div className={`brand-option ${styles.brandOption}`}>
                                                    <input
                                                        className={`brr ${styles.brr}`}
                                                        type="radio"
                                                        id="綠"
                                                        name="color"
                                                        // defaultValue=""
                                                        value="綠"
                                                        onClick={() => filterByColor('綠')}
                                                        checked={selectedColor === '綠'}
                                                        onChange={(event) => handleFilterSelection(event, "color")}
                                                    />
                                                    <label htmlFor="綠">綠</label>
                                                    <br />
                                                </div>
                                            </div>
                                            <div className={`brand-options ${styles.brandOptions}`}>
                                                <div className={`brand-option ${styles.brandOption}`}>
                                                    <input
                                                        className={`brr ${styles.brr}`}
                                                        type="radio"
                                                        id="紅"
                                                        name="color"
                                                        // defaultValue=""
                                                        value="紅"
                                                        onClick={() => filterByColor('紅')}
                                                        checked={selectedColor === '紅'}
                                                        onChange={(event) => handleFilterSelection(event, "color")}
                                                    />
                                                    <label htmlFor="紅">紅</label>
                                                </div>
                                                <div className={`brand-option ${styles.brandOption}`}>
                                                    <input
                                                        className={`brr ${styles.brr}`}
                                                        type="radio"
                                                        id="黃"
                                                        name="color"
                                                        // defaultValue=""
                                                        value="黃"
                                                        onClick={() => filterByColor('黃')}
                                                        checked={selectedColor === '黃'}
                                                        onChange={(event) => handleFilterSelection(event, "color")}
                                                    />
                                                    <label htmlFor="黃">黃</label>
                                                </div>
                                                <div className={`brand-option ${styles.brandOption}`}>
                                                    <input
                                                        className={`brr ${styles.brr}`}
                                                        type="radio"
                                                        id="橘"
                                                        name="color"
                                                        // defaultValue=""
                                                        value="橘"
                                                        onClick={() => filterByColor('橘')}
                                                        checked={selectedColor === '橘'}

                                                        onChange={(event) => handleFilterSelection(event, "color")}
                                                    />
                                                    <label htmlFor="橘">橘</label>
                                                    
                                                </div>
                                                <div className={`brand-option ${styles.brandOption}`}>
                                                    <input
                                                        className={`brr ${styles.brr}`}
                                                        type="radio"
                                                        id="單一顏色"
                                                        name="color"
                                                        // defaultValue=""
                                                        value="單一顏色"
                                                        onClick={() => filterByColor('單一顏色')}
                                                        checked={selectedColor === '單一顏色'}

                                                        onChange={(event) => handleFilterSelection(event, "color")}
                                                    />
                                                    <label htmlFor="單一顏色">單色</label>
                                                    <br />
                                                </div>
                                               
                                            </div>
                                        </div>
                                        <hr className={`hh ${styles.hh}`} />
                                        <div className={`price ${styles.price}`} >
                                            <p>金額</p>
                                            <div className={`brand-options ${styles.brandOptions}`}>
                                                <div className={`brand-option ${styles.brandOption}`}>
                                                    <input
                                                        className={`brr ${styles.brr}`}
                                                        type="radio"
                                                        id="below500"
                                                        name="price"
                                                        // defaultValue=""
                                                        value="below500"
                                                        onClick={() => filterByPrice('below500')}
                                                        checked={selectedPrice === 'below500'}
                                                        onChange={(event) => handleFilterSelection(event, "price")}
                                                        
                                                    />
                                                    <label htmlFor="below500">500以下</label>
                                                </div>
                                                <div className={`brand-option ${styles.brandOption}`}>
                                                    <input
                                                        className={`brr ${styles.brr}`}
                                                        type="radio"
                                                        id="500to1000"
                                                        name="price"
                                                        // defaultValue=""
                                                        value="500to1000"
                                                        onClick={() => filterByPrice('500to1000')}
                                                        checked={selectedPrice === '500to1000'}
                                                        onChange={(event) => handleFilterSelection(event, "price")}
                                                        
                                                    />
                                                    <label htmlFor="500to1000">500~1000</label>
                                                </div>
                                            </div>
                                            <div className={`brand-options ${styles.brandOptions}`}>
                                                <div className={`brand-option ${styles.brandOption}`}>
                                                    <input
                                                        className={`brr ${styles.brr}`}
                                                        type="radio"
                                                        id="1000to2000"
                                                        name="price"
                                                        // defaultValue=""
                                                        value="1000to2000"
                                                        onClick={() => filterByPrice('1000to2000')}
                                                        checked={selectedPrice === '1000to2000'}
                                                        onChange={(event) => handleFilterSelection(event, "price")}
                                                        
                                                    />
                                                    <label htmlFor="1000to2000">1000~2000</label>
                                                </div>
                                                <div className={`brand-option ${styles.brandOption}`}>
                                                    <input
                                                        className={`brr ${styles.brr}`}
                                                        type="radio"
                                                        id="2000to3000"
                                                        name="price"
                                                        // defaultValue=""
                                                        value="2000to3000"
                                                        onClick={() => filterByPrice('2000to3000')}
                                                        checked={selectedPrice === '2000to3000'}
                                                        onChange={(event) => handleFilterSelection(event, "price")}
                                                        
                                                    />
                                                    <label htmlFor="2000to3000">2000~3000</label>
                                                </div>
                                            </div>
                                            <div className={`brand-options ${styles.brandOptions}`}>
                                                <div className={`brand-option ${styles.brandOption}`}>
                                                    <input
                                                        className={`brr ${styles.brr}`}
                                                        type="radio"
                                                        id="above3000"
                                                        name="price"
                                                        // defaultValue=""
                                                        value="above3000"
                                                        onClick={() => filterByPrice('above3000')}
                                                        checked={selectedPrice === 'above3000'}
                                                        onChange={(event) => handleFilterSelection(event, "price")}
                                                        
                                                    />
                                                    <label htmlFor="above3000">3000以上</label>
                                                </div>
                                                <div className={`brand-option ${styles.brandOption}`}></div>
                                            </div>
                                        </div>
                                        <hr className={`hh ${styles.hh}`} />
                                        <div className={`price ${styles.price}`}>
                                            <div className={`brand-options ${styles.brandOptions}`}>
                                                <div className={`brand-option d-flex justify-content-between ${styles.brandOption}`}>
                                                    <button className={`btn btn1 btn-secondary rounded-0 ${styles.btn1}`} type="submit" data-bs-dismiss="modal" aria-label="Close" onClick={handleClear}>
                                                        清除
                                                    </button>
                                                    <button className={`btn btn1 btn-secondary rounded-0 ${styles.btn1}`} type="button" data-bs-dismiss="modal" aria-label="Close" >
                                                        送出
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`modal fade ${styles.win3}`}
                            id="exampleModal2"
                            tabIndex={-1}
                            aria-labelledby="exampleModalLabel"
                            aria-hidden="true"
                        >
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className={`ch3 ${styles.ch3}`}>
                                        <div className={`titlee1 ${styles.titlee1}`}>
                                            <h5>排序 </h5>
                                            <button
                                                type="button"
                                                className={`btn-close btn4 ml-auto ${styles.btn4}`}
                                                aria-label="Close" data-bs-dismiss="modal"
                                            />
                                        </div>
                                        <div className="">
                                            <div className="">
                                                <div className={`order ${styles.order}  `} onClick={() => setSortType('預設')}>
                                                    <input
                                                        className={`ooder1 ${styles.ooder1} `}
                                                        type="radio"
                                                        id="default"
                                                        name="sort"
                                                        value={0}
                                                        //defaultValue=""
                                                        onChange={handleSortChange}
                                                    />
                                                    <label htmlFor="default" >預設</label>
                                                </div>
                                                <div className={`order ${styles.order}  `} onClick={() => setSortType('最熱門')}>
                                                    <input
                                                        className={`ooder1 ${styles.ooder1} `}
                                                        type="radio"
                                                        id="hot"
                                                        name="sort"
                                                        value={1}
                                                        //defaultValue=""
                                                        onChange={handleSortChange}
                                                    />
                                                    <label htmlFor="hot" >最熱門</label>
                                                </div>
                                                <div className={`order ${styles.order}`} onClick={() => setSortType('最新上架')}>
                                                    <input
                                                        className={`ooder1 ${styles.ooder1} `}
                                                        type="radio"
                                                        id="new"
                                                        name="sort"
                                                        value={2}
                                                        //defaultValue=""
                                                        onChange={handleSortChange}
                                                    />
                                                    <label htmlFor="new" >最新上架</label>

                                                </div>
                                                <div className={`order ${styles.order}`} onClick={() => setSortType('價格低到高')}>
                                                    <input
                                                        className={`ooder1 ${styles.ooder1} `}
                                                        type="radio"
                                                        id="pricehtol"
                                                        name="sort"
                                                        value={3}
                                                        //defaultValue=""
                                                        onChange={handleSortChange}
                                                    />
                                                    <label htmlFor="pricehtol" >價格低到高</label>

                                                    <br />
                                                </div>
                                                <div className={`order ${styles.order}`} onClick={() => setSortType('價格高到低')}>
                                                    <input
                                                        className={`ooder1 ${styles.ooder1} `}
                                                        type="radio"
                                                        id="priceltoh"
                                                        name="sort"
                                                        value={4}
                                                        //defaultValue=""
                                                        onChange={handleSortChange}
                                                    />
                                                    <label htmlFor="priceltoh" >價格高到低</label>

                                                    <br />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className={`col-3 msAutoReset xxx d-flex align-items-center mt-3  ${styles.xxx} ${styles.msAutoReset} `}>

                            <span className={`ppp1 me-2 ms-auto  ${styles.ppp1} ppp1-mobile-align-left`}>共{productCount}件商品</span>


                            <select className={`form-select  rounded-0  ppx  ${styles.ppx} `} name="order" id="order" onChange={handleSortChange} >
                                <option >排序</option>
                                <option value={1}>最熱門</option>
                                <option value={2}>最新上架</option>
                                <option value={3}>價格低到高</option>
                                <option value={4}>價格高到低</option>
                            </select>

                        </div>


                        <div className="mt-4"   >
                            {dataToShow.length === 0 ? (
                                // 當 `dataToShow` 為空時，顯示提示消息
                                <div style={{ textAlign: 'center' }}>
                                    <h3>無搜尋結果，沒有符合條件的商品</h3>
                                    <br />
                                    <h6>請嘗試使用其他關鍵字</h6>
                                </div>
                            ) : (

                                dataToShow.map((product) => {
                                    {/* const firstImageUrl = product.image_url.split(',')[0]; */}
                                    return (
                                        <div key={product.id} className={`box3 mx-3 my-3 ${styles.box3}`}>
                                            <Link href={`/product/${product.id}`}>
                                                <figcaption className={`avatar ${styles.avatar}`}>
                                                    <img src={`/images/product/${product.image_url}`} alt={product.name} />
                                                </figcaption>
                                            
                                            
                                                <h6 className={`single-ellipsis1 text-black name ${styles.singleEllipsis1} ${styles.name}`}>{product.name}</h6>
                                            {/* 四舍五入 */}
                                            <div className={`box4 ${styles.box4}`}>${Math.round(product.price * 0.8)}</div>
                                            </Link>
                                            <div className={`bbox ${styles.bbox}`}>
                                                <p className={`box5 ${styles.box5}`}>${product.price}</p>
                                                
                                                <div onClick={() => handleToggleFav(product.id)} className={`iconContainer ${styles.iconContainer}`} style={{ fontSize: '1.2rem', color: 'red' }} >
                                                    {/* 根据 product.fav 的值来显示不同的图片，并在点击时切换 */}
                                                    <Image
                                                        src={
                                                            favoriteProductIds.includes(product.id)
                                                                ? favoriteLove
                                                                : favorite
                                                        }
                                                        alt=""
                                                    />

                                                </div>
                                            </div>
                                        </div>
                                    )
                                }))}


                            {/* {searchQuery === ''
  ? currentProducts.map((product) => (
      <div key={product.id} className={`box3 mx-3 my-3 ${styles.box3}`}>
        <Link href={`/product/${product.id}`}>
          <figcaption className={`avatar ${styles.avatar}`}>
            <img src={`/images/product/${product.image_url}`} alt="" />
          </figcaption>
        </Link>
        <Link href={`/product/product${product.id}`}>
          <h6 className={`single-ellipsis1 text-black name ${styles.singleEllipsis1} ${styles.name}`}>{product.name}</h6>
        </Link>
        <div className={`box4 ${styles.box4}`}>{Math.round(product.price * 0.8)}</div>
        <div className={`bbox ${styles.bbox}`}>
          <p className={`box5 ${styles.box5}`}>{product.price}</p>
          <div className={`iconContainer ${styles.iconContainer}`} style={{ fontSize: '1.2rem', color: 'red' }}>
            根据商品的fav属性渲染不同的收藏图标
            {product.fav
              ? <FaHeart onClick={() => handleToggleFav(product.id)} />
              : <FaRegHeart onClick={() => handleToggleFav(product.id)} />}
          </div>
        </div>
      </div>
    ))
  : currentSearchProducts.map((product) => (
      <div key={product.id} className={`box3 mx-3 my-3 ${styles.box3}`}>
        <Link href={`/product/${product.id}`}>
          <figcaption className={`avatar ${styles.avatar}`}>
            <img src={`/images/product/${product.image_url}`} alt="" />
          </figcaption>
        </Link>
        <Link href={`/product/product${product.id}`}>
          <h6 className={`single-ellipsis1 text-black name ${styles.singleEllipsis1} ${styles.name}`}>{product.name}</h6>
        </Link>
        <div className={`box4 ${styles.box4}`}>{Math.round(product.price * 0.8)}</div>
        <div className={`bbox ${styles.bbox}`}>
          <p className={`box5 ${styles.box5}`}>{product.price}</p>
          <div className={`iconContainer ${styles.iconContainer}`} style={{ fontSize: '1.2rem', color: 'red' }}>
             根据商品的fav属性渲染不同的收藏图标 
            {product.fav
              ? <FaHeart onClick={() => handleToggleFav(product.id)} />
              : <FaRegHeart onClick={() => handleToggleFav(product.id)} />}
          </div>
        </div>
      </div>
    ))
} */}










                        </div>









                        <div className={`clear  ${styles.clear}`}></div>

                        <div className="d-flex justify-content-center my-5">

                            {shouldShowPagination && (
                                <nav aria-label="Page navigation example d-flex justify-content-center">
                                    <ul className="mt-5 pagination d-flex justify-content-center ">
                                        {/* 上一頁按鈕 */}
                                        <li
                                            className={`page-item ${currentPage === 1 ? 'disabled' : ''
                                                }`}
                                        >
                                            <a
                                                className="page-link"
                                                href="#"
                                                aria-label="Previous"
                                                onClick={(event) => {
                                                    event.preventDefault()
                                                    handlePageChange(currentPage - 1)
                                                }}
                                            >
                                                <span aria-hidden="true"><BiSolidLeftArrow /></span>
                                            </a>
                                        </li>

                                        {/* 頁碼按鈕 */}
                                        {Array.from({ length: totalPages }, (_, index) => {
                                            const page = index + 1
                                            return (
                                                <li
                                                    key={page}
                                                    className={`page-item ${currentPage === page ? 'active' : ''
                                                        }`}
                                                >
                                                    <a
                                                        className="page-link"
                                                        href="#"
                                                        onClick={(event) => {
                                                            event.preventDefault()
                                                            handlePageChange(page)
                                                        }}
                                                    >
                                                        {page}
                                                    </a>
                                                </li>
                                            )
                                        })}

                                        {/* 下一頁按鈕 */}
                                        <li
                                            className={`page-item ${currentPage === totalPages ? 'disabled' : ''
                                                }`}
                                        >
                                            <a
                                                className="page-link"
                                                href="#"
                                                aria-label="Next"
                                                onClick={(event) => {
                                                    event.preventDefault()
                                                    handlePageChange(currentPage + 1)
                                                }}
                                            >
                                                <span aria-hidden="true"><BiSolidRightArrow /></span>
                                            </a>
                                        </li>
                                    </ul>
                                </nav>
                            )}
                        </div>

                        {/* <nav aria-label="Page navigation example">
            <ul className="pagination">
                <li className="page-item ms-2">
                    <a className="page-link text-black" href="#" aria-label="Previous" onClick={handlePrevPage}>
                        <span aria-hidden="true"><BiSolidLeftArrow /></span>
                    </a>
                </li>
                <li className={`page-item ms-2 ${currentPage === 1 ? 'active' : ''}`}>
                    <a className="page-link text-black " href="#" onClick={() => handlePageClick(1)}>1</a>
                </li>
                <li className={`page-item ms-2 ${currentPage === 2 ? 'active' : ''}`}>
                    <a className="page-link text-black" href="#" onClick={() => handlePageClick(2)}>2</a>
                </li>
                <li className={`page-item ms-2 ${currentPage === 3 ? 'active' : ''}`}>
                    <a className="page-link text-black" href="#" onClick={() => handlePageClick(3)}>3</a>
                </li>
                <li className="page-item ms-2">
                    <a className="page-link text-black" href="#" aria-label="Next" onClick={handleNextPage}>
                        <span aria-hidden="true"><BiSolidRightArrow /></span>
                    </a>
                </li>
            </ul>
        </nav> */}


                    </div>




                </div>



            </div>







        </>

    );
}






//無防抖動