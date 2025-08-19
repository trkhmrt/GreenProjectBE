import React from "react";
import Products from "../pages/Products.jsx";
import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div className="bg-gray-100">
            <Products />
        </div>
    );
};

export default HomePage;