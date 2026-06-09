// import RegisterCss from "./Register.module.css";
import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { object, ref, string } from "yup";
export default function Register() {

  const [isSuccess, setIsSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const navigate = useNavigate()

  async function sendUserDate(userData) {
    try {
      // const response = await axios.post(
      await axios.post(
        `https://ecommerce.routemisr.com/api/v1/auth/signup`,
        userData
      );
      // console.log("in case of success ", response?.data);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        navigate('/');
      }, 2000);
      setIsLoading(false);
    } catch (error) {
      // console.log("in case of errors ", error?.response.data.message);
      setErrorMessage(error?.response.data.message);
      setTimeout(() => {
        setErrorMessage(false);
      }, 2000);
      setIsLoading(false);
    }
  }

  let initialValues = {
    name: "",
    email: "",
    phone: "",
    password: "",
    rePassword: "",
  };

  async function Submit(values) {
    // data are valid to sent to backend
    setIsLoading(true);
    // console.log("submited ....", values);
    sendUserDate(values);
  }

  let userSchema = object({
    name: string()
      .required("You Must Enter Valid Name Within 5 to 20 Char")
      .min(5, "name Must Be More Than 5 Char")
      .max(20, "Name Must Be Less Than 20 Char"),
    email: string().required(
      "You Must Enter Valid Email ; Example : example@abc.abc"
    ),
    phone: string()
      .required('You Must Enter A Valid Egyptin Num Starts With "01"')
      .matches(
        /^2?(\+2)?01[0125][0-9]{8}$/,
        'You Must Enter A Valid Egyptin Num Starts With "01"'
      ),
    password: string()
      .required("You Must Enter The Correct Password That is More Than 6 Char")
      .matches(/^[A-Za-z0-9]{6,20}$/, { message: "Enter Correct Password" }),
    rePassword: string()
      .required()
      .oneOf([ref("password"), null], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: Submit,
    validationSchema: userSchema,
  });
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Register</title>
        {/* <link rel="canonical" href="http://mysite.com/example" /> */}
      </Helmet>
      <div className="w-75 m-auto py-5">
        <h2>Register Now : </h2>
        {isSuccess ? (
          <div className="alert alert-success text-center fw-bold h4">
            Concratulation You Have Registered Successfully
          </div>
        ) : (
          ""
        )}
        {errorMessage ? (
          <div className="alert alert-danger text-center fw-bold h4">
            {errorMessage}
          </div>
        ) : (
          ""
        )}

        <form onSubmit={formik.handleSubmit} className="d-flex flex-column">
          <label htmlFor="name">name :</label>
          <input
            className="my-2 form-control"
            value={formik.values.name}
            onInput={formik.handleBlur}
            onChange={formik.handleChange}
            id="name"
            type="text"
            placeholder="Enter Your Name ..."
          />
          {formik.errors.name && formik.touched.name ? (
            <div className="alert alert-danger w-100">{formik.errors.name}</div>
          ) : (
            ""
          )}

          <label htmlFor="email">email :</label>
          <input
            className="my-2 form-control "
            value={formik.values.email}
            onInput={formik.handleBlur}
            onChange={formik.handleChange}
            id="email"
            type="email"
            placeholder="Enter Your Email ..."
          />
          {formik.errors.email && formik.touched.email ? (
            <div className="alert alert-danger w-100">
              {formik.errors.email}
            </div>
          ) : (
            ""
          )}

          <label htmlFor="phone">phone :</label>
          <input
            className="my-2 form-control "
            value={formik.values.phone}
            onInput={formik.handleBlur}
            onChange={formik.handleChange}
            id="phone"
            type="tel"
            placeholder="Enter Your phone ..."
          />
          {formik.errors.phone && formik.touched.phone ? (
            <div className="alert alert-danger w-100">
              {formik.errors.phone}
            </div>
          ) : (
            ""
          )}

          <label htmlFor="password">password :</label>
          <div className="position-relative w-100 h-25">
            <input
              className="my-2 form-control passwordInput"
              value={formik.values.password}
              onInput={formik.handleBlur}
              onChange={formik.handleChange}
              id="password"
              type="password"
              placeholder="Enter Your Password ..."
            />
          </div>
          {formik.errors.password && formik.touched.password ? (
            <div className="alert alert-danger w-100">
              {formik.errors.password}
            </div>
          ) : (
            ""
          )}

          <label htmlFor="rePassword">rePassword :</label>
          <div className="position-relative w-100 h-25">
            <input
              className="my-2 form-control rePasswordInput"
              value={formik.values.rePassword}
              onInput={formik.handleBlur}
              onChange={formik.handleChange}
              id="rePassword"
              type="password"
              placeholder="Enter Your password ..."
            />
          </div>
          {formik.errors.rePassword && formik.touched.rePassword ? (
            <div className="alert alert-danger w-100">
              {formik.errors.rePassword}
            </div>
          ) : (
            ""
          )}

          <button style={{ width: "150px" }} className="btn btn-success" type="submit">
            {isLoading ? (
              <RotatingLines
                visible={true}
                height="50"
                width="50"
                strokeColor="white"
                color="grey"
                strokeWidth="3"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
                wrapperStyle={{}}
                wrapperClass=""

              />
            ) : (
              "Register"
            )}
          </button>

        </form>
      </div>
    </>
  );
}
