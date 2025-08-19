import axios from "../lib/axios.js";

//const serviceUrl = "http://localhost:8086/payment"
const gatewayServiceUrl = "http://localhost:8072/ael/paymentservice"

export const createPayment = async (paymentRequest) => {
    const payment = await axios.post(`/paymentservice/payment/createPayment`, paymentRequest);
    return payment;
}




export const getActiveCoupons = async (userId) => {
    // Bu endpoint'in doğru olduğundan emin ol
    try{
        const response = await axios.get(`/paymentservice/coupon/getCoupon/${userId}`);
        return response.data;
    }
    catch(e){
        console.log(e);
    }

};

export const threedsPaymentInitialize = async (paymentRequest) => {
    const response = await axios.post(
        `${gatewayServiceUrl}/payment/ThreedsPaymentInitialize`,
        paymentRequest
    );
    return response;
};

export const createThreedsPayment = async (paymentRequest) => {
  return await axios.post('/paymentservice/payment/3ds/Initialize', paymentRequest, { withCredentials: true });
};

export const  getInstallmentOptions=async (binNumber, price)=> {
  const response = await axios.post(
    '/paymentservice/payment/installment',
    {
      price: price.toString(),
      binNumber: binNumber,
    }
  );
  return response.data;
}