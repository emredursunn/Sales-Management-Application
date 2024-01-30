import { createSlice } from '@reduxjs/toolkit'
import stock from '../utils/stock.json'
 
const initialState = {
     stockList: stock
}

const stockSlice = createSlice({
    name:'stock',
    initialState,
    reducers:{

        editStock: (state,action) => {
            const productId = action.payload.productId
            state.stockList = state.stockList.map((p) =>
                p.productId === productId ? { ...p, productQuantity: action.payload.productQuantity } : p);
        },
        decreaseStock: (state, action) => {
            const productId = action.payload.productId;
            const decreaseAmount = action.payload.productQuantity;
        
            state.stockList = state.stockList.map((p) => {
                if (p.productId === productId) {
                    const newQuantity = p.productQuantity - decreaseAmount;
                    return { ...p, productQuantity: newQuantity };
                }
                return p;
            });
        },
    }
})

export const { editStock, decreaseStock } = stockSlice.actions
export default stockSlice.reducer
