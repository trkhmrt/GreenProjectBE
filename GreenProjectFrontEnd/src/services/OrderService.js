import axios from "../lib/axios.js";

export const getCustomerOrders = async () => {
    const response = await axios.get(`/orderservice/order/getCustomerOrders`, { 
        withCredentials: true 
    });
    return response.data;
};

export const getCustomerOrderDetails = async (orderId) => {
    const response = await axios.get(`/orderservice/order/getCustomerOrderDetails/${orderId}`, { 
        withCredentials: true 
    });
    return response.data;
}; 