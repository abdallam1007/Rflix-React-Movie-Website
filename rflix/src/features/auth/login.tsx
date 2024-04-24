import { useDispatch, useSelector } from "react-redux";
import { AuthStatus, selectStatus, fetchRequestToken, selectAccessTokenAuth, selectRequestToken, REQUEST_TOKEN_APPROVAL_URL, REQUEST_TOKEN_APPROVED_URL } from "./authSlice"
import { AppDispatch } from "../../app/store";
import { useEffect } from "react";

const Login = () => {
    const dispatch = useDispatch<AppDispatch>()

    const accessTokenAuth = useSelector(selectAccessTokenAuth)
    const requestToken = useSelector(selectRequestToken)
    const loginStatus = useSelector(selectStatus)


    const canLogin = loginStatus === AuthStatus.Idle
    const requestTokenpendingApproval = loginStatus === AuthStatus.PendingApproval

    const handleLoginClick = () => {
        dispatch(fetchRequestToken(accessTokenAuth))
    }

    useEffect(() => {
        if (requestTokenpendingApproval) {
            window.location.assign(`${REQUEST_TOKEN_APPROVAL_URL}/${requestToken}?redirect_to=${REQUEST_TOKEN_APPROVED_URL}`)
        }
    }, [loginStatus]);

    return (
        <div>
            <button disabled={!canLogin} onClick={handleLoginClick}>Login</button>
        </div>
    );
}

export default Login
