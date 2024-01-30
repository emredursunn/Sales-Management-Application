import { configureStore } from "@reduxjs/toolkit"
import userReducer from './userSlice'
import orderReducer from "./orderSlice"
import customerSlice from "./customerSlice";
import stockSlice from "./stockSlice";


export const store = configureStore({
    reducer:{
        user: userReducer,
        orders: orderReducer,
        customers: customerSlice,
        stock: stockSlice
    }
}
)

export type RootState = ReturnType<typeof store.getState>;
