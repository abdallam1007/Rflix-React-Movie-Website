import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from '../../app/store'
import axios from "axios";

export enum AuthStatus {
    Idle = 'Idle',
    PendingRequestToken = 'PendingRequestToken',
    RequestTokenFetched = 'RequestTokenFetched',
    PendingApproval = 'PendingApproval',
    Approved = 'Approved',
    PendingSessionId = 'PendingSessionId',
    LoggedIn = 'LoggedIn',
    PendingAccountId = 'PendingAccountId',
    FetchedAccountId = 'FetchedAccountId',
    Rejected = 'Rejected'
}

// Convert enum value to string
export const enumToString = (value: AuthStatus): string => {
    return AuthStatus[value];
  };
  
// Convert string to enum value
export const stringToEnum = (value: string): AuthStatus | undefined => {
    return Object.values(AuthStatus).find((enumValue) => enumValue === value) as AuthStatus;
  };


export interface AuthState {
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
            localStorage.setItem('STATUS', enumToString(state.status));
            localStorage.setItem('SESSION_ID', state.sessionId);
        },
        
        setRequestToken(state: AuthState, action: PayloadAction<string>) {
            state.requestToken = action.payload
        },

        setSessionId(state: AuthState, action: PayloadAction<string>) {
            state.sessionId = action.payload
        },

        updateStatus(state: AuthState, action: PayloadAction<AuthStatus>) {
            state.status = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchRequestToken.pending, (authState: AuthState, action: PayloadAction) => {
            authState.status = AuthStatus.PendingRequestToken
            localStorage.setItem('STATUS', enumToString(authState.status));
        })

        builder.addCase(fetchRequestToken.fulfilled, (authState: AuthState, action: PayloadAction<RequestTokenResponse>) => {
            if (action.payload.success)
            {
                authState.requestToken = action.payload.request_token
                authState.status = AuthStatus.RequestTokenFetched
                localStorage.setItem('STATUS', enumToString(authState.status));
            }
        })

        builder.addCase(fetchRequestToken.rejected, (authState: AuthState, action) => {
            authState.status = AuthStatus.Rejected
            authState.error = action.error?.message || "An error occurred fetching the request token"
            localStorage.setItem('STATUS', enumToString(authState.status));
        })


        builder.addCase(approveRequestToken.pending, (authState: AuthState, action: PayloadAction) => {
            authState.status = AuthStatus.PendingApproval
            localStorage.setItem('STATUS', enumToString(authState.status));
        })

        builder.addCase(approveRequestToken.fulfilled, (authState: AuthState, action: PayloadAction<SessionIdResponse>) => {
            if (action.payload.success)
            {
                authState.status = AuthStatus.Approved
                localStorage.setItem('STATUS', enumToString(authState.status));
            }
        })

        builder.addCase(approveRequestToken.rejected, (authState: AuthState, action) => {
            authState.status = AuthStatus.Rejected
            authState.error = action.error?.message || "An error occurred approving the request token"
            localStorage.setItem('STATUS', enumToString(authState.status));
        })


        builder.addCase(fetchSessionId.pending, (authState: AuthState, action: PayloadAction) => {
            authState.status = AuthStatus.PendingSessionId
            localStorage.setItem('STATUS', enumToString(authState.status));
        })

        builder.addCase(fetchSessionId.fulfilled, (authState: AuthState, action: PayloadAction<SessionIdResponse>) => {
            if (action.payload.success)
            {
                authState.status = AuthStatus.LoggedIn
                authState.error = ''
                authState.sessionId = action.payload.session_id
                localStorage.setItem('SESSION_ID', authState.sessionId);
                localStorage.setItem('STATUS', enumToString(authState.status));
            }
        })

        builder.addCase(fetchSessionId.rejected, (authState: AuthState, action) => {
            authState.status = AuthStatus.Rejected
            authState.error = action.error?.message || "An error occurred fetching the session ID"
            localStorage.setItem('STATUS', enumToString(authState.status));
        })


        builder.addCase(fetchAccountId.pending, (authState: AuthState, action: PayloadAction) => {
            authState.status = AuthStatus.PendingAccountId
            localStorage.setItem('STATUS', enumToString(authState.status));
        })

        builder.addCase(fetchAccountId.fulfilled, (authState: AuthState, action: PayloadAction<AccountResponse>) => {
            authState.accountId = action.payload.id
            authState.status = AuthStatus.FetchedAccountId
            localStorage.setItem('STATUS', enumToString(authState.status));
        })

        builder.addCase(fetchAccountId.rejected, (authState: AuthState, action) => {
            authState.status = AuthStatus.Rejected
            authState.error = action.error?.message || "An error occurred fetching the session ID"
            localStorage.setItem('STATUS', enumToString(authState.status));
        })
    }
})

export const selectRequestToken = (state: RootState) => state.auth.requestToken
export const selectSessionId = (state: RootState) => state.auth.sessionId
export const selectStatus = (state: RootState) => state.auth.status
export const selectAccountId = (state: RootState) => state.auth.accountId
export const selectError = (state: RootState) => state.auth.error

export const { resetState , setRequestToken , updateStatus, setSessionId } = authSlice.actions;

export default authSlice.reducer