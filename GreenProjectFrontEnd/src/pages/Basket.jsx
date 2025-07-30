import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getBasketCustomerById,
    incrementProductFromBasket,
    decrementProductFromBasket,
    removeProductFromBasket
} from "../services/BasketService.js";

const Basket = () => {
    const [basket, setBasket] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
    const fetchBasket = async () => {
      setIsLoading(true);
      try {
        const data = await getBasketCustomerById();
        setBasket(data.basketProducts || []);
      } catch (e) {
        setBasket([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBasket();
    }, []);

  const handleIncrement = async (basketProductUnitId) => {
        await incrementProductFromBasket(basketProductUnitId);
    setBasket(basket => basket.map(item => item.basketProductUnitId === basketProductUnitId ? { ...item, productQuantity: item.productQuantity + 1 } : item));
  };
  const handleDecrement = async (basketProductUnitId) => {
        await decrementProductFromBasket(basketProductUnitId);
    setBasket(basket => basket.map(item => item.basketProductUnitId === basketProductUnitId ? { ...item, productQuantity: Math.max(1, item.productQuantity - 1) } : item));
  };
  const handleRemove = async (basketProductUnitId) => {
    await removeProductFromBasket(basketProductUnitId);
    setBasket(basket => basket.filter(item => item.basketProductUnitId !== basketProductUnitId));
  };

  const total = basket.reduce((sum, p) => sum + p.productQuantity * p.productPrice, 0);

    return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-[#ece9f7] via-[#f8f6fc] to-[#e3d6ff] py-8 px-2">
      <div className="w-full max-w-xl mx-auto relative">
        <div className="bg-white rounded-2xl shadow-xl p-4 flex flex-col gap-3 border border-[#ece6f7] mt-4">
          <div className="font-bold text-xl mb-2">Sepetim</div>
          <div className="flex flex-col gap-2">
            {isLoading ? (
              <div className="text-gray-400 text-center py-8">Yükleniyor...</div>
            ) : basket.length === 0 ? (
              <div className="text-gray-400 text-center py-8">Sepetiniz boş.</div>
            ) : basket.map((p, i) => (
              <div key={p.basketProductUnitId} className="flex items-center gap-3 bg-white rounded-xl shadow-sm mb-2 p-2 border border-gray-100">
                <img src={p.productImageUrl} alt={p.productName} className="w-16 h-16 object-cover rounded-lg border bg-gray-100" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-700 truncate">{p.productName}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <button onClick={() => handleDecrement(p.basketProductUnitId)} className="w-7 h-7 rounded bg-gray-100 hover:bg-indigo-50 text-lg font-bold flex items-center justify-center transition-colors duration-150 focus:outline-none focus:ring-0 focus:border-0 hover:text-[#6C2BD7]">-</button>
                    <span className="w-6 text-center">{p.productQuantity}</span>
                    <button onClick={() => handleIncrement(p.basketProductUnitId)} className="w-7 h-7 rounded bg-gray-100 hover:bg-indigo-50 text-lg font-bold flex items-center justify-center transition-colors duration-150 focus:outline-none focus:ring-0 focus:border-0 hover:text-[#6C2BD7]">+</button>
                  </div>
                </div>
                <div className="flex flex-col items-end min-w-[70px]">
                  <span className="font-semibold text-[#6C2BD7]">{(p.productPrice * p.productQuantity).toLocaleString()} ₺</span>
                                                <button
                    onClick={() => handleRemove(p.basketProductUnitId)}
                    className="text-xs text-red-500 bg-transparent hover:bg-red-600 hover:text-white mt-1 transition-all duration-150 rounded px-3 py-1 font-semibold shadow-sm border border-red-100 hover:border-red-600 focus:outline-none"
                  >
                    Sil
                                            </button>
                                    </div>
                                </div>
                            ))}
                        </div>
          {basket.length > 0 && !isLoading && (
            <>
              <div className="flex justify-between items-center mt-2">
                <span className="font-semibold text-lg">Toplam</span>
                <span className="font-bold text-2xl text-[#6C2BD7]">{total.toLocaleString()} ₺</span>
                            </div>
                            <button
                className="w-full py-3 mt-3 rounded-xl bg-[#6C2BD7] text-white font-bold text-lg shadow hover:bg-[#4B1C8C] transition-all duration-200"
                onClick={() => navigate("/payment")}
                            >
                Sepeti Onayla
                            </button>
            </>
          )}
                        </div>
                    </div>
        </div>
    );
};

export default Basket;