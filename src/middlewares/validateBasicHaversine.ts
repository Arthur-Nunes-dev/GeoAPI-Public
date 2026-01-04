import { ErrorValidation } from "../utils/Errors";
import { Request, Response, NextFunction } from "express";

export function validationsBasicHaversine (req: Request, res: Response, next: NextFunction) {
  const {data} = req.body;

  try {
    if (!data) {
      throw new ErrorValidation("Missing data in request body");
    };

    if (!data.from || !data.to) {
      throw new ErrorValidation("Missing from or to in data");
    };

    const {from, to} = data;

    if (
      typeof from.lat != 'number' ||
      typeof from.lon != 'number' ||
      typeof to.lat != 'number' ||
      typeof to.lon != 'number'
    ) {
      throw new ErrorValidation("Coordinates must be numbers");
    };

    if (
      !Number.isFinite(from.lat) ||
      !Number.isFinite(from.lon) ||
      !Number.isFinite(to.lat) ||
      !Number.isFinite(to.lon)
    ) {
      throw new ErrorValidation("Coordinates must be valid numbers");
    };

    if (
      from.lat < -90 || from.lat > 90 ||
      from.lon < -180 || from.lon > 180 ||
      to.lat < -90 || to.lat > 90 ||
      to.lon < -180 || to.lon > 180
    ) {
      throw new ErrorValidation("Coordinates must be between -90 and 90 for lat and -180 and 180 for lon");
    };
    
    next();
  } catch (error) {
    const errorMessage = error instanceof ErrorValidation ? error.message : 'Internal API Error';

    if (error instanceof ErrorValidation) {
      return res.status(error.code).json({Message: errorMessage});
    };
  };
};