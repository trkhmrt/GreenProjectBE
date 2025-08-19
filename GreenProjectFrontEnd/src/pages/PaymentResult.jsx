import React from 'react';
import { useLocation } from 'react-router-dom';
import PaymentSuccess from './PaymentSuccess';
import PaymentFailure from './PaymentFailure';

const PaymentResult = () => {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const status = params.get("status");
    const isSuccess = status === 'success';

    return isSuccess ? <PaymentSuccess /> : <PaymentFailure />;
};

export default PaymentResult;