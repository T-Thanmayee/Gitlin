import { createSlice, isPending} from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
const url= 'http://localhost:5000/api/v1/user/login';
export const userThunk=createAsyncThunk('userThunk',async(userCredObj,thunkApi)=>{
    try{
        if(userCredObj!=null)
            { 
                   if(1){    
                const res=await axios.post(`${url}/login`,userCredObj, {
                    headers: {
                      'Content-Type': 'application/json',
                      
                    }})
                  
                  if(res.data.message==='login successful'){
                  
                sessionStorage.setItem('Token', res.data.Token);
                const userData = JSON.stringify(res.data.data);
              
                localStorage.setItem('currentUser', userData);
                localStorage.setItem('loginStatus', 'true');
            }
            else{
                return thunkApi.rejectWithValue(res.data.message)
              }
              return res.data.data
               
                  }

                
            }
          
    }
    catch(err){
        return thunkApi.rejectWithValue(err)
    }
})



export const Userslice=createSlice(
    {
        name:"userSlice",
        initialState:{
            isPending:false,
            currentUser: JSON.parse(localStorage.getItem('currentUser')) || {},
    loginStatus: localStorage.getItem('loginStatus') === 'true',
            errorOccured:false,
            errorMessage:{},
        },
        reducers:{
            resetState:(state,action)=>{
                state.currentUser={}
                state.isPending=false
                state.loginStatus=false
                state.errorMessage={}
                state.errorOccured=false
                localStorage.removeItem('currentUser');
            localStorage.removeItem('loginStatus');
            sessionStorage.removeItem('Token');
            }
            
        },
        extraReducers:(builder)=>{
            builder
            .addCase(userThunk.pending,(state,action)=>{
                state.isPending=true
            })
            .addCase(userThunk.fulfilled,(state,action)=>{
                
                state.isPending=false
                state.errorOccured=false
                state.loginStatus=true
                state.errorMessage=""
                state.currentUser=action.payload

            })
            .addCase(userThunk.rejected,(state,action)=>{
                state.isPending=false
                state.errorOccured=true
                state.loginStatus=false
                state.errorMessage=action.payload
                state.currentUser=""
            })
        }

       
    }
)
export const {resetState}=Userslice.actions

export default Userslice.reducer