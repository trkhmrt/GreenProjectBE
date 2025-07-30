<div className="mt-8">
    <h3 className="text-lg font-bold mb-4 text-gray-800">Kart Bilgileri</h3>
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
            {/* Taksit Seçenekleri */}
            <div className="w-full max-w-xs mt-2">
                {installmentLoading && (
                    <div className="text-sm text-gray-500 text-center py-2">Taksit seçenekleri yükleniyor...</div>
                )}
                {installmentError && (
                    <div className="text-sm text-red-500 text-center py-2">{installmentError}</div>
                )}
                {(!installmentLoading && !installmentError && installments.length > 0) && (
                    <div className="rounded-xl bg-white shadow p-3 flex flex-col gap-2">
                        {installmentBankInfo && (
                            <div className="mb-2 text-center">
                                <div className="text-base font-bold text-gray-800">{installmentBankInfo.bankName}</div>
                                <div className="text-xs text-gray-500">{installmentBankInfo.cardFamilyName} - {installmentBankInfo.cardAssociation}</div>
                            </div>
                        )}
                        <div className="text-sm font-semibold text-gray-700 mb-1">Taksit Seçenekleri</div>
                        <div className="flex flex-col gap-1">
                            {installments.map(inst => (
                                <div key={inst.installmentNumber} className="flex justify-between items-center border-b last:border-b-0 py-1">
                                    <span className="font-medium text-gray-700">{inst.installmentNumber} Taksit</span>
                                    <span className="text-gray-500 text-xs">Aylık: {inst.installmentPrice} TL</span>
                                    <span className="font-bold text-green-700">Toplam: {inst.totalPrice} TL</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
</div>
