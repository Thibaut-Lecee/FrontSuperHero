import React, { useEffect } from "react";
import "./styles/global.css";
import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Accueil from "./Components/Accueil/Accueil";
import { Sidebar, dummyData } from "./Components/SideBar/index";
import Maps from "./Components/Maps/Maps";
import Login from "./Components/Login/Authentification";
import Register from "./Components/Register/Register";
import TableHeros from "./Components/Heros/Table/TableHeros";
export const API_URL = process.env.REACT_APP_API_URL;
export const GOOGLEKEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
export const HERO_KEY = process.env.REACT_APP_SUPER_HERO_API_KEY;
function App() {
  return (
    <div id="main">
      <Sidebar>
        <Routes>
          {dummyData &&
            dummyData.map((item, index) => {
              switch (item.name) {
                case "Accueil":
                  return (
                    <Route
                      key={index}
                      path={`/${item.path}`}
                      element={<Accueil />}
                    />
                  );
                case "Plan":
                  return (
                    <Route
                      key={index}
                      path={`/${item.path}`}
                      element={<Maps />}
                    />
                  );
                case "Login":
                  return (
                    <Route
                      key={index}
                      path={`/${item.path}`}
                      element={<Login />}
                    />
                  );
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
