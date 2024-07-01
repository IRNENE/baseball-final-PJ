import React, { useState, useEffect } from 'react'
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









export default function Product() {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({ inputValue: '' });
    const [productCount, setProductCount] = useState(0)
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);





    const router = useRouter();
    // 定义状态来保存商品列表和筛选条件
    const [filter, setFilter] = useState({
        price: '', // 筛选价格
        category: '' // 筛选类别，你也可以根据需要添加其他筛选条件

    });









    useEffect(() => {
        // 要document物件出現後才能導入 bootstrap的js函式庫
        import('@/node_modules/bootstrap/dist/js/bootstrap')
    }, [])

    useEffect(() => {
        // 獲取商品數據
        const fetchProducts = async () => {
            let url = (searchQuery === '') ?
                'http://localhost:3005/api/product' :
                `http://localhost:3005/api/product/search/${encodeURIComponent(searchQuery)}`;
            try {
                const response = await fetch(url);
                const data = await response.json();

                setProducts(data);
                setProductCount(data.length); // 获取商品列表的长度并更新productCount
                setSearchResults(searchQuery === '' ? [] : data); // 如果不是搜索，清空搜索结果
                // 初始化每个商品的收藏状态为 false
                const status = {};
                data.forEach((product) => {
                    status[product.id] = false;
                });

                setFavoriteStatus(status);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        // 调用异步函数
        fetchProducts();
    }, [formData, searchQuery]);



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
    //     // 阻止事件冒泡，以免影响其他元素
    // event.preventDefault();
    // event.stopPropagation();
    // setFavoriteStatus(prevStatus => ({
    //     ...prevStatus,
    //     [productId]: !prevStatus[productId]
    // }));
    // };

    // 點擊圖標切換收藏狀態
    const handleToggleFav = async (productId) => {
        try {
            // 判斷是否已經收藏
            if (favoriteStatus[productId]) {
                // 如果已經收藏，則向後端發送 DELETE 請求以刪除收藏
                const res = await fetch(`http://localhost:3005/api/wishlist-product/${productId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                if (res.ok) {
                    setProducts(prevProducts => {
                        return prevProducts.map(product => {
                            if (product.id === productId) {
                                // 切换收藏状态
                                return { ...product, fav: !product.fav };
                            }
                            return product;
                        });
                    })
                } else{
                console.log('收藏狀態切換失敗', error);
            }
            } else {
                // 如果未收藏，則向後端發送 POST 請求以添加收藏
                const res = await fetch(`http://localhost:3005/api/wishlist-product/${productId}`,
                    {
                        method: 'POST',
                        credentials: 'include'
                    });
                    if (res.ok) {
                        setProducts(prevProducts => {
                            return prevProducts.map(product => {
                                if (product.id === productId) {
                                    // 切换收藏状态
                                    return { ...product, fav: !product.fav };
                                }
                                return product;
                            });
                        })
                    } else{
                    console.log('收藏狀態切換失敗', error);
                }
        
            }
        //     if (res.ok) {
        //         setProducts(prevProducts => {
        //             return prevProducts.map(product => {
        //                 if (product.id === productId) {
        //                     // 切换收藏状态
        //                     return { ...product, fav: !product.fav };
        //                 }
        //                 return product;
        //             });
        //         })
        //     } else{
        //     console.log('收藏狀態切換失敗', error);
        // }


            //         // 在收到後端回應後，更新本地收藏狀態
            //         setFavoriteStatus(prevStatus => ({
            //             ...prevStatus,
            //             [productId]: !prevStatus[productId]
            //         }));
        } catch (error) {
        console.error('收藏資料傳送失敗：', error);
        // 在這裡處理錯誤
    }

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

const handleSubmit = (event) => {
    // 在這裡添加提交選項的邏輯
    // 獲取所有已選中的品牌
    const selectedBrands = document.querySelectorAll('input[name="brand"]:checked');
    const selectedBrandValues = Array.from(selectedBrands).map(input => input.value);

    // 獲取所有已選中的顏色
    const selectedColors = document.querySelectorAll('input[name="color"]:checked');
    const selectedColorValues = Array.from(selectedColors).map(input => input.value);

    // 獲取所有已選中的價格
    const selectedPrices = document.querySelectorAll('input[name="price"]:checked');
    const selectedPriceValues = Array.from(selectedPrices).map(input => input.value);

    // 執行提交操作，這裡可以根據應用程序的需要執行相應的操作，例如將選項提交到後端處理、顯示結果等等
    console.log("已選中的品牌:", selectedBrandValues);
    console.log("已選中的顏色:", selectedColorValues);
    console.log("已選中的價格:", selectedPriceValues);

    event.preventDefault()
    const formData = new FormData(event.target)
    const inputValue = formData.get('inputName')
    setFormData({ inputValue })
    event.target.reset()

};


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
        case "class":
            setSelectedClass(filterValue);
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
    // 清除品牌选项
    const brandInputs = document.getElementsByName("brand");
    brandInputs.forEach(input => {
        input.checked = false;
    });

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

    // 清除所有已选择的过滤器选项并将 selectedFiltersCount 设置为零
    setSelectedFilters([]);
    setSelectedFiltersCount(0);
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
//分頁
const [currentPage, setCurrentPage] = useState(1);
const [productsPerPage] = useState(24); // 每页显示的商品数量


// 计算总页数
const totalPages = Math.ceil(products.length / productsPerPage);

// 根据当前页码计算当前页的商品列表
const indexOfLastProduct = currentPage * productsPerPage;
const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
const currentProducts = searchQuery === '' ?
    products.slice(indexOfFirstProduct, indexOfLastProduct) :
    searchResults.slice(indexOfFirstProduct, indexOfLastProduct);


const handlePrevPage = () => {
    if (currentPage > 1) {
        setCurrentPage(prevPage => prevPage - 1);
    }
};

const handleNextPage = () => {
    if (currentPage < totalPages) {
        setCurrentPage(prevPage => prevPage + 1);
    }
};

const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
};
/////////////////////////////////////////////////////////////////////////////
//搜尋 
// 处理搜索输入框的变化，更新搜索查询状态
const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
};

// 搜索表单提交时的处理函数，但实际搜索操作已由useEffect处理
const handleSearch = (event) => {
    event.preventDefault();
    setCurrentPage(1); // 将当前页码重置为 1
    // 搜索逻辑已经在useEffect中处理
};
//////
//搜尋後的分頁
const [searchPage, setSearchPage] = useState(1); // 搜索结果的当前页码
const [searchProductsPerPage] = useState(24); // 搜索结果每页显示的商品数量

// 计算搜索结果当前页的商品列表
const indexOfLastSearchProduct = searchPage * searchProductsPerPage;
const indexOfFirstSearchProduct = indexOfLastSearchProduct - searchProductsPerPage;
const currentSearchProducts = searchResults.slice(indexOfFirstSearchProduct, indexOfLastSearchProduct);


const handleSearchPrevPage = () => {
    if (searchPage > 1) {
        setSearchPage(searchPage - 1);
    }
};

const handleSearchNextPage = () => {
    const totalPages = Math.ceil(searchResults.length / searchProductsPerPage);
    if (searchPage < totalPages) {
        setSearchPage(searchPage + 1);
    }
};

const handleSearchPageClick = (pageNumber) => {
    setSearchPage(pageNumber);
};

<Pagination
    currentPage={searchPage}
    totalPages={Math.ceil(searchResults.length / searchProductsPerPage)}
    onPageChange={handleSearchPageClick}
    onPrevClick={handleSearchPrevPage}
    onNextClick={handleSearchNextPage}
/>
////////////////////////////////////////////////////////////////////////


const [windowWidth, setWindowWidth] = useState(0);

useEffect(() => {
    // 检查是否在客户端环境下
    if (typeof window !== 'undefined') {
        setWindowWidth(window.innerWidth); // 在组件加载时获取窗口宽度
        const handleResize = () => {
            setWindowWidth(window.innerWidth); // 窗口大小变化时更新窗口宽度
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }
}, []); // 空依赖数组确保只在组件加载和卸载时执行

//////////////////////////////////////篩選功能
const handleBrandChange = (event) => {
    const brand = event.target.value;
    setFilter(prevFilter => ({ ...prevFilter, brand }));

};

const handleColorChange = (event) => {
    const color = event.target.value;
    setFilter(prevFilter => ({ ...prevFilter, color }));
};

const handleClassChange = (event) => {
    const class2 = event.target.value;
    setFilter(prevFilter => ({ ...prevFilter, class2 }));
};

const handlePriceFilterChange = (event) => {
    const price = event.target.value;
    setFilter(prevFilter => ({ ...prevFilter, price }));
};

// 处理类别筛选条件变化
const handleCategoryFilterChange = (event) => {
    const category = event.target.value;
    setFilter(prevFilter => ({ ...prevFilter, category }));
};

// 根据筛选条件过滤商品列表
const filteredProducts = products.filter(product => {
    if (filter.brand && product.brand !== filter.brand) {
        return false;
    }

    if (filter.price) {
        const discountedPrice = product.price * 0.8; // 计算八折价格
        if (filter.price === 'below500' && discountedPrice >= 500) {
            return false;
        } else if (filter.price === '500to1000' && (discountedPrice < 500 || discountedPrice >= 1000)) {
            return false;
        } else if (filter.price === '1000to2000' && (discountedPrice < 1000 || discountedPrice >= 2000)) {
            return false;
        } else if (filter.price === '2000to3000' && (discountedPrice < 2000 || discountedPrice >= 3000)) {
            return false;
        } else if (filter.price === 'above3000' && discountedPrice < 3000) {
            return false;
        }
    }

    if (filter.class2 && product.class !== filter.class2) {
        return false;
    }

    if (filter.color && product.color !== filter.color) {
        return false;
    }

    if (filter.category && product.category !== filter.category) {
        return false;
    }

    return true;
});

///////////////////////////












return (


    <>











        <div className={`navber-img-sun ${styles.navberImgSun}`} style={{ position: 'relative' }}>
            <img src=" " alt="" />
            <h1 className={`text text-white ${styles.text}`} style={{ position: 'absolute', top: '30%', left: '18%', transform: 'translate(-50%, -50%)' }}>商品列表</h1>
            <h4 className={`text text-white ${styles.text}`} style={{ position: 'absolute', top: '50%', left: '24.5%', transform: 'translate(-50%, -50%)' }}>提供最專業的用品 讓您場上表現不打折</h4>
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
                                <input className={`div-3 me-2 form-check-input   ${styles.div3}`} type="radio" id="bat" name="class" value="球棒" onChange={handleClassChange} onClick={() => setClassifType2('球棒')} />
                                <label htmlFor="bat" className="form-check-label" >球棒</label>
                                <br />
                                <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="ball" name="class" value="球" onChange={handleClassChange} onClick={() => setClassifType2('球')} />
                                <label htmlFor="ball" className="form-check-label">球</label>
                                <br />
                                <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="hat" name="class" value="帽子" onChange={handleClassChange} onClick={() => setClassifType2('帽子')} />
                                <label htmlFor="hat" className="form-check-label">帽子</label>
                                <br />
                                <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="cloth" name="class" value="球衣" onChange={handleClassChange} onClick={() => setClassifType2('球衣')} />
                                <label htmlFor="cloth" className="form-check-label">球衣</label>
                                <br />
                                <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="gloves" name="class" value="手套" onChange={handleClassChange} onClick={() => setClassifType2('手套')} />
                                <label htmlFor="gloves" className="form-check-label">手套</label>
                                <br />
                                <input className={`div-3 me-2 form-check-input   ${styles.div3}`} type="radio" id="pants" name="class" value="球褲" onChange={handleClassChange} onClick={() => setClassifType2('球褲')} />
                                <label htmlFor="pants" className="form-check-label">球褲</label>
                                <br />
                                <input className={`div-3 me-2 form-check-input   ${styles.div3}`} type="radio" id="sock" name="class" value="襪子" onChange={handleClassChange} onClick={() => setClassifType2('襪子')} />
                                <label htmlFor="sock" className="form-check-label">襪子</label>
                                <br />
                                <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="sneaker" name="class" value="球鞋" onChange={handleClassChange} onClick={() => setClassifType2('球鞋')} />
                                <label htmlFor="sneaker" className="form-check-label">球鞋</label>
                                <br />
                                <input className={`div-3 me-2  form-check-input  ${styles.div3}`} type="radio" id="equip" name="class" value="裝備" onChange={handleClassChange} onClick={() => setClassifType2('裝備')} />
                                <label htmlFor="equip" className="form-check-label">裝備</label>
                                <br />
                                <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="gear" name="class" value="護具" onChange={handleClassChange} onClick={() => setClassifType2('護具')} />
                                <label htmlFor="gear" className="form-check-label">護具</label>
                                <br />
                                <div className={`div-33  ${styles.div33}`}></div>
                            </div>
                        </div>

                        <div className={`div form-item  ${styles.div}`}>
                            <div className={`div-2 mt-3 ${styles.div2}`} >品牌分類</div>
                            <div className={` form-item  `}>
                                <input className={`div-3 me-2 form-check-input   ${styles.div3}`} type="radio" id="asics" name="brand" value="ASICS" onChange={handleBrandChange} />
                                <label htmlFor="asics" className="form-check-label">ASICS</label>
                                <br />
                                <input className={`div-3 me-2 form-check-input   ${styles.div3}`} type="radio" id="brett" name="brand" value="BRETT" onChange={handleBrandChange} />
                                <label htmlFor="brett" className="form-check-label">BRETT</label>
                                <br />
                                <input className={`div-3 me-2 form-check-input   ${styles.div3}`} type="radio" id="easton" name="brand" value="EASTON" onChange={handleBrandChange} />
                                <label htmlFor="easton" className="form-check-label">EASTON</label>
                                <br />
                                <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="fila" name="brand" value="FILA" onChange={handleBrandChange} />
                                <label htmlFor="fila" className="form-check-label">FILA</label>
                                <br />
                                <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="mizuno" name="brand" value="MIZUNO" onChange={handleBrandChange} />
                                <label htmlFor="mizuno" className="form-check-label">MIZUNO</label>
                                <br />
                                <input className={`div-3 me-2 form-check-input   ${styles.div3}`} type="radio" id="newbalance" name="brand" value="New Balance" onChange={handleBrandChange} />
                                <label htmlFor="newbalance" className="form-check-label">New Balance</label>
                                <br />
                                <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="nike" name="brand" value="Nike" onChange={handleBrandChange} />
                                <label htmlFor="nike" className="form-check-label">Nike</label>
                                <br />
                                <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="oakley" name="brand" value="OAKLEY" onChange={handleBrandChange} />
                                <label htmlFor="oakley" className="form-check-label">OAKLEY</label>
                                <br />
                                <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="underarmour" name="brand" value="UNDER ARMOUR" onChange={handleBrandChange} />
                                <label htmlFor="underarmour" className="form-check-label">UNDER ARMOUR</label>
                                <br />
                                <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="ssk" name="brand" value="SSK" onChange={handleBrandChange} />
                                <label htmlFor="ssk" className="form-check-label">SSK</label>
                                <br />
                                <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="zett" name="brand" value="ZETT" onChange={handleBrandChange} />
                                <label htmlFor="zett" className="form-check-label">ZETT</label>
                                <br />
                                <div className={`div-33  ${styles.div33}`}></div>
                            </div>
                        </div>

                        <div className={`div form-item  ${styles.div}`}>
                            <div className={`div-2 mt-3 ${styles.div2}`}>金額</div>
                            <div className={` form-item  `}>
                                <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="below500" name="price" value="below500" onChange={handlePriceFilterChange} />
                                <label htmlFor="below500" className="form-check-label"> 500 以下</label>
                                <br />
                                <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="500to1000" name="price" value="500to1000" onChange={handlePriceFilterChange} />
                                <label htmlFor="500to1000" className="form-check-label">500~1000</label>
                                <br />
                                <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="1000to2000" name="price" value="1000to2000" onChange={handlePriceFilterChange} />
                                <label htmlFor="1000to2000" className="form-check-label">1000~2000</label>
                                <br />
                                <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="2000to3000" name="price" value="2000to3000" onChange={handlePriceFilterChange} />
                                <label htmlFor="2000to3000" className="form-check-label">2000~3000</label>
                                <br />
                                <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="above3000" name="price" value="above3000" onChange={handlePriceFilterChange} />
                                <label htmlFor="above3000" className="form-check-label">3000 以上</label>
                                <br />
                                <div className={`div-33  ${styles.div33}`}></div>
                            </div>
                        </div>

                        <div className={`div form-item  ${styles.div}`}>
                            <div className={`div-2 mt-3 ${styles.div2}`}>顏色</div>
                            <div className={` form-item  `}>
                                <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="黑" name="color" value="黑" onChange={handleColorChange} />
                                <label htmlFor="black" className="form-check-label">黑</label>
                                <br />
                                <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="白" name="color" value="白" onChange={handleColorChange} />
                                <label htmlFor="white" className="form-check-label">白</label>
                                <br />
                                <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="紅" name="color" value="紅" onChange={handleColorChange} />
                                <label htmlFor="red" className="form-check-label">紅</label>
                                <br />
                                <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="黃" name="color" value="黃" onChange={handleColorChange} />
                                <label htmlFor="yellow" className="form-check-label">黃</label>
                                <br />
                                <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="藍" name="color" value="藍" onChange={handleColorChange} />
                                <label htmlFor="blue" className="form-check-label">藍</label>
                                <br />
                                <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="綠" name="color" value="綠" onChange={handleColorChange} />
                                <label htmlFor="green" className="form-check-label">綠</label>
                                <br />
                                <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="橘" name="color" value="橘" onChange={handleColorChange} />
                                <label htmlFor="orange" className="form-check-label">橘</label>
                                <br />
                                <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="one" name="color" value="單一顏色" onChange={handleColorChange} />
                                <label htmlFor="one" className="form-check-label">單一顏色</label>
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
                            <form onSubmit={handleSubmit} >
                                <div className="input-group mb-3">

                                    <input
                                        type="search"
                                        className="form-control rounded-0"
                                        placeholder="輸入關鍵字搜尋商品"
                                        aria-label="Recipient's username"
                                        aria-describedby="button-addon2"
                                        name="search"
                                        onChange={handleInputChange}
                                    />

                                    <button
                                        className="btn btn-secondary rounded-0"
                                        type="submit"
                                        id="button-addon2"


                                    >
                                        搜尋
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
                                            <div className="accordion-body" onClick={() => handlePantsSelect('短褲')}>
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

                                                    name="brand"
                                                    // defaultValue=""
                                                    value="ASICS"
                                                    id="asics"
                                                    onChange={(event) => {
                                                        handleBrandChange(event);
                                                        handleFilterSelection(event, "brand");
                                                    }}



                                                />
                                                <label htmlFor="asics">ASICS</label>
                                            </div>
                                            <div className={`brand-option ${styles.brandOption}`}>
                                                <input
                                                    className={`brr ${styles.brr}`}
                                                    type="radio"
                                                    id="fila"
                                                    name="brand"
                                                    // defaultValue=""
                                                    value="FILA"
                                                    onChange={(event) => {
                                                        handleBrandChange(event);
                                                        handleFilterSelection(event, "brand");
                                                    }}

                                                />
                                                <label htmlFor="fila">FILA</label>
                                            </div>
                                            <div className={`brand-option ${styles.brandOption}`}>
                                                <input
                                                    className={`brr ${styles.brr}`}
                                                    type="radio"
                                                    id="nike"
                                                    name="brand"
                                                    // defaultValue=""
                                                    value="NIKE"
                                                    onChange={(event) => {
                                                        handleBrandChange(event);
                                                        handleFilterSelection(event, "brand");
                                                    }}

                                                />
                                                <label htmlFor="nike">NIKE</label>
                                                <br />
                                            </div>
                                        </div>
                                        <div className={`brand-options ${styles.brandOptions}`}>
                                            <div className={`brand-option ${styles.brandOption}`}>
                                                <input
                                                    className={`brr ${styles.brr}`}
                                                    type="radio"
                                                    id="brett"
                                                    name="brand"
                                                    // defaultValue=""
                                                    value="BRETT"
                                                    onChange={(event) => {
                                                        handleBrandChange(event);
                                                        handleFilterSelection(event, "brand");
                                                    }}

                                                />
                                                <label htmlFor="brett">BRETT</label>
                                            </div>
                                            <div className={`brand-option ${styles.brandOption}`}>
                                                <input
                                                    className={`brr ${styles.brr}`}
                                                    type="radio"
                                                    id="mizuno"
                                                    name="brand"
                                                    // defaultValue=""
                                                    value="MIZUNO"
                                                    onChange={(event) => {
                                                        handleBrandChange(event);
                                                        handleFilterSelection(event, "brand");
                                                    }}

                                                />

                                                <label htmlFor="mizuno">MIZUNO</label>
                                            </div>
                                            <div className={`brand-option ${styles.brandOption}`}>
                                                <input
                                                    className={`brr ${styles.brr}`}
                                                    type="radio"
                                                    id="zett"
                                                    name="brand"
                                                    // defaultValue=""
                                                    value="ZETT"
                                                    onChange={(event) => {
                                                        handleBrandChange(event);
                                                        handleFilterSelection(event, "brand");
                                                    }}

                                                />
                                                <label htmlFor="zett">ZETT</label>
                                                <br />
                                            </div>
                                        </div>
                                        <div className={`brand-options ${styles.brandOptions}`}>
                                            <div className={`brand-option ${styles.brandOption}`}>
                                                <input
                                                    className={`brr ${styles.brr}`}
                                                    type="radio"
                                                    id="easton"
                                                    name="brand"
                                                    // defaultValue=""
                                                    value="EASTON"
                                                    onChange={(event) => {
                                                        handleBrandChange(event);
                                                        handleFilterSelection(event, "brand");
                                                    }}
                                                />
                                                <label htmlFor="easton">EASTON</label>
                                            </div>
                                            <div className={`brand-option ${styles.brandOption}`}>
                                                <input
                                                    className={`brr ${styles.brr}`}
                                                    type="radio"
                                                    id="oakley"
                                                    name="brand"
                                                    // defaultValue=""
                                                    value="OAKLEY"
                                                    onChange={(event) => {
                                                        handleBrandChange(event);
                                                        handleFilterSelection(event, "brand");
                                                    }}
                                                />
                                                <label htmlFor="oakley">OAKLEY</label>
                                            </div>
                                            <div className={`brand-option ${styles.brandOption}`}>
                                                <input
                                                    className={`brr ${styles.brr}`}
                                                    type="radio"
                                                    id="ssk"
                                                    name="brand"
                                                    // defaultValue=""
                                                    value="SSK"
                                                    onChange={(event) => {
                                                        handleBrandChange(event);
                                                        handleFilterSelection(event, "brand");
                                                    }}
                                                />
                                                <label htmlFor="ssk">SSK</label>
                                                <br />
                                            </div>
                                        </div>
                                        <div className={`brand-options ${styles.brandOptions}`}>
                                            <div className={`brand-option ${styles.brandOption}`}>
                                                <input
                                                    className={`brr ${styles.brr}`}
                                                    type="radio"
                                                    id="newbalance"
                                                    name="brand"
                                                    // defaultValue=""
                                                    value="New Balance"
                                                    onChange={(event) => {
                                                        handleBrandChange(event);
                                                        handleFilterSelection(event, "brand");
                                                    }}

                                                />
                                                <label htmlFor="newbalance">New Balance</label>
                                            </div>
                                            <div className={`brand-option ${styles.brandOption}`}>
                                                <input
                                                    className={`brr ${styles.brr}`}
                                                    type="radio"
                                                    id="underarmours"
                                                    name="brand"
                                                    // defaultValue=""
                                                    value="UNDER ARMOURS"
                                                    onChange={(event) => {
                                                        handleBrandChange(event);
                                                        handleFilterSelection(event, "brand");
                                                    }}

                                                />
                                                <label htmlFor="underarmours">UNDER ARMOUR</label>
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
                                                    onChange={(event) => {
                                                        handleColorChange(event);
                                                        handleFilterSelection(event, "color");
                                                    }}

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
                                                    onChange={(event) => {
                                                        handleColorChange(event);
                                                        handleFilterSelection(event, "color");
                                                    }}
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
                                                    onChange={(event) => {
                                                        handleColorChange(event);
                                                        handleFilterSelection(event, "color");
                                                    }}
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
                                                    onChange={(event) => {
                                                        handleColorChange(event);
                                                        handleFilterSelection(event, "color");
                                                    }}
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
                                                    onChange={(event) => {
                                                        handleColorChange(event);
                                                        handleFilterSelection(event, "color");
                                                    }}
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
                                                    onChange={(event) => {
                                                        handleColorChange(event);
                                                        handleFilterSelection(event, "color");
                                                    }}
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
                                                    onChange={(event) => {
                                                        handleColorChange(event);
                                                        handleFilterSelection(event, "color");
                                                    }}
                                                />
                                                <label htmlFor="橘">橘</label>
                                                <br />
                                            </div>
                                            <div className={`brand-option ${styles.brandOption}`}></div>
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
                                                    value="500以下"

                                                    onChange={(event) => {
                                                        handlePriceFilterChange(event);
                                                        handleFilterSelection(event, "price");
                                                    }}
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
                                                    value="500~1000"

                                                    onChange={(event) => {
                                                        handlePriceFilterChange(event);
                                                        handleFilterSelection(event, "price");
                                                    }}
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
                                                    value="1000~2000"
                                                    onChange={(event) => {
                                                        handlePriceFilterChange(event);
                                                        handleFilterSelection(event, "price");
                                                    }}
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
                                                    value="2000~3000"
                                                    onChange={(event) => {
                                                        handlePriceFilterChange(event);
                                                        handleFilterSelection(event, "price");
                                                    }}
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
                                                    value="3000以上"
                                                    onChange={(event) => {
                                                        handlePriceFilterChange(event);
                                                        handleFilterSelection(event, "price");
                                                    }}
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
                                                <button className={`btn btn1 btn-secondary rounded-0 ${styles.btn1}`} type="submit" onClick={handleClear}>
                                                    清除
                                                </button>
                                                <button className={`btn btn1  btn-secondary rounded-0 ${styles.btn1}`} type="button" aria-label="Close" data-bs-dismiss="modal">
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
                                            <div className={`order ${styles.order}  `} onClick={() => setSortType('最熱門')}>
                                                <input
                                                    className={`ooder1 ${styles.ooder1} `}
                                                    type="radio"
                                                    id=""
                                                    name="brand"
                                                    defaultValue=""
                                                />
                                                <label htmlFor="" >最熱門</label>
                                            </div>
                                            <div className={`order ${styles.order}`} onClick={() => setSortType('最新上架')}>
                                                <input
                                                    className={`ooder1 ${styles.ooder1} `}
                                                    type="radio"
                                                    id=""
                                                    name="brand"
                                                    defaultValue=""
                                                />
                                                <label htmlFor="" >最新上架</label>

                                            </div>
                                            <div className={`order ${styles.order}`} onClick={() => setSortType('價格低到高')}>
                                                <input
                                                    className={`ooder1 ${styles.ooder1} `}
                                                    type="radio"
                                                    id=""
                                                    name="brand"
                                                    defaultValue=""
                                                />
                                                <label htmlFor="" >價格低到高</label>

                                                <br />
                                            </div>
                                            <div className={`order ${styles.order}`} onClick={() => setSortType('價格高到低')}>
                                                <input
                                                    className={`ooder1 ${styles.ooder1} `}
                                                    type="radio"
                                                    id=""
                                                    name="brand"
                                                    defaultValue=""
                                                />
                                                <label htmlFor="" >價格高到低</label>

                                                <br />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className={`col-3 msAutoReset xxx d-flex align-items-center mt-3  ${styles.xxx} ${styles.msAutoReset} `}>

                        <span className={`ppp1 me-1 ms-auto  ${styles.ppp1} ppp1-mobile-align-left`}>共 {productCount}件商品</span>


                        <select className={`form-select  rounded-0  ppx  ${styles.ppx} `} name="order" id="order" >
                            <option >排序</option>
                            <option value={1}>最熱門</option>
                            <option value={2}>最新上架</option>
                            <option value={3}>價格低到高</option>
                            <option value={4}>價格高到低</option>
                        </select>

                    </div>


                    <div className="mt-4"   >

                        {/* { currentProducts.map((product) => (
                                <div key={product.id} className={`box3 mx-3 my-3 ${styles.box3}`}>
                                <Link href={`/product/${product.id}`}>
                                    <figcaption className={`avatar ${styles.avatar}`}>
                                        <img src={`/images/product/${product.image_url}`} alt="" />
                                    </figcaption>
                                    </Link>                                    
                                    <Link href={`/product/${product.id}`}>                                   
                                    <h6 className={`single-ellipsis1 text-black name ${styles.singleEllipsis1} ${styles.name}`}>{product.name}</h6></Link>
                                    四舍五入
                                    <div className={`box4 ${styles.box4}`}>{Math.round(product.price * 0.8)}</div>
                                    <div className={`bbox ${styles.bbox}`}>
                                        <p className={`box5 ${styles.box5}`}>{product.price }</p>
                                        <div className={`iconContainer ${styles.iconContainer}`} style={{ fontSize: '1.2rem', color: 'red' }} >
                                        根据商品的 fav 属性渲染不同的收藏图标
                                        {product.fav
                                        ? <FaHeart onClick={() => handleToggleFav(product.id)} />
                                        : <FaRegHeart onClick={() => handleToggleFav(product.id)} />
                                            }
                                        
                                       
                                        </div>
                                    </div>
                                </div>
                            ))} */}

                        {/* 如果搜尋為空則加上篩選金額 不為空也加上分頁 */}
                        {searchQuery === ''
                            ? filteredProducts.map((product) => (
                                <div key={product.id} className={`box3 mx-3 my-3 ${styles.box3} ${styles.box15}`}>
                                    <Link href={`/product/${product.id}`}>
                                        <figcaption className={`avatar ${styles.avatar}`}>
                                            <img src={`/images/product/${product.image_url}`} alt="" />
                                        </figcaption>
                                    </Link>
                                    <Link href={`/product/${product.id}`}>
                                        <h6 className={`single-ellipsis1 text-black name ${styles.singleEllipsis1} ${styles.name}`}>{product.name}</h6>
                                    </Link>
                                    <div className={`box4 ${styles.box4}`}>{Math.round(product.price * 0.8)}</div>
                                    <div className={`bbox ${styles.bbox}`}>
                                        <p className={`box5 ${styles.box5}`}>{product.price}</p>
                                        <div onClick={() => handleToggleFav(product.id)} className={`iconContainer ${styles.iconContainer}`} style={{ fontSize: '1.2rem', color: 'red' }}>
                                            {/* 根据商品的fav属性渲染不同的收藏图标 */}
                                            {product.fav
                                                ? <FaHeart />
                                                : <FaRegHeart />}
                                        </div>
                                    </div>
                                </div>
                            ))
                            : currentProducts.map((product) => (
                                <div key={product.id} className={`box3 mx-3 my-3 ${styles.box3}`}>
                                    <Link href={`/product/${product.id}`}>
                                        <figcaption className={`avatar ${styles.avatar}`}>
                                            <img src={`/images/product/${product.image_url}`} alt="" />
                                        </figcaption>
                                    </Link>
                                    <Link href={`/product/${product.id}`}>
                                        <h6 className={`single-ellipsis1 text-black name ${styles.singleEllipsis1} ${styles.name}`}>{product.name}</h6>
                                    </Link>
                                    <div className={`box4 ${styles.box4}`}>{Math.round(product.price * 0.8)}</div>
                                    <div className={`bbox ${styles.bbox}`}>
                                        <p className={`box5 ${styles.box5}`}>{product.price}</p>
                                        <div onClick={() => handleToggleFav(product.id)} className={`iconContainer ${styles.iconContainer}`} style={{ fontSize: '1.2rem', color: 'red' }}>
                                            {/* 根据商品的fav属性渲染不同的收藏图标 */}
                                            {product.fav
                                                ? <FaHeart />
                                                : <FaRegHeart />}
                                        </div>
                                    </div>
                                </div>
                            ))}

                    </div>









                    <div className={`clear  ${styles.clear}`}></div>

                    <div className="d-flex justify-content-center my-5">
                        {windowWidth >= 768 ? (
                            <nav aria-label="Page navigation example">
                                <ul className="pagination">
                                    <li className="page-item ms-2">
                                        <a className="page-link text-black" href="#" aria-label="Previous" onClick={handlePrevPage}>
                                            <span aria-hidden="true"><BiSolidLeftArrow /></span>
                                        </a>
                                    </li>
                                    {Array.from({ length: totalPages }, (_, index) => (
                                        <li key={index} className={`page-item ms-2 ${currentPage === index + 1 ? 'active' : ''}`}>
                                            <a className="page-link text-black" href="#" onClick={() => handlePageClick(index + 1)}>{index + 1}</a>
                                        </li>
                                    ))}
                                    <li className="page-item ms-2">
                                        <a className="page-link text-black" href="#" aria-label="Next" onClick={handleNextPage}>
                                            <span aria-hidden="true"><BiSolidRightArrow /></span>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        ) : (
                            // 显示所有商品列表的代码
                            <div className="product-list">
                                {filteredProducts.map((product) => (
                                    <div key={product.id} className={`box3 mx-3 my-3 ${styles.box3}`}>
                                        <Link href={`/product/${product.id}`}>
                                            <figcaption className={`avatar ${styles.avatar}`}>
                                                <img src={`/images/product/${product.image_url}`} alt="" />
                                            </figcaption>
                                        </Link>
                                        <Link href={`/product/${product.id}`}>
                                            <h6 className={`single-ellipsis1 text-black name ${styles.singleEllipsis1} ${styles.name}`}>{product.name}</h6></Link>

                                        <div className={`box4 ${styles.box4}`}>{Math.round(product.price * 0.8)}</div>
                                        <div className={`bbox ${styles.bbox}`}>
                                            <p className={`box5 ${styles.box5}`}>{product.price}</p>
                                            <div onClick={() => handleToggleFav(product.id)} className={`iconContainer ${styles.iconContainer}`} style={{ fontSize: '1.2rem', color: 'red' }} >

                                                {product.fav
                                                    ? <FaHeart />
                                                    : <FaRegHeart />
                                                }


                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
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






