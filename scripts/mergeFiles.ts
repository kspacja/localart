import * as path from "path";
import * as fs from "fs";

function mergeFiles() {
  const results = [];

  for (let i = 1; i <= 3; i++) {
    const filePath = path.resolve(__dirname, `results-${i}.json`);

    const fileContent = fs.readFileSync(filePath, { encoding: "utf-8" });

    const data = JSON.parse(fileContent);

    results.push(...data);
  }

  fs.writeFileSync("merged-results.json", JSON.stringify(results, null, 2), {
    encoding: "utf-8",
  });

  // Transform to Map

  const resultsMap = {} as Record<string, unknown>;

  for (const item of results) {
    resultsMap[item.code] = item;
  }

  fs.writeFileSync("results-map.json", JSON.stringify(resultsMap, null, 2), {
    encoding: "utf-8",
  });

  console.log("Files merged successfully!");
}

mergeFiles();
