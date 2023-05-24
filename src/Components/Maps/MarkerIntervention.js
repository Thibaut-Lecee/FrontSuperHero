import { CircleF, MarkerF } from "@react-google-maps/api";
import React from "react";
import { farOptions } from "./CircleOptions";
const MarkerIntervention = ({
  heroMarkers,
  handleClose,
  selectedHero,
  interventionCircles,
}) => {
  return (
    <>
      {heroMarkers.map(
        (marker, index) =>
          marker.position && (
            <MarkerF
              key={index}
              position={marker.position}
              onClick={() => handleClose(marker, 10)}
              icon={{
                url: `${marker.intervention.incident.svg}`,
                scaledSize: new window.google.maps.Size(50, 50), // La taille peut être ajustée
              }}
            />
          )
      )}
      {selectedHero &&
        interventionCircles.map((circle, index) => (
          <CircleF
            key={index}
            center={circle.center}
            radius={circle.radius}
            options={farOptions}
          />
        ))}
    </>
  );
};

export default MarkerIntervention;
