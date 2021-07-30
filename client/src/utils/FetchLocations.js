import { OpenStreetMapProvider } from "leaflet-geosearch";

const provider = new OpenStreetMapProvider({
  params: {
    countrycodes: "sg",
  },
});

export const FetchLocations = (text) => {
  return provider.search({ query: `${text}` });
};
