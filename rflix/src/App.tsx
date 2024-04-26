import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/login';
import HomePage from './features/homePage/homePage';
import { useSelector } from 'react-redux';
import { AuthStatus, selectStatus } from './features/auth/authSlice';

function App() {
    const loginStatus = useSelector(selectStatus)

    return (
        <main className="App">
            <Router>
                    <Routes>
                        {loginStatus !== AuthStatus.FetchedAccountId && (
                            <Route path="/login" element={<Login />} />
                        )}
                
                        {loginStatus === AuthStatus.FetchedAccountId && (
                            <Route path="/" element={<HomePage />} />
                        )}
                
                        <Route path="*" element={<Navigate to={loginStatus === AuthStatus.FetchedAccountId ? '/' : '/login'} />} />
                    </Routes>
            </Router>
        </main>
      );
}

export default App;
