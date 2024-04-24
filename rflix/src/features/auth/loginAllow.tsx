import { useEffect } from "react";
import { AuthStatus, fetchSessionId, selectAccessTokenAuth, selectRequestToken, selectStatus, setRequestToken, updateStatus } from "./authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../app/store";



const LoginAllow = () => {
    const dispatch = useDispatch<AppDispatch>()
    const location = useLocation()
    const navigate = useNavigate()

    const loginStatus = useSelector(selectStatus)
    const accessTokenAuth = useSelector(selectAccessTokenAuth)
    const requestToken = useSelector(selectRequestToken)
    
    const RequestTokenApproved = loginStatus === AuthStatus.Approved

    useEffect(() => {
        const query = new URLSearchParams(location.search)
        const request_token = String(query.get('request_token'))
        const isApproved = Boolean(query.get('approved'))

        if (isApproved) {
            dispatch(setRequestToken(request_token))
            dispatch(updateStatus(AuthStatus.Approved));
        } else {
            navigate('/login');
        }
    }, [location.search]);

    useEffect(() => {
        if (RequestTokenApproved) {
            dispatch(fetchSessionId({ accessTokenAuth, requestToken }))
            .then((resultAction) => {
                if (fetchSessionId.fulfilled.match(resultAction)) {
                    navigate('/');
                }
            });
        }
    }, [loginStatus]);

  return (
    <div>
      <h2>Loading Session ID</h2>
    </div>
  )
}

export default LoginAllow
