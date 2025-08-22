import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllOrdersWithDetails, searchOrdersById, updateOrderStatus } from '../../services/OrderService';
import AdminLayout from '../../layout/AdminLayout';
import { OrderStatuses, OrderStatusList, getOrderStatusColor, getOrderStatusIcon } from '../../constants/OrderStatuses';

const AdminOrderPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [paginatedOrders, setPaginatedOrders] = useState([]);
    
    // Search state
    const [orderIdFilter, setOrderIdFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy] = useState('orderId');
    const [sortOrder, setSortOrder] = useState('desc');

    // Fetch orders
    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllOrdersWithDetails();
            setOrders(data);
            setFilteredOrders(data);
        } catch (err) {
            setError('Siparişler yüklenirken hata oluştu');
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Load URL parameters on component mount
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        
        if (searchParams.get('orderIdFilter')) setOrderIdFilter(searchParams.get('orderIdFilter'));
        if (searchParams.get('statusFilter')) setStatusFilter(searchParams.get('statusFilter'));
        if (searchParams.get('sortBy')) setSortBy(searchParams.get('sortBy'));
        if (searchParams.get('sortOrder')) setSortOrder(searchParams.get('sortOrder'));
        if (searchParams.get('currentPage')) setCurrentPage(parseInt(searchParams.get('currentPage')));
        
        // Restore scroll position
        setTimeout(() => {
            if (searchParams.get('scrollPosition')) {
                window.scrollTo(0, parseInt(searchParams.get('scrollPosition')));
            }
        }, 100);
    }, [location.search]);

    // Load orders on component mount
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Apply filters and sorting
    const applyFilters = useCallback(() => {
        let filtered = [...orders];

        // Order ID filter
        if (orderIdFilter) {
            filtered = filtered.filter(order => 
                order.orderId?.toString().includes(orderIdFilter)
            );
        }

        // Status filter
        if (statusFilter) {
            filtered = filtered.filter(order => {
                const statusObj = OrderStatusList.find(s => s.id === parseInt(statusFilter));
                return order.orderStatus?.orderStatusName === statusObj?.name;
            });
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue, bValue;

            // Handle different field types
            switch (sortBy) {
                case 'orderId':
                    aValue = a.orderId;
                    bValue = b.orderId;
                    break;
                case 'customerId':
                    aValue = a.customerId;
                    bValue = b.customerId;
                    break;
                case 'basketId':
                    aValue = a.basketId;
                    bValue = b.basketId;
                    break;
                case 'status':
                    aValue = a.orderStatus?.orderStatusName || '';
                    bValue = b.orderStatus?.orderStatusName || '';
                    break;
                default:
                    aValue = a.orderId;
                    bValue = b.orderId;
            }

            // Handle numeric sorting
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
            }

            // Handle string sorting
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortOrder === 'asc' 
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            return 0;
        });

        setFilteredOrders(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [orders, orderIdFilter, statusFilter, sortBy, sortOrder]);

    // Apply filters when dependencies change
    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    // Pagination logic
    const applyPagination = useCallback(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginated = filteredOrders.slice(startIndex, endIndex);
        setPaginatedOrders(paginated);
    }, [filteredOrders, currentPage, itemsPerPage]);

    // Apply pagination when dependencies change
    useEffect(() => {
        applyPagination();
    }, [applyPagination]);

    // Calculate total pages
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    // Handle sort change
    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    // Get status badge color using OrderStatuses
    const getStatusBadgeColor = (status) => {
        const statusObj = OrderStatusList.find(s => s.name === status);
        if (statusObj) {
            return getOrderStatusColor(statusObj.id);
        }
        return 'bg-gray-100 text-gray-800';
    };

    // Handle status change
    const handleStatusChange = async (orderId, statusId) => {
        try {
            await updateOrderStatus(orderId, statusId);
            // Refresh orders after status update
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Siparişler yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Hata</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchOrders}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Tekrar Dene
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-2xl font-bold text-gray-900">Sipariş Yönetimi</h1>
                    <p className="text-gray-600 mt-1">Tüm siparişleri görüntüleyin ve yönetin</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtreler</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Order ID Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sipariş ID</label>
                            <input
                                type="text"
                                placeholder="Sipariş ID ara..."
                                value={orderIdFilter}
                                onChange={(e) => setOrderIdFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="">Tüm Durumlar</option>
                                {OrderStatusList.map((status) => (
                                    <option key={status.id} value={status.id}>
                                        {status.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort By */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sıralama</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="orderId">Sipariş ID</option>
                                <option value="customerId">Müşteri ID</option>
                                <option value="basketId">Sepet ID</option>
                                <option value="status">Durum</option>
                            </select>
                        </div>

                        {/* Sort Order */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sıralama Yönü</label>
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="desc">Azalan</option>
                                <option value="asc">Artan</option>
                            </select>
                        </div>
                    </div>

                    {/* Clear Filters */}
                    <div className="mt-4">
                        <button
                            onClick={() => {
                                setOrderIdFilter('');
                                setStatusFilter('');
                                setSortBy('orderId');
                                setSortOrder('desc');
                            }}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Filtreleri Temizle
                        </button>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('orderId')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>Sipariş ID</span>
                                            {sortBy === 'orderId' && (
                                                <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('customerId')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>Müşteri ID</span>
                                            {sortBy === 'customerId' && (
                                                <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('basketId')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>Sepet ID</span>
                                            {sortBy === 'basketId' && (
                                                <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('status')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>Durum</span>
                                            {sortBy === 'status' && (
                                                <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        İşlemler
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedOrders.map((order) => (
                                    <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{order.orderId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {order.customerId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {order.basketId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="relative">
                                                <button
                                                    onClick={() => {
                                                        const dropdown = document.getElementById(`status-dropdown-${order.orderId}`);
                                                        dropdown.classList.toggle('hidden');
                                                    }}
                                                    className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 transition-opacity ${getStatusBadgeColor(order.orderStatus?.orderStatusName)}`}
                                                >
                                                    {(() => {
                                                        const statusObj = OrderStatusList.find(s => s.name === order.orderStatus?.orderStatusName);
                                                        if (!statusObj) return null;
                                                        
                                                        const iconName = getOrderStatusIcon(statusObj.id);
                                                        switch (iconName) {
                                                            case 'check-circle':
                                                                return (
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                );
                                                            case 'clock':
                                                                return (
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                );
                                                            case 'x-circle':
                                                                return (
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                );
                                                            case 'truck':
                                                                return (
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                                    </svg>
                                                                );
                                                            case 'check':
                                                                return (
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                );
                                                            default:
                                                                return (
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                );
                                                        }
                                                    })()}
                                                    {order.orderStatus?.orderStatusName || 'Bilinmeyen'}
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                                
                                                {/* Status Dropdown */}
                                                <div 
                                                    id={`status-dropdown-${order.orderId}`}
                                                    className="hidden absolute z-10 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg"
                                                >
                                                    <div className="py-1">
                                                        {OrderStatusList.map((status) => (
                                                            <button
                                                                key={status.id}
                                                                onClick={() => {
                                                                    handleStatusChange(order.orderId, status.id);
                                                                    document.getElementById(`status-dropdown-${order.orderId}`).classList.add('hidden');
                                                                }}
                                                                className={`block w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2 ${
                                                                    order.orderStatus?.orderStatusName === status.name ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                                                                }`}
                                                            >
                                                                {(() => {
                                                                    const iconName = getOrderStatusIcon(status.id);
                                                                    switch (iconName) {
                                                                        case 'check-circle':
                                                                            return (
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                </svg>
                                                                            );
                                                                        case 'clock':
                                                                            return (
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                </svg>
                                                                            );
                                                                        case 'x-circle':
                                                                            return (
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                                                </svg>
                                                                            );
                                                                        case 'truck':
                                                                            return (
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                                                </svg>
                                                                            );
                                                                        case 'check':
                                                                            return (
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                                                </svg>
                                                                            );
                                                                        default:
                                                                            return (
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                </svg>
                                                                            );
                                                                    }
                                                                })()}
                                                                {status.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => {
                                                    const params = new URLSearchParams();
                                                    if (orderIdFilter) params.set('orderIdFilter', orderIdFilter);
                                                    if (statusFilter) params.set('statusFilter', statusFilter);
                                                    if (sortBy) params.set('sortBy', sortBy);
                                                    if (sortOrder) params.set('sortOrder', sortOrder);
                                                    params.set('currentPage', currentPage);
                                                    params.set('scrollPosition', window.pageYOffset);
                                                    
                                                    const queryString = params.toString();
                                                    navigate(`/admin/orders/${order.orderId}${queryString ? `?${queryString}` : ''}`);
                                                }}
                                                className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                Detay
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                                >
                                    Önceki
                                </button>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                                >
                                    Sonraki
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                                        {' '}-{' '}
                                        <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</span>
                                        {' '}arası, toplam{' '}
                                        <span className="font-medium">{filteredOrders.length}</span>
                                        {' '}sipariş gösteriliyor
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                                        >
                                            <span className="sr-only">Önceki</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        
                                        {/* Page numbers */}
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
                                            if (
                                                pageNumber === 1 ||
                                                pageNumber === totalPages ||
                                                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                            ) {
                                                return (
                                                    <button
                                                        key={pageNumber}
                                                        onClick={() => setCurrentPage(pageNumber)}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                            pageNumber === currentPage
                                                                ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {pageNumber}
                                                    </button>
                                                );
                                            } else if (
                                                pageNumber === currentPage - 2 ||
                                                pageNumber === currentPage + 2
                                            ) {
                                                return (
                                                    <span
                                                        key={pageNumber}
                                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                                                    >
                                                        ...
                                                    </span>
                                                );
                                            }
                                            return null;
                                        })}
                                        
                                        <button
                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                                        >
                                            <span className="sr-only">Sonraki</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminOrderPage;
