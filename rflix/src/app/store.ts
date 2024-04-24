import { configureStore } from "@reduxjs/toolkit";
import authReducer, {AuthState } from "../features/auth/authSlice"

export interface RootState {
    auth: AuthState
}

export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
    reducer: {
        auth: authReducer,
    }
})