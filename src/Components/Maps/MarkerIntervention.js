import { CircleF, InfoWindowF, MarkerF } from "@react-google-maps/api";
import React from "react";
import { farOptions } from "./CircleOptions";
import { Icon } from "@mui/material";
const MarkerIntervention = ({
  marker,
  setSelectedIntervention,
  nearbyHeroes,
}) => {
  const [open, setOpen] = React.useState(false);
  const { position, intervention } = marker;
  const handleClick = () => {
    setOpen(!open);
    setSelectedIntervention(intervention, open);
  };
  console.log(nearbyHeroes);
  return (
    <>
      <MarkerF
        position={position}
        icon={{
          url: `${marker.intervention.incident.svg}`,
          scaledSize: new window.google.maps.Size(60, 60),
        }}
        onClick={handleClick}
      >
        {open && (
          <InfoWindowF onCloseClick={handleClick}>
            <div>
              <h2>Type d'incident: {marker.intervention.incident.type}</h2>
              <p>Statut de l'incident: {marker.intervention.status.status}</p>
              <p>
                Héro:{" "}
                {marker.intervention.status.superhero !== null
                  ? marker.intervention.status.superhero.nom
                  : "Pas de héro"}
              </p>
              {/* <p> {hero.nom} + {hero.distance.toFixed(2)} km</p> */}
            </div>
          </InfoWindowF>
        )}
      </MarkerF>
      {open && (
        <CircleF
          center={position}
          options={farOptions}
          radius={50000}
          onClick={handleClick}
        />
      )}
    </>
  );
};

export default MarkerIntervention;
