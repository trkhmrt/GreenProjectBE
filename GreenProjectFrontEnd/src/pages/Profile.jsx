import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomerProfile } from '../services/CustomerService';

const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
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
    const [activeSection, setActiveSection] = useState('personal'); // 'personal', 'addresses', 'password'

    // Geçici olarak customerId'yi 35 olarak ayarlıyorum
    // Gerçek uygulamada bu değer AuthContext'ten alınmalı
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
            // Burada updateCustomerProfile API'sini çağırabilirsiniz
            console.log('Güncellenecek veri:', formData);
            setIsEditing(false);
            // fetchProfile(); // Güncellenmiş veriyi yeniden yükle
        } catch (err) {
            console.error('Profile update error:', err);
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
            // Burada API çağrısı yapılacak
            
            setNewAddress('');
            setNewAddressTitle('');
            setIsAddressEditing(false);
            // fetchProfile(); // Adresleri yeniden yükle
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
            // Burada API çağrısı yapılacak
            
            setEditingAddressId(null);
            setEditingAddress('');
            setEditingAddressTitle('');
            // fetchProfile(); // Adresleri yeniden yükle
        } catch (err) {
            console.error('Address update error:', err);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        try {
            if (window.confirm('Bu adresi silmek istediğinizden emin misiniz?')) {
                console.log('Adres siliniyor:', addressId);
                // Burada API çağrısı yapılacak
                // fetchProfile(); // Adresleri yeniden yükle
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
                            {/* Menü Sistemi */}
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
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                                {/* Ad */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2.5 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-colors text-sm lg:text-base"
                                        />
                                    ) : (
                                        <p className="text-gray-900 text-sm lg:text-base">{profile?.firstName}</p>
                                    )}
                                </div>

                                {/* Soyad */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Soyad</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2.5 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-colors text-sm lg:text-base"
                                        />
                                    ) : (
                                        <p className="text-gray-900 text-sm lg:text-base">{profile?.lastName}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2.5 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-colors text-sm lg:text-base"
                                        />
                                    ) : (
                                        <p className="text-gray-900 text-sm lg:text-base">{profile?.email}</p>
                                    )}
                                </div>

                                {/* Kullanıcı Adı */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Kullanıcı Adı</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2.5 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-colors text-sm lg:text-base"
                                        />
                                    ) : (
                                        <p className="text-gray-900 text-sm lg:text-base">{profile?.username}</p>
                                    )}
                                </div>

                                {/* Telefon */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2.5 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-colors text-sm lg:text-base"
                                        />
                                    ) : (
                                        <p className="text-gray-900 text-sm lg:text-base">{profile?.phoneNumber}</p>
                                    )}
                                </div>

                                {/* Şehir */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Şehir</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2.5 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-colors text-sm lg:text-base"
                                        />
                                    ) : (
                                        <p className="text-gray-900 text-sm lg:text-base">{profile?.city}</p>
                                    )}
                                </div>
                            </div>

                            {/* Adres */}
                            <div className="mt-4 lg:mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                                {isEditing ? (
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-3 py-2.5 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-colors text-sm lg:text-base"
                                    />
                                ) : (
                                    <p className="text-gray-900 text-sm lg:text-base">{profile?.address}</p>
                                )}
                            </div>

                            {/* Kaydet Butonu */}
                            {isEditing && (
                                <div className="mt-6 flex flex-col sm:flex-row gap-3 lg:gap-4">
                                    <span
                                        onClick={handleSave}
                                        className="px-4 py-2.5 lg:px-6 lg:py-3 bg-green-600/90 backdrop-blur-sm text-white rounded-lg hover:bg-green-700/90 transition-all duration-200 font-medium cursor-pointer shadow-sm hover:shadow-md flex items-center justify-center gap-2 border border-green-200/30 text-sm lg:text-base"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Kaydet
                                    </span>
                                    <span
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2.5 lg:px-6 lg:py-3 bg-gray-500/90 backdrop-blur-sm text-white rounded-lg hover:bg-gray-600/90 transition-all duration-200 font-medium cursor-pointer shadow-sm hover:shadow-md flex items-center justify-center gap-2 border border-gray-200/30 text-sm lg:text-base"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        İptal
                                    </span>
                                </div>
                            )}
                        </div>
                        )}

                        {/* Adresler Bölümü */}
                        {activeSection === 'addresses' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-purple-200/30 p-4 lg:p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 lg:gap-4 mb-4 lg:mb-6">
                                    <h3 className="text-lg lg:text-xl font-semibold text-gray-900">Kayıtlı Adresler</h3>
                                    <span
                                        onClick={() => {
                                            console.log('🔘 Yeni Adres Ekle butonuna tıklandı!');
                                            console.log('📱 Mevcut isAddressEditing:', isAddressEditing);
                                            setIsAddressEditing(!isAddressEditing);
                                            console.log('🔄 isAddressEditing değişecek:', !isAddressEditing);
                                        }}
                                        className="text-purple-600 hover:text-purple-700 active:text-purple-800 transition-all duration-200 cursor-pointer px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-purple-50/30 hover:bg-purple-100/50 active:bg-purple-200/50 backdrop-blur-sm border border-purple-200/30 font-medium flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base touch-manipulation select-none min-h-[44px] sm:min-h-[48px] relative z-10 pointer-events-auto"
                                        style={{ WebkitTapHighlightColor: 'transparent' }}
                                    >
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        <span className="hidden sm:inline">{isAddressEditing ? 'İptal' : 'Yeni Adres Ekle'}</span>
                                        <span className="sm:hidden">{isAddressEditing ? 'İptal' : 'Ekle'}</span>
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
                                                className="px-3 py-2 sm:px-4 sm:py-2 bg-green-600/90 backdrop-blur-sm text-white rounded-lg hover:bg-green-700/90 transition-all duration-200 font-medium cursor-pointer shadow-sm hover:shadow-md flex items-center gap-1.5 sm:gap-2 border border-green-200/30 text-sm sm:text-base"
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
                                                className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-500/90 backdrop-blur-sm text-white rounded-lg hover:bg-gray-600/90 transition-all duration-200 font-medium cursor-pointer shadow-sm hover:shadow-md flex items-center gap-1.5 sm:gap-2 border border-gray-200/30 text-sm sm:text-base"
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
                                                                className="px-3 py-2 sm:px-4 sm:py-2 bg-green-600/90 backdrop-blur-sm text-white rounded-lg hover:bg-green-700/90 transition-all duration-200 font-medium cursor-pointer shadow-sm hover:shadow-md flex items-center gap-1.5 sm:gap-2 border border-green-200/30 text-sm sm:text-base"
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
                                                                className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-500/90 backdrop-blur-sm text-white rounded-lg hover:bg-gray-600/90 transition-all duration-200 font-medium cursor-pointer shadow-sm hover:shadow-md flex items-center gap-1.5 sm:gap-2 border border-gray-200/30 text-sm sm:text-base"
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
                                        <p className="text-gray-400 text-sm mt-1">"Yeni Adres Ekle" butonuna tıklayarak adres ekleyebilirsiniz.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Şifre Değişikliği Bölümü */}
                        {activeSection === 'password' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-purple-200/30 p-4 lg:p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 lg:mb-6">
                                    <h3 className="text-lg lg:text-xl font-semibold text-gray-900">Şifre Değişikliği</h3>
                                    <span
                                        onClick={() => setIsPasswordEditing(!isPasswordEditing)}
                                        className="text-purple-600 hover:text-purple-700 transition-all duration-200 cursor-pointer px-3 py-2 rounded-lg hover:bg-purple-100/50 backdrop-blur-sm border border-purple-200/30 font-medium flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                        </svg>
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
                                    
                                    <div className="flex gap-4 pt-4">
                                        <span
                                            onClick={handlePasswordSave}
                                            className="px-6 py-3 bg-green-600/90 backdrop-blur-sm text-white rounded-lg hover:bg-green-700/90 transition-all duration-200 font-medium cursor-pointer shadow-sm hover:shadow-md flex items-center gap-2 border border-green-200/30"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Şifreyi Değiştir
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
                                            className="px-6 py-3 bg-gray-500/90 backdrop-blur-sm text-white rounded-lg hover:bg-gray-600/90 transition-all duration-200 font-medium cursor-pointer shadow-sm hover:shadow-md flex items-center gap-2 border border-gray-200/30"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
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
