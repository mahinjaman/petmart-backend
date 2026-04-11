import { Router } from "express";
import { productRoutes } from "../models/product/product.routes";
<<<<<<< HEAD
import { mediaRoutes } from "../models/Media/media.routes";
=======
>>>>>>> 0a64625 (update product service)
const router = Router();
const routes = [
    {
        path: "/products",
        route: productRoutes
<<<<<<< HEAD
    },
    {
        path: "/media",
        route: mediaRoutes
    },

=======
    }
>>>>>>> 0a64625 (update product service)
];

routes.forEach(route => {
    router.use(route.path, route.route)
});

export const rootRoute = router;