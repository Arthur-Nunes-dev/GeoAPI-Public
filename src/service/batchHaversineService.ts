import { calculateBatchHaversine } from "../functions/calculateBatchHaversine";
import { ErrorServer } from "../utils/Errors";

type Props = {
  data: {
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  }[]
};

export async function batchHaversineService ({data}: Props) {
  const results = await calculateBatchHaversine({data});

  if (!results) {
    throw new ErrorServer("Error calculating distances");
  };

  return results;
};