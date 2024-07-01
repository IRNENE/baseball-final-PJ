import React, { useState, useEffect } from 'react'
// import '@/node_modules/bootstrap/dist/css/bootstrap.min.css'
import styles from './product.module.css'
import Link from 'next/link'



export default function Product() {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({ inputValue: '' });
    const [productCount, setProductCount] = useState(0)
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        // 要document物件出現後才能導入 bootstrap的js函式庫
        import('@/node_modules/bootstrap/dist/js/bootstrap')
    }, [])

    useEffect(() => {
     // 獲取商品數據
     const fetchProducts = async () => {
     let url = 'http://localhost:3005/api/product';
     if (formData.inputValue) {
         const encodedKeyword = encodeURIComponent(formData.inputValue);
         url = `http://localhost:3005/api/product/search/${encodedKeyword}`;
     }
     try {
        const response = await fetch(url);
        const data = await response.json();

        setProducts(data);
        setProductCount(data.length); // 获取商品列表的长度并更新productCount
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
}, [formData]);

const handleSearch = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`http://localhost:3005/api/product/search/${searchQuery}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSearchResults(data);
    } catch (error) {
        console.error('Error searching for products:', error);
        setSearchResults([]);
    }
};




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
                            <a href="/" className={`tete ${styles.tete}`}>所有商品</a> /
                            <a href="/category" className={`tete ${styles.tete}`}>分類</a> /
                            <a href="/category/subcategory" className={`tete ${styles.tete}`}>棒球手套</a>
                            <span />


                        </div>


                        <form action="">
                            <div className={`div form-item  ${styles.div}`}>
                                <div className={`div-2  ${styles.div2}`}>商品分類</div>
                                <div className={` form-item   `}>
                                    <input className={`div-3 me-2 form-check-input   ${styles.div3}`} type="radio" id="" name="class" value="球棒" />
                                    <label htmlFor="" className="form-check-label" >球棒</label>
                                    <br />
                                    <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="" name="class" value="球" />
                                    <label htmlFor="" className="form-check-label">球</label>
                                    <br />
                                    <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="" name="class" value="帽子" />
                                    <label htmlFor="" className="form-check-label">帽子</label>
                                    <br />
                                    <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="" name="class" value="球衣" />
                                    <label htmlFor="" className="form-check-label">球衣</label>
                                    <br />
                                    <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="" name="class" value="手套" />
                                    <label htmlFor="" className="form-check-label">手套</label>
                                    <br />
                                    <input className={`div-3 me-2 form-check-input   ${styles.div3}`} type="radio" id="" name="class" value="球褲" />
                                    <label htmlFor="" className="form-check-label">球褲</label>
                                    <br />
                                    <input className={`div-3 me-2 form-check-input   ${styles.div3}`} type="radio" id="" name="class" value="襪子" />
                                    <label htmlFor="" className="form-check-label">襪子</label>
                                    <br />
                                    <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="" name="class" value="球鞋" />
                                    <label htmlFor="" className="form-check-label">球鞋</label>
                                    <br />
                                    <input className={`div-3 me-2  form-check-input  ${styles.div3}`} type="radio" id="" name="class" value="裝備" />
                                    <label htmlFor="" className="form-check-label">裝備</label>
                                    <br />
                                    <input className={`div-3 me-2 form-check-input  ${styles.div3}`} type="radio" id="" name="class" value="護具" />
                                    <label htmlFor="" className="form-check-label">護具</label>
                                    <br />
                                    <div className={`div-33  ${styles.div33}`}></div>
                                </div>
                            </div>

                            

                        </form>



                    </div>

                    <div className="col-12 col-sm-10 mt-5">

                        <div className={`box1  ${styles.box1}`}>
                            <div>
                                <h4>棒球手套</h4>
                            </div>
                            <div className="col-4 ">
                                <form onSubmit={handleSubmit}>
                                    <div className="input-group mb-3">

                                        <input
                                            type="search"
                                            className="form-control rounded-0"
                                            placeholder="輸入關鍵字搜尋商品"
                                            aria-label="Recipient's username"
                                            aria-describedby="button-addon2"
                                            name="search"
                                            onChange={(e) => setSearchQuery(e.target.value)}
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

                        


                        <div className={`col-3 msAutoReset xxx d-flex align-items-center mt-3  ${styles.xxx} ${styles.msAutoReset} `}>

                            <span className={`ppp1 me-2 ms-auto  ${styles.ppp1} ppp1-mobile-align-left`}>共 {productCount}件商品</span>


                            <select className={`form-select  rounded-0  ppx  ${styles.ppx} `} name="order" id="order">
                                <option >排序</option>
                                <option value={1}>最熱門</option>
                                <option value={2}>最新上架</option>
                                <option value={3}>價格低到高</option>
                                <option value={4}>價格高到低</option>
                            </select>

                        </div>


                        <div className="mt-4"   >
                            {currentProducts.map((product) => (
                                <div key={product.id} className={`box3 mx-3 my-3 ${styles.box3}`}>
                                <Link href={`/product/${product.id}`}>
                                    <figcaption className={`avatar ${styles.avatar}`}>
                                        <img src={`/images/product/${product.image_url}`} alt="" />
                                    </figcaption>
                                    </Link>                                    
                                    <Link href={`/product/product${product.id}`}>                                   
                                    <h6 className={`single-ellipsis1 text-black name ${styles.singleEllipsis1} ${styles.name}`}>{product.name}</h6></Link>
                                    {/* 四舍五入 */}
                                    <div className={`box4 ${styles.box4}`}>{Math.round(product.price * 0.8)}</div>
                                    <div className={`bbox ${styles.bbox}`}>
                                        <p className={`box5 ${styles.box5}`}>{product.price }</p>
                                        <div className={`iconContainer ${styles.iconContainer}`} style={{ fontSize: '1.2rem', color: 'red' }} >
                                        {/* 根据商品的 fav 属性渲染不同的收藏图标 */}
                                        {product.fav
                                        ? <FaHeart onClick={() => handleToggleFav(product.id)} />
                                        : <FaRegHeart onClick={() => handleToggleFav(product.id)} />
                                            }
                                        
                                       
                                        </div>
                                    </div>
                                </div>
                            ))}


                            
                            
                        </div>
                       
                        
                        
                        
                        




                        


                    </div>




                </div>



            </div>







        </>

    );
}