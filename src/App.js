import React, { useContext, useEffect } from "react";
import "./styles/global.css";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Accueil from "./Components/Accueil/Accueil";
import { Sidebar, dummyData } from "./Components/SideBar/index";
import Maps from "./Components/Maps/Maps";
import Login from "./Components/Login/Authentification";
import Register from "./Components/Register/Register";
import TableHeros from "./Components/Heros/Table/TableHeros";
import { AuthContext } from "./Components/Login/Context/AuthProvider";
import { Toaster } from "react-hot-toast";
export const API_URL = process.env.REACT_APP_API_URL;
export const GOOGLEKEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
export const HERO_KEY = process.env.REACT_APP_SUPER_HERO_API_KEY;
function App() {
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (auth) {
      console.log(auth);
    }
  }, [auth]);
  return (
    <div id="main">
      <Toaster reverseOrder={false} />
      <Sidebar>
        <Routes>
          {dummyData &&
            dummyData.map((item, index) => {
              switch (item.name) {
                case "Plan":
                  return (
                    <Route
                      key={index}
                      path={`/${item.path}`}
                      element={<Maps />}
                    />
                  );
                case "Login":
                  return !auth ? (
                    <Route
                      key={index}
                      path={`/${item.path}`}
                      element={<Login />}
                    />
                  ) : null;
                case "Inscription":
                  return (
                    <Route
                      key={index}
                      path={`/${item.path}`}
                      element={<Register />}
                    />
                  );
                case "Nos supers héros":
                  return (
                    <Route
                      key={index}
                      path={`/${item.path}`}
                      element={<TableHeros />}
                    />
                  );

                // Add all your other cases...
                default:
                  return null;
              }
            })}
        </Routes>
      </Sidebar>
    </div>
  );
}

export default App;
