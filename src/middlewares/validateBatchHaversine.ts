import { Request, Response, NextFunction } from "express";
import { ErrorValidation } from "../utils/Errors";

export function validationBatchHarversine (req: Request, res: Response, next: NextFunction) {
  const {data} = req.body;

  try {
    if (!data) {
      throw new ErrorValidation('Missing data in request body');
    };

    if (data.length == 0) {
      throw new ErrorValidation('Data array must not be empty');
    };

    if (data.length > 25) {
      throw new ErrorValidation('Data array must not have more than 25 elements');
    };

    next();
  } catch (error) {
    const errorMessage = error instanceof ErrorValidation ? error.message : 'Internal API Error';

    if (error instanceof ErrorValidation) {
      return res.status(error.code).json({Message: errorMessage});
    };
  };
};