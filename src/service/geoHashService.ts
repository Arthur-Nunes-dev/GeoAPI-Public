import { geoHash } from "../functions/geoHash";
import { haversine } from "../functions/haversine";
import { geoHashRepositoryGet, geoHashRepositoryPost } from "../repository/geoHashRepository";
import ngeohash from "ngeohash";
import { selectPrecision } from "../functions/selectPrecision";
import { ErrorDataBase, ErrorNotFound } from "../utils/Errors";

interface Props {
  data: {
    lat: number,
    lon: number,
    name: string,
  }
};

interface PropsGet {
  data: {
    lat: number,
    lon: number,
    radius: number,
  }
};

export async function geoHashServicePost ({data}: Props) {
  const {gh7, gh6, gh5, gh4, gh3, gh2, gh1} = await geoHash({data});
  const {lat, lon, name} = data;
  
  const parameters  = {gh7, gh6, gh5, gh4, gh3, gh2, gh1, name, lat, lon};

  const response = await geoHashRepositoryPost(parameters);

  if (response.error) {
    throw new ErrorDataBase("Error to insert data in database");
  };

  return response.statusText;
};

export async function geoHashServiceGet ({data}: PropsGet) {
  const precision =  Number(await selectPrecision(data.radius));

  const userGH = ngeohash.encode(data.lat, data.lon, precision);
  const neighbors = ngeohash.neighbors(userGH);

  const response = await geoHashRepositoryGet({data: {precision, userGH, neighbors}});

  if (!response) {
    throw new ErrorNotFound("No data found");
  };

  const distanceData = response.map((item) => {
    const {distance} = haversine({
      lat1: data.lat,
      lon1: data.lon,
      lat2: Number(item.latitude),
      lon2: Number(item.longitude)
    });

    const dataResult = {
      id: item.id,
      locateName: item.locateName,
      latitude: item.latitude,
      longitude: item.longitude,
      geoHash: item.geohash,
      distance: Math.round(distance)
    };

    return {...dataResult};
  });

  const filterData = distanceData.filter(item => item.distance <= data.radius);

  return filterData || [];
}