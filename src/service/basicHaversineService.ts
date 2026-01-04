import { haversine } from "../functions/haversine";
import { ErrorServer } from "../utils/Errors";

type Props = {
  data: {
    from: { lat: number,  lon: number },
    to: { lat: number, lon: number }
  }
};

export async function basicHaversineService ({data}: Props) {
  const lat1 = data.from.lat;
  const lon1 = data.from.lon;
  const lat2 = data.to.lat;
  const lon2 = data.to.lon;

  const result = haversine({lat1, lon1, lat2, lon2});

  if (!result) {
    throw new ErrorServer("Error in calculate harversine");
  };

  return result;
};