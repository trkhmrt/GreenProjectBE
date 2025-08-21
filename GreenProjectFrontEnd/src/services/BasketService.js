import axios from "../lib/axios.js";
//const serviceUrl = "http://localhost:8040/basket"
const gatewayServiceUrl = "http://localhost:8072/ael/basketservice/basket"




export const getBasketCustomerById = async() => {
    const response = await axios.get(
        {
        withCredentials: true,
    });
    console.log(response);
    console.log(response.data.basketId);
    return response.data;
}



export const removeProductFromBasket = async(basketProductUnitId) => {

    const response = await axios.get(`/basketservice/basket/removeProductFromBasket/${basketProductUnitId}`,{
        withCredentials: true, // <-- BU SATIR ÇOK ÖNEMLİ!
    });

    return response.data;
}

export const addProductToBasket = async(productId) => {

    const response = await axios.get(`/basketservice/basket/addProductToCustomerBasket/${productId}`,{
        withCredentials: true,
    });
    //console.log(response.data);
    return response.data;
}


export const decrementProductFromBasket = async(basketProductUnitId) => {
    return await axios.put(`/basketservice/basket/decrementProductQuantity/${basketProductUnitId}`,{},{
        withCredentials: true// <-- BU SATIR ÇOK ÖNEMLİ!
    });
}

export const incrementProductFromBasket = async(basketProductUnitId) => {
    return await axios.put(`/basketservice/basket/incrementProductQuantity/${basketProductUnitId}`,{},{
        withCredentials: true // <-- BU SATIR ÇOK ÖNEMLİ!
    });
}

