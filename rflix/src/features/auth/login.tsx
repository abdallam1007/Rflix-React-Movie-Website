import { useDispatch, useSelector } from "react-redux";
import { AuthStatus, selectStatus, fetchRequestToken, selectAccessTokenAuth, selectRequestToken, approveRequestToken, fetchSessionId, resetState, selectError } from "./authSlice"
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
    }, [loginStatus]);

    useEffect(() => {
        if (loginStatus === AuthStatus.Approved) {
            dispatch(fetchSessionId({ accessTokenAuth, requestToken }))
        }
    }, [loginStatus]);

    useEffect(() => {
        if (loginStatus === AuthStatus.LoggedIn) {
            navigate('/')
        }
    }, [loginStatus]);

    useEffect(() => {
        if (loginStatus === AuthStatus.Rejected) {
            dispatch(resetState())
            setUsername('')
            setPassword('')
        }
    }, [loginStatus]);

    return (
        <div>
            <h2>Login</h2>
            <form>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {isError && (
                    <p style={{ color: 'red' }}>{errorMessage}</p>
                )}
                <button disabled={!canLogin} onClick={handleLoginClick}>Login</button>
            </form>
        </div>
    );
}

export default Login
