import GeoJSONLayer from "@/components/geojson.client";
import Map from "@/components/map.client";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData, useSubmit } from "@remix-run/react";
import { point } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { ClientOnly } from "remix-utils/client-only";
import Supercluster from "supercluster";

import { getMapFeatures } from "~/data";
import { loader as clusterExpansionZoomLoader } from "~/routes/cluster-expansion-zoom";

export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<{
  geoArtists: (
    | Supercluster.ClusterFeature<Supercluster.AnyProps>
    | Supercluster.PointFeature<Supercluster.AnyProps>
  )[];
  zoom?: number;
  bbox?: [number, number, number, number];
  center?: [number, number];
}> => {
  const url = new URL(request.url);
  const bbox = url.searchParams.get("bbox")?.split(",").map(Number) as
    | [number, number, number, number]
    | undefined;
  const zoom = Number(url.searchParams.get("zoom"));
  const center = url.searchParams.get("center")?.split(",").map(Number) as
    | [number, number]
    | undefined;

  if (
    bbox &&
    bbox.length === 4 &&
    zoom &&
    zoom > 0 &&
    center &&
    center.length === 2
  ) {
    const geoArtists = getMapFeatures(bbox, zoom);

    return {
      geoArtists,
      bbox,
      zoom,
      center,
    };
  }

  return {
    geoArtists: [],
    zoom: undefined,
    bbox: undefined,
    center: undefined,
  };
};

export default function Index() {
  const { geoArtists, zoom, bbox, center } = useLoaderData<typeof loader>();
  const sumbit = useSubmit();
  const mapRef = useRef<L.Map | null>(null);

  const fetcher = useFetcher<typeof clusterExpansionZoomLoader>({
    key: "cluster-expansion-zoom",
  });

  const [nextCenter, setNextCenter] = useState<[number, number]>();

  useEffect(() => {
    if (mapRef.current && fetcher.data && nextCenter) {
      mapRef.current.setView(nextCenter, fetcher.data.zoom);
    }
  }, [fetcher.data]);

  const points = geoArtists.filter((feature) => !feature.properties.cluster);
  const theSamePoints = points.reduce((acc, point, index) => {
    const { code } = point.properties as { code: string };
    if (!acc[code]) {
      acc[code] = [index];
    } else {
      acc[code].push(index);
    }
    return acc;
  }, {} as Record<string, number[]>);

  Object.values(theSamePoints).forEach((indexes) => {
    if (indexes.length > 1) {
      indexes.forEach((index, i) => {
        const coor = points[index].geometry.coordinates;
        let factor = i - Math.floor(indexes.length / 2);
        factor = factor === 0 ? 1 : factor;

        points[index].geometry.coordinates = [
          coor[0] + factor * 0.0001,
          coor[1] + factor * 0.0001,
        ];
      });
    }
  });

  const clusters = geoArtists.filter((feature) => feature.properties.cluster);

  return (
    <>
      <ClientOnly>
        {() => (
          <Map
            setMap={(map) => {
              mapRef.current = map;
            }}
            zoom={zoom}
            center={center}
            onUpdate={(bbox, zoom, center) => {
              sumbit({ bbox, zoom, center });
            }}
          >
            {geoArtists && (
              <GeoJSONLayer
                dataKey={JSON.stringify({ bbox, zoom })}
                data={
                  [...points, ...clusters] as unknown as GeoJSON.GeoJsonObject
                }
                onFeatureClick={(feature) => {
                  if (feature.properties?.cluster) {
                    // @ts-expect-error -- TS doesn't know about the supercluster types
                    const [lng, lat] = feature.geometry.coordinates as [
                      number,
                      number
                    ];

                    setNextCenter([lat, lng]);

                    fetcher.submit(
                      {
                        clusterId: feature.properties.cluster_id,
                      },
                      {
                        action: "/cluster-expansion-zoom",
                      }
                    );
                  }
                }}
              />
            )}
          </Map>
        )}
      </ClientOnly>
    </>
  );
}
