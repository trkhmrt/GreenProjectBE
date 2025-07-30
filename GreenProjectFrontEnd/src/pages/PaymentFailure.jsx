import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentFailure = () => {
    const navigate = useNavigate();
    const handleGoHome = () => navigate('/');
    const handleRetry = () => navigate('/payment', { replace: true });

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-3xl shadow-2xl p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-red-500"></div>
                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-red-100 rounded-full opacity-50"></div>
                    <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-red-100 rounded-full opacity-50"></div>

                    <div className="relative z-10 mb-6">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 6l12 12M6 18L18 6" />
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-red-600 mb-2">Ödeme Alınamadı</h1>
                    <p className="mb-6 text-red-500">Ödeme işleminiz tamamlanamadı. Lütfen tekrar deneyin.</p>

                    <div className="space-y-3">
                        <button
                            onClick={handleRetry}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            Tekrar Dene
                        </button>
                        <button
                            onClick={handleGoHome}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Ana Sayfaya Dön
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailure; 