import {configureStore} from '@reduxjs/toolkit'
import { UserThunk } from './Redux/Slices/Userslice';
// to takes a proprty as reducers we need to add slices here so that the state can be acessed by globally

export const store=configureStore({
    reducer:{
        userslice:UserThunk,
    }
})