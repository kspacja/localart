import { MapContainer, TileLayer, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLng } from "leaflet";
import { useEffect } from "react";

type OnUpdateMap = (
  bbox: GeoJSON.BBox,
  zoom: number,
  center: [number, number]
) => void;

function latlngToExpression(latlng: LatLng): [number, number] {
  return [latlng.lat, latlng.lng];
}

function boundsToBbox(bounds: L.LatLngBounds): GeoJSON.BBox {
  return [
    bounds.getWest(),
    bounds.getSouth(),
    bounds.getEast(),
    bounds.getNorth(),
  ];
}

function MapController({ onUpdate }: { onUpdate: OnUpdateMap }) {
  const map = useMapEvent("zoom", () => {
    console.log("zoom");
    onUpdate(
      boundsToBbox(map.getBounds()),
      map.getZoom(),
      latlngToExpression(map.getCenter())
    );
  });

  useMapEvent("moveend", () => {
    console.log("moveend");
    onUpdate(
      boundsToBbox(map.getBounds()),
      map.getZoom(),
      latlngToExpression(map.getCenter())
    );
  });

  // useMapEvent("load", () => {
  //   console.log("load");
  //   onUpdate(boundsToBbox(map.getBounds()), map.getZoom(), latlngToExpression(map.getCenter()));
  // });

  useEffect(() => {
    console.log("init");
    onUpdate(
      boundsToBbox(map.getBounds()),
      map.getZoom(),
      latlngToExpression(map.getCenter())
    );
  }, []);

  return null;
}

export default function Map({
  children,
  onUpdate,
  zoom = 9,
  center = [-122.6765, 45.5231],
  setMap,
}: {
  children?: React.ReactNode;
  onUpdate: OnUpdateMap;
  zoom?: number;
  center?: [number, number];
  setMap?: (map: L.Map | null) => void;
}) {
  return (
    <div style={{ height: "90vh" }}>
      <MapContainer
        zoom={zoom}
        center={center}
        scrollWheelZoom={false}
        ref={(ref) => setMap?.(ref)}
        style={{ height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController onUpdate={onUpdate} />
        {children}
      </MapContainer>
    </div>
  );
}
