import { Marker, Popup } from "react-leaflet";

export default function LocalMarker({
  name,
  position,
}: {
  name: string;
  position: [number, number];
}) {
  return (
    <Marker position={position}>
      <Popup>{name}</Popup>
    </Marker>
  );
}
