  import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
  import { useState, useEffect } from 'react';
  import 'react-toastify/dist/ReactToastify.css';
  import { ToastContainer } from 'react-toastify';

  import Navbar from './components/Navbar';
  import Footer from './components/Footer';

  import Home from './pages/Home';
  import Login from './pages/Login';
  import Register from './pages/Register';
  import CreatePost from './pages/CreatePost';
  import PostDetail from './pages/PostDetail';
  import EditPost from './pages/EditPost';
  import Profile from './pages/Profile';

  function App() {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
      setLoading(false);
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar token={token} setToken={setToken} />

          <main className="flex-grow container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/login"
                element={token ? <Navigate to="/" /> : <Login setToken={setToken} />}
              />

              <Route path="/register" element={<Register />} />

              {/* ✅ Protected Routes */}
              <Route
                path="/create"
                element={token ? <CreatePost /> : <Navigate to="/login" />}
              />
              <Route
                path="/edit/:id"
                element={token ? <EditPost /> : <Navigate to="/login" />}
              />
              <Route
                path="/profile"
                element={token ? <Profile /> : <Navigate to="/login" />}
              />

              {/* Public */}
              <Route path="/post/:id" element={<PostDetail />} />
            </Routes>
          </main>
          <Footer />
          
        </div>
        <ToastContainer position="top-center" />
      </Router>
    );
  }

  export default App;
