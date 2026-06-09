import axios from "axios";
import { createContext, useEffect, useState } from "react";
export const cartAuthContext = createContext();

export default function CartAuthProvider({ children }) {

  const [numOfWishListItems, setNumOfWishListItems] = useState(0);
  const [wishListItems, setWishListItems] = useState(0);
  const [numOfCartItems, setNumOfCartItems] = useState(0);
  const [totalCartPrice, setTotalCartPrice] = useState(0);
  // cart id is for "cruds" products
  const [cartId, setCartId] = useState(null);
  // cart owner is for all orders
  const [cartOwner, setCartOwner] = useState(null);
  const [products, setProducts] = useState(null);
  const [productWishIds, setProductWishIds] = useState([]);
  const productWishIdsArray = [];

  useEffect(() => {
    if (localStorage.getItem('token') != null) {
      getProductDetails();
      getLoggedUserWishlist()
      if (products == null) {
        setProducts([])
      }
    }
  }, []);

  function setNewData(res) {
    let result = res?.data;
    setProducts(result.data.products);
    setNumOfCartItems(result.numOfCartItems);
    setTotalCartPrice(result.data.totalCartPrice);
    setCartId(result.data._id);
    setCartOwner(result.data.cartOwner)
    sessionStorage.setItem('ordersId', result.data.cartOwner)
  }
  async function getProductDetails() {
    await axios
      .get(`https://ecommerce.routemisr.com/api/v1/cart`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        // console.log("getproductdetails okay...", res,);

        setNewData(res);
      })
      .catch((err) => {
        // console.log("getProductDetailsError", err);
      });
  }

  async function addToCart(productId) {
    // console.log("addToCartproductId",productId);
    const result = await axios.post(`https://ecommerce.routemisr.com/api/v1/cart`,
      {
        "productId": productId
      }
      , {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        // console.log("new Data",res);
        getProductDetails()
        return true
      })
      .catch((err) => {
        // console.log("addToCartError", err);
        return false
      });
    return result
  }

  async function updateCartProductQuantity(productId, newCount) {
    const result = await axios.put(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
      count: newCount
    }, {
      headers: {
        token: localStorage.getItem("token")
      }
    }).then((res) => {
      // console.log("updated Data",res);
      setNewData(res);
      return true
    }).catch((err) => {
      // console.log("Updated error...",err);
      return false
    })
    return result
  }


  async function deleteCartProduct(productId) {
    const result = await axios.delete(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
      headers: {
        token: localStorage.getItem("token")
      }
    }).then((res) => {
      console.log("new After Deleting Data", res);
      setNewData(res);
      return true
    }).catch((err) => {
      console.log("new After Deleting error...", err);
      return false
    })
    return result
  }
  async function deleteAllCartProduct() {
    const result = await axios.delete(`https://ecommerce.routemisr.com/api/v1/cart`, {
      headers: {
        token: localStorage.getItem("token")
      }
    }).then((res) => {
      // console.log("new After all Deleting Data",res);
      // getProductDetails()
      setProducts([]);
      setNumOfCartItems(0);
      setTotalCartPrice(0);
      setCartId(null);
      return true
    }).catch((err) => {
      // console.log("new After all Deleting error...",err);
      return false
    })
    return result
  }
  async function getLoggedUserWishlist() {
    await axios.get(`https://ecommerce.routemisr.com/api/v1/wishlist`, {
      headers: {
        token: localStorage.getItem("token")
      }
    })
      .then((res) => {
        // console.log("data when click on wishlist", res.data.data);
        setWishListItems(res.data.data)
        setNumOfWishListItems(res.data.data.length)
        // const newWishIds = res.data.data.map(item => item.id);
        setProductWishIds([])
        for (let i = 0; i < res.data.data.length; i++) {
          productWishIdsArray.push(res.data.data[i].id);
          setProductWishIds(productWishIdsArray)
        }
        // return true
      }).catch((err) => {
        // console.log("error after click wishlist",err);
        // return false
      })
  }

  function addToWishlist(productId) {
    return axios.post(
      `https://ecommerce.routemisr.com/api/v1/wishlist`,
      {
        productId,
      },
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    ).then((res) => {
      getLoggedUserWishlist()
      // console.log("res wish",res);
    }).catch((err) => {
      // console.log("res err wish",err);

    })
  }

  function deleteProduct(productId) {
    return axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
      headers: {
        token: localStorage.getItem('token')
      }
    })
      .then(() => {
        getLoggedUserWishlist()
      })
  }

  async function getAllOrders() {
    const result = await axios.get(`https://ecommerce.routemisr.com/api/v1/orders`)
      .then((res) => {
        // console.log("all data & pay",res);
        return true
      }).catch((err) => {
        // console.log("error & pay",err);
        return false
      })
    return result
  }

  return (
    <cartAuthContext.Provider
      value={{
        products,
        numOfCartItems,
        totalCartPrice,
        numOfWishListItems,
        cartId,
        addToCart,
        getProductDetails,
        deleteCartProduct,
        deleteAllCartProduct,
        addToWishlist,
        getLoggedUserWishlist,
        updateCartProductQuantity,
        deleteProduct,
        getAllOrders,
        setProducts,
        setNumOfCartItems,
        setTotalCartPrice,
        setCartId,
        wishListItems,
        productWishIds,
        cartOwner,
      }}
    >
      {children}
    </cartAuthContext.Provider>
  );
}
