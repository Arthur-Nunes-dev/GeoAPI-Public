import express, { Router } from "express";
import { basicHaversineController } from "../controller/basicHaversineController";
import { geoHashControllerPost, geoHashControllerGet } from "../controller/geoHashController";
import { batchHarversineController } from "../controller/batchHaversineController";
import { validationsBasicHaversine } from "../middlewares/validateBasicHaversine";
import { validateGeoHashPost, validateGeoHashGet } from "../middlewares/validationsGeoHash";
import { validationBatchHarversine } from "../middlewares/validateBatchHaversine";

const router: Router = express.Router();

router.post(
  "/basicHarversine",
  validationsBasicHaversine,
  basicHaversineController
);

router.post(
  "/batchHarversine",
  validationBatchHarversine,
  batchHarversineController
);

router.post(
  "/geoHash",
  validateGeoHashPost,
  geoHashControllerPost
);

router.get(
  "/geoHash",
  validateGeoHashGet,
  geoHashControllerGet
);

export default router;