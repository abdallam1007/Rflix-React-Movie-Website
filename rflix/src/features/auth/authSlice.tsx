import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {RootState} from '../../app/store'
import axios, { AxiosError } from "axios";

export enum AuthStatus {
    Idle,
    PendingRequestToken,
    PendingApproval,
    Approved,
    PendingSessionId,
    LoggedIn
}

export interface AuthState {
    accessTokenAuth: string
    requestToken: string,
    sessionId: string,
    status: AuthStatus,
    error: string
}

interface RequestTokenResponse {
    success: boolean;
    expires_at: string;
    request_token: string;
}

interface SessionIdResponse {
    session_id: string;
    success: boolean
}

// Todo: either put them in the store or in an env file
const REQUEST_TOKEN_URL = 'https://api.themoviedb.org/3/authentication/token/new'
export const REQUEST_TOKEN_APPROVAL_URL = 'https://www.themoviedb.org/authenticate'
export const REQUEST_TOKEN_APPROVED_URL = 'http://localhost:3000/login/allow'
const SESSION_ID_URL = 'https://api.themoviedb.org/3/authentication/session/new'

const initialState = {
    // Todo: Need to move this value to an outside and treat it like a secret
    accessTokenAuth: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMzYwYTkxNGFjMDAzNWMwOWZlNjYwYjdmOWI3MTk5NyIsInN1YiI6IjY2MjYzZjQyYjI2ODFmMDFhOTc0Y2E5OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RIB0yJl1jNkIsUtaWpXGFMMLYnV6pkRBVwCGRGStrHk',
    requestToken: '',
    sessionId: '',
    status: AuthStatus.Idle,
    error: ''
}

export const fetchRequestToken = createAsyncThunk('auth/fetchRequestToken', async (accessTokenAuth: string) => {
    try {
        const response = await axios.get(REQUEST_TOKEN_URL, {
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${accessTokenAuth}`
            }
        })
        return response.data
    } catch (error) {
        const axiosError = error as AxiosError
        return axiosError.response?.data || 'An error occurred';
    }
})

export const fetchSessionId = createAsyncThunk('auth/fetchSessionId', async ({ accessTokenAuth, requestToken }: { accessTokenAuth: string; requestToken: string }) => {
    try {
        const response = await axios.post(
            SESSION_ID_URL, 
            {'request_token': requestToken}, 
            {
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${accessTokenAuth}`
                }
            })
        return response.data
    } catch (error) {
        const axiosError = error as AxiosError
        return axiosError.response?.data || 'An error occurred';
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetState(state: AuthState) {
            state.status = AuthStatus.Idle
            state.requestToken = ''
            state.sessionId = ''
            state.error = ''
        },
        
        setRequestToken(state: AuthState, action: PayloadAction<string>) {
            state.requestToken = action.payload
        },

        updateStatus(state: AuthState, action: PayloadAction<AuthStatus>) {
            state.status = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchRequestToken.pending, (authState: AuthState, action: PayloadAction) => {
            authState.status = AuthStatus.PendingRequestToken
        })

        builder.addCase(fetchRequestToken.fulfilled, (authState: AuthState, action: PayloadAction<RequestTokenResponse>) => {
            if (action.payload.success)
            {
                authState.requestToken = action.payload.request_token
                authState.status = AuthStatus.PendingApproval
            }
        })

        builder.addCase(fetchRequestToken.rejected, (authState: AuthState, action) => {
            authState.error = action.error?.message || "An error occurred fetching the request token"
        })


        builder.addCase(fetchSessionId.pending, (authState: AuthState, action: PayloadAction) => {
            authState.status = AuthStatus.PendingSessionId
        })

        builder.addCase(fetchSessionId.fulfilled, (authState: AuthState, action: PayloadAction<SessionIdResponse>) => {
            if (action.payload.success)
            {
                authState.status = AuthStatus.LoggedIn
                authState.sessionId = action.payload.session_id
            }
        })

        builder.addCase(fetchSessionId.rejected, (authState: AuthState, action) => {
            authState.error = action.error?.message || "An error occurred fetching the session ID"
        })
    }
})


export const selectAccessTokenAuth = (state: RootState) => state.auth.accessTokenAuth
export const selectRequestToken = (state: RootState) => state.auth.requestToken
export const selectSessionId = (state: RootState) => state.auth.sessionId
export const selectStatus = (state: RootState) => state.auth.status
export const selectError = (state: RootState) => state.auth.error

export const { resetState , setRequestToken , updateStatus } = authSlice.actions;

export default authSlice.reducer