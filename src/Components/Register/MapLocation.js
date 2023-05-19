import React from "react";
import { StandaloneSearchBox, useLoadScript } from "@react-google-maps/api";
import { GOOGLEKEY } from "../../App";
import { TextField } from "@mui/material";
const libraries = ["places"];
const MapLocation = ({
  locationCallBack,
  error,
  HighlightOffIcon,
  CheckCircleOutlineIcon,
  red,
  green,
}) => {
  const [searchBox, setSearchBox] = React.useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLEKEY,
    libraries,
  });

  const handleLocation = () => {
    if (searchBox) {
      const place = searchBox.getPlaces()[0];
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      locationCallBack(lat, lng);
    }
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <StandaloneSearchBox
      onLoad={(ref) => setSearchBox(ref)}
      onPlacesChanged={handleLocation}>
      <TextField
        margin="normal"
        required
        fullWidth
        name="adresse"
        label="Adresse"
        type="text"
        id="adresse"
        error={error !== ""}
        helperText={error}
        InputProps={{
          endAdornment: error ? (
            <HighlightOffIcon style={{ color: red[500] }} />
          ) : (
            <CheckCircleOutlineIcon style={{ color: green[500] }} />
          ),
        }}
        FormHelperTextProps={{
          style: {
            color: error ? red[500] : green[500],
          },
        }}
      />
    </StandaloneSearchBox>
  );
};

export default MapLocation;
