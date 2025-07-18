import { Router } from "express";
import { getAllProduct } from "./product.controller";

const router = Router();

// product route 

router.get('/', getAllProduct)

export const productRoutes = router;