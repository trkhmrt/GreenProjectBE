import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../layout/AdminLayout';

const AdminOffice = () => {
    return (
        <>
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Paneli</h1>
                    <p className="text-gray-600 mt-1">Mağazanızı yönetmek için aşağıdaki seçeneklerden birini kullanın</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Product Management */}
                    <Link
                        to="/adminproduct"
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Ürün Yönetimi</h3>
                                <p className="text-gray-600 text-sm">Ürünleri ekleyin, düzenleyin ve yönetin</p>
                            </div>
                        </div>
                    </Link>

                    {/* Order Management */}
                    <Link
                        to="/admin/orders"
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Sipariş Yönetimi</h3>
                                <p className="text-gray-600 text-sm">Siparişleri görüntüleyin ve yönetin</p>
                            </div>
                        </div>
                    </Link>

                    {/* Category Management */}
                    <Link
                        to="/admincategory"
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Kategori Yönetimi</h3>
                                <p className="text-gray-600 text-sm">Kategorileri düzenleyin ve yönetin</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default AdminOffice;