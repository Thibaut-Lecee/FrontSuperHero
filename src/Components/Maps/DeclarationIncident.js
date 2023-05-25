import {
  Grid,
  Collapse,
  IconButton,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
} from "@mui/material";
import React from "react";
import MapLocation from "../Register/MapLocation";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { red, green } from "@mui/material/colors";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { API_URL } from "../../App";
import {
  handleAxiosErrors,
  showNotificationSuccess,
} from "../Function/AxiosRequest";

const DeclarationIncident = ({ incidents, created }) => {
  const [errors, setErrors] = React.useState({
    location: null,
    townHall: "",
  });
  const [location, setLocation] = React.useState({
    lat: null,
    lng: null,
  });
  const [selectedIncidents, setSelectedIncidents] = React.useState({
    id: null,
    type: "",
  });
  const [open, setOpen] = React.useState(false);

  const handleIncident = (event) => {
    const incidentId = event.target.value;
    const incident = incidents.find((incident) => incident.id === incidentId);
    setSelectedIncidents({
      id: incident.id,
      type: incident.type,
    });
    console.log(selectedIncidents);
  };
  const handleLocation = (lat, lng) => {
    setLocation({ lat, lng });
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const handleErrors = () => {
    if (location.lat === null || location.lng === null) {
      setErrors({
        ...errors,
        location: "Veuillez renseigner une adresse",
      });
      return;
    }
    if (selectedIncidents.id === null) {
      setErrors({
        ...errors,
        incident: "Veuillez renseigner un type d'incident",
      });
      return;
    }
    return true;
  };

  const handleSubmit = async () => {
    const isValid = handleErrors();
    if (!isValid) return;

    const incident = {
      lat: location.lat,
      lng: location.lng,
      incident: selectedIncidents.id,
      type: selectedIncidents.type,
      status: "En attente",
    };
    try {
      const send = await axios.post(
        `${API_URL}/api/incidents/createIncident`,
        incident
      );
      if (send.status === 201) {
        showNotificationSuccess("Incident déclaré avec succès");
        created(true);
        setOpen(false);
      }
    } catch (error) {
      handleAxiosErrors(error);
    }
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="space-around"
      spacing={2}
      sx={{
        position: "absolute",
        zIndex: 3,
        mt: 2,
        ml: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#e6e6e6",
        opacity: "0.9",
        width: "fit-content",
        borderRadius: "10px",
      }}
    >
      <Grid item>
        <Box sx={{ display: "flex", alignItems: "start" }}>
          <p style={{ margin: "0" }}>Declaration d'un incident</p>
          <IconButton onClick={handleClick}>
            <ExpandMoreIcon />
          </IconButton>
        </Box>
      </Grid>
      <Collapse in={open}>
        <Grid item>
          <MapLocation
            HighlightOffIcon={HighlightOffIcon}
            CheckCircleOutlineIcon={CheckCircleOutlineIcon}
            red={red}
            green={green}
            locationCallBack={handleLocation}
            error={errors.location}
          />
        </Grid>

        <FormControl
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <InputLabel
            id={`incident-select-label-`}
            sx={{
              mt: 1,
              ml: 3,
              alignItems: "center",
              justifyContent: "center",
              size: "small",
            }}
          >
            Type d'incident
          </InputLabel>
          <Select
            labelId={`incident-select-label-`}
            id={`incident-select-`}
            sx={{ minWidth: 175, mt: 1 }}
            value={selectedIncidents.id || ""}
            onChange={handleIncident}
          >
            {incidents.map((incident, idx) => (
              <MenuItem
                key={idx}
                value={incident.id}
                disabled={selectedIncidents.id === incident.id}
              >
                {incident.type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          onClick={handleSubmit}
          sx={{
            mt: 1,
            backgroundColor: "#3f51b5",
            color: "white",
            "&:hover": {
              backgroundColor: "#5262b5",
              color: "white",
            },
          }}
        >
          Valider
        </Button>
      </Collapse>
    </Grid>
  );
};

export default DeclarationIncident;
