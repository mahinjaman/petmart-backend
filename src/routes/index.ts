import { Router } from "express";
import { productRoutes } from "../models/product/product.routes";
const router = Router();
const routes = [
    {
        path: "/products",
        route: productRoutes
    }
];

routes.forEach(route => {
    router.use(route.path, route.route)
});

export const rootRoute = router;