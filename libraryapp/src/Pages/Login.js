import '../styles/LoginForm.css'
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import AuthContext from '../helpers/AuthContext';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = { username: username, password: password }
    axios.post("http://localhost:5000/auth/login", data).then((response) => {
      if (response.data.error) {
        alert(response.data.error)
      } else {
        sessionStorage.setItem("accessToken", response.data.accessToken)
        sessionStorage.setItem("id", response.data.userId)
        authContext.login(response.data.userId, response.data.accessToken)
      }
    })
  };

  useEffect(() => {
    //for page refresh if already logged in
    if (sessionStorage.getItem("accessToken") && sessionStorage.getItem("id")) {
      axios.get("http://localhost:5000/auth/allow", {
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
        },
      })
        .then((response) => {

          if (response.data.error) {
            authContext.logout()
          } else {
            authContext.login(sessionStorage.getItem("id"), sessionStorage.getItem("accessToken"))
          }
        })
    }

    if (authContext.isLoggedIn) { navigate('/choose') }


  }, [navigate, authContext])

  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={handleUsernameChange} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
        <br />
        <button type="submit">Log In</button>
      </form>
    </div>
  )
}

export default Login