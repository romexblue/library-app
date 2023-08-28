import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState, lazy, Suspense } from 'react';

import AuthContext from './helpers/AuthContext';
import ProtectedRoute from './helpers/ProtectedRoute';

import Loading from './components/Loading/Loading';
import Login from './Pages/Login';
const FloorButtons = lazy(() => import('./Pages/FloorButtons'))
const Chooser = lazy(() => import('./Pages/Chooser'))
const Exit = lazy(() => import('./Pages/Exit'))
const Admin = lazy(() => import('./Pages/Admin'))
const Reservation = lazy(() => import('./Pages/Reservation'))
const Registration = lazy(() => import('./Pages/Registration'))

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
            <ProtectedRoute path="/choose" exact element={
              <Suspense fallback={<Loading />}>
                <Chooser />
              </Suspense>
            } />
            <Route path="/entry" exact element={<FloorButtons />} />
            <Route path="/exit" exact element={<Exit />} />
            <Route path="/reservation" exact element={<Reservation />} />
            <Route path="/admin" exact element={<Admin />} />
            <Route path="/registration" exact element={<Registration />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
