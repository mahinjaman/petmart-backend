"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const requestDataValidation_1 = require("../../middleware/requestDataValidation");
const product_validation_1 = require("./product.validation");
const router = (0, express_1.Router)();
// product route 
router.get('/', product_controller_1.getAllProduct);
router.get('/product/:url', product_controller_1.getSpecificProductData);
router.patch('/:productId', (0, requestDataValidation_1.requestDataValidation)(product_validation_1.createProductValidationSchema), product_controller_1.updateProductData);
router.post("/", (0, requestDataValidation_1.requestDataValidation)(product_validation_1.createProductValidationSchema), product_controller_1.createProduct);
router.get('/featured', product_controller_1.getFeaturedProducts);
router.get('/ids', product_controller_1.getIdsProduct);
exports.productRoutes = router;
