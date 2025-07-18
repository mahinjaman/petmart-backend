import app from "../app";
import { productRoutes } from "../models/product/product.routes";

const routes = [
    {
        path: "/product",
        route: productRoutes
    }
];

routes.forEach(route => {
    app.use(route.path, route.route)
})