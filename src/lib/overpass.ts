// Example: Query cemeteries using the Overpass API (OpenStreetMap)

export async function fetchCemeteriesInArea(areaName: string) {
  const query = `
    [out:json];
    area[name="${areaName}"]->.searchArea;
    (
      node["amenity"="grave_yard"](area.searchArea);
      way["amenity"="grave_yard"](area.searchArea);
      relation["amenity"="grave_yard"](area.searchArea);
    );
    out body;
    >;
    out skel qt;
  `;

  const url = "https://overpass-api.de/api/interpreter";
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!response.ok) {
    throw new Error(`Overpass API error: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

// Usage example (in a Next.js page or API route):
// const cemeteries = await fetchCemeteriesInArea("London");
// console.log(cemeteries);
