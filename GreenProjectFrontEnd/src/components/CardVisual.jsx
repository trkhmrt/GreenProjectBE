import React from 'react';

function formatCardNumber(number) {
  // 4'lü bloklar halinde göster
  const clean = (number || '').replace(/[^0-9]/g, '').padEnd(16, '•');
  return clean.match(/.{1,4}/g)?.join(' ') || '';
}

const CardVisual = ({
  cardNumber = '',
  cardName = '',
  expiry = '',
  cvv = '',
  isFlipped = false,
  cardType = 'visa',
  bankName = '',
}) => {
  return (
    <div className="relative w-full max-w-[320px] aspect-[1.6/1] perspective mx-auto">
      <div className={`transition-transform duration-500 w-full h-full ${isFlipped ? 'rotate-y-180' : ''}`} style={{transformStyle: 'preserve-3d'}}>
        {/* Kartın Ön Yüzü */}
        <div className="absolute w-full h-full rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-xl text-white flex flex-col justify-between p-4 sm:p-6 backface-hidden overflow-hidden border border-gray-200">
          {/* Üst satır: Sim ve Logo */}
          <div className="flex justify-between items-center mb-2 sm:mb-4">
            <div className="w-10 h-7 bg-gradient-to-tr from-yellow-300 to-yellow-100 rounded-sm border border-yellow-400 shadow-inner flex items-center justify-center">
              <div className="w-6 h-4 bg-yellow-200 rounded-sm border border-yellow-400"></div>
            </div>
            <span className="text-xl sm:text-2xl font-extrabold tracking-widest mr-1 mt-1 drop-shadow text-right whitespace-nowrap select-none">
              VISA
            </span>
          </div>
          {/* Kart numarası */}
          <div className="text-sm sm:text-base tracking-widest font-mono font-semibold mb-3 sm:mb-6 text-center w-full flex justify-center items-center whitespace-nowrap select-none">
            {formatCardNumber(cardNumber)}
          </div>
          {/* Alt satır: isim ve valid thru */}
          <div className="flex justify-between items-end w-full mt-auto">
            <div className="text-xs sm:text-sm font-mono tracking-widest text-white opacity-80 truncate break-all max-w-[120px]">
              {(cardName || 'YOUR NAME HERE').toUpperCase()}
            </div>
            <div className="flex flex-col items-end">
              <span className="uppercase text-[9px] sm:text-xs text-white opacity-60">valid thru</span>
              <span className="tracking-widest text-xs sm:text-sm font-semibold text-white opacity-90">{expiry || '••/••'}</span>
            </div>
          </div>
        </div>
        {/* Kartın Arka Yüzü */}
        <div className="absolute w-full h-full rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-xl text-white flex flex-col justify-between p-0 rotate-y-180 backface-hidden overflow-hidden border border-gray-200">
          {/* Manyetik şerit */}
          <div className="w-full h-10 sm:h-12 bg-black rounded-t-2xl mt-0" style={{marginTop: '20px'}}></div>
          {/* İmza bandı ve CVV */}
          <div className="flex flex-row items-center px-4 sm:px-8 mt-4 sm:mt-6" style={{height: '40px'}}>
            {/* İmza bandı */}
            <div className="flex-1 h-7 sm:h-9 bg-white rounded-sm border border-gray-200 relative flex items-center">
              <svg width="100%" height="100%" className="absolute left-0 top-0">
                <rect x="0" y="2" width="100%" height="2" fill="#f7e9b6" />
                <rect x="0" y="7" width="100%" height="2" fill="#f7e9b6" />
                <rect x="0" y="12" width="100%" height="2" fill="#f7e9b6" />
              </svg>
              <span className="ml-2 sm:ml-4 text-xs sm:text-base text-gray-700 z-10 w-full text-right pr-2 sm:pr-4 font-mono tracking-widest">
                {cvv || '•••'}
              </span>
            </div>
          </div>
          {/* Alt logo ve boşluk */}
          <div className="flex justify-center items-end pb-3 sm:pb-6 pt-2 sm:pt-4">
            <span className="text-2xl sm:text-4xl font-extrabold tracking-widest opacity-80 select-none">VISA</span>
          </div>
        </div>
      </div>
      <style>{`
        .perspective { perspective: 1000px; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
};

export default CardVisual; 