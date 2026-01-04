import { Request, Response } from "express";
import { geoHashServiceGet, geoHashServicePost } from "../service/geoHashService";
import { ErrorDataBase, ErrorNotFound } from "../utils/Errors";

export async function geoHashControllerPost (req: Request, res: Response) {
  try {
    const {data} = req.body;

    const response = await geoHashServicePost({data});

    if (!response) {
      throw new Error("Error to create geohash");
    };

    return res.status(201).json(response);
  } catch (error) {

    if (error instanceof ErrorDataBase) {
      return res.status(500).json({Message: error.message});
    };

    const errorMessage = error instanceof Error ? error.message : 'Internal API Error';

    return res.status(500).json({Message: errorMessage});
  };
};

export async function geoHashControllerGet (req: Request, res: Response) {
  try {
    const lat = req.query.lat;
    const lon = req.query.lon;
    const radius = req.query.radius;

    const data = {
      lat: Number(lat),
      lon: Number(lon),
      radius: Number(radius),
    }

    const response = await geoHashServiceGet({data});

    if (response.length == 0) {
      throw new ErrorNotFound("Data not found in the radius");
    };

    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof ErrorNotFound) {
      return res.status(error.code).json({Message: error.message});
    };

    if (error instanceof ErrorDataBase) {
      return res.status(error.code).json({Message: error.message});
    };

    const errorMessage = error instanceof Error ? error.message : 'Internal API Error';

    return res.status(500).json({Message: errorMessage});
  }
};