import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getOrderById, updateOrderStatus } from '../../services/OrderService';
import AdminLayout from '../../layout/AdminLayout';
import { OrderStatuses, OrderStatusList, getOrderStatusColor, getOrderStatusIcon } from '../../constants/OrderStatuses';

const AdminOrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getOrderById(orderId);
                setOrder(data);
            } catch (err) {
                setError('Sipariş detayları yüklenirken hata oluştu');
                console.error('Error fetching order details:', err);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    const handleBack = () => {
        // Restore filter states and scroll position from URL parameters
        const searchParams = new URLSearchParams(location.search);
        const params = new URLSearchParams();
        
        // Copy all existing parameters
        for (const [key, value] of searchParams.entries()) {
            params.set(key, value);
        }
        
        const queryString = params.toString();
        navigate(`/admin/orders${queryString ? `?${queryString}` : ''}`);
    };

    const handleStatusChange = async (statusId) => {
        try {
            await updateOrderStatus(orderId, statusId);
            // Refresh order details
            const updatedOrder = await getOrderById(orderId);
            setOrder(updatedOrder);
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const getStatusBadgeColor = (status) => {
        const statusObj = OrderStatusList.find(s => s.name === status);
        if (statusObj) {
            return getOrderStatusColor(statusObj.id);
        }
        return 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Sipariş detayları yükleniyor...</p>
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
                        onClick={handleBack}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Geri Dön
                    </button>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Sipariş Bulunamadı</h3>
                    <p className="text-gray-600 mb-4">Belirtilen ID'ye sahip sipariş bulunamadı.</p>
                    <button
                        onClick={handleBack}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Geri Dön
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
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Sipariş Detayı</h1>
                            <p className="text-gray-600 mt-1">Sipariş #{order.orderId} detayları</p>
                        </div>
                        <button
                            onClick={handleBack}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Geri Dön
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Order Information */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Bilgileri</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Sipariş ID</h3>
                            <p className="text-lg font-semibold text-gray-900">#{order.orderId}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Müşteri ID</h3>
                            <p className="text-lg font-semibold text-gray-900">{order.customerId}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Sepet ID</h3>
                            <p className="text-lg font-semibold text-gray-900">{order.basketId}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Durum</h3>
                            <div className="flex items-center space-x-3">
                                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeColor(order.orderStatus?.orderStatusName)}`}>
                                    {order.orderStatus?.orderStatusName || 'Bilinmeyen'}
                                </span>
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            const dropdown = document.getElementById('status-dropdown');
                                            dropdown.classList.toggle('hidden');
                                        }}
                                        className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                                    >
                                        Değiştir
                                    </button>
                                    <div 
                                        id="status-dropdown"
                                        className="hidden absolute z-10 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg"
                                    >
                                        <div className="py-1">
                                            {OrderStatusList.map((status) => (
                                                <button
                                                    key={status.id}
                                                    onClick={() => {
                                                        handleStatusChange(status.id);
                                                        document.getElementById('status-dropdown').classList.add('hidden');
                                                    }}
                                                    className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
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
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address Information (if not "ADRES YOK") */}
                {order.orderAddress && order.orderAddress !== "ADRES YOK" && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Adres Bilgileri</h2>
                        <p className="text-gray-700">{order.orderAddress}</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminOrderDetail;
