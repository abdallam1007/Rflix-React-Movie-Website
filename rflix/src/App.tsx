import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/login';
import HomePage from './features/homePage/homePage';
import { useDispatch, useSelector } from 'react-redux';
import { AuthStatus, selectStatus, setSessionId, stringToEnum, updateStatus } from './features/auth/authSlice';
import DetailedPage from './features/detailedPage/detailedPage';
import MyRatings from './features/homePage/myRatings';
import { useEffect } from 'react';
import { AppDispatch } from './app/store';

function App() {
    const dispatch = useDispatch<AppDispatch>()

    const loginStatus = useSelector(selectStatus)

    useEffect(() => {
        const sessionIdFromLocalStorage = localStorage.getItem('SESSION_ID')
        const statusFromLocalStorage = localStorage.getItem('STATUS')
        if (sessionIdFromLocalStorage && statusFromLocalStorage) {
          dispatch(setSessionId(sessionIdFromLocalStorage))
          dispatch(updateStatus(stringToEnum(statusFromLocalStorage) || AuthStatus.Idle))
        }
      }, []);

    return (
        <main className="App">
            <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<HomePage />} />
                        <Route path="/myratings" element={<MyRatings />} />
                        <Route path="/movie/:id" element={<DetailedPage />} /> 
                        <Route path="*" element={<Navigate to={loginStatus === AuthStatus.FetchedAccountId ? '/' : '/login'} />} />
                    </Routes>
            </Router>
        </main>
      );
}

export default App;
