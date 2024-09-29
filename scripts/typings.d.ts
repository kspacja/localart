/* eslint-disable @typescript-eslint/no-explicit-any */

declare module "geojson" {
  import { FeatureCollection, Feature, Geometry } from "@types/geojson";

  export interface InvalidGeometryError extends Error {
    item: any;
    params: any;
  }

  export type Geoms =
    | "Point"
    | "MultiPoint"
    | "LineString"
    | "MultiLineString"
    | "Polygon"
    | "MultiPolygon"
    | "GeoJSON";

  export interface GeomsParams extends Partial<Record<Geoms, string>> {
    Point?: string | string[];
  }

  export type Data = { [key: string]: any } | any[];

  export interface Params extends GeomsParams {
    doThrows?: {
      invalidGeometry: boolean;
    };
    removeInvalidGeometries?: boolean;
    extraGlobal?: { [key: string]: any };
    extra?: { [key: string]: any };
    crs?: any;
    bbox?: any[];
    include?: string[];
    exclude?: string[];
    isPostgres?: boolean;
    GeoJSON?: string;
  }

  export interface GEOJSON {
    version: string;
    defaults: Params;
    errors: {
      InvalidGeometryError: InvalidGeometryError;
    };
    isGeometryValid(geometry: Geometry): boolean;
    parse<
      D extends Data = any,
      G extends Geometry | null = Geometry,
      P = GeoJsonProperties
    >(
      data: D,
      params?: Params,
      callback?: (
        geojson: D extends any[] ? FeatureCollection<G, P> : Feature<G, P>
      ) => void
    ): D extends any[] ? FeatureCollection<G, P> : Feature<G, P>;
  }

  const GeoJSON: GEOJSON;
  export default GeoJSON;
  export * from "@types/geojson";
}
