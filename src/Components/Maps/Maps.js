import { Controls, Player } from "@lottiefiles/react-lottie-player";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import React, { useEffect, useMemo } from "react";
import { GOOGLEKEY } from "../../App";
const libraries = ["places"];
const Maps = () => {
  const center = useMemo(() => ({ lat: 48.866667, lng: 2.333333 }), []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLEKEY,
    libraries,
  });

  useEffect(() => {
    console.log("isLoaded", isLoaded);
  }, [isLoaded]);

  return (
    <React.Fragment>
      {isLoaded ? (
        <GoogleMap
          zoom={8}
          center={center}
          mapContainerClassName="map-container"
        />
      ) : (
        <Player
          autoplay
          loop
          src="https://assets1.lottiefiles.com/packages/lf20_poqmycwy.json"
          style={{ height: "300px", width: "300px" }}>
          <Controls visible={false} />
        </Player>
      )}
    </React.Fragment>
  );
};

export default Maps;
