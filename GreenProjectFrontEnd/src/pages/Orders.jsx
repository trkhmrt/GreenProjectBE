import React, { useState, useEffect } from 'react';
import { getCustomerOrders } from '../services/OrderService';
import { useToast } from '../context/ToastContext';

const OrderList = () => {
    const { showToast } = useToast();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [sortBy, setSortBy] = useState('orderId');
    const [sortOrder, setSortOrder] = useState('desc');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // API'den siparişleri çek
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const ordersData = await getCustomerOrders();
                console.log('API Orders:', ordersData);
                setOrders(ordersData);
                setFilteredOrders(ordersData);
            } catch (error) {
                console.error('Siparişler yüklenirken hata:', error);
                showToast('Siparişler yüklenirken bir hata oluştu', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [showToast]);

    // Search and filter functionality
    useEffect(() => {
        let filtered = orders;

        // Search by order ID
        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.orderId.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by status
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(order => order.orderStatus.orderStatusName === selectedStatus);
        }

        // Sort orders
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case 'orderId':
                    aValue = a.orderId;
                    bValue = b.orderId;
                    break;
                case 'basketId':
                    aValue = a.basketId;
                    bValue = b.basketId;
                    break;
                case 'customerId':
                    aValue = a.customerId;
                    bValue = b.customerId;
                    break;
                default:
                    aValue = a[sortBy];
                    bValue = b[sortBy];
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredOrders(filtered);
        setCurrentPage(1); // Reset to first page when filtering
    }, [orders, searchTerm, selectedStatus, sortBy, sortOrder]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentOrders = filteredOrders.slice(startIndex, endIndex);

    // Pagination functions
    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const goToPreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Aktif':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'İşleniyor':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Kargoda':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Beklemede':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Tamamlandı':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'Aktif':
                return 'Aktif';
            case 'İşleniyor':
                return 'İşleniyor';
            case 'Kargoda':
                return 'Kargoda';
            case 'Beklemede':
                return 'Beklemede';
            case 'Tamamlandı':
                return 'Tamamlandı';
            default:
                return status;
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        }).format(amount);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Siparişler yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Siparişlerim</h1>
                            <p className="text-gray-600">Tüm siparişlerinizi görüntüleyin ve yönetin</p>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Sipariş ID ile ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                            />
                        </div>

                        {/* Status Filter */}
                        <div>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                            >
                                <option value="all">Tüm Durumlar</option>
                                <option value="Aktif">Aktif</option>
                                <option value="Beklemede">Beklemede</option>
                                <option value="İşleniyor">İşleniyor</option>
                                <option value="Kargoda">Kargoda</option>
                                <option value="Tamamlandı">Tamamlandı</option>
                            </select>
                        </div>

                        {/* Sort By */}
                        <div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                            >
                                <option value="orderId">Sipariş ID'ye Göre</option>
                                <option value="basketId">Sepet ID'ye Göre</option>
                                <option value="customerId">Müşteri ID'ye Göre</option>
                            </select>
                        </div>

                        {/* Sort Order */}
                        <div>
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                            >
                                <option value="desc">Azalan</option>
                                <option value="asc">Artan</option>
                            </select>
                        </div>

                        {/* Items Per Page */}
                        <div>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                            >
                                <option value={5}>5 / Sayfa</option>
                                <option value={10}>10 / Sayfa</option>
                                <option value={20}>20 / Sayfa</option>
                                <option value={50}>50 / Sayfa</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Summary */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-600">
                            <span className="font-semibold text-gray-900">{filteredOrders.length}</span> sipariş bulundu
                            {filteredOrders.length > 0 && (
                                <span className="ml-2">
                                    (Sayfa {currentPage} / {totalPages})
                                </span>
                            )}
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors duration-200"
                            >
                                Aramayı Temizle
                            </button>
                        )}
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sipariş ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Müşteri ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sepet ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Adres
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Durum
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    İşlemler
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {currentOrders.map((order) => (
                                <tr key={order.orderId} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">#{order.orderId}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{order.customerId}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{order.basketId}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 max-w-xs truncate">
                                            {order.orderAddress || 'Adres bilgisi yok'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus.orderStatusName)}`}>
                                                {getStatusText(order.orderStatus.orderStatusName)}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button className="text-green-600 hover:text-green-900 transition-colors duration-200">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            <button className="text-blue-600 hover:text-blue-900 transition-colors duration-200">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button className="text-red-600 hover:text-red-900 transition-colors duration-200">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {filteredOrders.length === 0 && (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Sipariş bulunamadı</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchTerm ? 'Arama kriterlerinize uygun sipariş bulunamadı.' : 'Henüz siparişiniz bulunmuyor.'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {filteredOrders.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8 border border-gray-100">
                        <div className="flex items-center justify-between">
                            {/* Page Info */}
                            <div className="text-sm text-gray-700">
                                <span className="font-medium">
                                    {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)}
                                </span>
                                {' '}arası, toplam{' '}
                                <span className="font-medium">{filteredOrders.length}</span>
                                {' '}sipariş
                            </div>

                            {/* Pagination Controls */}
                            <div className="flex items-center space-x-2">
                                {/* Previous Button */}
                                <button
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Önceki
                                </button>

                                {/* Page Numbers */}
                                <div className="flex items-center space-x-1">
                                    {/* First Page */}
                                    {currentPage > 3 && (
                                        <>
                                            <button
                                                onClick={() => goToPage(1)}
                                                className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                1
                                            </button>
                                            {currentPage > 4 && (
                                                <span className="px-2 text-gray-500">...</span>
                                            )}
                                        </>
                                    )}

                                    {/* Page Numbers */}
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => goToPage(pageNum)}
                                                className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                                    currentPage === pageNum
                                                        ? 'bg-green-600 text-white border border-green-600'
                                                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}

                                    {/* Last Page */}
                                    {currentPage < totalPages - 2 && (
                                        <>
                                            {currentPage < totalPages - 3 && (
                                                <span className="px-2 text-gray-500">...</span>
                                            )}
                                            <button
                                                onClick={() => goToPage(totalPages)}
                                                className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                {totalPages}
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Next Button */}
                                <button
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    Sonraki
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderList;