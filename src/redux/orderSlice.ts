import { Order } from '../types/types';
import orders from '../utils/orders.json';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    orderList: orders,
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        addOrder: (state, action) => {
            // Yeni bir sipariş eklemek için
            state.orderList.push(action.payload);
        },
        deleteOrder: (state,action) => {
            //Sipariş silmek için
            const index = state.orderList.findIndex((order:Order) => order.orderId === action.payload)
            if(index !== -1){
                state.orderList.splice(index,1)
            }
        },
        getOrders: (state) => {
            // Mevcut siparişleri getirmek için
            return state;
        },
    },
});

export const { addOrder, deleteOrder, getOrders } = orderSlice.actions;
export default orderSlice.reducer;