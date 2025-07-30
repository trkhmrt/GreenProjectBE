import axios from "../lib/axios.js";

export const getAllProperties = async () => {
    return await axios.get("/productservice/property/getAllProperties");
}; 