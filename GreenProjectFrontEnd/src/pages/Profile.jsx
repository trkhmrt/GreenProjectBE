import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomerProfile } from '../services/CustomerService';

const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isEmailEditing, setIsEmailEditing] = useState(false);
    const [isPhoneEditing, setIsPhoneEditing] = useState(false);
    const [isPasswordEditing, setIsPasswordEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isAddressEditing, setIsAddressEditing] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [newAddress, setNewAddress] = useState('');
    const [newAddressTitle, setNewAddressTitle] = useState('');
    const [editingAddress, setEditingAddress] = useState('');
    const [editingAddressTitle, setEditingAddressTitle] = useState('');
    const [activeSection, setActiveSection] = useState('personal');

    const customerId = 35;

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await getCustomerProfile(customerId);
            setProfile(data);
            setFormData({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                email: data.email || '',
                username: data.username || '',
                phoneNumber: data.phoneNumber || '',
                address: data.address || '',
                city: data.city || ''
            });
        } catch (err) {
            setError('Profil bilgileri yüklenirken hata oluştu');
            console.error('Profile fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            console.log('Güncellenecek veri:', formData);
            setIsEditing(false);
        } catch (err) {
            console.error('Profile update error:', err);
        }
    };

    const handleEmailSave = async () => {
        try {
            console.log('E-posta güncellenecek:', formData.email);
            setIsEmailEditing(false);
        } catch (err) {
            console.error('Email update error:', err);
        }
    };

    const handlePhoneSave = async () => {
        try {
            console.log('Telefon güncellenecek:', formData.phoneNumber);
            setIsPhoneEditing(false);
        } catch (err) {
            console.error('Phone update error:', err);
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordSave = async () => {
        try {
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                alert('Yeni şifreler eşleşmiyor!');
                return;
            }
            if (passwordData.newPassword.length < 6) {
                alert('Yeni şifre en az 6 karakter olmalıdır!');
                return;
            }
            
            console.log('Şifre değişikliği:', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            
            setIsPasswordEditing(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            console.error('Password update error:', err);
        }
    };

    const handleAddAddress = async () => {
        try {
            if (!newAddressTitle.trim()) {
                alert('Adres başlığı boş olamaz!');
                return;
            }
            if (!newAddress.trim()) {
                alert('Adres alanı boş olamaz!');
                return;
            }
            
            console.log('Yeni adres ekleniyor:', {
                title: newAddressTitle,
                addressContent: newAddress
            });
            
            setNewAddress('');
            setNewAddressTitle('');
            setIsAddressEditing(false);
        } catch (err) {
            console.error('Address add error:', err);
        }
    };

    const handleEditAddress = (address) => {
        setEditingAddressId(address.addressId);
        setEditingAddress(address.addressContent);
        setEditingAddressTitle(address.title || '');
    };

    const handleSaveAddress = async () => {
        try {
            if (!editingAddressTitle.trim()) {
                alert('Adres başlığı boş olamaz!');
                return;
            }
            if (!editingAddress.trim()) {
                alert('Adres alanı boş olamaz!');
                return;
            }
            
            console.log('Adres güncelleniyor:', {
                addressId: editingAddressId,
                title: editingAddressTitle,
                addressContent: editingAddress
            });
            
            setEditingAddressId(null);
            setEditingAddress('');
            setEditingAddressTitle('');
        } catch (err) {
            console.error('Address update error:', err);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        try {
            if (window.confirm('Bu adresi silmek istediğinizden emin misiniz?')) {
                console.log('Adres siliniyor:', addressId);
            }
        } catch (err) {
            console.error('Address delete error:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50/30 to-purple-100/20 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Profil yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50/30 to-purple-100/20 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Hata</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Ana Sayfaya Dön
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50/30 to-purple-100/20 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <span
                            onClick={() => navigate('/')}
                            className="flex items-center text-purple-600 hover:text-purple-700 transition-all duration-200 cursor-pointer px-3 py-2 rounded-lg hover:bg-purple-100/50 backdrop-blur-sm"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            Geri Dön
                        </span>
                        <h1 className="text-3xl font-bold text-gray-900">Profilim</h1>
                        <div className="w-20"></div>
                    </div>
                </div>

                {/* Mobil Menü - Üstte */}
                <div className="lg:hidden mb-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-purple-200/30 p-4">
                        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
                            <span
                                onClick={() => setActiveSection('personal')}
                                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 cursor-pointer font-medium text-sm ${
                                    activeSection === 'personal'
                                        ? 'bg-purple-100/80 text-purple-700 border border-purple-300'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800 border border-gray-200'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="hidden sm:inline">Kişisel Bilgiler</span>
                                <span className="sm:hidden">Bilgiler</span>
                            </span>
                            
                            <span
                                onClick={() => setActiveSection('addresses')}
                                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 cursor-pointer font-medium text-sm ${
                                    activeSection === 'addresses'
                                        ? 'bg-purple-100/80 text-purple-700 border border-purple-300'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800 border border-gray-200'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="hidden sm:inline">Adreslerim</span>
                                <span className="sm:hidden">Adresler</span>
                            </span>
                            
                            <span
                                onClick={() => setActiveSection('password')}
                                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 cursor-pointer font-medium text-sm ${
                                    activeSection === 'password'
                                        ? 'bg-purple-100/80 text-purple-700 border border-purple-300'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800 border border-gray-200'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                                <span className="hidden sm:inline">Şifre Değişikliği</span>
                                <span className="sm:hidden">Şifre</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sol Taraf - Menü (Desktop) */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-purple-200/30 p-6">
                            <div className="space-y-2">
                                <span
                                    onClick={() => setActiveSection('personal')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer font-medium ${
                                        activeSection === 'personal'
                                            ? 'bg-purple-100/80 text-purple-700 border-l-4 border-purple-500'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Kişisel Bilgiler
                                </span>
                                
                                <span
                                    onClick={() => setActiveSection('addresses')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer font-medium ${
                                        activeSection === 'addresses'
                                            ? 'bg-purple-100/80 text-purple-700 border-l-4 border-purple-500'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Adreslerim
                                </span>
                                
                                <span
                                    onClick={() => setActiveSection('password')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer font-medium ${
                                        activeSection === 'password'
                                            ? 'bg-purple-100/80 text-purple-700 border-l-4 border-purple-500'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                    Şifre Değişikliği
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Sağ Taraf - İçerik Alanı */}
                    <div className="lg:col-span-3">
                        {/* Kişisel Bilgiler Bölümü */}
                        {activeSection === 'personal' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-purple-200/30 p-6">
                                {/* Profil Bilgileri - En Üst */}
                                <div className="text-center mb-6 lg:mb-8">
                                    <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                                        <span className="text-xl lg:text-2xl font-bold text-white">
                                            {profile?.firstName?.charAt(0)}{profile?.lastName?.charAt(0)}
                                        </span>
                                    </div>
                                    <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-1">
                                        {profile?.firstName} {profile?.lastName}
                                    </h2>
                                    <p className="text-gray-500 text-sm mb-4 lg:mb-6">{profile?.roles}</p>
                                    
                                    {/* İstatistikler */}
                                    <div className="grid grid-cols-3 gap-2 lg:gap-4 max-w-sm lg:max-w-md mx-auto">
                                        <div className="text-center">
                                            <div className="text-lg lg:text-2xl font-bold text-purple-600 mb-1">{profile?.totalOrders || 0}</div>
                                            <div className="text-xs text-gray-500">Toplam Sipariş</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg lg:text-2xl font-bold text-purple-600 mb-1">{profile?.totalProducts || 0}</div>
                                            <div className="text-xs text-gray-500">Toplam Ürün</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg lg:text-2xl font-bold text-purple-600 mb-1">{profile?.memberSince || '2024'}</div>
                                            <div className="text-xs text-gray-500">Üyelik Tarihi</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                                    <h3 className="text-lg lg:text-xl font-semibold text-gray-900">Kişisel Bilgiler</h3>
                                    <span
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="text-purple-600 hover:text-purple-700 transition-all duration-200 cursor-pointer px-3 py-2 rounded-lg hover:bg-purple-100/50 backdrop-blur-sm border border-purple-200/30 font-medium flex items-center gap-2 text-sm lg:text-base"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        {isEditing ? 'İptal' : 'Düzenle'}
                                    </span>
                                </div>
                                
                                <div className="space-y-3 lg:space-y-4">
                                    {/* İlk Satır - Ad ve Soyad */}
                                    <div className="grid grid-cols-2 gap-3 lg:gap-4">
                                        {/* Ad */}
                                        <div className="bg-gray-50/50 rounded-lg p-3 lg:p-4 border border-gray-100">
                                            <div className="flex items-center gap-2 mb-1">
                                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ad</label>
                                            </div>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    className="w-full px-2 py-1.5 lg:px-3 lg:py-2 bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-purple-200 focus:border-purple-300 transition-all duration-200 text-sm"
                                                />
                                            ) : (
                                                <p className="text-gray-900 text-sm font-medium">{profile?.firstName}</p>
                                            )}
                                        </div>

                                        {/* Soyad */}
                                        <div className="bg-gray-50/50 rounded-lg p-3 lg:p-4 border border-gray-100">
                                            <div className="flex items-center gap-2 mb-1">
                                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Soyad</label>
                                            </div>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    className="w-full px-2 py-1.5 lg:px-3 lg:py-2 bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-purple-200 focus:border-purple-300 transition-all duration-200 text-sm"
                                                />
                                            ) : (
                                                <p className="text-gray-900 text-sm font-medium">{profile?.lastName}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* İkinci Satır - E-posta (Tek Satır) */}
                                    <div className="bg-gray-50/50 rounded-lg p-3 lg:p-4 border border-gray-100">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">E-posta</label>
                                            </div>
                                            {!isEmailEditing && (
                                                <span
                                                    onClick={() => setIsEmailEditing(true)}
                                                    className="text-purple-600 hover:text-purple-700 cursor-pointer transition-colors duration-200 text-xs font-medium uppercase tracking-wide px-2 py-1 rounded-md bg-purple-50 hover:bg-purple-100 border border-purple-200 hover:border-purple-300"
                                                >
                                                    Düzenle
                                                </span>
                                            )}
                                        </div>
                                        {isEmailEditing ? (
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full sm:flex-1 px-2 py-1.5 lg:px-3 lg:py-2 bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-purple-200 focus:border-purple-300 transition-all duration-200 text-sm"
                                                />
                                                <div className="flex gap-2 w-full sm:w-auto">
                                                    <span
                                                        onClick={handleEmailSave}
                                                        className="flex-1 sm:flex-none text-center text-green-500 hover:text-green-600 cursor-pointer transition-colors duration-200 text-sm font-medium px-2 py-1 rounded bg-green-50 hover:bg-green-100"
                                                    >
                                                        Kaydet
                                                    </span>
                                                    <span
                                                        onClick={() => setIsEmailEditing(false)}
                                                        className="flex-1 sm:flex-none text-center text-red-500 hover:text-red-600 cursor-pointer transition-colors duration-200 text-sm font-medium px-2 py-1 rounded bg-red-50 hover:bg-red-100"
                                                    >
                                                        İptal
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-900 text-sm font-medium">{profile?.email}</p>
                                        )}
                                    </div>

                                    {/* Üçüncü Satır - Kullanıcı Adı (Tek Satır) */}
                                    <div className="bg-gray-50/50 rounded-lg p-3 lg:p-4 border border-gray-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Kullanıcı Adı</label>
                                        </div>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                className="w-full px-2 py-1.5 lg:px-3 lg:py-2 bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-purple-200 focus:border-purple-300 transition-all duration-200 text-sm"
                                            />
                                        ) : (
                                            <p className="text-gray-900 text-sm font-medium">{profile?.username}</p>
                                        )}
                                    </div>

                                    {/* Dördüncü Satır - Telefon ve Şehir */}
                                    <div className="grid grid-cols-2 gap-3 lg:gap-4">
                                        {/* Telefon */}
                                        <div className="bg-gray-50/50 rounded-lg p-3 lg:p-4 border border-gray-100">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Telefon</label>
                                                </div>
                                                {!isPhoneEditing && (
                                                    <span
                                                        onClick={() => setIsPhoneEditing(true)}
                                                        className="text-purple-600 hover:text-purple-700 cursor-pointer transition-colors duration-200 text-xs font-medium uppercase tracking-wide px-2 py-1 rounded-md bg-purple-50 hover:bg-purple-100 border border-purple-200 hover:border-purple-300"
                                                    >
                                                        Düzenle
                                                    </span>
                                                )}
                                            </div>
                                            {isPhoneEditing ? (
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                                    <input
                                                        type="tel"
                                                        name="phoneNumber"
                                                        value={formData.phoneNumber}
                                                        onChange={handleInputChange}
                                                        className="w-full sm:flex-1 px-2 py-1.5 lg:px-3 lg:py-2 bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-purple-200 focus:border-purple-300 transition-all duration-200 text-sm"
                                                    />
                                                    <div className="flex gap-2 w-full sm:w-auto">
                                                        <span
                                                            onClick={handlePhoneSave}
                                                            className="flex-1 sm:flex-none text-center text-green-500 hover:text-green-600 cursor-pointer transition-colors duration-200 text-sm font-medium px-2 py-1 rounded bg-green-50 hover:bg-green-100"
                                                        >
                                                            Kaydet
                                                        </span>
                                                        <span
                                                            onClick={() => setIsPhoneEditing(false)}
                                                            className="flex-1 sm:flex-none text-center text-red-500 hover:text-red-600 cursor-pointer transition-colors duration-200 text-sm font-medium px-2 py-1 rounded bg-red-50 hover:bg-red-100"
                                                        >
                                                            İptal
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-gray-900 text-sm font-medium">{profile?.phoneNumber}</p>
                                            )}
                                        </div>

                                        {/* Şehir */}
                                        <div className="bg-gray-50/50 rounded-lg p-3 lg:p-4 border border-gray-100">
                                            <div className="flex items-center gap-2 mb-1">
                                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Şehir</label>
                                            </div>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    className="w-full px-2 py-1.5 lg:px-3 lg:py-2 bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-purple-200 focus:border-purple-300 transition-all duration-200 text-sm"
                                                />
                                            ) : (
                                                <p className="text-gray-900 text-sm font-medium">{profile?.city}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Adres */}
                                <div className="mt-4">
                                    <div className="bg-gray-50/50 rounded-lg p-3 lg:p-4 border border-gray-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Adres</label>
                                        </div>
                                        {isEditing ? (
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                rows="2"
                                                className="w-full px-2 py-1.5 lg:px-3 lg:py-2 bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-purple-200 focus:border-purple-300 transition-all duration-200 text-sm"
                                            />
                                        ) : (
                                            <p className="text-gray-900 text-sm font-medium">{profile?.address}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Kaydet Butonu */}
                                {isEditing && (
                                    <div className="mt-6 flex gap-3">
                                        <span
                                            onClick={handleSave}
                                            className="text-green-500 hover:text-green-600 cursor-pointer transition-colors duration-200 text-sm font-medium"
                                        >
                                            Kaydet
                                        </span>
                                        <span
                                            onClick={() => setIsEditing(false)}
                                            className="text-red-500 hover:text-red-600 cursor-pointer transition-colors duration-200 text-sm font-medium"
                                        >
                                            İptal
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Adresler Bölümü */}
                        {activeSection === 'addresses' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-purple-200/30 p-4 lg:p-6">
                                <div className="flex items-center justify-between gap-3 lg:gap-4 mb-4 lg:mb-6">
                                    <h3 className="text-lg lg:text-xl font-semibold text-gray-900">Kayıtlı Adresler</h3>
                                    <span
                                        onClick={() => setIsAddressEditing(!isAddressEditing)}
                                        className="text-purple-600 hover:text-purple-700 cursor-pointer transition-colors duration-200 text-xs font-medium uppercase tracking-wide px-3 py-1.5 rounded-md bg-purple-50 hover:bg-purple-100 border border-purple-200 hover:border-purple-300 whitespace-nowrap"
                                    >
                                        {isAddressEditing ? 'İptal' : 'Ekle'}
                                    </span>
                                </div>

                                {/* Yeni Adres Ekleme */}
                                {isAddressEditing && (
                                    <div className="mb-6 p-4 border border-purple-200 rounded-lg bg-purple-50/30">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Adres Başlığı</label>
                                                <input
                                                    type="text"
                                                    value={newAddressTitle}
                                                    onChange={(e) => setNewAddressTitle(e.target.value)}
                                                    className="w-full px-3 py-2.5 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-colors text-sm lg:text-base"
                                                    placeholder="Örn: Ev, İş, Anne Evi..."
                                                />
                                            </div>
                                            <div className="lg:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                                                <textarea
                                                    value={newAddress}
                                                    onChange={(e) => setNewAddress(e.target.value)}
                                                    rows="3"
                                                    className="w-full px-3 py-2.5 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-colors text-sm lg:text-base"
                                                    placeholder="Yeni adresinizi girin..."
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2 sm:gap-4 mt-4">
                                            <span
                                                onClick={handleAddAddress}
                                                className="px-3 py-2 sm:px-4 sm:py-2 bg-green-500/20 backdrop-blur-sm text-green-700 rounded-lg hover:bg-green-500/30 transition-all duration-200 font-medium cursor-pointer border border-green-300/50 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base hover:shadow-sm"
                                            >
                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                Ekle
                                            </span>
                                            <span
                                                onClick={() => {
                                                    setIsAddressEditing(false);
                                                    setNewAddress('');
                                                    setNewAddressTitle('');
                                                }}
                                                className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-500/20 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-gray-500/30 transition-all duration-200 font-medium cursor-pointer border border-gray-300/50 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base hover:shadow-sm"
                                            >
                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                İptal
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Mevcut Adresler */}
                                {profile?.addresses && profile.addresses.length > 0 ? (
                                    <div className="space-y-4">
                                        {profile.addresses.map((address, index) => (
                                            <div key={address.addressId} className="p-4 border border-gray-200 rounded-lg">
                                                {editingAddressId === address.addressId ? (
                                                    // Düzenleme Modu
                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700">Adres Başlığı</label>
                                                                <input
                                                                    type="text"
                                                                    value={editingAddressTitle}
                                                                    onChange={(e) => setEditingAddressTitle(e.target.value)}
                                                                    className="w-full px-3 py-2.5 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-colors text-sm lg:text-base"
                                                                    placeholder="Örn: Ev, İş, Anne Evi..."
                                                                />
                                                            </div>
                                                            <div className="lg:col-span-2">
                                                                <label className="block text-sm font-medium text-gray-700">Adres</label>
                                                                <textarea
                                                                    value={editingAddress}
                                                                    onChange={(e) => setEditingAddress(e.target.value)}
                                                                    rows="3"
                                                                    className="w-full px-3 py-2.5 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-colors text-sm lg:text-base"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 sm:gap-4">
                                                            <span
                                                                onClick={handleSaveAddress}
                                                                className="px-3 py-2 sm:px-4 sm:py-2 bg-green-500/20 backdrop-blur-sm text-green-700 rounded-lg hover:bg-green-500/30 transition-all duration-200 font-medium cursor-pointer border border-green-300/50 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base hover:shadow-sm"
                                                            >
                                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                                Kaydet
                                                            </span>
                                                            <span
                                                                onClick={() => {
                                                                    setEditingAddressId(null);
                                                                    setEditingAddress('');
                                                                    setEditingAddressTitle('');
                                                                }}
                                                                className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-500/20 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-gray-500/30 transition-all duration-200 font-medium cursor-pointer border border-gray-300/50 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base hover:shadow-sm"
                                                            >
                                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                                İptal
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    // Görüntüleme Modu
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <p className="text-gray-900 font-medium">{address.title || `Adres ${index + 1}`}</p>
                                                            <p className="text-gray-600 mt-1">{address.addressContent}</p>
                                                        </div>
                                                        <div className="flex gap-1 sm:gap-2 ml-2 sm:ml-4">
                                                            <span
                                                                onClick={() => handleEditAddress(address)}
                                                                className="text-purple-600 hover:text-purple-700 text-xs sm:text-sm font-medium cursor-pointer px-1.5 py-1 sm:px-2 sm:py-1 rounded-md hover:bg-purple-100/50 backdrop-blur-sm transition-all duration-200"
                                                            >
                                                                Düzenle
                                                            </span>
                                                            <span
                                                                onClick={() => handleDeleteAddress(address.addressId)}
                                                                className="text-red-600 hover:text-red-700 text-xs sm:text-sm font-medium cursor-pointer px-1.5 py-1 sm:px-2 sm:py-1 rounded-md hover:bg-red-100/50 backdrop-blur-sm transition-all duration-200"
                                                            >
                                                                Sil
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="text-gray-400 mb-4">
                                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500">Henüz kayıtlı adresiniz bulunmuyor.</p>
                                        <p className="text-gray-400 text-sm mt-1">"Ekle" butonuna tıklayarak adres ekleyebilirsiniz.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Şifre Değişikliği Bölümü */}
                        {activeSection === 'password' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-purple-200/30 p-4 lg:p-6">
                                <div className="flex items-center justify-between gap-3 mb-4 lg:mb-6">
                                    <h3 className="text-lg lg:text-xl font-semibold text-gray-900">Şifre Değişikliği</h3>
                                    <span
                                        onClick={() => setIsPasswordEditing(!isPasswordEditing)}
                                        className="text-purple-600 hover:text-purple-700 cursor-pointer transition-colors duration-200 text-xs font-medium uppercase tracking-wide px-3 py-1.5 rounded-md bg-purple-50 hover:bg-purple-100 border border-purple-200 hover:border-purple-300 whitespace-nowrap"
                                    >
                                        {isPasswordEditing ? 'İptal' : 'Şifre Değiştir'}
                                    </span>
                                </div>
                            
                                {isPasswordEditing ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Mevcut Şifre</label>
                                            <input
                                                type="password"
                                                name="currentPassword"
                                                value={passwordData.currentPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-colors"
                                                placeholder="Mevcut şifrenizi girin"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-colors"
                                                placeholder="Yeni şifrenizi girin"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre (Tekrar)</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-colors"
                                                placeholder="Yeni şifrenizi tekrar girin"
                                            />
                                        </div>
                                        
                                        <div className="flex gap-3 pt-4">
                                            <span
                                                onClick={handlePasswordSave}
                                                className="text-green-500 hover:text-green-600 cursor-pointer transition-colors duration-200 text-sm font-medium"
                                            >
                                                Kaydet
                                            </span>
                                            <span
                                                onClick={() => {
                                                    setIsPasswordEditing(false);
                                                    setPasswordData({
                                                        currentPassword: '',
                                                        newPassword: '',
                                                        confirmPassword: ''
                                                    });
                                                }}
                                                className="text-red-500 hover:text-red-600 cursor-pointer transition-colors duration-200 text-sm font-medium"
                                            >
                                                İptal
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">Şifrenizi değiştirmek için "Şifre Değiştir" butonuna tıklayın.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;