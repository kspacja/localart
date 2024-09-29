import * as path from "path";
import * as fs from "fs";

type LocationData = {
  place_id: number;
  licence: string;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: [string, string, string, string];
};

async function delay(ms = 500) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined);
    }, ms);
  });
}

async function fetchGeoData(code: string, retry = 0) {
  console.log(`Fetching data for ${code}...`);
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${code}+Polska&format=json`
    );

    if (!res.ok) {
      console.log("Retrying in 500ms...");
      await delay(400);
      return fetchGeoData(code, retry + 1);
    }

    const [json] = (await res.json()) as LocationData[];

    return json ?? {};
  } catch (error) {
    if (retry > 3) {
      throw error;
    }

    console.log("Retrying in 500ms...");
    await delay(400);
    return fetchGeoData(code, retry + 1);
  }
}

async function readCodes() {
  const csvFilePath = path.resolve(__dirname, "codes.csv");

  const fileContent = fs.readFileSync(csvFilePath, { encoding: "utf-8" });

  const [, ...lines] = fileContent.split("\n");

  const mappedLines = lines
    .map((line) => {
      const [code] = line.split(";");
      return code;
    })
    .filter(Boolean);

  const codeSet = new Set(mappedLines);

  console.log(`Total codes: ${mappedLines.length}`);
  console.log(`Unique codes: ${codeSet.size}`);

  const results = [];
  let i = 1;

  for (const code of codeSet) {
    const data = await fetchGeoData(code);
    const { lat, lon, boundingbox, display_name } = data;

    results.push({ code, lat, lon, boundingbox, address: display_name });

    if (i % 10000 === 0) {
      fs.writeFileSync(
        `results-${Math.floor(i / 10000)}.json`,
        JSON.stringify(results, null, 2),
        {
          encoding: "utf-8",
        }
      );

      results.length = 0;
    }

    i += 1;
  }

  fs.writeFileSync("results.json", JSON.stringify(results, null, 2), {
    encoding: "utf-8",
  });
}

readCodes();
