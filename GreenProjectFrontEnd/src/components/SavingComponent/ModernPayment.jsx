import React, { useState } from "react";

const ModernPayment = ({
  total = 302.96,
  currency = "EUR",
  onPay,
  addresses = [],
  selectedAddressId,
  onAddressChange
}) => {
  const [showCard, setShowCard] = useState(true);
  const [showAddress, setShowAddress] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  // Demo ürünler
  const products = [
    { name: "Samsung Galaxy Tab S9 Kılıf", qty: 1, price: 299.99 },
    { name: "Anker PowerPort III Nano", qty: 2, price: 349.99 },
  ];

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#ece9f7] via-[#f8f6fc] to-[#e3d6ff] py-8 px-2">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-auto p-6 md:p-10 flex flex-col gap-5 border border-[#ece6f7]">
        {/* Header */}
        <div>
          <div className="font-semibold text-lg md:text-xl mb-1">Pay</div>
          <div className="text-gray-400 text-xs md:text-sm mb-1">Total</div>
          <div className="font-bold text-2xl md:text-3xl text-[#6C2BD7] mb-2">{currency} {total.toLocaleString()}</div>
        </div>

        {/* Card Info Collapse */}
        <div className="bg-[#f8f6fc] rounded-xl shadow border border-[#ece6f7]">
          <button type="button" className="flex items-center w-full px-4 py-3 focus:outline-none" onClick={() => setShowCard(v => !v)}>
            <span className="font-semibold text-base">Credit card</span>
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="mc" className="w-8 h-5 ml-2" />
            <span className="ml-auto text-[#6C2BD7] font-bold text-lg">{showCard ? '−' : '+'}</span>
          </button>
          {showCard && (
            <div className="px-4 pb-4 flex flex-col gap-3 animate-fade-in">
              <input
                type="text"
                placeholder="Card number"
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value)}
                className="w-full p-3 rounded-lg border border-[#ece6f7] bg-white focus:border-[#6C2BD7] focus:ring-2 focus:ring-[#6C2BD7]/20 transition text-base font-mono tracking-widest placeholder-gray-400"
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Expiration date"
                  value={expiry}
                  onChange={e => setExpiry(e.target.value)}
                  className="w-1/2 p-3 rounded-lg border border-[#ece6f7] bg-white focus:border-[#6C2BD7] focus:ring-2 focus:ring-[#6C2BD7]/20 transition text-base placeholder-gray-400"
                />
                <input
                  type="text"
                  placeholder="CVC"
                  value={cvv}
                  onChange={e => setCvv(e.target.value)}
                  className="w-1/2 p-3 rounded-lg border border-[#ece6f7] bg-white focus:border-[#6C2BD7] focus:ring-2 focus:ring-[#6C2BD7]/20 transition text-base placeholder-gray-400"
                />
              </div>
              <input
                type="text"
                placeholder="Cardholder name"
                value={cardName}
                onChange={e => setCardName(e.target.value)}
                className="w-full p-3 rounded-lg border border-[#ece6f7] bg-white focus:border-[#6C2BD7] focus:ring-2 focus:ring-[#6C2BD7]/20 transition text-base placeholder-gray-400"
              />
            </div>
          )}
        </div>

        {/* Address Collapse */}
        <div className="bg-[#f8f6fc] rounded-xl shadow border border-[#ece6f7]">
          <button type="button" className="flex items-center w-full px-4 py-3 focus:outline-none" onClick={() => setShowAddress(v => !v)}>
            <span className="font-semibold text-base">
              Address
              {selectedAddress && (
                <span className="text-gray-400 font-normal text-xs ml-2 break-words whitespace-normal block md:inline align-middle">
                  ({selectedAddress.title}: {selectedAddress.details})
                </span>
              )}
            </span>
            <span className="ml-auto text-[#6C2BD7] font-bold text-lg">{showAddress ? '−' : '+'}</span>
          </button>
          {showAddress && (
            <div className="px-4 pb-4 animate-fade-in">
              {addresses.length === 0 ? (
                <div className="text-gray-400 text-sm">No address found.</div>
              ) : (
                <div className="flex flex-col gap-2">
                  {addresses.map(addr => (
                    <label
                      key={addr.id}
                      className={`flex items-center rounded-lg px-3 py-2 cursor-pointer border min-h-[44px] ${selectedAddressId === addr.id ? 'bg-[#ede7f6] border-[#6C2BD7] font-semibold' : 'bg-white border-[#ece6f7]'}`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddressId === addr.id}
                        onChange={() => onAddressChange && onAddressChange(addr.id)}
                        className="mr-2 accent-[#6C2BD7]"
                      />
                      <span className="block w-full truncate">
                        {addr.title}: {addr.details}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Products Collapse */}
        <div className="bg-[#f8f6fc] rounded-xl shadow border border-[#ece6f7]">
          <button type="button" className="flex items-center w-full px-4 py-3 focus:outline-none" onClick={() => setShowProducts(v => !v)}>
            <span className="font-semibold text-base">Products</span>
            <span className="ml-auto text-[#6C2BD7] font-bold text-lg">{showProducts ? '−' : '+'}</span>
          </button>
          {showProducts && (
            <div className="px-4 pb-4 animate-fade-in">
              {products.map((p, i) => (
                <div key={i} className="flex justify-between mb-1 text-sm">
                  <span>{p.name} x{p.qty}</span>
                  <span className="font-semibold">{currency} {(p.price * p.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pay Button */}
        <button
          className="w-full py-4 text-lg rounded-xl bg-[#6C2BD7] text-white font-bold mt-2 shadow-[0_8px_32px_0_rgba(99,102,241,0.18)] hover:bg-[#4B1C8C] transition-all duration-200 tracking-wide flex items-center justify-center"
          onClick={onPay}
        >
          <span className="font-bold text-xl">{total.toLocaleString()} ₺ Öde</span>
        </button>
      </div>
    </div>
  );
};

export default ModernPayment; 