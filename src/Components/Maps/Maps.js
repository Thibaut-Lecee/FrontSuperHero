import { GoogleMap, useLoadScript, InfoWindowF } from "@react-google-maps/api";
import React, { useCallback, useEffect } from "react";
import { GOOGLEKEY } from "../../App";
import { getAllHeros, getAllInterventions } from "../Function/AxiosRequest";
import { getDistanceFromLatLonInKm } from "../Function/HelpersFunction";
import Filter from "./Filter";
import MarkerIntervention from "./MarkerIntervention";
import MarkerHero from "./MarkerHero";
const libraries = ["places"];

const Maps = () => {
  const [center, setCenter] = React.useState({ lat: 48.866667, lng: 2.333333 });
  const [heros, setHeros] = React.useState([]);
  const [interventions, setInterventions] = React.useState([]);
  const [selectedHero, setSelectedHero] = React.useState(null);
  const [selectedIntervention, setSelectedIntervention] = React.useState(null);
  const [filteredInterventions, setFilteredInterventions] = React.useState([]); // On stocke les interventions filtrées dans un état
  const [open, setOpen] = React.useState(false);
  const [checked, setChecked] = React.useState(null);
  const [zoom, setZoom] = React.useState(5);
  const mapRef = React.useRef(null);
  const [nearbyHeroes, setNearbyHeroes] = React.useState([]);
  const [interventionMarkers, setInterventionMarkers] = React.useState([]); // On stocke les marqueurs des interventions dans un état
  const [interventionCircles, setInterventionCircles] = React.useState([]);
  const [heroMarkers, setHeroMarkers] = React.useState([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLEKEY,
    libraries,
  });

  const allheros = async () => {
    const herosCall = await getAllHeros();
    setHeros(herosCall);
  };
  const allInterventions = async () => {
    const interventionsCall = await getAllInterventions();
    setInterventions(interventionsCall);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const handleToggle = (value) => () => {
    setChecked(value);
    if (value === "Toutes") {
      setFilteredInterventions(interventions);
    } else {
      const filtered = interventions.filter(
        (intervention) => intervention.status.status === value
      );
      setFilteredInterventions(filtered);
    }
  };

  const handleInterventionClick = (marker, open) => {
    if (open === true) {
      setSelectedIntervention(null);
      setCenter({ lat: 48.866667, lng: 2.333333 });
      setZoom(5);
      setNearbyHeroes([]); // Clear nearby heroes when closing the intervention marker
    } else {
      const [lat, lng] = marker.adresse.split(", ");
      setSelectedIntervention(marker);
      setZoom(10); // Zoom onto the marker
      setCenter({ lat: parseFloat(lat), lng: parseFloat(lng) }); // Center on the marker

      if (marker.status.status === "En attente") {
        // Calculate nearby heroes only if intervention status is "En attente"
        const interventionPosition = {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        };
        const nearby = heros
          .map((hero) => {
            if (hero.adresse) {
              const [heroLat, heroLng] = hero.adresse.split(", ");
              const heroPosition = {
                lat: parseFloat(heroLat),
                lng: parseFloat(heroLng),
              };
              const distance = getDistanceFromLatLonInKm(
                interventionPosition,
                heroPosition
              );
              if (distance <= 100) {
                // If the hero is within a 50 km radius
                return {
                  // Create a new object that includes the hero's name and distance
                  nom: hero.nom,
                  distance,
                };
              }
            }
            return null;
          })
          .filter((hero) => hero !== null); // Filter out any heroes that were not within the radius
        setNearbyHeroes(nearby);
      }
    }
  };

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
    const newCenter = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setCenter(newCenter);
  };

  useEffect(() => {
    if (isLoaded && heros.length > 0 && !isDragging) {
      const filteredHeros = heros.filter((hero) => {
        if (hero.adresse) {
          const [lat, lng] = hero.adresse.split(", ");
          const heroPosition = { lat: parseFloat(lat), lng: parseFloat(lng) };
          const distance = getDistanceFromLatLonInKm(center, heroPosition);
          return distance <= 50; // Filtrer les héros dans le périmètre de 50 km
        }
        return false;
      });

      const markers = filteredHeros.map((hero) => {
        if (hero.adresse) {
          const [lat, lng] = hero.adresse.split(", ");
          const position = { lat: parseFloat(lat), lng: parseFloat(lng) };
          return position;
        }
        return null;
      });
      setHeroMarkers(markers);
    }
  }, [heros, center, isDragging]);

  useEffect(() => {
    if (filteredInterventions.length > 0) {
      const markers = filteredInterventions.map((intervention) => {
        const [lat, lng] = intervention.adresse.split(", ");
        const position = { lat: parseFloat(lat), lng: parseFloat(lng) };
        return {
          position,
          intervention,
          status: intervention.status.status,
        };
      });
      setInterventionMarkers(markers);
    } else {
      const markers = interventions.map((intervention) => {
        const [lat, lng] = intervention.adresse.split(", ");
        const position = { lat: parseFloat(lat), lng: parseFloat(lng) };
        return {
          position,
          intervention,
          status: intervention.status.status,
        };
      });
      setInterventionMarkers(markers);
    }
  }, [filteredInterventions, interventions]);

  useEffect(() => {
    allheros();
    allInterventions();
  }, []);

  return (
    <React.Fragment>
      <Filter
        handleClick={handleClick}
        handleToggle={handleToggle}
        checked={checked}
        open={open}
      />
      {isLoaded && (
        <GoogleMap
          ref={mapRef}
          zoom={zoom}
          center={center}
          mapContainerClassName="map-container"
          onDragStart={handleDragStart}
          onClick={handleDragEnd}
          onLoad={onLoad}
          options={{ disableDefaultUI: true }}
        >
          {interventionMarkers.map((marker, index) => (
            <MarkerIntervention
              key={index}
              marker={marker}
              nearbyHeroes={nearbyHeroes}
              setSelectedIntervention={handleInterventionClick}
            />
          ))}
        </GoogleMap>
      )}
    </React.Fragment>
  );
};
export default Maps;
