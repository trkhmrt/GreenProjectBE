import axios from "../lib/axios.js";

//const gatewayServiceUrl = "http://localhost:8072/ael/authservice"


export const authLogin = async (data) => {
        const response = await axios.post(`/authservice/auth/login`, data);
        console.log(response)
        console.log("Giriş başarılı, token:", response.data.accessToken);
        return response;
};



export const authRegister = async (data) => {
        const response = await axios.post(`/authservice/auth/register`, data,{ withCredentials: true });
        console.log(response)
        return response;
};


export const authLogout = () =>{

}