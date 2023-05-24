import { InfoWindowF } from "@react-google-maps/api";
import React from "react";

const InformationWindow = ({ marker, setZoom }) => {
  return (
    <InfoWindowF
      position={marker.position}
      onClick={setZoom(15)}
      options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
    >
      <div className="info-window"></div>
    </InfoWindowF>
  );
};

export default InformationWindow;
