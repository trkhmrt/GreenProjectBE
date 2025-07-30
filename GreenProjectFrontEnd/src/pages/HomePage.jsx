import React from "react";
import Carousel from "../components/Carousel.jsx";
import ProductSlider from "../components/PopularProductSlider.jsx";
import CategoryPage from "./CategoryPage.jsx";
import Basket from "./Basket.jsx";
import PaymentScreen from "./Payment.jsx";
import Hero from "../components/Hero.jsx";
import Footer from "../components/Footer.jsx";
import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div className="bg-gray-100">
            <Hero></Hero>
            <ProductSlider />
            {/* <ProductLayout /> kaldırıldı */}
            <CategoryPage />
            {/* Kategori sayfası için örnek link */}
            <div className="text-center my-8">
                <Link to="/category/1" className="text-[#6C2BD7] underline font-bold">Kategori Sayfası (örnek)</Link>
            </div>
        </div>
    );
};

export default HomePage;