import { Router } from "express";
import { createProduct, getAllProduct, getSpecificProductData, updateProductData } from "./product.controller";
import { requestDataValidation } from "../../middleware/requestDataValidation";
import { createProductValidationSchema } from "./product.validation";

const router = Router();

// product route 

router.get('/', getAllProduct);
router.get('/:url', getSpecificProductData);
router.patch('/:productId', requestDataValidation(createProductValidationSchema), updateProductData);
router.post("/", requestDataValidation(createProductValidationSchema), createProduct);

export const productRoutes = router;