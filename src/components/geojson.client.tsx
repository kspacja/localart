import L from "leaflet";
import { GeoJSON } from "react-leaflet";
import Supercluster, { PointFeature } from "supercluster";

function createClusterIcon(
  point: PointFeature<Supercluster.AnyProps>,
  latlng: L.LatLng
) {
  if (!point.properties.cluster) {
    const icon = L.divIcon({
      html: `<div><span>${(point.properties.name as string)
        .charAt(0)
        .toUpperCase()}</span></div>`,
      className: `marker-cluster marker-cluster-point`,
      iconSize: L.point(40, 40),
    });

    return L.marker(latlng, { icon });
  }

  const count = point.properties.point_count;
  const size = count < 100 ? "small" : count < 1000 ? "medium" : "large";
  const icon = L.divIcon({
    html: `<div><span>${point.properties.point_count_abbreviated}</span></div>`,
    className: `marker-cluster marker-cluster-${size}`,
    iconSize: L.point(40, 40),
  });

  return L.marker(latlng, { icon });
}

export default function GeoJSONLayer({
  data,
  dataKey,
  onFeatureClick,
}: {
  data: GeoJSON.GeoJsonObject;
  dataKey: string;
  onFeatureClick?: (feature: GeoJSON.Feature) => void;
}) {
  return (
    <GeoJSON
      key={dataKey}
      data={data}
      pointToLayer={createClusterIcon}
      onEachFeature={(feature, layer) => {
        layer.on("click", () => {
          onFeatureClick?.(feature);
        });
      }}
    />
  );
}
