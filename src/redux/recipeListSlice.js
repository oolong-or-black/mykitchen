import { createSlice } from "@reduxjs/toolkit"

const recipeSearchSlice = createSlice({
    name: 'recipeSearch',
    initialState:{
        recipeSearch: [],
        searchName:null
    },
    reducers:{
        getRecipeSearch: (state, action)=>{
            state.recipeSearch= action.payload
        },
        getSearchName:(state,action)=>{
            state.searchName = action.payload
        }
    }
})

export default recipeSearchSlice.reducer

const { getRecipeSearch, getSearchName } = recipeSearchSlice.actions
export { getRecipeSearch, getSearchName }