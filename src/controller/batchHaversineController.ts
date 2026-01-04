import { Request, Response } from 'express';
import { batchHaversineService } from '../service/batchHaversineService';
import { ErrorServer } from '../utils/Errors';

export async function batchHarversineController (req: Request, res: Response) {
  const {data} = req.body;

  try {
    const results = await batchHaversineService({data});

    return res.status(200).json({ results });
  } catch (error) {
    if (error instanceof ErrorServer) {
      return res.status(error.code).json({ error: error.message });
    };
    
    const errorMessage = error instanceof Error ? error.message : 'Internal API Error';
    return res.status(500).json({ error: errorMessage });
  };
};