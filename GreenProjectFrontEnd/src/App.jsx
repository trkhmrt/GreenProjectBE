import './App.css'
import HomePage from "./pages/HomePage.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/Auth/Login.jsx";
import Basket from "./pages/Basket.jsx";
import Layout from "./layout/Layout.jsx";
import {routes} from "./routes/Routes.js"
import {AuthProvider} from "./context/AuthContext.jsx";
import GuestRoute from "./routes/GuestRoute";
import Register from "./pages/Auth/Register.jsx";
import Payment from "./pages/Payment.jsx";
import PaymentResult from "./pages/PaymentResult.jsx";
import Orders from "./pages/Orders.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import AdminOffice from "./pages/AdminPanel/AdminOffice.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import AdminProductDetail from "./pages/AdminPanel/AdminProductDetail.jsx";
import AdminCategoryPage from "./pages/AdminPanel/AdminCategoryPage.jsx";
import AdminOrderPage from "./pages/AdminPanel/AdminOrderPage.jsx";
import AdminOrderDetail from "./pages/AdminPanel/AdminOrderDetail.jsx";
import AddProduct from "./pages/AdminPanel/AddProduct.jsx";
import AdminProductList from "./pages/AdminPanel/AdminProductList.jsx";
import Profile from "./pages/Profile.jsx";
import { ToastProvider } from './context/ToastContext';
import Toaster from './components/Toaster';

function App() {
    return (
        <>
            <ToastProvider>
                <Toaster />
                <AuthProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path={routes.Login} element={
                                <GuestRoute>
                                    <Login/>
                                </GuestRoute>
                            }>
                            </Route>
                            <Route element={<Layout/>}>
                                <Route path={routes.Register} element={<Register/>}/>
                                <Route path={routes.HomePage} element={<HomePage/>}></Route>
                                <Route path="/Basket" element={<Basket/>}></Route>
                                <Route path="/product/:productId" element={<ProductDetail/>}></Route>
                                <Route path="/profile" element={<Profile/>}></Route>
                                <Route path={routes.Payment} element={<Payment/>}></Route>
                                <Route path={routes.Orders} element={<Orders/>}></Route>
                                <Route path="/category/:categoryId" element={<Products/>}></Route>
                            </Route>
                            <Route element={<AdminLayout/>}>
                                <Route path={routes.AdminOffice} element={<AdminOffice/>}/>
                                <Route path="/admin/products/:productId" element={<AdminProductDetail/>}/>
                                <Route path={routes.AdminCategory} element={<AdminCategoryPage/>}/>
                                <Route path="/admin/orders" element={<AdminOrderPage/>}/>
                                <Route path="/admin/orders/:orderId" element={<AdminOrderDetail/>}/>
                                <Route path="/addProductToStore" element={<AddProduct/>}/>
                                <Route path="/adminproduct" element={<AdminProductList/>}/>
                            </Route>
                            <Route path={routes.PaymentSuccess} element={<PaymentResult/>}></Route>
                        </Routes>
                    </BrowserRouter>
                </AuthProvider>
            </ToastProvider>
        </>
    )
}

export default App
