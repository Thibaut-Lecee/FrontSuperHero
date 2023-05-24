import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ItemsList,
  ItemContainer,
  ItemWrapper,
  ItemName,
} from "./SideBarStyles";

import { dummyData } from "..";
import { AuthContext } from "../../Login/Context/AuthProvider";

const SidebarItems = ({ displaySidebar }) => {
  const [activeItem, setActiveItem] = useState(0);
  const { auth, logout } = useContext(AuthContext);
  const [navigation, setNavigation] = useState(dummyData);
  useEffect(() => {
    console.log(auth);
    if (auth) {
      const adjustedDummyData = dummyData.map((item) => {
        if (auth && item.id === 5) {
          // Change this to the id of your "Login" item
          return {
            ...item,
            name: "Déconnexion",
            path: "/Login",
            action: logout, // Change this to the correct path for logging out
          };
        } else {
          return item;
        }
      });
      setNavigation(adjustedDummyData);
    } else {
      setNavigation(dummyData);
    }
  }, [auth, logout]);

  const handleLogout = useCallback((itemData) => {
    setActiveItem(itemData.id);
    if (itemData.action) {
      itemData.action();
    }
  }, []);

  return (
    <ItemsList>
      {navigation.map((itemData, index) => (
        <ItemContainer
          key={index}
          onClick={() => handleLogout(itemData)}
          className={itemData.id === activeItem ? "active" : ""}
        >
          <Link to={itemData.path}>
            <ItemWrapper>
              {itemData.icon}
              <ItemName displaySidebar={displaySidebar}>
                {itemData.name}
              </ItemName>
            </ItemWrapper>
          </Link>
        </ItemContainer>
      ))}
    </ItemsList>
  );
};

export default SidebarItems;
