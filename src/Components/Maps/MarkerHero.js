import { MarkerF } from "@react-google-maps/api";
import React from "react";

const MarkerHero = ({ nearbyHeroes }) => {
  return (
    <>
      {nearbyHeroes.map((hero, index) => {
        const [lat, lng] = hero.hero.adresse.split(", ");
        const position = { lat: parseFloat(lat), lng: parseFloat(lng) };
        return (
          <MarkerF
            key={index}
            position={position}
            icon={{
              url: `${hero.hero.svg}`, // Vous pouvez changer ceci pour utiliser une image de marqueur personnalisée pour les héros à proximité
              scaledSize: new window.google.maps.Size(50, 50),
            }}
          />
        );
      })}
    </>
  );
};

export default MarkerHero;
