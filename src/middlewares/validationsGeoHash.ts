import { Request, Response, NextFunction } from "express";
import { ErrorValidation  } from "../utils/Errors";

export function validateGeoHashPost (req: Request, res: Response, next: NextFunction) {
  const {data} = req.body;
  
  try {
    if (!data) {
      throw new ErrorValidation("Pless passe the paramters lat, lon and name");
    };

    if (
      typeof data.lat != 'number' ||
      typeof data.lon != 'number' 
    ) {
      throw new ErrorValidation("Latitude and longitude must be numbers");
    };

    if (
      data.lat < -90 || data.lat > 90 ||
      data.lon < -180 || data.lon > 180
    ) {
      throw new ErrorValidation("Latitude and longitude must be between -90 and 90, and -180 and 180 respectively");
    };

    if (typeof data.name != 'string') {
      throw new ErrorValidation("Name must be a string");
    };

    next();
  } catch (error) {
    const errorMessage = error instanceof ErrorValidation ? error.message : 'Internal API Error';

    if (error instanceof ErrorValidation) {
      return res.status(error.code).json({Message: errorMessage});
    };
  };
};

export function validateGeoHashGet (req: Request, res: Response, next: NextFunction) {
  const {lat, lon, radius} = req.query;

  try {
    if (!lat || !lon || !radius) {
      throw new ErrorValidation("Pless passe the paramters lat, lon and radius");
    };

    const latNumber = Number(lat);
    const lonNumber = Number(lon);
    const radiusNumber = Number(radius);

    if (
      latNumber < -90 || latNumber > 90 ||
      lonNumber < -180 || lonNumber > 180
    ) {
      throw new ErrorValidation("Latitude and longitude must be between -90 and 90, and -180 and 180 respectively");
    };

    if (radiusNumber <= 0) {
      throw new ErrorValidation("Radius must be greater than 0");
    };

    next();
  } catch (error) {
    const errorMessage = error instanceof ErrorValidation ? error.message : 'Internal API Error';

    if (error instanceof ErrorValidation) {
      return res.status(error.code).json({Message: errorMessage});
    };
  };
};