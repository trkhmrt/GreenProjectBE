import axios from "../lib/axios.js";

const API_BASE_URL = 'http://localhost:8072/ael/orderservice';

// Tüm siparişleri detaylarıyla getir
export const getAllOrdersWithDetails = async () => {
    try {
        const response = await axios.get(`/orderservice/order/getAllOrders`);
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

// Sipariş ID'sine göre arama
export const searchOrdersById = async (orderId) => {
    try {
        const response = await axios.get(`/orderservice/order/search/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error searching orders:', error);
        throw error;
    }
};

// Sipariş durumunu güncelle
export const updateOrderStatus = async (orderId, statusId) => {
    try {
        const requestBody = {
            orderId: orderId,
            statusId: statusId
        };
        
        const response = await axios.put(`/orderservice/order/updateOrderStatus`, requestBody);
        return response.data;
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
};

// Sipariş detayını getir
export const getOrderById = async (orderId) => {
    try {
        const response = await axios.get(`/orderservice/order/getOrderDetails/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching order details:', error);
        throw error;
    }
};

// Müşteri siparişlerini getir (Orders.jsx için)
export const getCustomerOrders = async () => {
    try {
        const response = await axios.get(`/orderservice/order/getCustomerOrders`, {
            withCredentials: true 
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching customer orders:', error);
        throw error;
    }
};

// Müşteri sipariş detayını getir (Orders.jsx için)
export const getCustomerOrderDetails = async (orderId) => {
    try {
        const response = await axios.get(`/orderservice/order/getCustomerOrderDetails/${orderId}`, {
            withCredentials: true 
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching customer order details:', error);
        throw error;
    }
}; 