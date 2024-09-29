import { ActionFunctionArgs } from "@remix-run/node";
import { getClusterExpansionZoom } from "~/data";

export const loader = async ({ request }: ActionFunctionArgs) => {
  const url = new URL(request.url);
  const clusterId = url.searchParams.get("clusterId");

  return {
    zoom: getClusterExpansionZoom(Number(clusterId)),
  };
};
