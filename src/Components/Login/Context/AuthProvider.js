import { createContext, useEffect, useState } from "react";
import {
  handleAxiosErrors,
  showNotificationSuccess,
} from "../../Function/AxiosRequest";
import axios from "axios";
import { API_URL } from "../../../App";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
export const AuthContext = createContext();
const cookies = new Cookies();
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false); // [1
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const login = async (nom, password) => {
    try {
      console.log(nom, password);
      const send = await axios.post(`${API_URL}/api/heros/loginHero`, {
        nom: nom,
        password: password,
      });
      setAuth(true);
      showNotificationSuccess("Connexion réussie");
      console.log(jwtDecode(send.data.token));
      setUser(send.data.token);
      cookies.set("AccessToken", send.data.token, { path: "/" });
      navigate("/Superheros");
    } catch (error) {
      handleAxiosErrors(error);
    }
  };

  const logout = () => {
    cookies.remove("AccessToken");
    setUser(null);
    setAuth(false);
    showNotificationSuccess("Déconnexion réussie");
  };

  useEffect(() => {
    const token = cookies.get("AccessToken");
    if (token) {
      setUser(token);
      setAuth(true);
    }
  }, []);
  return (
    <AuthContext.Provider value={{ user, login, auth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
