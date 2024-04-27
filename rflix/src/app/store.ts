import { configureStore } from "@reduxjs/toolkit";
import authReducer, {AuthState } from "../features/auth/authSlice"
import homePageReducer, { HomePageState } from "../features/homePage/homePageSlice";
import detailedPageReducer, { DetailedPageState } from "../features/detailedPage/detailedPageSlice";

export interface RootState {
    auth: AuthState,
    homePage: HomePageState,
    detailedPage: DetailedPageState
}

export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
    reducer: {
        auth: authReducer,
        homePage: homePageReducer,
        detailedPage: detailedPageReducer
    }
})