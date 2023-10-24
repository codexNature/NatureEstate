import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signinStart: (state) => {
      state.loading = true;
    }, // This will set the loading state to true.
    
    signinSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    }, // This will update the currentUser state with the new user data

    signinFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }, // This will update the error state with the error message

    updateUserStart: (state, action) => {
      state.loading = true;
    }, // This will set the loading state to true.
    
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    }, // This will update the currentUser state with the new user data
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }, // This will update the error state with the error message
    deleteUserStart: (state, action) => {
      state.loading = true;// This will set the loading state to true.
    },
    deleteUserSuccess: (state, action) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    }, // This will update the currentUser state with the new user data
    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }, // This will update the error state with the error message
    signOutStart: (state, action) => {
      state.loading = true;
    }, // This will set the loading state to true.
    signOutSuccess: (state, action) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    }, // This will update the currentUser state with the new user data
    signOutFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }, // This will update the error state with the error message
  },
});
  

  export const { 
    signinStart, 
    signinSuccess, 
    signinFailure, 
    updateUserStart, 
    updateUserSuccess, 
    updateUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOutStart,
    signOutSuccess,
    signOutFailure, 
  } = userSlice.actions;

  export default userSlice.reducer;