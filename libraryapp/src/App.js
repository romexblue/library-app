import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from './Pages/Login';
import Floor from './Pages/Floor';
import { useState } from 'react';
import AuthContext from './helpers/AuthContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  const loginHandler = (userId, token) => {
    setIsLoggedIn(true);
    setUserId(userId);
    setToken(token);
  };

  const logoutHandler = () => {
    setIsLoggedIn(false);
    setUserId(null);
    setToken(null);
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn: isLoggedIn,
      userId: userId,
      token: token,
      login: loginHandler,
      logout: logoutHandler
    }}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" exact element={<Login />} />
            <Route path="/floor" exact element={<Floor />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
