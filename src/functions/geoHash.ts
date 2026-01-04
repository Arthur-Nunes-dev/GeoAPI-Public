import ngeohash = require("ngeohash")

interface Props {
  data: {
    lat: number,
    lon: number,
    name: string
  }
};

export async function geoHash ({data}: Props) {
  const {lat, lon} = data;

  const gh7 = ngeohash.encode(lat, lon, 7);
  const gh6 = ngeohash.encode(lat, lon, 6);
  const gh5 = ngeohash.encode(lat, lon, 5);
  const gh4 = ngeohash.encode(lat, lon, 4);
  const gh3 = ngeohash.encode(lat, lon, 3);
  const gh2 = ngeohash.encode(lat, lon, 2);
  const gh1 = ngeohash.encode(lat, lon, 1);

  return {gh7, gh6, gh5, gh4, gh3, gh2, gh1};
}