"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GlobalErrorHandler_1 = require("./error/GlobalErrorHandler");
const notFound_1 = require("./error/notFound");
const routes_1 = require("./routes");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: ["http://localhost:8080", "http://localhost:8081", "https://petmartsonline.netlify.app"], credentials: true }));
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send({ message: "Alhamdulillah server is running" });
});
// all routes
app.use("/api/v1", routes_1.rootRoute);
// global error handler
app.use(GlobalErrorHandler_1.GlobalErrorHandler);
// not found handler
app.use(notFound_1.notFound);
app.use("/images", express_1.default.static(path_1.default.join(__dirname, "../src/images")));
app.use("/videos", express_1.default.static(path_1.default.join(__dirname, "../src/videos")));
exports.default = app;
