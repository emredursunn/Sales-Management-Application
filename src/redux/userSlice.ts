import { createSlice } from "@reduxjs/toolkit" 

const initialState = {
    
    isAuth:false,
    fullname: null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.isAuth = action.payload
        },
        setFullname: (state, action) => {
            state.fullname = action.payload
        }
    }
})

export const { setLogin, setFullname } = userSlice.actions

export default userSlice.reducer