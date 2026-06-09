import axios from "axios";
import { useFormik } from "formik";
import { useContext } from "react";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { object, string } from "yup";
import { cartAuthContext } from "../../Context/CartAuthProvider/CartAuthProvider";

export default function CheckOut() {

  const navigate = useNavigate();

  const {
    cartId,
    setProducts,
    setNumOfCartItems,
    setTotalCartPrice,
    setCartId,
  } = useContext(cartAuthContext);

  async function createCashOrder(details, phone, city) {
    const chippingAddress = {
      "shippingAddress": {
        details,
        phone,
        city,
      },
    };

    const result = await axios
      .post(
        `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
        chippingAddress,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        // console.log("Cash Data before pay", res);
        toast.success("Order Completed, Waiting For Chipping .....");
        setProducts([]);
        setNumOfCartItems(0);
        setTotalCartPrice(0);
        setCartId(null);
        setTimeout(() => {
          navigate("/allorders");
        }, 2000);
        return true;
      })
      .catch((err) => {
        // console.log("error Cash Data before pay", err);
        toast.error("Order Not Completed...");
        return false;
      });
    return result;
  }

  let initialValues = {
    phone: "",
    city: "",
    details: "",
    isSecondButton: false,
  };

  let userSchema = object({
    details: string().required("You Must Enter Valid Address ").min(5),
    phone: string()
      .required('You Must Enter A Valid Egyptin Num Starts With "01"')
      .matches(
        /^2?(\+2)?01[0125][0-9]{8}$/,
        'You Must Enter A Valid Egyptin Num Starts With "01"'
      ),
    city: string().required("You Must Enter Valid city ").min(4),
  });

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      if (values.isSecondButton) {
        createCashOrder(values.details, values.phone, values.city);
      } else {
        confirmOnlinePayment(values.details, values.phone, values.city);
      }
    },
    validationSchema: userSchema,
  });

  async function confirmOnlinePayment(details, phone, city) {
    const chippingAddress = {
      "shippingAddress": {
        details,
        phone,
        city,
      },
    };
    const result = await axios
      .post(
        `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}`,
        { chippingAddress },
        {
          params: {
            // url: process.env.REACT_APP_BASE_URL || window.location.origin
            url: `https://fresh-cart-olive.vercel.app/`
          },
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        // console.log("Online Data before pay", res);
        toast.success("going Onling Payment ...");
        setCartId(null);
        setTimeout(() => {
          window.open(res.data.session.url, "_self");
        }, 2000);
        return true;
      })
      .catch((err) => {
        toast.error("something went error....");
        // console.log("error Online Data before pay", err);
        return false;
      });
    return result;
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Check Out</title>
        {/* <link rel="canonical" href="http://mysite.com/example" /> */}
      </Helmet>
      <div className="container py-5">
        <form onSubmit={formik.handleSubmit} className="pay">
          <label className="fw-bold" htmlFor="phone">
            phone
          </label>
          <input
            value={formik.values.phone}
            onInput={formik.handleBlur}
            onChange={formik.handleChange}
            className="form-control my-2"
            type="text"
            name="phone"
            id="phone"
            placeholder="write your Phone"
          />
          {formik.errors.phone && formik.touched.phone ? (
            <div className="alert alert-danger w-100">
              {formik.errors.phone}
            </div>
          ) : (
            ""
          )}

          <label className="fw-bold" htmlFor="city">
            City
          </label>
          <input
            value={formik.values.city}
            onInput={formik.handleBlur}
            onChange={formik.handleChange}
            className="form-control my-2"
            type="text"
            name="city"
            id="city"
            placeholder="write your city"
          />
          {formik.errors.city && formik.touched.city ? (
            <div className="alert alert-danger w-100">{formik.errors.city}</div>
          ) : (
            ""
          )}

          <label className="fw-bold" htmlFor="details">
            details
          </label>
          <textarea
            value={formik.values.details}
            onInput={formik.handleBlur}
            onChange={formik.handleChange}
            className="form-control my-2"
            type="text"
            name="details"
            id="details"
            placeholder="write your details"
          ></textarea>
          {formik.errors.details && formik.touched.details ? (
            <div className="alert alert-danger w-100">
              {formik.errors.details}
            </div>
          ) : (
            ""
          )}

          <button
            onClick={() => { formik.values.isSecondButton = false; }}
            className="btn w-100 my-3 btn-outline-danger" type="submit">
            Complete Cash Payment
          </button>
          <button
            type="submit"
            onClick={() => {
              formik.values.isSecondButton = true;
              confirmOnlinePayment(formik.values.details, formik.values.phone, formik.values.city)
            }}
            className="btn w-100 my-3 btn-outline-primary online"
          >
            Complete Online Payment
          </button>
        </form>
      </div>
    </>
  );
}
