import React from "react";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Radio,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const Filter = ({ handleClick, handleToggle, checked, open }) => {
  return (
    <List sx={{ position: "absolute", zIndex: 3, mt: 1, ml: 2 }}>
      <ListItemButton
        onClick={handleClick}
        sx={{
          backgroundColor: "#3f51b5",
          width: "175px",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#303f9f",
          },
        }}
      >
        <ListItemText primary="Filtrer les interventions" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {["En attente", "En cours", "Terminé"].map((status, index) => (
            <ListItemButton
              key={index}
              role={undefined}
              dense
              onClick={handleToggle(status)}
              sx={{
                backgroundColor: "#3f51b5",
                width: "175px",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#303f9f",
                },
              }}
            >
              <ListItemIcon>
                <Radio
                  edge="start"
                  checked={checked === status}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": `checkbox-list-label-${status}`,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                id={`checkbox-list-label-${status}`}
                primary={status}
              />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </List>
  );
};

export default Filter;
