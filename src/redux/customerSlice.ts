import { createSlice } from '@reduxjs/toolkit'
import customers from '../utils/customers.json'
import { Customer } from '../types/types'

const initialState = {
    customerList: customers
}

const customerSlice = createSlice({
    name: 'customers',
    initialState,
    reducers:{
        getCustomers: (state) => {return state},

        addCustomer: (state, action) => {
            state.customerList.push(action.payload)
        },

        deleteCustomer: (state, action) => {
            const index = state.customerList.findIndex((c:Customer) => c.customerId === action.payload )
            if(index !== -1){
                state.customerList.splice(index,1)
            }
        }
    }
})

export const {getCustomers, addCustomer, deleteCustomer} = customerSlice.actions

export default customerSlice.reducer
