// Fonction utilitaire pour calculer la distance entre deux coordonnées
export const getDistanceFromLatLonInKm = (position1, position2) => {
  const R = 6371; // Rayon de la Terre en kilomètres
  const lat1 = deg2rad(position1.lat);
  const lat2 = deg2rad(position2.lat);
  const lon1 = deg2rad(position1.lng);
  const lon2 = deg2rad(position2.lng);

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};
