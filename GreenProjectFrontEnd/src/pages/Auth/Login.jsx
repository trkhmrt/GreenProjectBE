import React, {useState} from 'react';
import {authLogin} from '../../services/AuthService.js';
import {useNavigate} from "react-router-dom";
import {useAuth} from '../../context/AuthContext.jsx'
import {routes} from '../../routes/Routes.js'
import axios from 'axios';

// GUID (UUID v4) oluşturucu fonksiyon
function generateGUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const Login = () => {
    const [username, setUsername] = useState('aysenaz1');
    const [password, setPassword] = useState('Password123');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const {login} = useAuth();

    const navigate = useNavigate();

    const handleLogin = async () => {
        setErrorMessage("");
        setIsLoading(true);

        try {
            const response = await authLogin({ username, password });
            const customerInfo = {
                "accessToken": response.data.accessToken,
            }
            login(customerInfo);
            navigate(`${routes.HomePage}`);
        } catch (err) {
            const status = err.response?.status;
            if (status === 401) {
                setErrorMessage("Kullanıcı adı veya şifre yanlış.");
            } else if (status === 403) {
                setErrorMessage("Erişim izniniz yok.");
            } else {
                setErrorMessage("Beklenmeyen bir hata oluştu.");
            }
        } finally {
            setIsLoading(false);
        }
    };
    const handleLogoClick = () => {
        navigate(`${routes.HomePage}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50/30 to-purple-100/20 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                {/* GreenProject Header */}
                <div className="text-center mb-8">
                    <button
                        onClick={handleLogoClick}
                        className="inline-flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.66 8L12 2.35 6.34 8C4.78 9.56 4 11.64 4 13.64s.78 4.11 2.34 5.67 3.61 2.35 5.66 2.35 4.1-.79 5.66-2.35S20 15.64 20 13.64 19.22 9.56 17.66 8z"/>
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-purple-700">GreenProject</span>
                    </button>
                </div>

                {/* Login Card */}
                <div className="bg-gradient-to-br from-purple-50/30 to-purple-100/20 backdrop-blur-sm rounded-2xl border border-purple-200/30 p-8 shadow-xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-purple-800 mb-2">Giriş Yap</h1>
                        <p className="text-purple-600 text-sm">Hesabınıza erişin</p>
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="mb-6 p-4 bg-red-50/80 border border-red-200/50 rounded-xl backdrop-blur-sm">
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-red-700 text-sm font-medium">{errorMessage}</span>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <div className="space-y-5">
                        {/* Username Field */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-purple-700 mb-2">Kullanıcı Adı</label>
                            <input
                                type="text"
                                value={username}
                                placeholder="Kullanıcı adınızı girin"
                                className="w-full px-4 py-3 bg-purple-50/60 border border-purple-200/30 rounded-xl text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200/50 focus:border-purple-200/50 transition-all duration-200"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        {/* Password Field */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-purple-700 mb-2">Şifre</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    placeholder="Şifrenizi girin"
                                    className="w-full px-4 py-3 bg-purple-50/60 border border-purple-200/30 rounded-xl text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200/50 focus:border-purple-200/50 transition-all duration-200 pr-12"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-600 transition-colors duration-200"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            onClick={handleLogin}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-br from-purple-600 to-purple-700 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-200/50 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-8 shadow-lg hover:shadow-xl"
                        >
                            <div className="flex items-center justify-center">
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Giriş Yapılıyor...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        Giriş Yap
                                    </>
                                )}
                            </div>
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-purple-600 text-sm">
                            Hesabınız yok mu?{' '}
                            <a href="/register" className="text-purple-700 hover:text-purple-800 font-medium transition-colors duration-200 hover:underline">
                                Kayıt Ol
                            </a>
                        </p>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                    <p className="text-purple-500 text-xs">
                        Güvenli giriş için SSL şifreleme kullanılmaktadır
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;