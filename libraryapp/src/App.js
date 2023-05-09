import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState } from 'react';
import Login from './Pages/Login';
import FloorButtons from './Pages/FloorButtons';
import AuthContext from './helpers/AuthContext';
import Chooser from './Pages/Chooser';
import Exit from './Pages/Exit';
import Admin from './Pages/Admin';
import Reservation from './Pages/Reservation';
import Registration from './Pages/Registration';

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
            <Route path="/choose" exact element={<Chooser />} />
            <Route path="/entry" exact element={<FloorButtons />} />
            <Route path="/exit" exact element={<Exit />} />
            <Route path="/reservation" exact element={<Reservation />} />
            <Route path="/admin" exact element={<Admin />}/>
            <Route path="/registration" exact element={<Registration/>}/>
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
