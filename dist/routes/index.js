"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootRoute = void 0;
const express_1 = require("express");
const product_routes_1 = require("../models/product/product.routes");
const router = (0, express_1.Router)();
const routes = [
    {
        path: "/products",
        route: product_routes_1.productRoutes
    }
];
routes.forEach(route => {
    router.use(route.path, route.route);
});
exports.rootRoute = router;
