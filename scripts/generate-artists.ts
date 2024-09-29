import { faker } from "@faker-js/faker";

import unknownData from "../data/codes-map.json";
import * as fs from "fs";

type CodeData = {
  code: string;
  lat?: string;
  lon?: string;
  boundingbox?: string[];
  address?: string;
};

const codesMap = unknownData as Record<string, CodeData>;

function main() {
  const codes = Object.keys(codesMap);

  const artists = Array.from({ length: 10000 }, (_, index) => {
    const code = codes[(index * 30) % codes.length];

    return {
      name: faker.internet.userName(),
      code,
      lat: Number(codesMap[code].lat),
      lon: Number(codesMap[code].lon),
    };
  });

  // const geoData = GeoJSON.parse(artists, {
  //   Point: ["lat", "lon"],
  // });

  fs.writeFileSync("data/artists.json", JSON.stringify(artists, null, 2), {
    encoding: "utf-8",
  });
}

main();
