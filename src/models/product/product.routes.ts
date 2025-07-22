import { Router } from "express";
import { createProduct, getAllProduct } from "./product.controller";
import { requestDataValidation } from "../../middleware/requestDataValidation";
import { createProductValidationSchema } from "./product.validation";

const router = Router();

// product route 

router.get('/', getAllProduct);
router.post("/", requestDataValidation(createProductValidationSchema), createProduct)

export const productRoutes = router;