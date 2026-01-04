import { useState } from "react";

interface responseData {
    success: boolean;
    data: any;
}



const fetchCategories = async (): Promise<responseData> => { 
    



    try {
        const response = await fetch('http://127.0.0.1:8000/api/categories');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: responseData = await response.json();                      
    
        console.log('Fetched categories:', data.data);
        return data;    

    } catch (error) {
        console.error('Error fetching categories:', error);
        return { success: false, data: null };
    }



}

export { fetchCategories };
