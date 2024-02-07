import { createSlice } from "@reduxjs/toolkit"

const modalSwitchSlice = createSlice({
    name: 'modalSwitch',
    initialState:{
        isUserModalOpen: false
    },
    reducers:{
        showModal: (state, action)=>{
            state.isUserModalOpen= true
        },
        closeModal: (state,action)=>{
            state.isUserModalOpen=false
        }
    }
})

export default modalSwitchSlice.reducer

const { showModal, closeModal } = modalSwitchSlice.actions
export { showModal, closeModal }
