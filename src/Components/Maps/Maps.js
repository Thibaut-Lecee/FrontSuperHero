import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import React, { useCallback, useEffect } from "react";
import { API_URL, GOOGLEKEY } from "../../App";
import {
  getAllHeros,
  getAllInterventions,
  handleAxiosErrors,
} from "../Function/AxiosRequest";
import { getDistanceFromLatLonInKm } from "../Function/HelpersFunction";
import Filter from "./Filter";
import MarkerIntervention from "./MarkerIntervention";
import { Toaster } from "react-hot-toast";
import DeclarationIncident from "./DeclarationIncident";
import axios from "axios";
const libraries = ["places"];

const Maps = () => {
  const [center, setCenter] = React.useState({ lat: 48.866667, lng: 2.333333 });
  const [heros, setHeros] = React.useState([]);
  const [interventions, setInterventions] = React.useState([]);
  const [filteredInterventions, setFilteredInterventions] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [checked, setChecked] = React.useState(null);
  const [zoom, setZoom] = React.useState(5);
  const mapRef = React.useRef(null);
  const [created, setCreated] = React.useState(false);
  const [nearbyHeroes, setNearbyHeroes] = React.useState([]);
  const [selectedIntervention, setSelectedIntervention] = React.useState(null);
  const [interventionMarkers, setInterventionMarkers] = React.useState([]);
  const [incidents, setIncidents] = React.useState([]);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLEKEY,
    libraries,
  });

  const getAllIncidents = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/incidents/allIncidents`,
        {
          Headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setIncidents(response.data.incidents);
    } catch (error) {
      handleAxiosErrors(error);
    }
  };
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

  const handleToggle = useCallback(
    (value) => () => {
      console.log(value, checked, created);
      setChecked(value);
      if (value === "Toutes" || created === true) {
        setFilteredInterventions(interventions);
        setZoom(5);
      } else {
        const filtered = interventions.filter(
          (intervention) => intervention.status.status === value
        );

        setFilteredInterventions(filtered);
        setZoom(5);
      }
    },
    [created, interventions, checked]
  );

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

              if (
                distance <= 50 &&
                hero.incidents.find(
                  (incident) => incident.type === marker.incident.type
                )
              ) {
                return {
                  nom: hero.nom,
                  svg: hero.svg,
                  phone: hero.phoneNumber,
                  position: heroPosition,
                  distance,
                };
              }
            }

            return null;
          })
          .filter((hero) => hero !== null); // Filter heros where distance is > 50 km
        setNearbyHeroes(nearby);
      }
    }
  };

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

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
  }, [filteredInterventions, interventions, created]);

  useEffect(() => {
    allheros();
    allInterventions();
    getAllIncidents();
    setCreated(false);
  }, [created]);

  // Declarationincident
  return (
    <React.Fragment>
      <Toaster />
      <Filter
        handleClick={handleClick}
        handleToggle={handleToggle}
        checked={checked}
        open={open}
      />
      <DeclarationIncident incidents={incidents} created={setCreated} />
      {isLoaded && (
        <GoogleMap
          ref={mapRef}
          zoom={zoom}
          center={center}
          mapContainerClassName="map-container"
          onLoad={onLoad}
          options={{ disableDefaultUI: true }}
        >
          {interventionMarkers.map((marker) => (
            <MarkerIntervention
              key={marker.id}
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
