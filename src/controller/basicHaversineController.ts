import { Request, Response } from "express";
import { basicHaversineService } from "../service/basicHaversineService";
import { ErrorServer } from "../utils/Errors";

export async function basicHaversineController (req: Request, res: Response) {

  try {
    const { data } = req.body;

    const response = await basicHaversineService({data});

    return res.status(200).json(response);
  } catch (error) {

    if (error instanceof ErrorServer) {
      return res.status(error.code).json({Message: error.message});
    };
    
    const errorMessage = error instanceof Error ? error.message : 'Internal API Erro';

    return res.status(500).json({Message: errorMessage});
  };
};