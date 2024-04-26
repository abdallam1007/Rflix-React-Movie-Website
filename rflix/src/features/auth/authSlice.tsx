import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from '../../app/store'
import axios from "axios";

export enum AuthStatus {
    Idle,
    PendingRequestToken,
    RequestTokenFetched,
    PendingApproval,
    Approved,
    PendingSessionId,
    LoggedIn,
    PendingAccountId,
    FetchedAccountId,
    Rejected
}

export interface AuthState {
    accessTokenAuth: string,
    requestToken: string,
    sessionId: string,
    status: AuthStatus,
    accountId: number,
    error: string,
}

interface RequestTokenResponse {
    success: boolean
    expires_at: string
    request_token: string
}

interface SessionIdResponse {
    session_id: string
    success: boolean
}

interface AccountResponse {
    id: number
}

// Todo: either put them in the store or in an env file
const ACCOUNT_ID_URL = 'https://api.themoviedb.org/3/account'
const REQUEST_TOKEN_URL = 'https://api.themoviedb.org/3/authentication/token/new'
const REQUEST_TOKEN_APPROVAL_URL = 'https://api.themoviedb.org/3/authentication/token/validate_with_login'
const SESSION_ID_URL = 'https://api.themoviedb.org/3/authentication/session/new'

const initialState = {
    // Todo: Need to move this value to an outside and treat it like a secret
    accessTokenAuth: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMzYwYTkxNGFjMDAzNWMwOWZlNjYwYjdmOWI3MTk5NyIsInN1YiI6IjY2MjYzZjQyYjI2ODFmMDFhOTc0Y2E5OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RIB0yJl1jNkIsUtaWpXGFMMLYnV6pkRBVwCGRGStrHk',
    requestToken: '',
    sessionId: '',
    status: AuthStatus.Idle,
    accountId: 0,
    error: ''
}

export const fetchRequestToken = createAsyncThunk('auth/fetchRequestToken', async (accessTokenAuth: string) => {
    const response = await axios.get(REQUEST_TOKEN_URL, {
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessTokenAuth}`
        }
    })
    return response.data
})

export const approveRequestToken = createAsyncThunk('auth/approveRequestToken', async ({ accessTokenAuth, requestToken, username, password }: { accessTokenAuth: string; requestToken: string, username: string, password: string }) => {
    const response = await axios.post(
        REQUEST_TOKEN_APPROVAL_URL, 
        {
            'username': username,
            'password': password,
            'request_token': requestToken,
        }, 
        {
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'Authorization': `Bearer ${accessTokenAuth}`
            }
        })
    
    return response.data
})

export const fetchSessionId = createAsyncThunk('auth/fetchSessionId', async ({ accessTokenAuth, requestToken }: { accessTokenAuth: string; requestToken: string }) => {
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
})

export const fetchAccountId = createAsyncThunk('auth/fetchAccountId', async ({ accessTokenAuth, sessionId }: { accessTokenAuth: string; sessionId: string }) => {
    const response = await axios.get(ACCOUNT_ID_URL, {
        params: {
            session_id: sessionId
        },

        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessTokenAuth}`
        }
    })
    return response.data
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetState(state: AuthState) {
            state.status = AuthStatus.Idle
            state.requestToken = ''
            state.sessionId = ''
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
                authState.status = AuthStatus.RequestTokenFetched
            }
        })

        builder.addCase(fetchRequestToken.rejected, (authState: AuthState, action) => {
            authState.status = AuthStatus.Rejected
            authState.error = action.error?.message || "An error occurred fetching the request token"
        })


        builder.addCase(approveRequestToken.pending, (authState: AuthState, action: PayloadAction) => {
            authState.status = AuthStatus.PendingApproval
        })

        builder.addCase(approveRequestToken.fulfilled, (authState: AuthState, action: PayloadAction<SessionIdResponse>) => {
            if (action.payload.success)
            {
                authState.status = AuthStatus.Approved
            }
        })

        builder.addCase(approveRequestToken.rejected, (authState: AuthState, action) => {
            authState.status = AuthStatus.Rejected
            authState.error = action.error?.message || "An error occurred approving the request token"
        })


        builder.addCase(fetchSessionId.pending, (authState: AuthState, action: PayloadAction) => {
            authState.status = AuthStatus.PendingSessionId
        })

        builder.addCase(fetchSessionId.fulfilled, (authState: AuthState, action: PayloadAction<SessionIdResponse>) => {
            if (action.payload.success)
            {
                authState.status = AuthStatus.LoggedIn
                authState.error = ''
                authState.sessionId = action.payload.session_id
            }
        })

        builder.addCase(fetchSessionId.rejected, (authState: AuthState, action) => {
            authState.status = AuthStatus.Rejected
            authState.error = action.error?.message || "An error occurred fetching the session ID"
        })


        builder.addCase(fetchAccountId.pending, (authState: AuthState, action: PayloadAction) => {
            authState.status = AuthStatus.PendingAccountId
        })

        builder.addCase(fetchAccountId.fulfilled, (authState: AuthState, action: PayloadAction<AccountResponse>) => {
            authState.status = AuthStatus.FetchedAccountId
            authState.accountId = action.payload.id
        })

        builder.addCase(fetchAccountId.rejected, (authState: AuthState, action) => {
            authState.status = AuthStatus.Rejected
            authState.error = action.error?.message || "An error occurred fetching the session ID"
        })
    }
})


export const selectAccessTokenAuth = (state: RootState) => state.auth.accessTokenAuth
export const selectRequestToken = (state: RootState) => state.auth.requestToken
export const selectSessionId = (state: RootState) => state.auth.sessionId
export const selectStatus = (state: RootState) => state.auth.status
export const selectAccountId = (state: RootState) => state.auth.accountId
export const selectError = (state: RootState) => state.auth.error

export const { resetState , setRequestToken , updateStatus } = authSlice.actions;

export default authSlice.reducer