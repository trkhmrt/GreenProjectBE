import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    getCustomerProfile, 
    updateCustomerProfile, 
    updateCustomerEmail, 
    updateCustomerPhone,
    addCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress
} from '../services/CustomerService';

const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeMenu, setActiveMenu] = useState('personal');
    const [editingField, setEditingField] = useState(null);
    const [editData, setEditData] = useState({});
    const [addresses, setAddresses] = useState([]);
    const [expandedAddresses, setExpandedAddresses] = useState(new Set());
    const [isPasswordEditing, setIsPasswordEditing] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const response = await getCustomerProfile();
            setProfile(response);
            setAddresses(response.addresses || []);
            setLoading(false);
        } catch (error) {
            console.error('Error loading profile:', error);
            setLoading(false);
        }
    };

    const handleFieldEdit = (field, value) => {
        setEditingField(field);
        setEditData({ [field]: value });
    };

    const handleFieldSave = async (field) => {
        try {
            let response;
            if (field === 'email') {
                response = await updateCustomerEmail(editData[field]);
            } else if (field === 'phone') {
                response = await updateCustomerPhone(editData[field]);
            } else {
                response = await updateCustomerProfile({ [field]: editData[field] });
            }
            
            if (response) {
                setProfile(prev => ({ ...prev, [field]: editData[field] }));
                setEditingField(null);
                setEditData({});
            }
        } catch (error) {
            console.error('Error updating field:', error);
        }
    };

    const handleFieldCancel = () => {
        setEditingField(null);
        setEditData({});
    };

    const handlePasswordChange = (e) => {
        setPasswordData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handlePasswordSave = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Yeni şifreler eşleşmiyor!');
            return;
        }
        
        try {
            // Password update logic here
            setIsPasswordEditing(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.error('Error updating password:', error);
        }
    };

    const toggleAddressExpansion = (addressId) => {
        setExpandedAddresses(prev => {
            const newSet = new Set(prev);
            if (newSet.has(addressId)) {
                newSet.delete(addressId);
            } else {
                newSet.add(addressId);
            }
            return newSet;
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="flex flex-col lg:flex-row">
                        {/* Left Sidebar */}
                        <div className="lg:w-64 border-b lg:border-b-0 lg:border-r border-gray-200">
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Profil</h2>
                                <nav className="space-y-2">
                                    {[
                                        { id: 'personal', label: 'Kişisel Bilgiler', icon: '👤' },
                                        { id: 'addresses', label: 'Adreslerim', icon: '📍' },
                                        { id: 'password', label: 'Şifre Değiştir', icon: '🔒' }
                                    ].map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveMenu(item.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ease-out ${
                                                activeMenu === item.id
                                                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="text-lg">{item.icon}</span>
                                            <span className="font-medium">{item.label}</span>
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Right Content */}
                        <div className="flex-1 p-6">
                            {/* Personal Information */}
                            {activeMenu === 'personal' && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Kişisel Bilgiler</h3>
                                    <div className="space-y-6">
                                        {/* Name */}
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                                                <p className="text-gray-900">{profile?.customerName || 'Belirtilmemiş'}</p>
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                                                {editingField === 'email' ? (
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="email"
                                                            value={editData.email || ''}
                                                            onChange={(e) => setEditData({ email: e.target.value })}
                                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                        />
                                                        <button
                                                            onClick={() => handleFieldSave('email')}
                                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                                        >
                                                            Kaydet
                                                        </button>
                                                        <button
                                                            onClick={handleFieldCancel}
                                                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                                        >
                                                            İptal
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-gray-900">{profile?.customerEmail || 'Belirtilmemiş'}</p>
                                                        <button
                                                            onClick={() => handleFieldEdit('email', profile?.customerEmail)}
                                                            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                                                        >
                                                            Düzenle
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                                                {editingField === 'phone' ? (
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="tel"
                                                            value={editData.phone || ''}
                                                            onChange={(e) => setEditData({ phone: e.target.value })}
                                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                        />
                                                        <button
                                                            onClick={() => handleFieldSave('phone')}
                                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                                        >
                                                            Kaydet
                                                        </button>
                                                        <button
                                                            onClick={handleFieldCancel}
                                                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                                        >
                                                            İptal
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-gray-900">{profile?.customerPhone || 'Belirtilmemiş'}</p>
                                                        <button
                                                            onClick={() => handleFieldEdit('phone', profile?.customerPhone)}
                                                            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                                                        >
                                                            Düzenle
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Addresses */}
                            {activeMenu === 'addresses' && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Adreslerim</h3>
                                    <div className="space-y-4">
                                        {addresses.length === 0 ? (
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
                                        ) : (
                                            addresses.map(address => (
                                                <div key={address.addressId} className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-gray-900 mb-1">{address.addressTitle}</h4>
                                                            <p className="text-gray-600 text-sm">{address.addressText}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => toggleAddressExpansion(address.addressId)}
                                                            className="text-purple-600 hover:text-purple-700"
                                                        >
                                                            {expandedAddresses.has(address.addressId) ? 'Gizle' : 'Düzenle'}
                                                        </button>
                                                    </div>
                                                    
                                                    {expandedAddresses.has(address.addressId) && (
                                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Adres Başlığı"
                                                                    defaultValue={address.addressTitle}
                                                                    className="px-3 py-2 border border-gray-300 rounded-lg"
                                                                />
                                                                <textarea
                                                                    placeholder="Adres"
                                                                    defaultValue={address.addressText}
                                                                    rows="3"
                                                                    className="px-3 py-2 border border-gray-300 rounded-lg md:col-span-2"
                                                                />
                                                            </div>
                                                            <div className="flex gap-2 mt-4">
                                                                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                                                    Kaydet
                                                                </button>
                                                                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                                                    Sil
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Password Change */}
                            {activeMenu === 'password' && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Şifre Değiştir</h3>
                                    <div className="max-w-md">
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
                                                    <button
                                                        onClick={handlePasswordSave}
                                                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                                    >
                                                        Şifreyi Değiştir
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setIsPasswordEditing(false);
                                                            setPasswordData({
                                                                currentPassword: '',
                                                                newPassword: '',
                                                                confirmPassword: ''
                                                            });
                                                        }}
                                                        className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                                                    >
                                                        İptal
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="text-gray-500 text-sm mb-4">Şifrenizi değiştirmek için "Şifre Değiştir" butonuna tıklayın.</p>
                                                <button
                                                    onClick={() => setIsPasswordEditing(true)}
                                                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                                                >
                                                    Şifre Değiştir
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;


