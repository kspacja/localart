import { PointFeature } from "supercluster";
export type ZipCode = `${number}-${number}`;

export interface Artist {
  name: string;
  code: ZipCode;
  lat: number;
  lon: number;
}

export type ArtistPoint = PointFeature<Omit<Artist, "lat" | "lon">>;
