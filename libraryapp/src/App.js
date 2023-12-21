import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, lazy, Suspense } from "react";

import AuthContext from "./helpers/AuthContext";
import ProtectedGuardRoute from "./helpers/ProtectedGuardRoute";
import ProtectedAdminRoute from "./helpers/ProtectedAdminRoute";

import Loading from "./components/Loading/Loading";
import Login from "./Pages/Login";
import "react-datepicker/dist/react-datepicker.css";
const FloorButtons = lazy(() => import("./Pages/FloorButtons"));
const Chooser = lazy(() => import("./Pages/Chooser"));
const Exit = lazy(() => import("./Pages/Exit"));
const Admin = lazy(() => import("./Pages/Admin"));
const Reservation = lazy(() => import("./Pages/Reservation"));
const Registration = lazy(() => import("./Pages/Registration"));

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [userName, setUsername] = useState(null);
  const [userType, setUserType] = useState(null);

  const loginHandler = (userId, token, userName, userType) => {
    setIsLoggedIn(true);
    setUserId(userId);
    setToken(token);
    setUsername(userName);
    setUserType(userType);
  };

  const logoutHandler = () => {
    setIsLoggedIn(false);
    setUserId(null);
    setToken(null);
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        userId: userId,
        userName: userName,
        userType: userType,
        token: token,
        login: loginHandler,
        logout: logoutHandler,
      }}
    >
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" exact element={<Login />} />
            <Route exact element={<ProtectedGuardRoute />}>
              <Route
                path="/choose"
                element={
                  <Suspense fallback={<Loading />}>
                    <Chooser />
                  </Suspense>
                }
              />

              <Route
                path="/entry"
                element={
                  <Suspense fallback={<Loading />}>
                    <FloorButtons />
                  </Suspense>
                }
              />

              <Route
                path="/exit"
                element={
                  <Suspense fallback={<Loading />}>
                    <Exit />
                  </Suspense>
                }
              />
            </Route>
            <Route exact element={<ProtectedGuardRoute />}>
              <Route
                path="/registration"
                element={
                  <Suspense fallback={<Loading />}>
                    <Registration />
                  </Suspense>
                }
              />

              <Route
                path="/admin"
                element={
                  <Suspense fallback={<Loading />}>
                    <Admin />
                  </Suspense>
                }
              />
            </Route>
            <Route
              path="/reservation"
              exact
              element={
                <Suspense fallback={<Loading />}>
                  <Reservation />
                </Suspense>
              }
            />
            <Route path="*" element={<p>There's nothing here: 404!</p>} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
