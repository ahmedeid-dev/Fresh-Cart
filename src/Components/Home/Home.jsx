import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { cartAuthContext } from "../../Context/CartAuthProvider/CartAuthProvider";
import Loader from "../Loader/Loader";
import HomeCss from "./Home.module.css";
export default function Home() {
  const { addToCart, addToWishlist, deleteProduct, productWishIds } =
    useContext(cartAuthContext);

  function addToWish(id) {
    toast.promise(addToWishlist(id), {
      loading: 'Loading',
      success: 'Product added to WishList successfully',
      error: 'Error in add Product try again ',
    });
  }

  function deleteFromWish(id) {
    toast.promise(deleteProduct(id), {
      loading: 'Loading',
      success: 'Product Deleted From WishList successfully',
      error: 'Error in Delete Product try again ',
    });
  }

  async function addMyProduct(productId) {
    const result = await addToCart(productId);
    if (result) {
      toast.success("Product Added Successfully", { position: "top-center" });
    } else {
      toast.error("SomeThing Went Wrong.....", { position: "top-center" });
    }
  }

  // cache Data
  const categoryQuery = useQuery("getAllCategories", getAllCategories, {
    cacheTime: 60000,
  });
  // cache Data
  const { data, isError, isLoading, error } = useQuery(
    `getproduct`,
    getAllProduct,
    { cacheTime: 60000 }
  );

  const product = data?.data.data;

  const [searchValue, setSearchValue] = useState("")
  const [productList, setProductList] = useState("")
  // const displayProducts = productList || product;

  useEffect(() => {
    setProductList(product?.filter(elem => elem.title.toLowerCase().includes(searchValue.toLowerCase())))
  }, [searchValue, product])

  // loading spinner
  if (isLoading || categoryQuery.isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <>
        <div className="d-flex justify-content-center align-content-center fw-bolder">
          <h3 className="h1">{error}</h3>
        </div>
      </>
    );
  }
  if (categoryQuery.isError) {
    return (
      <>
        <div className="d-flex justify-content-center align-content-center fw-bolder">
          <h3 className="h1">{categoryQuery.error}</h3>
        </div>
      </>
    );
  }
  async function getAllProduct() {
    return await axios.get(`https://ecommerce.routemisr.com/api/v1/products`);
  }
  var homeSettings = {
    infinite: true,
    speed: 2000,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const categorySettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    pauseOnFocus: false,
    pauseOnDotsHover: false,
    autoplaySpeed: 2000,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // loading spinner
  if (categoryQuery.isLoading) {
    return <Loader />;
  }
  if (categoryQuery.isError) {
    return (
      <>
        <div className="d-flex justify-content-center align-content-center fw-bolder">
          <h3 className="h1">{categoryQuery.error}</h3>
        </div>
      </>
    );
  }
  const category = categoryQuery?.data?.data.data;
  // console.log(category);
  async function getAllCategories() {
    return await axios.get(`https://ecommerce.routemisr.com/api/v1/categories`);
  }

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className="container py-5">

        <div className="row">
          <div className="col-lg-9 col-md-6">
            <div className="slider">
              <Slider {...homeSettings}>
                {product.map((pro, idx) =>
                  pro.images.map((img, index) => (
                    // <div style={{backgroundImage:`url("${img}")`}} className={HomeCss.img}    key={index}>
                    <Link to={`/productDetails/${pro.id}`}>
                      <div className={HomeCss.img} key={index}>
                        <img
                          className="w-100 h-100"
                          src={img}
                          alt={pro.title}
                        />
                      </div>
                    </Link>
                  ))
                )}
              </Slider>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className={`${HomeCss.imgs} d-flex flex-column`}>
              <img
                className="h-50 w-100"
                src={require("../../Assets/Images/slider-image-1.jpeg")}
                alt="slider1"
              />
              <img
                className="h-50 w-100"
                src={require("../../Assets/Images/slider-image-2.jpeg")}
                alt="slider2"
              />
            </div>
          </div>
        </div>
        <div className="slider-container my-5">
          <Slider {...categorySettings}>
            {category.map((category, index) => (
              <div key={index} className="col-xl-3 col-lg-4 col-md-6">
                <div className="category position-relative border border-3">
                  <Link to={`/subcategories/${category._id}`}>
                    <img
                      className="w-100 "
                      style={{ height: "200px" }}
                      src={category.image}
                      alt={category.name}
                    />
                    <h3 className="text-success fw-bold py-3 text-center">
                      {category.name}
                    </h3>
                  </Link>
                </div>
              </div>
            ))}
          </Slider>
        </div>
        <input type="text" className="form-control my-5 w-75 m-auto" placeholder="search ..."
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div className="row g-4">
          {/* {product?.map((product, index) => ( */}
          {productList ? productList.map((product, index) => (
            <div key={index} className="col-xl-3 col-lg-4 col-md-6">
              <div className="product position-relative">
                <Link to={`/productDetails/${product.id}`}>
                  <img
                    className="w-100"
                    src={product.imageCover}
                    alt={product.title}
                  />
                  {product.priceAfterDiscount ? (
                    <div className="sale">Sale</div>
                  ) : (
                    ""
                  )}
                  <h3 className="h6 text-success fw-bold">
                    {product.category.name}
                  </h3>
                  <h2 className="h5 fw-bold text-center">
                    {product.title.split(" ").splice(0, 2).join(" ")}
                  </h2>
                  <div className="d-flex justify-content-between">
                    {product.priceAfterDiscount ? (
                      <p>
                        <span className="text-decoration-line-through">
                          {product.price}
                        </span>
                        /{product.priceAfterDiscount} Egp
                      </p>
                    ) : (
                      <p>{product.price} Egp</p>
                    )}
                    <p>
                      <span className="text-warning">
                        <i className="fa-solid fa-star"></i>
                      </span>
                      {product.ratingsAverage}
                    </p>
                  </div>
                </Link>
                <div className="d-flex justify-content-between fa-2x">
                  <button
                    onClick={function () {
                      addMyProduct(product.id);
                    }}
                    className="btn btn-success"
                  >
                    Add To Cart
                  </button>

                  {productWishIds.includes(product.id) ?
                    <button className="rounded-2  bg-success text-danger fs-5 " onClick={() => deleteFromWish(product.id)}><i className="fa-solid fa-heart"></i></button>
                    : <button className=" rounded-2 bg-success  fs-5" onClick={() => addToWish(product.id)} ><i className="fa-solid fa-heart"></i></button>}
                </div>
              </div>
            </div>
          ))
            :
            <>
              {product?.map((product, index) => (
                <div key={index} className="col-xl-3 col-lg-4 col-md-6">
                  <div className="product position-relative">
                    <Link to={`/productDetails/${product.id}`}>
                      <img
                        className="w-100"
                        src={product.imageCover}
                        alt={product.title}
                      />
                      {product.priceAfterDiscount ? (
                        <div className="sale">Sale</div>
                      ) : (
                        ""
                      )}
                      <h3 className="h6 text-success fw-bold">
                        {product.category.name}
                      </h3>
                      <h2 className="h5 fw-bold text-center">
                        {product.title.split(" ").splice(0, 2).join(" ")}
                      </h2>
                      <div className="d-flex justify-content-between">
                        {product.priceAfterDiscount ? (
                          <p>
                            <span className="text-decoration-line-through">
                              {product.price}
                            </span>
                            /{product.priceAfterDiscount} Egp
                          </p>
                        ) : (
                          <p>{product.price} Egp</p>
                        )}
                        <p>
                          <span className="text-warning">
                            <i className="fa-solid fa-star"></i>
                          </span>
                          {product.ratingsAverage}
                        </p>
                      </div>
                    </Link>
                    <div className="d-flex justify-content-between fa-2x">
                      <button
                        onClick={function () {
                          addMyProduct(product.id);
                        }}
                        className="btn btn-success"
                      >
                        Add To Cart
                      </button>

                      {productWishIds.includes(product.id) ?
                        <button className="rounded-2  bg-success text-danger fs-5 " onClick={() => deleteFromWish(product.id)}><i className="fa-solid fa-heart"></i></button>
                        : <button className=" rounded-2 bg-success  fs-5" onClick={() => addToWish(product.id)} ><i className="fa-solid fa-heart"></i></button>}
                    </div>
                  </div>
                </div>
              ))}
            </>
          }
        </div>
      </div>
    </>
  );
}
