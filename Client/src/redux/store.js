import { combineReducers, configureStore } from '@reduxjs/toolkit'
import  userReducer  from './user/userSlice.js';
import { persistReducer, persistStore } from "redux-persist";
import storage from 'redux-persist/lib/storage';
//import persistStore from 'redux-persist/es/persistStore';

const rootReducer = combineReducers({user: userReducer})

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
}


const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
  getDefaultMiddleware({
    serializableCheck: false
  }),
});

export const persistor = persistStore(store);

//persistor, persistGate, persistReducer all are used for redux persist and redux persist is used for storing the data in local storage so that when we refresh the page the data is not lost.