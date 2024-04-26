import { configureStore } from "@reduxjs/toolkit";
import authReducer, {AuthState } from "../features/auth/authSlice"
import homePageReducer, { HomePageState } from "../features/homePage/homePageSlice";

export interface RootState {
    auth: AuthState,
    homePage: HomePageState
}

export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
    reducer: {
        auth: authReducer,
        homePage: homePageReducer
    }
})