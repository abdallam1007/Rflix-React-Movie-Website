import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './features/auth/login';
import Movies from './features/movies/movies';
import LoginAllow from './features/auth/loginAllow';

function App() {
  return (
    <main className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/login/allow" element={<LoginAllow />} />
          <Route path="/" element={<Movies />} />
        </Routes>
      </Router>
    </main>
  );
}

export default App;
