import { createSlice } from "@reduxjs/toolkit";

const logOnStatusSlice = createSlice({
    name: 'logOnStatus',
    initialState: {
        loggedUser: JSON.parse(localStorage.getItem('token')),
        isAvatarUpdated:false
    },
    reducers:{
        userLogOn: (state, action) =>{
            state.loggedUser = JSON.parse(localStorage.getItem('token'))
        },
        userLogOff: (state, action)=>{
            state.loggedUser = null
        },
        avatarUrlUpdate:(state,action)=>{
            state.isAvatarUpdated = ! state.isAvatarUpdated
        }
    }
})

export default logOnStatusSlice.reducer

const { userLogOn, userLogOff, avatarUrlUpdate } = logOnStatusSlice.actions
export { userLogOn, userLogOff, avatarUrlUpdate }