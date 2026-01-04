import { supabase } from "../config/supabase";
import { ErrorDataBase } from "../utils/Errors";

type Props = {
  gh7: string,
  gh6: string,
  gh5: string,
  gh4: string,
  gh3: string,
  gh2: string,
  gh1: string,
  name: string,
  lat: number,
  lon: number
};

interface PropsGet {
  data: {
    precision: number,
    userGH: string,
    neighbors: string[],  
  }
}

export async function geoHashRepositoryPost (parameters: Props) {
  try {
    const response = await supabase
    .from("geohashs")
    .insert({
      latitude: parameters.lat,
      longitude: parameters.lon,
      geohash: parameters.gh7,
      gh6: parameters.gh6,
      gh5: parameters.gh5,
      gh4: parameters.gh4,
      gh3: parameters.gh3,
      gh2: parameters.gh2,
      gh1: parameters.gh1,
      locateName: parameters.name
    });

    return response;
  } catch (error) {
    throw error;
  }
}

export async function geoHashRepositoryGet ({data}: PropsGet) {
  const table = {
    7: "geohashs",
    6: "gh6",
    5: "gh5",
    4: "gh4",
    3: "gh3",
    2: "gh2",
    1: "gh1",
  };

  const tableName = table[data.precision as keyof typeof table];

  if (!tableName)  {
    throw new ErrorDataBase("Precision not found");
  };

  try {
    const result = await supabase
    .from("geohashs")
    .select("*")
    .in(tableName, [data.userGH, data.neighbors]);

    if (result.error) {
      throw new ErrorDataBase("Error to get data in database");
    };

    return result.data;
  } catch (error) {
    throw error;
  };
};