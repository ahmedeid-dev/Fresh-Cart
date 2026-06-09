import { Toaster } from 'react-hot-toast';
import { QueryClientProvider } from 'react-query';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient } from './../node_modules/react-query/es/core/queryClient';
import './App.css';
import AllOrders from './Components/AllOrders/AllOrders';
import ForgetPassword from './Components/Authentication/ForgetPassword';
import ResetPassword from './Components/Authentication/ResetPassword';
import VerifyResetCode from './Components/Authentication/VerifyResetCode';
import Brands from './Components/Brands/Brands';
import Cart from './Components/Cart/Cart';
import Categories from './Components/Categories/Categories';
import Subcategories from './Components/Categories/Subcategories';
import CheckOut from './Components/CheckOut/CheckOut';
import Home from './Components/Home/Home';
import Layout from './Components/Layout/Layout';
import Login from './Components/Login/Login';
import LoginProtection from './Components/LoginProtection/LoginProtection';
import NotFound from './Components/NotFound/NotFound';
import ProductDetails from './Components/ProductDetails/ProductDetails';
import Products from './Components/Products/Products';
import Profile from './Components/Profile/Profile';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import Register from './Components/Register/Register';
import SpecificSubCategories from './Components/SpecificSubCategory/SpecificSubGategory';
import SubBrand from './Components/SubBrand/SubBrand';
import WishList from './Components/WishList/WishList';
import CartAuthProvider from './Context/CartAuthProvider/CartAuthProvider';
import LoggedAuthProvider from './Context/LoggedAuthProvider/LoggedAuthProvider';

const router = createBrowserRouter([
  {
    path: '/', element: <Layout />, children: [

      { index: true, element: <LoginProtection><Login /></LoginProtection> }, // route          done
      // { path:'' , element:<LoginProtection><Login/></LoginProtection> }, // route             done 
      { path: 'home', element: <ProtectedRoute><Home /></ProtectedRoute> }, // route             not yet
      { path: 'profile', element: <ProtectedRoute><Profile /></ProtectedRoute> }, // route             not yet
      { path: 'allorders', element: <ProtectedRoute><AllOrders /></ProtectedRoute> }, // route             not yet
      { path: 'register', element: <LoginProtection><Register /></LoginProtection> }, // route           done
      { path: 'forget', element: <LoginProtection><ForgetPassword /></LoginProtection> }, // route           done
      { path: 'verify', element: <LoginProtection><VerifyResetCode /></LoginProtection> }, // route           done
      { path: 'reset', element: <LoginProtection><ResetPassword /></LoginProtection> }, // route           done
      { path: 'cart', element: <ProtectedRoute><Cart /></ProtectedRoute> }, // route             not yet
      { path: 'checkOut', element: <ProtectedRoute><CheckOut /></ProtectedRoute> }, // route             not yet
      { path: 'wishList', element: <ProtectedRoute><WishList /></ProtectedRoute> }, // route             not yet
      { path: 'products', element: <ProtectedRoute><Products /></ProtectedRoute> }, // route     not yet
      { path: 'categories', element: <ProtectedRoute><Categories /></ProtectedRoute> }, // route not yet
      { path: 'subcategories/:id', element: <ProtectedRoute><Subcategories /></ProtectedRoute> }, // route not yet
      { path: 'SpecificSubCategories/:id', element: <ProtectedRoute><SpecificSubCategories /></ProtectedRoute> }, // route not yet
      { path: 'subBrand/:id', element: <ProtectedRoute><SubBrand /></ProtectedRoute> }, // route not yet
      { path: 'brands', element: <ProtectedRoute><Brands /></ProtectedRoute> }, // route         not yet
      { path: 'productDetails/:id', element: <ProtectedRoute><ProductDetails /></ProtectedRoute> }, // route         not yet
      { path: '*', element: <NotFound /> }, // route            done

    ]
  } // route
])
function App() {
  // handle async states
  const client = new QueryClient()
  return <>
    <QueryClientProvider client={client}>
      <LoggedAuthProvider>
        <CartAuthProvider>
          <RouterProvider router={router} />
        </CartAuthProvider>
      </LoggedAuthProvider>
    </QueryClientProvider>
    <Toaster />
  </>
}

export default App;
