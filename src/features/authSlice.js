import {createSlice } from '@reduxjs/toolkit'

const initialState = {
    status : false,
    userData : null,
    profileImage: null,
    tweetImage: null,
    tweetContent: null,
}


export const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers : {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData || action.payload;
        },

        logout : (state) =>{
            state.status = false;
            state.userData = null;

        },
        setProfileImage: (state, action) => {
           state.profileImage = action.payload;
        },

        setTweetImage: (state, action) => {
            state.tweetImage = action.payload;
        },

        setTweetContent: (state, action) => {
            state.tweetContent = action.payload;
        },

    }

});



export const {login, logout,setProfileImage ,setTweetImage, setTweetContent} = authSlice.actions;

export default authSlice.reducer;