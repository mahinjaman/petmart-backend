import { Router } from "express";
import { createProduct, getAllProduct, getFeaturedProducts, getIdsProduct, getSpecificProductData, updateProductData } from "./product.controller";
import { requestDataValidation } from "../../middleware/requestDataValidation";
import { createProductValidationSchema } from "./product.validation";

const router = Router();

// product route 

router.get('/', getAllProduct);
router.get('/product/:url', getSpecificProductData);
router.patch('/:productId', requestDataValidation(createProductValidationSchema), updateProductData);
router.post("/", requestDataValidation(createProductValidationSchema), createProduct);
router.get('/featured', getFeaturedProducts);
router.get('/ids', getIdsProduct)

export const productRoutes = router;