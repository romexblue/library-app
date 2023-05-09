import '../styles/LoginForm.css'
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import AuthContext from '../helpers/AuthContext';
import image1 from '../images/XuLib.png';
import image2 from '../images/Xentry_Icon.png';

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
        if(response.data.type === "Admin" || response.data.type === "Librarian" || response.data.type === "Assistant"){
          navigate('/admin', { state: { userType: response.data.type, name: response.data.name } })
        }else{
          navigate('/choose')
        }
      }
    })
  };

  useEffect(() => {
    
    //for page refresh if already logged in
    if (sessionStorage.getItem("accessToken") && sessionStorage.getItem("id") && !authContext.isLoggedIn) {
      axios.get("http://localhost:5000/auth/allow", {
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
          userId: sessionStorage.getItem("id")
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
    <div className="login-page">
      <div className='systemTitle'>
        <p className='sysTitle'><img alt='' src={image2}/></p>
      </div>
      <div className='xulibLogo'>
        <img className='libLogo' src={image1}></img>
      </div>
    <form onSubmit={handleSubmit}>
        <h1>LOGIN</h1>
        <div className="form-group">
            <label htmlFor="">Email</label>
            <input type="text" className="form-control" value={username} onChange={handleUsernameChange} required />
        </div>
        <div className="form-group">
            <label htmlFor="">Password</label>
            <input type="password" className="form-control" value={password} onChange={handlePasswordChange} required />
        </div>
        <input type="submit" className="btn" value="SUBMIT"/>
    </form>
    </div>
  )
}

export default Login