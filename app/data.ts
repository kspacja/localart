import { Artist, ArtistPoint } from "@/types";
import GeoJSON from "geojson";
import unknownData from "../data/artists.json";
import Supercluster from "supercluster";

const data = unknownData as Artist[];

const geoArtists = GeoJSON.parse(data, { Point: ["lat", "lon"] });

const points = geoArtists.features as ArtistPoint[];

const supercluster = new Supercluster({
  radius: 60,
  extent: 256,
  maxZoom: 17,
}).load(points);

export function getMapFeatures(bbox: GeoJSON.BBox, zoom: number) {
  return supercluster.getClusters(bbox, zoom);
}

export function getClusterExpansionZoom(clusterId: number) {
  return supercluster.getClusterExpansionZoom(clusterId);
}
