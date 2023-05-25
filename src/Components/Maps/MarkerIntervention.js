import {
  CircleF,
  DirectionsRenderer,
  InfoWindowF,
  MarkerF,
} from "@react-google-maps/api";
import React from "react";
import { farOptions } from "./CircleOptions";
const MarkerIntervention = ({
  marker,
  setSelectedIntervention,
  nearbyHeroes,
}) => {
  const [open, setOpen] = React.useState(false);
  const [openHero, setOpenHero] = React.useState(false);
  const [selectedHero, setSelectedHero] = React.useState(null);
  const { position, intervention } = marker;
  const [direction, setDirection] = React.useState(null);
  const [duration, setDuration] = React.useState(null);
  const handleClick = () => {
    setOpen(!open);
    if (openHero) setOpenHero(!openHero);
    setSelectedIntervention(intervention, open);
  };

  const handleHero = (hero) => {
    if (selectedHero !== hero) {
      handleDirections(hero.position);
      setSelectedHero(hero);
      setOpenHero(true);
    } else {
      setDirection(null);
      setDuration(null);
      setSelectedHero(null);
      setOpenHero(false);
    }
  };
  const handleDirections = (hero) => {
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: position,
        destination: hero,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK && result) {
          setDirection(result);
          setDuration(result.routes[0].legs[0].duration.text);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };
  return (
    <>
      <MarkerF
        key={marker.intervention.id}
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
                  : "Pas de héro encore présent"}
              </p>
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
      {open &&
        nearbyHeroes.map((hero, index) => {
          return (
            <MarkerF
              position={hero.position}
              key={index}
              icon={{
                url: `http://localhost:4000/assets/Heros/IconHero.png`,
                scaledSize: new window.google.maps.Size(60, 60),
              }}
              onClick={() => handleHero(hero)}
            >
              {openHero && selectedHero === hero && (
                <InfoWindowF>
                  <div>
                    <h2>Super héro: {hero.nom}</h2>
                    <p>
                      Se trouve actuellement à {hero.distance.toFixed(2)} km de
                      l'incident
                    </p>
                    <p>Contacter le au {hero.phone}</p>
                    <p>Temps de trajet: {duration}</p>
                  </div>
                </InfoWindowF>
              )}
              {selectedHero === hero && direction && (
                <DirectionsRenderer
                  options={{
                    polylineOptions: {
                      zIndex: 50,
                      strokeColor: "#1976D2",
                      strokeWeight: 5,
                    },
                  }}
                  directions={direction}
                />
              )}
            </MarkerF>
          );
        })}
    </>
  );
};

export default MarkerIntervention;
