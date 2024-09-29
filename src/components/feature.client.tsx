// import L from 'leaflet';
// import Supercluster from 'supercluster';
// import {PointFeature} from 'supercluster';
// function createClusterIcon(
//   point: PointFeature<Supercluster.AnyProps>,
//   latlng: L.LatLng
// ) {
//   if (!point.properties.cluster) return L.marker(latlng);

//   const count = point.properties.point_count;
//   const size = count < 100 ? "small" : count < 1000 ? "medium" : "large";
//   const icon = L.divIcon({
//     html: `<div><span>${point.properties.point_count_abbreviated}</span></div>`,
//     className: `marker-cluster marker-cluster-${size}`,
//     iconSize: L.point(40, 40),
//   });

//   return L.marker(latlng, { icon });
// }

export default function Feature() {}
