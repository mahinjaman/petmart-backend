import { Router } from "express";
import { productRoutes } from "../models/product/product.routes";
import { mediaRoutes } from "../models/Media/media.routes";
const router = Router();
const routes = [
    {
        path: "/products",
        route: productRoutes
    },
    {
        path: "/media",
        route: mediaRoutes
    },

];

routes.forEach(route => {
    router.use(route.path, route.route)
});

export const rootRoute = router;