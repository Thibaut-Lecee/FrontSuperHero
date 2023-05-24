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
  const [statusFilter, setStatusFilter] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [checked, setChecked] = React.useState(null);
  const [zoom, setZoom] = React.useState(5);
  const mapRef = React.useRef(null);
  const [nearbyHeroes, setNearbyHeroes] = React.useState([]);
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
    setStatusFilter(value); // Ici on met à jour le filtre de statut
  };

  const handleClose = (value, zoom) => {
    setSelectedHero(value);
    if (value !== null) {
      setCenter(value.position);
    } else {
      setCenter({ lat: 48.856614, lng: 2.3522219 });
    }
    handleIntervention(interventions, statusFilter);
    setZoom(zoom);
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

  const filterHerosForIntervention = (intervention) => {
    if (intervention.status.status !== "En attente") return [];

    const interventionPosition = {
      lat: intervention.adresse.split(", ")[0],
      lng: intervention.adresse.split(", ")[1],
    };
    const filteredHeros = heros
      .map((hero) => {
        if (hero.adresse) {
          const [lat, lng] = hero.adresse.split(", ");
          const heroPosition = { lat: parseFloat(lat), lng: parseFloat(lng) };
          const distance = getDistanceFromLatLonInKm(
            interventionPosition,
            heroPosition
          );
          if (distance <= 400) {
            // filtrer les héros dans un rayon de 50 km
            return { hero, distance }; // renvoyer un objet avec le héros et la distance
          }
        }
        return null;
      })
      .filter((item) => item !== null); // filtrer les nulls
    return filteredHeros;
  };

  useEffect(() => {
    if (isLoaded && heros.length > 0 && !isDragging) {
      const filteredHeros = heros.filter((hero) => {
        if (hero.adresse) {
          const [lat, lng] = hero.adresse.split(", ");
          const heroPosition = { lat: parseFloat(lat), lng: parseFloat(lng) };
          const distance = getDistanceFromLatLonInKm(center, heroPosition);
          return distance <= 200; // Filtrer les héros dans le périmètre de 50 km
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
    if (
      selectedHero &&
      selectedHero.intervention.status.status === "En attente"
    ) {
      const nearby = filterHerosForIntervention(selectedHero.intervention);
      setNearbyHeroes(nearby);
    } else {
      setNearbyHeroes([]);
    }
  }, [selectedHero]);

  const handleIntervention = (interventions, statusFilter) => {
    if (interventions.length > 0 && statusFilter) {
      const filteredInterventions = interventions.filter(
        (intervention) => statusFilter === intervention.status.status
      );
      const markers = filteredInterventions.map((intervention) => {
        const [lat, lng] = intervention.superhero.adresse.split(", ");
        const position = { lat: parseFloat(lat), lng: parseFloat(lng) };
        return {
          position,
          status: intervention.status.status,
          hero: intervention.superhero,
          intervention: intervention,
        };
      });
      setHeroMarkers(markers);
    } else {
      const filteredInterventions = interventions.filter(
        (intervention) =>
          (intervention.status.status === "En cours" ||
            intervention.status.status === "En attente") &&
          intervention.superhero // le héros est présent
      );
      const markers = filteredInterventions.map((intervention) => {
        const [lat, lng] = intervention.superhero.adresse.split(", ");
        const position = { lat: parseFloat(lat), lng: parseFloat(lng) };
        return {
          position,
          status: intervention.status.status,
          hero: intervention.superhero,
          intervention: intervention,
        };
      });
      setHeroMarkers(markers);
    }
  };
  useEffect(() => {
    handleIntervention(interventions, statusFilter);
  }, [interventions, statusFilter, selectedHero]);

  useEffect(() => {
    allheros();
    allInterventions();
  }, []);
  useEffect(() => {
    if (
      selectedHero &&
      selectedHero.intervention.status.status === "En attente"
    ) {
      const interventionPosition = selectedHero.position;
      const circles = [
        { center: interventionPosition, radius: 10000 },
        { center: interventionPosition, radius: 25000 },
        { center: interventionPosition, radius: 50000 },
      ];
      setInterventionCircles(circles);
      const nearby = filterHerosForIntervention(selectedHero.intervention);
      setNearbyHeroes(nearby);
    } else {
      setInterventionCircles([]);
      setNearbyHeroes([]);
    }
  }, [selectedHero]);

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
          <MarkerIntervention
            heroMarkers={heroMarkers}
            handleClose={handleClose}
            selectedHero={selectedHero}
            interventionCircles={interventionCircles}
          />

          <MarkerHero nearbyHeroes={nearbyHeroes} />

          {selectedHero && (
            <InfoWindowF
              position={selectedHero.position}
              onClick={() => setZoom(15)}
              onCloseClick={() => handleClose(null, 6)}
            >
              <div>
                <h2>Superhero: {selectedHero.hero.nom}</h2>
                <p>Incident: {selectedHero.intervention.incident.type}</p>
                <p>Status: {selectedHero.intervention.status.status}</p>
                {selectedHero.intervention.status.status === "En attente" && (
                  <div>
                    <h3>SuperHéros à proximité :</h3>
                    <ul>
                      {nearbyHeroes.length > 0 ? (
                        nearbyHeroes.map((item) => (
                          <li key={item.hero.id}>
                            {item.hero.nom} - Distance:{" "}
                            {item.distance.toFixed(2)} km
                          </li>
                        ))
                      ) : (
                        <li>Aucun superhéros dans un périmètre de 50km</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </InfoWindowF>
          )}
        </GoogleMap>
      )}
    </React.Fragment>
  );
};
export default Maps;
