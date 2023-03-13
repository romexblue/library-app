import { useEffect, useContext } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../helpers/AuthContext";

const Admin = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);

    useEffect(() => {
        if (sessionStorage.getItem("accessToken") && sessionStorage.getItem("id") && !authContext.isLoggedIn) {
              axios.get("http://localhost:5000/auth/allow", {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                    userId: sessionStorage.getItem("id")
                },
            })
                .then((response) => {
                    if (response.data.error) {
                        authContext.logout();
                        navigate('/');
                    } else {
                        authContext.login(sessionStorage.getItem("id"), sessionStorage.getItem("accessToken"))
                        axios.get(`http://localhost:5000/auth/admin-auth/${sessionStorage.getItem("id")}`, {
                            headers: {
                                accessToken: sessionStorage.getItem("accessToken"),
                                userId: sessionStorage.getItem("id")
                            },
                        }).then((response)=>{
                            if(response.data.error){
                                //if not admin
                                navigate('/choose')
                            }else{
                                //if admin
                                navigate('/admin')
                            }
                        })
                        
                    }
                })
        }else{
            if(!sessionStorage.getItem("accessToken") && !sessionStorage.getItem("id")){
                navigate('/')
            }
        }

    },[authContext, navigate]);

    return (
        <div>Hello Admin</div>
    )
}

export default Admin