import './styles/login.css'
import { useDispatch, useSelector } from "react-redux";
import { AuthStatus, selectStatus, fetchRequestToken, selectAccessTokenAuth, selectRequestToken, approveRequestToken, fetchSessionId, resetState, selectError, fetchAccountId, selectSessionId, selectAccountId } from "./authSlice"
import { AppDispatch } from "../../app/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const accessTokenAuth = useSelector(selectAccessTokenAuth)
    const requestToken = useSelector(selectRequestToken)
    const sessionId = useSelector(selectSessionId)
    const accountId = useSelector(selectAccountId)
    const loginStatus = useSelector(selectStatus)
    const errorMessage = useSelector(selectError)

    const canLogin = loginStatus === AuthStatus.Idle
    const isError = errorMessage.length > 0

    const handleLoginClick = () => {
        dispatch(fetchRequestToken(accessTokenAuth))
    }

    useEffect(() => {
        if (loginStatus === AuthStatus.RequestTokenFetched) {
            dispatch(approveRequestToken({ accessTokenAuth, requestToken, username, password }))
        }
    }, [loginStatus])

    useEffect(() => {
        if (loginStatus === AuthStatus.Approved) {
            dispatch(fetchSessionId({ accessTokenAuth, requestToken }))
        }
    }, [loginStatus])

    useEffect(() => {
        if (loginStatus === AuthStatus.LoggedIn) {
            dispatch(fetchAccountId({accessTokenAuth, sessionId}))
        }
    }, [loginStatus])

    useEffect(() => {
        if (loginStatus === AuthStatus.Rejected) {
            dispatch(resetState())
            setUsername('')
            setPassword('')
        }
    }, [loginStatus])

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {isError && (
                    <p className="error-message">{errorMessage}</p>
                )}
                <button className="login-button" disabled={!canLogin} onClick={handleLoginClick}>Login</button>
            </form>
        </div>
    );
}

export default Login
