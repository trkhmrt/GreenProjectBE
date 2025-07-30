import React, { useState } from "react";
import CardVisual from "../CardVisual";

const CreditCard = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      {/* Kart görseli */}
      <CardVisual
        cardNumber={cardNumber}
        cardName={cardName}
        expiry={expiry}
        cvv={cvv}
        isFlipped={isCardFlipped}
      />
      {/* Kart inputları */}
      <div className="flex-1 flex flex-col gap-3 min-w-[220px]">
        <input
          type="text"
          maxLength={19}
          value={cardNumber}
          onChange={e => setCardNumber(e.target.value.replace(/[^0-9]/g, '').replace(/(.{4})/g, '$1 ').trim())}
          placeholder="Card Number"
          className="border rounded-md px-3 py-2 text-base font-mono tracking-widest w-[260px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <div className="text-xs text-gray-400 mt-1 mb-2 w-[260px]">E.g.: 49..., 51..., 36..., 37...</div>
        <input
          type="text"
          value={cardName}
          onChange={e => setCardName(e.target.value)}
          placeholder="Name"
          className="border rounded-md px-3 py-2 text-base w-[260px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 mb-2"
        />
        <div className="flex gap-2 w-[260px]">
          <input
            type="text"
            maxLength={5}
            value={expiry}
            onChange={e => setExpiry(e.target.value.replace(/[^0-9/]/g, '').replace(/(\d{2})(\d{1,2})/, '$1/$2'))}
            placeholder="Valid Thru"
            className="border rounded-md px-3 py-2 text-base w-1/2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <input
            type="text"
            maxLength={4}
            value={cvv}
            onFocus={() => setIsCardFlipped(true)}
            onBlur={() => setIsCardFlipped(false)}
            onChange={e => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="CVC"
            className="border rounded-md px-3 py-2 text-base w-1/2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>
    </div>
  );
};

export default CreditCard; 