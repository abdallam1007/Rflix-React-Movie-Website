import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './features/auth/login';
import Movies from './features/movies/movies';

function App() {
  return (
    <main className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Movies />} />
        </Routes>
      </Router>
    </main>
  );
}

export default App;
