import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import modalSwitch from './modalSwitchSlice'
import logOnStatus from './logOnStatusSlice'
import recipeSearch from './recipeListSlice'

const reducer = combineReducers({
    modalSwitch, // slice文件里的 'name'
    logOnStatus,
    recipeSearch
})

const store = configureStore({reducer})

export default store