import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { getBasketCustomerById } from '../services/BasketService';
import { createThreedsPayment } from '../services/PaymentService'; // Yeni fonksiyonu import et
import SmsModal from '../components/SmsModal'; // SMS Modal componentini import et
import { useAuth } from '../context/AuthContext'; // AuthContext yerine useAuth'u import et

    const addresses = [
        {
            id: 1,
            title: "Ev",
            details: "İstanbul, Beşiktaş, Barbaros Bulvarı No:10"
        },
        {
            id: 2,
            title: "İş",
            details: "İstanbul, Levent, Büyükdere Cad. No:50"
        },
    ];

const Payment = () => {
  const [selectedAddressId, setSelectedAddressId] = useState(addresses[0].id);
  const [showCard, setShowCard] = useState(true);
  const [showAddress, setShowAddress] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  
  // Test kart bilgileri ile state'leri başlat
  const [cardNumber, setCardNumber] = useState("5890040000000016");
  const [expiry, setExpiry] = useState("12/28");
  const [cvv, setCvv] = useState("123");
  const [cardName, setCardName] = useState("John Doe");

  const navigate = useNavigate();
  const { user } = useAuth(); // useContext(AuthContext) yerine useAuth() kullan

  // Dinamik sepet verileri için state'ler
  const [basket, setBasket] = useState(null);
  const [loading, setLoading] = useState(true);

  // SMS Modal state
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);

  // 3D Secure modal state
  const [threeDSHtmlContent, setThreeDSHtmlContent] = useState(null);
  const [showThreeDSModal, setShowThreeDSModal] = useState(false);

  // Sepet verilerini çek
  useEffect(() => {
    const fetchBasket = async () => {
      try {
        const response = await getBasketCustomerById();
        // Gelen yanıttan sepet ürünlerini ve ID'yi al
        const fetchedProducts = response.basketProducts || [];
        const basketId = response.basketId;

        // Toplam fiyatı manuel olarak hesapla
        const totalPrice = fetchedProducts.reduce((acc, item) => {
          return acc + (item.productPrice * item.productQuantity);
        }, 0);

        // State'i güncelle
        setBasket({
          id: basketId,
          basketProducts: fetchedProducts,
          totalPrice: totalPrice,
        });
      } catch (error) {
        console.error("Sepet verileri alınırken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBasket();
  }, []);

  const total = basket?.totalPrice || 0;
  const currency = "₺"; // Para birimi
  const products = basket?.basketProducts || [];
  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  // Ödeme işlemini handle et
  const handlePayment = async () => {
    if (!user || !basket) {
      alert("Kullanıcı ve sepet bilgileri yüklenemedi.");
      return;
    }

    const [expireMonth, expireYear] = expiry.split('/');

    // basketProducts'ı backend'in beklediği basketItems formatına dönüştür
    const basketItems = basket.basketProducts.map(item => ({
      id: (item.productId ?? item.id ?? '').toString(),
      price: item.productPrice * item.productQuantity, // toplam fiyat
      name: item.productName ?? 'Ürün',
      category1: item.categoryName ?? 'Kategori',
      category2: item.subCategoryName ?? 'Alt Kategori',
      itemType: "PHYSICAL",
      externalSubMerchantId: item.externalSubMerchantId ?? '',
      chargedFromMerchant: item.chargedFromMerchant ?? false,
      chargedPriceFromMerchant: item.chargedPriceFromMerchant ?? 0,
      withholdingTax: (item.withholdingTax && item.withholdingTax > 0) ? item.withholdingTax : 1
    }));

    // Tüm basketItems'ın toplam fiyatını hesapla
    const total = basketItems.reduce((acc, item) => acc + Number(item.price), 0);

    // Backend'in beklediği CreatePaymentRequest objesini hazırla
    const paymentRequest = {
      basketId: basket.id,
      buyerId: user.id?.toString() || user.customerId?.toString() || '',
      basketItems, // Doğru alan adı ve format
      price: total,
      paidPrice: total,
      installment: 1,
      paymentChannel: "WEB",
      paymentGroup: "PRODUCT",
      paymentCard: {
        cardHolderName: cardName,
        cardNumber: cardNumber.replace(/\s/g, ''),
        expireYear: `20${expireYear}`,
        expireMonth: expireMonth,
        cvc: cvv,
        registerCard: 0,
      },
      buyer: {
        id: '1234567',
        name: user.firstName || user.name || 'Test',
        surname: user.lastName || user.surname || 'User',
        identityNumber: user.identityNumber || "12345678901",
        email: 'trkhamarat@gmail.com',
        gsmNumber: user.phoneNumber || user.gsmNumber || "+905555555555",
        registrationDate: user.registrationDate ? formatDateTime(user.registrationDate) : formatDateTime(new Date()),
        lastLoginDate: user.lastLoginDate ? formatDateTime(user.lastLoginDate) : formatDateTime(new Date()),
        registrationAddress: selectedAddress.details,
        city: "Istanbul",
        country: "Turkey",
        zipCode: "34000",
        ip: "85.34.78.112"
      },
      shippingAddress: {
        contactName: cardName,
        city: "Istanbul",
        country: "Turkey",
        address: selectedAddress.details,
        zipCode: "34000"
      },
      billingAddress: {
        contactName: cardName,
        city: "Istanbul",
        country: "Turkey",
        address: selectedAddress.details,
        zipCode: "34000"
      },
      paymentSource: "WEB",
      currency: "TRY",
      callbackUrl: `http://localhost:8072/ael/paymentservice/payment/3ds/callback`
    };

    try {
      const response = await createThreedsPayment(paymentRequest);
      console.log(response);
      if (response.data?.htmlContent) {
        setThreeDSHtmlContent(response.data.htmlContent);
        setShowThreeDSModal(true);
        // window.open ile yeni sekme açmayı kaldırdık
      } else if (response.status === 200) {
        navigate('/PaymentResult', { state: { success: true, responseData: response.data } });
      }
    } catch (error) {
      console.error('Ödeme işlemi sırasında hata:', error);
      alert('Ödeme işlemi sırasında bir hata oluştu.');
    }
  };

  // SMS onayı
  const handleSmsConfirm = () => {
    setIsSmsModalOpen(false);
    navigate('/PaymentResult', { state: { success: true } });
  };

  if (loading) {
    return <div className="text-center py-10">Sepet yükleniyor...</div>;
  }

    return (
    <>
      <div className="min-h-screen py-8 flex justify-center mx-auto relative">
        <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-auto p-6 md:p-10 flex flex-col gap-5 border border-[#ece6f7]">
                        <button
            className="self-start bg-white rounded-full shadow px-4 py-2 text-[#6C2BD7] font-bold border border-[#ece6f7] hover:bg-[#f3eaff] hover:text-[#4B1C8C] transition-all duration-150"
            onClick={() => navigate('/basket')}
          >
            ← Sepete Dön
                        </button>
          {/* Header */}
          <div>
            <div className="font-semibold text-lg md:text-xl mb-1">Ödeme</div>
            <div className="text-gray-400 text-xs md:text-sm mb-1">Toplam</div>
            <div className="font-bold text-2xl md:text-3xl text-[#6C2BD7] mb-2">{total.toLocaleString()} {currency}</div>
                    </div>

          {/* Card Info Collapse */}
          <div className="bg-[#f8f6fc] rounded-xl shadow border border-[#ece6f7]">
            <button type="button" className="flex items-center w-full px-4 py-3 focus:outline-none" onClick={() => setShowCard(v => !v)}>
              <span className="font-semibold text-base">Kredi Kartı</span>
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="mc" className="w-8 h-5 ml-2" />
              <span className="ml-auto text-[#6C2BD7] font-bold text-lg">{showCard ? '−' : '+'}</span>
            </button>
            {showCard && (
              <div className="px-4 pb-4 flex flex-col gap-3 animate-fade-in">
                                <input
                                    type="text"
                  placeholder="Kart Numarası"
                                    value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  className="w-full p-3 rounded-lg border border-[#ece6f7] bg-white focus:border-[#6C2BD7] focus:ring-2 focus:ring-[#6C2BD7]/20 transition text-base font-mono tracking-widest placeholder-gray-400"
                                />
                <div className="flex gap-3">
                                <input
                                    type="text"
                    placeholder="Son Kul. Tarihi (AA/YY)"
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
                  placeholder="Kart Üzerindeki İsim"
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
                Adres
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
                  <div className="text-gray-400 text-sm">Adres bulunamadı.</div>
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
                          onChange={() => setSelectedAddressId(addr.id)}
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
              <span className="font-semibold text-base">Ürünler</span>
              <span className="ml-auto text-[#6C2BD7] font-bold text-lg">{showProducts ? '−' : '+'}</span>
            </button>
            {showProducts && (
              <div className="px-4 pb-4 animate-fade-in">
                {products.map((p, i) => (
                  <div key={i} className="flex justify-between mb-1 text-sm">
                    <span>{p.productName} x{p.productQuantity}</span>
                    <span className="font-semibold">{(p.productPrice * p.productQuantity).toLocaleString()} {currency}</span>
                </div>
                ))}
                            </div>
                        )}
                        </div>

          {/* Pay Button */}
                    <button
            className="w-full py-4 text-lg rounded-xl bg-[#6C2BD7] text-white font-bold mt-2 shadow-[0_8px_32px_0_rgba(99,102,241,0.18)] hover:bg-[#4B1C8C] transition-all duration-200 tracking-wide flex items-center justify-center"
            onClick={handlePayment}
                    >
            <span className="font-bold text-xl">{total.toLocaleString()} ₺ Öde</span>
                    </button>
                </div>
            </div>
      <SmsModal
        isOpen={isSmsModalOpen}
        onClose={() => setIsSmsModalOpen(false)}
        onConfirm={handleSmsConfirm}
      />
      {showThreeDSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl h-[80vh] flex flex-col relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl"
              onClick={() => setShowThreeDSModal(false)}
            >×</button>
            <iframe
              title="3D Secure"
              srcDoc={threeDSHtmlContent}
              className="w-full h-full rounded-b-lg border-0"
              sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation"
            />
            </div>
        </div>
      )}
    </>
    );
};

// Fonksiyon: yyyy-MM-dd HH:mm:ss formatı
function formatDateTime(date) {
  const d = new Date(date);
  const pad = n => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default Payment;