// const handleIntervention = (interventions) => {
//   // Si des interventions sont sélectionnées
//   if (interventions && interventions.length > 0) {
//     interventions.forEach((intervention) => {
//       // Filtrer les héros qui correspondent au type d'intervention
//       const compatibleHeros = heros.filter((hero) =>
//         hero.incidents.some(
//           (incident) => incident.type === intervention.incident.type
//         )
//       );
//       // Créer des marqueurs pour chaque héros compatible
//       const markers = compatibleHeros.map((hero) => {
//         const [lat, lng] = hero.adresse.split(", ");
//         const position = { lat: parseFloat(lat), lng: parseFloat(lng) };
//         return {
//           position,
//           status: intervention.status.status,
//           hero,
//           intervention,
//         };
//       });
//       setHeroMarkers(markers);
//     });
//   }
// };

// const filterHerosForIntervention = (intervention) => {
//   if (intervention.status.status !== "En attente") return [];

//   const interventionPosition = {
//     lat: intervention.adresse.split(", ")[0],
//     lng: intervention.adresse.split(", ")[1],
//   };

//   const filteredHeros = heros
//     .mp((hero) => {
//       if (
//         hero.adresse &&
//         hero.incidents.some(
//           (incident) => incident.type === intervention.incident.type
//         )
//       ) {
//         const [lat, lng] = hero.adresse.split(", ");
//         const heroPosition = { lat: parseFloat(lat), lng: parseFloat(lng) };
//         const distance = getDistanceFromLatLonInKm(
//           interventionPosition,
//           heroPosition
//         );
//         // n'excluez pas les héros en fonction de leur distance
//         return { hero, distance }; // renvoyer un objet avec le héros et la distance
//       }
//       return null;
//     })
//     .filter((item) => item !== null); // filtrer les nulls

//   return filteredHeros;
// };

// useEffect(() => {
//   if (
//     selectedIntervention &&
//     selectedIntervention.intervention.status.status === "En attente"
//   ) {
//     const interventionPosition = selectedIntervention.position;
//     const circles = [
//       { center: interventionPosition, radius: 10000 },
//       { center: interventionPosition, radius: 25000 },
//       { center: interventionPosition, radius: 50000 },
//     ];
//     setInterventionCircles(circles);
//     const nearby = filterHerosForIntervention(
//       selectedIntervention.intervention
//     );
//     setNearbyHeroes(nearby);
//   } else {
//     setInterventionCircles([]);
//     setNearbyHeroes([]);
//   }
// }, [selectedHero]);

// useEffect(() => {
//   if (
//     selectedHero &&
//     selectedHero.intervention.status.status === "En attente"
//   ) {
//     const nearby = filterHerosForIntervention(selectedHero.intervention);
//     setNearbyHeroes(nearby);
//   } else {
//     setNearbyHeroes([]);
//   }
// }, [selectedHero]);

{
  /* <MarkerHero nearbyHeroes={nearbyHeroes} /> */
}

{
  /* {selectedHero && (
            <InfoWindowF
              position={selectedHero.position}
              onClick={() => setZoom(15)}
              onCloseClick={() => handleClose(null, 6, true)}
            >
              <div>
                <h2>Superhero: {selectedHero.hero.nom}</h2>
                <p>Status: {selectedHero.hero.status}</p>
              </div>
            </InfoWindowF>
          )} */
}
{
  /* {selectedIntervention && (
            <InfoWindowF
              position={selectedIntervention.position}
              onClick={() => setZoom(15)}
              onCloseClick={() => handleClose(null, 6, false)}
            >
              <div>
                <h2>Superhero: {selectedIntervention.hero.nom} </h2>
                <p>
                  Intervention:{" "}
                  {selectedIntervention.intervention.incident.type}
                </p>
                <p>Status: {selectedIntervention.status}</p>
                {selectedIntervention.status === "En attente" && (
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
          )} */
}
